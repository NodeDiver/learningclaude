#!/usr/bin/env node
/**
 * usage_snapshot.js - Procesa el JSONL de Claude Code y genera reporte de uso
 *
 * Input: JSON via stdin con transcript_path
 * Output: JSON file con métricas de tokens/costos
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// Pricing por modelo (USD per 1M tokens)
const PRICING = {
  'claude-sonnet-4-5-20250929': { in: 3.0, out: 15.0 },
  'claude-sonnet-3-5-20241022': { in: 3.0, out: 15.0 },
  'claude-opus-3-5-20240229': { in: 15.0, out: 75.0 },
  'claude-haiku-3-5-20241022': { in: 0.8, out: 4.0 }
};

function parseStdin() {
  try {
    const input = fs.readFileSync(0, 'utf-8');
    return JSON.parse(input);
  } catch (err) {
    console.error('Error parseando stdin:', err.message);
    process.exit(1);
  }
}

function expandTildePath(filePath) {
  if (filePath.startsWith('~/')) {
    return path.join(os.homedir(), filePath.slice(2));
  }
  return filePath;
}

function processTranscript(transcriptPath) {
  const fullPath = expandTildePath(transcriptPath);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Transcript no encontrado: ${fullPath}`);
  }

  const lines = fs.readFileSync(fullPath, 'utf-8').split('\n').filter(Boolean);

  let inputTokens = 0;
  let outputTokens = 0;
  let cacheReadTokens = 0;
  let cacheCreationTokens = 0;
  let messageCount = 0;
  let firstUserPrompt = '';
  let detectedModel = '';
  let repo = '';
  let branch = '';
  let timestamps = [];

  lines.forEach(line => {
    try {
      const entry = JSON.parse(line);

      // Capturar metadata
      if (entry.cwd && !repo) repo = entry.cwd;
      if (entry.gitBranch && !branch) branch = entry.gitBranch;
      if (entry.timestamp) timestamps.push(entry.timestamp);

      // Detectar modelo (buscar en varios campos posibles)
      if (!detectedModel) {
        if (entry.model) detectedModel = entry.model;
        else if (entry.message?.model) detectedModel = entry.message.model;
      }

      // Sumar tokens de uso
      if (entry.message?.usage) {
        const usage = entry.message.usage;
        inputTokens += usage.input_tokens || 0;
        outputTokens += usage.output_tokens || 0;
        cacheReadTokens += usage.cache_read_input_tokens || 0;
        cacheCreationTokens += usage.cache_creation_input_tokens || 0;
        messageCount++;
      }

      // Capturar primer prompt del usuario como resumen
      if (!firstUserPrompt && entry.message?.role === 'user') {
        const content = entry.message.content;
        if (Array.isArray(content) && content[0]?.text) {
          firstUserPrompt = content[0].text;
        } else if (typeof content === 'string') {
          firstUserPrompt = content;
        }
      }
    } catch (err) {
      // Línea inválida, ignorar
    }
  });

  // Generar resumen (≤140 chars)
  let summary = 'Session sin descripción';
  if (firstUserPrompt) {
    // Tomar primera línea/frase
    const firstLine = firstUserPrompt.split('\n')[0].trim();
    summary = firstLine.length > 140 ? firstLine.slice(0, 137) + '...' : firstLine;
  }

  // Calcular costo (fallback a sonnet 4.5 si no detectamos modelo)
  const modelKey = detectedModel || 'claude-sonnet-4-5-20250929';
  const pricing = PRICING[modelKey] || PRICING['claude-sonnet-4-5-20250929'];
  const costUsd = (inputTokens / 1_000_000) * pricing.in + (outputTokens / 1_000_000) * pricing.out;

  // Timestamp de cierre (último mensaje o ahora)
  const closedAt = timestamps.length > 0
    ? timestamps[timestamps.length - 1]
    : new Date().toISOString();

  return {
    summary,
    repo,
    branch,
    model: modelKey,
    closedAt,
    stats: {
      message_count: messageCount,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      cache_read_tokens: cacheReadTokens,
      cache_creation_tokens: cacheCreationTokens,
      cost_usd: parseFloat(costUsd.toFixed(4))
    }
  };
}

function saveUsageSnapshot(outputDir, sessionData) {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const outputPath = path.join(outputDir, `${today}.json`);

  // Leer archivo existente si hay (para acumular sesiones del mismo día)
  let dailyData = {
    date: today,
    sessions: []
  };

  if (fs.existsSync(outputPath)) {
    try {
      dailyData = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
    } catch (err) {
      console.warn('⚠️  Error leyendo archivo existente, creando nuevo');
    }
  }

  // Agregar sesión actual
  dailyData.sessions.push(sessionData);

  // Calcular totales
  const totals = dailyData.sessions.reduce((acc, s) => ({
    message_count: acc.message_count + (s.stats.message_count || 0),
    input_tokens: acc.input_tokens + (s.stats.input_tokens || 0),
    output_tokens: acc.output_tokens + (s.stats.output_tokens || 0),
    cache_read_tokens: acc.cache_read_tokens + (s.stats.cache_read_tokens || 0),
    cost_usd: acc.cost_usd + (s.stats.cost_usd || 0)
  }), {
    message_count: 0,
    input_tokens: 0,
    output_tokens: 0,
    cache_read_tokens: 0,
    cost_usd: 0
  });

  totals.cost_usd = parseFloat(totals.cost_usd.toFixed(4));
  dailyData.totals = totals;

  // Guardar
  fs.writeFileSync(outputPath, JSON.stringify(dailyData, null, 2));

  console.log(`\n📊 Métricas guardadas:`);
  console.log(`   Archivo: ${outputPath}`);
  console.log(`   Tokens input: ${sessionData.stats.input_tokens.toLocaleString()}`);
  console.log(`   Tokens output: ${sessionData.stats.output_tokens.toLocaleString()}`);
  console.log(`   Costo: $${sessionData.stats.cost_usd}`);
  console.log(`   Resumen: ${sessionData.summary}`);
}

// Main
try {
  const hookInput = parseStdin();
  const outputDir = process.argv[2] || path.join(os.homedir(), '.local/share/sessionend-usage');

  if (!hookInput.transcript_path) {
    throw new Error('No se recibió transcript_path en el input del hook');
  }

  const sessionData = processTranscript(hookInput.transcript_path);
  saveUsageSnapshot(outputDir, sessionData);

  process.exit(0);
} catch (err) {
  console.error('❌ Error:', err.message);
  process.exit(1);
}

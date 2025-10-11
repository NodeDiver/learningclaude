#!/usr/bin/env node
/**
 * export_conversation.js - Convierte JSONL de Claude Code a texto plano legible
 *
 * Input: JSON via stdin con transcript_path
 * Output: Archivo .txt en formato markdown simple
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

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

function extractTextFromContent(content) {
  if (typeof content === 'string') {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map(block => {
        if (block.type === 'text') {
          return block.text;
        } else if (block.type === 'tool_use') {
          return `[Tool: ${block.name}]\nInput: ${JSON.stringify(block.input, null, 2)}`;
        } else if (block.type === 'tool_result') {
          const result = block.content || block.result || '';
          return `[Tool Result]\n${result}`;
        }
        return '';
      })
      .filter(Boolean)
      .join('\n\n');
  }

  return '';
}

function processTranscript(transcriptPath) {
  const fullPath = expandTildePath(transcriptPath);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Transcript no encontrado: ${fullPath}`);
  }

  const lines = fs.readFileSync(fullPath, 'utf-8').split('\n').filter(Boolean);
  const messages = [];
  let sessionInfo = {};

  lines.forEach(line => {
    try {
      const entry = JSON.parse(line);

      // Capturar metadata de sesión
      if (entry.sessionId && !sessionInfo.sessionId) {
        sessionInfo = {
          sessionId: entry.sessionId,
          cwd: entry.cwd || '',
          branch: entry.gitBranch || '',
          timestamp: entry.timestamp || ''
        };
      }

      // Extraer mensajes
      if (entry.message) {
        const msg = entry.message;
        const role = msg.role === 'user' ? 'Usuario' : 'Claude';
        const content = extractTextFromContent(msg.content);

        if (content.trim()) {
          messages.push({
            role,
            content,
            timestamp: entry.timestamp || ''
          });
        }
      }
    } catch (err) {
      // Línea inválida, ignorar
    }
  });

  return { sessionInfo, messages };
}

function formatAsMarkdown(sessionInfo, messages) {
  const lines = [];

  // Header
  lines.push('='.repeat(80));
  lines.push('Conversación con Claude Code');
  lines.push('='.repeat(80));
  lines.push('');

  if (sessionInfo.timestamp) {
    lines.push(`📅 Fecha: ${new Date(sessionInfo.timestamp).toLocaleString()}`);
  }
  if (sessionInfo.cwd) {
    lines.push(`📁 Directorio: ${sessionInfo.cwd}`);
  }
  if (sessionInfo.branch) {
    lines.push(`🌿 Branch: ${sessionInfo.branch}`);
  }
  if (sessionInfo.sessionId) {
    lines.push(`🆔 Session ID: ${sessionInfo.sessionId}`);
  }

  lines.push('');
  lines.push('='.repeat(80));
  lines.push('');

  // Messages
  messages.forEach((msg, idx) => {
    lines.push(`### [${idx + 1}] ${msg.role}`);
    if (msg.timestamp) {
      lines.push(`*${new Date(msg.timestamp).toLocaleTimeString()}*`);
    }
    lines.push('');
    lines.push(msg.content);
    lines.push('');
    lines.push('-'.repeat(80));
    lines.push('');
  });

  // Footer
  lines.push('='.repeat(80));
  lines.push(`Total de mensajes: ${messages.length}`);
  lines.push('='.repeat(80));

  return lines.join('\n');
}

function saveConversation(outputDir, content) {
  const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0]; // YYYY-MM-DDTHH-MM-SS
  const filename = `chat-${timestamp}.txt`;
  const outputPath = path.join(outputDir, filename);

  fs.writeFileSync(outputPath, content, 'utf-8');

  console.log(`\n💾 Conversación exportada:`);
  console.log(`   Archivo: ${outputPath}`);
  console.log(`   Tamaño: ${(content.length / 1024).toFixed(1)} KB`);
}

// Main
try {
  const hookInput = parseStdin();
  const outputDir = process.argv[2] || './previousclaudechat';

  if (!hookInput.transcript_path) {
    throw new Error('No se recibió transcript_path en el input del hook');
  }

  const { sessionInfo, messages } = processTranscript(hookInput.transcript_path);

  if (messages.length === 0) {
    console.log('⚠️  No se encontraron mensajes en la conversación');
    process.exit(0);
  }

  const markdown = formatAsMarkdown(sessionInfo, messages);
  saveConversation(outputDir, markdown);

  process.exit(0);
} catch (err) {
  console.error('❌ Error:', err.message);
  process.exit(1);
}

# Subcapítulo 9.G: MCP de Alby - Bitcoin Lightning Wallet

**Duración**: 50 minutos
**Dificultad**: Avanzado
**Prerrequisito**: Capítulo 9 (MCP Básico) + Conocimiento básico de Bitcoin

---

## 🎯 Objetivos de Aprendizaje

Al final de este subcapítulo, podrás:
- Entender qué es Alby y el Lightning Network
- Configurar el MCP de Alby con Nostr Wallet Connect (NWC)
- Enviar y recibir pagos Bitcoin Lightning
- Crear invoices y pagos programáticos
- Integrar Bitcoin payments en tu aplicación
- Usar LNURL para pagos simplificados
- Implementar L402 (HTTP 402 Payment Required)
- Automatizar workflows con micropagos

---

## 📖 Lección 9.G.1: ¿Qué es Alby y Lightning Network?

**Alby** es una wallet de Bitcoin Lightning Network que permite pagos instantáneos y de bajo costo. El **MCP de Alby** conecta Claude Code con tu wallet, permitiéndote gestionar pagos usando lenguaje natural.

### Concepto Fundamental

**Lightning Network** es una capa 2 de Bitcoin que permite:
- Pagos instantáneos (< 1 segundo)
- Fees bajísimos (< 1 satoshi)
- Micropagos (desde 1 satoshi = $0.0003)
- Escalabilidad (millones de tx/s)

Piensa en el MCP de Alby como un **payment processor automático**:

**Sin MCP de Alby:**
```
Tú ←→ Claude Code
       ↓ (manualmente)
   Alby Extension/App ←→ Lightning Network
   (clicks manuales para cada pago)
```

**Con MCP de Alby:**
```
Tú ←→ Claude Code ←→ MCP Alby ←→ Lightning Network
     ("envía 1000 sats a juan@getalby.com" → pago automático)
```

### ¿Qué Puede Hacer?

El MCP de Alby proporciona **herramientas poderosas** para:

✅ **Envío de Pagos**
- Enviar satoshis a Lightning addresses
- Pagar invoices (BOLT11)
- Enviar a LNURL-pay
- Pagos keysend (sin invoice)

✅ **Recepción de Pagos**
- Crear invoices Lightning
- Generar LNURL-withdraw
- Recibir a Lightning address
- Webhook notifications

✅ **Gestión de Wallet**
- Consultar balance
- Ver historial de transacciones
- Analizar ingresos/gastos
- Export de datos

✅ **LNURL Avanzado**
- LNURL-pay (pagos sin invoice)
- LNURL-withdraw (retirar fondos)
- LNURL-auth (autenticación)
- LNURL-channel (abrir canales)

✅ **L402 (Paywall HTTP)**
- Protect API endpoints
- Micropagos por request
- Pay-per-use APIs
- Monetización automática

✅ **Nostr Integration**
- Nostr Wallet Connect (NWC)
- Zaps en Nostr
- Pagos descentralizados
- Key management

### Ventajas Clave

| Sin MCP Alby | Con MCP Alby |
|--------------|--------------|
| Clicks manuales por pago | Pagos automáticos |
| Copy/paste invoices | Generar con lenguaje natural |
| Tracking manual | Analytics automático |
| Integración compleja | API simple desde Claude |
| **Manual y lento** | **Automático y rápido** ⚡ |

### Casos de Uso

1. **Monetización de APIs**: Cobra por cada llamada a tu API
2. **Content Paywalls**: Cobra por acceso a contenido
3. **Micropagos**: Tips, donaciones, pay-per-use
4. **Automatización**: Pagos programáticos en workflows
5. **Splits**: Distribuir pagos entre múltiples wallets

---

## 📖 Lección 9.G.2: Instalación y Configuración

### Paso 1: Crear Cuenta en Alby

**1. Registro:**
```
1. Ir a https://getalby.com
2. Click "Sign Up"
3. Crear cuenta con email o Nostr
4. Verificar email
```

**2. Configurar Wallet:**
```
Opciones:
a) Alby Hosted Wallet (más fácil, recomendado)
   - Alby gestiona nodos Lightning
   - Instant setup
   - Sin configuración técnica

b) Conectar tu propio nodo
   - LND, Core Lightning, Eclair
   - Mayor control
   - Requiere nodo Lightning propio
```

**3. Depositar fondos:**
```
1. Dashboard → Receive
2. Copiar Bitcoin address o Lightning invoice
3. Enviar desde exchange o wallet
4. Esperar confirmación (on-chain) o instantáneo (Lightning)
```

### Paso 2: Obtener Nostr Wallet Connect (NWC)

**Nostr Wallet Connect** es el protocolo para conectar wallets de forma segura.

```
1. Alby Dashboard → Settings
2. Nostr Wallet Connect (NWC)
3. Click "Create Connection"
4. Name: "Claude Code MCP"
5. Permisos:
   ✓ Get Balance
   ✓ Get Info
   ✓ List Transactions
   ✓ Make Invoice
   ✓ Pay Invoice (configurar límites)
   ✓ Lookup Invoice
6. Budget limits (recomendado):
   - Max amount per payment: 10,000 sats
   - Max daily total: 50,000 sats
7. Click "Create"
8. Copiar connection string:
   nostr+walletconnect://69effe7...
```

### Paso 3: Instalar el Servidor MCP

```bash
# Instalar el MCP de Alby
npm install -g @modelcontextprotocol/server-alby

# O usando Claude Code CLI
claude mcp add --transport stdio \
  --name alby \
  --command "npx" \
  --args "-y @modelcontextprotocol/server-alby"
```

### Paso 4: Configuración

**Archivo: `.claude/mcp.json`**
```json
{
  "servers": {
    "alby": {
      "transport": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-alby"
      ],
      "env": {
        "ALBY_NWC_URI": "nostr+walletconnect://69effe7b3c95ff11..."
      }
    }
  }
}
```

**Con variables de entorno (recomendado):**

**Archivo: `.env`**
```bash
ALBY_NWC_URI=nostr+walletconnect://69effe7b3c95ff11a0e6e5e8...
```

**Actualiza `mcp.json`:**
```json
{
  "servers": {
    "alby": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-alby"],
      "env": {
        "ALBY_NWC_URI": "${ALBY_NWC_URI}"
      }
    }
  }
}
```

### Verificar Instalación

```bash
# Listar servidores MCP
claude mcp list

# Salida esperada:
# alby (stdio) - @modelcontextprotocol/server-alby [connected ✓]
```

### Probar Conexión

```
Tú: ¿Puedes conectarte a mi wallet de Alby?

Claude: [usa alby_get_info]
✓ Conexión exitosa a Alby Wallet

Wallet Info:
Alias: Mi Wallet Alby
Lightning Address: miusuario@getalby.com
Balance: 125,000 sats (~$37.50 USD)
Network: Lightning Network (Bitcoin)

Capabilities:
✓ Send payments
✓ Receive payments
✓ Create invoices
✓ LNURL support
✓ Keysend enabled

Límites configurados:
Max per payment: 10,000 sats
Daily budget: 50,000 sats
Remaining today: 50,000 sats
```

---

## 📖 Lección 9.G.3: Envío de Pagos

### Herramienta: alby_pay_invoice

Paga un invoice Lightning o Lightning address.

**Ejemplo 1: Pagar a Lightning Address**
```
Tú: Envía 1000 sats a pablo@getalby.com como propina

Claude: [usa alby_pay_invoice]

Procesando pago...

[Detalles del pago]
Destinatario: pablo@getalby.com
Monto: 1,000 sats (~$0.30 USD)
Memo: "Propina de Claude Code"

[Resolviendo Lightning address]
✓ Lightning address válido
✓ Invoice generado automáticamente
✓ Destination: Node 03abc...

[Verificando]
✓ Balance suficiente (125,000 sats disponibles)
✓ Dentro de límite (10,000 sats max)
✓ Route encontrado

[Enviando pago]
▸ Buscando ruta óptima...
✓ Ruta encontrada (3 hops)
✓ Estimated fee: 1 sat

▸ Ejecutando pago...
✓ Pago completado

✅ Pago exitoso!

Detalles:
Amount: 1,000 sats
Fee: 1 sat (0.1%)
Total: 1,001 sats
Time: 0.8 segundos
Payment Hash: abc123...

Nuevo balance: 123,999 sats

Recibo guardado en transaction history.
```

### Ejemplo 2: Pagar Invoice BOLT11

```
Tú: Paga este invoice:

lnbc10n1pjq8z9zpp5qyk3h2vzlckxpvwvmhgvn6tqh5h4mtzqwhm...

Claude: [decodifica y paga invoice]

Decodificando invoice...

[Invoice Details]
Amount: 1,000 sats (~$0.30 USD)
Payee: Tienda Bitcoin
Description: "Café Latte"
Expiry: 15 minutos
Created: Hace 2 minutos

[Verificando]
✓ Invoice válido
✓ No expirado
✓ Balance suficiente
✓ Dentro de límite diario

¿Confirmas el pago de 1,000 sats a Tienda Bitcoin?

[Usuario confirma]

[Ejecutando pago]
✓ Pago completado en 0.5 segundos
✓ Fee: 2 sats

✅ Café pagado!

Payment preimage: def456... (prueba de pago)
```

### Ejemplo 3: Keysend (Pago sin Invoice)

```
Tú: Envía 5000 sats directamente al nodo 03a1b2c3...

Claude: [usa keysend]

Keysend payment...

[Destination]
Node: 03a1b2c3d4e5f6...
Alias: LightningStore Node
Capacity: 50 BTC

[Generating payment]
Amount: 5,000 sats
Generating preimage...
✓ Preimage: xyz789...

[Routing]
✓ Route found (2 hops)
Estimated fee: 3 sats

[Sending]
✓ Payment successful

Keysend único:
• No invoice necesario
• Pago espontáneo
• Preimage aleatorio
• Útil para tips/donaciones

Total: 5,003 sats (5000 + 3 fee)
```

---

## 📖 Lección 9.G.4: Recepción de Pagos

### Crear Invoice

**Herramienta: alby_create_invoice**

```
Tú: Crea un invoice por 25,000 sats para vender un ebook

Claude: [usa alby_create_invoice]

Creando invoice Lightning...

[Invoice Details]
Amount: 25,000 sats (~$7.50 USD)
Description: "Ebook: Guía de Lightning Network"
Expiry: 1 hora

[Generando invoice]
✓ Payment hash: abc123...
✓ Invoice string: lnbc250n1pjq...

✅ Invoice creado

Payment Request (BOLT11):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
lnbc250n1pjq8z9zpp5qyk3h2vzlckxpvwvmhgvn6tq
h5h4mtzqwhm8f6kj6yxlqnzkqcqzpgxqyz5vqsp5v
rjqv4xym6n9lj3mw8ylqfvlv5w2cjk...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

QR Code: [generado automáticamente]

Lightning Address alternativa:
miusuario@getalby.com
(cualquier monto)

Compartir invoice:
• Copiar string arriba
• Mostrar QR code
• Share Lightning address

Monitoring:
Notificaré cuando el pago sea recibido ⚡

Invoice expires en: 59 minutos
```

### Webhook para Notificaciones

```
Tú: Configura webhook para notificarme cuando reciba pagos

Claude: [configura webhook]

Configurando payment notifications...

[Webhook Setup]
Endpoint: https://mi-api.com/webhooks/lightning-payment
Events:
✓ payment.received
✓ payment.sent
✓ invoice.paid
✓ invoice.expired

[Testing webhook]
Sending test event...
✓ Webhook respondió 200 OK

[Example payload]

```json
{
  "event": "payment.received",
  "timestamp": "2025-10-18T10:30:00Z",
  "data": {
    "amount": 25000,
    "currency": "SAT",
    "description": "Ebook: Guía de Lightning Network",
    "payment_hash": "abc123...",
    "preimage": "def456...",
    "settled": true,
    "memo": "Thanks for the ebook!",
    "payer": {
      "lightning_address": "buyer@getalby.com"
    }
  }
}
```

[Handler example]

```javascript
// webhook-handler.js
app.post('/webhooks/lightning-payment', async (req, res) => {
  const { event, data } = req.body;

  if (event === 'payment.received') {
    const { amount, payment_hash, memo } = data;

    console.log(`Received ${amount} sats!`);

    // Cumplir orden
    if (amount === 25000) {
      await sendEbookToCustomer(payment_hash);
    }

    // Notificar a Slack
    await notifySlack(`💰 Recibido: ${amount} sats - ${memo}`);
  }

  res.sendStatus(200);
});
```

✅ Webhooks configurados

Ahora recibirás notificaciones automáticas de todos los pagos.
```

---

## 📖 Lección 9.G.5: LNURL - Pagos Simplificados

### LNURL-Pay

**LNURL-pay** permite pagos sin generar invoices manualmente.

```
Tú: Crea un endpoint LNURL-pay para donaciones

Claude: [genera LNURL-pay endpoint]

Creando LNURL-pay endpoint...

[Endpoint Configuration]
URL: https://mi-api.com/.well-known/lnurlp/donaciones
Min amount: 1,000 sats
Max amount: 1,000,000 sats
Comment allowed: Yes (280 chars)

[Implementation]

```javascript
// lnurl-pay-endpoint.js
const express = require('express');
const app = express();

// Step 1: LNURL metadata
app.get('/.well-known/lnurlp/donaciones', (req, res) => {
  res.json({
    tag: 'payRequest',
    callback: 'https://mi-api.com/lnurl/donaciones/invoice',
    minSendable: 1000000, // 1,000 sats (in millisats)
    maxSendable: 1000000000, // 1,000,000 sats
    metadata: JSON.stringify([
      ['text/plain', 'Donación para el proyecto'],
      ['image/png;base64', 'iVBORw0KGgoAAAANS...'] // Logo
    ]),
    commentAllowed: 280
  });
});

// Step 2: Generate invoice on demand
app.get('/lnurl/donaciones/invoice', async (req, res) => {
  const amount = parseInt(req.query.amount) / 1000; // Convert to sats
  const comment = req.query.comment || '';

  // Validar
  if (amount < 1000 || amount > 1000000) {
    return res.json({ status: 'ERROR', reason: 'Amount out of range' });
  }

  // Crear invoice con Alby
  const invoice = await alby.createInvoice({
    amount,
    memo: `Donación: ${comment}`,
  });

  res.json({
    pr: invoice.payment_request, // BOLT11 invoice
    routes: [],
    successAction: {
      tag: 'message',
      message: '¡Gracias por tu donación! 🙏'
    }
  });
});
```

[LNURL String]
Encoded: LNURL1DP68GURN8GHJ7MRWW4EXCTNZD9NHXATW9EU8J730D3H82UNV...

[QR Code]
Generado para fácil escaneo

[Usage]
1. Usuario escanea QR LNURL
2. Wallet pregunta cuánto enviar (1k-1M sats)
3. Usuario ingresa monto y comentario opcional
4. Wallet obtiene invoice automáticamente
5. Usuario confirma pago
6. ✅ Pago completado

Benefits:
✓ Un solo QR para cualquier monto
✓ No pre-generar invoices
✓ Comentarios personalizados
✓ Success messages

LNURL-pay listo 🎉
```

### LNURL-Withdraw

**LNURL-withdraw** permite a usuarios retirar fondos fácilmente.

```
Tú: Crea LNURL-withdraw para cashback de 5000 sats

Claude: [genera LNURL-withdraw]

```javascript
// lnurl-withdraw.js
app.get('/lnurl/withdraw/:code', async (req, res) => {
  const { code } = req.params;

  // Verificar código válido
  const voucher = await db.vouchers.findOne({ code, used: false });

  if (!voucher) {
    return res.json({ status: 'ERROR', reason: 'Invalid code' });
  }

  res.json({
    tag: 'withdrawRequest',
    callback: 'https://mi-api.com/lnurl/withdraw/claim',
    k1: voucher.id, // Identificador único
    minWithdrawable: voucher.amount * 1000, // millisats
    maxWithdrawable: voucher.amount * 1000,
    defaultDescription: `Cashback: ${voucher.amount} sats`
  });
});

// Claim endpoint
app.get('/lnurl/withdraw/claim', async (req, res) => {
  const { k1, pr } = req.query; // k1 = voucher id, pr = user's invoice

  const voucher = await db.vouchers.findById(k1);

  if (voucher.used) {
    return res.json({ status: 'ERROR', reason: 'Already claimed' });
  }

  // Pagar invoice del usuario
  try {
    await alby.payInvoice(pr);

    // Marcar como usado
    voucher.used = true;
    voucher.claimedAt = new Date();
    await voucher.save();

    res.json({ status: 'OK' });
  } catch (error) {
    res.json({ status: 'ERROR', reason: error.message });
  }
});
```

[Generar voucher]

```javascript
const voucher = await db.vouchers.create({
  code: 'CASHBACK5K',
  amount: 5000,
  used: false
});

const lnurl = encodeLNURL(
  `https://mi-api.com/lnurl/withdraw/${voucher.code}`
);

console.log('LNURL:', lnurl);
// LNURL1DP68GURN8GHJ7MRWW4EXCTNZD9NHXATW9EU8J730D3H82...
```

[Usage]
1. Usuario escanea LNURL QR
2. Wallet muestra: "Retirar 5,000 sats"
3. Usuario confirma
4. Wallet genera invoice automáticamente
5. Server paga invoice
6. ✅ Usuario recibe sats

Use cases:
• Cashback programs
• Rewards/incentivos
• Refunds
• Gift cards

LNURL-withdraw implementado 💸
```

---

## 📖 Lección 9.G.6: L402 - HTTP Paywalls

**L402** (antes LSAT) = Lightning Service Authentication Token

Permite monetizar APIs con micropagos automáticos.

### Implementar L402

```
Tú: Protege mi API con L402 - cobra 100 sats por request

Claude: [implementa L402 middleware]

```javascript
// l402-middleware.js
const crypto = require('crypto');
const alby = require('./alby-client');

const L402_PRICE = 100; // sats per request
const challenges = new Map(); // Store challenges

// L402 Middleware
async function l402Middleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // Check if client has L402 token
  if (authHeader && authHeader.startsWith('L402 ')) {
    const [macaroon, preimage] = authHeader.slice(5).split(':');

    // Verify token
    const isValid = await verifyL402Token(macaroon, preimage);

    if (isValid) {
      return next(); // Access granted
    }
  }

  // No valid token - issue 402 Payment Required
  const challenge = crypto.randomBytes(32).toString('hex');
  const invoice = await alby.createInvoice({
    amount: L402_PRICE,
    memo: `API Access - ${req.path}`,
    descriptionHash: challenge
  });

  // Store challenge
  challenges.set(invoice.payment_hash, {
    challenge,
    createdAt: Date.now()
  });

  // Create macaroon (simplified - use real macaroon lib in production)
  const macaroon = Buffer.from(JSON.stringify({
    identifier: invoice.payment_hash,
    challenge
  })).toString('base64');

  // Return 402 with payment info
  res.status(402)
    .set('WWW-Authenticate', `L402 macaroon="${macaroon}", invoice="${invoice.payment_request}"`)
    .json({
      error: 'Payment Required',
      message: `Please pay ${L402_PRICE} sats to access this endpoint`,
      amount: L402_PRICE,
      currency: 'SAT',
      invoice: invoice.payment_request
    });
}

async function verifyL402Token(macaroon, preimage) {
  try {
    const data = JSON.parse(Buffer.from(macaroon, 'base64').toString());
    const challenge = challenges.get(data.identifier);

    if (!challenge) return false;

    // Verify payment
    const payment = await alby.lookupInvoice(data.identifier);

    if (!payment.settled) return false;

    // Verify preimage matches
    const hash = crypto.createHash('sha256')
      .update(Buffer.from(preimage, 'hex'))
      .digest('hex');

    return hash === data.identifier;
  } catch (error) {
    return false;
  }
}

// Protect endpoint
app.get('/api/premium-data', l402Middleware, (req, res) => {
  res.json({
    data: 'This is premium data worth 100 sats!'
  });
});
```

[Client Implementation]

```javascript
// l402-client.js
async function callL402API(url) {
  // First request - will get 402
  let response = await fetch(url);

  if (response.status === 402) {
    const wwwAuth = response.headers.get('WWW-Authenticate');
    const { macaroon, invoice } = parseL402Header(wwwAuth);

    // Pay invoice
    console.log('Payment required:', invoice);
    const payment = await payInvoice(invoice);

    // Retry with L402 token
    response = await fetch(url, {
      headers: {
        'Authorization': `L402 ${macaroon}:${payment.preimage}`
      }
    });
  }

  return response.json();
}

// Usage
const data = await callL402API('https://api.example.com/api/premium-data');
console.log(data);
```

[Testing]

Request 1 (sin pago):
```bash
curl https://api.example.com/api/premium-data

HTTP/1.1 402 Payment Required
WWW-Authenticate: L402 macaroon="eyJpZGVudGlmaWVyIjoiYWJjMTIzIi...", invoice="lnbc1000n1..."
```

Pay invoice → Get preimage

Request 2 (con pago):
```bash
curl https://api.example.com/api/premium-data \
  -H "Authorization: L402 eyJpZGVudGlmaWVyIjoiYWJjMTIzIi...:def456..."

HTTP/1.1 200 OK
{"data": "This is premium data worth 100 sats!"}
```

✅ L402 implementado

Benefits:
✓ Micropagos por request
✓ No subscriptions
✓ Pay-as-you-go
✓ Privacy (no cuentas)
✓ Instant access

Use cases:
• AI API calls
• Data feeds
• Content access
• Compute resources
```

---

## 📖 Lección 9.G.7: Analytics y Gestión

### Ver Balance y Transacciones

```
Tú: Muéstrame el resumen de mi wallet

Claude: [usa alby_get_balance y alby_get_transactions]

📊 ALBY WALLET DASHBOARD

*Balance Actual:*
Total: 158,342 sats (~$47.50 USD)
  Disponible: 158,342 sats
  Pendiente: 0 sats

*Últimas 24 horas:*
Recibido: +35,000 sats (8 pagos)
Enviado: -12,500 sats (5 pagos)
Net: +22,500 sats ✅

*Últimas Transacciones:*

┌────────────────┬──────────┬────────┬──────────────────┐
│ Fecha          │ Tipo     │ Monto  │ Descripción      │
├────────────────┼──────────┼────────┼──────────────────┤
│ Hoy 10:15      │ IN       │ +1,000 │ Tip from Juan    │
│ Hoy 09:45      │ OUT      │ -2,000 │ Café Latte       │
│ Ayer 22:30     │ IN       │ +25,000│ Ebook sale       │
│ Ayer 18:20     │ OUT      │ -5,000 │ API credits      │
│ Ayer 15:10     │ IN       │ +3,500 │ Donation         │
└────────────────┴──────────┴────────┴──────────────────┘

*Stats - Últimos 30 días:*
Total recibido: 156,780 sats
Total enviado: 78,340 sats
Net: +78,440 sats 📈
Transacciones: 87
Promedio por tx: 2,695 sats

*Top Categorías (Gastos):*
1. Food & Drinks: 15,600 sats (20%)
2. Services: 28,400 sats (36%)
3. Content: 12,300 sats (16%)
4. Tips: 8,900 sats (11%)
5. Otros: 13,140 sats (17%)

*Top Categorías (Ingresos):*
1. Ebook sales: 75,000 sats (48%)
2. Donations: 34,500 sats (22%)
3. API usage: 28,900 sats (18%)
4. Tips received: 18,380 sats (12%)

Lightning address: miusuario@getalby.com
```

### Exportar Datos

```
Tú: Exporta todas las transacciones a CSV para contabilidad

Claude: [exporta transactions]

Exportando transacciones...

[Generando reporte]
Período: Todo el historial
Transacciones: 342
Formato: CSV

[CSV content]

```csv
Date,Type,Amount (sats),Amount (USD),Description,Payment Hash,Fee,Counterparty
2025-10-18 10:15,received,1000,0.30,Tip from Juan,abc123...,0,juan@getalby.com
2025-10-18 09:45,sent,-2000,-0.60,Café Latte,def456...,1,cafe@wallet.com
2025-10-17 22:30,received,25000,7.50,Ebook sale,ghi789...,0,buyer@getalby.com
...
```

✓ Exportado: transactions_2025-10-18.csv

[Tax Report]
También generando reporte fiscal...

```
TAX REPORT - 2025

Total Income: 156,780 sats ($47.03 USD)
Total Expenses: 78,340 sats ($23.50 USD)
Net Income: 78,440 sats ($23.53 USD)

Capital Gains: (depends on your tax jurisdiction)

Categorías deducibles:
- Business expenses: 45,600 sats
- Professional services: 12,400 sats
Total deductible: 58,000 sats
```

✓ tax_report_2025.pdf generado

Archivos listos para tu contador 📁
```

---

## 📖 Lección 9.G.8: Casos de Uso Prácticos

### Caso 1: Paywall para Blog

```
Tú: Implementa paywall para artículos de blog - 500 sats por artículo

Claude: [crea paywall system]

```javascript
// blog-paywall.js
const express = require('express');
const app = express();

const ARTICLE_PRICE = 500; // sats
const paidArticles = new Map(); // Track paid access

// Article preview (free)
app.get('/articles/:slug', async (req, res) => {
  const article = await db.articles.findOne({ slug: req.params.slug });

  res.render('article-preview', {
    title: article.title,
    preview: article.content.substring(0, 300) + '...',
    price: ARTICLE_PRICE,
    slug: article.slug
  });
});

// Generate payment for full article
app.post('/articles/:slug/unlock', async (req, res) => {
  const { slug } = req.params;
  const article = await db.articles.findOne({ slug });

  // Create invoice
  const invoice = await alby.createInvoice({
    amount: ARTICLE_PRICE,
    memo: `Unlock article: ${article.title}`,
  });

  // Store payment request
  paidArticles.set(invoice.payment_hash, {
    slug,
    createdAt: Date.now(),
    paid: false
  });

  res.json({
    invoice: invoice.payment_request,
    payment_hash: invoice.payment_hash
  });
});

// Check payment status
app.get('/articles/:slug/check/:hash', async (req, res) => {
  const { hash } = req.params;

  const payment = await alby.lookupInvoice(hash);

  if (payment.settled) {
    const access = paidArticles.get(hash);
    access.paid = true;

    // Generate access token
    const token = jwt.sign(
      { slug: access.slug, paid: true },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      paid: true,
      token
    });
  } else {
    res.json({ paid: false });
  }
});

// Full article (requires payment)
app.get('/articles/:slug/full', authenticateToken, async (req, res) => {
  const article = await db.articles.findOne({ slug: req.params.slug });
  res.render('article-full', { article });
});

function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Payment required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.paid && decoded.slug === req.params.slug) {
      next();
    } else {
      res.status(403).json({ error: 'Invalid token' });
    }
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
}
```

[Frontend]

```javascript
// article-unlock.js
async function unlockArticle(slug) {
  // Request invoice
  const response = await fetch(`/articles/${slug}/unlock`, {
    method: 'POST'
  });
  const { invoice, payment_hash } = await response.json();

  // Show invoice to user (QR code)
  displayInvoice(invoice);

  // Poll for payment
  const checkInterval = setInterval(async () => {
    const check = await fetch(`/articles/${slug}/check/${payment_hash}`);
    const { paid, token } = await check.json();

    if (paid) {
      clearInterval(checkInterval);
      // Store token and show full article
      localStorage.setItem(`article_${slug}`, token);
      window.location.reload();
    }
  }, 2000);
}
```

✅ Blog paywall implementado

User experience:
1. Usuario ve preview
2. Click "Unlock full article (500 sats)"
3. QR code aparece
4. Usuario paga con Lightning wallet
5. Artículo completo se desbloquea
6. Token válido por 7 días

Monetiza tu contenido con micropagos ⚡
```

### Caso 2: Splits Automáticos

```
Tú: Cuando reciba pagos, divide automáticamente: 70% para mí, 20% para socio, 10% para ahorros

Claude: [implementa automatic splits]

```javascript
// payment-splits.js
const SPLITS = [
  { name: 'Yo', address: 'yo@getalby.com', percentage: 70 },
  { name: 'Socio', address: 'socio@getalby.com', percentage: 20 },
  { name: 'Ahorros', address: 'ahorros@getalby.com', percentage: 10 }
];

// Webhook handler
app.post('/webhooks/payment-received', async (req, res) => {
  const { amount, payment_hash } = req.body.data;

  console.log(`Received ${amount} sats, splitting...`);

  // Calculate splits
  const splits = SPLITS.map(split => ({
    ...split,
    amount: Math.floor(amount * split.percentage / 100)
  }));

  // Send splits
  for (const split of splits) {
    try {
      await alby.sendPayment({
        destination: split.address,
        amount: split.amount,
        memo: `Split from payment ${payment_hash}: ${split.percentage}%`
      });

      console.log(`✓ Sent ${split.amount} sats to ${split.name}`);
    } catch (error) {
      console.error(`✗ Failed to send to ${split.name}:`, error);
      // Log for manual intervention
    }
  }

  res.sendStatus(200);
});
```

[Example]
Incoming payment: 10,000 sats

Splits:
• Yo: 7,000 sats (70%)
• Socio: 2,000 sats (20%)
• Ahorros: 1,000 sats (10%)

✓ All splits sent automatically

Use cases:
• Revenue sharing
• Royalty payments
• Savings automation
• Multi-party payments

Splits automáticos configurados 💸
```

---

## 🛠️ Ejercicios Prácticos

### Ejercicio 9.G.1: Setup Básico
1. Crea cuenta en Alby
2. Deposita algunos sats (mínimo 10,000)
3. Configura Nostr Wallet Connect
4. Conecta MCP de Alby
5. Verifica conexión

### Ejercicio 9.G.2: Envío y Recepción
1. Envía 1,000 sats a otra Lightning address
2. Crea un invoice por 5,000 sats
3. Paga el invoice desde otra wallet
4. Verifica ambas transacciones
5. Exporta historial

### Ejercicio 9.G.3: LNURL
1. Implementa LNURL-pay endpoint
2. Prueba con wallet compatible
3. Implementa LNURL-withdraw
4. Crea voucher de prueba
5. Documenta ambos flows

### Ejercicio 9.G.4: L402 Paywall
1. Crea API simple
2. Implementa L402 middleware
3. Protege al menos 2 endpoints
4. Crea cliente que paga automáticamente
5. Prueba el flujo completo

### Ejercicio 9.G.5: Proyecto Real
1. Elige un caso de uso (paywall, tips, etc)
2. Implementa con Lightning payments
3. Prueba con sats reales
4. Documenta la experiencia
5. Calcula fees y tiempos

---

## 📝 Examen 9.G: Maestría del MCP de Alby

### Parte 1: Preguntas Teóricas (3 puntos)

**Pregunta 1:** ¿Qué es Lightning Network y cuáles son sus 3 principales ventajas sobre Bitcoin on-chain?

**Pregunta 2:** Explica la diferencia entre:
- a) BOLT11 invoice vs LNURL-pay
- b) Lightning address vs Node pubkey
- c) L402 vs traditional API keys
- d) Keysend vs regular invoice payment

**Pregunta 3:** ¿Qué es Nostr Wallet Connect (NWC) y por qué es importante?

### Parte 2: Implementación (2 puntos)

1. Configura Alby wallet con NWC
2. Muestra configuración del MCP
3. Implementa envío de pago básico
4. Crea invoice y verifica pago

### Parte 3: Práctica - Sistema Completo (5 puntos)

Escenario: Crea un sistema de micropagos para tu aplicación.

**Tareas:**
1. Implementa LNURL-pay para aceptar pagos
2. Crea L402 paywall para API
3. Configura webhooks para notificaciones
4. Implementa splits automáticos
5. Genera analytics de pagos

Documenta con código y pruebas reales.

### Parte 4: Proyecto Real (Bonus +3 puntos)

Elige uno:

**Opción A: Content Monetization Platform**
1. Blog/podcast con paywalls Lightning
2. Tips/donaciones con LNURL
3. Subscriptions con invoices recurrentes
4. Analytics de ingresos
5. Withdrawals automáticos

**Opción B: Lightning-Powered API**
1. API útil (weather, data, AI, etc)
2. L402 protection en todos endpoints
3. Tiered pricing (diferentes precios)
4. Usage analytics
5. Client SDK con auto-payment

---

## ✅ Cómo Enviar Tu Examen

### Para la Parte 1:
```
Parte 1:
P1: [explicación de Lightning]
P2: [diferencias detalladas]
P3: [explicación de NWC]
```

### Para la Parte 2:
Screenshots de configuración y código.

### Para la Parte 3:
- Código fuente completo
- URLs de prueba
- Transaction hashes
- Logs de pagos
- Documentación

### Para la Parte 4:
- Proyecto funcionando
- Repositorio de código
- Demo video
- Analytics/métricas
- Lecciones aprendidas

---

## 🎯 Checklist de Dominio

**Setup**
- [ ] Cuenta Alby creada
- [ ] NWC configurado
- [ ] MCP de Alby instalado
- [ ] Conexión verificada

**Pagos Básicos**
- [ ] Enviar a Lightning address
- [ ] Pagar BOLT11 invoice
- [ ] Crear invoices
- [ ] Keysend payments

**LNURL**
- [ ] LNURL-pay implementation
- [ ] LNURL-withdraw
- [ ] LNURL-auth (bonus)
- [ ] QR codes generation

**L402**
- [ ] L402 middleware
- [ ] Paywall implementation
- [ ] Client con auto-payment
- [ ] Token management

**Advanced**
- [ ] Webhooks
- [ ] Payment splits
- [ ] Analytics
- [ ] Automation

---

## 💡 Mejores Prácticas

### 1. Security
```
✅ Bueno:
- NWC con budget limits
- Validate all invoices before paying
- Store preimages as proof
- Never expose full NWC URI

❌ Evita:
- Unlimited payment permissions
- Auto-pay without validation
- Hardcode NWC in frontend
- No payment limits
```

### 2. User Experience
```
✅ Bueno:
- Show QR codes for payments
- Poll for payment confirmation
- Clear pricing upfront
- Instant access after payment

❌ Evita:
- Only show invoice string
- Manual refresh for status
- Hidden costs
- Delays after payment
```

### 3. Error Handling
```
✅ Bueno:
- Handle routing failures
- Retry failed payments
- Graceful degradation
- Clear error messages

❌ Evita:
- Assume payments always work
- No retry logic
- Cryptic errors to users
- Silent failures
```

### 4. Performance
```
✅ Bueno:
- Cache invoice lookups
- Batch transactions where possible
- Async payment processing
- Efficient webhook handling

❌ Evita:
- Check invoice status on every request
- Synchronous payment flows
- No queueing
- Block on webhooks
```

---

## 🚀 Siguiente Nivel

1. **Advanced Lightning**
   - Run your own node
   - Channel management
   - Liquidity optimization
   - Custom routing

2. **Nostr Integration**
   - Zaps implementation
   - Nostr auth
   - Decentralized identity
   - Value4Value

3. **Business Applications**
   - Subscription models
   - Dynamic pricing
   - Multi-currency
   - Accounting integration

---

## 📚 Recursos Adicionales

### Documentación
- [Alby Guides](https://guides.getalby.com/)
- [Lightning Network Specs](https://github.com/lightning/bolts)
- [LNURL Spec](https://github.com/lnurl/luds)
- [L402 Protocol](https://docs.lightning.engineering/the-lightning-network/l402)

### Learning
- [Bitcoin & Lightning Basics](https://learnmeabitcoin.com/)
- [Lightning Network Book](https://github.com/lnbook/lnbook)
- [LNURL Tutorial](https://blog.getalby.com/lnurl-tutorial/)

### Tools
- [Alby Dashboard](https://getalby.com)
- [Lightning Terminal](https://terminal.lightning.engineering/)
- [Thunderhub](https://thunderhub.io/)
- [BTCPay Server](https://btcpayserver.org/)

### Community
- [Alby Discord](https://discord.gg/getalby)
- [Bitcoin Builders](https://www.bitcoinbuilders.dev/)
- [Nostr Community](https://nostr.com/)

---

**¡Subcapítulo 9.G Completo!**

Has aprendido a integrar Bitcoin Lightning payments con Claude Code usando Alby. Ahora puedes enviar/recibir pagos, crear paywalls, implementar LNURL y L402, y monetizar tus aplicaciones con micropagos instantáneos.

**Anterior**: `capitulo_09_mcp_gcp.md` (Google Cloud Platform MCP)
**Siguiente**: `capitulo_10.md` (Workflows Avanzados)

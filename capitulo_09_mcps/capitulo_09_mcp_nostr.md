# Subcapítulo 9.I: MCP de Nostr - Libertad de Expresión Descentralizada

**Duración**: 60 minutos
**Dificultad**: Intermedio-Avanzado
**Prerrequisito**: Capítulo 9 (MCP Básico)

---

## 🎯 Objetivos de Aprendizaje

Al final de este subcapítulo, podrás:
- Entender qué es Nostr y el protocolo descentralizado
- Configurar el MCP de Nostr con Claude Code
- Publicar notas en la red Nostr
- Leer y buscar eventos en relays
- Enviar y recibir Lightning Zaps (micropagos)
- Gestionar identidad con claves nsec/npub
- Conectar múltiples relays
- Crear bots y automatizaciones para Nostr

---

## 📖 Lección 9.I.1: ¿Qué es Nostr y Nostr MCP?

El **MCP de Nostr** conecta Claude Code con la red descentralizada de Nostr, permitiéndote publicar notas, enviar micropagos con Lightning, y construir aplicaciones resistentes a la censura usando lenguaje natural.

### Concepto Fundamental

Piensa en Nostr como **Twitter sin dueño, resistente a censura**:

**Sin MCP de Nostr:**
```
Tú: Necesito publicar una actualización en Nostr
  ↓ (abres cliente Nostr manualmente)
  ↓ (escribes la nota)
  ↓ (la publicas en relays)
  ↓ (verificas que se propagó)
Proceso manual y técnico
```

**Con MCP de Nostr:**
```
Tú: "Publica una nota en Nostr sobre nuestro nuevo release"

Claude: [usa MCP Nostr]
  → Firma la nota con tu nsec
  → La publica en múltiples relays
  → Verifica propagación
  → Devuelve note ID y enlaces

✓ Nota publicada en 5 relays
✓ Note ID: note1abc...xyz
✓ URL: https://njump.me/note1abc...
```

### ¿Qué es Nostr?

**NOSTR** = **N**otes and **O**ther **S**tuff **T**ransmitted by **R**elays

Es un protocolo descentralizado para publicar contenido que:
- **No tiene dueño** - Nadie controla la red
- **Resistente a censura** - No hay servidor central que bloquear
- **Portabilidad de identidad** - Tu identidad (clave pública) va contigo
- **Interoperabilidad** - Múltiples clientes usan el mismo protocolo
- **Integración con Bitcoin** - Lightning Zaps nativos

### ¿Qué Puede Hacer el MCP de Nostr?

✅ **Publicación de Contenido**
- Crear y firmar notas (kind 1)
- Actualizar metadata de perfil (kind 0)
- Publicar eventos largos
- Crear hilos de conversación

✅ **Lectura y Búsqueda**
- Buscar notas por autor
- Filtrar por hashtags
- Leer conversaciones
- Analizar tendencias

✅ **Lightning Zaps**
- Enviar micropagos (satoshis)
- Recibir zaps
- Ver historial de zaps
- Zaps anónimos

✅ **Gestión de Identidad**
- Generar pares de claves (nsec/npub)
- Gestión segura de nsec
- Múltiples identidades
- Verificación NIP-05

✅ **Relays**
- Conectar a múltiples relays
- Monitorear estado de conexión
- Balancear carga
- Relays personalizados

### Ventajas Clave

| Sin MCP Nostr | Con MCP Nostr |
|--------------|---------------|
| Cliente Nostr manual | Automatización con lenguaje natural |
| Firmar eventos manualmente | Firma automática |
| Gestión manual de relays | Gestión inteligente de relays |
| Copy-paste de note IDs | Búsqueda y análisis automático |
| **Manual y técnico** | **Automático e inteligente** ⚡ |

---

## 📖 Lección 9.I.2: Conceptos Fundamentales de Nostr

Antes de usar el MCP, necesitas entender los conceptos clave de Nostr.

### 1. Claves (Keys)

Nostr usa criptografía de curva elíptica (secp256k1, la misma que Bitcoin):

**nsec (clave privada)** - Tu identidad secreta
```
nsec1abc123def456...
```
- **NUNCA** compartas tu nsec
- Es como tu contraseña, pero irrecuperable
- Úsala para firmar eventos

**npub (clave pública)** - Tu identidad pública
```
npub1xyz789uvw456...
```
- Comparte libremente
- Es tu "username" en Nostr
- Otros la usan para encontrarte

### 2. Eventos (Events)

Todo en Nostr es un **evento**. Estructura básica:

```json
{
  "id": "abc123...",           // Hash SHA-256 del evento
  "pubkey": "xyz789...",        // Tu npub (en hex)
  "created_at": 1729267200,    // Unix timestamp
  "kind": 1,                   // Tipo de evento
  "tags": [],                  // Metadata y referencias
  "content": "Hello Nostr!",   // Contenido
  "sig": "def456..."           // Firma con nsec
}
```

### 3. Event Kinds (Tipos)

Los **kinds** definen qué tipo de contenido es el evento:

| Kind | Descripción | Uso |
|------|-------------|-----|
| **0** | Metadata | Perfil de usuario (nombre, bio, avatar) |
| **1** | Nota corta | Tweet-like, posts normales |
| **3** | Lista de contactos | Follows, lista de seguimiento |
| **4** | Mensajes directos | DMs encriptados |
| **5** | Borrado | Solicitud de borrar evento anterior |
| **6** | Repost | Compartir nota de otro |
| **7** | Reacción | Like, emoji reaction |
| **9734** | Zap request | Solicitud de invoice para zap |
| **9735** | Zap receipt | Confirmación de zap pagado |
| **30023** | Artículo largo | Posts largos tipo blog |

### 4. Relays

Los **relays** son servidores WebSocket que almacenan y transmiten eventos:

**Relays populares:**
```
wss://relay.damus.io          - General purpose (iOS)
wss://relay.primal.net        - General purpose (web)
wss://nos.lol                 - Community relay
wss://relay.snort.social      - Community relay
wss://relay.nostr.band        - Search-focused
wss://purplepag.es            - Paid relay (spam-free)
```

**Características:**
- Cualquiera puede correr un relay
- Gratis o de pago
- Sin censura (cada relay decide sus reglas)
- Los clientes se conectan a múltiples relays

### 5. NIPs (Nostr Implementation Possibilities)

Los **NIPs** son especificaciones que extienden el protocolo:

**NIPs esenciales:**
- **NIP-01**: Protocolo básico (eventos, claves, relays)
- **NIP-05**: Verificación de identidad (DNS-based)
- **NIP-19**: Formatos bech32 (nsec, npub, note, etc.)
- **NIP-57**: Lightning Zaps
- **NIP-65**: Relay lists
- **NIP-94**: File metadata

### 6. Lightning Zaps

**Zaps** = Tips en Bitcoin Lightning Network

Flujo de un zap:
```
1. Usuario A quiere zapear a Usuario B
2. Cliente solicita invoice a wallet de B (event kind 9734)
3. Wallet de B genera invoice
4. Usuario A paga invoice vía Lightning
5. Wallet de B publica zap receipt (event kind 9735)
6. ✓ Zap confirmado en Nostr
```

**Ventajas:**
- Instantáneo (segundos)
- Fees mínimos (<1 satoshi)
- Micropagos viables (1-100 sats)
- Integración nativa en protocolo

---

## 📖 Lección 9.I.3: Instalación y Configuración de Nostr MCP

Existen dos implementaciones principales del MCP de Nostr.

### Opción 1: AustinKelsay/nostr-mcp-server (Más Completo)

**Características:**
- Gestión completa de perfiles
- Zaps con análisis detallado
- Búsqueda de NIPs
- Soporta npub y hex keys

**Instalación:**

1. **Vía npm global**
```bash
npm install -g nostr-mcp
```

2. **Vía npx (sin instalación)**
```bash
# Se usará directamente en config
npx -y nostr-mcp
```

### Opción 2: AbdelStark/nostr-mcp (Más Simple)

**Características:**
- Publicar notas
- Múltiples relays
- SSE mode disponible
- Lightweight

**Instalación:**

1. **Vía Smithery (recomendado)**
```bash
npx -y @smithery/cli install @AbdelStark/nostr-mcp --client claude
```

2. **Manual desde GitHub**
```bash
git clone https://github.com/AbdelStark/nostr-mcp.git
cd nostr-mcp
npm install
npm run build
```

### Configuración en Claude Code

#### Paso 1: Generar Claves Nostr

Si no tienes claves, genera un par:

**Opción A: Usando un cliente Nostr**
- Descarga Damus (iOS), Primal (web), o Amethyst (Android)
- Crea cuenta → Guarda tu nsec en lugar SEGURO

**Opción B: Programáticamente**
```bash
# Usar nostr-tools
npx nostr-keygen
```

Tu nsec se verá así: `nsec1abc123def456...`

#### Paso 2: Configurar Variables de Entorno

Crea `.env` en tu proyecto (o usa system environment):

```bash
# .env
NOSTR_NSEC_KEY=nsec1abc123def456...
NOSTR_RELAYS=wss://relay.damus.io,wss://relay.primal.net,wss://nos.lol
LOG_LEVEL=info
```

**⚠️ IMPORTANTE:** Agrega `.env` a `.gitignore`

```bash
echo ".env" >> .gitignore
```

#### Paso 3: Configurar .claude/mcp.json

**Para AustinKelsay/nostr-mcp-server:**

```json
{
  "servers": {
    "nostr": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "nostr-mcp"],
      "env": {
        "NOSTR_NSEC_KEY": "${NOSTR_NSEC_KEY}",
        "NOSTR_RELAYS": "wss://relay.damus.io,wss://relay.primal.net,wss://nos.lol"
      }
    }
  }
}
```

**Para AbdelStark/nostr-mcp:**

```json
{
  "servers": {
    "nostr": {
      "transport": "stdio",
      "command": "node",
      "args": ["/ruta/absoluta/a/nostr-mcp/build/index.js"],
      "env": {
        "NOSTR_NSEC_KEY": "${NOSTR_NSEC_KEY}",
        "NOSTR_RELAYS": "wss://relay.damus.io,wss://relay.primal.net",
        "LOG_LEVEL": "info",
        "NODE_ENV": "production"
      }
    }
  }
}
```

#### Paso 4: Verificar Instalación

1. **Reinicia Claude Code**
```bash
exit
# Vuelve a abrir Claude Code
```

2. **Prueba conexión**
```
Tú: ¿Está conectado el MCP de Nostr?

Claude: Sí, el MCP de Nostr está conectado.

Herramientas disponibles:
- createKeypair
- createProfile
- postNote
- publishNote
- getAllZaps
- sendAnonymousZap
- searchNips

Estado: ✓ CONECTADO a 3 relays
```

---

## 📖 Lección 9.I.4: Publicar Notas en Nostr

Ahora vamos a publicar contenido en la red Nostr.

### Publicar una Nota Simple

```
Tú: Publica una nota en Nostr: "Hello Nostr from Claude Code! 🚀"

Claude: [usa mcp_nostr_postNote]

✓ Nota publicada exitosamente

Note ID: note1abc123def456...
Event ID (hex): abc123...
Relays confirmados: 3/3
  ✓ wss://relay.damus.io
  ✓ wss://relay.primal.net
  ✓ wss://nos.lol

Ver tu nota:
https://njump.me/note1abc123def456...
```

### Publicar con Hashtags

```
Tú: Publica: "Working on a new Nostr integration with Claude Code #nostr #ai #bitcoin"

Claude: [publica con tags]

✓ Nota publicada con 3 hashtags

Tags incluidos:
- #nostr
- #ai
- #bitcoin

URL: https://njump.me/note1xyz...
```

### Publicar Hilo (Thread)

```
Tú: Publica un hilo sobre los beneficios de Nostr:
1. Descentralizado y resistente a censura
2. Identidad portable
3. Lightning zaps integrados

Claude: [crea 3 eventos enlazados]

✓ Hilo publicado (3 notas)

Nota 1/3: "🧵 Thread sobre Nostr..."
  → note1aaa...

Nota 2/3: "Descentralizado y resistente a censura..."
  → note1bbb... (reply to note1aaa)

Nota 3/3: "Lightning zaps integrados..."
  → note1ccc... (reply to note1bbb)

Ver hilo: https://njump.me/note1aaa...
```

### Actualizar Perfil (Metadata)

```
Tú: Actualiza mi perfil de Nostr con:
- Nombre: "Claude Code Bot"
- Bio: "AI assistant powered by Claude, posting via MCP"
- Avatar: https://example.com/avatar.png

Claude: [usa createProfile/updateProfile]

✓ Perfil actualizado (kind 0 event)

Cambios:
- name: "Claude Code Bot"
- about: "AI assistant powered by Claude, posting via MCP"
- picture: "https://example.com/avatar.png"
- nip05: (opcional)

Event ID: abc123...
Propagado a 3 relays
```

### Mejores Prácticas de Publicación

1. **Siempre incluye contexto**: Las notas en Nostr son públicas y permanentes
2. **Usa hashtags relevantes**: Facilita descubrimiento
3. **Verifica relays**: Asegúrate de publicar en relays populares
4. **Links externos**: Usa URLs completas (no hay preview automático)
5. **Imágenes**: Usa servicios de hosting (nostr.build, imgur, etc.)

---

## 📖 Lección 9.I.5: Leer y Buscar Eventos

Además de publicar, puedes leer y analizar contenido en Nostr.

### Buscar Notas por Autor

```
Tú: Busca las últimas 10 notas de npub1abc123...

Claude: [usa filtros de búsqueda]

Encontradas 10 notas de @usuario:

1. "Just deployed a new feature! 🎉"
   - Hace 2 horas
   - 15 likes, 3 reposts, 2 zaps (500 sats)

2. "Working on Nostr integrations..."
   - Hace 5 horas
   - 8 likes, 1 zap (100 sats)

...

Total: 10 notas
```

### Buscar por Hashtag

```
Tú: Busca notas recientes con #bitcoin

Claude: [filtra por tag]

Encontradas 50 notas con #bitcoin (últimas 24h):

Top 3 más populares:

1. "@jack: Bitcoin is the native currency..."
   - 245 likes, 89 reposts, 45 zaps (12,500 sats)

2. "@dev: New Lightning wallet release..."
   - 156 likes, 34 reposts, 28 zaps (8,900 sats)

3. "@trader: BTC analysis for this week..."
   - 98 likes, 23 reposts, 15 zaps (3,200 sats)
```

### Leer Conversación (Replies)

```
Tú: Muéstrame los replies a la nota note1abc123...

Claude: [busca eventos con "e" tag]

Conversación en note1abc123:

Original (por @alice):
"What's the best Nostr client?"

├─ @bob (hace 1h): "I recommend Damus for iOS"
│  └─ @alice: "Thanks! Downloading now"
│
├─ @charlie (hace 30m): "Primal has great UX"
│
└─ @dave (hace 10m): "Amethyst if you're on Android"

Total: 4 replies
```

### Analizar Tendencias

```
Tú: ¿Cuáles son los hashtags más populares hoy en Nostr?

Claude: [analiza eventos recientes]

Top 10 hashtags (últimas 24h):

1. #bitcoin - 1,234 menciones
2. #nostr - 890 menciones
3. #lightning - 567 menciones
4. #plebchain - 445 menciones
5. #grownostr - 398 menciones
6. #zaps - 312 menciones
7. #freedom - 289 menciones
8. #ai - 245 menciones
9. #photography - 198 menciones
10. #memes - 176 menciones
```

### Buscar en NIPs (Documentación)

```
Tú: Busca información sobre Lightning Zaps en los NIPs

Claude: [usa searchNips]

Encontrado: NIP-57 - Lightning Zaps

Relevancia: 95%

Resumen:
NIP-57 define cómo implementar Lightning zaps en Nostr.
Usa event kinds 9734 (zap request) y 9735 (zap receipt).

Implementación:
1. Cliente solicita invoice a lightning wallet
2. Usuario paga invoice
3. Wallet publica zap receipt en relays
4. Otros clientes ven el zap

Especificación completa:
https://github.com/nostr-protocol/nips/blob/master/57.md
```

---

## 📖 Lección 9.I.6: Lightning Zaps - Enviar y Recibir Pagos

Los **Zaps** son una característica única de Nostr: micropagos instantáneos con Bitcoin Lightning.

### Prerrequisitos para Zaps

1. **Lightning Wallet compatible con Nostr**
   - Alby (navegador)
   - Wallet of Satoshi (mobile)
   - Zeus (self-custodial)
   - Mutiny (web)

2. **Configurar Lightning Address**
   - En tu perfil Nostr (metadata kind 0)
   - Campo `lud16`: `usuario@getalby.com`

### Ver Historial de Zaps

```
Tú: Muestra mi historial de zaps

Claude: [usa getAllZaps]

Historial de Zaps:

RECIBIDOS (últimos 30 días):
1. 1,000 sats ← @alice
   "Great note! ⚡"
   note1abc... (hace 2 días)

2. 500 sats ← @bob
   "Thanks for sharing 🙏"
   note1def... (hace 5 días)

3. 2,100 sats ← @charlie
   note1ghi... (hace 1 semana)

Total recibido: 3,600 sats (~$1.80)

ENVIADOS:
1. 500 sats → @dave
   note1jkl... (hace 3 días)

2. 1,000 sats → @eve
   note1mno... (hace 1 semana)

Total enviado: 1,500 sats (~$0.75)

Balance neto: +2,100 sats
```

### Enviar Zap Anónimo

```
Tú: Envía un zap anónimo de 1000 sats a npub1xyz789...

Claude: [usa sendAnonymousZap]

⚠️ Confirmación requerida:

Destino: npub1xyz789... (@usuario)
Monto: 1,000 sats (~$0.50)
Tipo: Anónimo (sin tu firma)

¿Proceder?

[Usuario confirma]

Claude: [procesa zap]

✓ Zap enviado exitosamente

Invoice pagado: 1,000 sats
Fee Lightning: 1 sat
Total: 1,001 sats

Zap receipt: event 9735
  → Publicado en 3 relays
  → Confirmado ✓

El destinatario verá el zap pero no tu identidad.
```

### Enviar Zap con Mensaje

```
Tú: Zapea 500 sats a note1abc... con el mensaje "Excellent post! ⚡"

Claude: [crea zap request con mensaje]

✓ Zap con mensaje enviado

Monto: 500 sats
Destinatario: @alice
Mensaje: "Excellent post! ⚡"
Nota: note1abc...

El mensaje se incluye en el zap receipt y es público.
```

### Configurar Auto-Zaps

```
Tú: Configura auto-zaps de 100 sats para notas que mencionen "claude code"

Claude: [crea filtro de eventos]

✓ Auto-zap configurado

Filtro: notas que contienen "claude code"
Monto: 100 sats por nota
Límite: 10 zaps/día (máx 1,000 sats/día)

Activo: ✓

Recibirás confirmación antes de cada zap.
```

### Mejores Prácticas de Zaps

1. **Verifica Lightning Address**: Asegúrate que el destinatario tiene wallet configurado
2. **Montos razonables**: 100-1,000 sats es típico para tips
3. **Mensajes opcionales**: Agrega contexto si quieres
4. **Zaps anónimos**: Útil para privacidad
5. **Revisa fees**: Lightning fees son bajos pero variables

---

## 📖 Lección 9.I.7: Gestión de Relays y Conexiones

Los **relays** son la infraestructura de Nostr. Saber gestionarlos es clave.

### Ver Relays Conectados

```
Tú: ¿A qué relays estoy conectado?

Claude: [verifica configuración]

Relays configurados (3):

1. wss://relay.damus.io
   Estado: ✓ Conectado
   Latencia: 45ms
   Eventos publicados: 12

2. wss://relay.primal.net
   Estado: ✓ Conectado
   Latencia: 78ms
   Eventos publicados: 12

3. wss://nos.lol
   Estado: ⚠️ Conectando...
   Latencia: timeout
   Eventos publicados: 10

Relays activos: 2/3
```

### Agregar Relay

```
Tú: Agrega el relay wss://relay.snort.social

Claude: [actualiza configuración]

✓ Relay agregado

wss://relay.snort.social
  → Testing conexión...
  → ✓ Conectado (latencia 56ms)

Relays totales: 4
Activos: 3/4
```

### Remover Relay

```
Tú: Remueve el relay wss://nos.lol (está teniendo problemas)

Claude: [actualiza config]

✓ Relay removido

wss://nos.lol
  → Desconectado
  → Removido de configuración

Relays restantes: 3
```

### Relays Especializados

**Por tipo de contenido:**

```
Relays generales:
- wss://relay.damus.io
- wss://relay.primal.net

Relays de búsqueda:
- wss://relay.nostr.band
- wss://search.nos.today

Relays pagos (sin spam):
- wss://purplepag.es (paid)
- wss://nostr.wine (paid)

Relays de medios:
- wss://nostr.build (imágenes)

Relays regionales:
- wss://relay.nostr.tokyo (Asia)
- wss://relay.nostr.ch (Europa)
```

### Publicar en Relays Selectivos

```
Tú: Publica esta nota solo en relays pagos para evitar spam:
"Important announcement about our project roadmap"

Claude: [publica solo en relays específicos]

✓ Nota publicada en relays premium

Relays usados:
- wss://purplepag.es ✓
- wss://nostr.wine ✓

Relays omitidos (públicos):
- wss://relay.damus.io (skipped)
- wss://relay.primal.net (skipped)

Esto reduce spam pero limita alcance.
```

### Monitorear Salud de Relays

```
Tú: Revisa el estado de todos mis relays

Claude: [ping a cada relay]

Health Check (4 relays):

✅ HEALTHY (2):
- wss://relay.damus.io (45ms)
- wss://relay.primal.net (67ms)

⚠️ SLOW (1):
- wss://relay.snort.social (890ms)

❌ DOWN (1):
- wss://old-relay.example.com (timeout)

Recomendación: Remueve old-relay.example.com
```

### Mejores Prácticas de Relays

1. **Usa 3-7 relays**: Balance entre redundancia y performance
2. **Mezcla gratuitos y pagos**: Pagos reducen spam
3. **Monitorea regularmente**: Relays caen ocasionalmente
4. **Relays especializados**: Para búsqueda, medios, etc.
5. **Latencia importa**: Elige relays cercanos geográficamente

---

## 📖 Lección 9.I.8: Casos de Uso Avanzados

Ahora veamos automatizaciones y bots poderosos con Nostr MCP.

### Bot de Auto-Respuestas

```
Tú: Crea un bot que responda automáticamente a menciones con información sobre nuestro proyecto

Claude: [configura monitor de eventos]

✓ Bot de auto-respuestas activado

Filtros:
- Detecta menciones a tu npub
- Busca keywords: "how to", "help", "info"

Respuestas automáticas:
1. "how to" → Link a documentación
2. "help" → Link a Discord support
3. "info" → Descripción del proyecto

Modo: Aprobación manual
Límite: 20 respuestas/día

Primera mención detectada:

@alice: "@tubot how to get started?"

Respuesta sugerida:
"Hi @alice! To get started, check out our docs:
https://docs.example.com
Need more help? Join our Discord: https://discord.gg/..."

¿Enviar? [y/n]
```

### Agregador de Noticias

```
Tú: Publica un resumen diario de las notas más populares con #bitcoin

Claude: [crea scheduled task]

✓ Agregador configurado

Filtro: #bitcoin
Frecuencia: Diario (9:00 AM UTC)
Top: 5 notas más populares

Preview del resumen de hoy:

"🗞️ Top #Bitcoin notas del día:

1. @jack: 'Bitcoin is freedom'
   👍 234 | ⚡ 45 zaps (12,500 sats)

2. @dev: 'New Lightning update...'
   👍 156 | ⚡ 28 zaps (8,900 sats)

...

#bitcoinnews #nostr"

Publicar mañana: ✓
```

### Alertas de Monitoreo

```
Tú: Envíame una nota de Nostr cuando nuestro servidor tenga problemas

Claude: [integra con monitoring]

✓ Alertas de monitoreo → Nostr

Triggers:
- Server down (immediate)
- CPU > 90% (5 min)
- Disk > 95% (immediate)

Destino:
- DM encriptado a ti (kind 4)
- Nota pública en @statusbot

Ejemplo de alerta:

"🚨 ALERTA DE SERVIDOR

Status: DOWN
Service: API Gateway
Started: 2024-10-18 14:23:45 UTC
Duration: 2 minutes

Dashboard: [link]

Posted via Nostr MCP"
```

### Integración con GitHub

```
Tú: Publica en Nostr cuando haya un nuevo release en nuestro repo

Claude: [configura GitHub webhook → Nostr]

✓ GitHub → Nostr integration

Trigger: New release published
Repo: github.com/org/repo

Template:
"🎉 New Release: {{version}}

{{release_notes}}

Download: {{download_url}}
Changelog: {{changelog_url}}

#opensource #release"

Testing con último release (v2.1.3):

Preview:
"🎉 New Release: v2.1.3

- Bug fixes in auth module
- Performance improvements
- New API endpoints

Download: https://github.com/org/repo/releases/v2.1.3
Changelog: https://github.com/org/repo/releases/v2.1.3

#opensource #release"

Auto-post: ✓ Enabled
```

### Bot de Zaps Automáticos

```
Tú: Zapea automáticamente 100 sats a notas de calidad sobre #nostr

Claude: [crea filtro inteligente]

✓ Auto-zap bot configurado

Criterios de calidad:
- Mínimo 10 likes
- Autor con > 100 seguidores
- Contenido > 100 caracteres
- Hashtag: #nostr
- Sin spam keywords

Monto: 100 sats/nota
Límite: 10 notas/día (máx 1,000 sats/día)
Modo: Aprobación manual primero

Primera candidata detectada:

@alice (450 followers):
"Deep dive into NIP-57 implementation details.
Zaps are revolutionary for content monetization..."

👍 23 likes | 5 reposts
Caracteres: 287

¿Zapear 100 sats? [y/n]
```

### Analytics Dashboard

```
Tú: Genera un reporte semanal de mi actividad en Nostr

Claude: [analiza tus eventos]

📊 Reporte Semanal de Nostr (18-25 Oct 2024)

PUBLICACIONES:
- Notas publicadas: 24
- Replies: 18
- Reposts: 5
- Total eventos: 47

ENGAGEMENT:
- Likes recibidos: 234
- Reposts: 45
- Replies: 67
- Zaps recibidos: 12 (5,400 sats)

TOP NOTA:
"Working on Nostr integrations with Claude Code..."
- 45 likes, 12 reposts, 4 zaps (1,200 sats)
- note1abc...

CRECIMIENTO:
- Nuevos followers: +34
- Total followers: 567

ZAPS:
- Recibidos: 5,400 sats ($2.70)
- Enviados: 1,200 sats ($0.60)
- Balance: +4,200 sats

RELAYS:
- Eventos publicados: 47
- Relays activos: 3/3
- Uptime: 99.2%

¿Publicar este reporte como nota? [y/n]
```

---

## 🏋️ Ejercicios Prácticos

### Ejercicio 9.I.1: Configuración Inicial
1. Genera un par de claves nsec/npub
2. Configura el MCP de Nostr en `.claude/mcp.json`
3. Conecta al menos 3 relays
4. Publica tu primera nota
5. Actualiza tu perfil con metadata

### Ejercicio 9.I.2: Publicación y Lectura
1. Publica un hilo de 3 notas sobre un tema técnico
2. Busca notas con el hashtag #nostr
3. Lee los replies a una nota popular
4. Encuentra las notas de un usuario específico (npub)
5. Analiza los trending hashtags del día

### Ejercicio 9.I.3: Lightning Zaps
1. Configura un Lightning wallet compatible (Alby o WoS)
2. Agrega tu Lightning address a tu perfil Nostr
3. Envía un zap de 100 sats a una nota que te guste
4. Verifica el zap receipt en los relays
5. Revisa tu historial de zaps enviados y recibidos

### Ejercicio 9.I.4: Gestión de Relays
1. Lista los relays a los que estás conectado
2. Agrega un relay nuevo (ej: relay.snort.social)
3. Monitorea la latencia de cada relay
4. Publica una nota y verifica en cuántos relays aparece
5. Remueve el relay más lento

### Ejercicio 9.I.5: Bot de Automatización
1. Crea un bot que monitoree menciones a tu npub
2. Configura respuestas automáticas para keywords
3. Implementa un agregador diario de #bitcoin news
4. Configura auto-zaps para notas de calidad
5. Genera un reporte semanal de tu actividad

---

## 📝 Examen 9.I: Maestría del MCP de Nostr

### Parte 1: Preguntas Teóricas (3 puntos)

**Pregunta 1:** Explica la diferencia entre nsec y npub. ¿Por qué es crítico nunca compartir tu nsec?

**Pregunta 2:** ¿Qué son los relays en Nostr y por qué es importante conectarse a múltiples relays?

**Pregunta 3:** Describe el flujo completo de un Lightning Zap en Nostr (desde solicitud hasta confirmación).

### Parte 2: Configuración (2 puntos)

1. Muestra cómo configurarías Nostr MCP en `.claude/mcp.json` con 3 relays
2. ¿Cómo protegerías tu nsec en la configuración?
3. Explica la diferencia entre las dos implementaciones principales (AustinKelsay vs AbdelStark)

### Parte 3: Práctica - Publicación (5 puntos)

**Escenario:**
Eres el community manager de un proyecto open-source. Necesitas:

1. Publicar un anuncio de nuevo release
2. Crear un hilo explicando las nuevas features
3. Responder a preguntas en los replies
4. Zapear a usuarios que reportan bugs valiosos
5. Generar un reporte semanal de engagement

Muestra cómo harías cada tarea con Claude + Nostr MCP.

### Parte 4: Casos de Uso (5 puntos)

Diseña soluciones con Nostr MCP para:

1. **Bot de noticias**: Agrega y publica las top 5 notas de #bitcoin cada 6 horas
2. **Sistema de alertas**: Notifica en Nostr cuando hay downtime en tus servicios
3. **Auto-zaps**: Zapea automáticamente a contenido de calidad según criterios
4. **Analytics**: Genera métricas de tu actividad (notas, zaps, engagement)
5. **Integración GitHub**: Publica automáticamente cuando hay nuevos releases

### Bonus (2 puntos extra)

Implementa un bot que:
- Monitoree menciones de tu proyecto en Nostr
- Responda preguntas comunes automáticamente
- Escale a humanos las preguntas complejas
- Genere reportes de sentiment analysis semanales

---

## ✅ Checklist de Dominio

Marca cada skill al dominarla:

**Fundamentos**
- [ ] Entiendo qué es Nostr y cómo funciona
- [ ] Sé la diferencia entre nsec/npub
- [ ] Comprendo los event kinds principales
- [ ] Entiendo el rol de los relays
- [ ] Conozco los NIPs esenciales (01, 05, 19, 57)

**Configuración**
- [ ] Puedo generar claves Nostr
- [ ] Sé configurar Nostr MCP en Claude Code
- [ ] Puedo conectar múltiples relays
- [ ] Sé proteger mi nsec correctamente
- [ ] Puedo verificar el estado de conexión

**Publicación**
- [ ] Sé publicar notas simples
- [ ] Puedo crear hilos (threads)
- [ ] Sé usar hashtags efectivamente
- [ ] Puedo actualizar mi perfil (metadata)
- [ ] Sé publicar replies a otras notas

**Lectura**
- [ ] Puedo buscar notas por autor (npub)
- [ ] Sé filtrar por hashtags
- [ ] Puedo leer conversaciones (replies)
- [ ] Sé analizar trending topics
- [ ] Puedo buscar en los NIPs

**Lightning Zaps**
- [ ] Tengo configurado un Lightning wallet
- [ ] Sé enviar zaps a notas
- [ ] Puedo enviar zaps anónimos
- [ ] Sé ver mi historial de zaps
- [ ] Entiendo zap requests y receipts

**Relays**
- [ ] Sé agregar/remover relays
- [ ] Puedo monitorear estado de relays
- [ ] Conozco relays especializados
- [ ] Sé optimizar latencia
- [ ] Entiendo trade-offs de relays pagos vs gratuitos

**Automatización**
- [ ] Puedo crear bots de auto-respuesta
- [ ] Sé configurar agregadores de contenido
- [ ] Puedo implementar alertas a Nostr
- [ ] Sé crear auto-zaps inteligentes
- [ ] Puedo generar reportes analíticos

---

## 🎯 Mejores Prácticas

### Seguridad

1. **NUNCA compartas tu nsec**
   - Trata tu nsec como una clave privada de Bitcoin
   - Si se compromete, pierdes tu identidad permanentemente
   - No hay "recuperación de contraseña" en Nostr

2. **Usa variables de entorno**
   ```bash
   # .env (en .gitignore)
   NOSTR_NSEC_KEY=nsec1...
   ```

3. **Considera múltiples identidades**
   - Identidad personal vs proyecto
   - Bots con nsec separado
   - Nunca reutilices nsec entre contextos

4. **Verifica relays**
   - Relays maliciosos pueden leer tus eventos
   - Usa relays conocidos y confiables
   - Considera relays pagos para privacidad

### Performance

1. **Optimiza número de relays**
   - 3-7 relays es óptimo
   - Más relays = más latencia
   - Monitorea y remueve relays lentos

2. **Usa relays cercanos geográficamente**
   ```
   US: relay.damus.io
   EU: relay.nostr.ch
   Asia: relay.nostr.tokyo
   ```

3. **Filtra eventos inteligentemente**
   - Limita búsquedas con timeframe
   - Usa filtros específicos (author, kinds, tags)
   - Evita wildcard searches

### Privacidad

1. **Metadata leakage**
   - Todos los eventos son públicos
   - IPs pueden filtrarse en relays
   - Considera VPN/Tor para privacidad extra

2. **DMs no son privados**
   - NIP-04 (DMs) tiene debilidades criptográficas
   - Usa apps especializadas para comunicación privada
   - Mejor: usa Signal, no Nostr DMs

3. **Zaps anónimos**
   - Zaps normales exponen tu identidad
   - Usa `sendAnonymousZap` para privacidad
   - Lightning tiene metadata de privacidad a considerar

### Etiqueta (Nostr Culture)

1. **Zap generosamente**
   - 100-1,000 sats es estándar para contenido bueno
   - Muestra aprecio con sats, no solo likes
   - Zaps sostienen la economía de creators

2. **Hashtags útiles**
   - #plebchain - Comunidad general
   - #grownostr - Ayudar a crecer Nostr
   - #asknostr - Hacer preguntas
   - #zapathon - Eventos de zapping

3. **Reply thoughtfully**
   - Conversaciones son públicas y permanentes
   - Replies incrementan visibilidad
   - Constructivos > trolling

4. **Repost con contexto**
   - Agrega tu opinión al repostear
   - Quote reposts son más valiosos
   - Da crédito a autores

### Contenido

1. **Permanencia**
   - Todo en Nostr es permanente
   - Deletes (kind 5) son "requests", no garantizados
   - Piensa antes de publicar

2. **Valor sobre volumen**
   - Calidad > cantidad
   - Spam es mal visto
   - Contribuye, no solo promociones

3. **Multimedia**
   - Usa nostr.build para imágenes
   - Links externos para videos
   - Considera ancho de banda en móviles

---

## 📚 Recursos Adicionales

### Documentación Oficial

- **Nostr Protocol**: https://nostr.com
- **NIPs Repository**: https://github.com/nostr-protocol/nips
- **Nostr How**: https://nostr.how
- **Learn Nostr**: https://learnnostr.org

### MCPs de Nostr

- **AustinKelsay/nostr-mcp-server**: https://github.com/AustinKelsay/nostr-mcp-server
- **AbdelStark/nostr-mcp**: https://github.com/AbdelStark/nostr-mcp
- **NPM Package**: https://www.npmjs.com/package/nostr-mcp

### Clientes Nostr

- **Damus** (iOS): https://damus.io
- **Primal** (Web): https://primal.net
- **Amethyst** (Android): https://github.com/vitorpamplona/amethyst
- **Snort** (Web): https://snort.social
- **Nostrudel** (Web): https://nostrudel.ninja

### Lightning Wallets (Zaps)

- **Alby** (Browser extension): https://getalby.com
- **Wallet of Satoshi** (Mobile, easiest): https://walletofsatoshi.com
- **Zeus** (Self-custodial): https://zeusln.com
- **Mutiny** (Web, self-custodial): https://mutinywallet.com

### Relay Lists

- **Nostr.watch**: https://nostr.watch (monitor relay status)
- **Relay Exchange**: https://relay.exchange
- **Nostr.band**: https://nostr.band (analytics)

### Herramientas de Desarrollo

- **nostr-tools** (JavaScript): https://github.com/nbd-wtf/nostr-tools
- **rust-nostr** (Rust): https://github.com/rust-nostr/nostr
- **nostr-dev-kit** (NDK): https://github.com/nostr-dev-kit/ndk
- **Cashu** (eCash on Nostr): https://cashu.space

### Comunidad

- **Nostr Telegram**: https://t.me/nostr_protocol
- **Nostr Discord**: (busca en njump.me)
- **r/nostr**: https://reddit.com/r/nostr
- **#asknostr**: Usa en tus notas para preguntas

### Video Tutoriales

- **Nostr Explained** (YouTube): Busca "Nostr tutorial"
- **Lightning Zaps Guide**: https://learn.heyapollo.com
- **Building on Nostr**: https://www.youtube.com/c/NostrProtocol

---

## 🎓 Próximos Pasos

1. **Domina los Básicos**
   - Publica regularmente en Nostr
   - Zapea contenido que te guste
   - Construye tu audiencia orgánicamente

2. **Experimenta con Bots**
   - Crea un bot simple de respuestas
   - Automatiza reportes o agregaciones
   - Integra Nostr en tus workflows

3. **Explora NIPs Avanzados**
   - NIP-23: Long-form content
   - NIP-28: Public chats
   - NIP-58: Badges
   - NIP-94: File metadata

4. **Contribuye al Ecosistema**
   - Corre tu propio relay
   - Desarrolla clientes o herramientas
   - Escribe NIPs para nuevas features
   - Ayuda a otros en #asknostr

5. **Integra con Otros MCPs**
   - Nostr + GitHub: Publica releases
   - Nostr + PostgreSQL: Analytics de eventos
   - Nostr + Slack: Notificaciones cross-platform
   - Nostr + Alby: Advanced Lightning workflows

---

**Anterior**: [Discord MCP (9.H)](./capitulo_09_mcp_discord.md)
**Siguiente**: [Capítulo 10 - Flujos de Trabajo Avanzados](../capitulo_10.md)
**Inicio**: [Curso Principal](../README.md)

---

**¿Listo para descentralizar tu comunicación?** Configura tu nsec y comienza a publicar en Nostr con libertad total. ⚡

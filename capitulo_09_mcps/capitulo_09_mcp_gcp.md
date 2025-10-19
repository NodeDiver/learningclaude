# Subcapítulo 9.F: MCP de Google Cloud Platform - Gestiona GCP

**Duración**: 60 minutos
**Dificultad**: Avanzado
**Prerrequisito**: Capítulo 9 (MCP Básico)

---

## 🎯 Objetivos de Aprendizaje

Al final de este subcapítulo, podrás:
- Entender qué es el MCP de GCP y sus capacidades cloud
- Configurar autenticación con Service Accounts
- Gestionar recursos de Google Cloud (Compute, Storage, etc)
- Desplegar aplicaciones en Cloud Run y Cloud Functions
- Administrar bases de datos (Cloud SQL, Firestore, BigQuery)
- Optimizar costos y billing de GCP
- Implementar seguridad con IAM y Security Command Center
- Usar herramientas de IA/ML de Google Cloud

---

## 📖 Lección 9.F.1: ¿Qué es el MCP de GCP?

El **MCP de Google Cloud Platform** es un servidor que conecta Claude Code directamente con GCP, permitiéndote gestionar infraestructura cloud, deployments, bases de datos, IA/ML y más usando lenguaje natural.

### Concepto Fundamental

Piensa en el MCP de GCP como un **Cloud Architect automatizado**:

**Sin MCP de GCP:**
```
Tú ←→ Claude Code
       ↓ (manualmente)
   Console/gcloud CLI ←→ Google Cloud
   (comandos complejos, clicks en UI)
```

**Con MCP de GCP:**
```
Tú ←→ Claude Code ←→ MCP GCP ←→ Google Cloud
     ("despliega en Cloud Run" → automatización completa)
```

### ¿Qué Puede Hacer?

El MCP de GCP proporciona **herramientas poderosas** para:

✅ **Compute y Containers**
- Google Compute Engine (VMs)
- Google Kubernetes Engine (GKE)
- Cloud Run (serverless containers)
- Cloud Functions (serverless functions)

✅ **Storage y Databases**
- Cloud Storage (object storage)
- Cloud SQL (PostgreSQL, MySQL)
- Firestore (NoSQL)
- BigQuery (data warehouse)

✅ **Networking**
- VPC networks
- Load balancers
- Cloud CDN
- Cloud DNS

✅ **AI/ML Services**
- Vertex AI (ML platform)
- Vision API (image analysis)
- Natural Language API
- Translation API

✅ **Security y IAM**
- Identity and Access Management
- Security Command Center
- Secret Manager
- Cloud Armor

✅ **DevOps**
- Cloud Build (CI/CD)
- Artifact Registry
- Cloud Logging
- Cloud Monitoring

### Ventajas Clave

| Sin MCP GCP | Con MCP GCP |
|-------------|-------------|
| gcloud commands complejos | Lenguaje natural |
| Console web manual | Automatización desde Claude |
| Scripts complicados | Generación automática |
| Documentación fragmentada | Claude conoce best practices |
| Configuración propensa a errores | Validación automática |
| **Curva de aprendizaje alta** | **Intuición natural** ⚡ |

---

## 📖 Lección 9.F.2: Instalación y Configuración

### Paso 1: Crear Service Account en GCP

**Opción A: Usando gcloud CLI**
```bash
# Login en GCP
gcloud auth login

# Establecer proyecto
gcloud config set project mi-proyecto-gcp

# Crear service account
gcloud iam service-accounts create claude-code-sa \
  --display-name="Claude Code MCP" \
  --description="Service account for Claude Code automation"

# Dar permisos (ajustar según necesidad)
gcloud projects add-iam-policy-binding mi-proyecto-gcp \
  --member="serviceAccount:claude-code-sa@mi-proyecto-gcp.iam.gserviceaccount.com" \
  --role="roles/editor"

# Crear y descargar key
gcloud iam service-accounts keys create ~/claude-gcp-key.json \
  --iam-account=claude-code-sa@mi-proyecto-gcp.iam.gserviceaccount.com
```

**Opción B: Desde GCP Console**
```
1. Console → IAM & Admin → Service Accounts
2. Create Service Account
3. Name: claude-code-sa
4. Grant roles: Editor (o roles específicos)
5. Create key → JSON
6. Descargar archivo JSON
```

### Paso 2: Instalar el Servidor MCP

```bash
# Instalar el MCP de GCP
npm install -g @modelcontextprotocol/server-gcp

# O usando Claude Code CLI
claude mcp add --transport stdio \
  --name gcp \
  --command "npx" \
  --args "-y @modelcontextprotocol/server-gcp"
```

### Paso 3: Configuración Manual

**Archivo: `.claude/mcp.json`** (proyecto específico)
```json
{
  "servers": {
    "gcp": {
      "transport": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-gcp"
      ],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "/path/to/claude-gcp-key.json",
        "GCP_PROJECT_ID": "mi-proyecto-gcp"
      }
    }
  }
}
```

O en **`~/.claude/mcp.json`** (global - todos los proyectos)

### Paso 4: Usar Variables de Entorno (Recomendado)

**Archivo: `.env`**
```bash
GOOGLE_APPLICATION_CREDENTIALS=/home/usuario/.gcp/claude-gcp-key.json
GCP_PROJECT_ID=mi-proyecto-gcp
GCP_REGION=us-central1
GCP_ZONE=us-central1-a
```

**Actualiza `mcp.json`:**
```json
{
  "servers": {
    "gcp": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-gcp"],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "${GOOGLE_APPLICATION_CREDENTIALS}",
        "GCP_PROJECT_ID": "${GCP_PROJECT_ID}",
        "GCP_REGION": "${GCP_REGION}",
        "GCP_ZONE": "${GCP_ZONE}"
      }
    }
  }
}
```

### Paso 5: Múltiples Proyectos

Si gestionas múltiples proyectos de GCP:

```json
{
  "servers": {
    "gcp-production": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-gcp"],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "${GCP_PROD_CREDENTIALS}",
        "GCP_PROJECT_ID": "${GCP_PROD_PROJECT_ID}"
      }
    },
    "gcp-development": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-gcp"],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "${GCP_DEV_CREDENTIALS}",
        "GCP_PROJECT_ID": "${GCP_DEV_PROJECT_ID}"
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
# gcp (stdio) - @modelcontextprotocol/server-gcp [connected ✓]
```

### Probar Conexión

```
Tú: ¿Puedes conectarte a Google Cloud?

Claude: [usa gcp_test_connection]
✓ Conexión exitosa a Google Cloud Platform
Project: mi-proyecto-gcp
Project Number: 123456789012
Region: us-central1
Service Account: claude-code-sa@mi-proyecto-gcp.iam.gserviceaccount.com
Active Services: 45
```

---

## 📖 Lección 9.F.3: Cloud Run - Serverless Containers

### Desplegar Aplicación en Cloud Run

**Herramienta: gcp_deploy_cloud_run**

```
Tú: Despliega mi aplicación Node.js a Cloud Run

Claude: [analiza proyecto y despliega]

Detectando configuración...
✓ Proyecto: API Express.js
✓ Puerto: 3000
✓ Dependencies: 23 packages

[Creando Dockerfile optimizado]

```dockerfile
# Multi-stage build para optimización
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

CMD ["node", "server.js"]
```

[Building container]
▸ Building with Cloud Build...
  Step 1/8: FROM node:18-alpine
  Step 2/8: WORKDIR /app
  Step 3/8: COPY package*.json
  Step 4/8: RUN npm ci
  ...
  ✓ Build successful (2m 15s)

▸ Pushing to Artifact Registry...
  gcr.io/mi-proyecto-gcp/mi-api:latest
  ✓ Pushed (45s)

[Deploying to Cloud Run]
▸ Creating Cloud Run service...
  Region: us-central1
  Service: mi-api
  Platform: managed
  Concurrency: 80
  Max instances: 100
  Min instances: 0 (scale to zero)
  CPU: 1 vCPU
  Memory: 512 MB
  Request timeout: 300s

▸ Configuring traffic...
  100% → Revision mi-api-00001

✅ Deployment successful!

Service URL: https://mi-api-abc123-uc.a.run.app

Características:
✓ HTTPS automático
✓ Auto-scaling (0-100 instances)
✓ Pay per request (scale to zero)
✓ Global anycast
✓ Managed infrastructure

Cold start: ~500ms
Pricing: $0.00002400 per request

¿Quieres configurar un dominio personalizado?
```

### Configurar Dominio Personalizado

```
Tú: Sí, configura el dominio api.miapp.com

Claude: [configura domain mapping]

Configurando dominio personalizado...

[Domain Mapping]
✓ Verificando propiedad del dominio
✓ Domain: api.miapp.com
✓ Service: mi-api
✓ Region: us-central1

[DNS Configuration]
Agregar estos registros DNS:

Type: CNAME
Name: api
Value: ghs.googlehosted.com

[SSL Certificate]
✓ Certificado SSL gestionado por Google
✓ Provisioning automático
✓ Auto-renewal habilitado

Status:
🟡 Pendiente de verificación DNS

Una vez que el DNS se propague (~15 minutos):
✓ SSL certificate emitido
✓ HTTPS habilitado
✓ api.miapp.com → Cloud Run service

Te notificaré cuando esté listo.
```

### Configurar CI/CD con Cloud Build

```
Tú: Configura CI/CD para que cada push a main despliegue automáticamente

Claude: [crea Cloud Build pipeline]

Configurando CI/CD automático...

[Creando cloudbuild.yaml]

```yaml
# cloudbuild.yaml
steps:
  # Install dependencies
  - name: 'node:18'
    entrypoint: npm
    args: ['ci']

  # Run tests
  - name: 'node:18'
    entrypoint: npm
    args: ['test']

  # Build container
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'build'
      - '-t'
      - 'gcr.io/$PROJECT_ID/mi-api:$COMMIT_SHA'
      - '-t'
      - 'gcr.io/$PROJECT_ID/mi-api:latest'
      - '.'

  # Push to Artifact Registry
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'push'
      - '--all-tags'
      - 'gcr.io/$PROJECT_ID/mi-api'

  # Deploy to Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'mi-api'
      - '--image'
      - 'gcr.io/$PROJECT_ID/mi-api:$COMMIT_SHA'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'

# Store images in Artifact Registry
images:
  - 'gcr.io/$PROJECT_ID/mi-api:$COMMIT_SHA'
  - 'gcr.io/$PROJECT_ID/mi-api:latest'

options:
  logging: CLOUD_LOGGING_ONLY
```

[Creando Cloud Build Trigger]
✓ Trigger name: deploy-on-push-main
✓ Source: GitHub (mi-usuario/mi-repo)
✓ Branch: ^main$
✓ Config: cloudbuild.yaml

[Permisos]
✓ Cloud Build service account configurado
✓ Permisos para Cloud Run deployment

✅ CI/CD configurado

Workflow:
1. Push to main branch
2. Cloud Build trigger activado
3. Tests ejecutados
4. Container built y pushed
5. Deployed to Cloud Run
6. Notificación enviada

Próximo push a main desplegará automáticamente 🚀
```

---

## 📖 Lección 9.F.4: Cloud Functions - Serverless

### Crear Cloud Function

**Herramienta: gcp_create_function**

```
Tú: Crea una Cloud Function para procesar webhooks de Stripe

Claude: Generaré una Cloud Function optimizada...

[Creando función]

```javascript
// index.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Firestore } = require('@google-cloud/firestore');

const firestore = new Firestore();

/**
 * HTTP Cloud Function para webhooks de Stripe
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 */
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Verificar webhook signature
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Procesar evento
  console.log('Processing event:', event.type);

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionCancelled(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

async function handlePaymentSuccess(paymentIntent) {
  const { id, amount, customer, metadata } = paymentIntent;

  await firestore.collection('payments').doc(id).set({
    paymentIntentId: id,
    amount: amount / 100,
    currency: paymentIntent.currency,
    customerId: customer,
    status: 'succeeded',
    metadata,
    processedAt: new Date()
  });

  console.log(`Payment ${id} processed successfully`);
}

async function handlePaymentFailure(paymentIntent) {
  const { id, last_payment_error } = paymentIntent;

  await firestore.collection('payment_failures').doc(id).set({
    paymentIntentId: id,
    error: last_payment_error?.message || 'Unknown error',
    failedAt: new Date()
  });

  console.error(`Payment ${id} failed:`, last_payment_error?.message);
}

async function handleSubscriptionCreated(subscription) {
  // Implementation...
}

async function handleSubscriptionCancelled(subscription) {
  // Implementation...
}
```

```json
// package.json
{
  "name": "stripe-webhook-handler",
  "version": "1.0.0",
  "dependencies": {
    "stripe": "^14.0.0",
    "@google-cloud/firestore": "^7.0.0"
  }
}
```

[Deploying]
▸ Function name: stripe-webhook-handler
▸ Runtime: Node.js 18
▸ Trigger: HTTP
▸ Region: us-central1
▸ Memory: 256 MB
▸ Timeout: 60s
▸ Max instances: 100

▸ Environment variables:
  STRIPE_SECRET_KEY: [Secret Manager ref]
  STRIPE_WEBHOOK_SECRET: [Secret Manager ref]

▸ Security:
  ✓ Requires authentication: No (Stripe envia requests)
  ✓ CORS: Disabled
  ✓ Ingress: All

✓ Function deployed

URL: https://us-central1-mi-proyecto-gcp.cloudfunctions.net/stripe-webhook-handler

Configurar en Stripe Dashboard:
Webhooks → Add endpoint → [URL arriba]

Events to send:
• payment_intent.succeeded
• payment_intent.payment_failed
• customer.subscription.created
• customer.subscription.deleted

Función lista para recibir webhooks 🎉
```

---

## 📖 Lección 9.F.5: Bases de Datos

### Cloud SQL (PostgreSQL)

**Herramienta: gcp_create_sql_instance**

```
Tú: Crea una instancia de Cloud SQL PostgreSQL para producción

Claude: [crea database instance]

Creando Cloud SQL instance...

[Configuration]
Instance ID: mi-app-postgres-prod
Database: PostgreSQL 15
Tier: db-n1-standard-2
  vCPUs: 2
  Memory: 7.5 GB
  Storage: 100 GB SSD (auto-increase enabled)

Region: us-central1
Zone: us-central1-a
High Availability: Enabled (failover replica)
Backup: Automated daily backups (7 day retention)

[Security]
✓ Private IP enabled
✓ SSL required
✓ Authorized networks configured
✓ IAM database authentication enabled

[Creating]
▸ Provisioning instance... (5-10 minutes)
  ✓ Primary instance created
  ✓ Failover replica created
  ✓ Backups configured

✅ Instance ready!

Connection info:
Private IP: 10.128.0.3
Public IP: 35.192.123.45 (use private IP)

Connection string:
postgresql://postgres:PASSWORD@10.128.0.3:5432/postgres

[Creating database]
✓ Database: mi_app_prod created

[Creating user]
✓ User: app_user created
✓ Password: [stored in Secret Manager]
✓ Privileges: Granted on mi_app_prod

Connection from Cloud Run/Functions:
Use Cloud SQL Proxy (automático) o
Private IP desde VPC

Estimated cost: ~$150/month

¿Quieres que configure Cloud SQL Proxy para tu app?
```

### Firestore (NoSQL)

```
Tú: Configura Firestore para almacenar datos de usuarios

Claude: [configura Firestore]

Configurando Firestore...

[Setup]
✓ Mode: Native mode (recomendado)
✓ Location: nam5 (United States)
✓ No se puede cambiar después

[Collections structure]
Diseñando schema optimizado para tus datos...

```
firestore/
├── users/
│   └── {userId}
│       ├── email: string
│       ├── name: string
│       ├── createdAt: timestamp
│       ├── profile/
│       │   ├── avatar: string
│       │   ├── bio: string
│       │   └── settings: map
│       └── subscriptions/ (subcollection)
│           └── {subscriptionId}
│               ├── plan: string
│               ├── status: string
│               └── expiresAt: timestamp
│
├── products/
│   └── {productId}
│       ├── name: string
│       ├── price: number
│       ├── category: string
│       ├── stock: number
│       └── createdAt: timestamp
│
└── orders/
    └── {orderId}
        ├── userId: string (indexed)
        ├── items: array
        ├── total: number
        ├── status: string (indexed)
        └── createdAt: timestamp (indexed)
```

[Indexes]
Creando índices compuestos...

✓ orders: userId + createdAt (desc)
✓ orders: status + createdAt (desc)
✓ products: category + price (asc)

[Security Rules]

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;

      // Profile subcollection
      match /profile/{document=**} {
        allow read: if request.auth != null;
        allow write: if request.auth.uid == userId;
      }

      // Subscriptions subcollection
      match /subscriptions/{subId} {
        allow read: if request.auth.uid == userId;
        allow write: if false; // Only server can write
      }
    }

    // Products - public read, admin write
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth.token.admin == true;
    }

    // Orders - user can read their own, admin all
    match /orders/{orderId} {
      allow read: if request.auth.uid == resource.data.userId
                  || request.auth.token.admin == true;
      allow create: if request.auth.uid == request.resource.data.userId;
      allow update: if request.auth.token.admin == true;
    }
  }
}
```

✓ Security rules deployed

[Client SDK example]

```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const app = initializeApp({
  projectId: 'mi-proyecto-gcp',
  // ... other config
});

const db = getFirestore(app);

// Create user
await addDoc(collection(db, 'users'), {
  email: 'user@example.com',
  name: 'John Doe',
  createdAt: new Date()
});
```

Firestore listo para usar 🔥
```

### BigQuery (Data Warehouse)

```
Tú: Configura BigQuery para analytics de la app

Claude: [configura BigQuery dataset y tables]

Configurando BigQuery...

[Dataset]
✓ Dataset: app_analytics
✓ Location: US (multi-region)
✓ Default table expiration: Never
✓ Encryption: Google-managed

[Tables]
Creando tablas para analytics...

1. events (streaming)
```sql
CREATE TABLE app_analytics.events (
  event_id STRING NOT NULL,
  event_name STRING NOT NULL,
  user_id STRING,
  timestamp TIMESTAMP NOT NULL,
  properties JSON,
  user_properties JSON,
  device_info STRUCT<
    platform STRING,
    os_version STRING,
    app_version STRING,
    screen_resolution STRING
  >,
  geo STRUCT<
    country STRING,
    region STRING,
    city STRING
  >
)
PARTITION BY DATE(timestamp)
CLUSTER BY event_name, user_id;
```

2. user_sessions
```sql
CREATE TABLE app_analytics.user_sessions (
  session_id STRING NOT NULL,
  user_id STRING,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  duration_seconds INT64,
  page_views INT64,
  events_count INT64,
  device_category STRING
)
PARTITION BY DATE(start_time)
CLUSTER BY user_id;
```

[Views]
Creando vistas útiles...

```sql
-- Daily active users
CREATE VIEW app_analytics.daily_active_users AS
SELECT
  DATE(timestamp) as date,
  COUNT(DISTINCT user_id) as dau
FROM app_analytics.events
GROUP BY date
ORDER BY date DESC;

-- Popular features
CREATE VIEW app_analytics.popular_features AS
SELECT
  event_name,
  COUNT(*) as event_count,
  COUNT(DISTINCT user_id) as unique_users
FROM app_analytics.events
WHERE DATE(timestamp) >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
GROUP BY event_name
ORDER BY event_count DESC;
```

[Streaming Insert Example]

```javascript
const { BigQuery } = require('@google-cloud/bigquery');
const bigquery = new BigQuery();

async function trackEvent(event) {
  const rows = [{
    event_id: generateId(),
    event_name: event.name,
    user_id: event.userId,
    timestamp: new Date().toISOString(),
    properties: event.properties,
    device_info: event.device
  }];

  await bigquery
    .dataset('app_analytics')
    .table('events')
    .insert(rows);
}
```

[Scheduled Queries]
✓ Daily aggregations scheduled
✓ Weekly reports scheduled

BigQuery configurado para analytics a escala 📊
```

---

## 📖 Lección 9.F.6: Optimización de Costos

### Analizar Billing

**Herramienta: gcp_analyze_billing**

```
Tú: ¿Cuánto estoy gastando en GCP este mes?

Claude: [analiza billing data]

💰 GCP BILLING ANALYSIS - Octubre 2025

*Resumen Mensual:*
Gasto actual: $2,345.67
Forecast fin de mes: $3,100.00
Budget: $3,500.00
Utilización: 88.6%

*Gasto por Servicio:*
┌─────────────────────┬──────────┬────────┐
│ Servicio            │ Costo    │ %      │
├─────────────────────┼──────────┼────────┤
│ Cloud Run           │ $890.00  │ 37.9%  │
│ Cloud SQL           │ $567.00  │ 24.2%  │
│ Cloud Storage       │ $345.00  │ 14.7%  │
│ BigQuery            │ $234.00  │ 10.0%  │
│ Cloud Functions     │ $123.00  │ 5.2%   │
│ Cloud Build         │ $89.00   │ 3.8%   │
│ Networking          │ $67.00   │ 2.9%   │
│ Otros               │ $30.67   │ 1.3%   │
└─────────────────────┴──────────┴────────┘

*Tendencia:*
Semana 1: $523
Semana 2: $578
Semana 3: $612 ← Incremento
Semana 4: $633 (proyección)

*Gasto por Región:*
us-central1: $1,890 (80.6%)
us-east1: $345 (14.7%)
europe-west1: $110.67 (4.7%)

*Top Recursos Costosos:*
1. Cloud SQL: mi-app-postgres-prod ($450/mes)
2. Cloud Run: mi-api (100M requests) ($340/mes)
3. Cloud Storage: backups bucket (2.3TB) ($230/mes)
4. BigQuery: analytics queries (5TB processed) ($234/mes)
5. Cloud Run: worker-service ($210/mes)

⚠️ Recomendaciones de ahorro disponibles
```

### Optimizar Costos

```
Claude: [analiza oportunidades]

💡 OPORTUNIDADES DE OPTIMIZACIÓN

*Alta Prioridad:*

1. 🔴 Cloud SQL Over-Provisioned
   Recurso: mi-app-postgres-prod
   Tier actual: db-n1-standard-2 (2 vCPU, 7.5GB)
   Utilización: CPU 18%, RAM 32%

   Recomendación: Downgrade a db-n1-standard-1
   Ahorro: $225/mes ($2,700/año)

2. 🔴 Cloud Storage Lifecycle Policy
   Bucket: backups (2.3TB)
   Tier: Standard (acceso < 1 vez/mes)

   Recomendación:
   - Nearline para backups 7-30 días
   - Coldline para backups > 30 días
   - Archive para backups > 90 días

   Ahorro: $138/mes ($1,656/año)

3. 🔴 BigQuery Partitioning
   Table: events (sin particiones)
   Queries escanean toda la tabla

   Recomendación: Partition por fecha
   Ahorro: ~40% en query costs ($94/mes)

*Media Prioridad:*

4. 🟡 Committed Use Discounts
   Cloud Run requests: Consistentemente alto

   Recomendación: 1-year commitment
   Ahorro: 20% (~$68/mes)

5. 🟡 Cloud Build Cache
   Builds reconstruyen todo cada vez

   Recomendación: Habilitar cache layers
   Ahorro: ~30% build time ($27/mes)

*Total Ahorro Potencial:*
Inmediato: $457/mes ($5,484/año)
Con commitment: $525/mes ($6,300/año)

¿Implemento las optimizaciones de alta prioridad?
```

### Implementar Optimizaciones

```
Tú: Sí, implementa todas las de alta prioridad

Claude: [aplica optimizaciones]

Aplicando optimizaciones...

1. [Cloud SQL Resize]
   mi-app-postgres-prod: db-n1-standard-2 → db-n1-standard-1

   Safety checks:
   ✓ Current load permite downgrade
   ✓ Connection pool ajustado
   ✓ No downtime (hot resize)

   [Ejecutando]
   ✓ Instance resized
   ✓ Application unaffected
   ✓ Monitoring confirmado

   Ahorro: $225/mes ✅

2. [Storage Lifecycle Policy]
   Bucket: backups

   [Creating policy]
   ```json
   {
     "lifecycle": {
       "rule": [
         {
           "action": {"type": "SetStorageClass", "storageClass": "NEARLINE"},
           "condition": {"age": 7, "matchesStorageClass": ["STANDARD"]}
         },
         {
           "action": {"type": "SetStorageClass", "storageClass": "COLDLINE"},
           "condition": {"age": 30, "matchesStorageClass": ["NEARLINE"]}
         },
         {
           "action": {"type": "SetStorageClass", "storageClass": "ARCHIVE"},
           "condition": {"age": 90, "matchesStorageClass": ["COLDLINE"]}
         },
         {
           "action": {"type": "Delete"},
           "condition": {"age": 365}
         }
       ]
     }
   }
   ```

   ✓ Policy applied
   ✓ Existing objects will transition

   Ahorro: $138/mes ✅

3. [BigQuery Partitioning]
   Table: app_analytics.events

   [Creating partitioned table]
   ```sql
   CREATE TABLE app_analytics.events_partitioned
   PARTITION BY DATE(timestamp)
   CLUSTER BY event_name, user_id
   AS SELECT * FROM app_analytics.events;
   ```

   [Migrating]
   ✓ Data copied to partitioned table
   ✓ Views updated
   ✓ Old table renamed to events_backup

   [Testing queries]
   Before: Scanned 450GB
   After: Scanned 15GB (last 30 days)
   Improvement: 97% less data scanned

   Ahorro: $94/mes ✅

✅ OPTIMIZACIONES COMPLETADAS

Total ahorro: $457/mes ($5,484/año)
Nuevo costo estimado: $2,643/año
Budget utilization: 75.5% (bajó de 88.6%)

Monitoreando performance por 48 horas...
```

---

## 📖 Lección 9.F.7: Seguridad - IAM y SecOps

### Security Command Center

**Herramienta: gcp_security_scan**

```
Tú: Ejecuta un security scan completo del proyecto

Claude: [ejecuta security assessment]

🔐 SECURITY COMMAND CENTER - Scan Results

*Security Health Score: 82/100* (Bueno)

*Hallazgos Críticos:* 🔴 (3)

1. Public Cloud Storage Bucket
   Bucket: mi-app-uploads
   Problema: Public access habilitado
   Riesgo: Exposición de datos sensibles
   Impacto: CRITICAL

   Afectado: ~2,300 archivos
   Incluyendo: Documentos de usuarios

   Remediación:
   - Quitar allUsers permiso
   - Implementar Signed URLs
   - Habilitar Uniform bucket-level access

2. Service Account con demasiados permisos
   SA: cloud-run-worker@...iam.gserviceaccount.com
   Rol actual: Editor (muy permisivo)

   Problema: Principio de least privilege violado
   Riesgo: Lateral movement si comprometido

   Remediación:
   - Usar roles específicos:
     * Storage Object Viewer
     * Firestore User
     * Cloud SQL Client

3. API Keys sin restricciones
   Key: AIzaSy...
   Used by: Frontend application
   Restricciones: Ninguna

   Riesgo: Uso no autorizado si key leak

   Remediación:
   - Restricción por HTTP referrers
   - Restricción por API específica
   - Rotar key

*Hallazgos Importantes:* 🟡 (5)

4. Logs retention demasiado corto
   Cloud Logging: 30 días
   Recomendación: 90+ días para compliance

5. No hay alertas de security events
   Sin alertas configuradas para:
   - IAM policy changes
   - Admin activity
   - Data access

6. Firewall rules permisivas
   Rule: allow-ssh-from-anywhere
   Source: 0.0.0.0/0
   Recommendation: Restrict to VPN/bastion

7. SSL certificates cerca de expiración
   Certificate: *.miapp.com
   Expires: En 15 días

8. MFA no habilitado para todos
   Users sin MFA: 3 de 8

*Compliance Checks:*
CIS GCP Foundation: 78% compliant
PCI-DSS: 85% compliant
SOC 2: 82% compliant

¿Remediar hallazgos críticos ahora?
```

### Implementar Security Fixes

```
Tú: Sí, arregla todos los críticos

Claude: [aplica security remediations]

Aplicando security fixes...

1. [Cloud Storage - Remove Public Access]
   Bucket: mi-app-uploads

   [Analyzing access]
   Current: allUsers can view
   Usage: 2,345 public requests/day

   [Implementing secure access]
   ✓ Removed allUsers permission
   ✓ Enabled Uniform bucket-level access
   ✓ Generated Signed URLs for existing links

   [Code for app]
   ```javascript
   const { Storage } = require('@google-cloud/storage');
   const storage = new Storage();

   async function getSignedUrl(filename) {
     const options = {
       version: 'v4',
       action: 'read',
       expires: Date.now() + 15 * 60 * 1000, // 15 minutes
     };

     const [url] = await storage
       .bucket('mi-app-uploads')
       .file(filename)
       .getSignedUrl(options);

     return url;
   }
   ```

   ✓ App code updated
   ✓ Deployment tested
   ✓ Public access removed

2. [Service Account - Least Privilege]
   SA: cloud-run-worker@

   Current roles:
   ❌ Editor (broad permissions)

   Applying specific roles:
   ✓ roles/storage.objectViewer
   ✓ roles/datastore.user
   ✓ roles/cloudsql.client

   [Testing]
   ✓ Worker service functional
   ✓ No permission errors
   ✓ Minimum permissions confirmed

3. [API Key Restrictions]
   Key: AIzaSy...

   Applying restrictions:
   ✓ HTTP referrers:
     - https://miapp.com/*
     - https://*.miapp.com/*

   ✓ API restrictions:
     - Maps JavaScript API
     - Places API

   ✓ New restricted key created
   ✓ Old key scheduled for deletion (7 days)
   ✓ Frontend updated with new key

[Security Posture]
Before: 82/100
After: 95/100 (+13 points) 🎉

Critical issues: 3 → 0 ✅
Important issues: 5 → 2

Remaining items:
• Configure security alerts (recommended)
• Extend log retention to 90 days
• Enable MFA for remaining users

¿Continúo con los items importantes?
```

---

## 📖 Lección 9.F.8: AI/ML con Vertex AI

### Usar Vision API

```
Tú: Analiza las imágenes subidas por usuarios para detectar contenido inapropiado

Claude: [integra Vision API]

Configurando Vision API para content moderation...

[Habilitando API]
✓ Cloud Vision API enabled

[Creating Cloud Function]

```javascript
const vision = require('@google-cloud/vision');
const { Storage } = require('@google-cloud/storage');
const { Firestore } = require('@google-cloud/firestore');

const client = new vision.ImageAnnotatorClient();
const storage = new Storage();
const firestore = new Firestore();

exports.moderateImage = async (file, context) => {
  const filePath = `gs://${file.bucket}/${file.name}`;

  console.log(`Analyzing image: ${filePath}`);

  try {
    // Safe Search Detection
    const [result] = await client.safeSearchDetection(filePath);
    const safeSearch = result.safeSearchAnnotation;

    // Label Detection (what's in the image)
    const [labels] = await client.labelDetection(filePath);
    const imageLabels = labels.labelAnnotations.map(l => l.description);

    // Explicit Content Detection
    const isExplicit =
      safeSearch.adult === 'VERY_LIKELY' ||
      safeSearch.violence === 'VERY_LIKELY';

    const isSuspicious =
      safeSearch.adult === 'LIKELY' ||
      safeSearch.violence === 'LIKELY' ||
      safeSearch.racy === 'VERY_LIKELY';

    // Store analysis results
    await firestore.collection('image_moderation').doc(file.name).set({
      filePath,
      uploadedAt: new Date(context.timestamp),
      safeSearch: {
        adult: safeSearch.adult,
        violence: safeSearch.violence,
        racy: safeSearch.racy,
        medical: safeSearch.medical,
        spoof: safeSearch.spoof
      },
      labels: imageLabels,
      status: isExplicit ? 'rejected' : isSuspicious ? 'review' : 'approved'
    });

    // Take action based on results
    if (isExplicit) {
      // Delete file
      await storage.bucket(file.bucket).file(file.name).delete();
      console.log(`Deleted explicit content: ${file.name}`);

      // Notify admin
      await notifyAdmin({
        type: 'explicit_content_detected',
        file: file.name,
        analysis: safeSearch
      });
    } else if (isSuspicious) {
      // Flag for manual review
      await flagForReview(file.name);
      console.log(`Flagged for review: ${file.name}`);
    } else {
      console.log(`Image approved: ${file.name}`);
    }

  } catch (error) {
    console.error('Error analyzing image:', error);
  }
};

async function notifyAdmin(alert) {
  // Send notification (email, Slack, etc)
}

async function flagForReview(fileName) {
  // Add to review queue
}
```

[Deploying]
✓ Function: moderate-images
✓ Trigger: Cloud Storage (on file upload)
✓ Bucket: mi-app-uploads
✓ Runtime: Node.js 18

[Testing]
Uploaded test images:
✓ Safe image → Approved ✅
✓ Violent image → Rejected 🚫
✓ Borderline image → Flagged for review ⚠️

Content moderation activo 🛡️

Workflow:
1. Usuario sube imagen
2. Vision API analiza automáticamente
3. Contenido inapropiado eliminado
4. Admin notificado de problemas
5. Safe content aprobado

Protección automática contra contenido no deseado.
```

### Natural Language API

```
Tú: Analiza el sentiment de reviews de usuarios

Claude: [integra Natural Language API]

```javascript
const language = require('@google-cloud/language');
const client = new language.LanguageServiceClient();

exports.analyzeReview = async (req, res) => {
  const { reviewText, productId } = req.body;

  // Sentiment Analysis
  const [sentiment] = await client.analyzeSentiment({
    document: {
      content: reviewText,
      type: 'PLAIN_TEXT',
    },
  });

  const score = sentiment.documentSentiment.score;
  const magnitude = sentiment.documentSentiment.magnitude;

  // Entity Recognition
  const [entities] = await client.analyzeEntities({
    document: {
      content: reviewText,
      type: 'PLAIN_TEXT',
    },
  });

  const mentions = entities.entities.map(entity => ({
    name: entity.name,
    type: entity.type,
    salience: entity.salience,
  }));

  // Classify sentiment
  let sentimentLabel;
  if (score > 0.25) sentimentLabel = 'positive';
  else if (score < -0.25) sentimentLabel = 'negative';
  else sentimentLabel = 'neutral';

  // Save analysis
  const analysis = {
    productId,
    reviewText,
    sentiment: {
      score,
      magnitude,
      label: sentimentLabel,
    },
    entities: mentions,
    analyzedAt: new Date(),
  };

  await firestore.collection('review_analysis').add(analysis);

  res.json(analysis);
};
```

[Analysis Example]

Review: "This product is amazing! Fast shipping and great quality."

Result:
```json
{
  "sentiment": {
    "score": 0.8,
    "magnitude": 0.9,
    "label": "positive"
  },
  "entities": [
    {"name": "product", "type": "CONSUMER_GOOD", "salience": 0.7},
    {"name": "shipping", "type": "OTHER", "salience": 0.3}
  ]
}
```

Review: "Terrible experience. Product broke after 2 days."

Result:
```json
{
  "sentiment": {
    "score": -0.9,
    "magnitude": 1.0,
    "label": "negative"
  },
  "entities": [
    {"name": "experience", "type": "OTHER", "salience": 0.5},
    {"name": "Product", "type": "CONSUMER_GOOD", "salience": 0.5}
  ]
}
```

Use cases:
• Product quality monitoring
• Customer satisfaction tracking
• Auto-prioritize negative reviews
• Identify trending issues

Sentiment analysis activo 📊
```

---

## 🛠️ Ejercicios Prácticos

### Ejercicio 9.F.1: Setup Básico
1. Crea un Service Account en GCP
2. Configura el MCP de GCP
3. Verifica la conexión
4. Lista tus proyectos y recursos
5. Documenta la configuración

### Ejercicio 9.F.2: Deploy Serverless
1. Crea una aplicación simple (API o web)
2. Despliégala a Cloud Run
3. Configura dominio personalizado
4. Configura CI/CD con Cloud Build
5. Verifica deployments automáticos

### Ejercicio 9.F.3: Databases
1. Crea una instancia de Cloud SQL o Firestore
2. Diseña schema para tu aplicación
3. Implementa conexión desde Cloud Run
4. Ejecuta queries de prueba
5. Documenta la arquitectura

### Ejercicio 9.F.4: Seguridad
1. Ejecuta security scan completo
2. Identifica vulnerabilidades
3. Remedía hallazgos críticos
4. Configura alertas de seguridad
5. Documenta mejoras

### Ejercicio 9.F.5: AI/ML
1. Implementa Vision API para tu app
2. O Natural Language API
3. Crea Cloud Function para procesamiento
4. Prueba con datos reales
5. Analiza resultados

---

## 📝 Examen 9.F: Maestría del MCP de GCP

### Parte 1: Preguntas Teóricas (3 puntos)

**Pregunta 1:** ¿Cuáles son las 3 principales ventajas de gestionar GCP desde Claude Code?

**Pregunta 2:** Explica cuándo usar cada servicio:
- a) Cloud Run vs Cloud Functions vs GKE
- b) Cloud SQL vs Firestore vs BigQuery
- c) Standard Storage vs Nearline vs Coldline
- d) Committed Use vs On-Demand pricing

**Pregunta 3:** ¿Qué es el principio de "least privilege" y cómo aplicarlo en IAM de GCP?

### Parte 2: Configuración (2 puntos)

1. Muestra cómo crear un Service Account con permisos mínimos
2. Configura el MCP de GCP para múltiples proyectos
3. Explica cómo proteger las credenciales

### Parte 3: Práctica - Aplicación Completa (5 puntos)

Escenario: Despliega una aplicación full-stack en GCP.

**Requisitos:**
- Backend API en Cloud Run
- Frontend web
- Database (Cloud SQL o Firestore)
- Storage para archivos
- CI/CD automático

**Tareas:**
1. Diseña la arquitectura
2. Despliega todos los componentes
3. Configura seguridad (IAM, networks)
4. Implementa monitoring
5. Optimiza costos

Documenta todo desde Claude Code.

### Parte 4: Proyecto Real (Bonus +3 puntos)

Elige uno:

**Opción A: Content Moderation System**
1. Implementa sistema completo de moderación con:
   - Vision API para imágenes
   - Natural Language para texto
   - Cloud Functions para procesamiento
   - Firestore para resultados
2. Incluye auto-deletion de contenido inapropiado
3. Dashboard de analytics

**Opción B: Cost Optimization Project**
1. Analiza proyecto GCP real
2. Identifica todas las optimizaciones
3. Implementa mejoras (mínimo 10)
4. Calcula ROI
5. Documenta proceso completo

---

## ✅ Cómo Enviar Tu Examen

### Para la Parte 1:
```
Parte 1:
P1: [respuesta]
P2: [respuestas detalladas]
P3: [explicación de least privilege]
```

### Para la Parte 2:
Archivos de configuración y procedimientos.

### Para la Parte 3:
- Diagrama de arquitectura
- Comandos/configuración usados
- URLs de servicios
- Evidencia de funcionamiento

### Para la Parte 4:
- Código completo
- Screenshots
- Métricas de performance/costos
- Documentación
- Lecciones aprendidas

---

## 🎯 Checklist de Dominio

**Configuración**
- [ ] Service Account creation
- [ ] MCP de GCP setup
- [ ] Múltiples proyectos
- [ ] Seguridad de credenciales

**Compute**
- [ ] Cloud Run deployments
- [ ] Cloud Functions
- [ ] CI/CD con Cloud Build
- [ ] Container management

**Databases**
- [ ] Cloud SQL
- [ ] Firestore
- [ ] BigQuery
- [ ] Data modeling

**Storage**
- [ ] Cloud Storage buckets
- [ ] Lifecycle policies
- [ ] Signed URLs
- [ ] Access control

**Security**
- [ ] IAM roles y permissions
- [ ] Security Command Center
- [ ] Secret Manager
- [ ] Compliance

**Costos**
- [ ] Billing analysis
- [ ] Cost optimization
- [ ] Budget alerts
- [ ] Resource sizing

**AI/ML**
- [ ] Vision API
- [ ] Natural Language API
- [ ] Content moderation
- [ ] ML integrations

---

## 💡 Mejores Prácticas

### 1. IAM - Least Privilege
```
✅ Bueno:
- Roles específicos por servicio
- Service accounts por aplicación
- Regular audits de permisos
- Remove unused permissions

❌ Evita:
- Editor/Owner roles generales
- Shared service accounts
- Never audit permissions
- Grant all access "por si acaso"
```

### 2. Optimización de Costos
```
✅ Bueno:
- Right-size recursos regularmente
- Lifecycle policies en Storage
- Committed use para workloads predecibles
- Monitor y alerta de costos

❌ Evita:
- Over-provision recursos
- Ignorar billing reports
- No usar committed use
- Dejar recursos idle
```

### 3. Security
```
✅ Bueno:
- Security Command Center activo
- Regular security scans
- Secrets en Secret Manager
- Network isolation

❌ Evita:
- Disable security features
- Hardcode secrets
- Public exposure default
- No monitoring de security
```

### 4. Serverless Best Practices
```
✅ Bueno:
- Cloud Run para APIs
- Functions para event-driven
- Auto-scaling configurado
- Cold start optimization

❌ Evita:
- Always-on cuando no necesario
- No configurar limits
- Ignore cold starts
- Synchronous cuando async mejor
```

### 5. Observability
```
✅ Bueno:
- Cloud Logging habilitado
- Cloud Monitoring dashboards
- Alertas proactivas
- Tracing distribuido

❌ Evita:
- Deploy sin logs
- No alerts configuradas
- Reactive troubleshooting
- No performance monitoring
```

---

## 🚀 Siguiente Nivel

1. **Advanced GCP Services**
   - Anthos (hybrid/multi-cloud)
   - Apigee (API management)
   - Dataflow (stream processing)
   - Pub/Sub (messaging)

2. **Multi-Cloud**
   - GCP + AWS
   - GCP + Azure
   - Cross-cloud architecture
   - Data replication

3. **ML/AI Advanced**
   - Vertex AI custom models
   - AutoML
   - AI Platform Pipelines
   - TensorFlow on GCP

---

## 📚 Recursos Adicionales

### Documentación
- [GCP Documentation](https://cloud.google.com/docs)
- [Cloud Run Docs](https://cloud.google.com/run/docs)
- [Firestore Docs](https://cloud.google.com/firestore/docs)
- [BigQuery Docs](https://cloud.google.com/bigquery/docs)

### Learning
- [Google Cloud Skills Boost](https://www.cloudskillsboost.google/)
- [GCP Architecture Framework](https://cloud.google.com/architecture/framework)
- [GCP Best Practices](https://cloud.google.com/docs/enterprise/best-practices-for-enterprise-organizations)

### Tools
- [Cloud Console](https://console.cloud.google.com)
- [gcloud CLI](https://cloud.google.com/sdk/gcloud)
- [Cloud Shell](https://cloud.google.com/shell)

---

**¡Subcapítulo 9.F Completo!**

Has aprendido a gestionar Google Cloud Platform con Claude Code. Ahora puedes desplegar aplicaciones serverless, gestionar bases de datos, optimizar costos, asegurar infraestructura y usar servicios de IA/ML.

**Anterior**: `capitulo_09_mcp_vercel.md` (Vercel MCP)
**Siguiente**: `capitulo_09_mcp_alby.md` (Alby MCP)

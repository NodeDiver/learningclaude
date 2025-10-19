# Subcapítulo 9.D: MCP de Azure - Gestiona Cloud de Microsoft

**Duración**: 60 minutos
**Dificultad**: Avanzado
**Prerrequisito**: Capítulo 9 (MCP Básico)

---

## 🎯 Objetivos de Aprendizaje

Al final de este subcapítulo, podrás:
- Entender qué es el MCP de Azure y sus capacidades cloud
- Configurar autenticación segura con Azure AD
- Gestionar recursos de Azure (VMs, App Services, Functions)
- Automatizar deployments en Azure
- Monitorear aplicaciones y recursos
- Optimizar costos de infraestructura
- Implementar best practices de seguridad en Azure
- Generar código production-ready para servicios Azure

---

## 📖 Lección 9.D.1: ¿Qué es el MCP de Azure?

El **MCP de Azure** es un servidor que conecta Claude Code directamente con Microsoft Azure, permitiéndote gestionar infraestructura cloud, deployments, monitoreo y costos usando lenguaje natural.

### Concepto Fundamental

Piensa en el MCP de Azure como un **DevOps engineer automatizado**:

**Sin MCP de Azure:**
```
Tú ←→ Claude Code
       ↓ (manualmente)
   Azure Portal ←→ Azure Services
   (clicks manuales, scripts complejos)
```

**Con MCP de Azure:**
```
Tú ←→ Claude Code ←→ MCP Azure ←→ Azure Cloud
     ("despliega la app a Azure" → automatización completa)
```

### ¿Qué Puede Hacer?

El MCP de Azure proporciona **herramientas poderosas** para:

✅ **Gestión de Recursos**
- Listar y crear recursos (VMs, App Services, Storage)
- Configurar resource groups
- Gestionar identidades y permisos
- Administrar virtual networks

✅ **Deployments Automatizados**
- Deploy de aplicaciones web
- Azure Functions serverless
- Container instances (ACI)
- Kubernetes (AKS) orchestration

✅ **Monitoreo y Logs**
- Application Insights analytics
- Log Analytics queries
- Métricas en tiempo real
- Alertas y diagnósticos

✅ **Optimización de Costos**
- Análisis de gastos
- Recomendaciones de ahorro
- Resource sizing óptimo
- Budget alerts

✅ **Seguridad**
- Azure Security Center
- Key Vault para secretos
- Identity and Access Management
- Network security groups

✅ **Bases de Datos**
- Azure SQL Database
- Cosmos DB
- PostgreSQL/MySQL managed
- Redis Cache

### Ventajas Clave

| Sin MCP Azure | Con MCP Azure |
|---------------|---------------|
| Portal web manual | Automatización desde Claude |
| Scripts ARM/Bicep complejos | Lenguaje natural |
| Documentación fragmentada | Claude conoce best practices |
| Configuración propensa a errores | Validación automática |
| Monitoreo manual | Análisis inteligente |
| **Lento y complejo** | **Rápido y confiable** ⚡ |

---

## 📖 Lección 9.D.2: Instalación y Configuración

### Paso 1: Crear Service Principal en Azure

Necesitas crear credenciales para que Claude acceda a Azure:

**Opción A: Usando Azure CLI**
```bash
# Login en Azure
az login

# Crear Service Principal
az ad sp create-for-rbac \
  --name "claude-code-sp" \
  --role Contributor \
  --scopes /subscriptions/{subscription-id}

# Output (guarda estos valores):
{
  "appId": "12345678-1234-1234-1234-123456789012",
  "displayName": "claude-code-sp",
  "password": "tu-password-generado",
  "tenant": "87654321-4321-4321-4321-210987654321"
}
```

**Opción B: Desde Azure Portal**
```
1. Azure Active Directory
2. App registrations → New registration
3. Name: "Claude Code MCP"
4. Register
5. Certificates & secrets → New client secret
6. Copiar: Client ID, Tenant ID, Client Secret
7. Subscriptions → Access control (IAM) → Add role assignment
8. Role: Contributor
9. Select: "Claude Code MCP"
```

### Paso 2: Instalar el Servidor MCP

```bash
# Instalar el MCP de Azure
npm install -g @modelcontextprotocol/server-azure

# O usando Claude Code CLI
claude mcp add --transport stdio \
  --name azure \
  --command "npx" \
  --args "-y @modelcontextprotocol/server-azure"
```

### Paso 3: Configuración Manual

**Archivo: `.claude/mcp.json`** (proyecto específico)
```json
{
  "servers": {
    "azure": {
      "transport": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-azure"
      ],
      "env": {
        "AZURE_SUBSCRIPTION_ID": "your-subscription-id",
        "AZURE_TENANT_ID": "your-tenant-id",
        "AZURE_CLIENT_ID": "your-client-id",
        "AZURE_CLIENT_SECRET": "your-client-secret"
      }
    }
  }
}
```

O en **`~/.claude/mcp.json`** (global - todos los proyectos)

### Paso 4: Usar Variables de Entorno (Recomendado)

Para mayor seguridad:

**Archivo: `.env`**
```bash
AZURE_SUBSCRIPTION_ID=12345678-1234-1234-1234-123456789012
AZURE_TENANT_ID=87654321-4321-4321-4321-210987654321
AZURE_CLIENT_ID=your-client-id-here
AZURE_CLIENT_SECRET=your-client-secret-here
```

**Actualiza `mcp.json`:**
```json
{
  "servers": {
    "azure": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-azure"],
      "env": {
        "AZURE_SUBSCRIPTION_ID": "${AZURE_SUBSCRIPTION_ID}",
        "AZURE_TENANT_ID": "${AZURE_TENANT_ID}",
        "AZURE_CLIENT_ID": "${AZURE_CLIENT_ID}",
        "AZURE_CLIENT_SECRET": "${AZURE_CLIENT_SECRET}"
      }
    }
  }
}
```

### Paso 5: Múltiples Subscriptions

Si gestionas múltiples subscripciones:

```json
{
  "servers": {
    "azure-prod": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-azure"],
      "env": {
        "AZURE_SUBSCRIPTION_ID": "${AZURE_PROD_SUBSCRIPTION_ID}",
        "AZURE_TENANT_ID": "${AZURE_TENANT_ID}",
        "AZURE_CLIENT_ID": "${AZURE_PROD_CLIENT_ID}",
        "AZURE_CLIENT_SECRET": "${AZURE_PROD_CLIENT_SECRET}"
      }
    },
    "azure-dev": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-azure"],
      "env": {
        "AZURE_SUBSCRIPTION_ID": "${AZURE_DEV_SUBSCRIPTION_ID}",
        "AZURE_TENANT_ID": "${AZURE_TENANT_ID}",
        "AZURE_CLIENT_ID": "${AZURE_DEV_CLIENT_ID}",
        "AZURE_CLIENT_SECRET": "${AZURE_DEV_CLIENT_SECRET}"
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
# azure (stdio) - @modelcontextprotocol/server-azure [connected ✓]
```

### Probar Conexión

```
Tú: ¿Puedes conectarte a Azure?

Claude: [usa azure_test_connection]
✓ Conexión exitosa a Azure
Subscription: Mi Empresa Production
Tenant: miempresa.onmicrosoft.com
Subscription ID: 12345678-1234-1234...
Resource Groups: 15
Active Resources: 87
```

---

## 📖 Lección 9.D.3: Gestión de Recursos

### Herramienta: azure_list_resources

Lista todos los recursos en la subscription.

```
Tú: Muéstrame todos mis recursos de Azure

Claude: [usa azure_list_resources]

Recursos en Subscription "Mi Empresa Production" (87 recursos):

📦 Resource Groups (15):
• rg-production-app
• rg-production-db
• rg-staging
• rg-development
• rg-shared-services
...

🌐 App Services (8):
• app-web-prod (Running) - Standard S1
• app-api-prod (Running) - Premium P1v2
• app-admin-prod (Running) - Standard S1
• app-web-staging (Running) - Basic B1
...

💾 Storage Accounts (12):
• stproddata001 (Hot tier) - 245 GB
• stprodlogs001 (Cool tier) - 1.2 TB
• stprodbackup001 (Archive tier) - 5.6 TB
...

🗄️ Databases (6):
• sqldb-prod (Running) - S3 tier
• cosmos-prod (Running) - 400 RU/s
• postgres-prod (Running) - General Purpose
...

🔐 Key Vaults (3):
• kv-prod-secrets
• kv-shared-certs
• kv-dev-config
```

### Crear Resource Group

**Herramienta: azure_create_resource_group**

```
Tú: Crea un resource group para un nuevo proyecto de e-commerce

Claude: [usa azure_create_resource_group]

✓ Resource Group creado exitosamente

*Name:* rg-ecommerce-prod
*Location:* East US
*Tags:*
  - Environment: Production
  - Project: E-Commerce
  - CostCenter: Engineering
  - ManagedBy: DevOps

El resource group está listo para recibir recursos 🎉

Próximos pasos sugeridos:
1. Crear App Service Plan
2. Crear App Service para web
3. Crear Azure SQL Database
4. Configurar Application Insights
```

### Gestionar App Service

```
Tú: Crea un App Service para la aplicación web del e-commerce

Claude: [crea App Service con best practices]

Creando infraestructura para web app...

1. [Crea App Service Plan]
✓ App Service Plan: plan-ecommerce-prod
  - Tier: Standard S1
  - Instances: 2 (auto-scaling enabled)
  - Location: East US

2. [Crea App Service]
✓ App Service: app-ecommerce-web-prod
  - Runtime: Node.js 18 LTS
  - Always On: Enabled
  - HTTPS Only: Enabled
  - Minimum TLS: 1.2

3. [Configura Application Settings]
✓ Variables de entorno configuradas:
  - NODE_ENV=production
  - WEBSITE_NODE_DEFAULT_VERSION=18-lts
  - Key Vault reference para secrets

4. [Configura Deployment]
✓ Deployment slots creados:
  - Production (active)
  - Staging (for testing)

5. [Configura Monitoring]
✓ Application Insights habilitado
  - Instrumentation key configurada
  - Auto-collection enabled

URL: https://app-ecommerce-web-prod.azurewebsites.net
Deployment URL: https://app-ecommerce-web-prod-staging.azurewebsites.net

¿Quieres que configure CI/CD desde GitHub?
```

---

## 📖 Lección 9.D.4: Deployments Automatizados

### Deploy de Aplicación Web

```
Tú: Despliega mi aplicación Node.js a Azure

Claude: Analizando tu proyecto y configurando deployment...

[Detecta configuración del proyecto]
✓ Proyecto: Node.js + Express
✓ Build command: npm run build
✓ Start command: npm start
✓ Port: 3000

[Prepara deployment]
1. Instalando dependencias...
   npm install --production

2. Compilando aplicación...
   npm run build
   ✓ Build completado (2m 15s)

3. Creando deployment package...
   ✓ Package: app-v1.2.5.zip (45 MB)

4. Deploying a Azure App Service...
   ✓ Uploaded to app-ecommerce-web-prod-staging
   ✓ Deployment successful

5. Ejecutando health checks...
   ✓ App respondiendo en /health
   ✓ Response time: 124ms
   ✓ Status: 200 OK

6. Running smoke tests...
   ✓ Homepage loads correctly
   ✓ API endpoints responding
   ✓ Database connection OK

[Deployment Summary]
Environment: Staging
Version: v1.2.5
URL: https://app-ecommerce-web-prod-staging.azurewebsites.net
Status: ✅ Healthy

¿Quieres hacer swap a producción?
```

### Swap Staging a Production

```
Tú: Sí, muévelo a producción

Claude: [ejecuta deployment swap]

Iniciando deployment swap a producción...

Pre-swap checks:
✓ Staging health: OK
✓ No active incidents
✓ Resource utilization: Normal
✓ Database migrations: Applied

[Ejecutando swap]
1. Warming up staging slot...
2. Swapping slots...
   Staging → Production
   Production → Staging
3. Verifying production...

✓ Swap completado exitosamente

Production Status:
🌐 URL: https://app-ecommerce-web-prod.azurewebsites.net
✅ Health: OK
📊 Response time: 118ms
👥 Active users: 1,234

Previous version ahora en staging (rollback available)

Monitoreando por 15 minutos...
[Auto-rollback si error rate > 5%]
```

### Deploy de Azure Function

```
Tú: Crea una Azure Function para procesar pagos

Claude: Generaré una Function App con best practices...

[Crea infraestructura]
✓ Storage Account: stfuncecommerce
✓ Application Insights: ai-func-ecommerce
✓ Function App: func-ecommerce-payments

[Genera código de la función]

```javascript
// func-ecommerce-payments/processPayment/index.js

const { CosmosClient } = require("@azure/cosmos");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async function (context, req) {
    context.log('Processing payment request');

    try {
        const { amount, currency, customerId, metadata } = req.body;

        // Validación
        if (!amount || !customerId) {
            context.res = {
                status: 400,
                body: { error: "Missing required fields" }
            };
            return;
        }

        // Procesar pago con Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Convert to cents
            currency: currency || 'usd',
            customer: customerId,
            metadata: metadata,
            automatic_payment_methods: { enabled: true }
        });

        // Guardar en Cosmos DB
        const cosmosClient = new CosmosClient(process.env.COSMOS_CONNECTION);
        const database = cosmosClient.database("ecommerce");
        const container = database.container("payments");

        await container.items.create({
            id: paymentIntent.id,
            customerId,
            amount,
            currency,
            status: paymentIntent.status,
            createdAt: new Date().toISOString(),
            metadata
        });

        context.log('Payment processed successfully:', paymentIntent.id);

        context.res = {
            status: 200,
            body: {
                paymentIntentId: paymentIntent.id,
                status: paymentIntent.status,
                clientSecret: paymentIntent.client_secret
            }
        };

    } catch (error) {
        context.log.error('Payment processing error:', error);

        context.res = {
            status: 500,
            body: { error: error.message }
        };
    }
};
```

[Configuración]
✓ Runtime: Node.js 18
✓ Trigger: HTTP
✓ Authorization: Function key
✓ CORS: Configured
✓ Environment variables: Set from Key Vault

[Deploy]
✓ Function deployed successfully
✓ URL: https://func-ecommerce-payments.azurewebsites.net/api/processPayment

[Testing]
✓ Function responding
✓ Integration with Stripe: OK
✓ Cosmos DB connection: OK

La función está lista para procesar pagos 💳
```

---

## 📖 Lección 9.D.5: Monitoreo y Logs

### Application Insights Analytics

**Herramienta: azure_query_app_insights**

```
Tú: Muéstrame métricas de la aplicación en las últimas 24 horas

Claude: [consulta Application Insights]

📊 MÉTRICAS DE APLICACIÓN - Últimas 24 horas

*Performance:*
┌────────────────────┬─────────┬─────────┬─────────┐
│ Métrica            │ Avg     │ P95     │ P99     │
├────────────────────┼─────────┼─────────┼─────────┤
│ Response time      │ 145ms   │ 450ms   │ 890ms   │
│ Server time        │ 95ms    │ 320ms   │ 670ms   │
│ Dependency calls   │ 50ms    │ 180ms   │ 350ms   │
└────────────────────┴─────────┴─────────┴─────────┘

*Traffic:*
- Total requests: 234,567
- Successful (2xx): 229,345 (97.8%)
- Client errors (4xx): 4,123 (1.7%)
- Server errors (5xx): 1,099 (0.5%)

*Top Endpoints:*
1. GET /api/products - 45,678 requests
2. GET /api/users/:id - 34,567 requests
3. POST /api/orders - 12,345 requests
4. GET /api/search - 8,901 requests

*Errors (últimas 24h):*
⚠️ 1,099 server errors detectados

Top 3 errores:
1. TypeError: Cannot read property 'id' (456 occurrences)
   - Endpoint: GET /api/orders/:id
   - File: src/controllers/orders.js:45

2. Database timeout (234 occurrences)
   - Query: SELECT * FROM products WHERE...
   - Duration: > 30s

3. External API error - Stripe (123 occurrences)
   - Message: Rate limit exceeded

¿Quieres que analice algún error específico?
```

### Analizar Logs

```
Tú: Investiga por qué hay tantos errores de "Cannot read property 'id'"

Claude: [analiza logs detalladamente]

🔍 Análisis de Error: TypeError en orders.js:45

[Query a Log Analytics]
Encontrados 456 errores en las últimas 24 horas

*Patrón temporal:*
- Spike principal: Hoy 14:30-15:00 (234 errores)
- Spike secundario: Hoy 18:15-18:30 (123 errores)
- Resto: Distribuido uniformemente

*Stack trace común:*
```
TypeError: Cannot read property 'id' of undefined
    at OrderController.getById (src/controllers/orders.js:45:28)
    at Layer.handle (express/lib/router/layer.js:95:5)
    at next (express/lib/router/route.js:137:13)
```

*Análisis del código (línea 45):*
```javascript
async getById(req, res) {
    const order = await Order.findById(req.params.id);
    const userId = order.user.id; // ← Línea 45: Falla aquí
    ...
}
```

*Causa raíz:*
El orden no siempre tiene usuario populated.
Cuando `order.user` es undefined, `order.user.id` causa error.

*Requests afectados:*
- Order IDs sin usuario asociado
- Mayormente órdenes antiguas (pre-2024)
- 456 órdenes específicas en DB

*Fix sugerido:*
```javascript
async getById(req, res) {
    const order = await Order.findById(req.params.id)
        .populate('user'); // Populate user

    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
    }

    const userId = order.user?.id; // Optional chaining
    // o validar: if (!order.user) { ... }
    ...
}
```

¿Quieres que aplique este fix?
```

---

## 📖 Lección 9.D.6: Optimización de Costos

### Análisis de Gastos

**Herramienta: azure_cost_analysis**

```
Tú: ¿Cuánto estoy gastando en Azure este mes?

Claude: [analiza costos detalladamente]

💰 ANÁLISIS DE COSTOS - Octubre 2025

*Resumen Mensual:*
- Gasto actual: $3,456.78
- Estimado fin de mes: $4,234.50
- Budget mensual: $5,000.00
- Utilización: 84.7% del budget

*Gasto por Servicio:*
┌──────────────────────┬──────────┬────────┐
│ Servicio             │ Costo    │ %      │
├──────────────────────┼──────────┼────────┤
│ App Services         │ $1,234   │ 35.7%  │
│ Azure SQL Database   │ $890     │ 25.7%  │
│ Storage Accounts     │ $567     │ 16.4%  │
│ Application Insights │ $234     │ 6.8%   │
│ Virtual Network      │ $156     │ 4.5%   │
│ Key Vault            │ $89      │ 2.6%   │
│ Cosmos DB            │ $78      │ 2.3%   │
│ Azure Functions      │ $45      │ 1.3%   │
│ Otros                │ $163.78  │ 4.7%   │
└──────────────────────┴──────────┴────────┘

*Tendencia:*
Semana 1: $765
Semana 2: $823
Semana 3: $912  ← Incremento
Semana 4: $956  ← Proyección

*Gasto por Resource Group:*
1. rg-production-app: $2,345 (67.8%)
2. rg-production-db: $678 (19.6%)
3. rg-staging: $234 (6.8%)
4. rg-shared-services: $199.78 (5.8%)

⚠️ Alerts:
- App Service "app-api-prod" usando Premium P1v2
  Sugerencia: Evaluar downgrade a Standard S1
  Ahorro estimado: $156/mes
```

### Recomendaciones de Ahorro

```
Claude: [analiza oportunidades de optimización]

💡 OPORTUNIDADES DE AHORRO

*Alta Prioridad (ahorro inmediato):*

1. 🔴 App Service Over-Provisioned
   - Recurso: app-api-prod
   - Actual: Premium P1v2 ($234/mes)
   - CPU promedio: 15%
   - Memoria promedio: 25%
   - Recomendación: Downgrade a Standard S1
   - Ahorro: $156/mes ($1,872/año)

2. 🔴 Storage Account Tier Incorrecto
   - Recurso: stprodlogs001
   - Actual: Hot tier (acceso < 1 vez/semana)
   - Recomendación: Cambiar a Cool tier
   - Ahorro: $89/mes ($1,068/año)

3. 🔴 SQL Database Idle
   - Recurso: sqldb-dev
   - Uso: 2 queries/día
   - Actual: S3 tier
   - Recomendación: S0 tier o Serverless
   - Ahorro: $45/mes ($540/año)

*Media Prioridad:*

4. 🟡 Reserved Instances
   - App Services en producción
   - Uptime: 24/7 (predecible)
   - Recomendación: Reserved Instance (1 año)
   - Ahorro: 20% (~$300/mes, $3,600/año)

5. 🟡 Auto-Scaling no Configurado
   - Recursos: app-web-prod, app-admin-prod
   - Recomendación: Configurar scale-down nocturno
   - Ahorro estimado: $67/mes ($804/año)

*Total Ahorro Potencial:*
Inmediato: $290/mes ($3,480/año)
Con Reserved Instances: $590/mes ($7,080/año)

¿Quieres que implemente alguna de estas optimizaciones?
```

### Implementar Optimizaciones

```
Tú: Sí, implementa las 3 optimizaciones de alta prioridad

Claude: [aplica cambios de optimización]

Aplicando optimizaciones de costos...

1. [Downgrade App Service]
   app-api-prod: Premium P1v2 → Standard S1

   Pre-check:
   ✓ CPU < 20% (safe para S1)
   ✓ RAM < 30% (safe para S1)
   ✓ No requiere features de Premium
   ✓ Downtime: ~30 segundos

   [Ejecuta cambio]
   ✓ Scaled down successfully
   ✓ App responding normally
   ✓ Performance metrics: OK

   Ahorro: $156/mes

2. [Cambiar Storage Tier]
   stprodlogs001: Hot → Cool

   Analysis:
   ✓ Último acceso: Hace 12 días
   ✓ Accesos/mes: ~4
   ✓ Cool tier optimal

   [Ejecuta cambio]
   ✓ Tier changed
   ✓ Data integrity: Verified

   Ahorro: $89/mes

3. [Downgrade SQL Database]
   sqldb-dev: S3 → Serverless

   Safety checks:
   ✓ Dev environment (no 24/7)
   ✓ Queries < 10/día
   ✓ No SLA requirements

   [Ejecuta migración]
   ✓ Migrated to Serverless tier
   ✓ Auto-pause: Enabled (60 min)
   ✓ Min capacity: 0.5 vCore
   ✓ Max capacity: 2 vCore

   Ahorro: $45/mes

✅ OPTIMIZACIONES COMPLETADAS

Total ahorro: $290/mes ($3,480/año)
Nuevo costo mensual estimado: $3,944.50
Utilización de budget: 78.9%

Monitoreando performance por 48 horas...
```

---

## 📖 Lección 9.D.7: Seguridad y Best Practices

### Azure Security Center

**Herramienta: azure_security_assessment**

```
Tú: Revisa la seguridad de mi infraestructura en Azure

Claude: [ejecuta security assessment]

🔐 AZURE SECURITY ASSESSMENT

*Security Score: 78/100* (Bueno, mejorable)

*Hallazgos Críticos:* 🔴

1. Storage Account sin HTTPS forzado
   - Recurso: stproddata001
   - Riesgo: Transmisión no encriptada
   - Remediación: Enforce HTTPS only
   - Impacto: Alto

2. Network Security Group demasiado permisivo
   - Recurso: nsg-production-app
   - Problema: Puerto 22 (SSH) abierto a 0.0.0.0/0
   - Remediación: Restringir a IPs específicas
   - Impacto: Alto

3. SQL Database sin Advanced Threat Protection
   - Recurso: sqldb-prod
   - Riesgo: Sin detección de anomalías
   - Remediación: Habilitar ATP
   - Costo adicional: ~$15/mes

*Hallazgos Importantes:* 🟡

4. App Service sin Managed Identity
   - Recursos: app-web-prod, app-api-prod
   - Recomendación: Usar Managed Identity para Key Vault
   - Beneficio: No más connection strings hardcodeados

5. No hay backup automático configurado
   - Recursos: Todas las databases
   - Recomendación: Habilitar automated backups
   - Retention: 35 días

6. TLS 1.0/1.1 aún habilitado
   - Recursos: Varios App Services
   - Recomendación: Forzar TLS 1.2 mínimo
   - Compliance: PCI-DSS requirement

*Recomendaciones:* 💡

7. Habilitar Azure Defender
   - Cobertura: App Services, SQL, Storage
   - Costo: ~$45/mes
   - Beneficio: Advanced threat protection

8. Implementar Azure Policy
   - Enforce tagging standards
   - Restrict VM sizes
   - Require encryption

¿Quieres que remedie los hallazgos críticos?
```

### Implementar Fixes de Seguridad

```
Tú: Sí, arregla todos los hallazgos críticos

Claude: [aplica remediaciones de seguridad]

Aplicando fixes de seguridad...

1. [Storage Account - Force HTTPS]
   stproddata001

   ✓ "Secure transfer required" enabled
   ✓ HTTP requests ahora rechazados
   ✓ All traffic over HTTPS

2. [Network Security Group]
   nsg-production-app

   Reglas actuales:
   ❌ Allow SSH from 0.0.0.0/0 (ANY)

   Aplicando restricción:
   ✓ SSH (port 22) ahora solo desde:
     - Office IP: 203.0.113.0/24
     - VPN gateway: 198.51.100.5
   ✓ Denied: 0.0.0.0/0

   Otras mejoras aplicadas:
   ✓ RDP (3389) bloqueado completamente
   ✓ Management ports solo desde VNet

3. [SQL Database - Advanced Threat Protection]
   sqldb-prod

   ✓ Advanced Data Security enabled
   ✓ Vulnerability Assessment enabled
   ✓ Threat detection enabled
   ✓ Email notifications configured
   ✓ Audit logging enabled

   Amenazas monitoreadas:
   • SQL injection attempts
   • Anomalous database access
   • Potential data exfiltration
   • Brute force attacks

✅ SEGURIDAD MEJORADA

Security Score: 78/100 → 92/100 🎉

Próximos pasos recomendados:
1. Implementar Managed Identities (item 4)
2. Configurar backups automáticos (item 5)
3. Forzar TLS 1.2+ (item 6)

¿Quieres continuar con estos?
```

---

## 📖 Lección 9.D.8: Código Production-Ready

### Generar Infraestructura como Código

```
Tú: Genera un archivo Bicep para toda la infraestructura del e-commerce

Claude: Generaré infraestructura completa con best practices...

[Genera archivo Bicep]

```bicep
// main.bicep - E-Commerce Infrastructure

@description('Environment name (dev, staging, prod)')
param environmentName string = 'prod'

@description('Location for all resources')
param location string = resourceGroup().location

@description('Application name')
param appName string = 'ecommerce'

// Variables
var appServicePlanName = 'plan-${appName}-${environmentName}'
var webAppName = 'app-${appName}-web-${environmentName}'
var apiAppName = 'app-${appName}-api-${environmentName}'
var sqlServerName = 'sql-${appName}-${environmentName}'
var sqlDatabaseName = 'sqldb-${appName}-${environmentName}'
var storageAccountName = 'st${appName}${environmentName}'
var appInsightsName = 'ai-${appName}-${environmentName}'
var keyVaultName = 'kv-${appName}-${environmentName}'

// App Service Plan
resource appServicePlan 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: environmentName == 'prod' ? 'S1' : 'B1'
    tier: environmentName == 'prod' ? 'Standard' : 'Basic'
    capacity: environmentName == 'prod' ? 2 : 1
  }
  properties: {
    reserved: true // Linux
  }
  tags: {
    Environment: environmentName
    Application: appName
  }
}

// Web App
resource webApp 'Microsoft.Web/sites@2022-03-01' = {
  name: webAppName
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'NODE|18-lts'
      alwaysOn: environmentName == 'prod'
      minTlsVersion: '1.2'
      ftpsState: 'Disabled'
      appSettings: [
        {
          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
          value: appInsights.properties.InstrumentationKey
        }
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: appInsights.properties.ConnectionString
        }
        {
          name: 'NODE_ENV'
          value: environmentName
        }
      ]
    }
  }
  tags: {
    Environment: environmentName
    Application: appName
  }
}

// API App
resource apiApp 'Microsoft.Web/sites@2022-03-01' = {
  name: apiAppName
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'NODE|18-lts'
      alwaysOn: environmentName == 'prod'
      minTlsVersion: '1.2'
      ftpsState: 'Disabled'
      cors: {
        allowedOrigins: [
          'https://${webAppName}.azurewebsites.net'
        ]
      }
    }
  }
}

// SQL Server
resource sqlServer 'Microsoft.Sql/servers@2022-05-01-preview' = {
  name: sqlServerName
  location: location
  properties: {
    administratorLogin: 'sqladmin'
    administratorLoginPassword: keyVault.getSecret('sql-admin-password')
    minimalTlsVersion: '1.2'
    publicNetworkAccess: environmentName == 'prod' ? 'Disabled' : 'Enabled'
  }
}

// SQL Database
resource sqlDatabase 'Microsoft.Sql/servers/databases@2022-05-01-preview' = {
  parent: sqlServer
  name: sqlDatabaseName
  location: location
  sku: {
    name: environmentName == 'prod' ? 'S3' : 'S0'
    tier: 'Standard'
  }
  properties: {
    collation: 'SQL_Latin1_General_CP1_CI_AS'
    maxSizeBytes: 268435456000 // 250 GB
    zoneRedundant: environmentName == 'prod'
  }
}

// Storage Account
resource storageAccount 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    supportsHttpsTrafficOnly: true
    minimumTlsVersion: 'TLS1_2'
    encryption: {
      services: {
        blob: {
          enabled: true
        }
        file: {
          enabled: true
        }
      }
      keySource: 'Microsoft.Storage'
    }
  }
}

// Application Insights
resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: appInsightsName
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    RetentionInDays: 90
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
  }
}

// Key Vault
resource keyVault 'Microsoft.KeyVault/vaults@2022-07-01' = {
  name: keyVaultName
  location: location
  properties: {
    sku: {
      family: 'A'
      name: 'standard'
    }
    tenantId: subscription().tenantId
    enableRbacAuthorization: true
    enableSoftDelete: true
    softDeleteRetentionInDays: 90
    enablePurgeProtection: true
  }
}

// Outputs
output webAppUrl string = 'https://${webApp.properties.defaultHostName}'
output apiAppUrl string = 'https://${apiApp.properties.defaultHostName}'
output sqlServerFqdn string = sqlServer.properties.fullyQualifiedDomainName
```

Creado: main.bicep con infraestructura completa

Características incluidas:
✓ App Services con auto-scaling
✓ SQL Database con alta disponibilidad
✓ Storage Account seguro
✓ Application Insights
✓ Key Vault para secretos
✓ Managed Identities
✓ Security best practices
✓ Environment-specific config

Deploy con:
`az deployment group create --resource-group rg-ecommerce-prod --template-file main.bicep`

¿Quieres que lo despliegue?
```

---

## 🛠️ Ejercicios Prácticos

### Ejercicio 9.D.1: Configuración Básica
1. Crea un Service Principal en Azure
2. Configura el MCP de Azure con credenciales
3. Verifica la conexión exitosa
4. Lista todos tus recursos actuales
5. Documenta la configuración

### Ejercicio 9.D.2: Deploy de Aplicación
1. Crea un Resource Group para un proyecto
2. Despliega una aplicación web a Azure App Service
3. Configura Application Insights
4. Verifica que la aplicación funcione correctamente
5. Documenta el proceso de deployment

### Ejercicio 9.D.3: Monitoreo y Análisis
1. Configura alertas en Application Insights
2. Genera tráfico a tu aplicación (tests de carga)
3. Analiza métricas de performance
4. Investiga algún error o warning
5. Crea un dashboard de monitoreo

### Ejercicio 9.D.4: Optimización de Costos
1. Analiza tus gastos actuales en Azure
2. Identifica oportunidades de ahorro
3. Implementa al menos 2 optimizaciones
4. Documenta el ahorro conseguido
5. Configura budget alerts

### Ejercicio 9.D.5: Seguridad
1. Ejecuta security assessment completo
2. Identifica hallazgos críticos
3. Remedíalos todos
4. Implementa Managed Identities
5. Documenta mejoras de security score

---

## 📝 Examen 9.D: Maestría del MCP de Azure

### Parte 1: Preguntas Teóricas (3 puntos)

**Pregunta 1:** ¿Cuáles son las 3 principales ventajas de gestionar Azure desde Claude Code vs usar el Portal web?

**Pregunta 2:** Explica cuándo usarías cada servicio de Azure:
- a) App Service vs Azure Functions vs AKS
- b) Azure SQL vs Cosmos DB vs Storage Tables
- c) Hot tier vs Cool tier vs Archive tier
- d) Standard vs Premium App Service Plan

**Pregunta 3:** ¿Qué son Managed Identities y por qué son importantes para la seguridad?

### Parte 2: Configuración y Despliegue (2 puntos)

1. Muestra cómo configurarías el MCP de Azure para múltiples environments (dev, staging, prod)
2. Explica el proceso de crear un Service Principal con permisos mínimos
3. ¿Cómo protegerías las credenciales de Azure en CI/CD?

### Parte 3: Práctica - Infraestructura Completa (5 puntos)

Escenario: Debes desplegar una aplicación full-stack en Azure.

**Requisitos:**
- Frontend: React SPA
- Backend: Node.js API
- Database: PostgreSQL
- Storage: Para imágenes de usuarios
- Monitoring: Application Insights

**Tareas:**
1. Diseña la arquitectura completa
2. Genera código Bicep/ARM para la infraestructura
3. Despliega todos los componentes
4. Configura monitoring y alertas
5. Documenta URLs y accesos

### Parte 4: Proyecto Real (Bonus +3 puntos)

Elige uno de estos proyectos:

**Opción A: FinOps - Optimización de Costos**
1. Analiza una subscription de Azure real
2. Identifica todas las oportunidades de ahorro
3. Implementa optimizaciones (al menos 5)
4. Calcula ROI de las optimizaciones
5. Crea dashboard de cost tracking
6. Documenta proceso y resultados

**Opción B: DevOps Pipeline Completo**
1. Crea pipeline de CI/CD para Azure
2. Incluye: build, test, deploy, monitoring
3. Implementa deployment slots (blue-green)
4. Configura auto-rollback en caso de errores
5. Integra con Slack para notificaciones
6. Documenta el pipeline completo

---

## ✅ Cómo Enviar Tu Examen

### Para la Parte 1:
```
Parte 1:
P1: [respuesta detallada]
P2: [respuestas para cada inciso]
P3: [explicación de Managed Identities]
```

### Para la Parte 2:
Muestra archivos de configuración completos y procedimientos.

### Para la Parte 3:
Documenta con:
- Diagrama de arquitectura
- Código Bicep completo
- Screenshots de recursos desplegados
- URLs funcionales
- Métricas de monitoring

### Para la Parte 4:
Proporciona:
- Análisis completo
- Código/scripts utilizados
- Resultados medibles
- Documentación detallada
- Lecciones aprendidas

---

## 🎯 Checklist de Dominio

Marca cuando domines cada aspecto:

**Configuración**
- [ ] Crear Service Principal
- [ ] Configurar MCP de Azure
- [ ] Gestionar múltiples subscriptions
- [ ] Proteger credenciales

**Recursos**
- [ ] Crear Resource Groups
- [ ] Gestionar App Services
- [ ] Configurar bases de datos
- [ ] Storage Accounts

**Deployments**
- [ ] Deploy de aplicaciones web
- [ ] Deploy de Azure Functions
- [ ] Deployment slots
- [ ] Blue-green deployments

**Monitoreo**
- [ ] Application Insights
- [ ] Log Analytics
- [ ] Alertas y dashboards
- [ ] Análisis de errores

**Costos**
- [ ] Analizar gastos
- [ ] Identificar optimizaciones
- [ ] Implementar ahorros
- [ ] Budget alerts

**Seguridad**
- [ ] Security assessments
- [ ] Managed Identities
- [ ] Key Vault
- [ ] Network security

**Avanzado**
- [ ] Infrastructure as Code (Bicep)
- [ ] Auto-scaling
- [ ] High availability
- [ ] Disaster recovery

---

## 💡 Mejores Prácticas

### 1. Infraestructura como Código

```
✅ Bueno:
- Usar Bicep/ARM templates
- Versionarlo en Git
- Código reviewable y testeable
- Deployments reproducibles

❌ Evita:
- Crear recursos manualmente
- Configuraciones no documentadas
- Click-ops en Portal
- Infraestructura como "pet" no "cattle"
```

### 2. Seguridad Primero

```
✅ Bueno:
- Managed Identities para auth
- Secrets en Key Vault
- Network isolation
- Principio de menor privilegio

❌ Evita:
- Connection strings hardcoded
- Passwords en variables de entorno
- Recursos expuestos públicamente
- Permisos excesivos
```

### 3. Monitoreo Proactivo

```
✅ Bueno:
- Application Insights en todo
- Alertas configuradas
- Dashboards actualizados
- Logs centralizados

❌ Evita:
- Deployar sin monitoring
- Reaccionar en vez de prevenir
- Ignorar métricas
- Logs sin retención
```

### 4. Optimización Continua

```
✅ Bueno:
- Revisar costos semanalmente
- Right-sizing de recursos
- Reserved Instances para workloads predecibles
- Auto-scaling configurado

❌ Evita:
- Set and forget
- Over-provisioning "por las dudas"
- Ignorar recomendaciones de Azure Advisor
- No medir utilización real
```

### 5. Ambientes Separados

```
✅ Bueno:
- Dev, Staging, Prod separados
- Subscriptions diferentes
- Promote code, not configuration
- Parity entre ambientes

❌ Evita:
- Mezclar dev y prod
- Probar en producción
- Configuraciones divergentes
- Falta de isolation
```

---

## 🚀 Siguiente Nivel

Una vez que domines el MCP de Azure, explora:

1. **Servicios Avanzados**
   - Azure Kubernetes Service (AKS)
   - Azure DevOps Pipelines
   - Azure API Management
   - Azure Service Bus

2. **Multi-Cloud**
   - Combinar Azure con AWS
   - Google Cloud Platform
   - Estrategias híbridas
   - Vendor lock-in mitigation

3. **Automatización Avanzada**
   - Azure Logic Apps
   - Event-driven architecture
   - Serverless workflows
   - Infrastructure automation

---

## 📚 Recursos Adicionales

### Documentación Oficial
- [Azure Documentation](https://docs.microsoft.com/azure)
- [Bicep Documentation](https://docs.microsoft.com/azure/azure-resource-manager/bicep)
- [Azure CLI Reference](https://docs.microsoft.com/cli/azure)

### Learning Paths
- [Azure Fundamentals](https://docs.microsoft.com/learn/paths/azure-fundamentals/)
- [Azure Developer](https://docs.microsoft.com/learn/paths/azure-developer/)
- [Azure Solutions Architect](https://docs.microsoft.com/learn/paths/azure-solutions-architect/)

### Tools
- [Azure Portal](https://portal.azure.com)
- [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli)
- [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/)
- [Azure Data Studio](https://docs.microsoft.com/sql/azure-data-studio)

---

**¡Subcapítulo 9.D Completo!**

Has aprendido a gestionar Microsoft Azure con Claude Code. Ahora puedes desplegar aplicaciones, monitorear infraestructura, optimizar costos y mantener todo seguro usando lenguaje natural.

**Anterior**: `capitulo_09_mcp_slack.md` (Slack MCP)
**Siguiente**: `capitulo_09_mcp_vercel.md` (Vercel MCP)

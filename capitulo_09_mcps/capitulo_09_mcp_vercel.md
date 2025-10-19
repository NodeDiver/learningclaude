# Subcapítulo 9.E: MCP de Vercel - Deployments Automáticos

**Duración**: 55 minutos
**Dificultad**: Intermedio
**Prerrequisito**: Capítulo 9 (MCP Básico)

---

## 🎯 Objetivos de Aprendizaje

Al final de este subcapítulo, podrás:
- Entender qué es el MCP de Vercel y su poder para deployments
- Configurar autenticación con Vercel API
- Desplegar aplicaciones web automáticamente
- Gestionar dominios y DNS desde Claude Code
- Configurar variables de entorno de forma segura
- Analizar métricas y analytics de Vercel
- Trabajar con preview deployments
- Integrar Vercel con frameworks modernos (Next.js, Vite, etc)

---

## 📖 Lección 9.E.1: ¿Qué es el MCP de Vercel?

El **MCP de Vercel** es un servidor que conecta Claude Code directamente con la plataforma Vercel, permitiéndote desplegar aplicaciones, gestionar dominios, configurar variables de entorno y analizar métricas sin salir de tu conversación con Claude.

### Concepto Fundamental

Piensa en el MCP de Vercel como un **deployment assistant automático**:

**Sin MCP de Vercel:**
```
Tú ←→ Claude Code
       ↓ (manualmente)
   Terminal/Dashboard ←→ Vercel
   (comandos git, clicks en UI)
```

**Con MCP de Vercel:**
```
Tú ←→ Claude Code ←→ MCP Vercel ←→ Vercel Platform
     ("despliega a producción" → deploy automático)
```

### ¿Qué Puede Hacer?

El MCP de Vercel proporciona **herramientas poderosas** para:

✅ **Deployments Instantáneos**
- Deploy de cualquier branch en segundos
- Preview deployments automáticos
- Production deployments con un comando
- Rollback a versiones anteriores

✅ **Gestión de Dominios**
- Agregar dominios personalizados
- Configurar DNS automáticamente
- SSL/TLS certificates automáticos
- Redirects y rewrites

✅ **Variables de Entorno**
- Configurar env vars por ambiente
- Secrets management seguro
- Build-time vs Runtime variables
- Sincronización con equipos

✅ **Analytics y Métricas**
- Web Analytics detallado
- Core Web Vitals
- Traffic y performance
- Error tracking

✅ **Preview Deployments**
- URL única por cada commit
- Testing antes de production
- Compartir con stakeholders
- Comentarios en PRs

✅ **Integración con Frameworks**
- Next.js optimizado automáticamente
- React, Vue, Svelte, SvelteKit
- Astro, Nuxt, Remix
- Static sites y SSR

### Ventajas Clave

| Sin MCP Vercel | Con MCP Vercel |
|----------------|----------------|
| Git push manual para deploy | Deploy desde conversación |
| Dashboard web para configurar | Configuración con lenguaje natural |
| Buscar logs manualmente | Análisis automático de errores |
| Copy/paste env vars | Gestión segura y versionada |
| Revisar analytics en browser | Insights directos en Claude |
| **Múltiples pasos** | **Un solo comando** ⚡ |

---

## 📖 Lección 9.E.2: Instalación y Configuración

### Paso 1: Obtener Token de Vercel

**Opción A: Desde Vercel Dashboard**
```
1. Ir a https://vercel.com/account/tokens
2. Click "Create Token"
3. Name: "Claude Code MCP"
4. Scope: Full Account
5. Expiration: No expiration (o custom)
6. Click "Create"
7. Copiar el token (solo se muestra una vez)
```

**Opción B: Usando Vercel CLI**
```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Generar token (interactivo)
vercel tokens create "Claude Code MCP"
```

### Paso 2: Instalar el Servidor MCP

```bash
# Instalar el MCP de Vercel
npm install -g @modelcontextprotocol/server-vercel

# O usando Claude Code CLI
claude mcp add --transport stdio \
  --name vercel \
  --command "npx" \
  --args "-y @modelcontextprotocol/server-vercel"
```

### Paso 3: Configuración Manual

**Archivo: `.claude/mcp.json`** (proyecto específico)
```json
{
  "servers": {
    "vercel": {
      "transport": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-vercel"
      ],
      "env": {
        "VERCEL_TOKEN": "tu-vercel-token-aqui",
        "VERCEL_TEAM_ID": "team_abc123xyz"
      }
    }
  }
}
```

O en **`~/.claude/mcp.json`** (global - todos los proyectos)

### Paso 4: Usar Variables de Entorno (Recomendado)

Para seguridad:

**Archivo: `.env`**
```bash
VERCEL_TOKEN=your_vercel_token_here
VERCEL_TEAM_ID=team_abc123xyz  # opcional, si usas Vercel Teams
```

**Actualiza `mcp.json`:**
```json
{
  "servers": {
    "vercel": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-vercel"],
      "env": {
        "VERCEL_TOKEN": "${VERCEL_TOKEN}",
        "VERCEL_TEAM_ID": "${VERCEL_TEAM_ID}"
      }
    }
  }
}
```

### Paso 5: Múltiples Equipos/Cuentas

Si trabajas con múltiples teams:

```json
{
  "servers": {
    "vercel-personal": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-vercel"],
      "env": {
        "VERCEL_TOKEN": "${VERCEL_PERSONAL_TOKEN}"
      }
    },
    "vercel-company": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-vercel"],
      "env": {
        "VERCEL_TOKEN": "${VERCEL_COMPANY_TOKEN}",
        "VERCEL_TEAM_ID": "${VERCEL_COMPANY_TEAM_ID}"
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
# vercel (stdio) - @modelcontextprotocol/server-vercel [connected ✓]
```

### Probar Conexión

```
Tú: ¿Puedes conectarte a Vercel?

Claude: [usa vercel_test_connection]
✓ Conexión exitosa a Vercel
Account: Mi Cuenta (@mi-usuario)
Team: Mi Empresa (team_abc123)
Projects: 23
Deployments (last 24h): 15
```

---

## 📖 Lección 9.E.3: Deployments Básicos

### Herramienta: vercel_deploy

Despliega tu proyecto a Vercel.

**Deploy básico:**
```
Tú: Despliega mi proyecto a Vercel

Claude: [analiza proyecto y despliega]

Detectando configuración del proyecto...
✓ Framework: Next.js 14.0.0
✓ Build command: next build
✓ Output directory: .next
✓ Node version: 18.x

Iniciando deployment...

[Building]
▸ Installing dependencies...
  npm install (23s)
▸ Running build command...
  next build (1m 45s)
  ✓ Compiled successfully
  ✓ Static pages: 15
  ✓ Server-side rendered: 8
  ✓ API routes: 12

[Deploying]
▸ Uploading files...
  245 files (12.5 MB)
▸ Deploying to Edge Network...
  75 regions worldwide

✅ Deployment successful!

Preview URL: https://mi-proyecto-abc123.vercel.app
Production URL: https://mi-proyecto.com
Deployment ID: dpl_xyz789

Performance:
• Build time: 1m 45s
• Deploy time: 32s
• Total: 2m 17s

Lighthouse Score:
🟢 Performance: 98/100
🟢 Accessibility: 100/100
🟢 Best Practices: 100/100
🟢 SEO: 100/100
```

### Deploy de Branch Específico

```
Tú: Despliega la rama feature/new-design como preview

Claude: [despliega branch específico]

Desplegando branch: feature/new-design

✓ Branch encontrado
✓ 15 commits ahead of main
✓ Latest commit: abc1234 "Add new hero section"

[Deploying]
Building preview deployment...

✅ Preview deployment listo!

Preview URL: https://mi-proyecto-git-feature-new-design.vercel.app
Unique ID: dpl_preview_abc123

Compartir con equipo:
• Designer: "Revisa el nuevo diseño en [URL]"
• Product Manager: "Feedback bienvenido"
• QA: "Listo para testing"

Auto-deploy: Cada push a feature/new-design actualizará este preview

Este preview se elimina cuando merges o borres el branch.
```

### Deploy a Producción

```
Tú: El preview se ve bien, despliega a producción

Claude: [ejecuta production deployment]

Preparando production deployment...

Pre-deployment checks:
✓ Tests passing
✓ No blocking issues
✓ Environment variables configured
✓ Custom domain configured

[Building for Production]
▸ Optimizaciones activadas:
  • Image optimization
  • Code splitting
  • Minification
  • Compression

✓ Build successful
✓ Bundle size: 234 KB (optimizado)

[Deploying to Production]
▸ Rolling out to Edge Network...
  Región 1/75: IAD (Virginia) ✓
  Región 2/75: SFO (California) ✓
  Región 3/75: LHR (London) ✓
  ...
  Región 75/75: SYD (Sydney) ✓

✅ Production deployment exitoso!

Live URL: https://mi-proyecto.com
Previous version: Saved as dpl_old_xyz789
Rollback available: Si hay problemas

Monitoring:
Analytics: https://vercel.com/analytics
Logs: https://vercel.com/logs

Deployment completado en 2m 45s 🚀
```

---

## 📖 Lección 9.E.4: Gestión de Dominios

### Agregar Dominio Personalizado

**Herramienta: vercel_add_domain**

```
Tú: Agrega el dominio mitienda.com a mi proyecto

Claude: [configura dominio]

Configurando dominio personalizado...

✓ Dominio: mitienda.com
✓ Proyecto: mi-proyecto-ecommerce

[DNS Configuration]
Detectando configuración actual...
Nameservers: GoDaddy

Opciones de configuración:

Opción 1: Usar Vercel Nameservers (Recomendado)
  Cambiar nameservers en GoDaddy a:
  • ns1.vercel-dns.com
  • ns2.vercel-dns.com

  Ventajas:
  ✓ Configuración automática
  ✓ SSL inmediato
  ✓ DNS optimizado globalmente

Opción 2: Mantener nameservers actuales
  Agregar estos registros DNS:
  A     @     76.76.21.21
  CNAME www   cname.vercel-dns.com

¿Qué opción prefieres?
```

### Configurar DNS Automáticamente

```
Tú: Usa la opción 1, Vercel nameservers

Claude: [configura DNS]

Configurando con Vercel DNS...

[Setup]
✓ Dominio agregado al proyecto
✓ SSL certificate provisionado
✓ Edge network configured

Nameservers para configurar en GoDaddy:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ns1.vercel-dns.com
ns2.vercel-dns.com
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Pasos en GoDaddy:
1. Login en GoDaddy
2. My Products → Domains
3. Click en "mitienda.com"
4. DNS → Nameservers
5. Change → Custom
6. Pegar nameservers de arriba
7. Save

Propagación DNS:
• Tiempo estimado: 24-48 horas
• Usualmente: 1-4 horas

Verificación:
Ejecutaré verificación automática cada 30 minutos.
Te notificaré cuando esté listo.

Status actual:
🟡 Pendiente de propagación DNS
```

### Múltiples Dominios

```
Tú: También quiero que app.mitienda.com apunte al proyecto

Claude: [agrega subdomain]

Agregando subdomain...

✓ app.mitienda.com agregado

Configuración automática (usando Vercel DNS):
✓ DNS record creado
✓ SSL certificate emitido
✓ Edge configuration updated

URLs activas:
• https://mitienda.com (primary)
• https://www.mitienda.com (redirect → primary)
• https://app.mitienda.com (alias)

Redirects configurados:
www.mitienda.com → mitienda.com (301)
http://mitienda.com → https://mitienda.com (301)

Todos los dominios ahora sirven tu aplicación 🎉
```

---

## 📖 Lección 9.E.5: Variables de Entorno

### Configurar Environment Variables

**Herramienta: vercel_set_env_var**

```
Tú: Configura las variables de entorno para la app

Claude: Configuraré las environment variables de forma segura.

¿Qué variables necesitas?

Ejemplo común para Next.js app:
• NEXT_PUBLIC_API_URL
• DATABASE_URL
• JWT_SECRET
• STRIPE_SECRET_KEY
• etc.

Dime las variables y sus valores, o puedo leerlas de tu .env.local
```

### Configuración Completa

```
Tú: Lee del .env.local y configúralas en Vercel

Claude: [lee .env.local y configura]

Leyendo .env.local...

Variables encontradas (12):
✓ NEXT_PUBLIC_API_URL
✓ DATABASE_URL
✓ JWT_SECRET
✓ STRIPE_SECRET_KEY
✓ STRIPE_PUBLIC_KEY
✓ SENDGRID_API_KEY
✓ GOOGLE_ANALYTICS_ID
✓ SENTRY_DSN
...

Categorizando por tipo:

[Public - Disponibles en browser]
• NEXT_PUBLIC_API_URL
• STRIPE_PUBLIC_KEY
• GOOGLE_ANALYTICS_ID

[Private - Solo en server]
• DATABASE_URL
• JWT_SECRET
• STRIPE_SECRET_KEY
• SENDGRID_API_KEY
• SENTRY_DSN

[Configurando en Vercel]

Por ambiente:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Development:
✓ NEXT_PUBLIC_API_URL = http://localhost:3000/api
✓ DATABASE_URL = postgres://localhost/dev_db
✓ (secrets encriptados)

Preview:
✓ NEXT_PUBLIC_API_URL = https://api-staging.mitienda.com
✓ DATABASE_URL = [Staging DB]
✓ (secrets encriptados)

Production:
✓ NEXT_PUBLIC_API_URL = https://api.mitienda.com
✓ DATABASE_URL = [Production DB]
✓ (secrets encriptados)

✅ 12 variables configuradas en 3 ambientes

Seguridad:
🔒 Secrets encriptados en reposo
🔒 Nunca expuestos en logs
🔒 Solo accesibles en runtime

Próximo deploy usará estas variables automáticamente.
```

### Actualizar Variable

```
Tú: Actualiza STRIPE_SECRET_KEY solo en production

Claude: [actualiza variable específica]

Actualizando STRIPE_SECRET_KEY en Production...

⚠️ Advertencia: Variable sensible
  Esto afectará la aplicación en vivo

Cambios:
Environment: Production only
Variable: STRIPE_SECRET_KEY
Old value: sk_live_old****** (hidden)
New value: sk_live_new****** (hidden)

✓ Variable actualizada

Para aplicar cambios:
Necesitas re-deployar a production.

¿Quieres que haga redeploy ahora?
```

---

## 📖 Lección 9.E.6: Analytics y Métricas

### Ver Analytics del Proyecto

**Herramienta: vercel_get_analytics**

```
Tú: Muéstrame el analytics de mi sitio de los últimos 7 días

Claude: [consulta Vercel Analytics]

📊 VERCEL ANALYTICS - Últimos 7 días

*Tráfico General:*
• Total de visitas: 45,678
• Usuarios únicos: 12,345
• Pageviews: 134,567
• Promedio páginas/sesión: 2.9
• Bounce rate: 42%

*Tráfico por Día:*
┌────────┬──────────┬──────────┐
│ Fecha  │ Visitas  │ Usuarios │
├────────┼──────────┼──────────┤
│ 18 Oct │ 8,234    │ 2,456    │
│ 17 Oct │ 7,890    │ 2,234    │
│ 16 Oct │ 6,543    │ 1,987    │
│ 15 Oct │ 5,234    │ 1,654    │
│ 14 Oct │ 4,567    │ 1,432    │
│ 13 Oct │ 6,789    │ 2,123    │ ← Fin de semana
│ 12 Oct │ 6,421    │ 2,459    │ ← Fin de semana
└────────┴──────────┴──────────┘

*Geografía - Top 5 Países:*
1. 🇺🇸 United States - 18,456 (40.4%)
2. 🇬🇧 United Kingdom - 6,789 (14.9%)
3. 🇨🇦 Canada - 4,567 (10.0%)
4. 🇩🇪 Germany - 3,456 (7.6%)
5. 🇦🇺 Australia - 2,345 (5.1%)

*Dispositivos:*
• Desktop: 65%
• Mobile: 30%
• Tablet: 5%

*Navegadores:*
• Chrome: 68%
• Safari: 18%
• Firefox: 8%
• Edge: 4%
• Otros: 2%

*Top 10 Páginas:*
1. / (homepage) - 23,456 views
2. /products - 15,678 views
3. /about - 8,901 views
4. /contact - 6,543 views
5. /blog - 4,567 views
...

*Referrers:*
• Direct: 45%
• Google: 30%
• Social Media: 15%
• Other: 10%
```

### Core Web Vitals

```
Tú: ¿Cómo están los Core Web Vitals?

Claude: [analiza performance metrics]

🎯 CORE WEB VITALS

*Largest Contentful Paint (LCP):*
🟢 1.2s (Bueno - < 2.5s)
  75th percentile: 1.4s
  95th percentile: 2.1s

*First Input Delay (FID):*
🟢 45ms (Bueno - < 100ms)
  75th percentile: 52ms
  95th percentile: 87ms

*Cumulative Layout Shift (CLS):*
🟢 0.05 (Bueno - < 0.1)
  75th percentile: 0.07
  95th percentile: 0.09

*Overall Score: 98/100* 🎉

Comparación con industry:
Tu sitio está en el top 5% de performance

*Tiempo de Carga por Página:*
/ (homepage): 1.1s ⚡
/products: 1.3s ⚡
/blog: 1.8s 🟢
/about: 0.9s ⚡

*Recomendaciones:*
✓ Excelente performance overall
💡 Considera lazy-loading en /blog para mejorar LCP
💡 Optimiza imágenes en /products (usa next/image)

Tu sitio está muy bien optimizado 👏
```

### Analizar Errores

```
Tú: ¿Hay errores en producción?

Claude: [consulta error tracking]

⚠️ ERRORES EN PRODUCCIÓN - Últimas 24 horas

Total de errores: 23

*Por Tipo:*
┌─────────────────────┬───────┬──────────┐
│ Error Type          │ Count │ % Total  │
├─────────────────────┼───────┼──────────┤
│ 404 Not Found       │ 15    │ 65.2%    │
│ 500 Server Error    │ 5     │ 21.7%    │
│ 429 Too Many Req    │ 3     │ 13.0%    │
└─────────────────────┴───────┴──────────┘

*Errores 404 (15):*
Top URLs no encontradas:
1. /old-product-page - 8 requests
2. /blog/deleted-post - 4 requests
3. /admin/legacy - 3 requests

Acción sugerida:
→ Crear redirects para URLs antiguas

*Errores 500 (5):*
Endpoint: POST /api/checkout
Error: Database connection timeout
Stack:
```
Error: Connection timeout
  at PostgresClient.connect (lib/db.js:45)
  at POST /api/checkout (pages/api/checkout.js:23)
```

Última ocurrencia: Hace 2 horas
Usuarios afectados: 5

Acción urgente:
→ Revisar conexión a base de datos
→ Verificar pool size y timeout config

*Rate Limit (429):*
IP: 203.0.113.45
Requests: 150 en 1 minuto
API: /api/search

Posible bot o scraper

¿Quieres que investigue el error 500 en detalle?
```

---

## 📖 Lección 9.E.7: Preview Deployments

### Crear Preview por Commit

```
Tú: Cada vez que haga push a cualquier branch, crea preview automático

Claude: Configuraré preview deployments automáticos.

✓ Preview deployments habilitados

Configuración:
• Trigger: Cualquier push a cualquier branch
• Auto-deploy: Enabled
• Comment on PR: Enabled (si es PR)

Workflow:
1. Haces commit en branch feature/X
2. Git push
3. Vercel detecta push automáticamente
4. Build + deploy en ~2 minutos
5. Preview URL única generada
6. Si hay PR: Comentario agregado con URL

Ejemplo de URL preview:
https://mi-proyecto-git-feature-x-usuario.vercel.app

Benefits:
✓ Testing inmediato
✓ Share con equipo fácilmente
✓ No afecta producción
✓ Feedback antes de merge
```

### Preview con Comentario en PR

```
[Simulas un push]

Tú: Hice push a feature/checkout-improvements

Claude: [detecta push y despliega]

🚀 Preview deployment iniciado

Branch: feature/checkout-improvements
Commit: abc1234 "Improve checkout flow"

[Building]
✓ Build successful (1m 34s)

[Deploying]
✓ Preview deployed

Preview URL: https://mi-proyecto-git-checkout-improvements.vercel.app

[Comentario en GitHub PR #156]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Preview deployment ready!

**Preview URL:** https://mi-proyecto-git-checkout-improvements.vercel.app

**Latest commit:** abc1234

**Lighthouse Score:**
• Performance: 96/100
• Accessibility: 100/100
• Best Practices: 100/100
• SEO: 100/100

**Changes:**
• Modified: 8 files
• Added: 234 lines
• Removed: 123 lines

Inspect the deployment: https://vercel.com/deployments/dpl_abc123
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Stakeholders pueden revisar cambios antes del merge 👀
```

### Comparar Previews

```
Tú: Compara el preview actual con el deployment de producción

Claude: [genera comparación]

📊 COMPARACIÓN: Preview vs Production

*Bundle Size:*
Production: 245 KB
Preview: 238 KB (-7 KB, -2.9%) ✅

*Performance:*
┌───────────────┬────────────┬──────────┬──────────┐
│ Métrica       │ Production │ Preview  │ Change   │
├───────────────┼────────────┼──────────┼──────────┤
│ LCP           │ 1.2s       │ 1.1s     │ -0.1s ✅ │
│ FID           │ 45ms       │ 42ms     │ -3ms ✅  │
│ CLS           │ 0.05       │ 0.04     │ -0.01 ✅ │
│ Load Time     │ 2.3s       │ 2.1s     │ -0.2s ✅ │
└───────────────┴────────────┴──────────┴──────────┘

*Lighthouse Score:*
Production: 98/100
Preview: 99/100 (+1) 🎉

*Archivos Modificados:*
• pages/checkout.tsx (performance improvements)
• components/PaymentForm.tsx (optimized)
• styles/checkout.css (reduced size)

*Impacto:*
✅ Performance mejorada
✅ Bundle size reducido
✅ No breaking changes detectados

Recomendación: ✅ Safe to merge
```

---

## 📖 Lección 9.E.8: Integración con Next.js

### Optimizaciones Automáticas

```
Tú: Despliega mi app de Next.js con todas las optimizaciones

Claude: [despliega con Next.js optimizations]

Detectando Next.js 14...

✓ Framework: Next.js 14.0.0
✓ React: 18.2.0

[Optimizaciones Automáticas Aplicadas]

1. Image Optimization ✅
   • next/image serving optimized
   • WebP/AVIF automatic conversion
   • Responsive srcsets
   • Lazy loading por defecto

2. Font Optimization ✅
   • next/font optimizations
   • Self-hosted Google Fonts
   • Zero layout shift
   • Preload crítico

3. Script Optimization ✅
   • next/script strategy
   • Third-party scripts optimized
   • Defer non-critical scripts

4. Code Splitting ✅
   • Automatic route-based splitting
   • Dynamic imports
   • Shared chunks optimized

5. Edge Runtime ✅
   • Middleware on Edge
   • API routes on Edge
   • ISR on Edge Network

6. Caching Strategy ✅
   • Static Generation (SSG)
   • Incremental Static Regeneration (ISR)
   • Server-Side Rendering (SSR)
   • Edge caching configured

[Build Output Analysis]
Route (pages)                                Size     First Load JS
┌ ○ /                                        2.5 kB          85 kB
├ ○ /about                                   1.2 kB          83 kB
├ ƒ /api/products                            0 kB            0 kB
├ ● /products                                3.4 kB          87 kB
├ ● /products/[id]                           2.8 kB          86 kB
└ ○ /contact                                 1.1 kB          83 kB

Legend:
○ Static      - Generado en build time
● SSG         - Static con getStaticProps
ƒ Serverless  - Function on-demand

[Deployment]
✓ Deployed to 75 Edge locations
✓ Edge Network: Optimum (Global)
✓ Cold boot time: < 50ms

URL: https://mi-nextjs-app.vercel.app

Next.js optimizado al máximo 🚀
```

### Incremental Static Regeneration

```
Tú: Configura ISR para la página de productos

Claude: [configura ISR]

Configurando Incremental Static Regeneration...

Analizando páginas:
/products → Lista de productos (cambia frecuentemente)
/products/[id] → Detalle producto (cambia ocasionalmente)

[Configuración ISR]

```typescript
// pages/products/index.tsx
export async function getStaticProps() {
  const products = await fetchProducts();

  return {
    props: { products },
    revalidate: 60 // Regenerar cada 60 segundos
  };
}

// pages/products/[id].tsx
export async function getStaticProps({ params }) {
  const product = await fetchProduct(params.id);

  return {
    props: { product },
    revalidate: 300 // Regenerar cada 5 minutos
  };
}

export async function getStaticPaths() {
  const products = await fetchProducts();
  const paths = products.map(p => ({
    params: { id: p.id.toString() }
  }));

  return {
    paths,
    fallback: 'blocking' // Generar on-demand si no existe
  };
}
```

Comportamiento:
1. Build time: Genera páginas para todos los productos existentes
2. Request: Sirve página estática (super rápido)
3. Background: Regenera cada 60s si hay request
4. New products: Genera on-demand con fallback: 'blocking'

Benefits:
✅ Performance de static site
✅ Contenido actualizado automáticamente
✅ No rebuilds completos
✅ Escala infinitamente

Deployed con ISR habilitado ⚡
```

---

## 🛠️ Ejercicios Prácticos

### Ejercicio 9.E.1: Setup Básico
1. Obtén un token de Vercel
2. Configura el MCP de Vercel
3. Verifica la conexión
4. Lista tus proyectos actuales
5. Documenta la configuración

### Ejercicio 9.E.2: Deploy Completo
1. Crea un proyecto Next.js o React
2. Despliégalo a Vercel desde Claude Code
3. Configura un dominio personalizado
4. Configura variables de entorno
5. Verifica que todo funcione

### Ejercicio 9.E.3: Preview Deployments
1. Crea una branch de feature
2. Haz cambios y deploy preview
3. Compara preview vs production
4. Comparte preview con alguien
5. Mergea cuando esté aprobado

### Ejercicio 9.E.4: Analytics
1. Genera tráfico a tu sitio (usa amigos o simuladores)
2. Analiza las métricas en Vercel
3. Revisa Core Web Vitals
4. Identifica oportunidades de mejora
5. Documenta findings

### Ejercicio 9.E.5: Optimización
1. Analiza el performance de tu app
2. Implementa optimizaciones sugeridas
3. Re-deploy y compara métricas
4. Documenta mejoras conseguidas
5. Comparte antes/después

---

## 📝 Examen 9.E: Maestría del MCP de Vercel

### Parte 1: Preguntas Teóricas (3 puntos)

**Pregunta 1:** ¿Cuáles son las 3 principales ventajas de usar Vercel con Claude Code vs deployar manualmente?

**Pregunta 2:** Explica la diferencia entre:
- a) Preview deployment vs Production deployment
- b) Static Generation (SSG) vs Server-Side Rendering (SSR)
- c) Build-time env vars vs Runtime env vars
- d) Edge Network vs Traditional CDN

**Pregunta 3:** ¿Qué es Incremental Static Regeneration (ISR) y cuándo usarlo?

### Parte 2: Configuración (2 puntos)

1. Muestra cómo configurarías el MCP de Vercel para múltiples teams
2. Explica cómo proteger el token de Vercel
3. ¿Cómo configurarías env vars diferentes para dev/preview/prod?

### Parte 3: Práctica - Deployment Pipeline (5 puntos)

Escenario: Debes configurar un pipeline completo de deployment para una app.

**Tareas:**
1. Deploy de la aplicación a Vercel
2. Configura dominio personalizado con SSL
3. Configura variables de entorno para 3 ambientes
4. Habilita preview deployments automáticos
5. Analiza métricas y optimiza performance

Documenta todo el proceso con screenshots y URLs.

### Parte 4: Proyecto Real (Bonus +3 puntos)

Elige uno de estos proyectos:

**Opción A: E-Commerce Completo**
1. Deploy una tienda online con:
   - Next.js con ISR para productos
   - Preview deployments por feature
   - Analytics configurado
   - Core Web Vitals optimizado (>90)
2. Configura todo desde Claude Code
3. Documenta arquitectura y decisiones

**Opción B: Multi-Tenant SaaS**
1. Deploy una app multi-tenant con:
   - Subdomains dinámicos (cliente1.app.com)
   - Edge middleware para routing
   - Variables de entorno por tenant
   - Analytics por tenant
2. Todo gestionado desde Claude Code
3. Documenta implementación completa

---

## ✅ Cómo Enviar Tu Examen

### Para la Parte 1:
```
Parte 1:
P1: [respuesta detallada]
P2: [respuestas para cada inciso]
P3: [explicación de ISR]
```

### Para la Parte 2:
Muestra archivos de configuración y procedimientos.

### Para la Parte 3:
Documenta con:
- URLs de deployment
- Screenshots de configuración
- Métricas de performance
- Evidencia de preview deployments

### Para la Parte 4:
Proporciona:
- URL del proyecto live
- Repositorio de código
- Documentación técnica
- Métricas de performance
- Lecciones aprendidas

---

## 🎯 Checklist de Dominio

Marca cuando domines cada aspecto:

**Configuración**
- [ ] Obtener token de Vercel
- [ ] Configurar MCP de Vercel
- [ ] Gestionar múltiples teams
- [ ] Proteger credenciales

**Deployments**
- [ ] Deploy básico
- [ ] Deploy de branches específicos
- [ ] Production deployments
- [ ] Rollbacks

**Dominios**
- [ ] Agregar dominios personalizados
- [ ] Configurar DNS
- [ ] SSL/TLS automático
- [ ] Redirects y rewrites

**Environment Variables**
- [ ] Configurar env vars
- [ ] Por ambiente (dev/preview/prod)
- [ ] Actualizar variables
- [ ] Secrets management

**Analytics**
- [ ] Ver analytics general
- [ ] Core Web Vitals
- [ ] Error tracking
- [ ] Performance analysis

**Preview Deployments**
- [ ] Crear previews manuales
- [ ] Previews automáticos
- [ ] Comparar con production
- [ ] Integración con PRs

**Frameworks**
- [ ] Next.js optimization
- [ ] ISR configuration
- [ ] Edge runtime
- [ ] Image optimization

---

## 💡 Mejores Prácticas

### 1. Environment Variables Seguras

```
✅ Bueno:
- Diferentes valores por ambiente
- Secrets nunca en código
- Prefijo NEXT_PUBLIC_ solo para valores públicos
- Rotar secrets regularmente

❌ Evita:
- Mismo valor en todos los ambientes
- Secrets en código fuente
- Variables públicas con datos sensibles
- Hardcodear API keys
```

### 2. Preview Deployments Efectivos

```
✅ Bueno:
- Preview por cada PR
- Compartir con stakeholders
- Testing antes de merge
- Feedback temprano

❌ Evita:
- Deploy directo a production
- No testear cambios
- Merge sin review
- Previews sin propósito
```

### 3. Performance Optimizado

```
✅ Bueno:
- Usar next/image para imágenes
- Code splitting automático
- ISR para contenido dinámico
- Edge runtime cuando aplique

❌ Evita:
- Imágenes no optimizadas
- Bundles monolíticos
- SSR innecesario
- No medir performance
```

### 4. Dominios y DNS

```
✅ Bueno:
- Usar Vercel DNS para simplicidad
- SSL automático habilitado
- Redirects configurados (www → apex)
- HTTPS forzado

❌ Evita:
- DNS mal configurado
- Certificados expirados
- URLs duplicadas (www y apex)
- HTTP permitido
```

### 5. Monitoreo Continuo

```
✅ Bueno:
- Revisar analytics semanalmente
- Monitorear Core Web Vitals
- Trackear errores proactivamente
- Alertas configuradas

❌ Evita:
- Deploy and forget
- Ignorar métricas
- No investigar errores
- Falta de alertas
```

---

## 🚀 Siguiente Nivel

Una vez que domines el MCP de Vercel, explora:

1. **Edge Functions Avanzadas**
   - Edge Middleware
   - Edge API Routes
   - Geolocation-based routing
   - A/B testing en Edge

2. **Integraciones**
   - Vercel + GitHub Actions
   - Vercel + Playwright (E2E tests)
   - Vercel + Sentry (error tracking)
   - Vercel + Analytics platforms

3. **Arquitecturas Avanzadas**
   - Monorepos con Turborepo
   - Micro-frontends
   - Multi-region deployments
   - Edge-first architecture

---

## 📚 Recursos Adicionales

### Documentación Oficial
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Vercel CLI](https://vercel.com/docs/cli)

### Learning
- [Vercel Guides](https://vercel.com/guides)
- [Next.js Learn](https://nextjs.org/learn)
- [Edge Functions](https://vercel.com/docs/functions/edge-functions)

### Tools
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel Analytics](https://vercel.com/analytics)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

**¡Subcapítulo 9.E Completo!**

Has aprendido a gestionar Vercel con Claude Code. Ahora puedes desplegar aplicaciones, configurar dominios, manejar env vars, analizar performance y todo sin salir de tu conversación con Claude.

**Anterior**: `capitulo_09_mcp_azure.md` (Azure MCP)
**Siguiente**: `capitulo_09_mcp_gcp.md` (Google Cloud Platform MCP)

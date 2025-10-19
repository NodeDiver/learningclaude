# Subcapítulos 9: Guías Completas de MCPs

Esta carpeta contiene guías detalladas para configurar y usar los MCPs (Model Context Protocol servers) más útiles en tu flujo de trabajo de desarrollo.

---

## 📚 Índice de Subcapítulos

### ✅ Disponibles

| Subcapítulo | Tema | Duración | Dificultad | Prioridad |
|-------------|------|----------|------------|-----------|
| **9.A** | [GitHub MCP](./capitulo_09_mcp_github.md) | 60 min | Intermedio | ⭐⭐⭐ **ESENCIAL** |
| **9.B** | [PostgreSQL MCP](./capitulo_09_mcp_postgresql.md) | 60 min | Intermedio | ⭐⭐⭐ Alta |
| **9.C** | [Slack MCP](./capitulo_09_mcp_slack.md) | 50 min | Intermedio | ⭐⭐ Media-Alta |
| **9.D** | [Azure MCP](./capitulo_09_mcp_azure.md) | 60 min | Avanzado | ⭐⭐ Media |
| **9.E** | [Vercel MCP](./capitulo_09_mcp_vercel.md) | 55 min | Intermedio | ⭐⭐ Media |
| **9.F** | [GCP MCP](./capitulo_09_mcp_gcp.md) | 60 min | Avanzado | ⭐⭐ Media |
| **9.G** | [Alby MCP](./capitulo_09_mcp_alby.md) | 50 min | Avanzado | ⭐ Especializado |
| **9.H** | [Discord MCP](./capitulo_09_mcp_discord.md) | 55 min | Intermedio | ⭐⭐ Media-Alta |
| **9.I** | [Nostr MCP](./capitulo_09_mcp_nostr.md) | 60 min | Intermedio-Avanzado | ⭐⭐ Media-Alta |
| **9.J** | [Sentry MCP](./capitulo_09_mcp_sentry.md) | 50 min | Intermedio | ⭐⭐⭐ Alta |
| **9.K** | [Canva MCP](./capitulo_09_mcp_canva.md) | 50 min | Intermedio | ⭐⭐ Media |

**Tiempo total**: ~8 horas

---

## 🎯 Orden Recomendado de Estudio

### Ruta Esencial (Para todos)
1. **GitHub MCP** - Fundamental para cualquier desarrollador
2. **PostgreSQL MCP** - Si trabajas con bases de datos SQL
3. **Slack MCP** - Si tu equipo usa Slack

### Ruta Cloud Developer
1. GitHub MCP
2. Azure MCP o GCP MCP (según tu plataforma)
3. Vercel MCP (si usas Vercel para deployment)

### Ruta Full-Stack
1. GitHub MCP
2. PostgreSQL MCP
3. Vercel MCP
4. Slack MCP

### Ruta Especializada
- **Bitcoin/Lightning**: Alby MCP
- **Enterprise Cloud**: Azure MCP + GCP MCP
- **Startup/Indie**: GitHub MCP + Vercel MCP + PostgreSQL MCP

---

## 📖 Descripción de Cada MCP

### 9.A: GitHub MCP ⭐⭐⭐
**Lo que aprenderás:**
- Gestión completa de repositorios desde Claude
- Crear y revisar Pull Requests
- Automatizar issues y project management
- Monitorear CI/CD con GitHub Actions
- Análisis de seguridad con Dependabot

**Casos de uso:**
- Code reviews automáticos
- Gestión de issues y PRs sin salir de Claude
- Debugging de builds fallidos
- Auditorías de seguridad

---

### 9.B: PostgreSQL MCP ⭐⭐⭐
**Lo que aprenderás:**
- Conectar Claude a bases de datos PostgreSQL
- Queries en lenguaje natural
- Análisis de schemas y estructuras
- Migrations y gestión de datos
- Debugging de queries lentos

**Casos de uso:**
- Análisis exploratorio de datos
- Generación de queries complejas
- Optimización de rendimiento
- Documentación de schemas

---

### 9.C: Slack MCP ⭐⭐
**Lo que aprenderás:**
- Integración con Slack API
- Automatizar notificaciones (PR mergeados, builds, etc.)
- Búsqueda en conversaciones históricas
- Gestión de canales y mensajes
- Workflows de equipo automatizados

**Casos de uso:**
- Notificaciones de CI/CD a Slack
- Resúmenes diarios automáticos
- Búsqueda de decisiones en conversaciones
- Alertas de incidentes

---

### 9.D: Azure MCP ⭐⭐
**Lo que aprenderás:**
- Gestión de recursos en Azure
- Deployments automáticos
- Mejores prácticas de Azure
- Monitoring y logging
- Cost optimization

**Casos de uso:**
- Infrastructure as Code
- Deployment automático de aplicaciones
- Gestión de recursos cloud
- Análisis de costos

---

### 9.E: Vercel MCP ⭐⭐
**Lo que aprenderás:**
- Deployments en Vercel
- Gestión de dominios
- Variables de entorno
- Analytics y monitoring
- Preview deployments automáticos

**Casos de uso:**
- Deploy de aplicaciones Next.js
- Testing de PRs en preview
- Gestión de configuración
- Analytics de performance

---

### 9.F: GCP MCP ⭐⭐
**Lo que aprenderás:**
- Google Cloud Platform resources
- Cloud Run y Cloud Functions
- Gestión de billing
- Security (IAM, SecOps)
- Database toolbox (Cloud SQL, Spanner)

**Casos de uso:**
- Serverless deployments
- Gestión de microservicios
- Optimización de costos GCP
- Security audits

---

### 9.G: Alby MCP ⭐
**Lo que aprenderás:**
- Bitcoin Lightning wallet integration
- Send/receive payments usando LLM
- Nostr Wallet Connect (NWC)
- Payment workflows automáticos
- LNURL y L402 support

**Casos de uso:**
- Pagos automáticos con Bitcoin
- Integración de pagos Lightning en apps
- Micropayments workflows
- Bitcoin para AI agents

---

### 9.H: Discord MCP ⭐⭐
**Lo que aprenderás:**
- Crear y configurar Discord bots
- Automatizar mensajes y respuestas
- Moderar servidores automáticamente
- Analizar conversaciones y actividad
- Integrar con CI/CD workflows

**Casos de uso:**
- Notificaciones de deployments y builds
- Bots de moderación automática
- Respuestas automáticas a preguntas comunes
- Monitoreo de servidores en tiempo real
- Integración con GitHub para alertas

---

### 9.I: Nostr MCP ⭐⭐
**Lo que aprenderás:**
- Protocolo Nostr descentralizado
- Publicar notas resistentes a censura
- Lightning Zaps (micropagos con Bitcoin)
- Gestión de identidad (nsec/npub)
- Conectar múltiples relays
- Crear bots y automatizaciones para Nostr

**Casos de uso:**
- Comunicación descentralizada sin censura
- Micropagos instantáneos con Lightning
- Bots de contenido y agregadores
- Integración social para apps web3
- Monetización de contenido con zaps

---

### 9.J: Sentry MCP ⭐⭐⭐
**Lo que aprenderás:**
- Monitoreo de errores con Sentry.io
- Analizar stacktraces automáticamente
- Debugging asistido por IA
- Priorizar bugs por impacto
- Integrar Sentry en workflow de desarrollo

**Casos de uso:**
- Debugging de errores de producción
- Análisis de root cause automático
- Priorización inteligente de bugs
- Tracking de releases y regresiones
- Alertas y notificaciones de errores críticos

---

### 9.K: Canva MCP ⭐⭐
**Lo que aprenderás:**
- Desarrollar apps para Canva Platform
- Usar Canva Apps SDK
- Crear extensiones de diseño
- Implementar data connectors
- Trabajar con Design API de Canva

**Casos de uso:**
- Crear apps de Canva con IA
- Importar datos externos a diseños
- Automatizar generación de designs
- Extensiones personalizadas para empresas
- Integraciones con servicios third-party

---

## 🚀 Top 20 MCPs Recomendados (No Incluidos Aún)

Estos MCPs son altamente recomendados y podrían agregarse en futuras actualizaciones:

### Desarrollo & Testing
1. **Puppeteer MCP** - Automatización de navegador con Puppeteer
2. **Playwright MCP** - Testing cross-browser robusto
3. **Docker MCP** - Gestión de containers
4. **Kubernetes MCP** - Orquestación de containers

### Productividad & Colaboración
5. **Linear MCP** - Project management y issue tracking
6. **Gmail MCP** - Gestión de emails
7. **Google Calendar MCP** - Scheduling y calendario
8. **Notion MCP** - Base de conocimiento y docs

### Cloud & Infrastructure
9. **AWS MCP** - Amazon Web Services integration
10. **Cloudflare MCP** - CDN y edge computing
11. **Supabase MCP** - Backend as a Service

### Datos & Analytics
12. **Memory Bank MCP** - Memoria persistente para LLMs
13. **Pinecone MCP** - Vector database
14. **Jupyter MCP** - Notebooks y análisis de datos

### Utilities
15. **Brave Search MCP** - Búsqueda web privada
16. **Google Maps MCP** - Geolocation y mapas
17. **Filesystem MCP** - Operaciones avanzadas de archivos
18. **Excel MCP** - Manipulación de spreadsheets
19. **Spotify MCP** - Control de música

---

## 💡 Cómo Usar Esta Carpeta

### Para Principiantes
1. Empieza con el **Capítulo 9** (MCP Básico) del curso principal
2. Luego estudia **GitHub MCP** (9.A) - Es esencial
3. Agrega **PostgreSQL** o **Slack** según tu stack

### Para Desarrolladores Experimentados
- Salta directo a los MCPs que necesites
- Cada subcapítulo es independiente
- Úsalos como referencia cuando configures nuevos MCPs

### Para Equipos
- Configuren los MCPs en equipo (GitHub + Slack mínimo)
- Estandaricen configuraciones compartiendo `.claude/mcp.json`
- Documenten workflows específicos de su equipo

---

## 🔧 Configuración Rápida

### Estructura Típica de .claude/mcp.json
```json
{
  "servers": {
    "github": {
      "transport": "http",
      "url": "https://mcp.github.com"
    },
    "postgres": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_URL": "postgresql://user:pass@localhost/db"
      }
    },
    "slack": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-token",
        "SLACK_TEAM_ID": "T01234567"
      }
    }
  }
}
```

### Autenticación
La mayoría de MCPs requieren autenticación:

```bash
# GitHub
claude mcp auth github

# Otros MCPs usan variables de entorno
# Ver cada subcapítulo para detalles
```

---

## 📋 Checklist de MCPs Esenciales

Marca los MCPs que ya tienes configurados:

**Tier 1: Esenciales**
- [ ] GitHub MCP
- [ ] PostgreSQL MCP (si usas SQL)
- [ ] Slack MCP (si usas Slack)

**Tier 2: Muy Útiles**
- [ ] Vercel MCP (si deployeas en Vercel)
- [ ] Azure MCP o GCP MCP (si usas cloud)
- [ ] Puppeteer/Playwright MCP (para testing)

**Tier 3: Especializados**
- [ ] Alby MCP (para Bitcoin/Lightning)
- [ ] Linear MCP (para project management)
- [ ] Memory Bank MCP (para proyectos grandes)

---

## 🆘 Troubleshooting Común

### "MCP server not found"
1. Verifica que `.claude/mcp.json` existe
2. Reinicia Claude Code: `exit` y vuelve a entrar
3. Verifica la sintaxis JSON con `cat .claude/mcp.json`

### "Authentication failed"
1. Revisa las credenciales en `.claude/mcp-credentials.json`
2. Reautentica: `claude mcp auth [nombre-mcp]`
3. Verifica que los tokens no hayan expirado

### "Command not found" (stdio MCPs)
1. Instala el package: `npm install -g [package]`
2. Verifica el path del comando: `which [comando]`
3. Asegúrate que Node.js esté instalado

### Performance Issues
1. Limita el número de MCPs activos simultáneamente
2. Usa solo los MCPs que realmente necesitas
3. Considera usar MCPs remotos HTTP en lugar de stdio para mejor performance

---

## 📚 Recursos Adicionales

### Documentación Oficial
- [MCP Specification](https://modelcontextprotocol.io)
- [Anthropic MCP Guide](https://docs.anthropic.com/en/docs/build-with-claude/mcp)
- [GitHub MCP Server](https://github.com/github/github-mcp-server)

### Repositorios de la Comunidad
- [Awesome MCP Servers](https://github.com/wong2/awesome-mcp-servers)
- [MCP Servers Collection](https://github.com/modelcontextprotocol/servers)
- [MCP Market](https://mcpmarket.com)

### Tutoriales y Guías
- [Building MCP Servers](https://vercel.com/blog/building-efficient-mcp-servers)
- [MCP Best Practices](https://docs.claude.com/en/docs/claude-code/mcp-best-practices)

---

## 🎓 Contribuciones

¿Quieres agregar un subcapítulo sobre otro MCP útil?

1. Sigue el formato de los subcapítulos existentes
2. Incluye: configuración, casos de uso, ejercicios, examen
3. Agrega a este README en la sección "Disponibles"
4. Envía tu contribución

---

**Anterior**: [Capítulo 9 - MCP Básico](../capitulo_09.md)
**Inicio**: [Curso Principal](../README.md)

---

**¿Listo para dominar los MCPs?** Empieza con [GitHub MCP (9.A)](./capitulo_09_mcp_github.md)

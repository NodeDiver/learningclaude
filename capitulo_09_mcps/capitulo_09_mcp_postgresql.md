# Subcapítulo 9.B: MCP de PostgreSQL - Gestiona Bases de Datos con Lenguaje Natural

**Duración**: 60 minutos
**Dificultad**: Intermedio
**Prerrequisito**: Capítulo 9 (MCP Básico)

---

## 🎯 Objetivos de Aprendizaje

Al final de este subcapítulo, podrás:
- Entender qué es el MCP de PostgreSQL y sus capacidades
- Configurar conexiones seguras a bases de datos PostgreSQL
- Ejecutar queries usando lenguaje natural
- Inspeccionar y analizar schemas de bases de datos
- Crear y gestionar migraciones de forma asistida
- Analizar datos y generar insights automáticamente
- Debuggear queries lentas y problemas de performance
- Integrar PostgreSQL en tu flujo de desarrollo diario

---

## 📖 Lección 9.B.1: ¿Qué es el MCP de PostgreSQL?

El **MCP de PostgreSQL** es un servidor que conecta Claude Code directamente con tus bases de datos PostgreSQL, permitiéndote interactuar con ellas usando lenguaje natural en lugar de escribir SQL manualmente.

### Concepto Fundamental

Piensa en el MCP de PostgreSQL como un **asistente experto en SQL**:

**Sin MCP de PostgreSQL:**
```
Tú ←→ Claude Code
       ↓ (manualmente)
   SQL Client ←→ PostgreSQL
   (escribes queries manualmente)
```

**Con MCP de PostgreSQL:**
```
Tú ←→ Claude Code ←→ MCP PostgreSQL ←→ Base de Datos
     ("muéstrame usuarios activos" → genera y ejecuta SQL)
```

### ¿Qué Puede Hacer?

El MCP de PostgreSQL proporciona **herramientas poderosas** para:

✅ **Queries en Lenguaje Natural**
- "Muéstrame los 10 usuarios más activos"
- "Cuántos pedidos tenemos por mes?"
- "Lista productos sin stock"
- Claude genera y ejecuta el SQL correcto

✅ **Inspección de Schema**
- Listar tablas y vistas
- Ver estructura de columnas
- Analizar índices y constraints
- Explorar relaciones entre tablas

✅ **Análisis de Datos**
- Generar reportes automáticamente
- Detectar anomalías en datos
- Calcular métricas de negocio
- Visualizar tendencias

✅ **Gestión de Migraciones**
- Crear tablas con best practices
- Modificar schemas de forma segura
- Generar migration scripts
- Validar cambios antes de aplicar

✅ **Performance y Debugging**
- Analizar queries lentas
- Sugerir índices faltantes
- Explicar query plans
- Optimizar consultas complejas

✅ **Seguridad**
- Validar permisos de usuario
- Detectar vulnerabilidades SQL injection
- Auditar accesos a datos sensibles
- Generar queries parametrizadas

### Ventajas Clave

| Sin MCP PostgreSQL | Con MCP PostgreSQL |
|-------------------|-------------------|
| Escribir SQL manualmente | Pedir en lenguaje natural |
| Recordar nombres de tablas | Claude conoce el schema |
| Debuggear queries lentas | Análisis automático de performance |
| Escribir joins complejos | "muéstrame datos relacionados" |
| Consultar documentación | Claude sugiere mejores prácticas |
| **Lento y propenso a errores** | **Rápido y confiable** ⚡ |

---

## 📖 Lección 9.B.2: Instalación y Configuración

### Paso 1: Instalar el Servidor MCP

```bash
# Instalar el MCP de PostgreSQL
npm install -g @modelcontextprotocol/server-postgres

# O usando Claude Code CLI
claude mcp add --transport stdio \
  --name postgres \
  --command "npx" \
  --args "-y @modelcontextprotocol/server-postgres"
```

### Paso 2: Configuración Manual

**Archivo: `.claude/mcp.json`** (proyecto específico)
```json
{
  "servers": {
    "postgres": {
      "transport": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres"
      ],
      "env": {
        "POSTGRES_CONNECTION_STRING": "postgresql://usuario:password@localhost:5432/mi_base_datos"
      }
    }
  }
}
```

O en **`~/.claude/mcp.json`** (global - todos los proyectos)

### Paso 3: Configurar Variables de Entorno (Recomendado)

Para mayor seguridad, usa variables de entorno en lugar de hardcodear credenciales:

**Archivo: `.env`**
```bash
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DATABASE=mi_base_datos
POSTGRES_USER=mi_usuario
POSTGRES_PASSWORD=mi_password_seguro
```

**Actualiza `mcp.json`:**
```json
{
  "servers": {
    "postgres": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_HOST": "${POSTGRES_HOST}",
        "POSTGRES_PORT": "${POSTGRES_PORT}",
        "POSTGRES_DATABASE": "${POSTGRES_DATABASE}",
        "POSTGRES_USER": "${POSTGRES_USER}",
        "POSTGRES_PASSWORD": "${POSTGRES_PASSWORD}"
      }
    }
  }
}
```

### Paso 4: Múltiples Conexiones

Si trabajas con múltiples bases de datos:

```json
{
  "servers": {
    "postgres-dev": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "postgresql://user:pass@localhost:5432/dev_db"
      }
    },
    "postgres-staging": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "postgresql://user:pass@staging.db:5432/staging_db"
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
# postgres (stdio) - @modelcontextprotocol/server-postgres [connected ✓]
```

### Probar Conexión

```
Tú: ¿Puedes conectarte a la base de datos?

Claude: [usa postgres_test_connection]
✓ Conexión exitosa a PostgreSQL
Database: mi_base_datos
Version: PostgreSQL 15.4
Host: localhost:5432
```

---

## 📖 Lección 9.B.3: Queries en Lenguaje Natural

### Herramienta: postgres_query

Ejecuta queries SQL generadas automáticamente a partir de lenguaje natural.

**Ejemplo básico:**
```
Tú: Muéstrame todos los usuarios

Claude: [genera y ejecuta query]
SELECT id, nombre, email, created_at
FROM usuarios
ORDER BY created_at DESC;

Resultados (5 registros):
┌────┬──────────────┬─────────────────────┬─────────────────────┐
│ id │ nombre       │ email               │ created_at          │
├────┼──────────────┼─────────────────────┼─────────────────────┤
│ 5  │ Ana García   │ ana@example.com     │ 2025-10-18 10:30:00 │
│ 4  │ Carlos López │ carlos@example.com  │ 2025-10-17 15:20:00 │
│ 3  │ María Pérez  │ maria@example.com   │ 2025-10-16 09:45:00 │
│ 2  │ Juan Ramírez │ juan@example.com    │ 2025-10-15 14:10:00 │
│ 1  │ Pedro Sánchez│ pedro@example.com   │ 2025-10-14 11:00:00 │
└────┴──────────────┴─────────────────────┴─────────────────────┘
```

### Queries con Filtros

```
Tú: Dame usuarios registrados en los últimos 7 días

Claude: [genera query con fecha]
SELECT nombre, email, created_at
FROM usuarios
WHERE created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;

Resultados: 2 usuarios registrados esta semana
```

### Queries con Agregaciones

```
Tú: ¿Cuántos pedidos tenemos por estado?

Claude: [genera query con GROUP BY]
SELECT
  estado,
  COUNT(*) as total,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as porcentaje
FROM pedidos
GROUP BY estado
ORDER BY total DESC;

Resultados:
┌────────────┬───────┬────────────┐
│ estado     │ total │ porcentaje │
├────────────┼───────┼────────────┤
│ completado │ 1,234 │ 68.50%     │
│ pendiente  │   456 │ 25.30%     │
│ cancelado  │   112 │  6.20%     │
└────────────┴───────┴────────────┘
```

### Queries con Joins

```
Tú: Muéstrame los pedidos con información del usuario y productos

Claude: [genera query con múltiples joins]
SELECT
  p.id as pedido_id,
  u.nombre as usuario,
  pr.nombre as producto,
  p.cantidad,
  p.precio_total,
  p.created_at
FROM pedidos p
JOIN usuarios u ON p.usuario_id = u.id
JOIN productos pr ON p.producto_id = pr.id
WHERE p.created_at >= NOW() - INTERVAL '24 hours'
ORDER BY p.created_at DESC
LIMIT 10;

Pedidos recientes (últimas 24 horas):
[muestra resultados con datos relacionados]
```

---

## 📖 Lección 9.B.4: Inspección de Schema

### Herramienta: postgres_list_tables

Lista todas las tablas en la base de datos.

```
Tú: ¿Qué tablas tengo en la base de datos?

Claude: [usa postgres_list_tables]

Tablas en mi_base_datos (8 tablas):

📋 Tablas de Usuario:
- usuarios (5,234 registros)
- perfiles (5,234 registros)
- sesiones (12,456 registros)

📦 Tablas de Productos:
- productos (892 registros)
- categorias (45 registros)
- inventario (892 registros)

🛒 Tablas de Pedidos:
- pedidos (1,802 registros)
- detalles_pedido (4,567 registros)
```

### Herramienta: postgres_describe_table

Analiza la estructura de una tabla específica.

```
Tú: Muéstrame la estructura de la tabla usuarios

Claude: [usa postgres_describe_table]

Tabla: usuarios
Registros: 5,234
Última actualización: 2025-10-18 10:30:00

Columnas (8):
┌─────────────┬─────────────┬──────────┬─────────┬────────────────┐
│ Columna     │ Tipo        │ Nullable │ Default │ Constraints    │
├─────────────┼─────────────┼──────────┼─────────┼────────────────┤
│ id          │ SERIAL      │ NO       │ nextval │ PRIMARY KEY    │
│ nombre      │ VARCHAR(100)│ NO       │ -       │ -              │
│ email       │ VARCHAR(255)│ NO       │ -       │ UNIQUE         │
│ password    │ VARCHAR(255)│ NO       │ -       │ -              │
│ activo      │ BOOLEAN     │ NO       │ true    │ -              │
│ rol         │ VARCHAR(20) │ NO       │ 'user'  │ CHECK (rol...) │
│ created_at  │ TIMESTAMP   │ NO       │ NOW()   │ -              │
│ updated_at  │ TIMESTAMP   │ YES      │ NULL    │ -              │
└─────────────┴─────────────┴──────────┴─────────┴────────────────┘

Índices (3):
- usuarios_pkey (PRIMARY KEY en id)
- usuarios_email_key (UNIQUE en email)
- idx_usuarios_activo (INDEX en activo)

Claves foráneas (0):
- Ninguna

Referencias (2):
- pedidos.usuario_id → usuarios.id
- perfiles.usuario_id → usuarios.id
```

### Herramienta: postgres_analyze_relationships

Analiza relaciones entre tablas.

```
Tú: ¿Cómo se relacionan las tablas de mi base de datos?

Claude: [usa postgres_analyze_relationships]

Relaciones detectadas:

usuarios (tabla central)
  ↓ 1:N
  pedidos (usuario_id)
    ↓ 1:N
    detalles_pedido (pedido_id)
      ↓ N:1
      productos (producto_id)
        ↓ N:1
        categorias (categoria_id)

usuarios
  ↓ 1:1
  perfiles (usuario_id)

usuarios
  ↓ 1:N
  sesiones (usuario_id)

Modelo de datos:
- Arquitectura: Normalizada (3NF)
- Integridad referencial: ✓ Completa
- Índices en FK: ✓ Todos indexados
```

---

## 📖 Lección 9.B.5: Análisis de Datos

### Generar Reportes Automáticos

```
Tú: Dame un reporte de ventas del último mes

Claude: [analiza datos y genera reporte]

📊 REPORTE DE VENTAS - Octubre 2025

Resumen General:
- Total ventas: $45,678.50
- Total pedidos: 234
- Ticket promedio: $195.20
- Crecimiento vs mes anterior: +12.5% 📈

Top 5 Productos Vendidos:
1. Laptop HP ProBook - 45 unidades - $18,900
2. Mouse Logitech MX - 89 unidades - $4,450
3. Teclado Mecánico - 67 unidades - $6,700
4. Monitor Samsung 27" - 23 unidades - $9,200
5. Webcam Full HD - 112 unidades - $5,600

Ventas por Categoría:
- Computadoras: $28,100 (61.5%)
- Accesorios: $12,345 (27.0%)
- Periféricos: $5,233.50 (11.5%)

Tendencia Semanal:
Semana 1: $9,234
Semana 2: $11,456
Semana 3: $13,890  ← Pico
Semana 4: $11,098

Insights:
⚠️ Stock bajo en "Laptop HP ProBook" (3 unidades)
✓ Incremento sostenido en accesorios
💡 Promocionar webcams (alta rotación)
```

### Detectar Anomalías

```
Tú: ¿Hay algo inusual en los datos de pedidos?

Claude: [analiza patrones]

🔍 Análisis de Anomalías Detectadas:

⚠️ Anomalía 1: Pedidos duplicados
- Usuario #234 tiene 5 pedidos idénticos en 2 minutos
- Posible bug en el frontend
- Acción: Revisar lógica de submit button

⚠️ Anomalía 2: Precios inconsistentes
- Producto #456 vendido a 3 precios diferentes hoy
- $99, $89, $199
- Acción: Validar lógica de descuentos

⚠️ Anomalía 3: Spike inusual
- 50 pedidos entre 2:00-2:05 AM
- 10x más que el promedio nocturno
- Posible script automatizado

✓ Resto de datos: Patrones normales
```

### Calcular Métricas de Negocio

```
Tú: Calcula las métricas clave del negocio

Claude: [ejecuta múltiples queries analíticas]

📈 MÉTRICAS DE NEGOCIO - Dashboard

KPIs Principales:
┌────────────────────┬──────────┬──────────┬─────────┐
│ Métrica            │ Hoy      │ Mes      │ Cambio  │
├────────────────────┼──────────┼──────────┼─────────┤
│ Usuarios activos   │ 1,234    │ 5,234    │ +15%    │
│ Nuevos registros   │ 45       │ 892      │ +8%     │
│ Tasa conversión    │ 3.2%     │ 2.8%     │ +0.4pp  │
│ Valor promedio ord │ $195     │ $187     │ +4.3%   │
│ Pedidos/usuario    │ 1.8      │ 1.6      │ +12.5%  │
└────────────────────┴──────────┴──────────┴─────────┘

Retención de Usuarios:
- Día 1: 85%
- Día 7: 45%
- Día 30: 28%
- Día 90: 15%

Lifetime Value (LTV):
- Promedio: $456
- Top 10%: $2,345
- Mediana: $289

Churn Rate:
- Mensual: 5.2%
- Trimestral: 18.5%
```

---

## 📖 Lección 9.B.6: Migraciones de Base de Datos

### Crear Tablas con Best Practices

```
Tú: Necesito crear una tabla para almacenar notificaciones de usuarios

Claude: Generaré una tabla de notificaciones siguiendo best practices...

[genera migration script]

-- Migration: create_notifications_table
-- Created: 2025-10-18 10:30:00

CREATE TABLE IF NOT EXISTS notificaciones (
  -- Primary Key
  id BIGSERIAL PRIMARY KEY,

  -- Foreign Keys
  usuario_id INTEGER NOT NULL,

  -- Datos principales
  tipo VARCHAR(50) NOT NULL,
  titulo VARCHAR(200) NOT NULL,
  mensaje TEXT NOT NULL,
  url VARCHAR(500),

  -- Estado
  leida BOOLEAN NOT NULL DEFAULT false,
  archivada BOOLEAN NOT NULL DEFAULT false,

  -- Metadata
  datos_adicionales JSONB,

  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  leida_at TIMESTAMP,

  -- Constraints
  CONSTRAINT fk_notificaciones_usuario
    FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id)
    ON DELETE CASCADE,

  CONSTRAINT chk_tipo_valido
    CHECK (tipo IN ('info', 'warning', 'error', 'success'))
);

-- Índices para performance
CREATE INDEX idx_notificaciones_usuario
  ON notificaciones(usuario_id);

CREATE INDEX idx_notificaciones_leida
  ON notificaciones(usuario_id, leida)
  WHERE leida = false;

CREATE INDEX idx_notificaciones_created
  ON notificaciones(created_at DESC);

-- Comentarios
COMMENT ON TABLE notificaciones IS
  'Almacena notificaciones enviadas a usuarios';
COMMENT ON COLUMN notificaciones.datos_adicionales IS
  'JSON con datos contextuales de la notificación';

Características incluidas:
✓ Auto-incrementing ID (BIGSERIAL)
✓ Foreign key con cascade delete
✓ Check constraint para validación
✓ Índices optimizados para queries comunes
✓ Campos de timestamps
✓ Soporte para datos JSONB flexibles

¿Quieres que ejecute esta migración?
```

### Modificar Schemas de Forma Segura

```
Tú: Necesito agregar una columna "prioridad" a la tabla notificaciones

Claude: [genera migration segura]

-- Migration: add_prioridad_to_notificaciones
-- Safe migration: NO downtime

BEGIN;

-- Paso 1: Agregar columna como nullable
ALTER TABLE notificaciones
  ADD COLUMN prioridad VARCHAR(20);

-- Paso 2: Establecer valor default para registros existentes
UPDATE notificaciones
  SET prioridad = 'normal'
  WHERE prioridad IS NULL;

-- Paso 3: Hacer la columna NOT NULL
ALTER TABLE notificaciones
  ALTER COLUMN prioridad SET NOT NULL;

-- Paso 4: Agregar default para nuevos registros
ALTER TABLE notificaciones
  ALTER COLUMN prioridad SET DEFAULT 'normal';

-- Paso 5: Agregar constraint de validación
ALTER TABLE notificaciones
  ADD CONSTRAINT chk_prioridad_valida
  CHECK (prioridad IN ('baja', 'normal', 'alta', 'urgente'));

-- Paso 6: Crear índice si es necesario
CREATE INDEX idx_notificaciones_prioridad
  ON notificaciones(prioridad)
  WHERE prioridad IN ('alta', 'urgente');

COMMIT;

-- Rollback (en caso de error):
-- ALTER TABLE notificaciones DROP COLUMN prioridad;

Esta migración:
✓ Es segura (no bloquea la tabla)
✓ Maneja datos existentes
✓ Incluye validación
✓ Optimiza queries futuras
✓ Incluye plan de rollback
```

### Validar Cambios Antes de Aplicar

```
Tú: Antes de aplicar, ¿puedes validar que esta migración no rompa nada?

Claude: [analiza impacto de la migración]

🔍 Análisis de Impacto de Migración

Cambios a aplicar:
- ADD COLUMN prioridad VARCHAR(20)

Validaciones:
✓ Sintaxis SQL: Correcta
✓ Tabla existe: notificaciones ✓
✓ Columna no existe: prioridad ✓
✓ Tipo de dato: VARCHAR(20) válido
✓ Constraint: Valores permitidos OK

Impacto estimado:
- Registros afectados: 12,456
- Tiempo estimado: ~0.5 segundos
- Bloqueo de tabla: Mínimo (< 100ms)
- Espacio adicional: ~250KB

Queries afectadas (análisis de código):
⚠️ app/services/NotificationService.ts:45
  - SELECT * FROM notificaciones
  - Impacto: Nueva columna en resultados (no rompe)

✓ app/models/Notification.ts:12
  - INSERT INTO notificaciones (...)
  - Impacto: Ninguno (usa DEFAULT)

Recomendación: ✅ SEGURO APLICAR
```

---

## 📖 Lección 9.B.7: Performance y Debugging

### Analizar Queries Lentas

```
Tú: Esta query es muy lenta, ¿por qué?

SELECT p.*, u.nombre, COUNT(dp.id) as items
FROM pedidos p
JOIN usuarios u ON p.usuario_id = u.id
LEFT JOIN detalles_pedido dp ON dp.pedido_id = p.id
WHERE p.created_at >= '2025-01-01'
GROUP BY p.id, u.nombre
ORDER BY p.created_at DESC;

Claude: [analiza query]

🐌 Análisis de Performance

EXPLAIN ANALYZE resultados:
┌─────────────────────────┬──────────┬─────────┐
│ Operación               │ Tiempo   │ Rows    │
├─────────────────────────┼──────────┼─────────┤
│ Sort                    │ 345ms    │ 1,802   │
│ HashAggregate           │ 234ms    │ 1,802   │
│ Hash Join (usuarios)    │ 123ms    │ 1,802   │
│ Seq Scan (pedidos) ⚠️   │ 890ms    │ 8,234   │
│ Hash Join (detalles)    │ 156ms    │ 4,567   │
└─────────────────────────┴──────────┴─────────┘

Total: 1,748ms (muy lento) 🔴

Problemas detectados:
1. ⚠️ Sequential Scan en tabla pedidos
   - Escaneando 8,234 registros completos
   - Falta índice en created_at

2. ⚠️ GROUP BY innecesario
   - Agrupando por u.nombre (puede variar)
   - Debería usar u.id

3. ⚠️ SELECT p.*
   - Trayendo todas las columnas
   - Muchas no se usan

Soluciones recomendadas:
```

### Sugerir Índices Faltantes

```
Claude: [continúa análisis]

💡 Optimizaciones Sugeridas

1. Crear índice en created_at:
CREATE INDEX idx_pedidos_created_at
  ON pedidos(created_at DESC);

Impacto estimado: 890ms → 45ms (95% más rápido)

2. Query optimizada:
SELECT
  p.id,
  p.numero_pedido,
  p.total,
  p.created_at,
  u.nombre,
  COUNT(dp.id) as items
FROM pedidos p
JOIN usuarios u ON p.usuario_id = u.id
LEFT JOIN detalles_pedido dp ON dp.pedido_id = p.id
WHERE p.created_at >= '2025-01-01'
GROUP BY p.id, u.id  -- Cambio aquí
ORDER BY p.created_at DESC;

3. Si es query común, considera:
CREATE MATERIALIZED VIEW pedidos_con_items AS
  [query optimizada];

CREATE UNIQUE INDEX ON pedidos_con_items(id);

Resultado esperado:
- Tiempo actual: 1,748ms
- Tiempo optimizado: ~50ms
- Mejora: 97% más rápido ⚡

¿Quieres que aplique estas optimizaciones?
```

### Explicar Query Plans

```
Tú: Explícame qué significa este query plan

Claude: [explica en lenguaje simple]

📚 Entendiendo el Query Plan

Tu query hace esto (en orden):

1. Sequential Scan en pedidos (890ms) 🐌
   "Leo toda la tabla pedidos línea por línea
    buscando registros desde 2025-01-01"

   ¿Por qué es lento?
   - Revisa 8,234 registros uno por uno
   - No puede usar índice (no existe)
   - Como buscar en libro sin índice

2. Hash Join con usuarios (123ms) ⚡
   "Para cada pedido, busco el usuario"

   ¿Por qué es rápido?
   - Usa índice PRIMARY KEY en usuarios.id
   - Búsqueda O(1) por hash table

3. Hash Join con detalles_pedido (156ms)
   "Para cada pedido, cuento sus items"

   Aceptable porque:
   - Usa índice en detalles_pedido.pedido_id

4. HashAggregate (234ms)
   "Agrupo resultados por pedido y usuario"

5. Sort (345ms)
   "Ordeno por fecha más reciente primero"

El cuello de botella es el paso 1 (890ms de 1,748ms total)
```

---

## 📖 Lección 9.B.8: Casos de Uso Prácticos

### Caso 1: Limpieza de Datos

```
Tú: Tengo datos duplicados en la tabla usuarios, ayúdame a limpiarlos

Claude: [analiza duplicados]

🔍 Análisis de Duplicados

Encontrados duplicados por email:

┌───────────────────┬──────────┐
│ Email             │ Count    │
├───────────────────┼──────────┤
│ juan@example.com  │ 3        │
│ maria@example.com │ 2        │
│ pedro@example.com │ 2        │
└───────────────────┴──────────┘

Detalles de duplicados:
juan@example.com:
  - ID 123 (created_at: 2025-01-15) ← más antiguo
  - ID 456 (created_at: 2025-02-10)
  - ID 789 (created_at: 2025-03-05) ← más reciente

Plan de limpieza:
1. Identificar registro "maestro" (más completo/reciente)
2. Migrar relaciones (pedidos, sesiones, etc.)
3. Eliminar duplicados
4. Agregar constraint UNIQUE

¿Quieres que genere el script de limpieza?
```

### Caso 2: Auditoría de Cambios

```
Tú: Necesito auditar quién modificó qué en la tabla productos

Claude: [genera sistema de auditoría]

Crearé un sistema de auditoría para productos...

-- 1. Tabla de auditoría
CREATE TABLE productos_audit (
  id BIGSERIAL PRIMARY KEY,
  producto_id INTEGER NOT NULL,
  operacion VARCHAR(10) NOT NULL, -- INSERT, UPDATE, DELETE
  usuario VARCHAR(100),
  timestamp TIMESTAMP NOT NULL DEFAULT NOW(),

  -- Datos antes/después
  datos_anteriores JSONB,
  datos_nuevos JSONB,

  -- Campos modificados
  campos_modificados TEXT[],

  -- Metadata
  ip_address INET,
  user_agent TEXT
);

-- 2. Trigger para capturar cambios
CREATE OR REPLACE FUNCTION audit_productos()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO productos_audit (
      producto_id, operacion, datos_anteriores, datos_nuevos, campos_modificados
    )
    VALUES (
      NEW.id,
      'UPDATE',
      to_jsonb(OLD),
      to_jsonb(NEW),
      ARRAY(
        SELECT key FROM jsonb_each(to_jsonb(NEW))
        WHERE to_jsonb(NEW)->>key IS DISTINCT FROM to_jsonb(OLD)->>key
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER productos_audit_trigger
  AFTER UPDATE ON productos
  FOR EACH ROW EXECUTE FUNCTION audit_productos();

Ahora puedo mostrar:
- Historial completo de cambios
- Quién hizo cada cambio
- Qué campos se modificaron
- Valores antes/después

¿Quieres ver el historial de un producto específico?
```

### Caso 3: Generación de Test Data

```
Tú: Necesito generar datos de prueba realistas para development

Claude: [genera test data inteligente]

Generaré datos de prueba coherentes...

-- 1. Usuarios (100 usuarios)
INSERT INTO usuarios (nombre, email, password, rol)
SELECT
  'Usuario ' || generate_series,
  'user' || generate_series || '@test.com',
  crypt('password123', gen_salt('bf')),
  CASE
    WHEN generate_series <= 5 THEN 'admin'
    WHEN generate_series <= 20 THEN 'moderador'
    ELSE 'usuario'
  END
FROM generate_series(1, 100);

-- 2. Productos (50 productos)
INSERT INTO productos (nombre, precio, stock, categoria_id)
SELECT
  array['Laptop', 'Mouse', 'Teclado', 'Monitor', 'Webcam'][1 + floor(random() * 5)::int]
    || ' #' || generate_series,
  (50 + random() * 950)::numeric(10,2),
  floor(random() * 100)::int,
  1 + floor(random() * 5)::int
FROM generate_series(1, 50);

-- 3. Pedidos (200 pedidos distribuidos en 90 días)
INSERT INTO pedidos (usuario_id, producto_id, cantidad, created_at)
SELECT
  1 + floor(random() * 100)::int,
  1 + floor(random() * 50)::int,
  1 + floor(random() * 5)::int,
  NOW() - (random() * 90 || ' days')::interval
FROM generate_series(1, 200);

Datos generados:
✓ 100 usuarios (5 admins, 15 moderadores, 80 usuarios)
✓ 50 productos con precios $50-$1000
✓ 200 pedidos distribuidos en 90 días
✓ Datos coherentes y relacionados correctamente

Base de datos lista para testing
```

---

## 🛠️ Ejercicios Prácticos

### Ejercicio 9.B.1: Configuración Básica
1. Instala el MCP de PostgreSQL
2. Configura conexión a una base de datos local
3. Verifica la conexión exitosa
4. Lista todas las tablas disponibles
5. Describe la estructura de 2 tablas

### Ejercicio 9.B.2: Queries en Lenguaje Natural
1. Pide a Claude 5 queries diferentes en lenguaje natural
2. Ejecuta una query con filtros de fecha
3. Genera un reporte con agregaciones (COUNT, SUM, AVG)
4. Realiza una query con JOIN entre 3 tablas
5. Compara los resultados con queries SQL manuales

### Ejercicio 9.B.3: Análisis de Datos
1. Genera un dashboard de métricas clave de tu base de datos
2. Identifica anomalías o patrones inusuales
3. Calcula tendencias en los últimos 30 días
4. Crea un reporte comparativo entre períodos
5. Exporta los resultados en formato tabla

### Ejercicio 9.B.4: Optimización de Performance
1. Identifica las 3 queries más lentas de tu aplicación
2. Pide a Claude que analice su performance
3. Implementa los índices sugeridos
4. Mide la mejora en tiempo de ejecución
5. Documenta el antes/después

### Ejercicio 9.B.5: Migraciones
1. Diseña una nueva tabla con Claude siguiendo best practices
2. Agrega una columna a una tabla existente de forma segura
3. Crea índices optimizados para tus queries más comunes
4. Implementa un sistema básico de auditoría
5. Valida que todo funcione correctamente

---

## 📝 Examen 9.B: Maestría del MCP de PostgreSQL

### Parte 1: Preguntas Teóricas (3 puntos)

**Pregunta 1:** ¿Cuáles son las 3 principales ventajas de usar el MCP de PostgreSQL vs escribir SQL manualmente?

**Pregunta 2:** Explica la diferencia entre estos conceptos:
- a) Sequential Scan vs Index Scan
- b) INNER JOIN vs LEFT JOIN
- c) WHERE vs HAVING
- d) Migration segura vs Migration que puede causar downtime

**Pregunta 3:** ¿Qué consideraciones de seguridad debes tener al configurar el MCP de PostgreSQL en un proyecto de equipo?

### Parte 2: Configuración y Schema (2 puntos)

1. Muestra cómo configurarías el MCP de PostgreSQL para conectarse a dos bases de datos diferentes (dev y production)
2. Escribe las variables de entorno necesarias sin exponer credenciales
3. ¿Cómo verificarías que la conexión es segura y funcional?

### Parte 3: Práctica - Análisis y Optimización (5 puntos)

Escenario: Tienes una aplicación de e-commerce con estas tablas:
- usuarios (50,000 registros)
- productos (5,000 registros)
- pedidos (200,000 registros)
- detalles_pedido (800,000 registros)

**Tareas:**
1. Pide a Claude que genere un dashboard completo de métricas de negocio
2. Identifica las 3 queries más importantes de la aplicación
3. Pide análisis de performance de cada query
4. Implementa las optimizaciones sugeridas
5. Documenta la mejora en performance (antes/después)

### Parte 4: Proyecto Real (Bonus +3 puntos)

Elige uno de estos proyectos:

**Opción A: Sistema de Auditoría Completo**
1. Implementa auditoría para 3 tablas importantes
2. Crea triggers para capturar INSERT, UPDATE, DELETE
3. Genera reportes de "quién cambió qué y cuándo"
4. Implementa búsqueda en historial de cambios
5. Documenta el sistema completo

**Opción B: Optimización de Base de Datos Real**
1. Toma una base de datos real con problemas de performance
2. Analiza todas las tablas y relaciones
3. Identifica queries lentas y cuellos de botella
4. Implementa optimizaciones (índices, refactoring de queries)
5. Genera reporte antes/después con métricas

---

## ✅ Cómo Enviar Tu Examen

### Para la Parte 1:
```
Parte 1:
P1: [respuesta detallada]
P2: [respuestas para cada inciso]
P3: [consideraciones de seguridad]
```

### Para la Parte 2:
Muestra los archivos de configuración completos y las verificaciones realizadas.

### Para la Parte 3:
Documenta cada paso con:
- Queries generadas
- Análisis de performance
- Optimizaciones aplicadas
- Métricas de mejora

### Para la Parte 4:
Proporciona:
- Código SQL completo
- Scripts de migración
- Resultados de pruebas
- Documentación del sistema
- Lecciones aprendidas

---

## 🎯 Checklist de Dominio

Marca cuando domines cada aspecto:

**Configuración**
- [ ] Instalar MCP de PostgreSQL
- [ ] Configurar conexiones seguras
- [ ] Usar variables de entorno
- [ ] Verificar conexión

**Queries**
- [ ] Ejecutar queries en lenguaje natural
- [ ] Usar filtros y agregaciones
- [ ] Realizar JOINs complejos
- [ ] Interpretar resultados

**Schema**
- [ ] Listar tablas y estructura
- [ ] Analizar relaciones entre tablas
- [ ] Entender tipos de datos y constraints
- [ ] Inspeccionar índices

**Análisis**
- [ ] Generar reportes automáticos
- [ ] Detectar anomalías en datos
- [ ] Calcular métricas de negocio
- [ ] Visualizar tendencias

**Migraciones**
- [ ] Crear tablas con best practices
- [ ] Modificar schemas de forma segura
- [ ] Validar cambios antes de aplicar
- [ ] Generar scripts de rollback

**Performance**
- [ ] Analizar queries lentas
- [ ] Interpretar EXPLAIN ANALYZE
- [ ] Crear índices optimizados
- [ ] Medir mejoras de performance

**Avanzado**
- [ ] Implementar auditoría
- [ ] Limpiar datos duplicados
- [ ] Generar test data realista
- [ ] Optimizar base de datos completa

---

## 💡 Mejores Prácticas

### 1. Seguridad Primero

```
✅ Bueno:
- Usar variables de entorno para credenciales
- Conexiones con SSL/TLS
- Usuarios con permisos limitados
- Nunca commitar passwords

❌ Evita:
- Hardcodear credenciales en código
- Usar usuario root/postgres
- Conexiones sin encriptar
- Compartir credenciales en repositorios
```

### 2. Performance desde el Inicio

```
✅ Bueno:
- Crear índices en foreign keys
- Usar EXPLAIN para queries importantes
- Limitar resultados con LIMIT
- Monitorear queries lentas

❌ Evita:
- SELECT * innecesarios
- Falta de índices en columnas filtradas
- Queries N+1
- Ignorar advertencias de performance
```

### 3. Migraciones Seguras

```
✅ Bueno:
- Probar en ambiente de desarrollo primero
- Usar transacciones (BEGIN/COMMIT)
- Validar impacto antes de aplicar
- Tener plan de rollback
- Hacer backups antes de cambios grandes

❌ Evita:
- Modificar producción sin probar
- Migraciones que bloquean tablas
- Eliminar datos sin backup
- Cambios sin validación
```

### 4. Queries Legibles

```
✅ Bueno:
Pide queries específicas y claras:
"Muéstrame usuarios activos que hicieron pedidos en los últimos 30 días,
ordenados por total gastado"

❌ Vago:
"Dame usuarios"
```

### 5. Documentación de Cambios

```
✅ Bueno:
- Comentar por qué se hace cada cambio
- Documentar decisiones de diseño
- Mantener log de migraciones
- Versionar scripts SQL

❌ Evita:
- Cambios sin documentación
- Scripts SQL sin comentarios
- Migraciones sin descripción
```

---

## 🚀 Siguiente Nivel

Una vez que domines el MCP de PostgreSQL, explora:

1. **Optimizaciones Avanzadas**
   - Particionado de tablas
   - Materialized views
   - Full-text search
   - Query optimization automática

2. **Integración con Aplicaciones**
   - ORMs (Prisma, TypeORM, Sequelize)
   - GraphQL sobre PostgreSQL
   - Real-time subscriptions
   - Caching strategies

3. **Combinar con otros MCPs**
   - GitHub MCP: Gestionar migraciones en PRs
   - Slack MCP: Notificar cambios en BD
   - Monitoring MCPs: Alertas de performance

---

## 📚 Recursos Adicionales

### Documentación Oficial
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [MCP PostgreSQL Server](https://github.com/modelcontextprotocol/servers/tree/main/src/postgres)
- [SQL Performance Explained](https://sql-performance-explained.com/)

### Tutoriales
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- [Use The Index, Luke](https://use-the-index-luke.com/)
- [Explain PostgreSQL](https://www.pgexplain.dev/)

### Tools
- [pgAdmin](https://www.pgadmin.org/) - GUI para PostgreSQL
- [DBeaver](https://dbeaver.io/) - Universal database tool
- [pg_stat_statements](https://www.postgresql.org/docs/current/pgstatstatements.html) - Query statistics

---

**¡Subcapítulo 9.B Completo!**

Has aprendido a gestionar PostgreSQL con lenguaje natural usando Claude Code. Ahora puedes consultar datos, optimizar queries, crear migraciones y mantener bases de datos de manera profesional.

**Anterior**: `capitulo_09_mcp_github.md` (GitHub MCP)
**Siguiente**: `capitulo_09_mcp_slack.md` (Slack MCP)

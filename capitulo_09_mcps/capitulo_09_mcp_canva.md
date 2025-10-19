# Subcapítulo 9.K: MCP de Canva - Desarrollo Asistido por IA

**Duración**: 50 minutos
**Dificultad**: Intermedio
**Prerrequisito**: Capítulo 9 (MCP Básico)

---

## 🎯 Objetivos de Aprendizaje

Al final de este subcapítulo, podrás:
- Entender qué es el Canva Dev MCP y su propósito
- Configurar el MCP de Canva para desarrollo
- Usar IA para desarrollar apps de Canva
- Entender el Canva Apps SDK
- Trabajar con el Design API de Canva
- Automatizar configuración de apps
- Generar código boilerplate para extensiones
- Implementar integraciones con Canva

---

## 📖 Lección 9.K.1: ¿Qué es el Canva Dev MCP?

El **MCP de Canva** es una herramienta de **desarrollo asistido por IA** para construir apps e integraciones en la plataforma Canva, NO para crear diseños directamente.

### Concepto Fundamental

Piensa en el Canva MCP como tu **asistente de desarrollo** para la plataforma Canva:

**Sin MCP de Canva:**
```
Tú: Necesito crear una app de Canva
  ↓ (lees documentación manualmente)
  ↓ (configuras proyecto desde cero)
  ↓ (escribes boilerplate code)
  ↓ (consultas API reference constantemente)
Desarrollo lento y tedioso
```

**Con MCP de Canva:**
```
Tú: "Crea una app de Canva que importe imágenes desde mi API"

Claude: [usa MCP Canva]
  → Genera estructura de proyecto
  → Configura app.json
  → Crea componentes UI
  → Implementa API calls
  → Agrega autenticación

✓ App funcional en minutos
```

### ¿Qué es Canva Platform?

**Canva** (canva.com) es una plataforma de diseño gráfico. **Canva Platform** permite a desarrolladores:
- **Crear apps** que se integran en el editor de Canva
- **Extensiones de diseño** (custom elements, templates)
- **Data connectors** (importar datos externos)
- **Automatizaciones** via API

### ¿Para Qué es Canva MCP?

✅ **Desarrollo de Apps de Canva**
- Generar código boilerplate
- Configurar app manifest
- Implementar UI components
- Setup de autenticación

✅ **Consulta de Documentación**
- API reference instant access
- Examples y best practices
- Design guidelines
- SDK methods

✅ **Debugging Asistido**
- Explicar errores de SDK
- Sugerir fixes
- Code reviews
- Performance tips

✅ **Generación de Código**
- React components para Canva UI
- API integration boilerplate
- OAuth flows
- Webhook handlers

### Ventajas Clave

| Sin MCP Canva | Con MCP Canva |
|--------------|---------------|
| Leer docs manualmente | Consulta con lenguaje natural |
| Copiar boilerplate code | Generación automática |
| Trial and error | Explicaciones instant as |
| Búsqueda en docs | Respuestas contextuales |
| **Lento y frustrante** | **Rápido y productivo** ⚡ |

---

## 📖 Lección 9.K.2: Configuración de Canva Dev MCP

### Paso 1: Crear Cuenta de Canva Developer

1. **Regístrate en Canva Developers**
```
https://www.canva.com/developers
```

2. **Crea tu primera app** (opcional, para familiarizarte)
```
Dashboard → Create new app
```

### Paso 2: Instalar Canva Dev MCP

**Opción A: Instalación automática (recomendada)**

```bash
npx @canva/cli mcp setup
```

Esto configurará automáticamente el MCP en tu sistema.

**Opción B: Configuración manual**

```json
{
  "servers": {
    "canva-dev": {
      "transport": "stdio",
      "command": "npx",
      "args": ["@canva/dev-mcp-server"]
    }
  }
}
```

### Paso 3: Verificar Instalación

1. **Reinicia Claude Code**
```bash
exit
# Vuelve a abrir
```

2. **Prueba conexión**
```
Tú: ¿Está conectado el MCP de Canva?

Claude: Sí, el MCP de Canva Dev está conectado.

Capacidades disponibles:
- Consultar documentación de Canva SDK
- Generar código para apps de Canva
- Explicar conceptos de la plataforma
- Ayudar con debugging

Estado: ✓ CONECTADO
```

---

## 📖 Lección 9.K.3: Desarrollar Apps de Canva con IA

### Crear una App Básica

```
Tú: Crea una app de Canva que agregue stickers personalizados

Claude: [usa MCP Canva + conocimiento de docs]

Voy a crear una app de Canva con stickers personalizados:

1️⃣ Estructura del proyecto:

```
canva-stickers-app/
├── src/
│   ├── app.tsx              # Main app component
│   ├── backend/
│   │   └── server.ts        # API backend (opcional)
│   └── assets/
│       └── stickers/        # Your sticker images
├── app.json                 # App manifest
├── package.json
└── README.md
```

2️⃣ app.json (App Manifest):

```json
{
  "name": "Custom Stickers",
  "description": "Add your own custom stickers to designs",
  "tagline": "Personalize with stickers",
  "icon": "icons/icon.svg",
  "scopes": [
    "design:content:write"
  ],
  "extensions": [
    {
      "type": "design_import",
      "name": "Import Stickers",
      "configuration": {
        "entrypoint": "src/app.tsx"
      }
    }
  ]
}
```

3️⃣ src/app.tsx (React Component):

```typescript
import { Button, Rows, Text } from "@canva/app-ui-kit";
import { addNativeElement } from "@canva/design";
import * as React from "react";

export const App = () => {
  const stickers = [
    { id: "sticker1", url: "https://example.com/sticker1.png", name: "Happy" },
    { id: "sticker2", url: "https://example.com/sticker2.png", name: "Cool" },
    { id: "sticker3", url: "https://example.com/sticker3.png", name: "Star" }
  ];

  const addSticker = async (stickerUrl: string) => {
    await addNativeElement({
      type: "IMAGE",
      dataUrl: stickerUrl
    });
  };

  return (
    <div className="app">
      <Rows spacing="2u">
        <Text variant="heading">Custom Stickers</Text>
        {stickers.map((sticker) => (
          <Button
            key={sticker.id}
            variant="primary"
            onClick={() => addSticker(sticker.url)}
          >
            Add {sticker.name} Sticker
          </Button>
        ))}
      </Rows>
    </div>
  );
};
```

4️⃣ package.json:

```json
{
  "name": "canva-custom-stickers",
  "version": "1.0.0",
  "scripts": {
    "start": "canva-apps-cli start",
    "build": "canva-apps-cli build"
  },
  "dependencies": {
    "@canva/app-ui-kit": "^4.0.0",
    "@canva/design": "^1.0.0",
    "react": "^18.2.0"
  },
  "devDependencies": {
    "@canva/app-components": "^4.0.0",
    "typescript": "^5.0.0"
  }
}
```

5️⃣ Para ejecutar:

```bash
# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm start

# Esto abrirá Canva con tu app en preview mode
```

6️⃣ Testing:
- Abre Canva editor
- Ve a Apps → Your apps
- Selecciona "Custom Stickers"
- Click en botones para agregar stickers

¿Necesitas ayuda con alguna parte específica?
```

### Implementar Autenticación OAuth

```
Tú: Agrega autenticación OAuth para que los usuarios conecten su cuenta

Claude: [genera código OAuth]

Voy a implementar OAuth para tu app de Canva:

1️⃣ Actualizar app.json con configuración de auth:

```json
{
  "authentication": {
    "authorization_url": "https://your-service.com/oauth/authorize",
    "token_url": "https://your-service.com/oauth/token",
    "client_id": "${CLIENT_ID}",
    "scopes": ["read_images", "write_images"]
  }
}
```

2️⃣ Backend OAuth handler (Node.js/Express):

```typescript
import express from 'express';
import crypto from 'crypto';

const app = express();
const sessions = new Map(); // En producción, usar Redis

// Authorization endpoint
app.get('/oauth/authorize', (req, res) => {
  const { client_id, redirect_uri, state, scope } = req.query;

  // Validar client_id
  if (client_id !== process.env.CANVA_CLIENT_ID) {
    return res.status(400).json({ error: 'invalid_client' });
  }

  // Generar código de autorización
  const code = crypto.randomBytes(32).toString('hex');

  // Guardar para exchange
  sessions.set(code, {
    client_id,
    redirect_uri,
    scope,
    expires: Date.now() + 10 * 60 * 1000 // 10 min
  });

  // Redirigir de vuelta a Canva con code
  res.redirect(`${redirect_uri}?code=${code}&state=${state}`);
});

// Token exchange endpoint
app.post('/oauth/token', express.json(), (req, res) => {
  const { code, grant_type, client_id, client_secret } = req.body;

  // Validar grant type
  if (grant_type !== 'authorization_code') {
    return res.status(400).json({ error: 'unsupported_grant_type' });
  }

  // Validar client credentials
  if (client_id !== process.env.CANVA_CLIENT_ID ||
      client_secret !== process.env.CANVA_CLIENT_SECRET) {
    return res.status(401).json({ error: 'invalid_client' });
  }

  // Verificar código
  const session = sessions.get(code);
  if (!session || session.expires < Date.now()) {
    return res.status(400).json({ error: 'invalid_grant' });
  }

  // Generar access token
  const access_token = crypto.randomBytes(64).toString('hex');
  const refresh_token = crypto.randomBytes(64).toString('hex');

  // Guardar token (en producción, usar DB)
  sessions.set(access_token, {
    user_id: 'user123', // ID del usuario autenticado
    scope: session.scope,
    expires: Date.now() + 3600 * 1000 // 1 hora
  });

  res.json({
    access_token,
    refresh_token,
    token_type: 'Bearer',
    expires_in: 3600,
    scope: session.scope
  });

  // Limpiar código usado
  sessions.delete(code);
});

app.listen(3000, () => {
  console.log('OAuth server running on port 3000');
});
```

3️⃣ Usar auth token en tu app:

```typescript
import { auth } from "@canva/auth";

export const App = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [userStickers, setUserStickers] = React.useState([]);

  React.useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const authStatus = await auth.getStatus();
    setIsAuthenticated(authStatus.isAuthenticated);

    if (authStatus.isAuthenticated) {
      fetchUserStickers(authStatus.token);
    }
  };

  const handleLogin = async () => {
    await auth.requestAuthentication();
    checkAuth();
  };

  const fetchUserStickers = async (token: string) => {
    const response = await fetch('https://your-api.com/stickers', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const stickers = await response.json();
    setUserStickers(stickers);
  };

  if (!isAuthenticated) {
    return (
      <div>
        <Text>Please login to access your stickers</Text>
        <Button onClick={handleLogin}>Login</Button>
      </div>
    );
  }

  return (
    <div>
      <Text>Your Stickers ({userStickers.length})</Text>
      {/* Render stickers */}
    </div>
  );
};
```

4️⃣ Variables de entorno (.env):

```bash
CANVA_CLIENT_ID=your_client_id_here
CANVA_CLIENT_SECRET=your_client_secret_here
API_BASE_URL=https://your-api.com
```

5️⃣ Seguridad:
- ✅ Valida siempre client credentials
- ✅ Usa HTTPS en producción
- ✅ Tokens con expiración
- ✅ Implementa refresh token rotation
- ✅ Rate limiting en endpoints

¿Necesitas ayuda con refresh tokens o logout?
```

---

## 📖 Lección 9.K.4: Trabajar con el Design API

### Agregar Elementos al Diseño

```
Tú: ¿Cómo agrego texto, imágenes y shapes al diseño desde mi app?

Claude: [explica Design API]

Aquí están los principales métodos para agregar elementos:

1️⃣ Agregar Texto:

```typescript
import { addNativeElement } from "@canva/design";

const addText = async () => {
  await addNativeElement({
    type: "TEXT",
    children: ["Hello from my app!"],
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF6B6B"
  });
};
```

2️⃣ Agregar Imagen:

```typescript
const addImage = async (imageUrl: string) => {
  await addNativeElement({
    type: "IMAGE",
    dataUrl: imageUrl,
    width: 400,
    height: 300
  });
};

// Ejemplo de uso
addImage("https://example.com/my-image.png");
```

3️⃣ Agregar Shape (Rectángulo):

```typescript
const addRectangle = async () => {
  await addNativeElement({
    type: "SHAPE",
    paths: [
      {
        d: "M 0 0 L 100 0 L 100 100 L 0 100 Z",
        fill: {
          color: "#4ECDC4"
        }
      }
    ],
    viewBox: {
      width: 100,
      height: 100
    }
  });
};
```

4️⃣ Agregar Video:

```typescript
const addVideo = async (videoUrl: string) => {
  await addNativeElement({
    type: "VIDEO",
    dataUrl: videoUrl,
    width: 640,
    height: 480,
    thumbnailImageUrl: "https://example.com/thumbnail.jpg"
  });
};
```

5️⃣ App completa con múltiples elementos:

```typescript
import { Button, Rows, Text } from "@canva/app-ui-kit";
import { addNativeElement } from "@canva/design";

export const App = () => {
  const addQuote = async () => {
    // Background shape
    await addNativeElement({
      type: "SHAPE",
      paths: [{
        d: "M 0 0 L 500 0 L 500 200 L 0 200 Z",
        fill: { color: "#F7B731" }
      }],
      viewBox: { width: 500, height: 200 }
    });

    // Quote text
    await addNativeElement({
      type: "TEXT",
      children: ['"Stay hungry, stay foolish."'],
      fontSize: 32,
      fontWeight: "bold",
      color: "#FFFFFF"
    });

    // Author text
    await addNativeElement({
      type: "TEXT",
      children: ["- Steve Jobs"],
      fontSize: 18,
      fontStyle: "italic",
      color: "#FFFFFF"
    });
  };

  return (
    <Rows spacing="2u">
      <Text variant="heading">Design Elements</Text>
      <Button onClick={addQuote}>Add Inspirational Quote</Button>
    </Rows>
  );
};
```

6️⃣ Posicionamiento:

```typescript
// Puedes especificar posición (beta feature)
await addNativeElement({
  type: "TEXT",
  children: ["Positioned text"],
  top: 100,    // px from top
  left: 50,    // px from left
  fontSize: 24
});
```

Limitaciones:
- No puedes modificar elementos existentes (read-only)
- La posición exacta puede variar (Canva optimiza layout)
- Algunos tipos requieren scopes específicos en app.json

¿Necesitas ejemplos de elementos más complejos?
```

### Leer Datos del Diseño Actual

```
Tú: ¿Puedo leer qué elementos tiene el diseño actual del usuario?

Claude: [explica reading design data]

Sí, puedes leer información del diseño con el API:

1️⃣ Obtener información de la página actual:

```typescript
import { getCurrentPageContext } from "@canva/design";

export const App = () => {
  const [pageInfo, setPageInfo] = React.useState(null);

  React.useEffect(() => {
    loadPageInfo();
  }, []);

  const loadPageInfo = async () => {
    const context = await getCurrentPageContext();

    setPageInfo({
      dimensions: context.dimensions,
      backgroundColor: context.backgroundColor
    });
  };

  return (
    <div>
      {pageInfo && (
        <div>
          <Text>Page size: {pageInfo.dimensions.width} x {pageInfo.dimensions.height}</Text>
          <Text>Background: {pageInfo.backgroundColor}</Text>
        </div>
      )}
    </div>
  );
};
```

2️⃣ Leer selección actual:

```typescript
import { selection } from "@canva/design";

const readSelection = async () => {
  const currentSelection = await selection.read();

  console.log('Selected elements:', currentSelection.count);
  console.log('Selection type:', currentSelection.type); // 'none', 'image', 'text', etc.
};
```

3️⃣ Reaccionar a cambios de selección:

```typescript
export const App = () => {
  const [selectedCount, setSelectedCount] = React.useState(0);

  React.useEffect(() => {
    const unsubscribe = selection.subscribe((selectionEvent) => {
      setSelectedCount(selectionEvent.count);
    });

    return unsubscribe; // Cleanup on unmount
  }, []);

  return (
    <Text>Selected elements: {selectedCount}</Text>
  );
};
```

4️⃣ Exportar diseño:

```typescript
import { export as exportDesign } from "@canva/design";

const exportCurrentPage = async () => {
  const result = await exportDesign({
    type: "PNG",
    pages: ["current"],
    quality: 0.9
  });

  // result.url contiene la URL temporal del PNG
  console.log('Exported image URL:', result.url);

  // Descargar o enviar a tu servidor
  const response = await fetch(result.url);
  const blob = await response.blob();
  // ... procesar imagen
};
```

5️⃣ Scopes requeridos en app.json:

```json
{
  "scopes": [
    "design:content:read",      // Para leer contenido
    "design:meta:read",          // Para leer metadata
    "design:permission:export"   // Para exportar
  ]
}
```

Limitaciones:
- No puedes acceder al contenido exacto de elementos (privacidad)
- Solo metadata disponible (tipo, posición, dimensiones)
- Export tiene rate limits

¿Quieres ver cómo procesar las imágenes exportadas?
```

---

## 📖 Lección 9.K.5: UI Components de Canva

### Usar Canva App UI Kit

```
Tú: ¿Qué componentes UI puedo usar para que mi app se vea nativa?

Claude: [explica App UI Kit]

Canva proporciona el **@canva/app-ui-kit** con componentes nativos:

1️⃣ Componentes básicos:

```typescript
import {
  Button,
  Text,
  Title,
  Rows,
  Columns,
  Box,
  Divider
} from "@canva/app-ui-kit";

export const App = () => {
  return (
    <Box padding="2u">
      <Rows spacing="2u">
        {/* Título */}
        <Title>My Canva App</Title>

        {/* Texto normal */}
        <Text>This is regular text</Text>

        {/* Divider */}
        <Divider />

        {/* Botones */}
        <Button variant="primary">Primary Action</Button>
        <Button variant="secondary">Secondary Action</Button>
      </Rows>
    </Box>
  );
};
```

2️⃣ Form inputs:

```typescript
import {
  TextInput,
  Checkbox,
  Select,
  ColorSelector
} from "@canva/app-ui-kit";

export const FormExample = () => {
  const [name, setName] = React.useState("");
  const [color, setColor] = React.useState("#FF6B6B");
  const [enabled, setEnabled] = React.useState(false);

  return (
    <Rows spacing="2u">
      {/* Text input */}
      <TextInput
        value={name}
        onChange={setName}
        placeholder="Enter your name"
      />

      {/* Color picker */}
      <ColorSelector
        value={color}
        onChange={setColor}
      />

      {/* Checkbox */}
      <Checkbox
        checked={enabled}
        onChange={setEnabled}
        label="Enable feature"
      />

      {/* Select dropdown */}
      <Select
        options={[
          { label: "Option 1", value: "1" },
          { label: "Option 2", value: "2" }
        ]}
        onChange={(value) => console.log(value)}
      />
    </Rows>
  );
};
```

3️⃣ Layouts:

```typescript
// Rows (vertical stack)
<Rows spacing="1u">
  <Button>Button 1</Button>
  <Button>Button 2</Button>
  <Button>Button 3</Button>
</Rows>

// Columns (horizontal)
<Columns spacing="1u">
  <Button>Left</Button>
  <Button>Center</Button>
  <Button>Right</Button>
</Columns>

// Grid
<Grid columns={3} spacing="1u">
  <Box>Item 1</Box>
  <Box>Item 2</Box>
  <Box>Item 3</Box>
  <Box>Item 4</Box>
  <Box>Item 5</Box>
  <Box>Item 6</Box>
</Grid>
```

4️⃣ Loading states:

```typescript
import { LoadingIndicator, Alert } from "@canva/app-ui-kit";

export const AsyncExample = () => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleAction = async () => {
    setLoading(true);
    try {
      await someAsyncOperation();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <Rows spacing="2u">
      {error && (
        <Alert tone="critical">
          Error: {error}
        </Alert>
      )}
      <Button onClick={handleAction}>Run Action</Button>
    </Rows>
  );
};
```

5️⃣ Theming y spacing:

```typescript
// Spacing units (1u = 4px en Canva):
<Box padding="2u">   // 8px padding
<Rows spacing="3u">  // 12px gap

// Responsive:
<Box paddingX="2u" paddingY="1u">  // Different horizontal/vertical

// Theme colors:
<Text tone="primary">Primary text</Text>
<Text tone="secondary">Secondary text</Text>
<Text tone="critical">Error text</Text>
```

6️⃣ App completa example:

```typescript
import {
  Box, Rows, Title, Text, Button,
  TextInput, ColorSelector, Alert
} from "@canva/app-ui-kit";
import { addNativeElement } from "@canva/design";

export const App = () => {
  const [text, setText] = React.useState("Hello");
  const [color, setColor] = React.useState("#000000");
  const [success, setSuccess] = React.useState(false);

  const addToDesign = async () => {
    await addNativeElement({
      type: "TEXT",
      children: [text],
      color: color,
      fontSize: 32
    });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <Box padding="3u">
      <Rows spacing="2u">
        <Title>Add Custom Text</Title>

        <TextInput
          value={text}
          onChange={setText}
          placeholder="Enter text"
        />

        <ColorSelector
          value={color}
          onChange={setColor}
        />

        <Button
          variant="primary"
          onClick={addToDesign}
        >
          Add to Design
        </Button>

        {success && (
          <Alert tone="positive">
            Text added successfully!
          </Alert>
        )}
      </Rows>
    </Box>
  );
};
```

Todos estos componentes están optimizados para:
- Responsive design
- Accesibilidad (A11y)
- Look & feel nativo de Canva
- Dark/light mode automático

¿Necesitas componentes más avanzados como modals o tabs?
```

---

## 📖 Lección 9.K.6: Data Connectors

### Crear un Data Connector

```
Tú: ¿Cómo creo un data connector para importar datos desde mi API?

Claude: [explica data connectors]

Los **Data Connectors** permiten a usuarios importar datos externos a Canva:

1️⃣ Configurar en app.json:

```json
{
  "name": "My Data Connector",
  "description": "Import data from my service",
  "extensions": [
    {
      "type": "data_connector",
      "name": "Import Products",
      "configuration": {
        "entrypoint": "src/connector.tsx",
        "supportedFormats": ["CSV", "JSON"]
      }
    }
  ],
  "scopes": [
    "design:content:write"
  ]
}
```

2️⃣ Implementar connector (src/connector.tsx):

```typescript
import { Button, Rows, Text, LoadingIndicator } from "@canva/app-ui-kit";
import { upload } from "@canva/asset";
import { auth } from "@canva/auth";

export const DataConnector = () => {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState([]);

  const fetchData = async () => {
    setLoading(true);

    const authStatus = await auth.getStatus();
    const token = authStatus.token;

    const response = await fetch('https://api.myservice.com/products', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const products = await response.json();
    setData(products);
    setLoading(false);
  };

  const importData = async () => {
    // Convertir datos a formato Canva
    for (const product of data) {
      await upload({
        type: "IMAGE",
        url: product.imageUrl,
        title: product.name,
        metadata: {
          price: product.price,
          sku: product.sku
        }
      });
    }
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <Rows spacing="2u">
      <Text variant="heading">Product Importer</Text>

      <Button onClick={fetchData}>
        Fetch Products
      </Button>

      {data.length > 0 && (
        <>
          <Text>{data.length} products found</Text>
          <Button variant="primary" onClick={importData}>
            Import to Canva
          </Button>
        </>
      )}
    </Rows>
  );
};
```

3️⃣ Importar diferentes tipos de datos:

```typescript
// Importar imágenes
await upload({
  type: "IMAGE",
  url: "https://example.com/image.png",
  title: "Product Photo"
});

// Importar videos
await upload({
  type: "VIDEO",
  url: "https://example.com/video.mp4",
  title: "Product Demo",
  thumbnailUrl: "https://example.com/thumb.jpg"
});

// Importar fuentes
await upload({
  type: "FONT",
  url: "https://example.com/font.ttf",
  title: "Custom Font",
  fontFamily: "My Custom Font"
});
```

4️⃣ Batch import con progress:

```typescript
const importBatch = async (items: Product[]) => {
  setProgress({ current: 0, total: items.length });

  for (let i = 0; i < items.length; i++) {
    await upload({
      type: "IMAGE",
      url: items[i].imageUrl,
      title: items[i].name
    });

    setProgress({ current: i + 1, total: items.length });
  }
};

// UI con progress
<ProgressBar
  value={progress.current}
  max={progress.total}
/>
<Text>{progress.current} / {progress.total} imported</Text>
```

5️⃣ Filtrado y búsqueda:

```typescript
export const DataConnector = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [category, setCategory] = React.useState("all");

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === "all" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <Rows spacing="2u">
      <TextInput
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search products..."
      />

      <Select
        options={[
          { label: "All Categories", value: "all" },
          { label: "Electronics", value: "electronics" },
          { label: "Clothing", value: "clothing" }
        ]}
        onChange={setCategory}
      />

      <Text>{filteredProducts.length} results</Text>

      {/* Render filtered products */}
    </Rows>
  );
};
```

Casos de uso comunes:
- Importar productos de eCommerce
- Traer imágenes de stock photos
- Conectar con DAM (Digital Asset Management)
- Sincronizar con CMS
- Importar datos de analytics para visualización

¿Necesitas ayuda con autenticación o paginación?
```

---

## 📖 Lección 9.K.7: Testing y Debugging

### Testing Local

```
Tú: ¿Cómo testeo mi app durante desarrollo?

Claude: [explica testing workflow]

Canva proporciona herramientas de desarrollo:

1️⃣ Desarrollo local:

```bash
# Iniciar dev server
npm start

# Esto abre Canva en modo desarrollo
# Tu app aparece en Apps → Your apps
```

2️⃣ Hot reload automático:
- Edita código → Guarda
- La app se recarga automáticamente en Canva
- No necesitas refresh manual

3️⃣ Console logging:

```typescript
export const App = () => {
  const addElement = async () => {
    console.log('Adding element...');

    await addNativeElement({
      type: "TEXT",
      children: ["Test"]
    });

    console.log('Element added!');
  };

  return <Button onClick={addElement}>Add Text</Button>;
};
```

Ver logs en:
- Chrome DevTools → Console
- Tab de tu app Canva

4️⃣ Error handling:

```typescript
const addElement = async () => {
  try {
    await addNativeElement({
      type: "TEXT",
      children: ["Test"]
    });
  } catch (error) {
    console.error('Failed to add element:', error);

    // Mostrar al usuario
    setErrorMessage(error.message);
  }
};
```

5️⃣ Testing different scopes:

```json
// app.json
{
  "scopes": [
    "design:content:write",
    "design:content:read"
  ]
}
```

```typescript
// Verificar permiso antes de usar
const checkPermissions = async () => {
  try {
    await addNativeElement({ type: "TEXT", children: ["test"] });
    console.log('Write permission: OK');
  } catch (error) {
    console.error('Missing write permission');
  }
};
```

6️⃣ Mock data para testing:

```typescript
const MOCK_PRODUCTS = [
  { id: 1, name: "Product 1", imageUrl: "..." },
  { id: 2, name: "Product 2", imageUrl: "..." }
];

export const App = () => {
  const [products, setProducts] = React.useState([]);

  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Usar mock data en dev
      setProducts(MOCK_PRODUCTS);
    } else {
      // Fetch real data en producción
      fetchProducts().then(setProducts);
    }
  }, []);

  // ...
};
```

7️⃣ Debug panel personalizado:

```typescript
const DebugPanel = ({ data }) => {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Box background="neutral" padding="2u">
      <Text variant="mono">
        {JSON.stringify(data, null, 2)}
      </Text>
    </Box>
  );
};
```

Tools útiles:
- React DevTools (componentes)
- Network tab (API calls)
- Performance tab (optimization)

¿Necesitas ayuda con unit testing o integration tests?
```

---

## 📖 Lección 9.K.8: Deploy y Distribución

### Publicar tu App

```
Tú: ¿Cómo publico mi app para que otros la usen?

Claude: [explica submission process]

Proceso para publicar en Canva App Marketplace:

1️⃣ Build de producción:

```bash
# Build optimizado
npm run build

# Esto crea bundle en /dist
```

2️⃣ Submission checklist:

```markdown
Antes de submit:
- [ ] App funciona sin errores
- [ ] Todos los scopes son necesarios
- [ ] Descripción clara y completa
- [ ] Screenshots de calidad (mínimo 3)
- [ ] Icon de 512x512px
- [ ] Privacy policy URL
- [ ] Terms of service URL
- [ ] Support email configurado
- [ ] Pricing (si aplica) configurado
```

3️⃣ Metadata completo:

```json
// app.json
{
  "name": "My Awesome App",
  "tagline": "Do amazing things with your designs",
  "description": "Long description here explaining what your app does, how to use it, and what problems it solves...",
  "icon": "assets/icon-512.png",
  "screenshots": [
    "assets/screenshot1.png",
    "assets/screenshot2.png",
    "assets/screenshot3.png"
  ],
  "category": "productivity",
  "pricing": {
    "type": "free"  // o "paid", "freemium"
  },
  "support": {
    "email": "support@example.com",
    "url": "https://example.com/support"
  },
  "legal": {
    "privacyPolicy": "https://example.com/privacy",
    "termsOfService": "https://example.com/terms"
  }
}
```

4️⃣ Submit via Dashboard:

```bash
# Login to Canva
canva login

# Submit app for review
canva submit
```

O via web:
1. Ir a https://www.canva.com/developers/apps
2. Selecciona tu app
3. Haz clic en "Submit for review"
4. Completa el formulario de revisión

5️⃣ Review process:

```
Submit → Canva Review (3-5 días) → Approved/Rejected

Si approved:
- App aparece en Marketplace
- Usuarios pueden instalar

Si rejected:
- Feedback detallado
- Fix issues
- Re-submit
```

6️⃣ Post-launch:

```typescript
// Analytics (si configurado)
import { analytics } from "@canva/platform";

analytics.track('element_added', {
  element_type: 'image',
  source: 'api'
});
```

7️⃣ Versionado:

```json
// package.json
{
  "version": "1.0.0"  // Semantic versioning
}
```

```bash
# Release nueva versión
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.1 → 1.1.0
npm version major  # 1.1.0 → 2.0.0

# Re-submit
canva submit
```

Guidelines de aprobación:
- App debe funcionar correctamente
- No spam o contenido inapropiado
- No viola guidelines de Canva
- Performance aceptable
- Good UX

Tiempo promedio de aprobación: 3-7 días

¿Necesitas ayuda con pricing o monetización?
```

---

## 🏋️ Ejercicios Prácticos

### Ejercicio 9.K.1: Hello World App
1. Configura Canva Dev MCP
2. Crea una app básica que agregue texto
3. Usa componentes de App UI Kit
4. Testea en modo desarrollo
5. Verifica en Canva editor

### Ejercicio 9.K.2: Image Importer
1. Crea un data connector
2. Fetch imágenes de una API pública (ej: Unsplash)
3. Muestra thumbnails en la app
4. Permite importar a diseño
5. Agrega loading states

### Ejercicio 9.K.3: OAuth Integration
1. Implementa backend OAuth
2. Configura auth en app.json
3. Maneja login/logout
4. Fetch datos autenticados
5. Maneja errores de auth

### Ejercicio 9.K.4: Multi-Element App
1. Crea app que agrega múltiples elementos
2. Combina texto, imágenes, shapes
3. Permite personalización (colores, texto)
4. Agrega preview antes de insertar
5. Implementa undo (opcional)

### Ejercicio 9.K.5: Publicación
1. Completa metadata de tu app
2. Crea screenshots de calidad
3. Escribe descripción compelling
4. Genera build de producción
5. Submit para review (opcional)

---

## 📝 Examen 9.K: Maestría del MCP de Canva

### Parte 1: Preguntas Teóricas (3 puntos)

**Pregunta 1:** ¿Qué es el Canva Dev MCP y en qué se diferencia de usar Canva normalmente?

**Pregunta 2:** Explica los 3 tipos principales de extensiones de Canva (Design Import, Data Connector, Design Editor Intent).

**Pregunta 3:** ¿Por qué es importante configurar correctamente los "scopes" en app.json?

### Parte 2: Configuración (2 puntos)

1. Muestra cómo configurarías Canva Dev MCP en `.claude/mcp.json`
2. ¿Qué campos son obligatorios en app.json?
3. ¿Cómo inicias un proyecto de Canva App desde cero?

### Parte 3: Práctica - Desarrollo (5 puntos)

**Escenario:**
Necesitas crear una app de Canva que:
- Importe productos desde una API
- Muestre productos en un grid
- Permita agregar imágenes de productos al diseño
- Tenga autenticación OAuth
- Use componentes nativos de Canva

Muestra cómo implementarías:
1. La estructura del proyecto
2. El código React principal
3. La configuración en app.json
4. El manejo de auth
5. El proceso de submit

### Parte 4: Casos de Uso (5 puntos)

Diseña apps de Canva para:

1. **Social Media Scheduler**: Importa posts programados y crea designs automáticos
2. **Brand Kit Manager**: Conecta con brand assets (logos, colors, fonts)
3. **Analytics Visualizer**: Convierte datos de analytics en infografías
4. **Template Generator**: Genera templates basados en input del usuario
5. **Collaboration Tool**: Permite comentarios y aprobaciones en diseños

Para cada uno, define:
- Extension type (Design Import, Data Connector, etc.)
- Scopes necesarios
- Features principales
- Tech stack

### Bonus (2 puntos extra)

Implementa una app que:
- Use IA (GPT-4) para generar descripciones de productos
- Cree diseños personalizados basados en las descripciones
- Permita preview antes de agregar
- Guarde historial de generaciones
- Exporte analytics de uso

---

## ✅ Checklist de Dominio

**Fundamentos**
- [ ] Entiendo qué es Canva Platform
- [ ] Sé la diferencia entre app types
- [ ] Puedo configurar Canva Dev MCP
- [ ] Entiendo el sistema de scopes
- [ ] Conozco los límites de la plataforma

**Desarrollo**
- [ ] Puedo crear apps básicas
- [ ] Sé usar App UI Kit components
- [ ] Entiendo el Design API
- [ ] Puedo implementar OAuth
- [ ] Sé hacer data connectors

**Features Avanzadas**
- [ ] Puedo exportar diseños
- [ ] Sé leer selection del usuario
- [ ] Entiendo page context
- [ ] Puedo hacer batch operations
- [ ] Manejo errores correctamente

**Deployment**
- [ ] Sé crear builds de producción
- [ ] Entiendo el submission process
- [ ] Puedo crear metadata completo
- [ ] Sé versionear apps
- [ ] Entiendo las guidelines de approval

---

## 🎯 Mejores Prácticas

### Performance

1. **Lazy loading**
   ```typescript
   const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

   <React.Suspense fallback={<LoadingIndicator />}>
     <HeavyComponent />
   </React.Suspense>
   ```

2. **Batch operations**
   ```typescript
   // ❌ Lento
   for (const item of items) {
     await addNativeElement({ ... });
   }

   // ✅ Mejor
   await Promise.all(
     items.map(item => addNativeElement({ ... }))
   );
   ```

### UX

1. **Loading states siempre**
2. **Error messages descriptivos**
3. **Confirmaciones para acciones destructivas**
4. **Feedback inmediato** (optimistic UI)

### Seguridad

1. **Nunca expongas secrets en frontend**
2. **Valida input del usuario**
3. **Usa HTTPS siempre**
4. **Implementa rate limiting**

---

## 📚 Recursos Adicionales

- **Canva Developers**: https://www.canva.com/developers
- **Canva Apps SDK Docs**: https://www.canva.dev/docs/apps/
- **App UI Kit Reference**: https://www.canva.dev/docs/apps/app-components/
- **Examples GitHub**: https://github.com/canva-sdks/canva-apps-sdk-starter-kit

---

**Anterior**: [Sentry MCP (9.J)](./capitulo_09_mcp_sentry.md)
**Siguiente**: [Capítulo 10 - Flujos de Trabajo Avanzados](../capitulo_10.md)
**Inicio**: [Curso Principal](../README.md)

---

**¿Listo para crear apps de Canva?** Conecta el MCP y empieza a desarrollar con ayuda de IA. 🎨⚡

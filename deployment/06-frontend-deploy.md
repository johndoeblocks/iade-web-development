# 06 - Deploy do Frontend

## 🎯 Objetivos
- Build de produção do React
- Deploy estático no Railway
- Conectar ao backend

---

## 📦 Build de Produção

```bash
cd frontend
npm run build
```

Cria pasta `dist/` com:
- HTML, CSS, JS minificados
- Assets otimizados
- Pronto para servir estaticamente

---

## 🚂 Railway - Deploy Frontend

### Opção 1: Via GitHub (Recomendado)

1. No projeto Railway, "New" → "GitHub Repo"
2. Seleciona repositório, pasta `frontend`
3. Configura build:

```json
// frontend/railway.json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npx serve dist -s",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

### Opção 2: Dockerfile

```dockerfile
# frontend/Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Build com variáveis
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Servir com nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## ⚙️ Variáveis de Ambiente

No Railway, adicionar:
```
VITE_API_URL=https://your-backend.railway.app
```

> ⚠️ Variáveis Vite são injetadas no BUILD, não runtime!

Para mudar a URL da API, precisa re-build.

---

## 🔧 nginx.conf

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
}
```

---

## 🔗 Conectar Frontend ↔ Backend

### vite.config.js (Dev Proxy)
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
});
```

### Produção
```javascript
// src/config.js
export const API_URL = import.meta.env.VITE_API_URL || '';

// src/api/pizzas.js
import { API_URL } from '../config';

export async function getPizzas() {
  const response = await fetch(`${API_URL}/api/pizzas`);
  return response.json();
}
```

---

## 🔍 CORS no Backend

```javascript
// backend/src/index.js
import cors from 'cors';

const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://your-frontend.railway.app', 'https://padreginos.com']
    : 'http://localhost:5173',
  credentials: true
};

app.use(cors(corsOptions));
```

---

## ✅ Verificar Deploy

1. Abre a URL do Railway
2. Verifica que a app carrega
3. Testa buscar pizzas da API
4. Testa adicionar ao carrinho

---

## 🧪 Exercício

1. Faz build local e verifica `dist/`
2. Configura Dockerfile para frontend
3. Deploy no Railway
4. Configura VITE_API_URL
5. Verifica que frontend comunica com backend

---

## 📚 Recursos
- [Vite Build](https://vitejs.dev/guide/build.html)
- [Railway Static Sites](https://docs.railway.app/guides/static-sites)

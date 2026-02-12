# 03 - Variáveis de Ambiente

## 🎯 Objetivos
- Configurar env vars em diferentes plataformas
- Separar configuração por ambiente
- Manter segurança dos secrets

---

## 📁 Estrutura de Ficheiros

```
projeto/
├── .env                  # Local (não commit)
├── .env.example          # Template (commit!)
├── .env.development      # Dev settings
├── .env.production       # Prod settings (não commit secrets!)
└── .gitignore
```

---

## 🔧 Vite (Frontend)

### .env Files
```bash
# .env.development
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=Padre Gino's (Dev)

# .env.production
VITE_API_URL=https://api.padreginos.com
VITE_APP_NAME=Padre Gino's
```

### Usar no Código
```javascript
// ⚠️ Variáveis devem começar com VITE_
const apiUrl = import.meta.env.VITE_API_URL;
const appName = import.meta.env.VITE_APP_NAME;
const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;
```

### Build com Ambiente
```bash
# Usa .env.production
npm run build

# Ou especificar mode
npx vite build --mode staging
```

---

## ⚙️ Node.js (Backend)

### Carregar dotenv
```bash
npm install dotenv
```

```javascript
// src/index.js (no topo!)
import 'dotenv/config';

// Ou mais explícito
import dotenv from 'dotenv';
dotenv.config();

// Usar
const PORT = process.env.PORT || 3001;
const DB_URL = process.env.DATABASE_URL;
```

### Validar Variáveis
```javascript
// config/env.js
const requiredEnvVars = [
  'DATABASE_URL',
  'PORT'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required env var: ${envVar}`);
  }
}

export default {
  port: parseInt(process.env.PORT),
  databaseUrl: process.env.DATABASE_URL,
  nodeEnv: process.env.NODE_ENV || 'development',
  isDev: process.env.NODE_ENV !== 'production'
};
```

---

## 🐳 Docker

### docker-compose.yml
```yaml
services:
  backend:
    build: ./backend
    environment:
      - NODE_ENV=production
      - PORT=3001
      - DATABASE_URL=${DATABASE_URL}  # Do .env
    env_file:
      - .env.production
```

### Dockerfile com ARG
```dockerfile
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV
```

```bash
docker build --build-arg NODE_ENV=staging .
```

---

## ☁️ Railway

No dashboard do Railway:
1. Clica no serviço
2. Settings → Variables
3. Adiciona cada variável

```bash
# Também pode via CLI
railway variables set DATABASE_URL="..."
railway variables set PORT=3001
```

---

## 🔐 Segurança

### ❌ Nunca fazer
```javascript
// Expor secrets no frontend
const apiKey = import.meta.env.VITE_SECRET_KEY;

// Commit secrets
// .env com DATABASE_URL real
```

### ✅ Fazer
```javascript
// Secrets só no backend
const apiKey = process.env.API_KEY;

// Frontend só tem configs públicas
const apiUrl = import.meta.env.VITE_API_URL;
```

### Rotação de Secrets
Se um secret vazar:
1. Revoga imediatamente
2. Gera novo secret
3. Atualiza em todos os ambientes
4. Deploy

---

## 📋 Checklist de Produção

- [ ] `.env` no `.gitignore`
- [ ] `.env.example` com variáveis (sem valores)
- [ ] Variáveis validadas no startup
- [ ] Secrets apenas no backend
- [ ] Diferentes valores para dev/staging/prod
- [ ] Não logar secrets

---

## 🧪 Exercício

1. Configura variáveis para frontend e backend
2. Cria .env.example
3. Valida variáveis no startup do backend
4. Testa com valores diferentes

---

## 📚 Recursos
- [Vite Env Variables](https://vitejs.dev/guide/env-and-mode.html)
- [dotenv](https://github.com/motdotla/dotenv)

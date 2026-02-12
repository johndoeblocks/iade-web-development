# 05 - Deploy do Backend

## 🎯 Objetivos
- Fazer deploy da API Node.js
- Configurar Railway para o backend
- Conectar à base de dados

---

## 🚂 Railway - Deploy Backend

### 1. Conectar GitHub
1. No projeto Railway, "New" → "GitHub Repo"
2. Seleciona o repositório
3. Railway auto-detecta Node.js

### 2. Configurar Build
Railway detecta automaticamente, mas pode customizar:

```json
// package.json
{
  "scripts": {
    "start": "node src/index.js",
    "build": "npx prisma generate"
  }
}
```

### 3. Variáveis de Ambiente
No Railway dashboard:
- `PORT` = deixar vazio (Railway atribui automaticamente)
- `NODE_ENV` = production
- `DATABASE_URL` = (referência ao PostgreSQL interno)

Para referenciar outro serviço:
```
${{Postgres.DATABASE_URL}}
```

---

## 📁 Preparar Código

### Start Script
```json
{
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "build": "npx prisma generate && npx prisma migrate deploy"
  }
}
```

### Port Dinâmico
```javascript
// src/index.js
const PORT = process.env.PORT || 3001;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Health Check
```javascript
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
```

---

## 🐳 Docker Deploy (Alternativo)

### Dockerfile
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npx prisma generate

EXPOSE 3001

CMD ["node", "src/index.js"]
```

### railway.json
```json
{
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  }
}
```

---

## 🔧 Verificar Deploy

```bash
# Ver logs no Railway
railway logs

# Ou no dashboard
# Service → Deployments → Ver logs
```

### Testar Endpoints
```bash
# Após deploy, Railway dá URL tipo:
# https://padre-ginos-api-production.up.railway.app

curl https://your-app.railway.app/health
curl https://your-app.railway.app/api/pizzas
```

---

## 🐛 Debugging

### Logs
```javascript
// Estruturar logs para produção
console.log(JSON.stringify({
  level: 'info',
  message: 'Request received',
  path: req.path,
  timestamp: new Date().toISOString()
}));
```

### Error Handling
```javascript
app.use((error, req, res, next) => {
  // Log completo no servidor
  console.error({
    error: error.message,
    stack: error.stack,
    path: req.path
  });
  
  // Resposta limpa ao cliente
  res.status(500).json({ 
    error: 'Internal server error' 
  });
});
```

---

## 🧪 Exercício

1. Prepara o package.json com scripts
2. Adiciona health check endpoint
3. Deploy no Railway via GitHub
4. Configura variáveis de ambiente
5. Testa os endpoints

---

## 📚 Recursos
- [Railway Node.js](https://docs.railway.app/guides/nodejs)
- [Express Production](https://expressjs.com/en/advanced/best-practice-performance.html)

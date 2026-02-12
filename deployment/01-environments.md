# 01 - Ambientes: Local vs Produção

## 🎯 Objetivos
- Entender diferenças entre ambientes
- Configurar variáveis de ambiente
- Preparar código para produção

---

## 🏠 Ambientes

| Ambiente | Propósito | Características |
|----------|-----------|-----------------|
| **Development** | Programar | Debug on, hot reload, logs verbosos |
| **Staging** | Testar | Cópia de produção, dados de teste |
| **Production** | Utilizadores | Otimizado, seguro, escalável |

---

## ⚙️ Variáveis de Ambiente

### .env Files
```bash
# .env.development
PORT=3001
DATABASE_URL="postgresql://user:pass@localhost:5432/dev_db"
API_URL="http://localhost:3001"

# .env.production
PORT=8080
DATABASE_URL="postgresql://user:pass@prod-server:5432/prod_db"
API_URL="https://api.padreginos.com"
```

### Usar no Código
```javascript
// Node.js
const port = process.env.PORT || 3001;
const dbUrl = process.env.DATABASE_URL;

// React (Vite)
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## 🔐 Nunca Commit Secrets

```gitignore
# .gitignore
.env
.env.local
.env*.local
.env.production
```

### Usar .env.example
```bash
# .env.example (FAZER COMMIT)
PORT=3001
DATABASE_URL=your_database_url_here
API_KEY=your_api_key_here
```

---

## 🌐 Diferenças Práticas

### URLs
```javascript
// ❌ Hardcoded
fetch('http://localhost:3001/api/pizzas')

// ✅ Variável de ambiente
fetch(`${import.meta.env.VITE_API_URL}/api/pizzas`)
```

### CORS
```javascript
// Development: Aceitar localhost
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://padreginos.com'
    : 'http://localhost:5173'
}));
```

### Logs
```javascript
if (process.env.NODE_ENV !== 'production') {
  console.log('Debug info:', data);
}
```

---

## 📁 Configuração por Ambiente

```javascript
// config/index.js
const config = {
  development: {
    apiUrl: 'http://localhost:3001',
    debug: true
  },
  production: {
    apiUrl: 'https://api.padreginos.com',
    debug: false
  }
};

export default config[process.env.NODE_ENV || 'development'];
```

---

## 🧪 Exercício

1. Cria ficheiros .env.development e .env.example
2. Usa variáveis para PORT e DATABASE_URL
3. Adiciona .env ao .gitignore
4. Testa que a app funciona com as variáveis

---

## 📚 Recursos
- [12 Factor App - Config](https://12factor.net/config)
- [Vite Env Variables](https://vitejs.dev/guide/env-and-mode.html)

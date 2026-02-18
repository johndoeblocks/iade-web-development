# 03 - Express.js Introdução

## 🎯 Objetivos
- Criar servidor Express
- Entender middleware
- Servir rotas básicas

---

## 🤔 Porquê Express?

Node.js nativo é verboso:
```javascript
// Sem Express
import http from 'http';
http.createServer((req, res) => {
  ....

  if (req.method === 'GET' && req.url === '/pizzas') {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify([...]));
  }
}).listen(3000);
```

Com Express é simples:
```javascript
// Com Express
import express from 'express';

const app = express();

app.get('/pizzas', (req, res) => {
  res.json([...]);
});

app.listen(3000);
```

---

## 🛠️ Setup Inicial

```bash
npm init -y
npm install express
```

```javascript
// src/index.js
import express from 'express';

const app = express();
const PORT = 3001;

app.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à API! 🍕' });
});

app.listen(PORT, () => {
  console.log(`Servidor em http://localhost:${PORT}`);
});
```

---

## 🔧 Middleware

Middleware são funções que têm acesso ao request e response.

```javascript
// Middleware é executado em ORDEM

// 1. Logging (executa primeiro)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next(); // Passa para o próximo
});

// 2. Parse JSON body
app.use(express.json());

// 3. CORS
app.use(cors());

// 4. As rotas vêm depois
app.get('/pizzas', (req, res) => { ... });
```

### Middleware Built-in
```javascript
// Parse JSON no body de requests
app.use(express.json());

// Parse URL-encoded (forms)
app.use(express.urlencoded({ extended: true }));

// Servir ficheiros estáticos
app.use(express.static('public'));
```

### Middleware de Terceiros
```javascript
import cors from 'cors';
import morgan from 'morgan';

app.use(cors());           // Permite cross-origin requests
app.use(morgan('dev'));    // Logging bonito
```

---

## 📍 Request Object

```javascript
app.get('/pizzas/:id', (req, res) => {
  // Parâmetros da URL
  console.log(req.params.id);      // :id
  
  // Query string (?sort=name&limit=10)
  console.log(req.query.sort);     // 'name'
  console.log(req.query.limit);    // '10'
  
  // Headers
  console.log(req.headers['content-type']);
  
  // Body (precisa de express.json())
  console.log(req.body);
  
  // Método HTTP
  console.log(req.method);         // 'GET'
  
  // URL
  console.log(req.path);           // '/pizzas/1'
});
```

---

## 📤 Response Object

```javascript
app.get('/exemplo', (req, res) => {
  // Enviar JSON
  res.json({ nome: 'Margherita' });
  
  // Enviar texto
  res.send('Olá!');
  
  // Status code
  res.status(201).json({ created: true });
  
  // Status codes comuns
  res.status(200); // OK
  res.status(201); // Created
  res.status(400); // Bad Request
  res.status(404); // Not Found
  res.status(500); // Internal Server Error
  
  // Redirect
  res.redirect('/nova-pagina');
  
  // Headers
  res.set('X-Custom-Header', 'valor');
});
```

---

## 🔄 Fluxo de Request

```
Request → Middleware 1 → Middleware 2 → Route Handler → Response
              ↓              ↓              ↓
            next()         next()       res.json()
```

---

## 🏗️ Estrutura do Projeto

```
backend/
├── src/
│   ├── index.js          # Entry point
│   ├── routes/
│   │   ├── pizzas.js
│   │   ├── stores.js
│   │   └── orders.js
│   ├── data/
│   │   ├── pizzas.json
│   │   ├── stores.json
│   │   └── orders.json
│   └── public/
│       ├── admin.html
│       ├── lojas.html
│       └── pizzas.html
├── package.json
└── .gitignore
```

---

## 🧪 Exercício

1. Cria servidor Express na porta 3001
2. Adiciona middleware de logging
3. Cria rota GET `/` que retorna JSON
4. Cria rota GET `/health` que retorna status
5. Testa com browser ou curl

---

## 📚 Recursos
- [Express.js Docs](https://expressjs.com/)
- [Express Middleware](https://expressjs.com/en/guide/using-middleware.html)

# 04 - Rotas e Métodos HTTP

## 🎯 Objetivos
- Criar rotas RESTful
- Usar todos os métodos HTTP
- Parâmetros e query strings
- Organizar rotas em ficheiros

---

## 🛣️ REST API Design

REST (Representational State Transfer) usa URLs e métodos HTTP para operações:

| Método | URL | Ação |
|--------|-----|------|
| GET | /pizzas | Listar todas |
| GET | /pizzas/1 | Obter uma |
| POST | /pizzas | Criar nova |
| PUT | /pizzas/1 | Atualizar toda |
| PATCH | /pizzas/1 | Atualizar parcial |
| DELETE | /pizzas/1 | Apagar |

---

## 📍 Métodos HTTP em Express

```javascript
// GET - Obter dados
app.get('/pizzas', (req, res) => {
  res.json(pizzas);
});

// POST - Criar
app.post('/pizzas', (req, res) => {
  const nova = req.body;
  pizzas.push(nova);
  res.status(201).json(nova);
});

// PUT - Substituir
app.put('/pizzas/:id', (req, res) => {
  const { id } = req.params;
  pizzas[id] = req.body;
  res.json(pizzas[id]);
});

// PATCH - Atualizar parcial
app.patch('/pizzas/:id', (req, res) => {
  const { id } = req.params;
  pizzas[id] = { ...pizzas[id], ...req.body };
  res.json(pizzas[id]);
});

// DELETE - Apagar
app.delete('/pizzas/:id', (req, res) => {
  const { id } = req.params;
  pizzas.splice(id, 1);
  res.status(204).send();
});
```

---

## 🔢 Parâmetros de Rota

```javascript
// :id é um parâmetro
app.get('/pizzas/:id', (req, res) => {
  const { id } = req.params;
  const pizza = pizzas.find(p => p.id === parseInt(id));
  
  if (!pizza) {
    return res.status(404).json({ error: 'Pizza não encontrada' });
  }
  
  res.json(pizza);
});

// Múltiplos parâmetros
app.get('/lojas/:lojaId/pizzas/:pizzaId', (req, res) => {
  const { lojaId, pizzaId } = req.params;
  // ...
});
```

---

## 🔍 Query Strings

```javascript
// URL: /pizzas?categoria=classicas&limit=5&sort=preco

app.get('/pizzas', (req, res) => {
  let result = [...pizzas];
  
  // Filtrar por categoria
  if (req.query.categoria) {
    result = result.filter(p => p.categoria === req.query.categoria);
  }
  
  // Ordenar
  if (req.query.sort) {
    result.sort((a, b) => a[req.query.sort] - b[req.query.sort]);
  }
  
  // Limitar
  if (req.query.limit) {
    result = result.slice(0, parseInt(req.query.limit));
  }
  
  res.json(result);
});
```

---

## 📁 Express Router

Organizar rotas em ficheiros separados:

```javascript
// routes/pizzas.js
import express from 'express';
const router = express.Router();

// Estas rotas vão ser prefixadas com /api/pizzas
router.get('/', (req, res) => {
  res.json(pizzas);
});

router.get('/:id', (req, res) => {
  // ...
});

router.post('/', (req, res) => {
  // ...
});

export default router;
```

```javascript
// index.js
import pizzasRouter from './routes/pizzas.js';
import storesRouter from './routes/stores.js';

app.use('/api/pizzas', pizzasRouter);
app.use('/api/stores', storesRouter);
```

---

## 🏗️ Exemplo Completo: Pizzas Router

```javascript
// routes/pizzas.js
import express from 'express';
const router = express.Router();

let pizzas = [
  { id: 1, nome: 'Margherita', preco: 8.50 },
  { id: 2, nome: 'Pepperoni', preco: 10.00 },
];

// GET /api/pizzas
router.get('/', (req, res) => {
  res.json(pizzas);
});

// GET /api/pizzas/:id
router.get('/:id', (req, res) => {
  const pizza = pizzas.find(p => p.id === parseInt(req.params.id));
  if (!pizza) {
    return res.status(404).json({ error: 'Não encontrada' });
  }
  res.json(pizza);
});

// POST /api/pizzas
router.post('/', (req, res) => {
  const { nome, preco } = req.body;
  
  if (!nome || !preco) {
    return res.status(400).json({ error: 'Nome e preço obrigatórios' });
  }
  
  const nova = {
    id: pizzas.length + 1,
    nome,
    preco
  };
  
  pizzas.push(nova);
  res.status(201).json(nova);
});

// DELETE /api/pizzas/:id
router.delete('/:id', (req, res) => {
  const index = pizzas.findIndex(p => p.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ error: 'Não encontrada' });
  }
  
  pizzas.splice(index, 1);
  res.status(204).send();
});

export default router;
```

---

## 🔐 Validação Básica

```javascript
router.post('/', (req, res) => {
  const { nome, preco, categoria } = req.body;
  
  // Validar campos obrigatórios
  const errors = [];
  if (!nome) errors.push('Nome é obrigatório');
  if (!preco) errors.push('Preço é obrigatório');
  if (preco && preco < 0) errors.push('Preço deve ser positivo');
  
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  
  // Criar pizza...
});
```

---

## 🧪 Exercício

1. Cria router para `/api/stores` com GET all e GET by ID
2. Cria router para `/api/orders` com GET all e POST
3. Adiciona validação no POST
4. Adiciona query string filtering
5. Testa com curl ou Postman

---

## 📚 Recursos
- [Express Routing](https://expressjs.com/en/guide/routing.html)
- [REST API Design](https://restfulapi.net/)

# 10 - Prisma + PostgreSQL

## 🎯 Objetivos
- Entender o que é um ORM
- Configurar Prisma
- Definir modelos
- Fazer queries à base de dados

---

## 🤔 Porquê Prisma?

### Sem ORM (SQL direto)
```javascript
const result = await client.query(
  'SELECT * FROM pizzas WHERE categoria = $1',
  ['classicas']
);
```

### Com Prisma
```javascript
const pizzas = await prisma.pizza.findMany({
  where: { categoria: 'classicas' }
});
```

**Vantagens do Prisma:**
- Type-safety (autocompletar)
- Migrations automáticas
- Schema como source of truth
- Funciona com vários DBs

---

## 🛠️ Setup

### 1. Instalar
```bash
npm install prisma --save-dev
npm install @prisma/client
```

### 2. Inicializar
```bash
npx prisma init
```

Cria:
- `prisma/schema.prisma` - Definição do schema
- `.env` - Variáveis de ambiente

### 3. Configurar .env
```env
DATABASE_URL="postgresql://user:password@localhost:5432/padre_ginos?schema=public"
```

---

## 📝 Schema Prisma

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Pizza {
  id          Int      @id @default(autoincrement())
  nome        String
  descricao   String?
  preco       Float
  imagem      String?
  categoria   String   @default("classicas")
  disponivel  Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  orderItems  OrderItem[]
}

model Store {
  id          Int      @id @default(autoincrement())
  nome        String
  morada      String
  telefone    String
  horario     String
  latitude    Float?
  longitude   Float?
  
  orders      Order[]
}

model Order {
  id          Int         @id @default(autoincrement())
  nome        String
  telefone    String
  morada      String
  observacoes String?
  total       Float
  status      String      @default("pendente")
  createdAt   DateTime    @default(now())
  
  storeId     Int?
  store       Store?      @relation(fields: [storeId], references: [id])
  items       OrderItem[]
}

model OrderItem {
  id          Int      @id @default(autoincrement())
  quantidade  Int
  precoUnit   Float
  
  orderId     Int
  order       Order    @relation(fields: [orderId], references: [id])
  pizzaId     Int
  pizza       Pizza    @relation(fields: [pizzaId], references: [id])
}
```

---

## 🔄 Migrations

```bash
# Criar migration a partir do schema
npx prisma migrate dev --name init

# Ver estado das migrations
npx prisma migrate status

# Reset da base de dados (APAGA TUDO!)
npx prisma migrate reset
```

---

## 🎮 Prisma Client

### Criar Cliente
```javascript
// src/db.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
```

### Queries Básicas

```javascript
import prisma from './db.js';

// CREATE
const pizza = await prisma.pizza.create({
  data: {
    nome: 'Margherita',
    descricao: 'Clássica italiana',
    preco: 8.50,
    categoria: 'classicas'
  }
});

// READ - Todas
const pizzas = await prisma.pizza.findMany();

// READ - Com filtro
const classicas = await prisma.pizza.findMany({
  where: { categoria: 'classicas' }
});

// READ - Uma
const pizza = await prisma.pizza.findUnique({
  where: { id: 1 }
});

// UPDATE
const updated = await prisma.pizza.update({
  where: { id: 1 },
  data: { preco: 9.00 }
});

// DELETE
await prisma.pizza.delete({
  where: { id: 1 }
});
```

---

## 🚀 Usar nas Rotas

```javascript
// routes/pizzas.js
import express from 'express';
import prisma from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { categoria } = req.query;
    
    const pizzas = await prisma.pizza.findMany({
      where: categoria ? { categoria } : undefined,
      orderBy: { nome: 'asc' }
    });
    
    res.json(pizzas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao carregar pizzas' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const pizza = await prisma.pizza.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    
    if (!pizza) {
      return res.status(404).json({ error: 'Pizza não encontrada' });
    }
    
    res.json(pizza);
  } catch (error) {
    res.status(500).json({ error: 'Erro' });
  }
});

router.post('/', async (req, res) => {
  try {
    const pizza = await prisma.pizza.create({
      data: req.body
    });
    
    res.status(201).json(pizza);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar pizza' });
  }
});

export default router;
```

---

## 🔗 Relações

```javascript
// Criar order com items
const order = await prisma.order.create({
  data: {
    nome: 'João Silva',
    telefone: '912345678',
    morada: 'Rua das Flores 10',
    total: 17.00,
    items: {
      create: [
        { pizzaId: 1, quantidade: 2, precoUnit: 8.50 }
      ]
    }
  },
  include: {
    items: {
      include: { pizza: true }
    }
  }
});

// Buscar order com items
const order = await prisma.order.findUnique({
  where: { id: 1 },
  include: {
    items: {
      include: { pizza: true }
    },
    store: true
  }
});
```

---

## 🧰 Prisma Studio

Interface visual para gerir dados:

```bash
npx prisma studio
```

Abre em http://localhost:5555

---

## 🧪 Exercício

1. Configura Prisma no projeto
2. Cria schema com Pizza, Store, Order
3. Executa a migration
4. Migra as rotas de JSON para Prisma
5. Testa com Prisma Studio

---

## 📚 Recursos
- [Prisma Docs](https://www.prisma.io/docs)
- [Prisma Schema](https://www.prisma.io/docs/concepts/components/prisma-schema)
- [Prisma Client](https://www.prisma.io/docs/concepts/components/prisma-client)

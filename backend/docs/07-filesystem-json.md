# 09 - Filesystem e JSON como Base de Dados

## 🎯 Objetivos
- Ler e escrever ficheiros com Node.js
- Usar JSON como base de dados simples
- Implementar CRUD completo
- Entender limitações desta abordagem

---

## 📁 Módulo fs/promises

Node.js tem um módulo built-in para operações de ficheiros:

```javascript
import { readFile, writeFile, mkdir, access } from 'fs/promises';
```

---

## 📖 Ler Ficheiros

```javascript
import { readFile } from 'fs/promises';

async function lerPizzas() {
  try {
    const data = await readFile('src/data/pizzas.json', 'utf-8');
    const pizzas = JSON.parse(data);
    return pizzas;
  } catch (error) {
    console.error('Erro ao ler ficheiro:', error);
    throw error;
  }
}
```

---

## ✍️ Escrever Ficheiros

```javascript
import { writeFile } from 'fs/promises';

async function guardarPizzas(pizzas) {
  try {
    const data = JSON.stringify(pizzas, null, 2);  // Pretty print
    await writeFile('src/data/pizzas.json', data);
  } catch (error) {
    console.error('Erro ao escrever ficheiro:', error);
    throw error;
  }
}
```

---

## 🔄 CRUD Completo com JSON

```javascript
// db.js - Funções de "base de dados"
import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths para os ficheiros JSON
const PIZZAS_PATH = join(__dirname, 'data/pizzas.json');
const ORDERS_PATH = join(__dirname, 'data/orders.json');

// === PIZZAS ===

// READ - Obter todas
export async function getPizzas() {
  const data = await readFile(PIZZAS_PATH, 'utf-8');
  return JSON.parse(data);
}

// READ - Obter uma
export async function getPizzaById(id) {
  const pizzas = await getPizzas();
  return pizzas.find(p => p.id === id);
}

// CREATE - Criar nova
export async function createPizza(pizzaData) {
  const pizzas = await getPizzas();
  
  const newPizza = {
    id: pizzas.length > 0 ? Math.max(...pizzas.map(p => p.id)) + 1 : 1,
    ...pizzaData,
    createdAt: new Date().toISOString()
  };
  
  pizzas.push(newPizza);
  await writeFile(PIZZAS_PATH, JSON.stringify(pizzas, null, 2));
  
  return newPizza;
}

// UPDATE - Atualizar
export async function updatePizza(id, updates) {
  const pizzas = await getPizzas();
  const index = pizzas.findIndex(p => p.id === id);
  
  if (index === -1) return null;
  
  pizzas[index] = { ...pizzas[index], ...updates };
  await writeFile(PIZZAS_PATH, JSON.stringify(pizzas, null, 2));
  
  return pizzas[index];
}

// DELETE - Apagar
export async function deletePizza(id) {
  const pizzas = await getPizzas();
  const filtered = pizzas.filter(p => p.id !== id);
  
  if (filtered.length === pizzas.length) return false;
  
  await writeFile(PIZZAS_PATH, JSON.stringify(filtered, null, 2));
  return true;
}
```

---

## 🛣️ Usar nas Rotas

```javascript
// routes/pizzas.js
import express from 'express';
import * as db from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const pizzas = await db.getPizzas();
    res.json(pizzas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao carregar pizzas' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const pizza = await db.getPizzaById(parseInt(req.params.id));
    if (!pizza) {
      return res.status(404).json({ error: 'Pizza não encontrada' });
    }
    res.json(pizza);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao carregar pizza' });
  }
});

router.post('/', async (req, res) => {
  try {
    const pizza = await db.createPizza(req.body);
    res.status(201).json(pizza);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar pizza' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await db.deletePizza(parseInt(req.params.id));
    if (!deleted) {
      return res.status(404).json({ error: 'Pizza não encontrada' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao apagar pizza' });
  }
});

export default router;
```

---

## 📋 Estrutura dos Ficheiros JSON

```json
// data/pizzas.json
[
  {
    "id": 1,
    "nome": "Margherita",
    "descricao": "Molho de tomate, mozzarella, manjericão",
    "preco": 8.50,
    "categoria": "classicas",
    "disponivel": true
  }
]

// data/orders.json
[
  {
    "id": 1,
    "nome": "João Silva",
    "telefone": "912345678",
    "morada": "Rua das Flores 10",
    "items": [
      { "id": 1, "nome": "Margherita", "preco": 8.50, "quantidade": 2 }
    ],
    "total": 17.00,
    "status": "pendente",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

---

## ⚠️ Limitações do JSON como DB

| ✅ Bom para | ❌ Não usar para |
|-------------|-----------------|
| Protótipos | Produção |
| Aprendizagem | Dados sensíveis |
| Poucos dados | Muitos utilizadores |
| Sem concorrência | Escrita simultânea |

### Problemas:
1. **Concorrência** - Duas escritas ao mesmo tempo podem corromper
2. **Performance** - Lê o ficheiro TODO para cada operação
3. **Memória** - Carrega tudo para memória
4. **Sem queries** - Não há SELECT com WHERE eficiente

---

## 🧪 Exercício

1. Implementa funções CRUD para orders.json
2. Adiciona validação antes de guardar
3. Implementa uma função de "backup"
4. Testa concorrência (abrir 2 tabs e submeter)

---

## ➡️ Próximo Passo

Na próxima aula vamos usar **Prisma + PostgreSQL** para uma base de dados real!

---

## 📚 Recursos
- [Node.js fs module](https://nodejs.org/api/fs.html)
- [fs/promises](https://nodejs.org/api/fs.html#promises-api)

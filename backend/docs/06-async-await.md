# 06 - Async/Await

## 🎯 Objetivos
- Escrever código assíncrono que parece síncrono
- Usar async/await corretamente
- Promise.all com await
- Padrões comuns em Express

---

## ✨ O Que é Async/Await?

Syntax sugar sobre Promises que torna o código mais legível:

```javascript
// Com Promises
function getPizzas() {
  return fetch('/api/pizzas')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      return data;
    });
}

// Com Async/Await
async function getPizzas() {
  const response = await fetch('/api/pizzas');
  const data = await response.json();
  console.log(data);
  return data;
}
```

---

## 📝 Sintaxe

### Declarar Função Async
```javascript
// Function declaration
async function minhaFuncao() {
  // ...
}

// Arrow function
const minhaFuncao = async () => {
  // ...
};

// Método de objeto
const obj = {
  async metodo() {
    // ...
  }
};
```

### Usar Await
```javascript
async function exemplo() {
  // await PAUSA a execução até a Promise resolver
  const resultado = await algumaPromise();
  
  // Só executa depois de resolver
  console.log(resultado);
}
```

---

## 🛡️ Error Handling

```javascript
async function getPizzas() {
  try {
    const response = await fetch('/api/pizzas');
    
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error('Erro:', error.message);
    throw error;  // Re-throw para quem chamou
  }
}
```

---

## 🔀 Promise.all com Await

### Sequencial (lento)
```javascript
async function carregarTudo() {
  // Executa um de cada vez 😴
  const pizzas = await fetch('/api/pizzas').then(r => r.json());
  const stores = await fetch('/api/stores').then(r => r.json());
  const orders = await fetch('/api/orders').then(r => r.json());
  
  return { pizzas, stores, orders };
}
```

### Paralelo (rápido) ⚡
```javascript
async function carregarTudo() {
  // Executa todos ao mesmo tempo
  const [pizzas, stores, orders] = await Promise.all([
    fetch('/api/pizzas').then(r => r.json()),
    fetch('/api/stores').then(r => r.json()),
    fetch('/api/orders').then(r => r.json()),
  ]);
  
  return { pizzas, stores, orders };
}
```

---

## 🚀 Async/Await em Express

```javascript
// Route com async/await
router.get('/', async (req, res) => {
  try {
    const pizzas = await getPizzas();
    res.json(pizzas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST com validação
router.post('/', async (req, res) => {
  try {
    const { nome, preco } = req.body;
    
    if (!nome || !preco) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }
    
    const novaPizza = await criarPizza({ nome, preco });
    res.status(201).json(novaPizza);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## 🔄 Loops com Await

### Sequencial
```javascript
async function processarPizzas(pizzas) {
  for (const pizza of pizzas) {
    await processarPizza(pizza);  // Uma de cada vez
  }
}
```

### Paralelo
```javascript
async function processarPizzas(pizzas) {
  await Promise.all(
    pizzas.map(pizza => processarPizza(pizza))  // Todas ao mesmo tempo
  );
}
```

---

## 🏗️ Exemplo Completo: API Route

```javascript
// routes/pizzas.js
import { readFile, writeFile } from 'fs/promises';

async function getPizzas() {
  const data = await readFile('src/data/pizzas.json', 'utf-8');
  return JSON.parse(data);
}

async function savePizzas(pizzas) {
  await writeFile('src/data/pizzas.json', JSON.stringify(pizzas, null, 2));
}

router.get('/', async (req, res) => {
  try {
    const pizzas = await getPizzas();
    
    // Filtrar se necessário
    const { categoria } = req.query;
    const resultado = categoria 
      ? pizzas.filter(p => p.categoria === categoria)
      : pizzas;
    
    res.json(resultado);
  } catch (error) {
    console.error('Erro ao obter pizzas:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { nome, descricao, preco } = req.body;
    
    // Validação
    if (!nome || !preco) {
      return res.status(400).json({ error: 'Nome e preço obrigatórios' });
    }
    
    // Carregar e atualizar
    const pizzas = await getPizzas();
    const novaPizza = {
      id: pizzas.length + 1,
      nome,
      descricao,
      preco,
      disponivel: true
    };
    
    pizzas.push(novaPizza);
    await savePizzas(pizzas);
    
    res.status(201).json(novaPizza);
  } catch (error) {
    console.error('Erro ao criar pizza:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
});
```

---

## ⚠️ Erros Comuns

### Esquecer await
```javascript
// ❌ Retorna Promise, não o valor
const data = fetch('/api/pizzas');

// ✅ Retorna o valor
const data = await fetch('/api/pizzas');
```

### Usar await fora de async
```javascript
// ❌ Erro de sintaxe
const data = await fetch('/api');

// ✅ Dentro de função async
async function getData() {
  const data = await fetch('/api');
}
```

---

## 🧪 Exercício

1. Converte as rotas de pizzas para async/await
2. Implementa GET e POST com try/catch
3. Usa Promise.all para carregar pizzas e stores
4. Adiciona um delay artificial para testar

---

## 📚 Recursos
- [MDN - async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [JavaScript.info - Async/Await](https://javascript.info/async-await)

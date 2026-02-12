# 06 - Callbacks

## 🎯 Objetivos
- Entender o pattern de callbacks
- Reconhecer callback hell
- Preparar para Promises

---

## 🔄 O Que São Callbacks?

Callbacks são funções passadas como argumento para outras funções, executadas **quando algo termina**.

```javascript
// Exemplo simples
function saudacao(nome, callback) {
  const mensagem = `Olá, ${nome}!`;
  callback(mensagem);
}

saudacao('Gino', (msg) => {
  console.log(msg); // "Olá, Gino!"
});
```

---

## ⏱️ Operações Assíncronas

JavaScript não espera por operações lentas:

```javascript
console.log('1. Início');

setTimeout(() => {
  console.log('2. Depois de 1 segundo');
}, 1000);

console.log('3. Continua imediatamente');

// Output:
// 1. Início
// 3. Continua imediatamente
// 2. Depois de 1 segundo
```

---

## 📁 Callbacks no Node.js

Node.js usa o padrão **error-first callback**:

```javascript
import { readFile } from 'fs';

// callback(error, resultado)
readFile('pizzas.json', 'utf-8', (error, data) => {
  if (error) {
    console.error('Erro:', error);
    return;
  }
  console.log('Dados:', data);
});
```

### Padrão Error-First
```javascript
function fazerAlgo(callback) {
  // Se erro
  callback(new Error('Falhou'), null);
  
  // Se sucesso
  callback(null, resultado);
}

fazerAlgo((error, resultado) => {
  if (error) {
    // Tratar erro
    return;
  }
  // Usar resultado
});
```

---

## 😱 Callback Hell

Quando precisas de várias operações em sequência:

```javascript
// Ler pizzas, depois lojas, depois fazer pedido
readFile('pizzas.json', 'utf-8', (err, pizzas) => {
  if (err) return console.error(err);
  
  readFile('stores.json', 'utf-8', (err, stores) => {
    if (err) return console.error(err);
    
    readFile('orders.json', 'utf-8', (err, orders) => {
      if (err) return console.error(err);
      
      // Adicionar pedido
      const newOrders = [...JSON.parse(orders), newOrder];
      
      writeFile('orders.json', JSON.stringify(newOrders), (err) => {
        if (err) return console.error(err);
        
        console.log('Pedido criado!');
        // 🔺 Pirâmide da morte!
      });
    });
  });
});
```

### Problemas:
1. Difícil de ler (indentação profunda)
2. Difícil de manter
3. Tratamento de erros repetitivo
4. Difícil de reutilizar

---

## 🛠️ Melhorar Callbacks

### 1. Funções Nomeadas
```javascript
function handlePizzas(err, pizzas) {
  if (err) return console.error(err);
  readFile('stores.json', 'utf-8', handleStores);
}

function handleStores(err, stores) {
  if (err) return console.error(err);
  // ...
}

readFile('pizzas.json', 'utf-8', handlePizzas);
```

### 2. Módulos
```javascript
// Separar lógica em funções
function loadPizzas(callback) {
  readFile('pizzas.json', 'utf-8', (err, data) => {
    if (err) return callback(err);
    callback(null, JSON.parse(data));
  });
}

function loadStores(callback) {
  readFile('stores.json', 'utf-8', (err, data) => {
    if (err) return callback(err);
    callback(null, JSON.parse(data));
  });
}
```

---

## 🔄 Callbacks em Eventos

```javascript
import http from 'http';

const server = http.createServer((req, res) => {
  // Este callback é chamado para cada request
  res.end('Olá!');
});

server.listen(3000, () => {
  // Callback quando servidor inicia
  console.log('Servidor ativo');
});
```

---

## ➡️ A Solução: Promises

Callbacks funcionam, mas Promises são melhores:

```javascript
// Callback
readFile('pizzas.json', 'utf-8', (err, data) => {
  if (err) return console.error(err);
  console.log(data);
});

// Promise (próxima aula!)
readFile('pizzas.json', 'utf-8')
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

---

## 🧪 Exercício

1. Cria função que lê pizzas.json com callback
2. Cria função que lê stores.json com callback
3. Chama as duas em sequência
4. Observa o callback hell formando-se

---

## 📚 Recursos
- [MDN - Callback function](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function)
- [Node.js Callbacks](https://nodejs.org/en/knowledge/getting-started/control-flow/what-are-callbacks/)

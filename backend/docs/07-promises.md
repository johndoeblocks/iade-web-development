# 07 - Promises

## 🎯 Objetivos
- Entender Promises
- Usar .then() e .catch()
- Encadear Promises
- Converter callbacks em Promises

---

## 📦 O Que é uma Promise?

Uma Promise é um objeto que representa o **resultado futuro** de uma operação assíncrona.

```javascript
const promise = new Promise((resolve, reject) => {
  // Operação assíncrona
  const sucesso = true;
  
  if (sucesso) {
    resolve('Deu certo!');  // Sucesso
  } else {
    reject('Falhou!');      // Erro
  }
});
```

### Estados de uma Promise
1. **Pending** - Ainda a executar
2. **Fulfilled** - Completou com sucesso (resolved)
3. **Rejected** - Falhou com erro

---

## 🔗 .then() e .catch()

```javascript
const promise = fetch('/api/pizzas');

promise
  .then(response => {
    // Sucesso
    return response.json();
  })
  .then(data => {
    // Resultado do JSON
    console.log(data);
  })
  .catch(error => {
    // Qualquer erro na cadeia
    console.error('Erro:', error);
  })
  .finally(() => {
    // Executa sempre
    console.log('Concluído');
  });
```

---

## ⛓️ Encadeamento

Cada `.then()` retorna uma nova Promise:

```javascript
fetch('/api/pizzas')
  .then(response => response.json())
  .then(pizzas => {
    console.log('Pizzas:', pizzas);
    return fetch('/api/stores');
  })
  .then(response => response.json())
  .then(stores => {
    console.log('Lojas:', stores);
  })
  .catch(error => {
    // Apanha erros de qualquer passo
    console.error(error);
  });
```

---

## 🔄 Callback → Promise

### Antes (Callback)
```javascript
import { readFile } from 'fs';

readFile('pizzas.json', 'utf-8', (err, data) => {
  if (err) return console.error(err);
  console.log(data);
});
```

### Depois (Promise)
```javascript
import { readFile } from 'fs/promises';  // Versão Promise!

readFile('pizzas.json', 'utf-8')
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

### Criar Promise Manualmente
```javascript
function readFilePromise(path) {
  return new Promise((resolve, reject) => {
    readFile(path, 'utf-8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}
```

---

## 🔀 Promise.all()

Executar múltiplas Promises **em paralelo**:

```javascript
const [pizzas, stores, orders] = await Promise.all([
  fetch('/api/pizzas').then(r => r.json()),
  fetch('/api/stores').then(r => r.json()),
  fetch('/api/orders').then(r => r.json()),
]);

// Todas completam antes de continuar
console.log(pizzas, stores, orders);
```

### Se uma falhar, todas falham:
```javascript
Promise.all([promise1, promise2, promise3])
  .catch(error => {
    // Chamado se QUALQUER uma falhar
  });
```

---

## 🏃 Promise.race()

Retorna quando a **primeira** completa:

```javascript
const result = await Promise.race([
  fetch('/api/slow'),
  timeout(5000)  // Timeout após 5 segundos
]);
```

---

## 🛡️ Promise.allSettled()

Espera **todas** completarem, mesmo com erros:

```javascript
const results = await Promise.allSettled([
  fetch('/api/pizzas'),
  fetch('/api/endpoint-que-falha'),
]);

results.forEach(result => {
  if (result.status === 'fulfilled') {
    console.log('Sucesso:', result.value);
  } else {
    console.log('Erro:', result.reason);
  }
});
```

---

## 🏗️ Exemplo: Carregar Dados da Pizzaria

```javascript
function carregarDados() {
  return Promise.all([
    readFile('src/data/pizzas.json', 'utf-8'),
    readFile('src/data/stores.json', 'utf-8'),
  ])
  .then(([pizzasData, storesData]) => ({
    pizzas: JSON.parse(pizzasData),
    stores: JSON.parse(storesData)
  }));
}

carregarDados()
  .then(({ pizzas, stores }) => {
    console.log('Pizzas:', pizzas.length);
    console.log('Lojas:', stores.length);
  })
  .catch(error => {
    console.error('Erro ao carregar dados:', error);
  });
```

---

## ⚠️ Erros Comuns

### Esquecer return
```javascript
// ❌ Errado
promise.then(data => {
  fetch('/api/outro');  // Não retorna!
}).then(response => {
  // response é undefined
});

// ✅ Correto
promise.then(data => {
  return fetch('/api/outro');
}).then(response => {
  // response é a Response
});
```

### catch() no sítio errado
```javascript
// ❌ Não apanha erros do último .then()
fetch('/api')
  .catch(err => handleError(err))
  .then(processData);

// ✅ Apanha todos os erros
fetch('/api')
  .then(processData)
  .catch(err => handleError(err));
```

---

## 🧪 Exercício

1. Converte a leitura de pizzas.json para Promise
2. Usa Promise.all para carregar pizzas e stores
3. Adiciona tratamento de erros
4. Experimenta Promise.race com timeout

---

## 📚 Recursos
- [MDN - Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [JavaScript.info - Promises](https://javascript.info/promise-basics)

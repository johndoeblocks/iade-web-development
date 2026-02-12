# 05 - Try/Catch - Tratamento de Erros

## 🎯 Objetivos
- Entender erros em JavaScript
- Usar try/catch corretamente
- Criar error handlers em Express
- Boas práticas de error handling

---

## ⚠️ Tipos de Erros

### Erros de Sintaxe
```javascript
// Apanhados pelo interpretador
const x = ;  // SyntaxError
```

### Erros de Runtime
```javascript
// Acontecem durante execução
const obj = null;
obj.prop;  // TypeError: Cannot read property 'prop' of null
```

### Erros Lógicos
```javascript
// Código funciona mas resultado errado
function soma(a, b) {
  return a - b;  // Erro lógico!
}
```

---

## 🛡️ Try/Catch

```javascript
try {
  // Código que pode falhar
  const data = JSON.parse(textoInvalido);
} catch (error) {
  // Tratamento do erro
  console.error('Erro ao fazer parse:', error.message);
}
```

### Estrutura Completa
```javascript
try {
  // Tenta executar
  const resultado = operacaoArriscada();
  
} catch (error) {
  // Se houver erro
  console.error('Erro:', error.message);
  
} finally {
  // Executa SEMPRE (com ou sem erro)
  limparRecursos();
}
```

---

## 📝 O Objeto Error

```javascript
try {
  throw new Error('Algo correu mal');
} catch (error) {
  console.log(error.name);     // 'Error'
  console.log(error.message);  // 'Algo correu mal'
  console.log(error.stack);    // Stack trace completo
}
```

### Tipos de Erro Built-in
```javascript
throw new Error('Erro genérico');
throw new TypeError('Tipo errado');
throw new RangeError('Fora do range');
throw new SyntaxError('Sintaxe inválida');
```

---

## 🏗️ Erros Customizados

```javascript
class NotFoundError extends Error {
  constructor(resource) {
    super(`${resource} não encontrado`);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

// Usar
throw new NotFoundError('Pizza');
throw new ValidationError('Nome é obrigatório');
```

---

## 🚀 Try/Catch em Express

### Rotas Síncronas
```javascript
router.get('/:id', (req, res) => {
  try {
    const pizza = getPizzaById(req.params.id);
    if (!pizza) {
      return res.status(404).json({ error: 'Não encontrada' });
    }
    res.json(pizza);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno' });
  }
});
```

### Rotas Assíncronas
```javascript
router.get('/:id', async (req, res) => {
  try {
    const pizza = await db.findPizza(req.params.id);
    res.json(pizza);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno' });
  }
});
```

---

## 🎯 Error Handler Global

```javascript
// No final de index.js (depois de todas as rotas)

// 404 Handler - rota não encontrada
app.use((req, res, next) => {
  res.status(404).json({ 
    error: 'Endpoint não encontrado',
    path: req.path 
  });
});

// Error Handler - erros gerais
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  // Erros customizados
  if (error.statusCode) {
    return res.status(error.statusCode).json({
      error: error.message
    });
  }
  
  // Erro genérico
  res.status(500).json({
    error: 'Erro interno do servidor'
  });
});
```

---

## 🔄 Async Error Wrapper

Para evitar repetir try/catch:

```javascript
// utils/asyncHandler.js
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
```

```javascript
// Uso
import asyncHandler from '../utils/asyncHandler.js';

router.get('/:id', asyncHandler(async (req, res) => {
  const pizza = await db.findPizza(req.params.id);
  if (!pizza) {
    throw new NotFoundError('Pizza');
  }
  res.json(pizza);
  // Não precisa de try/catch!
}));
```

---

## 📊 Níveis de Log

```javascript
// Produção - usar logger estruturado
console.log('Info geral');
console.info('Informação');
console.warn('Aviso');
console.error('Erro');

// Com contexto
console.error('Erro ao criar pizza:', {
  error: error.message,
  userId: req.user?.id,
  body: req.body
});
```

---

## 🔐 Nunca Expor Detalhes em Produção

```javascript
app.use((error, req, res, next) => {
  console.error(error.stack); // Log completo no servidor
  
  const isDev = process.env.NODE_ENV === 'development';
  
  res.status(500).json({
    error: 'Erro interno',
    // Só mostra detalhes em dev
    ...(isDev && { 
      message: error.message,
      stack: error.stack 
    })
  });
});
```

---

## 🧪 Exercício

1. Cria error classes: `NotFoundError`, `ValidationError`
2. Adiciona try/catch às rotas de pizzas
3. Cria error handler global
4. Testa pedindo uma pizza que não existe
5. Verifica que erros são logados no servidor

---

## 📚 Recursos
- [MDN - Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- [Express Error Handling](https://expressjs.com/en/guide/error-handling.html)

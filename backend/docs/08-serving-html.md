# 09 - Servir HTML pelo Servidor

## 🎯 Objetivos
- Entender a diferença entre API JSON e páginas HTML
- Servir ficheiros estáticos com Express
- Usar `res.sendFile()` para rotas específicas
- Criar uma página admin servida pelo backend
- Comunicação entre HTML e API (fetch)

---

## 🤔 Porquê Servir HTML pelo Backend?

Nem tudo precisa de ser um SPA (Single Page Application) com React.

**Casos de uso:**
- Páginas de administração internas
- Landing pages simples
- Páginas de erro customizadas
- Dashboards internos
- Documentação

```
Frontend React (SPA)          Backend Express
┌─────────────────┐          ┌─────────────────────┐
│  localhost:5173  │  ──────► │  localhost:3001/api  │ ← JSON
│  App principal   │          │                     │
└─────────────────┘          │  localhost:3001/admin│ ← HTML
                             └─────────────────────┘
```

---

## 📁 Ficheiros Estáticos - `express.static()`

O middleware `express.static()` serve ficheiros (HTML, CSS, JS, imagens) diretamente de uma pasta.

### Configuração no index.ts
```typescript
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve tudo o que está na pasta 'public'
app.use(express.static(join(__dirname, 'public')));
```

### Estrutura de Pastas
```
src/
├── index.ts
├── public/              ← Pasta de ficheiros estáticos
│   ├── admin.html       ← Acessível em /admin.html
│   ├── vite.svg         ← Acessível em /vite.svg
│   └── css/
│       └── styles.css   ← Acessível em /css/styles.css
└── routes/
```

> **Como funciona:** Qualquer ficheiro dentro de `public/` fica acessível pela URL correspondente. O ficheiro `public/admin.html` fica disponível em `http://localhost:3001/admin.html`.

---

## 🛤️ `res.sendFile()` - Rotas Específicas

Para URLs mais limpas, podemos mapear uma rota a um ficheiro HTML:

```typescript
// Em vez de /admin.html, usamos /admin
app.get('/admin', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'admin.html'));
});
```

**Resultado:** `http://localhost:3001/admin` serve o ficheiro `admin.html`.

### Diferença entre `static` e `sendFile`

| Método | Uso | Exemplo URL |
|--------|-----|-------------|
| `express.static()` | Serve pasta inteira automaticamente | `/admin.html`, `/vite.svg` |
| `res.sendFile()` | Serve ficheiro específico numa rota | `/admin` → `admin.html` |

> **Dica:** Usa os dois em conjunto — `static` para assets (CSS, JS, imagens) e `sendFile` para URLs limpas.

---

## 📤 Métodos de Resposta

Express tem vários métodos para enviar diferentes tipos de conteúdo:

```typescript
// JSON (APIs)
res.json({ nome: 'Margherita' });

// Ficheiro HTML
res.sendFile(join(__dirname, 'public', 'admin.html'));

// Texto simples
res.send('Olá mundo!');

// HTML inline (não recomendado para páginas grandes)
res.send('<h1>Olá!</h1>');

// Redirect
res.redirect('/admin');

// Download de ficheiro
res.download(join(__dirname, 'files', 'menu.pdf'));
```

---

## 🏗️ Exemplo Real: Página Admin

O nosso projeto tem uma página admin servida pelo Express.

### 1. Setup no `index.ts`

```typescript
import express, { Request, Response, NextFunction } from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(express.json());

// 1. Servir ficheiros estáticos da pasta 'public'
app.use(express.static(join(__dirname, 'public')));

// 2. Rota limpa para o admin
app.get('/admin', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'admin.html'));
});

// 3. Rotas da API
app.use('/api/pizzas', pizzasRouter);
app.use('/api/orders', ordersRouter);
```

### 2. A Página HTML (`public/admin.html`)

```html
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin — Padre Gino's 🍕</title>
  <style>
    /* CSS embebido na própria página */
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #f0f2f5;
    }
    .hero {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      padding: 40px 24px;
      text-align: center;
      color: white;
    }
    /* ... mais estilos */
  </style>
</head>
<body>

  <section class="hero">
    <h1>🛠️ Painel de Administração</h1>
    <p>Gerir encomendas da Padre Gino's</p>
  </section>

  <section class="orders" id="orders-list">
    <p class="empty">A carregar encomendas...</p>
  </section>

  <script>
    // JavaScript que comunica com a API
  </script>
</body>
</html>
```

---

## 🔗 Comunicação HTML ↔ API com Fetch

A página HTML usa `fetch()` para comunicar com a API do mesmo servidor:

### Ler Dados (GET)
```javascript
const API_URL = '/api';  // Mesmo servidor, não precisa de URL completo

async function fetchOrders() {
  try {
    const res = await fetch(`${API_URL}/orders`);
    if (!res.ok) throw new Error('Erro');
    
    const orders = await res.json();
    renderOrders(orders);  // Atualizar o HTML
  } catch (err) {
    console.error('Erro ao carregar:', err);
  }
}
```

### Enviar Dados (PATCH)
```javascript
async function updateStatus(orderId, newStatus) {
  try {
    const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || 'Erro ao atualizar');
      return;
    }

    await fetchOrders();  // Recarregar lista
  } catch (err) {
    alert('Erro ao atualizar status');
  }
}
```

> **Nota:** Como a página HTML e a API estão no mesmo servidor (`localhost:3001`), não há problemas de CORS. Usamos URLs relativos como `/api/orders` em vez de `http://localhost:3001/api/orders`.

---

## 🔄 Renderização Dinâmica com JavaScript

A página admin usa JavaScript vanilla para criar HTML dinamicamente:

```javascript
function renderOrders(orders) {
  const container = document.getElementById('orders-list');

  if (orders.length === 0) {
    container.innerHTML = '<p class="empty">Nenhuma encomenda</p>';
    return;
  }

  let html = '';
  for (const order of orders) {
    html += `
      <div class="order-card">
        <div class="order-header">
          <span class="order-id">#${order.id}</span>
          <span class="order-status">${order.status}</span>
        </div>
        <div class="order-body">
          <strong>👤 ${order.nome}</strong>
          <span>📞 ${order.telefone}</span>
          <span>💰 €${order.total.toFixed(2)}</span>
        </div>
      </div>
    `;
  }

  container.innerHTML = html;
}
```

### Auto-Refresh
```javascript
// Carregar ao iniciar
fetchOrders();

// Atualizar automaticamente a cada 5 segundos
setInterval(fetchOrders, 5000);
```

---

## 🆚 SPA (React) vs Server-Rendered HTML

| Aspeto | React SPA | HTML pelo Express |
|--------|-----------|-------------------|
| **Complexidade** | Maior (build, router, state) | Menor (ficheiro simples) |
| **Interatividade** | Alta | Média |
| **SEO** | Precisa de SSR | Bom por defeito |
| **Deploy** | Separado do backend | Junto com o backend |
| **Quando usar** | App principal para utilizadores | Painéis internos, admin |

---

## 📁 `__dirname` em ES Modules

Em CommonJS temos `__dirname` nativamente. Em ES Modules (que usamos com `"type": "module"`), precisamos de o construir:

```typescript
// CommonJS (antigo)
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
// __dirname existe automaticamente ✅

// ES Modules (moderno - o que usamos)
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Agora podemos usar __dirname ✅
```

> **Porquê?** `import.meta.url` dá-nos o URL do ficheiro atual (ex: `file:///Users/.../index.ts`). `fileURLToPath()` converte para um path normal, e `dirname()` extrai a pasta.

---

## 🧪 Exercício

1. Cria uma página `public/status.html` com um dashboard de status da API
2. Adiciona uma rota `/status` que serve essa página
3. Na página, usa `fetch` para chamar `/api/pizzas` e mostrar quantas pizzas existem
4. Adiciona CSS para tornar a página visualmente apelativa
5. Testa em `http://localhost:3001/status`

---

## 📚 Recursos
- [Express - Serving Static Files](https://expressjs.com/en/starter/static-files.html)
- [Express - res.sendFile()](https://expressjs.com/en/api.html#res.sendFile)
- [MDN - Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

# 08 - Servir HTML pelo Servidor

## 🎯 Objetivo
Até agora, o nosso backend só devolve **JSON**. Mas o Express também pode servir **páginas HTML**. Vamos ver como funciona com 3 exemplos do projeto: `lojas.html`, `pizzas.html` e `admin.html`.

---

## 📁 Onde ficam os ficheiros HTML?

Todos os ficheiros HTML ficam na pasta `src/public/`:

```
src/
├── index.js
├── public/          ← Pasta dos ficheiros estáticos
│   ├── admin.html   ← Painel de administração
│   ├── lojas.html   ← Lista de lojas
│   └── pizzas.html  ← Lista de pizzas
└── routes/
```

No `index.js` dizemos ao Express para servir esta pasta:

```javascript
app.use(express.static(join(__dirname, 'public')));
```

Isto faz com que qualquer ficheiro dentro de `public/` fique acessível pelo browser. Por exemplo, `public/lojas.html` fica disponível em `http://localhost:3001/lojas.html`.

---

## 🛤️ Criar URLs limpas com `res.sendFile()`

Em vez de o utilizador aceder a `/lojas.html`, queremos URLs mais bonitas como `/lojas`. Para isso usamos `res.sendFile()`:

```javascript
// No index.js

app.get('/admin', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'admin.html'));
});

app.get('/lojas', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'lojas.html'));
});

app.get('/pizzas', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'pizzas.html'));
});
```

**Resultado:**
- `http://localhost:3001/lojas` → serve `lojas.html`
- `http://localhost:3001/pizzas` → serve `pizzas.html`
- `http://localhost:3001/admin` → serve `admin.html`

---

## 📄 Exemplo: `lojas.html`

Esta é a página mais simples do projeto. Mostra uma lista de lojas usando dados da nossa API:

```html
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Padre Gino's 🍕 — Lojas</title>
</head>
<body>
    <h1>� Lojas</h1>
    <ul id="stores-list">
        <li>A carregar...</li>
    </ul>

    <script>
        async function loadStores() {
            try {
                const res = await fetch('/api/stores');
                const stores = await res.json();

                document.getElementById('stores-list').innerHTML = stores
                    .map(store => `<li><strong>${store.nome}</strong> — ${store.morada}</li>`)
                    .join('');
            } catch (err) {
                document.getElementById('stores-list').innerHTML = '<li>Erro ao carregar lojas</li>';
            }
        }

        loadStores();
    </script>
</body>
</html>
```

### O que está a acontecer:

1. O HTML tem uma lista `<ul>` com o texto "A carregar..."
2. O `<script>` faz um `fetch('/api/stores')` — chama a nossa API
3. Recebe os dados em JSON e transforma cada loja num `<li>`
4. Atualiza o HTML da lista com `innerHTML`

> **Nota:** Usamos `/api/stores` (URL relativo) porque a página HTML e a API estão no **mesmo servidor**. Não precisamos escrever `http://localhost:3001/api/stores`.

---

## � Exemplo: `pizzas.html`

A mesma lógica, mas para pizzas:

```html
<h1>🍕 Pizzas</h1>
<ul id="pizzas-list">
    <li>A carregar...</li>
</ul>

<script>
    async function loadPizzas() {
        try {
            const res = await fetch('/api/pizzas');
            const pizzas = await res.json();

            document.getElementById('pizzas-list').innerHTML = pizzas
                .map(pizza => `<li><strong>${pizza.nome}</strong> — ${pizza.descricao} (€${pizza.preco.toFixed(2)})</li>`)
                .join('');
        } catch (err) {
            document.getElementById('pizzas-list').innerHTML = '<li>Erro ao carregar pizzas</li>';
        }
    }

    loadPizzas();
</script>
```

O padrão é sempre o mesmo:
1. **`fetch()`** — pedir dados à API
2. **`.json()`** — converter a resposta para objeto JavaScript
3. **`.map()`** — transformar cada item em HTML
4. **`innerHTML`** — colocar o HTML na página

---

## � Exemplo: `admin.html`

O `admin.html` é mais complexo mas segue a mesma lógica. Além de **ler** encomendas, também pode **atualizar** o status:

```javascript
// Ler encomendas (GET)
const res = await fetch('/api/orders');
const orders = await res.json();

// Atualizar status (PATCH)
await fetch(`/api/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'em preparação' }),
});
```

A diferença é que usa `method: 'PATCH'` para enviar dados de volta à API, em vez de só ler.

---

## 🆚 JSON vs HTML — Quando usar cada um?

| Rota | Resposta | Para quem? |
|------|----------|------------|
| `/api/pizzas` | JSON | Para o frontend React consumir |
| `/pizzas` | HTML | Para ver diretamente no browser |
| `/api/orders` | JSON | Para o frontend React consumir |
| `/admin` | HTML | Para o administrador gerir encomendas |

O Express pode devolver **ambos** — basta usar o método certo:

```javascript
// Devolver JSON
res.json({ nome: 'Margherita' });

// Devolver um ficheiro HTML
res.sendFile(join(__dirname, 'public', 'lojas.html'));
```

---

## 📚 Resumo

| Conceito | O que faz |
|----------|-----------|
| `express.static('public')` | Serve todos os ficheiros da pasta `public/` |
| `res.sendFile()` | Serve um ficheiro HTML numa rota específica |
| `fetch('/api/...')` | Dentro do HTML, chama a API do mesmo servidor |
| `innerHTML` | Atualiza o conteúdo da página com dados da API |

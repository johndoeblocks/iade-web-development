# 📋 Notas de Aula — Backend Web Development (3h)

> Guia de condução para uma aula de 3 horas cobrindo Node.js, Express, JavaScript assíncrono, filesystem JSON e servir HTML.
> Cada bloco indica o **tempo previsto**, os **tópicos** e **exemplos do mundo real** para usar.

---

## ⏱️ Visão Geral do Tempo

| Bloco | Duração | Tópicos | Docs |
|-------|---------|---------|------|
| 1 | 0:00 – 0:25 | Node.js + npm | 01, 02 |
| 2 | 0:25 – 0:55 | Express + Rotas HTTP | 03, 04 |
| 3 | 0:55 – 1:10 | Try/Catch em Express | 05 |
| ☕ | 1:10 – 1:20 | **Intervalo** | — |
| 4 | 1:20 – 1:50 | Async/Await | 06 |
| 5 | 1:50 – 2:25 | Filesystem + JSON como DB | 07 |
| 6 | 2:25 – 2:50 | Servir HTML pelo Express | 08 |
| 7 | 2:50 – 3:00 | Wrap-up + Q&A | — |

---

## 🟢 Bloco 1 — Node.js e npm (25 min)

### O que dizer (0:00 – 0:10) — Node.js Intro

- **Abrir com a pergunta**: "Todos já usaram JavaScript no browser. E se pudéssemos correr JS no servidor?"
- Mostrar que Node.js é um **runtime** — não é uma linguagem nova
- É **single-threaded** mas **não-bloqueante** (event loop)
- Mencionar empresas: **Netflix** migrou de Java para Node e reduziu o startup time de 40 min para 1 min. **LinkedIn** reduziu servidores de 30 para 3 ao migrar de Ruby para Node.

#### 🌍 Exemplo do mundo real
> Quando abres o Instagram e vês o feed a carregar, o servidor que responde com os posts pode ser Node.js. É single-threaded mas não-bloqueante — como um empregado de restaurante que tira o pedido e vai à mesa seguinte sem esperar que a cozinha termine.

#### Demo ao vivo
```bash
node --version
```
```javascript
// hello.js
console.log('Olá, Node.js! 🍕');
console.log('Versão:', process.version);
console.log('Plataforma:', process.platform);
```

#### Mencionar módulos nativos
```javascript
import { readFile, writeFile } from 'fs/promises';  // Ficheiros
import { join, dirname } from 'path';                // Paths
import http from 'http';                              // HTTP
```

#### Servidor HTTP básico (mostrar brevemente)
```javascript
import http from 'http';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Olá da Padre Gino\'s! 🍕');
});

server.listen(3000, () => console.log('Servidor em http://localhost:3000'));
```
> 💡 "Isto funciona, mas é verboso. Já vamos ver como o Express simplifica tudo."

### O que dizer (0:10 – 0:25) — npm

- npm = "app store" para programadores JavaScript
- **package.json** é o bilhete de identidade do projeto
- Explicar `dependencies` vs `devDependencies` — "express precisa estar em produção, nodemon só em dev"
- `"type": "module"` — para usar `import/export` em vez de `require`
- Semver: `^4.18.2` — o `^` significa "aceito updates menores"

#### 🌍 Exemplo do mundo real
> O npm tem +2 milhões de pacotes. Quando instalas `express`, ele traz consigo ~30 sub-dependências. O `package-lock.json` garante que toda a equipa tem as mesmas versões — imaginem o caos se cada programador tivesse versões diferentes.

#### Demo ao vivo
```bash
npm init -y
npm install express cors
npm install --save-dev nodemon
```
- Mostrar o `node_modules/` — "nunca fazemos commit disto"
- Mostrar `.gitignore` com `node_modules/`
- Mostrar os scripts no `package.json`:
```json
{
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  }
}
```
- `npm run dev` → nodemon reinicia o servidor automaticamente quando há alterações

---

## 🟡 Bloco 2 — Express.js e Rotas HTTP (30 min)

### O que dizer (0:25 – 0:40) — Express Intro

- Comparar um servidor HTTP nativo vs Express — "12 linhas passam a 4"
- **Middleware** = como uma linha de montagem numa fábrica
  - O pedido passa por cada middleware em ordem
  - Cada um pode modificar, validar, ou bloquear

#### 🌍 Exemplo do mundo real
> Pensem no middleware como a segurança de um aeroporto: passas pelo check-in (cors), depois pelo raio-x (express.json para ler o body), depois pelo controlo de passaporte (autenticação), e só depois chegas ao portão (a tua rota). Cada passo pode rejeitar-te ou deixar-te passar com `next()`.

#### Demo ao vivo
```javascript
import express from 'express';
import cors from 'cors';

const app = express();

// Middleware (executam em ORDEM)
app.use(cors());           // 1. Permite cross-origin
app.use(express.json());   // 2. Para ler JSON no body

// Middleware de logging — mostra cada pedido
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à API! 🍕' });
});

app.listen(3001, () => console.log('Servidor na porta 3001'));
```

#### Explicar Request e Response
```javascript
app.get('/pizzas/:id', (req, res) => {
  req.params.id      // Parâmetros da URL (:id)
  req.query.sort     // Query string (?sort=name)
  req.body           // Body do POST/PATCH
  req.method         // 'GET', 'POST', etc.

  res.json({...})             // Enviar JSON
  res.status(201).json({...}) // Com status code
  res.status(404).json({...}) // Não encontrado
});
```

### O que dizer (0:40 – 0:55) — Rotas e Métodos HTTP

- REST = forma padronizada de organizar APIs
- Tabela dos métodos: GET, POST, PUT, PATCH, DELETE

#### 🌍 Exemplo do mundo real
> Quando vocês fazem uma encomenda no Uber Eats:
> - **GET** `/restaurantes` → vê a lista de restaurantes
> - **GET** `/restaurantes/5/menu` → vê o menu de um restaurante
> - **POST** `/encomendas` → cria uma nova encomenda (envia dados no body)
> - **PATCH** `/encomendas/123` → atualiza o status (ex: "em preparação" → "a caminho")
> - **DELETE** `/encomendas/123` → cancela a encomenda

#### Demo ao vivo — Express Router
```javascript
// routes/pizzas.js — organização em ficheiro separado
import express from 'express';
const router = express.Router();

// GET /api/pizzas
router.get('/', (req, res) => { /* listar */ });

// GET /api/pizzas/:id
router.get('/:id', (req, res) => {
  const pizza = pizzas.find(p => p.id === parseInt(req.params.id));
  if (!pizza) return res.status(404).json({ error: 'Não encontrada' });
  res.json(pizza);
});

// POST /api/pizzas
router.post('/', (req, res) => {
  const { nome, preco } = req.body;
  if (!nome || !preco) return res.status(400).json({ error: 'Dados inválidos' });
  // criar...
  res.status(201).json(nova);
});

export default router;
```

```javascript
// index.js — registar rotas
import pizzasRouter from './routes/pizzas.js';
import storesRouter from './routes/stores.js';

app.use('/api/pizzas', pizzasRouter);
app.use('/api/stores', storesRouter);
```

**Testar com curl:**
```bash
curl http://localhost:3001/api/pizzas
curl http://localhost:3001/api/pizzas/1
curl -X POST http://localhost:3001/api/pizzas \
  -H "Content-Type: application/json" \
  -d '{"nome":"Nova Pizza","preco":12}'
```

---

## 🔴 Bloco 3 — Try/Catch e Error Handling (15 min)

### O que dizer (0:55 – 1:10)

- "O que acontece quando algo corre mal? E se o ficheiro não existe? E se o JSON está corrompido?"
- 3 tipos de erros: **Sintaxe** (apanhados antes de correr), **Runtime** (acontecem durante), **Lógicos** (código funciona mas resultado errado)
- try/catch é como uma "rede de segurança"
- Em Express: **cada rota async precisa de try/catch**, senão o servidor crasha

#### 🌍 Exemplo do mundo real
> Quando transferes dinheiro no MB Way e a internet cai a meio: o banco tem error handling para garantir que o dinheiro não desaparece. Sem try/catch no nosso servidor, um simples JSON.parse de dados corrompidos pode derrubar a API toda — e os clientes ficam sem pizza! 🍕💥

#### Demo ao vivo
```javascript
// Sem try/catch — servidor crasha!
router.get('/:id', async (req, res) => {
  const data = await readFile('ficheiro-que-nao-existe.json');
  res.json(data); // Nunca chega aqui → crash → 500
});

// Com try/catch — servidor sobrevive
router.get('/:id', async (req, res) => {
  try {
    const data = await readFile('ficheiro-que-nao-existe.json');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Erro:', error.message);
    res.status(500).json({ error: 'Erro interno' });
  }
});
```

#### Error handler global (no final do index.js)
```javascript
// 404 — rota não encontrada
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado' });
});

// Error handler — erros gerais
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Erro interno do servidor' });
});
```

#### Dica de produção
```javascript
// Nunca expor stack traces ao utilizador
res.status(500).json({ error: 'Erro interno' }); // ✅
res.status(500).json({ error: err.stack });       // ❌ Nunca!
```

---

## ☕ Intervalo (10 min) — 1:10 – 1:20

---

## 🔵 Bloco 4 — Async/Await (30 min)

### O que dizer (1:20 – 1:35) — Promises e Async/Await

- **Conceito**: JavaScript é assíncrono — operações como ler ficheiros ou fazer HTTP requests não bloqueiam
- Promise = "promessa de resultado futuro" — 3 estados: **pending**, **fulfilled**, **rejected**
- **Async/Await** = syntax sugar sobre Promises — "escreve assíncrono como se fosse síncrono"
- `async` marca a função, `await` pausa até resolver

#### 🌍 Exemplo do mundo real
> Comprar algo online com async/await:
> ```
> const carrinho = await adicionarAoCarrinho(pizza);
> const pagamento = await processarPagamento(carrinho);
> const confirmacao = await enviarEmail(pagamento);
> ```
> Cada passo espera pelo anterior, mas o código lê-se como uma receita!

#### Demo: Evolução de Promises para Async/Await
```javascript
// Com Promises — funcional mas verboso
fetch('/api/pizzas')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));

// Com Async/Await — limpo!
async function getPizzas() {
  try {
    const response = await fetch('/api/pizzas');
    const data = await response.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
```

### O que dizer (1:35 – 1:50) — Paralelo e uso em Express

#### Promise.all — carregar dados em paralelo
```javascript
// Sequencial (lento) — espera um acabar antes de começar o outro
const pizzas = await getPizzas();     // 200ms
const stores = await getStores();     // 200ms
// Total: ~400ms

// Paralelo (rápido) — todos ao mesmo tempo!
const [pizzas, stores] = await Promise.all([
  getPizzas(),    // 200ms ─┐
  getStores(),    // 200ms ─┤ ao mesmo tempo
]);
// Total: ~200ms
```

#### Async/Await em Express
```javascript
router.get('/', async (req, res) => {
  try {
    const pizzas = await getPizzas();
    res.json(pizzas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

#### Erros comuns
```javascript
// ❌ Esqueceu o await — retorna Promise, não o valor!
const data = fetch('/api/pizzas');

// ✅ Com await — retorna o valor
const data = await fetch('/api/pizzas');

// ❌ await fora de função async
const data = await fetch('/api');

// ✅ Dentro de função async
async function getData() {
  const data = await fetch('/api');
}
```

---

## 🟣 Bloco 5 — Filesystem + JSON como DB (35 min)

### O que dizer (1:50 – 2:00) — Introdução

- "Agora que sabemos async/await, vamos usá-lo para ler/escrever dados"
- `fs/promises` — módulo nativo para ficheiros
- JSON como base de dados: **bom para aprender, mau para produção**

#### 🌍 Exemplo do mundo real
> Muitos protótipos e MVPs começam com JSON ficheiros — a primeira versão do Twitter guardava dados de forma simples. Mas quando tens 1000 utilizadores a fazer pedidos ao mesmo tempo, dois pedidos podem escrever no ficheiro ao mesmo tempo e corrompem-se mutuamente. É como ter um caderno de encomendas com só uma caneta para 10 empregados.

### O que dizer (2:00 – 2:15) — Ler e Escrever Ficheiros

#### Demo ao vivo — Ler e escrever
```javascript
import { readFile, writeFile } from 'fs/promises';

// LER ficheiro JSON
async function getPizzas() {
  const data = await readFile('src/data/pizzas.json', 'utf-8');
  return JSON.parse(data);
}

// ESCREVER ficheiro JSON
async function savePizzas(pizzas) {
  const data = JSON.stringify(pizzas, null, 2);  // Pretty print com 2 espaços
  await writeFile('src/data/pizzas.json', data);
}
```

### O que dizer (2:15 – 2:25) — CRUD completo e rotas

#### Demo — CRUD completo
```javascript
// CREATE — criar nova pizza
async function createPizza(pizzaData) {
  const pizzas = await getPizzas();
  const newPizza = {
    id: Math.max(...pizzas.map(p => p.id)) + 1,  // Gerar ID
    ...pizzaData
  };
  pizzas.push(newPizza);
  await savePizzas(pizzas);
  return newPizza;
}

// UPDATE — atualizar pizza
async function updatePizza(id, updates) {
  const pizzas = await getPizzas();
  const index = pizzas.findIndex(p => p.id === id);
  if (index === -1) return null;
  pizzas[index] = { ...pizzas[index], ...updates };
  await savePizzas(pizzas);
  return pizzas[index];
}

// DELETE — apagar pizza
async function deletePizza(id) {
  const pizzas = await getPizzas();
  const filtered = pizzas.filter(p => p.id !== id);
  if (filtered.length === pizzas.length) return false;
  await savePizzas(filtered);
  return true;
}
```

#### Mostrar as rotas reais do projeto
- Abrir `src/routes/pizzas.js`, `stores.js`, `orders.js`

```javascript
// routes/pizzas.js
router.get('/', async (req, res) => {
  try {
    const pizzas = await getPizzas();
    res.json(pizzas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao carregar pizzas' });
  }
});

router.post('/', async (req, res) => {
  try {
    const pizza = await createPizza(req.body);
    res.status(201).json(pizza);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar pizza' });
  }
});
```

- Demonstrar com curl
- **Perguntar à turma**: "Que problemas vêem nesta abordagem?"

#### Limitações (quadro/slide)
| ✅ Bom para | ❌ Mau para |
|-------------|-------------|
| Protótipos | Produção |
| Aprender | Dados sensíveis |
| Poucos dados | Acessos concorrentes |
| 1 utilizador | Muitos utilizadores |

---

## 🟠 Bloco 6 — Servir HTML pelo Express (25 min)

### O que dizer (2:25 – 2:35) — Static files e sendFile

- "Até agora o backend só devolve JSON. Mas o Express também pode servir **páginas HTML**."
- `express.static('public')` — serve todos os ficheiros da pasta `public/` automaticamente
- `res.sendFile()` — serve um ficheiro HTML numa rota específica (URL limpa)

#### Estrutura do projeto
```
src/
├── index.js
├── public/          ← Pasta dos ficheiros estáticos
│   ├── admin.html   ← Painel de administração
│   ├── lojas.html   ← Lista de lojas
│   └── pizzas.html  ← Lista de pizzas
└── routes/
```

#### Demo ao vivo — Setup no index.js
```javascript
// Serve tudo o que está na pasta 'public'
app.use(express.static(join(__dirname, 'public')));

// Rotas com URLs limpas
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

> **Resultado:** `/lojas` serve `lojas.html`, `/pizzas` serve `pizzas.html`, `/admin` serve `admin.html`

### O que dizer (2:35 – 2:50) — Fetch dentro do HTML

- As páginas HTML usam `fetch()` para pedir dados à API **do mesmo servidor**
- Como estão no mesmo servidor, usamos URLs relativos: `/api/stores` em vez de `http://localhost:3001/api/stores`

#### Demo — lojas.html (o exemplo mais simples)
```html
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <title>Padre Gino's — Lojas</title>
</head>
<body>
    <h1>📍 Lojas</h1>
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
                document.getElementById('stores-list').innerHTML = '<li>Erro ao carregar</li>';
            }
        }
        loadStores();
    </script>
</body>
</html>
```

#### Explicar o padrão (sempre o mesmo!)
1. **`fetch('/api/...')`** — pedir dados à API
2. **`.json()`** — converter a resposta para objeto JavaScript
3. **`.map()`** — transformar cada item em HTML
4. **`innerHTML`** — colocar o HTML na página

#### Admin vai mais longe — também escreve dados
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

#### JSON vs HTML — quando usar cada um?
| Rota | Resposta | Para quem? |
|------|----------|------------|
| `/api/pizzas` | JSON | Para o frontend React consumir |
| `/pizzas` | HTML | Para ver diretamente no browser |
| `/api/orders` | JSON | Para o frontend React consumir |
| `/admin` | HTML | Para o administrador gerir encomendas |

---

## 🏁 Bloco 7 — Wrap-up e Q&A (10 min)

### Resumo visual (2:50 – 2:55)

```
🧱 Fundação     │  Node.js + npm
🚀 Framework    │  Express + Middleware + Rotas
🛡️ Segurança   │  Try/Catch + Error Handling
⚡ Assíncrono   │  Promises → Async/Await
📁 Dados        │  Filesystem + JSON (protótipo)
🌐 HTML         │  Servir páginas pelo Express (lojas, pizzas, admin)
```

### Perguntas guia para Q&A (2:55 – 3:00)
1. "Qual foi a parte mais difícil de entender?"
2. "Porque é que async/await é melhor que callbacks?"
3. "Que problemas tem o JSON como base de dados?"
4. "Quando usariam HTML servido pelo Express vs React?"

### Próximos passos para os alunos
- Testar todas as rotas com curl ou browser
- Visitar `/lojas`, `/pizzas` e `/admin` no browser
- Adicionar novas features à API (ex: filtrar pizzas por categoria)
- Melhorar as páginas HTML com mais CSS

---

## 🎯 Dicas de Apresentação

1. **Escrever código ao vivo** — errar propositadamente e corrigir mostra o processo real
2. **Perguntar à turma** antes de mostrar cada conceito — "o que acham que acontece se…?"
3. **Usar o terminal** — correr curl para testar cada endpoint em tempo real
4. **Manter o browser** aberto para mostrar as páginas HTML (lojas, pizzas, admin)
5. **Usar analogias da pizzaria** consistentemente — os alunos vão associar conceitos à Padre Gino's

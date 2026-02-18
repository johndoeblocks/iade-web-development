# 📋 Notas de Aula — Backend Web Development (3h)

> Guia de condução para uma aula de 3 horas cobrindo Node.js, Express, JavaScript assíncrono e Prisma.
> Cada bloco indica o **tempo previsto**, os **tópicos** e **exemplos do mundo real** para usar.

---

## ⏱️ Visão Geral do Tempo

| Bloco | Duração | Tópicos | Docs |
|-------|---------|---------|------|
| 1 | 0:00 – 0:25 | Node.js + npm | 01, 02 |
| 2 | 0:25 – 0:55 | Express + Rotas HTTP | 03, 04 |
| 3 | 0:55 – 1:10 | Try/Catch em Express | 05 |
| ☕ | 1:10 – 1:20 | **Intervalo** | — |
| 4 | 1:20 – 1:50 | Callbacks → Promises → Async/Await | 06, 07, 08 |
| 5 | 1:50 – 2:15 | Filesystem + JSON como DB | 09 |
| 6 | 2:15 – 2:50 | Prisma + PostgreSQL | 10 |
| 7 | 2:50 – 3:00 | Wrap-up + Q&A | — |

---

## 🟢 Bloco 1 — Node.js e npm (25 min)

### O que dizer (0:00 – 0:10) — Node.js Intro

- **Abrir com a pergunta**: "Todos já usaram JavaScript no browser. E se pudéssemos correr JS no servidor?"
- Mostrar que Node.js é um **runtime** — não é uma linguagem nova
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

### O que dizer (0:10 – 0:25) — npm

- npm = "app store" para programadores JavaScript
- **package.json** é o bilhete de identidade do projeto
- Explicar `dependencies` vs `devDependencies` — "express precisa estar em produção, nodemon só em dev"
- Semver: `^4.18.2` — o `^` significa "aceito updates menores"

#### 🌍 Exemplo do mundo real
> O npm tem +2 milhões de pacotes. Quando instalas `express`, ele traz consigo ~30 sub-dependências. O `package-lock.json` garante que toda a equipa tem as mesmas versões — imaginem o caos se cada programador tivesse versões diferentes.

#### Demo ao vivo
```bash
npm init -y
npm install express
npm install --save-dev nodemon
```
- Mostrar o `node_modules/` — "nunca fazemos commit disto"
- Mostrar `.gitignore` com `node_modules/`

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
const app = express();

// Middleware de logging — mostra cada pedido
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use(express.json()); // Para ler JSON no body

app.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à API! 🍕' });
});

app.listen(3001, () => console.log('Servidor na porta 3001'));
```

### O que dizer (0:40 – 0:55) — Rotas e Métodos HTTP

- REST = forma padronizada de organizar APIs
- Tabela dos métodos: GET, POST, PUT, PATCH, DELETE
- `req.params` vs `req.query` vs `req.body` — "três sítios diferentes para enviar dados"

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

router.get('/', (req, res) => { /* listar */ });
router.get('/:id', (req, res) => { /* obter uma */ });
router.post('/', (req, res) => { /* criar */ });

export default router;

// index.js — registar
app.use('/api/pizzas', pizzasRouter);
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

- Mostrar **error handler global** no `index.js` — o último recurso

---

## ☕ Intervalo (10 min) — 1:10 – 1:20

---

## 🔵 Bloco 4 — Callbacks → Promises → Async/Await (30 min)

> **Narrativa**: Este bloco conta a **história da evolução** do JavaScript assíncrono. Mostrar a progressão de callback → promise → async/await no mesmo exemplo.

### O que dizer (1:20 – 1:28) — Callbacks

- Callback = "liga-me quando terminares"
- Node usa callbacks para tudo: ler ficheiros, fazer HTTP requests, etc.
- Padrão **error-first**: `callback(error, resultado)`
- Mostrar o **callback hell** — indentação infinita

#### 🌍 Exemplo do mundo real
> Pedir pizza por telefone com callbacks: "Liga para a pizzaria e quando atenderem, faz o pedido, e quando o pedido estiver pronto, diz ao estafeta para entregar, e quando entregar, avisa o cliente…" — cada passo depende do anterior e o código fica ilegível.

#### Demo: Callback Hell
```javascript
readFile('pizzas.json', 'utf-8', (err, pizzas) => {
  if (err) return console.error(err);
  readFile('stores.json', 'utf-8', (err, stores) => {
    if (err) return console.error(err);
    readFile('orders.json', 'utf-8', (err, orders) => {
      if (err) return console.error(err);
      // 🔺 Pirâmide da morte!
      console.log('Tudo carregado!');
    });
  });
});
```

### O que dizer (1:28 – 1:38) — Promises

- Promise = "promessa de resultado futuro"
- 3 estados: **pending**, **fulfilled**, **rejected**
- `.then()` para sucesso, `.catch()` para erro
- **Encadeamento** — cada `.then()` retorna nova Promise (permite "aplanar" o código)

#### 🌍 Exemplo do mundo real
> Uma Promise é como uma senha de atendimento numa loja: recebes a senha (Promise pending), podes fazer outras coisas enquanto esperas, e quando chamam o teu número ou a senha é fulfilled (recebes o produto) ou rejected (já não há stock).

#### Demo: Evolução de callback para Promise
```javascript
// O mesmo código, mas plano — sem pirâmide
import { readFile } from 'fs/promises'; // versão Promise!

readFile('pizzas.json', 'utf-8')
  .then(data => JSON.parse(data))
  .then(pizzas => console.log('Pizzas:', pizzas.length))
  .catch(err => console.error('Erro:', err));

// Promise.all — carregar tudo em paralelo!
Promise.all([
  readFile('pizzas.json', 'utf-8'),
  readFile('stores.json', 'utf-8'),
])
.then(([pizzasData, storesData]) => {
  console.log('Pizzas:', JSON.parse(pizzasData).length);
  console.log('Stores:', JSON.parse(storesData).length);
});
```

### O que dizer (1:38 – 1:50) — Async/Await

- **Syntax sugar** sobre Promises — "escreve assíncrono como se fosse síncrono"
- `async` marca a função, `await` pausa até resolver
- **try/catch funciona naturalmente** com async/await
- Erro comum: esquecer `await` — retorna Promise em vez do valor

#### 🌍 Exemplo do mundo real
> Comprar algo online com async/await:
> ```
> const carrinho = await adicionarAoCarrinho(pizza);
> const pagamento = await processarPagamento(carrinho);
> const confirmacao = await enviarEmail(pagamento);
> ```
> Cada passo espera pelo anterior, mas o código lê-se como uma receita!

#### Demo: O mesmo exemplo, agora em async/await
```javascript
async function carregarDados() {
  try {
    const pizzasData = await readFile('pizzas.json', 'utf-8');
    const storesData = await readFile('stores.json', 'utf-8');
    
    const pizzas = JSON.parse(pizzasData);
    const stores = JSON.parse(storesData);
    
    console.log('Pizzas:', pizzas.length);
    console.log('Lojas:', stores.length);
  } catch (error) {
    console.error('Erro:', error.message);
  }
}
```

**Mostrar a evolução lado a lado:**
```
Callback:     readFile(path, cb)        → indentação profunda, error-first
Promise:      readFile(path).then()     → plano, mas muitos .then()
Async/Await:  await readFile(path)      → limpo como código síncrono
```

---

## 🟣 Bloco 5 — Filesystem + JSON como DB (25 min)

### O que dizer (1:50 – 2:15)

- "Agora que sabemos async/await, vamos usá-lo para ler/escrever dados"
- `fs/promises` — módulo nativo para ficheiros
- JSON como base de dados: **bom para aprender, mau para produção**
- Implementar CRUD completo: Read, Create, Update, Delete

#### 🌍 Exemplo do mundo real
> Muitos protótipos e MVPs começam com JSON ficheiros — a primeira versão do Twitter guardava dados de forma simples. Mas quando tens 1000 utilizadores a fazer pedidos ao mesmo tempo, dois pedidos podem escrever no ficheiro ao mesmo tempo e corrompem-se mutuamente. É como ter um caderno de encomendas com só uma caneta para 10 empregados.

#### Demo ao vivo — CRUD de Pizzas com JSON
```javascript
import { readFile, writeFile } from 'fs/promises';

// READ
async function getPizzas() {
  const data = await readFile('data/pizzas.json', 'utf-8');
  return JSON.parse(data);
}

// CREATE
async function createPizza(pizzaData) {
  const pizzas = await getPizzas();
  const newPizza = { id: pizzas.length + 1, ...pizzaData };
  pizzas.push(newPizza);
  await writeFile('data/pizzas.json', JSON.stringify(pizzas, null, 2));
  return newPizza;
}
```

#### Mostrar as rotas reais do projeto
- Abrir `src/routes/pizzas.js`, `stores.js`, `orders.js`
- Demonstrar com curl
- **Perguntar à turma**: "Que problemas vêem nesta abordagem?"

#### Limitações (quadro/slide)
| ✅ Bom para | ❌ Mau para |
|-------------|-------------|
| Protótipos | Produção |
| Aprender | Dados sensíveis |
| Poucos dados | Acessos concorrentes |
| 1 utilizador | Muitos utilizadores |

> **Transição**: "Então como é que empresas reais guardam dados? Com bases de dados! E para não escrever SQL à mão, usamos um ORM."

---

## 🟠 Bloco 6 — Prisma + PostgreSQL (35 min)

### O que dizer (2:15 – 2:25) — O que é um ORM

- ORM = Object-Relational Mapping — "fala com a base de dados em JavaScript"
- Comparar SQL direto vs Prisma:
  ```
  SQL:    SELECT * FROM pizzas WHERE categoria = 'classicas'
  Prisma: prisma.pizza.findMany({ where: { categoria: 'classicas' } })
  ```
- Vantagens: type-safety, autocompletar, migrations automáticas

#### 🌍 Exemplo do mundo real
> O Prisma é usado por empresas como a **Mercedes-Benz**, **AT&T**, e **BBC**. Sem ORM, cada query SQL é uma string que pode ter erros de sintaxe que só descobres em runtime. Com Prisma, se escreveres `prisma.pizza.findManu()` o editor sublinha a vermelho — erros antes de correr!

### O que dizer (2:25 – 2:35) — Setup e Schema

#### Demo ao vivo
```bash
npm install prisma --save-dev
npm install @prisma/client
npx prisma init
```

- Mostrar o `schema.prisma` — "é como um contrato da base de dados"
- Explicar cada model: Pizza, Store, Order, OrderItem
- Mostrar **relações**: Order tem muitos OrderItem, OrderItem aponta para Pizza

```prisma
model Pizza {
  id          Int      @id @default(autoincrement())
  nome        String
  descricao   String?   // ? = opcional
  preco       Float
  categoria   String   @default("classicas")
  disponivel  Boolean  @default(true)
}
```

```bash
npx prisma migrate dev --name init
npx prisma studio  # Interface visual — WOW moment!
```

### O que dizer (2:35 – 2:50) — Queries e Rotas com Prisma

- Mostrar a **mesma API** mas agora com Prisma
- "Substituímos `readFile` + `JSON.parse` por `prisma.pizza.findMany()`"
- Nested creates para orders com items

#### Demo — Comparação lado a lado

```javascript
// ❌ ANTES — fs/JSON
async function getPizzas() {
  const data = await readFile('pizzas.json', 'utf-8');
  return JSON.parse(data);
}

// ✅ DEPOIS — Prisma  
async function getPizzas() {
  return await prisma.pizza.findMany();
}
```

```javascript
// Rota com Prisma — mais limpo!
router.get('/', async (req, res) => {
  try {
    const { categoria } = req.query;
    const pizzas = await prisma.pizza.findMany({
      where: categoria ? { categoria } : undefined,
    });
    res.json(pizzas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao carregar pizzas' });
  }
});
```

```javascript
// Criar encomenda com items (nested create — poder do Prisma!)
const order = await prisma.order.create({
  data: {
    nome: 'João',
    telefone: '912345678',
    morada: 'Rua das Flores 10',
    total: 17.00,
    items: {
      create: [
        { pizzaId: 1, quantidade: 2, precoUnit: 8.50 }
      ]
    }
  },
  include: { items: true }
});
```

**Testar com Prisma Studio** — mostrar dados a aparecer na interface.

---

## 🏁 Bloco 7 — Wrap-up e Q&A (10 min)

### Resumo visual (2:50 – 2:55)

```
🧱 Fundação     │  Node.js + npm
🚀 Framework    │  Express + Middleware + Rotas
🛡️ Segurança   │  Try/Catch + Error Handling
⚡ Assíncrono   │  Callbacks → Promises → Async/Await
📁 Dados v1     │  Filesystem + JSON (protótipo)
🗄️ Dados v2     │  Prisma + PostgreSQL (produção)
```

### Perguntas guia para Q&A (2:55 – 3:00)
1. "Qual foi a parte mais difícil de entender?"
2. "Porque é que async/await é melhor que callbacks?"
3. "Quando usariam JSON vs Prisma?"
4. "O que fariam diferente na API da Padre Gino's?"

### Próximos passos para os alunos
- Completar os exercícios dos docs 01-10
- Migrar as rotas do projeto de JSON para Prisma
- Experimentar `npx prisma studio`
- Adicionar PUT e DELETE às rotas

---

## 🎯 Dicas de Apresentação

1. **Escrever código ao vivo** — errar propositadamente e corrigir mostra o processo real
2. **Perguntar à turma** antes de mostrar cada conceito — "o que acham que acontece se…?"
3. **Usar o terminal** — correr curl para testar cada endpoint em tempo real
4. **Manter o browser** com a documentação do Express/Prisma aberta
5. **Usar analogias da pizzaria** consistentemente — os alunos vão associar conceitos à Padre Gino's

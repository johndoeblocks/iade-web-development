# 01 - Introdução ao Node.js

## 🎯 Objetivos
- Entender o que é Node.js
- Conhecer o event loop
- Executar código JavaScript no servidor

---

## 🤔 O Que é Node.js?

Node.js é um **runtime de JavaScript** que permite executar JS fora do browser.

```
Browser → JavaScript (frontend)
Node.js → JavaScript (backend/servidor)
```

### Porque usar Node.js?
- **Mesmo idioma** no frontend e backend
- **npm** - maior ecossistema de pacotes
- **Assíncrono** - eficiente para I/O
- **Empresas usam**: Netflix, LinkedIn, Uber, PayPal

---

## 🔄 Event Loop

Node.js é **single-threaded** mas **não-bloqueante**.

```javascript
// Código síncrono (bloqueante)
const resultado = lerFicheiroPesado(); // Espera aqui
console.log(resultado);

// Código assíncrono (não-bloqueante)
lerFicheiroPesado((resultado) => {
  console.log(resultado);
});
console.log('Continua executando!');
```

---

## 🛠️ Instalação

### Com NVM (recomendado)
```bash
# Instalar nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Instalar Node.js
nvm install 20
nvm use 20

# Verificar
node --version  # v20.x.x
npm --version   # v10.x.x
```

### Direto
[https://nodejs.org/](https://nodejs.org/) → LTS version

---

## 🏃 Primeiro Programa

```javascript
// hello.js
console.log('Olá, Node.js! 🍕');

// Informação do ambiente
console.log('Versão:', process.version);
console.log('Plataforma:', process.platform);
console.log('Diretório:', process.cwd());
```

```bash
node hello.js
```

---

## 📦 Módulos Nativos

Node.js vem com módulos built-in:

```javascript
// File System
import { readFile, writeFile } from 'fs/promises';

// Path
import { join, dirname } from 'path';

// HTTP
import http from 'http';

// OS
import os from 'os';
console.log('CPUs:', os.cpus().length);
console.log('Memória:', os.totalmem() / 1024 / 1024 / 1024, 'GB');
```

---

## 🌐 Servidor HTTP Básico

```javascript
// server.js
import http from 'http';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Olá da Padre Gino\'s! 🍕');
});

server.listen(3000, () => {
  console.log('Servidor em http://localhost:3000');
});
```

> 💡 Na prática usamos **Express** que simplifica muito isto!

---

## 🧪 Exercício

1. Cria um ficheiro `info.js` que mostra:
   - Versão do Node
   - Sistema operativo
   - Memória disponível
   - Diretório atual
2. Cria um servidor HTTP que responde com JSON

---

## 📚 Recursos
- [Node.js Docs](https://nodejs.org/docs/)
- [Node.js Event Loop](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)

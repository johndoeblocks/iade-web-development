
import os from 'os';
import http from 'http';

console.log('Olá, Node.js! 🍕');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Olá da Padre Gino\'s! 🍕' }));
});

server.listen(3000, () => {
  console.log('Servidor em http://localhost:3000');
});


console.log('CPUs:', os.cpus().length);
console.log('Memória:', os.totalmem() / 1024 / 1024 / 1024, 'GB');


// Informação do ambiente
console.log('Versão:', process.version);
console.log('Plataforma:', process.platform);
console.log('Diretório:', process.cwd());
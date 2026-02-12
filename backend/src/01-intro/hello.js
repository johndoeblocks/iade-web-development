import os from 'os';
import http from 'http';

console.log('Olá, Node.js! 🍕');

// Informação do ambiente
console.log('Versão:', process.version);
console.log('Plataforma:', process.platform);
console.log('Diretório:', process.cwd());

console.log('CPUs:', os.cpus().length);
console.log('Memória:', os.totalmem() / 1024 / 1024 / 1024, 'GB');



const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Ola da Padre Gino\'s! 🍕');
});

server.listen(3000, () => {
  console.log('Servidor em http://localhost:3000');
});
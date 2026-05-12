const http = require('http');

const data = JSON.stringify({
  email: 'admin@instagramagent.com',
  password: 'AdminSecurePassword123!'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log('--- TESTE DE LOGIN ---');
console.log('Enviando requisição para:', `http://${options.hostname}:${options.port}${options.path}`);

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Resposta do Servidor:');
    try {
        const json = JSON.parse(body);
        console.log(JSON.stringify(json, null, 2));
        if (json.token) {
            console.log('\n✅ SUCESSO: Login realizado com sucesso!');
            console.log('Token recebido!');
        } else {
            console.log('\n❌ FALHA: Token não recebido.');
        }
    } catch (e) {
        console.log(body);
    }
  });
});

req.on('error', (e) => {
  console.error(`Problema com a requisição: ${e.message}`);
});

req.write(data);
req.end();

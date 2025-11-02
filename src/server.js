const http = require('http'); //Подключаем модуль http
const port = 3000;
const server = http.createServer((req, res) => {
  res.end('Hello world!');
  console.log(req.method, req.url);
}).listen(3000); //Слушаем порт 3000
console.log('Сервер работает на порте ' + port); 

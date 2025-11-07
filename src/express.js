const { stringify } = require('csv-stringify/sync');
const express = require('express');
const app = express();
const port = 3000;

csv = require('csv-parser');
csv_stringify = require('csv-stringify');
fs = require('fs');
captchaArray = [];
fs.createReadStream('src/data/dataset.csv') //src/img/raw_base64_dataset.csv
  .pipe(csv())
  .on('data', (data) => {captchaArray.push(data);})
  .on('end', () => {console.log("Loaded Captcha!"/*captchaArray*/);});

app.use(express.static(__dirname + '/'));

app.use(express.json());

// app.get('/', (req, res) => {
//   //res.send('Hello World!');
//   res.send({'s':req});
//   res.sendFile(__dirname+'/index.html');
// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// app.get('/img/:imgName', (req, res) => {
//   const re_fg = /fg(\d+)\.png/;
//   const re_bg = /bg(\d+)\.png/;
//   if ((r = re_fg.exec(imgName)) !== null) {
//     captchaArray[r[1]]
//   }
//   res.sendFile(__dirname+'/img/'+imgName);
// });

app.get('/captcha/:Index', (req, res) => {
  let r = captchaArray[req.params["Index"]];
  r.mode = "use"
  if (!r.answer) {
    r.answer = "";
    r.mode = "dev";
  }
  res.send(r);
});

app.post('/captcha/:Index', (req, res) => {
  let index = req.params["Index"];
  let body = req.body;
  let data = `\n${index},${body.bg},${body.fg},${body.answer}`;
  fs.appendFileSync('src/data/dataset.csv', data);
  console.log("Appended successfully?");
  res.sendStatus(200);
})
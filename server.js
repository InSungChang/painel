const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Configuração do banco de dados
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Metro@21061975',
  database: 'contatodb'
});

// Conectar ao banco de dados
db.connect((err) => {
  if (err) throw err;
  console.log('Conectado ao banco de dados.');
});

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Rota para servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rota para servir o formulário HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para obter os dados do banco de dados
app.get('/api/data', (req, res) => {
  const sql = 'SELECT * FROM contato_web';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Iniciar o servidor
app.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000.');
});

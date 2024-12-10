// Carregando as variáveis de ambiente
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const RotaLogin = require('../Rotas/RotaLogin');
const RotaPublicacao = require('../Rotas/RotaPublicacao');
const RotaFiltrarTurma = require('../Rotas/RotaFIltrarTurma');
const routerPerfil = require('../Rotas/RotaPerfil');
const RotaLikes = require('../Rotas/RotaLikes');
const RotaComentarios = require('../Rotas/RotaComentarios');
const RotaBuscaUsuario = require('../Rotas/RotaBuscaUsuario');
const routerNotas = require('../Rotas/RotaNotas');
const RotaCardapio = require('../Rotas/RotaCardapio');
const RotaReclam = require ('../Rotas/RotaReclam');
const RotasTurmasAlunos = require('../Rotas/Rotatumasalunos');

const PORT = 3000;
const app = express();
app.use(cors());
app.use(express.json());

app.use(bodyParser.json({ limit: '50mb' }));  // Aumenta o limite para 10MB
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));  // Para formulários com arquivos maiores

// Adiciona as rotas
app.use('/', RotaLogin); 
app.use('/', RotaPublicacao); 
app.use('/', RotaFiltrarTurma);
app.use('/', routerPerfil);
app.use('/', RotaLikes);
app.use('/', RotaComentarios);
app.use('/', RotaBuscaUsuario);
app.use('/', routerNotas);
app.use('/', RotaCardapio);
app.use('/', RotaReclam);
app.use('/', RotasTurmasAlunos);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

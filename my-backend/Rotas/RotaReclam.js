const express = require('express');
const router = express.Router();
const db = require('../ConexaoBD/conexaoBD'); // Importa a conexão

router.post('/reclamacoes', (req, res) => {
  const { assunto, mensagem, Pessoa_idPessoa } = req.body;

  // Valida se todos os campos obrigatórios estão presentes
  if (!assunto || !mensagem || !Pessoa_idPessoa) {
    return res.status(400).json({ message: 'Por favor, preencha todos os campos.' });
  }

  // A query de inserção incluindo a chave estrangeira
  const query = 'INSERT INTO reclamacoes_sugestoes (assunto, mensagem, Pessoa_idPessoa) VALUES (?, ?, ?)';

  // Executa a query no banco de dados
  db.query(query, [assunto, mensagem, Pessoa_idPessoa], (err, results) => {
    if (err) {
      console.error('Erro ao inserir no banco de dados:', err);
      return res.status(500).json({ message: 'Erro ao enviar reclamação.' });
    }
    
    // Retorna o sucesso, incluindo o id da reclamação inserida
    res.status(200).json({ message: 'Reclamação enviada com sucesso!', id: results.insertId });
  });
});

module.exports = router;

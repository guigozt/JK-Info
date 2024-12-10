const express = require('express');
const router = express.Router();
const db = require('../ConexaoBD/conexaoBD');

// Rota GET para buscar todos os itens do cardápio
router.get('/getCardapio', (req, res) => {
    const sql = 'SELECT * FROM Cardapio';
    db.query(sql, (error, results) => {
      if (error) {
        console.error('Erro ao obter cardápio:', error);
        return res.status(500).json({ message: 'Erro ao obter cardápio' });
      }
      res.json(results);
    });
  });
  
  // Rota POST para adicionar um novo item ao cardápio
  router.post('/postCardapio', (req, res) => {
    const { diaSemana, prato1, prato2, prato3, prato4, sobremesa } = req.body;
    const sql = 'INSERT INTO Cardapio (diaSemana, prato1, prato2, prato3, prato4, sobremesa) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [diaSemana, prato1, prato2, prato3, prato4, sobremesa], (error, result) => {
      if (error) {
        console.error('Erro ao adicionar cardápio:', error);
        return res.status(500).json({ message: 'Erro ao adicionar cardápio' });
      }
      res.status(200).json({ id_dia: result.insertId, ...req.body });
    });
  });
  
  // Rota PUT para atualizar um item existente no cardápio
  router.put('/putCardapio', (req, res) => {
    const { id_dia, diaSemana, prato1, prato2, prato3, prato4, sobremesa } = req.body;
    const sql = 'UPDATE Cardapio SET diaSemana = ?, prato1 = ?, prato2 = ?, prato3 = ?, prato4 = ?, sobremesa = ? WHERE id_dia = ?';
    db.query(sql, [diaSemana, prato1, prato2, prato3, prato4, sobremesa, id_dia], (error, result) => {
      if (error) {
        console.error('Erro ao atualizar cardápio:', error);
        return res.status(500).json({ message: 'Erro ao atualizar cardápio' });
      }
      res.status(200).json({ message: 'Cardápio atualizado com sucesso' });
    });
  });
  
      
  
  module.exports = router;
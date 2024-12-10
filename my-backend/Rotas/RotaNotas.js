const express = require('express');
const routerNotas = express.Router();
const db = require('../ConexaoBD/conexaoBD');

routerNotas.get('/notas', (req, res)=>{
  const query = 'SELECT * FROM  notas';
  db.query(query, (err, results)=>{
   
    if(err){
      console.error('Erro ao Buscar Notas:', err);
      res.status(500).send({mensagem: 'Erro ao Buscar Notas'});
    }else{
      return res.json(results);
    }
  });
});

routerNotas.post('/notas', (req,res)=>{
  const {nota, turmaId} = req.body;
  const query = 'INSERT INTO notas (nota, Turma_idTurma) VALUES (?,?)';

  db.query(query, [nota, turmaId], (err,results) =>{
    if(err){
      console.error('Erro ao Criar nota:', err);
      res.status(500).send({mensagem: 'Erro ao criar nota'});
    }else{
      res.send({ idNota: results.insertId, nota, Turma_idTurma: turmaId});
    }
  });
});

routerNotas.put('/notas/:id', (req,res)=>{
  const {id} = req.params;
  const {nota, turmaId} = req.body;
  const query = 'UPDATE notas Set nota = ? WHERE idNota = ?';

  db.query(query, [nota, turmaId,id], (err, results)=> {
    if(err){
      console.error('Erro ao Editar nota:', err);
      res.status(500).send({mensagem: 'Erro ao criar nota'});
    }else{
      res.send({ idNota: parseInt(id), nota, Turma_idTurma: turmaId });
    }
  });
});

routerNotas.delete('/notas/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM notas WHERE idNota = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Erro ao excluir nota:', err);
      res.status(500).send({ mensagem: 'Erro ao excluir nota' });
    } else {
      res.send({ mensagem: 'Nota excluída com sucesso!' });
    }
  });
});

routerNotas.get('/turmas', (req, res) =>{
  const query = 'SELECT idTurma, nomeTurma FROM turma';
  db.query(query, (err,results)=> {
    if(err){
      console.error('Erro ao buscar Turmas', err)
      res.status(500).send({mensagem: 'Erro ao buscar Turmas'});
    }else{
      res.json(results);
    }
  })
})

module.exports = routerNotas;

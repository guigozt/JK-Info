const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const db = require('../ConexaoBD/conexaoBD'); // Importa a conexão
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET_KEY;
const authenticateToken = require('../Midlewware/midlewareToken')


// Rota para buscar todas as publicações com comentários
router.get('/getpublicacao', async (req, res) => {
    console.log('Rota GET /getpublicacao chamada');
  
    const query = `
      SELECT 
          p.idPublicacao,
          p.descricao AS publicacao_descricao,
          pes.nome AS nome_pessoa,
          c.nomeCargo AS cargo,
          p.dataPublicacao,
          COUNT(DISTINCT cur.idCurtidaPublicacao) AS quantidade_likes,
          COUNT(DISTINCT com.idComentario) AS quantidade_comentarios
      FROM 
          Publicacao p
      JOIN 
          Pessoa pes ON p.Pessoa_idPessoa = pes.idPessoa
      JOIN 
          Funcionario f ON pes.idPessoa = f.Pessoa_idPessoa
      JOIN 
          Cargo c ON f.Cargo_idCargo = c.idCargo
      LEFT JOIN 
          CurtidaPublicacao cur ON p.idPublicacao = cur.Publicacao_idPublicacao
      LEFT JOIN 
          Comentario com ON p.idPublicacao = com.Publicacao_idPublicacao
      GROUP BY 
          p.idPublicacao, pes.nome, c.nomeCargo, p.dataPublicacao
      ORDER BY 
          p.dataPublicacao DESC
      LIMIT 0, 1000;
    `;
  
    try {
      const [results] = await db.promise().query(query);
      console.log('Publicações buscadas com sucesso:', results.length);
      res.json({ success: true, data: results });
    } catch (error) {
      console.error('Erro ao buscar publicações:', error);
      res.status(500).json({ success: false, error: 'Erro ao buscar publicações.' });
    }
});   

// Rota para criar nova publicação
router.post(
  '/postpublicacao',
  authenticateToken, // Middleware para autenticar o token
  [
    body('descricao').notEmpty().withMessage('A descrição é obrigatória.'),
  ],
  async (req, res) => {
    const { descricao, imagem } = req.body;
    const Pessoa_idPessoa = req.userId; // Obtém o ID do usuário autenticado
    console.log('Criando publicação para o usuário:', Pessoa_idPessoa);

    try {
      const query = `
        INSERT INTO Publicacao (descricao, imagem, Pessoa_idPessoa)
        VALUES (?, ?, ?)
      `;
      const values = [descricao, imagem || null, Pessoa_idPessoa];

      db.query(query, values, (err, result) => {
        if (err) {
          console.error('Erro ao criar publicação:', err);
          return res.status(500).json({ success: false, message: 'Erro ao criar publicação.' });
        }

        res.status(201).json({
          success: true,
          message: 'Publicação criada com sucesso!',
          publicacaoId: result.insertId,
        });
      });
    } catch (error) {
      console.error('Erro no servidor:', error);
      res.status(500).json({ success: false, message: 'Erro no servidor.' });
    }
  }
);


// Rota DELETE para excluir uma publicação e seus dependentes (comentários e curtidas)
router.delete('/deletepublicacao/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const Pessoa_idPessoa = req.userId;  // ID da pessoa que está tentando excluir a publicação

  console.log(`Rota DELETE /deletepublicacao chamada para excluir a publicação com id: ${id} pelo usuário ${Pessoa_idPessoa}`);

  // Verificar se a publicação pertence ao usuário
  const checkOwnerQuery = 'SELECT * FROM Publicacao WHERE idPublicacao = ? AND Pessoa_idPessoa = ?';
  db.query(checkOwnerQuery, [id, Pessoa_idPessoa], (err, result) => {
    if (err) {
      console.error('Erro ao verificar o dono da publicação:', err);
      return res.status(500).json({ message: 'Erro ao verificar o dono da publicação.' });
    }

    if (result.length === 0) {
      console.log(`Publicação ${id} não pertence ao usuário ${Pessoa_idPessoa}.`);
      return res.status(403).json({ message: 'Você não tem permissão para excluir esta publicação.' });
    }

    console.log(`Publicação ${id} pertence ao usuário ${Pessoa_idPessoa}. Prosseguindo com a exclusão.`);

    // Excluir curtidas associadas à publicação
    const deleteLikesQuery = 'DELETE FROM CurtidaPublicacao WHERE Publicacao_idPublicacao = ?';
    db.query(deleteLikesQuery, [id], (err, result) => {
      if (err) {
        console.error('Erro ao excluir curtidas associadas à publicação:', err);
        return res.status(500).json({ message: 'Erro ao excluir curtidas.' });
      }
      console.log(`Curtidas associadas à publicação ${id} excluídas.`);

      // Excluir comentários associados à publicação
      const deleteCommentsQuery = 'DELETE FROM Comentario WHERE Publicacao_idPublicacao = ?';
      db.query(deleteCommentsQuery, [id], (err, result) => {
        if (err) {
          console.error('Erro ao excluir comentários associados à publicação:', err);
          return res.status(500).json({ message: 'Erro ao excluir comentários.' });
        }
        console.log(`Comentários associados à publicação ${id} excluídos.`);

        // Excluir a publicação
        const deletePostQuery = 'DELETE FROM Publicacao WHERE idPublicacao = ?';
        db.query(deletePostQuery, [id], (err, result) => {
          if (err) {
            console.error('Erro ao excluir a publicação:', err);
            return res.status(500).json({ message: 'Erro ao excluir a publicação.' });
          }

          console.log(`Resultado da exclusão da publicação ${id}:`, result);

          if (result.affectedRows > 0) {
            console.log(`Publicação ${id} excluída com sucesso.`);
            return res.status(200).json({ message: 'Publicação e dependências excluídas com sucesso.' });
          } else {
            console.log(`Publicação ${id} não encontrada.`);
            return res.status(404).json({ message: 'Publicação não encontrada.' });
          }
        });
      });
    });
  });
});


router.get('/getpublicacaousuario', authenticateToken, async (req, res) => {
  const Pessoa_idPessoa = req.userId; // Pegando o idPessoa da URL

  console.log(`Buscando publicações para o usuário com ID: ${Pessoa_idPessoa}`);

  const query = `
    SELECT 
          p.idPublicacao,
          p.descricao AS publicacao_descricao,
          pes.nome AS nome_pessoa,
          c.nomeCargo AS cargo,
          p.dataPublicacao,
          COUNT(DISTINCT cur.idCurtidaPublicacao) AS quantidade_likes,
          COUNT(DISTINCT com.idComentario) AS quantidade_comentarios
      FROM 
          Publicacao p
      JOIN 
          Pessoa pes ON p.Pessoa_idPessoa = pes.idPessoa
      JOIN 
          Funcionario f ON pes.idPessoa = f.Pessoa_idPessoa
      JOIN 
          Cargo c ON f.Cargo_idCargo = c.idCargo
      LEFT JOIN 
          CurtidaPublicacao cur ON p.idPublicacao = cur.Publicacao_idPublicacao
      LEFT JOIN 
          Comentario com ON p.idPublicacao = com.Publicacao_idPublicacao
      WHERE
          pes.idPessoa = ?  -- Usando parâmetro dinâmico
      GROUP BY 
          p.idPublicacao, pes.nome, c.nomeCargo, p.dataPublicacao
      ORDER BY 
          p.dataPublicacao DESC
      LIMIT 0, 1000;
  `;

  try {
    const [results] = await db.promise().query(query, [Pessoa_idPessoa]);

    console.log(`Consultados ${results.length} resultados`); // Log de quantidade de resultados encontrados

    res.json({ success: true, data: results });
  } catch (error) {
    console.error('Erro ao buscar publicações:', error); // Log do erro
    res.status(500).json({ success: false, error: 'Erro ao buscar publicações.' });
  }
});


module.exports = router;

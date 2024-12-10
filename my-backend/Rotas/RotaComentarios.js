const express = require('express');
const router = express.Router();
const db = require('../ConexaoBD/conexaoBD'); // Importa a conexão
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET_KEY;
const authenticateToken = require('../Midlewware/midlewareToken');



// Rota para adicionar comentário
router.post('/postcomentario', authenticateToken, (req, res) => {
    const { text, Publicacao_idPublicacao } = req.body; // Pessoa_id será obtido do token
    
    if (!text || !Publicacao_idPublicacao) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
        const userId = req.userId; // Obtém o userId do token JWT

        const query = 'INSERT INTO Comentario (texto, Publicacao_idPublicacao, Pessoa_idPessoa) VALUES (?, ?, ?)';
        db.query(query, [text, Publicacao_idPublicacao, userId], (err, result) => {
            if (err) {
                console.error('Erro ao adicionar comentário:', err);
                return res.status(500).json({ error: 'Erro ao adicionar comentário.' });
            }

            res.status(201).json({ message: 'Comentário adicionado com sucesso!' });
        });
    } catch (error) {
        console.error('Erro ao adicionar comentário:', error.message);
        if (error.message === 'Token não fornecido.') {
            return res.status(401).json({ error: 'Token não fornecido.' });
        } else if (error.message === 'Token inválido.') {
            return res.status(403).json({ error: 'Token inválido.' });
        }
        return res.status(500).json({ error: 'Erro ao adicionar comentário.' });
    }
});


// Rota para obter comentários de uma publicação específica
router.get('/getcomentarios/:idPublicacao', (req, res) => {
    const idPublicacao = req.params.idPublicacao; // ID dinâmico da publicação
    console.log(`Rota GET /getcomentarios chamada para a publicação com ID ${idPublicacao}`);

    const query = `
        SELECT 
            c.idComentario,
            c.texto,
            pes.idPessoa AS id_comentador,  -- Adiciona o ID da pessoa que comentou
            pes.nome AS nome_comentador,
            COUNT(cc.idCurtidaComentario) AS num_likes
        FROM 
            Comentario c
        JOIN 
            Pessoa pes ON c.Pessoa_idPessoa = pes.idPessoa
        LEFT JOIN 
            CurtidaComentario cc ON c.idComentario = cc.Comentario_idComentario
        WHERE 
            c.Publicacao_idPublicacao = ?
        GROUP BY 
            c.idComentario, pes.idPessoa, pes.nome  -- Inclui idPessoa no GROUP BY
        ORDER BY 
            c.idComentario;
    `;

    // Usando callback para fazer a query
    db.query(query, [idPublicacao], (err, rows) => {
        if (err) {
            console.error('Erro ao buscar comentários:', err);
            return res.status(500).json({ message: 'Erro ao buscar comentários.' });
        }
    
        console.log('Dados retornados da query:', rows); // Adicione este log para ver o que está vindo
    
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Nenhum comentário encontrado para essa publicação.' });
        }
    
        res.json(rows);
    });
});

// Rota para curtir ou descurtir comentário
router.post('/likecomentario', authenticateToken, (req, res) => {
    const { idComentario, liked } = req.body;

    console.log(`Rota /likecomentario chamada com idComentario: ${idComentario} e liked: ${liked}`);

    if (!idComentario) {
        return res.status(400).json({ message: 'idComentario é obrigatório.' });
    }

    const userId = req.userId; // Obtém o userId do token JWT

    // Lógica para adicionar ou remover a curtida no comentário
    if (liked) {
        // Verifica se o usuário já curtiu o comentário
        const checkLikeQuery = 'SELECT * FROM CurtidaComentario WHERE Comentario_idComentario = ? AND Pessoa_idPessoa = ?';
        db.query(checkLikeQuery, [idComentario, userId], (err, results) => {
            if (err) {
                console.error('Erro ao verificar like no comentário:', err);
                return res.status(500).json({ message: 'Erro ao verificar like no comentário.' });
            }

            if (results.length === 0) {
                // Se não existir, insere o like
                const insertLikeQuery = 'INSERT INTO CurtidaComentario (Comentario_idComentario, Pessoa_idPessoa) VALUES (?, ?)';
                db.query(insertLikeQuery, [idComentario, userId], (err) => {
                    if (err) {
                        console.error('Erro ao inserir like no comentário:', err);
                        return res.status(500).json({ message: 'Erro ao inserir like no comentário.' });
                    }
                    // Retorna a nova contagem de likes no comentário
                    getCommentLikeCount(idComentario, res);
                });
            } else {
                // Curtida já existe, retorna contagem atual
                getCommentLikeCount(idComentario, res);
            }
        });
    } else {
        // Remove o like se já existir
        const deleteLikeQuery = 'DELETE FROM CurtidaComentario WHERE Comentario_idComentario = ? AND Pessoa_idPessoa = ?';
        db.query(deleteLikeQuery, [idComentario, userId], (err) => {
            if (err) {
                console.error('Erro ao remover like no comentário:', err);
                return res.status(500).json({ message: 'Erro ao remover like no comentário.' });
            }
            // Retorna a nova contagem de likes no comentário
            getCommentLikeCount(idComentario, res);
        });
    }
});

// Rota para curtir ou descurtir publicação
router.post('/likepublicacao', authenticateToken, (req, res) => {
    const { idPublicacao, liked } = req.body;

    if (!idPublicacao) {
        return res.status(400).json({ message: 'idPublicacao é obrigatório.' });
    }

    const userId = req.userId;

    if (liked) {
        const checkLikeQuery = 'SELECT * FROM CurtidaPublicacao WHERE Publicacao_idPublicacao = ? AND Pessoa_idPessoa = ?';
        db.query(checkLikeQuery, [idPublicacao, userId], (err, results) => {
            if (err) {
                console.error('Erro ao verificar like na publicação:', err);
                return res.status(500).json({ message: 'Erro ao verificar like na publicação.' });
            }

            if (results.length === 0) {
                const insertLikeQuery = 'INSERT INTO CurtidaPublicacao (Publicacao_idPublicacao, Pessoa_idPessoa) VALUES (?, ?)';
                db.query(insertLikeQuery, [idPublicacao, userId], (err) => {
                    if (err) {
                        console.error('Erro ao inserir like na publicação:', err);
                        return res.status(500).json({ message: 'Erro ao inserir like na publicação.' });
                    }
                    getPublicationLikeCount(idPublicacao, res);
                });
            } else {
                getPublicationLikeCount(idPublicacao, res);
            }
        });
    } else {
        const deleteLikeQuery = 'DELETE FROM CurtidaPublicacao WHERE Publicacao_idPublicacao = ? AND Pessoa_idPessoa = ?';
        db.query(deleteLikeQuery, [idPublicacao, userId], (err) => {
            if (err) {
                console.error('Erro ao remover like na publicação:', err);
                return res.status(500).json({ message: 'Erro ao remover like na publicação.' });
            }
            getPublicationLikeCount(idPublicacao, res);
        });
    }
});

const getPublicationLikeCount = (idPublicacao, res) => {
    const countQuery = 'SELECT COUNT(*) AS numLikes FROM CurtidaPublicacao WHERE Publicacao_idPublicacao = ?';
    db.query(countQuery, [idPublicacao], (err, results) => {
        if (err) {
            console.error('Erro ao buscar contagem de likes da publicação:', err);
            return res.status(500).json({ message: 'Erro ao buscar contagem de likes da publicação.' });
        }
        res.json({ numLikes: results[0].numLikes });
    });
};


// Função para buscar a contagem de likes de um comentário
const getCommentLikeCount = (idComentario, res) => {
    const countQuery = 'SELECT COUNT(*) AS numLikes FROM CurtidaComentario WHERE Comentario_idComentario = ?';
    db.query(countQuery, [idComentario], (err, results) => {
        if (err) {
            console.error('Erro ao buscar contagem de likes do comentário:', err);
            return res.status(500).json({ message: 'Erro ao buscar contagem de likes do comentário.' });
        }
        const numLikes = results[0].numLikes;
        res.json({ numLikes });
    });
};

module.exports = router;

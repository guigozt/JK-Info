const express = require('express');
const router = express.Router();
const db = require('../ConexaoBD/conexaoBD'); // Importa a conexão

router.post('/like', (req, res) => {
    const { idPublicacao, liked, userId } = req.body;

    console.log(`Rota /like chamada com idPublicacao: ${idPublicacao} e liked: ${liked}`);

    if (!idPublicacao || !userId) {
        return res.status(400).json({ message: 'idPublicacao e userId são obrigatórios.' });
    }

    // Lógica para adicionar ou remover a curtida
    if (liked) {
        // Verifica se o usuário já curtiu a publicação
        const checkLikeQuery = 'SELECT * FROM CurtidaPublicacao WHERE Publicacao_idPublicacao = ? AND userId = ?';
        db.query(checkLikeQuery, [idPublicacao, userId], (err, results) => {
            if (err) {
                console.error('Erro ao verificar like:', err);
                return res.status(500).json({ message: 'Erro ao verificar like.' });
            }

            if (results.length === 0) {
                // Se não existir, insere o like
                const insertLikeQuery = 'INSERT INTO CurtidaPublicacao (Publicacao_idPublicacao, userId) VALUES (?, ?)';
                db.query(insertLikeQuery, [idPublicacao, userId], (err) => {
                    if (err) {
                        console.error('Erro ao inserir like:', err);
                        return res.status(500).json({ message: 'Erro ao inserir like.' });
                    }
                    // Retorna a nova contagem de likes
                    getLikeCount(idPublicacao, res);
                });
            } else {
                // Curtida já existe, retorna contagem atual
                getLikeCount(idPublicacao, res);
            }
        });
    } else {
        // Remove o like se já existir
        const deleteLikeQuery = 'DELETE FROM CurtidaPublicacao WHERE Publicacao_idPublicacao = ? AND userId = ?';
        db.query(deleteLikeQuery, [idPublicacao, userId], (err) => {
            if (err) {
                console.error('Erro ao remover like:', err);
                return res.status(500).json({ message: 'Erro ao remover like.' });
            }
            // Retorna a nova contagem de likes
            getLikeCount(idPublicacao, res);
        });
    }
});

// Função para obter a contagem de likes
const getLikeCount = (idPublicacao, res) => {
    const countQuery = 'SELECT COUNT(*) as newCount FROM CurtidaPublicacao WHERE Publicacao_idPublicacao = ?';
    db.query(countQuery, [idPublicacao], (err, results) => {
        if (err) {
            console.error('Erro ao contar likes:', err);
            return res.status(500).json({ message: 'Erro ao contar likes.' });
        }
        res.json({ newCount: results[0].newCount });
    });
};

module.exports = router;

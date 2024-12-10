const express = require('express');
const router = express.Router();
const db = require('../ConexaoBD/conexaoBD'); // Importa a conexão

router.get('/getusuario/:id', (req, res) => { // Mudei aqui para :id
    const userId = req.params.id; // Pegamos o ID do usuário da URL

    // Fazemos a consulta no banco de dados para buscar o usuário pelo ID
    db.query('SELECT nome FROM Pessoa WHERE idPessoa = ?', [userId], (err, rows) => {
        if (err) {
            console.error('Erro ao buscar usuário:', err);
            return res.status(500).json({ error: 'Erro no servidor' }); // Caso ocorra algum erro
        }

        if (rows.length > 0) {
            const usuario = rows[0]; // Pega o primeiro (e único) resultado
            res.json(usuario); // Envia o nome do usuário como resposta em formato JSON
        } else {
            res.status(404).json({ error: 'Usuário não encontrado' }); // Caso o usuário não exista
        }
    });
}); 

module.exports = router;

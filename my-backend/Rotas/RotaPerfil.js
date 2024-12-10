const express = require('express');
const jwt = require('jsonwebtoken');
const routerPerfil = express.Router();
const db = require('../ConexaoBD/conexaoBD');
const jwtSecret = process.env.JWT_SECRET_KEY;

// Middleware para extrair o ID do usuário do token JWT
function getIdFromToken(req) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('Token não fornecido.');
    const decoded = jwt.verify(token, jwtSecret);
    return decoded.userId;
}

// Rota GET para buscar o perfil com base no JWT
routerPerfil.get('/perfil', async (req, res) => {
    try {
        const idPessoa = getIdFromToken(req);
        console.log(`[INFO] Iniciando busca do perfil para idPessoa: ${idPessoa}`);

        const query = `
            SELECT p.idPessoa, p.nome, p.dataNascimento, ci.emailInstitucional, c.emailPessoal, c.numeroCelular
            FROM mydb.Pessoa p
            JOIN mydb.ContatoInstitucional ci ON p.ContatoInstitucional_idContatoInstitucional = ci.idContatoInstitucional
            LEFT JOIN mydb.Contato c ON p.idPessoa = c.Pessoa_idPessoa
            WHERE ci.idContatoInstitucional = ?;
        `;
        
        db.query(query, [idPessoa], (err, result) => {
            if (err) {
                console.error(`[ERRO] Falha ao buscar informações do perfil: ${err}`);
                return res.status(500).json({ message: 'Erro ao buscar informações do perfil', error: err });
            }

            if (result.length > 0) {
                console.log(`[INFO] Perfil encontrado: ${result[0]}`);
                res.json(result[0]);
            } else {
                console.warn(`[AVISO] Nenhum perfil encontrado para idPessoa: ${idPessoa}`);
                res.status(404).json({ message: 'Perfil não encontrado' });
            }
        });
    } catch (error) {
        console.error(`[ERRO] Token inválido: ${error}`);
        res.status(401).json({ message: 'Token inválido.' });
    }
});

// Rota PUT para atualizar o perfil com base no JWT
routerPerfil.put('/perfil', (req, res) => {
    try {
        const idPessoa = getIdFromToken(req);
        const { emailPessoal, numeroCelular } = req.body;

        if (!emailPessoal || !numeroCelular) {
            return res.status(400).json({ message: 'Email pessoal e número de celular são obrigatórios.' });
        }

        const checkQuery = `SELECT * FROM Contato WHERE Pessoa_idPessoa = ?`;
        
        db.query(checkQuery, [idPessoa, emailPessoal, numeroCelular], (err, results) => {
            if (err) {
                console.error(`[ERRO] Falha ao verificar existência do contato:`, err);
                return res.status(500).json({ message: 'Erro ao verificar informações do perfil', error: err });
            }

            const query = results.length > 0
                ? `UPDATE Contato SET emailPessoal = ?, numeroCelular = ? WHERE Pessoa_idPessoa = ?`
                : `INSERT INTO Contato (emailPessoal, numeroCelular, Pessoa_idPessoa) VALUES (?, ?, ?)`;

            db.query(query, [emailPessoal, numeroCelular, idPessoa], (updateErr) => {
                if (updateErr) {
                    console.error(`[ERRO] Falha ao atualizar/inserir informações do perfil:`, updateErr);
                    return res.status(500).json({ message: 'Erro ao atualizar/inserir perfil', error: updateErr });
                }
                console.log(`[INFO] Perfil atualizado/inserido com sucesso para idPessoa: ${idPessoa}`);
                res.json({ message: 'Perfil atualizado com sucesso!' });
            });
        });
    } catch (error) {
        console.error(`[ERRO] Token inválido:`, error);
        res.status(401).json({ message: 'Token inválido.' });
    }
});

module.exports = routerPerfil;

const express = require('express');
const db = require('../ConexaoBD/conexaoBD'); // Importa a conexão com o banco de dados
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET_KEY;

const routerTurmasAlunos = express.Router();

// Função para obter o ID do usuário a partir do token JWT
function getIdFromToken(req) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('Token não fornecido.');
    const decoded = jwt.verify(token, jwtSecret);
    return decoded.userId;
}

// Rota para buscar alunos da turma
routerTurmasAlunos.get('/alunosTurma', async (req, res) => {
    try {
        const idPessoa = getIdFromToken(req);

        const query = `
            SELECT 
    p.nome AS NomeAluno, 
    ci.emailInstitucional AS EmailAluno
FROM 
    Aluno_has_Turma at
JOIN Aluno a ON at.Aluno_idAluno = a.idAluno
JOIN Pessoa p ON a.Pessoa_idPessoa = p.idPessoa
JOIN ContatoInstitucional ci ON p.ContatoInstitucional_idContatoInstitucional = ci.idContatoInstitucional
WHERE 
    at.Turma_idTurma = (
        SELECT at.Turma_idTurma
        FROM Aluno_has_Turma at
        JOIN Aluno a ON at.Aluno_idAluno = a.idAluno
        WHERE a.Pessoa_idPessoa = ?
    );

        `;
        db.query(query, [idPessoa], (err, results) => {
            if (err) {
                console.error(`[ERRO] Falha ao buscar alunos da turma: ${err}`);
                return res.status(500).json({ message: 'Erro ao buscar alunos da turma' });
            }
            res.json(results);
        });
    } catch (error) {
        console.error(`[ERRO] Token inválido: ${error}`);
        res.status(401).json({ message: 'Token inválido.' });
    }
});

// Rota para buscar professores da turma
routerTurmasAlunos.get('/professoresTurma', async (req, res) => {
    try {
        const idPessoa = getIdFromToken(req);

        const query = `
           SELECT 
    p.nome AS NomeProfessor, 
    ci.emailInstitucional AS EmailProfessor
FROM 
    Materia m
JOIN Materia_has_Professor mp ON m.idMateria = mp.Materia_idMateria
JOIN Professor prof ON mp.Professor_idProfessor = prof.idProfessor
JOIN Pessoa p ON prof.Pessoa_idPessoa = p.idPessoa
JOIN ContatoInstitucional ci ON p.ContatoInstitucional_idContatoInstitucional = ci.idContatoInstitucional
WHERE 
    m.Turma_idTurma = (
        SELECT at.Turma_idTurma
        FROM Aluno_has_Turma at
        JOIN Aluno a ON at.Aluno_idAluno = a.idAluno
        WHERE a.Pessoa_idPessoa = ?
    );

        `;
        db.query(query, [idPessoa], (err, results) => {
            if (err) {
                console.error('Erro ao buscar professores da turma:', err);
                return res.status(500).json({ message: 'Erro ao buscar professores da turma' });
            }
            res.json(results);
        });
    } catch (error) {
        console.error('Erro ao buscar professores da turma:', error);
        res.status(500).json({ message: 'Erro interno' });
    }
});

// Rota para buscar notas da turma
routerTurmasAlunos.get('/notasTurma', async (req, res) => {
    try {
        const idPessoa = getIdFromToken(req);

        const query = `
            SELECT
                Turma.nomeTurma,
                Notas.nota,
                Notas.dataCriacao
            FROM
                Turma
            JOIN Notas ON Notas.Turma_idTurma = Turma.idTurma
            WHERE
                Turma.idTurma = (
                    SELECT Turma_idTurma
                    FROM Aluno_has_Turma
                    JOIN Aluno ON Aluno.idAluno = Aluno_has_Turma.Aluno_idAluno
                    WHERE Aluno.Pessoa_idPessoa = ?
                )
            ORDER BY Notas.dataCriacao DESC;
        `;

        db.query(query, [idPessoa], (err, results) => {
            if (err) {
                console.error('Erro ao buscar notas:', err);
                return res.status(500).json({ message: 'Erro ao buscar notas' });
            }
            res.json(results);
        });
    } catch (error) {
        console.error('Erro ao buscar notas:', error);
        res.status(500).json({ message: 'Erro interno' });
    }
});



module.exports = routerTurmasAlunos;

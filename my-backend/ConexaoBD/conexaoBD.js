const mysql = require('mysql2');

// Configurações de conexão
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mydb',
});

// Conectar ao banco de dados
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err); // Corrigido de console.err para console.error
    return;
  }
  console.log('Conectado ao banco de dados!!!');
});

module.exports = db; // Certifique-se de que a conexão está sendo exportada

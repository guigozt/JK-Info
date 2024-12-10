const mysql = require('mysql2');

// Configurações de conexão
const db = mysql.createConnection({
  host: 'localhost', // ou o IP do seu servidor se não for local
  user: 'root',      // seu nome de usuário
  password: '', // sua senha
  database: 'mydb', // seu banco de dados
});

// Conectar ao banco de dados
db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');

  // Teste de consulta
  db.query('SELECT 1 + 1 AS solution', (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
    } else {
      console.log('The solution is: ', results[0].solution); // Deve imprimir "The solution is: 2"
    }

    // Fechar a conexão
    db.end(err => {
      if (err) {
        console.error('Error closing connection:', err);
      } else {
        console.log('Connection closed');
      }
    });
  });
});

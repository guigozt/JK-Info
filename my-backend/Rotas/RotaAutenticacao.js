const jwt = require('jsonwebtoken');

const autenticarUsuario = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token não fornecido' });
  }

  const jwtSecret = process.env.JWT_SECRET_KEY;
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId; // Armazena o userId para uso nas rotas
    next();
  } catch (error) {
    console.error('Erro ao validar token:', error);
    return res.status(401).json({ success: false, message: 'Token inválido ou expirado' });
  }
};

module.exports = autenticarUsuario;

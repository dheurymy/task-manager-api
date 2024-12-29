const jwt = require('jsonwebtoken'); // Importa o módulo jsonwebtoken para verificação de tokens

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', ''); // Obtém o token do cabeçalho de autorização e remove o prefixo 'Bearer '
  if (!token) return res.status(401).json({ message: 'Autorização negada' }); // Verifica se o token está presente, caso contrário, retorna erro 401

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifica o token usando a chave secreta
    req.user = decoded; // Define o usuário decodificado no objeto de requisição
    next(); // Passa para o próximo middleware ou rota
  } catch (err) {
    res.status(401).json({ message: 'Token inválido' }); // Retorna erro 401 se o token for inválido
  }
};

module.exports = authMiddleware; // Exporta o middleware de autenticação

const express = require('express'); // Importa o framework Express
const router = express.Router(); // Cria uma nova instância do roteador do Express
const User = require('../models/User'); // Importa o modelo de usuário
const jwt = require('jsonwebtoken'); // Importa o módulo jsonwebtoken para geração de tokens
const bcrypt = require('bcryptjs'); // Importa o módulo bcryptjs para criptografia de senhas

// Registro de usuário
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body; // Extrai nome, email e senha do corpo da requisição

  try {
    const user = new User({ name, email, password }); // Cria um novo usuário com os dados fornecidos
    await user.save(); // Salva o usuário no banco de dados
    res.status(201).json({ message: 'Usuário registrado com sucesso' }); // Retorna mensagem de sucesso com status 201
  } catch (err) {
    res.status(400).json({ message: err.message }); // Retorna mensagem de erro com status 400
  }
});

// Login de usuário
router.post('/login', async (req, res) => {
  const { email, password } = req.body; // Extrai email e senha do corpo da requisição

  try {
    const user = await User.findOne({ email }); // Busca o usuário pelo email no banco de dados
    if (!user || !(await user.comparePassword(password))) { // Verifica se o usuário existe e se a senha é válida
      return res.status(401).json({ message: 'Credenciais inválidas' }); // Retorna mensagem de credenciais inválidas com status 401
    }

    const token = jwt.sign({ userId: user._id, name: user.name, email: user.email }, process.env.JWT_SECRET, { // Gera um token JWT com o ID do usuário
      expiresIn: '1h', // Define a expiração do token para 1 hora
    });

    res.json({ token }); // Retorna o token JWT
  } catch (err) {
    res.status(400).json({ message: err.message }); // Retorna mensagem de erro com status 400
  }
});

// Logout de usuário (opcional, pode ser manejado pelo frontend)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout bem-sucedido' }); // Retorna mensagem de logout bem-sucedido
});

module.exports = router; // Exporta o roteador

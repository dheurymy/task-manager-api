const express = require('express'); // Importa o framework Express
const mongoose = require('mongoose'); // Importa o módulo mongoose para interagir com o MongoDB
const cors = require('cors'); // Importa o módulo cors para permitir requisições de diferentes origens
const dotenv = require('dotenv'); // Importa o módulo dotenv para gerenciar variáveis de ambiente
const User = require('./models/User'); // Importa o modelo de usuário

dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env

const app = express(); // Cria uma instância do aplicativo Express
const PORT = process.env.PORT || 5000; // Define a porta do servidor a partir da variável de ambiente ou usa 5000 como padrão
const MONGO_URI = process.env.MONGO_URI; // Obtém a URI de conexão do MongoDB a partir da variável de ambiente

app.use(cors()); // Utiliza o middleware CORS
app.use(express.json()); // Utiliza o middleware para parsear o corpo das requisições como JSON

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true, // Configuração para usar o novo parser de URL do MongoDB
  useUnifiedTopology: true, // Configuração para usar a nova engine de topo do MongoDB
})
.then(() => console.log('Connected to MongoDB')) // Mensagem de sucesso na conexão com o MongoDB
.catch(err => console.error('Error connecting to MongoDB:', err.message)); // Mensagem de erro na conexão com o MongoDB

const authRoutes = require('./routes/auth'); // Importa as rotas de autenticação
const taskRoutes = require('./routes/tasks'); // Importa as rotas de tarefas
app.get('/', (req, res) => {
  res.send('Hey this is my API running 🥳')
})
app.use('/api/auth', authRoutes); // Define as rotas de autenticação com o prefixo '/api/auth'
app.use('/api/tasks', taskRoutes); // Define as rotas de tarefas com o prefixo '/api/tasks'



app.post('/auth/register', async (req, res) => {
  const { name, email, password } = req.body; // Extrai nome, email e senha do corpo da requisição

  try {
    const user = new User({ name, email, password }); // Cria um novo usuário com os dados fornecidos
    await user.save(); // Salva o usuário no banco de dados
    res.status(201).json({ message: 'Usuário registrado com sucesso' }); // Retorna mensagem de sucesso com status 201
  } catch (err) {
    res.status(400).json({ message: err.message }); // Retorna mensagem de erro com status 400
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // Mensagem indicando que o servidor está rodando na porta especificada
});

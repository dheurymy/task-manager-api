const express = require('express'); // Importa o framework Express
const router = express.Router(); // Cria uma nova instância do roteador do Express
const Task = require('../models/Task'); // Importa o modelo de tarefas
const authMiddleware = require('../middleware/authMiddleware'); // Importa o middleware de autenticação

// Obter todas as tarefas do usuário autenticado
router.get('/', authMiddleware, async (req, res) => { 
  try {
    const tasks = await Task.find({ userId: req.user.userId }); // Busca todas as tarefas do usuário autenticado
    res.json(tasks); // Retorna as tarefas em formato JSON
  } catch (err) {
    res.status(500).json({ message: err.message }); // Retorna mensagem de erro com status 500
  }
});

// Criar nova tarefa
router.post('/', authMiddleware, async (req, res) => {
  const { text, category } = req.body; // Extrai texto e categoria do corpo da requisição

  try {
    const task = new Task({ userId: req.user.userId, text, category }); // Cria uma nova tarefa com os dados fornecidos
    const newTask = await task.save(); // Salva a nova tarefa no banco de dados
    res.status(201).json(newTask); // Retorna a nova tarefa criada com status 201
  } catch (err) {
    res.status(400).json({ message: err.message }); // Retorna mensagem de erro com status 400
  }
});

// Atualizar uma tarefa
router.patch('/:id', authMiddleware, async (req, res) => {
  const updates = Object.keys(req.body); // Extrai as chaves das propriedades a serem atualizadas do corpo da requisição
  const allowedUpdates = ['text', 'category', 'isCompleted']; // Define quais atualizações são permitidas
  const isValidOperation = updates.every(update => allowedUpdates.includes(update)); // Verifica se todas as atualizações são permitidas

  if (!isValidOperation) {
    return res.status(400).json({ message: 'Atualizações inválidas' }); // Retorna mensagem de erro se houver atualizações inválidas
  }

  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.userId }); // Busca a tarefa pelo ID e pelo usuário autenticado
    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada' }); // Retorna mensagem de erro se a tarefa não for encontrada
    }

    updates.forEach(update => task[update] = req.body[update]); // Atualiza as propriedades da tarefa com os novos valores
    await task.save(); // Salva as atualizações no banco de dados
    res.json(task); // Retorna a tarefa atualizada
  } catch (err) {
    res.status(400).json({ message: err.message }); // Retorna mensagem de erro com status 400
  }
});

// Deletar uma tarefa
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.userId }); // Deleta a tarefa pelo ID e pelo usuário autenticado
    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada' }); // Retorna mensagem de erro se a tarefa não for encontrada
    }

    res.json({ message: 'Tarefa deletada' }); // Retorna mensagem de sucesso
  } catch (err) {
    res.status(500).json({ message: err.message }); // Retorna mensagem de erro com status 500
  }
});

module.exports = router; // Exporta o roteador

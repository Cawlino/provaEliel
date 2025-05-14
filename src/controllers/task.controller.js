const TaskService = require('../services/task.service');

class TaskController {
  constructor() {
    this.taskService = new TaskService();
  }

  async createTask(req, res) {
    try {
      const { title, description, status } = req.body;
      
      if (!title) {
        return res.status(400).json({ message: 'O título da tarefa é obrigatório' });
      }

      const taskData = {
        title,
        description,
        status: status || 'Pendente'
      };

      const task = await this.taskService.createTask(taskData, req.userId);
      return res.status(201).json(task);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao criar tarefa', error: error.message });
    }
  }

  async getAllTasks(req, res) {
    try {
      const tasks = await this.taskService.getAllTasks(req.userId);
      return res.status(200).json(tasks);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao listar tarefas', error: error.message });
    }
  }

  async getTaskById(req, res) {
    try {
      const { id } = req.params;
      const task = await this.taskService.getTaskById(id, req.userId);
      return res.status(200).json(task);
    } catch (error) {
      if (error.message === 'Tarefa não encontrada') {
        return res.status(404).json({ message: error.message });
      }
      if (error.message === 'Acesso não autorizado a esta tarefa') {
        return res.status(403).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Erro ao buscar tarefa', error: error.message });
    }
  }

  async updateTask(req, res) {
    try {
      const { id } = req.params;
      const { title, description, status } = req.body;
      
      if (!title) {
        return res.status(400).json({ message: 'O título da tarefa é obrigatório' });
      }

      const taskData = {
        title,
        description,
        status: status || 'Pendente'
      };

      const task = await this.taskService.updateTask(id, taskData, req.userId);
      return res.status(200).json(task);
    } catch (error) {
      if (error.message === 'Tarefa não encontrada') {
        return res.status(404).json({ message: error.message });
      }
      if (error.message === 'Acesso não autorizado a esta tarefa') {
        return res.status(403).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Erro ao atualizar tarefa', error: error.message });
    }
  }

  async updateTaskStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: 'O status da tarefa é obrigatório' });
      }

      const validStatus = ['Pendente', 'Em andamento', 'Concluída'];
      if (!validStatus.includes(status)) {
        return res.status(400).json({ 
          message: 'Status inválido', 
          validStatus 
        });
      }

      const task = await this.taskService.updateTaskStatus(id, status, req.userId);
      return res.status(200).json(task);
    } catch (error) {
      if (error.message === 'Tarefa não encontrada') {
        return res.status(404).json({ message: error.message });
      }
      if (error.message === 'Acesso não autorizado a esta tarefa') {
        return res.status(403).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Erro ao atualizar status da tarefa', error: error.message });
    }
  }

  async deleteTask(req, res) {
    try {
      const { id } = req.params;
      const result = await this.taskService.deleteTask(id, req.userId);
      return res.status(200).json(result);
    } catch (error) {
      if (error.message === 'Tarefa não encontrada') {
        return res.status(404).json({ message: error.message });
      }
      if (error.message === 'Acesso não autorizado a esta tarefa') {
        return res.status(403).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Erro ao deletar tarefa', error: error.message });
    }
  }
}

module.exports = new TaskController();
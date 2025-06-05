const taskRepo = require('../repositories/task.repository');

class TaskService {
  async createTask({ title, description, status, userId }) {
    return taskRepo.create({ title, description, status, userId });
  }

  async getAllTasks(userId) {
    return taskRepo.findAllByUser(userId);
  }

  async getTaskById(id, userId) {
    const task = await taskRepo.findById(id);
    if (!task) throw { status: 404, message: 'Tarefa não encontrada' };
    if (task.userId.toString() !== userId) throw { status: 403, message: 'Acesso negado' };
    return task;
  }

  async updateTask(id, data, userId) {
    await this.getTaskById(id, userId);
    return taskRepo.update(id, data);
  }

  async deleteTask(id, userId) {
    await this.getTaskById(id, userId);
    return taskRepo.delete(id);
  }
}

module.exports = new TaskService();

const Task = require('../models/task.model');
const TaskRepository = require('../repositories/task.repository');

class TaskService {
  constructor() {
    this.taskRepository = new TaskRepository(Task);
  }

  async createTask(taskData, userId) {
    try {
      const task = await this.taskRepository.create({
        ...taskData,
        userId
      });
      return task;
    } catch (error) {
      throw error;
    }
  }

  async getAllTasks(userId) {
    try {
      const tasks = await this.taskRepository.findAllByUserId(userId);
      return tasks;
    } catch (error) {
      throw error;
    }
  }

  async getTaskById(taskId, userId) {
    try {
      const task = await this.taskRepository.findById(taskId);
      
      if (!task) {
        throw new Error('Tarefa não encontrada');
      }
      
      if (task.userId.toString() !== userId.toString()) {
        throw new Error('Acesso não autorizado a esta tarefa');
      }
      
      return task;
    } catch (error) {
      throw error;
    }
  }

  async updateTask(taskId, taskData, userId) {
    try {
      await this.getTaskById(taskId, userId);
      
      const updatedTask = await this.taskRepository.update(taskId, taskData);
      return updatedTask;
    } catch (error) {
      throw error;
    }
  }

  async updateTaskStatus(taskId, status, userId) {
    try {
      await this.getTaskById(taskId, userId);
      
      const updatedTask = await this.taskRepository.update(taskId, { status });
      return updatedTask;
    } catch (error) {
      throw error;
    }
  }

  async deleteTask(taskId, userId) {
    try {
      await this.getTaskById(taskId, userId);
      
      await this.taskRepository.delete(taskId);
      return { message: 'Tarefa deletada com sucesso' };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TaskService;
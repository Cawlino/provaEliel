const taskService = require('../task.service');
const taskRepo = require('../../repositories/task.repository');

jest.mock('../../repositories/task.repository');

describe('Task Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const userId = 'testUserId';

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      const taskData = { title: 'Test Task', description: 'Test Description', status: 'open', userId };
      const createdTask = { _id: 'testTaskId', ...taskData };

      taskRepo.create.mockResolvedValue(createdTask);

      const result = await taskService.createTask(taskData);

      expect(taskRepo.create).toHaveBeenCalledWith(taskData);
      expect(result).toEqual(createdTask);
    });
  });

  describe('getAllTasks', () => {
    it('should return all tasks for a user', async () => {
      const tasks = [{ _id: 'task1', title: 'Task 1', userId }, { _id: 'task2', title: 'Task 2', userId }];

      taskRepo.findAllByUser.mockResolvedValue(tasks);

      const result = await taskService.getAllTasks(userId);

      expect(taskRepo.findAllByUser).toHaveBeenCalledWith(userId);
      expect(result).toEqual(tasks);
    });
  });

  describe('getTaskById', () => {
    it('should return a task by id if it exists and belongs to the user', async () => {
      const taskId = 'testTaskId';
      const task = { _id: taskId, title: 'Test Task', userId };

      taskRepo.findById.mockResolvedValue(task);

      const result = await taskService.getTaskById(taskId, userId);

      expect(taskRepo.findById).toHaveBeenCalledWith(taskId);
      expect(result).toEqual(task);
    });

    it('should throw an error if the task does not exist', async () => {
      const taskId = 'testTaskId';

      taskRepo.findById.mockResolvedValue(null);

      await expect(taskService.getTaskById(taskId, userId)).rejects.toEqual({ status: 404, message: 'Tarefa não encontrada' });

      expect(taskRepo.findById).toHaveBeenCalledWith(taskId);
    });

    it('should throw an error if the task does not belong to the user', async () => {
      const taskId = 'testTaskId';
      const task = { _id: taskId, title: 'Test Task', userId: 'otherUserId' };

      taskRepo.findById.mockResolvedValue(task);

      await expect(taskService.getTaskById(taskId, userId)).rejects.toEqual({ status: 403, message: 'Acesso negado' });

      expect(taskRepo.findById).toHaveBeenCalledWith(taskId);
    });
  });

  describe('updateTask', () => {
    it('should update a task successfully', async () => {
      const taskId = 'testTaskId';
      const taskData = { title: 'Updated Task' };
      const updatedTask = { _id: taskId, ...taskData, userId };

      taskRepo.findById.mockResolvedValue({ _id: taskId, title: 'Original Task', userId });
      taskRepo.update.mockResolvedValue(updatedTask);

      const result = await taskService.updateTask(taskId, taskData, userId);

      expect(taskRepo.findById).toHaveBeenCalledWith(taskId);
      expect(taskRepo.update).toHaveBeenCalledWith(taskId, taskData);
      expect(result).toEqual(updatedTask);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task successfully', async () => {
      const taskId = 'testTaskId';

      taskRepo.findById.mockResolvedValue({ _id: taskId, title: 'Test Task', userId });
      taskRepo.delete.mockResolvedValue(undefined);

      const result = await taskService.deleteTask(taskId, userId);

      expect(taskRepo.findById).toHaveBeenCalledWith(taskId);
      expect(taskRepo.delete).toHaveBeenCalledWith(taskId);
      expect(result).toBeUndefined();
    });
  });
});

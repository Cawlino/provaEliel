const taskService = require('../services/task.service');

exports.getAll = async (req, res, next) => {
  try {
    const tasks = await taskService.getAllTasks(req.userId);
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(req.params.id, req.userId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const task = await taskService.createTask({ 
      ...req.body, 
      userId: req.userId 
    });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.body, req.userId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const task = await taskService.deleteTask(req.params.id, req.userId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

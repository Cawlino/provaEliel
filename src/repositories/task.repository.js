const Task = require('../models/task.model');

class TaskRepository {
  async create(data) {
    return Task.create(data);
  }

  async findAllByUser(userId) {
    return Task.find({ userId });
  }

  async findById(id) {
    return Task.findById(id);
  }

  async update(id, data) {
    return Task.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return Task.findByIdAndDelete(id);
  }
}

module.exports = new TaskRepository();

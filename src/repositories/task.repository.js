class TaskRepository {
  constructor(model) {
    this.model = model;
  }

  async create(taskData) {
    return await this.model.create(taskData);
  }

  async findAllByUserId(userId) {
    return await this.model.find({ userId });
  }

  async findById(id) {
    return await this.model.findById(id);
  }

  async update(id, taskData) {
    return await this.model.findByIdAndUpdate(
      id, 
      taskData, 
      { new: true, runValidators: true }
    );
  }

  async delete(id) {
    return await this.model.findByIdAndDelete(id);
  }
}

module.exports = TaskRepository;
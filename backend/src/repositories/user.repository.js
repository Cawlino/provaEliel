class UserRepository {
  constructor(model) {
    this.model = model;
  }

  async findByUsername(username) {
    return await this.model.findOne({ username });
  }

  async create(userData) {
    return await this.model.create(userData);
  }

  async findById(id) {
    return await this.model.findById(id);
  }
}

module.exports = UserRepository;
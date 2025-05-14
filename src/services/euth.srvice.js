const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const UserRepository = require('../repositories/user.repository');

class AuthService {
  constructor() {
    this.userRepository = new UserRepository(User);
  }

  generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION
    });
  }

  async register(username, password) {
    try {
      const existingUser = await this.userRepository.findByUsername(username);
      if (existingUser) {
        throw new Error('Nome de usuário já existe');
      }

      const user = await this.userRepository.create({ username, password });
      
      const token = this.generateToken(user._id);
      
      return {
        token,
        user: {
          id: user._id,
          username: user.username
        }
      };
    } catch (error) {
      throw error;
    }
  }

  async login(username, password) {
    try {
      const user = await this.userRepository.findByUsername(username);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new Error('Senha incorreta');
      }

      const token = this.generateToken(user._id);
      
      return {
        token,
        user: {
          id: user._id,
          username: user.username
        }
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AuthService;
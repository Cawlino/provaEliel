const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UserRepository = require('../repositories/user.repository');
const userModel = require('../models/user.model');
const userRepository = new UserRepository(userModel);

const register = async (username, password) => {
  const existingUser = await userRepository.findByUsername(username);
  if (existingUser) {
    throw new Error('Usuário já existe');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await userRepository.create({ username, password: hashedPassword });

  return newUser;
};

const login = async (username, password) => {
  const user = await userRepository.findByUsername(username);
  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new Error('Senha inválida');
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION || '1h',
  });

  return { token };
};

module.exports = {
  register,
  login,
};

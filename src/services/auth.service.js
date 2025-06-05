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

  // Ensure JWT_EXPIRATION is treated as seconds if it's a number string, otherwise default to '1h'
  const expirationTime = process.env.JWT_EXPIRATION 
    ? (isNaN(Number(process.env.JWT_EXPIRATION)) ? process.env.JWT_EXPIRATION : Number(process.env.JWT_EXPIRATION)) 
    : '1h';

  // Reverted to use process.env.JWT_SECRET
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { 
    expiresIn: expirationTime,
  });

  return { token };
};

module.exports = {
  register,
  login,
};

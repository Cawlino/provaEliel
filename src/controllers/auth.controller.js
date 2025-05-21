const AuthService = require('../services/auth.service');

const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const newUser = await AuthService.register(email, password);
    res.status(201).json({ message: 'Usuário registrado com sucesso', userId: newUser._id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { token } = await AuthService.login(email, password);
    res.status(200).json({ token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  register,
  login,
};

const AuthService = require('../services/auth.service');

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  async register(req, res) {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Nome de usuário e senha são obrigatórios' });
      }
      
      if (password.length < 6) {
        return res.status(400).json({ message: 'A senha deve ter pelo menos 6 caracteres' });
      }

      const result = await this.authService.register(username, password);
      return res.status(201).json(result);
    } catch (error) {
      if (error.message === 'Nome de usuário já existe') {
        return res.status(409).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Erro ao registrar usuário', error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Nome de usuário e senha são obrigatórios' });
      }

      const result = await this.authService.login(username, password);
      return res.status(200).json(result);
    } catch (error) {
      if (error.message === 'Usuário não encontrado' || error.message === 'Senha incorreta') {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }
      return res.status(500).json({ message: 'Erro ao realizar login', error: error.message });
    }
  }
}

module.exports = new AuthController();
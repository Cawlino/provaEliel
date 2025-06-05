const authService = require('../auth.service');
const User = require('../../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../../models/user.model');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const hashedPassword = 'hashedPassword';
      const newUser = { _id: '123', email, password: hashedPassword };

      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue(hashedPassword);
      User.create.mockResolvedValue(newUser);

      const result = await authService.register(email, password);

      expect(User.findOne).toHaveBeenCalledWith({ email });
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(User.create).toHaveBeenCalledWith({ email, password: hashedPassword });
      expect(result).toEqual(newUser);
    });

    it('should throw an error if the user already exists', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const existingUser = { _id: '123', email, password: 'hashedPassword' };

      User.findOne.mockResolvedValue(existingUser);

      await expect(authService.register(email, password)).rejects.toThrow('Usuário já existe');

      expect(User.findOne).toHaveBeenCalledWith({ email });
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(User.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should login a user successfully and return a token', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const hashedPassword = 'hashedPassword';
      const user = { _id: '123', email, password: hashedPassword };
      const token = 'testToken';

      User.findOne.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue(token);

      const result = await authService.login(email, password);

      expect(User.findOne).toHaveBeenCalledWith({ email });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
      expect(jwt.sign).toHaveBeenCalledWith({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      expect(result).toEqual({ token });
    });

    it('should throw an error if the user is not found', async () => {
      const email = 'test@example.com';
      const password = 'password';

      User.findOne.mockResolvedValue(null);

      await expect(authService.login(email, password)).rejects.toThrow('Usuário não encontrado');

      expect(User.findOne).toHaveBeenCalledWith({ email });
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    it('should throw an error if the password is invalid', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const hashedPassword = 'hashedPassword';
      const user = { _id: '123', email, password: hashedPassword };

      User.findOne.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(false);

      await expect(authService.login(email, password)).rejects.toThrow('Senha inválida');

      expect(User.findOne).toHaveBeenCalledWith({ email });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
      expect(jwt.sign).not.toHaveBeenCalled();
    });
  });
});

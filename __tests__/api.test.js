const supertest = require('supertest');
const mongoose = require('mongoose');

let mongooseConnection;

beforeAll(async () => {
  const testDbUri = process.env.MONGODB_URI + '_test';
  try {
    mongooseConnection = await mongoose.connect(testDbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB for tests');
  } catch (err) {
    console.error('Failed to connect to MongoDB for tests:', err);
    process.exit(1); // Exit the test suite if connection fails
  }
});
const app = require('../src/index');
const User = require('../src/models/user.model');
const Task = require('../src/models/task.model');

const request = supertest(app);
let authToken;
let taskId;


beforeEach(async () => {
  await User.deleteMany({});
  await Task.deleteMany({});
});

describe('Testes da API de Autenticação', () => {
  
  test('Deve registrar um novo usuário', async () => {
    const response = await request
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        password: 'password123'
      });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user.username).toBe('testuser');
    
    authToken = response.body.token;
  });
  
  test('Não deve registrar um usuário com nome duplicado', async () => {
    await request
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        password: 'password123'
      });
    
    const response = await request
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        password: 'different123'
      });
    
    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Nome de usuário já existe');
  });
  
  test('Deve fazer login com credenciais corretas', async () => {
    await request
      .post('/api/auth/register')
      .send({
        username: 'loginuser',
        password: 'loginpass123'
      });
    
    const response = await request
      .post('/api/auth/login')
      .send({
        username: 'loginuser',
        password: 'loginpass123'
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user.username).toBe('loginuser');
  });
  
  test('Não deve fazer login com senha incorreta', async () => {
    await request
      .post('/api/auth/register')
      .send({
        username: 'wrongpassuser',
        password: 'correctpass123'
      });
    
    const response = await request
      .post('/api/auth/login')
      .send({
        username: 'wrongpassuser',
        password: 'wrongpass123'
      });
    
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Credenciais inválidas');
  });
});

describe('Testes da API de Tarefas', () => {
  
  beforeEach(async () => {
    const registerResponse = await request
      .post('/api/auth/register')
      .send({
        username: 'taskuser',
        password: 'taskpass123'
      });
    
    authToken = registerResponse.body.token;
  });
  
  test('Deve criar uma nova tarefa', async () => {
    const response = await request
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Tarefa de Teste',
        description: 'Descrição da tarefa de teste',
        status: 'Pendente'
      });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.title).toBe('Tarefa de Teste');
    expect(response.body.description).toBe('Descrição da tarefa de teste');
    expect(response.body.status).toBe('Pendente');
    
    taskId = response.body._id;
  });
  
  test('Deve listar todas as tarefas do usuário', async () => {
    await request
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Tarefa 1',
        description: 'Descrição 1',
        status: 'Pendente'
      });
    
    await request
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Tarefa 2',
        description: 'Descrição 2',
        status: 'Em andamento'
      });
    
    const response = await request
      .get('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBe(2);
    expect(response.body[0]).toHaveProperty('title');
    expect(response.body[1]).toHaveProperty('title');
  });
  
  test('Deve atualizar o status de uma tarefa', async () => {
    const createResponse = await request
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Tarefa para atualizar',
        description: 'Será atualizada',
        status: 'Pendente'
      });
    
    const taskId = createResponse.body._id;
    
    const response = await request
      .patch(`/api/tasks/${taskId}/status`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        status: 'Concluída'
      });
    
    expect(response.status).toBe(200);
    expect(response.body._id).toBe(taskId);
    expect(response.body.status).toBe('Concluída');
  });
  
  test('Deve remover uma tarefa', async () => {
    const createResponse = await request
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Tarefa para deletar',
        description: 'Será deletada',
        status: 'Pendente'
      });
    
    const taskId = createResponse.body._id;
    
    const deleteResponse = await request
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.message).toBe('Tarefa deletada com sucesso');
    
    const getResponse = await request
      .get(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(getResponse.status).toBe(404);
  });
});

const express = require('express');
const taskController = require('../controllers/task.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(verifyToken);

router.post('/', (req, res) => taskController.createTask(req, res));

router.get('/', (req, res) => taskController.getAllTasks(req, res));

router.get('/:id', (req, res) => taskController.getTaskById(req, res));

router.put('/:id', (req, res) => taskController.updateTask(req, res));

router.patch('/:id/status', (req, res) => taskController.updateTaskStatus(req, res));

router.delete('/:id', (req, res) => taskController.deleteTask(req, res));

module.exports = router;
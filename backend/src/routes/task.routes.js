const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth.middlewares');
const TaskController = require('../controllers/task.controller');


router.use(verifyToken);

router.get('/', TaskController.getAllTasks);
router.get('/:id', TaskController.getTaskById);
router.post('/', TaskController.createTask);
router.put('/:id', TaskController.updateTask);
router.delete('/:id', TaskController.deleteTask);

module.exports = router;

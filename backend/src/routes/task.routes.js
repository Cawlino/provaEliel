const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth.middlewares');
const TaskController = require('../controllers/task.controller');


router.use(verifyToken); // Re-added global middleware to protect all task routes

router.get('/', TaskController.getAllTasks);
router.get('/:id', TaskController.getTaskById);
router.post('/', TaskController.createTask); // Now protected by router.use(verifyToken)
router.put('/:id', TaskController.updateTask);
router.delete('/:id', TaskController.deleteTask);

module.exports = router;

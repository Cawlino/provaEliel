const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth.middlewares');
const TaskController = require('../controllers/task.controller');


router.use(verifyToken);

router.get('/', TaskController.getAll);
router.get('/:id', TaskController.getById);
router.post('/', TaskController.create);
router.put('/:id', TaskController.update);
router.delete('/:id', TaskController.delete);

module.exports = router;

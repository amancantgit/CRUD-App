const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.get('/weekly-summary', (req, res, next) =>
  taskController.getWeeklySummary(req, res, next)
);

router.get('/search', (req, res, next) =>
  taskController.searchTasks(req, res, next)
);

router.post('/', (req, res, next) =>
  taskController.createTask(req, res, next)
);

router.get('/', (req, res, next) =>
  taskController.getAllTasks(req, res, next)
);

router.get('/:id', (req, res, next) =>
  taskController.getTaskById(req, res, next)
);

router.put('/:id', (req, res, next) =>
  taskController.updateTask(req, res, next)
);

router.delete('/:id', (req, res, next) =>
  taskController.deleteTask(req, res, next)
);

router.patch('/:id/status', (req, res, next) =>
  taskController.updateTaskStatus(req, res, next)
);

router.patch('/:id', (req, res, next) =>
  taskController.updateTaskStatus(req, res, next)
);

module.exports = router;

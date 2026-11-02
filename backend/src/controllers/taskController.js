const mongoose = require('mongoose');
const taskService = require('../services/taskService');

class TaskController {
  async createTask(req, res, next) {
    try {
      const { title, description, scheduledAt, priority, status } = req.body;

      if (!title || typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Title is required',
        });
      }

      if (!scheduledAt) {
        return res.status(400).json({
          success: false,
          message: 'scheduledAt is required',
        });
      }

      const parsedDate = new Date(scheduledAt);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'scheduledAt must be a valid date',
        });
      }

      if (priority && !['Low', 'Medium', 'High'].includes(priority)) {
        return res.status(400).json({
          success: false,
          message: 'Priority must be Low, Medium, or High',
        });
      }

      if (status && !['In Progress', 'Completed'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Status must be In Progress or Completed',
        });
      }

      const newTask = await taskService.createTask({
        title: title.trim(),
        description: description ? description.trim() : '',
        scheduledAt: parsedDate,
        priority: priority || 'Medium',
        status: status || 'In Progress',
      });

      return res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: newTask,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllTasks(req, res, next) {
    try {
      const { search, priority, status } = req.query;

      if (search) {
        const searchResults = await taskService.searchTasks(search);
        return res.status(200).json({
          success: true,
          count: searchResults.length,
          data: searchResults,
        });
      }

      const filter = {};
      if (priority) filter.priority = priority;
      if (status) filter.status = status;

      const tasks = await taskService.getAllTasks(filter);

      return res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTaskById(req, res, next) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid task ID',
        });
      }

      const task = await taskService.getTaskById(id);

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateTask(req, res, next) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid task ID',
        });
      }

      const { title, description, scheduledAt, priority, status } = req.body;
      const updateData = {};

      if (title !== undefined) {
        if (typeof title !== 'string' || !title.trim()) {
          return res.status(400).json({
            success: false,
            message: 'Title must be a non-empty string',
          });
        }
        updateData.title = title.trim();
      }

      if (description !== undefined) {
        updateData.description = typeof description === 'string' ? description.trim() : '';
      }

      if (scheduledAt !== undefined) {
        const parsedDate = new Date(scheduledAt);
        if (isNaN(parsedDate.getTime())) {
          return res.status(400).json({
            success: false,
            message: 'scheduledAt must be a valid date',
          });
        }
        updateData.scheduledAt = parsedDate;
      }

      if (priority !== undefined) {
        if (!['Low', 'Medium', 'High'].includes(priority)) {
          return res.status(400).json({
            success: false,
            message: 'Priority must be Low, Medium, or High',
          });
        }
        updateData.priority = priority;
      }

      if (status !== undefined) {
        if (!['In Progress', 'Completed'].includes(status)) {
          return res.status(400).json({
            success: false,
            message: 'Status must be In Progress or Completed',
          });
        }
        updateData.status = status;
      }

      const updatedTask = await taskService.updateTask(id, updateData);

      if (!updatedTask) {
        return res.status(404).json({
          success: false,
          message: 'Task not found',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        data: updatedTask,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteTask(req, res, next) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid task ID',
        });
      }

      const deletedTask = await taskService.deleteTask(id);

      if (!deletedTask) {
        return res.status(404).json({
          success: false,
          message: 'Task not found',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Task deleted successfully',
        data: deletedTask,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateTaskStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid task ID',
        });
      }

      if (!status || !['In Progress', 'Completed'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Status is required and must be either "In Progress" or "Completed"',
        });
      }

      const updatedTask = await taskService.updateTaskStatus(id, status);

      if (!updatedTask) {
        return res.status(404).json({
          success: false,
          message: 'Task not found',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Task status updated successfully',
        data: updatedTask,
      });
    } catch (error) {
      next(error);
    }
  }

  async searchTasks(req, res, next) {
    try {
      const keyword = req.query.q || req.query.query || req.query.search || '';
      const results = await taskService.searchTasks(keyword);

      return res.status(200).json({
        success: true,
        count: results.length,
        query: keyword,
        data: results,
      });
    } catch (error) {
      next(error);
    }
  }

  async getWeeklySummary(req, res, next) {
    try {
      const referenceDate = req.query.date || req.query.weekStart;
      const summary = await taskService.getWeeklySummary(referenceDate);

      return res.status(200).json({
        success: true,
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TaskController();

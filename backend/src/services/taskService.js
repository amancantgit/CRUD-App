const mongoose = require('mongoose');
const Task = require('../models/Task');

class TaskService {
  async createTask(data) {
    const task = new Task(data);
    return await task.save();
  }

  async getAllTasks(filter = {}) {
    return await Task.find(filter).sort({ scheduledAt: 1 });
  }

  async getTaskById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return await Task.findById(id);
  }

  async updateTask(id, updateData) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return await Task.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async deleteTask(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return await Task.findByIdAndDelete(id);
  }

  async updateTaskStatus(id, status) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return await Task.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
  }

  async searchTasks(keyword) {
    if (!keyword || !keyword.trim()) {
      return await Task.find().sort({ scheduledAt: 1 });
    }

    const regex = new RegExp(keyword.trim(), 'i');
    return await Task.find({
      $or: [{ title: { $regex: regex } }, { description: { $regex: regex } }],
    }).sort({ scheduledAt: 1 });
  }

  getWeekBounds(dateObj) {
    const d = new Date(dateObj);
    const day = d.getUTCDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const monday = new Date(d);
    monday.setUTCDate(d.getUTCDate() + diffToMonday);
    monday.setUTCHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setUTCDate(monday.getUTCDate() + 6);
    sunday.setUTCHours(23, 59, 59, 999);

    return { monday, sunday };
  }

  async getWeeklySummary() {
    const allTasks = await Task.find().sort({ scheduledAt: 1 });

    const now = new Date();
    const currentWeekBounds = this.getWeekBounds(now);
    const currentWeekKey = currentWeekBounds.monday.toISOString().split('T')[0];

    const weekMap = new Map();

    const addWeekEntry = (bounds) => {
      const key = bounds.monday.toISOString().split('T')[0];
      if (!weekMap.has(key)) {
        weekMap.set(key, {
          id: key,
          startDate: bounds.monday.toISOString().split('T')[0],
          endDate: bounds.sunday.toISOString().split('T')[0],
          mondayTime: bounds.monday.getTime(),
          sundayTime: bounds.sunday.getTime(),
          isCurrentWeek: key === currentWeekKey,
          tasks: [],
          open: 0,
          completed: 0,
          total: 0,
        });
      }
      return weekMap.get(key);
    };

    addWeekEntry(currentWeekBounds);

    allTasks.forEach((task) => {
      const bounds = this.getWeekBounds(task.scheduledAt);
      const weekEntry = addWeekEntry(bounds);
      weekEntry.tasks.push(task);
      if (task.status === 'Completed') {
        weekEntry.completed += 1;
      } else {
        weekEntry.open += 1;
      }
      weekEntry.total += 1;
    });

    const weeks = Array.from(weekMap.values()).sort(
      (a, b) => a.mondayTime - b.mondayTime
    );

    const totalOpen = weeks.reduce((sum, w) => sum + w.open, 0);
    const totalCompleted = weeks.reduce((sum, w) => sum + w.completed, 0);

    return {
      weeks,
      totals: {
        open: totalOpen,
        completed: totalCompleted,
        total: totalOpen + totalCompleted,
      },
      week: {
        startDate: currentWeekBounds.monday.toISOString().split('T')[0],
        endDate: currentWeekBounds.sunday.toISOString().split('T')[0],
      },
    };
  }
}

module.exports = new TaskService();

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    scheduledAt: {
      type: Date,
      required: [true, 'Scheduled date is required'],
    },
    priority: {
      type: String,
      enum: {
        values: ['Low', 'Medium', 'High'],
        message: '{VALUE} is not a valid priority',
      },
      default: 'Medium',
    },
    status: {
      type: String,
      enum: {
        values: ['In Progress', 'Completed'],
        message: '{VALUE} is not a valid status',
      },
      default: 'In Progress',
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.index({ title: 'text', description: 'text' });
taskSchema.index({ scheduledAt: 1 });
taskSchema.index({ status: 1 });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;

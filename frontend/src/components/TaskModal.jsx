import { useState } from 'react';
import { X, Calendar, Clock, AlertCircle, Loader2 } from 'lucide-react';

export default function TaskModal({
  mode = 'create',
  task = null,
  defaultDate = null,
  onClose,
  onSubmit,
}) {
  const getInitialDateStr = () => {
    if (mode === 'edit' && task?.scheduledAt) {
      const d = new Date(task.scheduledAt);
      return d.toISOString().split('T')[0];
    }
    if (defaultDate) return defaultDate;
    return new Date().toISOString().split('T')[0];
  };

  const getInitialTimeStr = () => {
    if (mode === 'edit' && task?.scheduledAt) {
      const d = new Date(task.scheduledAt);
      const pad = (n) => String(n).padStart(2, '0');
      return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }
    return '10:00';
  };

  const [title, setTitle] = useState(() =>
    mode === 'edit' && task ? task.title || '' : ''
  );
  const [description, setDescription] = useState(() =>
    mode === 'edit' && task ? task.description || '' : ''
  );
  const [dateStr, setDateStr] = useState(getInitialDateStr);
  const [timeStr, setTimeStr] = useState(getInitialTimeStr);
  const [priority, setPriority] = useState(() =>
    mode === 'edit' && task ? task.priority || 'Medium' : 'Medium'
  );
  const [status, setStatus] = useState(() =>
    mode === 'edit' && task ? task.status || 'In Progress' : 'In Progress'
  );
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    if (!dateStr) {
      setError('Date is required');
      return;
    }

    const scheduledDate = new Date(`${dateStr}T${timeStr || '10:00'}:00`);
    if (isNaN(scheduledDate.getTime())) {
      setError('Please enter a valid date and time');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        scheduledAt: scheduledDate.toISOString(),
        priority,
        status,
      });
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to save';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="relative w-full max-w-md bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl overflow-hidden transform transition-all animate-in slide-in-from-bottom duration-200">
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h3 className="text-lg font-bold text-slate-900">
            {mode === 'edit' ? 'Edit Task' : 'Add New Task'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">
              Task title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Doing Homework"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2f65f6]/20 focus:border-[#2f65f6] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">
              Set Time
            </label>
            <div className="relative">
              <input
                type="time"
                required
                value={timeStr}
                onChange={(e) => setTimeStr(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2f65f6]/20 focus:border-[#2f65f6] transition-all bg-white"
              />
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">
              Set Date
            </label>
            <div className="relative">
              <input
                type="date"
                required
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2f65f6]/20 focus:border-[#2f65f6] transition-all bg-white"
              />
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add Description"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2f65f6]/20 focus:border-[#2f65f6] transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#2f65f6] bg-white cursor-pointer"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#2f65f6] bg-white cursor-pointer"
              >
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-[#2f65f6] hover:bg-[#2554d3] text-white font-bold text-sm shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{mode === 'edit' ? 'Save changes' : 'Create task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

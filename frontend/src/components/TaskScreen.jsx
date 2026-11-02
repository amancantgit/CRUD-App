import { Search, Plus, Trash2, Pencil, Check, X, ArrowLeft, Clock } from 'lucide-react';

export default function TaskScreen({
  weekDays,
  selectedDate,
  onSelectDate,
  tasks,
  allWeekTasks,
  viewAll,
  onToggleViewAll,
  searchQuery,
  onSearchChange,
  onClearSearch,
  onToggleStatus,
  onEditTask,
  onDeleteTask,
  onOpenCreateModal,
  onBackToWelcome,
}) {
  const completedCount = allWeekTasks.filter((t) => t.status === 'Completed').length;
  const pendingCount = allWeekTasks.filter((t) => t.status !== 'Completed').length;
  const totalCount = allWeekTasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const padZero = (n) => String(n).padStart(2, '0');

  const formatTaskDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = date.toLocaleDateString(undefined, { weekday: 'short' });
    const monthDay = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${day}, ${monthDay} • ${time}`;
  };

  const selectedDayObj = weekDays.find((d) => d.dateStr === selectedDate) || weekDays[0];
  const isSelectedToday = selectedDayObj?.isToday;

  return (
    <div className="relative w-full h-full min-h-screen sm:min-h-[780px] bg-white flex flex-col justify-between pb-24 overflow-y-auto">
      <div className="p-5 sm:p-6 space-y-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToWelcome}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            title="Back to Welcome screen"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search for a task"
              className="w-full pl-4 pr-10 py-3 text-sm bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2f65f6]/20 focus:border-[#2f65f6] focus:bg-white transition-all shadow-xs"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={onClearSearch}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-1 py-1">
          {weekDays.map((day) => {
            const isSelected = day.dateStr === selectedDate && !viewAll;
            return (
              <button
                key={day.dateStr}
                type="button"
                onClick={() => {
                  onSelectDate(day.dateStr);
                }}
                className={`flex flex-col items-center justify-center py-2 px-2.5 sm:px-3 rounded-2xl transition-all cursor-pointer ${isSelected
                  ? 'bg-[#2f65f6] text-white shadow-md shadow-blue-500/20 scale-105'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                  }`}
              >
                <span className={`text-[11px] font-medium mb-1 ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                  {day.dayName}
                </span>
                <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-700'}`}>
                  {day.dayNumber}
                </span>
                {isSelected && (
                  <span className="w-1 h-1 rounded-full bg-white mt-1" />
                )}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          <div className="p-4 rounded-2xl bg-[#eff3ff] border border-blue-100 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-full bg-[#2f65f6] flex items-center justify-center text-white">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="text-xs font-semibold text-slate-700">Task Complete</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">
                {padZero(completedCount)}
              </span>
              <span className="text-[11px] font-medium text-slate-400">This Week</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#fff1f2] border border-rose-100 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-full bg-[#f43f5e] flex items-center justify-center text-white">
                <X className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="text-xs font-semibold text-slate-700">Task Pending</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">
                {padZero(pendingCount)}
              </span>
              <span className="text-[11px] font-medium text-slate-400">This Week</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Weekly Progress</h3>
            <span className="text-xs font-semibold text-slate-500">{progressPercent}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-[#e0e7ff] overflow-hidden">
            <div
              className="h-full bg-[#2f65f6] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-slate-900">
              {viewAll
                ? 'All Tasks This Week'
                : isSelectedToday
                  ? 'Tasks Today'
                  : `Tasks for ${selectedDayObj?.fullDayName || 'Selected Day'}`}
            </h3>
            <button
              type="button"
              onClick={onToggleViewAll}
              className="text-xs font-semibold text-[#2f65f6] hover:text-[#2554d3] transition-colors cursor-pointer"
            >
              {viewAll ? 'Show Day' : 'View All'}
            </button>
          </div>

          {tasks.length === 0 ? (
            <div className="py-10 text-center text-slate-400 text-xs">
              <p className="font-medium mb-2">No tasks found for this day</p>
              <button
                type="button"
                onClick={() => onOpenCreateModal(selectedDate)}
                className="text-xs font-semibold text-[#2f65f6] hover:text-[#2554d3] transition-colors cursor-pointer"
              >
                + Tap to add a task
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {tasks.map((task) => {
                const isCompleted = task.status === 'Completed';

                return (
                  <div
                    key={task._id}
                    className="flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-slate-100 hover:border-slate-200 bg-white transition-all shadow-2xs"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() =>
                          onToggleStatus(task._id, isCompleted ? 'In Progress' : 'Completed')
                        }
                        className={`w-5 h-5 rounded-md flex items-center justify-center transition-all cursor-pointer shrink-0 ${isCompleted
                          ? 'bg-[#2f65f6] text-white shadow-xs'
                          : 'border-2 border-slate-300 hover:border-[#2f65f6]'
                          }`}
                      >
                        {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p
                            className={`text-sm font-semibold truncate ${isCompleted
                              ? 'line-through text-slate-400'
                              : 'text-slate-800'
                              }`}
                          >
                            {task.title}
                          </p>
                          {task.priority && (
                            <span
                              className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-md ${task.priority === 'High'
                                ? 'bg-rose-50 text-rose-600 border border-rose-100'
                                : task.priority === 'Medium'
                                  ? 'bg-amber-50 text-amber-600 border border-amber-100'
                                  : 'bg-slate-100 text-slate-600'
                                }`}
                            >
                              {task.priority}
                            </span>
                          )}
                        </div>

                        {task.description && (
                          <p className="text-xs text-slate-400 truncate mt-0.5">
                            {task.description}
                          </p>
                        )}

                        {task.scheduledAt && (
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{formatTaskDate(task.scheduledAt)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
                      <button
                        type="button"
                        onClick={() => onDeleteTask(task)}
                        className="p-1.5 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEditTask(task)}
                        className="p-1.5 hover:text-[#2f65f6] transition-colors cursor-pointer"
                        title="Edit task"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-6 inset-x-0 flex justify-center pointer-events-none">
        <button
          type="button"
          onClick={() => onOpenCreateModal(selectedDate)}
          className="pointer-events-auto w-14 h-14 rounded-full bg-[#2f65f6] hover:bg-[#2554d3] text-white flex items-center justify-center shadow-xl shadow-blue-500/35 active:scale-95 transition-all cursor-pointer"
          title="Add New Task"
        >
          <Plus className="w-7 h-7 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef, useMemo } from 'react';
import OnboardingScreen from './components/OnboardingScreen';
import TaskScreen from './components/TaskScreen';
import TaskModal from './components/TaskModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import { taskApi } from './services/api';

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [viewAll, setViewAll] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef(null);

  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: 'create',
    task: null,
    defaultDate: null,
  });

  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    task: null,
  });

  const weekDays = useMemo(() => {
    const today = new Date();
    const day = today.getUTCDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const monday = new Date(today);
    monday.setUTCDate(today.getUTCDate() + diffToMonday);
    monday.setUTCHours(0, 0, 0, 0);

    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const fullNames = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];

    const todayStr = today.toISOString().split('T')[0];

    return dayNames.map((name, index) => {
      const d = new Date(monday);
      d.setUTCDate(monday.getUTCDate() + index);

      const dateStr = d.toISOString().split('T')[0];
      const dayNumber = String(d.getUTCDate()).padStart(2, '0');

      return {
        dayName: name,
        fullDayName: fullNames[index],
        dayNumber,
        dateStr,
        isToday: dateStr === todayStr,
      };
    });
  }, []);

  const refreshTasks = async () => {
    try {
      const res = await taskApi.getAllTasks();
      if (res?.success && res.data) {
        setTasks(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  };

  useEffect(() => {
    let ignore = false;

    async function loadTasks() {
      try {
        const res = await taskApi.getAllTasks();
        if (!ignore && res?.success && res.data) {
          setTasks(res.data);
        }
      } catch (err) {
        console.error('Failed to load tasks:', err);
      }
    }

    loadTasks();

    return () => {
      ignore = true;
    };
  }, []);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!query.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await taskApi.searchTasks(query.trim());
        if (res.success && res.data) {
          setSearchResults(res.data);
        }
      } catch (err) {
        console.error('Search failed:', err);
      }
    }, 250);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    setSearchResults([]);
  };

  const handleToggleStatus = async (taskId, newStatus) => {
    try {
      await taskApi.updateTaskStatus(taskId, newStatus);
      await refreshTasks();
      if (isSearching) {
        setSearchResults((prev) =>
          prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
        );
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleOpenCreateModal = (defaultDate = null) => {
    setModalState({
      isOpen: true,
      mode: 'create',
      task: null,
      defaultDate: defaultDate || selectedDate,
    });
  };

  const handleOpenEditModal = (task) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      task,
      defaultDate: null,
    });
  };

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      mode: 'create',
      task: null,
      defaultDate: null,
    });
  };

  const handleModalSubmit = async (formData) => {
    if (modalState.mode === 'create') {
      await taskApi.createTask(formData);
    } else {
      await taskApi.updateTask(modalState.task._id, formData);
    }
    await refreshTasks();
    if (isSearching && searchQuery.trim()) {
      const res = await taskApi.searchTasks(searchQuery.trim());
      if (res.success && res.data) {
        setSearchResults(res.data);
      }
    }
  };

  const handleOpenDeleteModal = (task) => {
    setDeleteModalState({
      isOpen: true,
      task,
    });
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalState({
      isOpen: false,
      task: null,
    });
  };

  const handleDeleteConfirm = async (taskId) => {
    await taskApi.deleteTask(taskId);
    await refreshTasks();
    if (isSearching) {
      setSearchResults((prev) => prev.filter((t) => t._id !== taskId));
    }
  };

  const allWeekDates = useMemo(
    () => new Set(weekDays.map((d) => d.dateStr)),
    [weekDays]
  );

  const allWeekTasks = useMemo(() => {
    return tasks.filter((t) => {
      const taskDate = new Date(t.scheduledAt).toISOString().split('T')[0];
      return allWeekDates.has(taskDate);
    });
  }, [tasks, allWeekDates]);

  const displayedTasks = useMemo(() => {
    if (isSearching) {
      return searchResults;
    }
    if (viewAll) {
      return allWeekTasks;
    }
    return tasks.filter((t) => {
      const taskDate = new Date(t.scheduledAt).toISOString().split('T')[0];
      return taskDate === selectedDate;
    });
  }, [isSearching, searchResults, viewAll, allWeekTasks, tasks, selectedDate]);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 sm:p-4 md:p-6 font-sans">
      <div className="w-full max-w-md bg-white min-h-screen sm:min-h-[820px] sm:max-h-[880px] sm:rounded-[36px] shadow-2xl flex flex-col overflow-hidden relative border-0 sm:border sm:border-slate-200">
        {!hasStarted ? (
          <OnboardingScreen onGetStarted={() => setHasStarted(true)} />
        ) : (
          <TaskScreen
            weekDays={weekDays}
            selectedDate={selectedDate}
            onSelectDate={(dateStr) => {
              setSelectedDate(dateStr);
              setViewAll(false);
            }}
            tasks={displayedTasks}
            allWeekTasks={allWeekTasks}
            viewAll={viewAll}
            onToggleViewAll={() => setViewAll((prev) => !prev)}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onClearSearch={handleClearSearch}
            onToggleStatus={handleToggleStatus}
            onEditTask={handleOpenEditModal}
            onDeleteTask={handleOpenDeleteModal}
            onOpenCreateModal={handleOpenCreateModal}
            onBackToWelcome={() => setHasStarted(false)}
          />
        )}

        {modalState.isOpen && (
          <TaskModal
            mode={modalState.mode}
            task={modalState.task}
            defaultDate={modalState.defaultDate}
            onClose={handleCloseModal}
            onSubmit={handleModalSubmit}
          />
        )}

        <DeleteConfirmModal
          isOpen={deleteModalState.isOpen}
          task={deleteModalState.task}
          onClose={handleCloseDeleteModal}
          onConfirm={handleDeleteConfirm}
        />
      </div>
    </div>
  );
}

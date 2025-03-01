import React, { useState, useEffect } from 'react';
import { Layers, Clock, Sparkles } from 'lucide-react';
import { Task, TaskStatus, TaskFilter, TaskStats } from './types/task';
import { formatTime } from './utils/timeUtils';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskStatsDisplay from './components/TaskStats';
import Timer from './components/Timer';
import TaskFilters from './components/TaskFilters';
import ThemeToggle from './components/ThemeToggle';
import StickyNotes from './components/StickyNotes';
import useLocalStorage from './hooks/useLocalStorage';
import { showNotification, playNotificationSound } from './utils/notificationUtils';

function App() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [filter, setFilter] = useState<TaskFilter>({
    status: 'All',
    priority: 'All',
    searchTerm: ''
  });

  // Calculate task statistics
  const calculateStats = (): TaskStats => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'Completed').length;
    const totalEstimatedTime = tasks.reduce((total, task) => total + task.estimatedTime, 0);
    const totalActiveTime = tasks.reduce((total, task) => total + task.activeTime, 0);
    
    const totalBreakTime = tasks.reduce((total, task) => {
      return total + task.breakDurations.reduce((breakTotal, breakPeriod) => {
        if (!breakPeriod.endTime) return breakTotal;
        return breakTotal + Math.floor((breakPeriod.endTime.getTime() - breakPeriod.startTime.getTime()) / 1000);
      }, 0);
    }, 0);
    
    return {
      totalTasks,
      completedTasks,
      totalEstimatedTime,
      totalActiveTime,
      totalBreakTime
    };
  };

  const activeTask = tasks.find(task => task.id === activeTaskId) || null;
  const stats = calculateStats();

  // Update tab title with timer
  useEffect(() => {
    const baseTitle = 'TaskFlow Pro';
    
    if (activeTask && activeTask.status === 'In Progress') {
      const timeDisplay = formatTime(elapsedTime);
      document.title = `(${timeDisplay}) ${activeTask.title} - ${baseTitle}`;
    } else {
      document.title = `${baseTitle} | Smart Task Management`;
    }
    
    return () => {
      document.title = `${baseTitle} | Smart Task Management`;
    };
  }, [activeTask, elapsedTime]);

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Timer effect
  useEffect(() => {
    let intervalId: number | undefined;
    
    if (activeTaskId) {
      intervalId = setInterval(() => {
        setElapsedTime(prev => prev + 1);
        setRemainingTime(prev => prev - 1);
      }, 1000) as unknown as number;
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [activeTaskId]);

  // Check if timer is done
  useEffect(() => {
    if (remainingTime === 0 && activeTaskId && soundEnabled) {
      playNotificationSound();
      showNotification('Task Time Complete', {
        body: `Estimated time for the active task has been reached.`,
        icon: '/logo.svg'
      });
    }
  }, [remainingTime, activeTaskId, soundEnabled]);


  const addTask = (newTaskData: Omit<Task, 'id' | 'status' | 'activeTime' | 'breakDurations'>) => {
    const newTask: Task = {
      id: Date.now().toString(),
      ...newTaskData,
      status: 'Not Started',
      activeTime: 0,
      breakDurations: [],
    };
    
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus, updates: Partial<Task> = {}) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, status, ...updates } 
          : task
      )
    );
  };

  const startTask = (taskId: string) => {
    // If there's already an active task, pause it first
    if (activeTaskId) {
      pauseTask(activeTaskId);
    }
    
    const now = new Date();
    const targetTask = tasks.find(t => t.id === taskId);
    
    if (!targetTask) return;
    
    // If task was previously paused, continue from where it left off
    if (targetTask.status === 'Paused') {
      // End the last break period
      const updatedBreakDurations = [...targetTask.breakDurations];
      if (updatedBreakDurations.length > 0 && !updatedBreakDurations[updatedBreakDurations.length - 1].endTime) {
        updatedBreakDurations[updatedBreakDurations.length - 1].endTime = now;
      }
      
      updateTaskStatus(taskId, 'In Progress', {
        lastPausedAt: undefined,
        breakDurations: updatedBreakDurations
      });
    } else {
      // Starting the task for the first time
      updateTaskStatus(taskId, 'In Progress', {
        startTime: now,
      });
    }
    
    setActiveTaskId(taskId);
    
    // Calculate elapsed and remaining time
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setElapsedTime(task.activeTime);
      setRemainingTime(task.estimatedTime * 60 - task.activeTime);
    }
  };

  const pauseTask = (taskId: string) => {
    const now = new Date();
    const task = tasks.find(t => t.id === taskId);
    
    if (!task || task.status !== 'In Progress') return;
    
    // Calculate the active time to add
    let additionalActiveTime = 0;
    if (task.startTime && !task.lastPausedAt) {
      const startTimeToUse = new Date(Math.max(
        task.startTime.getTime(),
        task.lastPausedAt ? task.lastPausedAt.getTime() : 0
      ));
      
      additionalActiveTime = Math.floor((now.getTime() - startTimeToUse.getTime()) / 1000);
    }
    
    // Create a new break period
    const updatedBreakDurations = [
      ...task.breakDurations,
      { startTime: now, endTime: undefined }
    ];
    
    updateTaskStatus(taskId, 'Paused', {
      lastPausedAt: now,
      activeTime: task.activeTime + additionalActiveTime,
      breakDurations: updatedBreakDurations
    });
    
    setActiveTaskId(null);
  };

  const completeTask = (taskId: string) => {
    const now = new Date();
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) return;
    
    // Calculate final active time if task was in progress
    let finalActiveTime = task.activeTime;
    if (task.status === 'In Progress' && task.startTime && !task.lastPausedAt) {
      const additionalActiveTime = Math.floor((now.getTime() - task.startTime.getTime()) / 1000);
      finalActiveTime += additionalActiveTime;
    }
    
    // End any open break periods
    const updatedBreakDurations = [...task.breakDurations];
    const lastBreak = updatedBreakDurations[updatedBreakDurations.length - 1];
    if (lastBreak && !lastBreak.endTime) {
      lastBreak.endTime = now;
    }
    
    updateTaskStatus(taskId, 'Completed', {
      completionTime: now,
      activeTime: finalActiveTime,
      breakDurations: updatedBreakDurations
    });
    
    if (activeTaskId === taskId) {
      setActiveTaskId(null);

      if (soundEnabled) {
        playNotificationSound();
        showNotification('Task Completed', {
          body: `Great job! You've completed: ${task.title}`,
          icon: '/logo.svg'
        });
      }
    }
  };

  const deleteTask = (taskId: string) => {
    if (activeTaskId === taskId) {
      setActiveTaskId(null);
    }
    
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100'}`}>
      <header className={`${darkMode ? 'bg-gray-800 shadow-lg' : 'bg-white shadow-sm'}`}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative mr-3">
              <Layers size={28} className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <Clock size={14} className={`absolute -bottom-1 -right-1 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              <Sparkles size={12} className={`absolute -top-1 -right-1 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'} animate-pulse`} />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                TaskFlow Pro
              </h1>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Smart Task Management
              </p>
            </div>
          </div>
          <ThemeToggle darkMode={darkMode} onToggle={toggleTheme} />
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Task Management System - Takes up 3 columns on large screens */}
          <div className="lg:col-span-3 space-y-6">
            <TaskStatsDisplay stats={stats} />
            
            <TaskForm onAddTask={addTask} />
            
            <TaskFilters 
              filter={filter}
              onFilterChange={setFilter}
            />
            
            <TaskList
              tasks={tasks}
              filter={filter}
              onStartTask={startTask}
              onPauseTask={pauseTask}
              onCompleteTask={completeTask}
              onDeleteTask={deleteTask}
              activeTaskId={activeTaskId}
              elapsedTime={elapsedTime}
            />
          </div>

          {/* Sticky Notes - Takes up 1 column on large screens */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <StickyNotes />
            </div>
          </div>
        </div>
      </main>
      
      {activeTask && (
        <Timer
          activeTask={activeTask}
          elapsedTime={elapsedTime}
          remainingTime={remainingTime}
          onPauseTask={pauseTask}
          onCompleteTask={completeTask}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
        />
      )}
    </div>
  );
}

export default App;

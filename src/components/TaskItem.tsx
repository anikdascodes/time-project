import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, CheckCircle, Clock, Calendar, Tag as TagIcon, AlertTriangle } from 'lucide-react';
import { Task, TaskPriority } from '../types/task';
import { formatTime } from '../utils/timeUtils';

interface TaskItemProps {
  task: Task;
  onStartTask: (taskId: string) => void;
  onPauseTask: (taskId: string) => void;
  onCompleteTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  isActive: boolean;
  elapsedTime?: number;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onStartTask,
  onPauseTask,
  onCompleteTask,
  onDeleteTask,
  isActive,
  elapsedTime = 0,
}) => {
  const getStatusColor = () => {
    switch (task.status) {
      case 'Not Started':
        return 'bg-gray-100 dark:bg-gray-800';
      case 'In Progress':
        return 'bg-blue-50 border-l-4 border-blue-500 dark:bg-blue-900/30 dark:border-blue-400';
      case 'Paused':
        return 'bg-yellow-50 border-l-4 border-yellow-500 dark:bg-yellow-900/30 dark:border-yellow-400';
      case 'Completed':
        return 'bg-green-50 border-l-4 border-green-500 dark:bg-green-900/30 dark:border-green-400';
      default:
        return 'bg-gray-100 dark:bg-gray-800';
    }
  };
  
  const getStatusBadge = () => {
    switch (task.status) {
      case 'Not Started':
        return <span className="px-2 py-1 text-xs font-medium bg-gray-200 text-gray-800 rounded-full dark:bg-gray-700 dark:text-gray-300">Not Started</span>;
      case 'In Progress':
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-300">In Progress</span>;
      case 'Paused':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full dark:bg-yellow-900 dark:text-yellow-300">Paused</span>;
      case 'Completed':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full dark:bg-green-900 dark:text-green-300">Completed</span>;
      default:
        return null;
    }
  };

  const getPriorityBadge = () => {
    switch (task.priority) {
      case 'Low':
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full flex items-center dark:bg-gray-700 dark:text-gray-300"><AlertTriangle size={12} className="mr-1" />Low</span>;
      case 'Medium':
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full flex items-center dark:bg-blue-900 dark:text-blue-300"><AlertTriangle size={12} className="mr-1" />Medium</span>;
      case 'High':
        return <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full flex items-center dark:bg-orange-900 dark:text-orange-300"><AlertTriangle size={12} className="mr-1" />High</span>;
      case 'Urgent':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full flex items-center dark:bg-red-900 dark:text-red-300"><AlertTriangle size={12} className="mr-1" />Urgent</span>;
      default:
        return null;
    }
  };

  // Calculate total active time
  const totalActiveTime = task.activeTime + (
    task.status === 'In Progress' && task.startTime && !task.lastPausedAt
      ? Math.floor((new Date().getTime() - task.startTime.getTime()) / 1000)
      : 0
  );

  // Calculate total break time
  const totalBreakTime = task.breakDurations.reduce((total, breakPeriod) => {
    if (!breakPeriod.endTime) return total;
    return total + Math.floor((breakPeriod.endTime.getTime() - breakPeriod.startTime.getTime()) / 1000);
  }, 0);

  // Check if task is due soon (within 1 hour) or overdue
  const isDueSoon = () => {
    if (!task.dueDate || task.status === 'Completed') return false;
    const now = new Date();
    const diffMs = task.dueDate.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours > 0 && diffHours < 1;
  };

  const isOverdue = () => {
    if (!task.dueDate || task.status === 'Completed') return false;
    return new Date() > task.dueDate;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`p-4 mb-3 rounded-lg task-card ${getStatusColor()}`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">
            {task.title}
            {isOverdue() && <span className="ml-2 text-xs font-bold text-red-600 dark:text-red-400">OVERDUE!</span>}
            {isDueSoon() && <span className="ml-2 text-xs font-bold text-orange-600 dark:text-orange-400">DUE SOON!</span>}
          </h3>
          <p className="text-sm text-gray-600 mt-1 dark:text-gray-300">{task.description}</p>
        </div>
        <div className="flex flex-col gap-1 items-end">
          {getStatusBadge()}
          {getPriorityBadge()}
        </div>
      </div>
      
      <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
        <div className="flex flex-wrap gap-2 items-center mb-1">
          <div className="flex items-center">
            <Clock size={16} className="mr-1 dark:text-blue-300" />
            <span className="dark:text-gray-200">Estimated: {task.estimatedTime} minutes</span>
          </div>
          
          {task.dueDate && (
            <div className="flex items-center">
              <Calendar size={16} className="mr-1 dark:text-purple-300" />
              <span className="dark:text-gray-200">Due: {task.dueDate.toLocaleString()}</span>
            </div>
          )}
        </div>
        
        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 my-2">
            {task.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
              >
                <TagIcon size={10} className="mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {task.status !== 'Not Started' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
            <div>
              <div className="text-xs text-gray-500 dark:text-blue-200">Active Time</div>
              <div className="font-medium dark:text-gray-100">{formatTime(isActive ? elapsedTime : totalActiveTime)}</div>
            </div>
            {task.breakDurations.length > 0 && (
              <div>
                <div className="text-xs text-gray-500 dark:text-orange-200">Break Time</div>
                <div className="font-medium dark:text-gray-100">{formatTime(totalBreakTime)}</div>
              </div>
            )}
            {task.startTime && (
              <div>
                <div className="text-xs text-gray-500 dark:text-green-200">Started At</div>
                <div className="font-medium dark:text-gray-100">{task.startTime.toLocaleTimeString()}</div>
              </div>
            )}
            {task.completionTime && (
              <div>
                <div className="text-xs text-gray-500 dark:text-purple-200">Completed At</div>
                <div className="font-medium dark:text-gray-100">{task.completionTime.toLocaleTimeString()}</div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-3 flex flex-wrap gap-2">
        {task.status !== 'Completed' && (
          <>
            {(task.status === 'Not Started' || task.status === 'Paused') && (
              <button
                onClick={() => onStartTask(task.id)}
                className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                <Play size={16} className="mr-1" />
                {task.status === 'Not Started' ? 'Start' : 'Resume'}
              </button>
            )}
            
            {task.status === 'In Progress' && (
              <>
                <button
                  onClick={() => onPauseTask(task.id)}
                  className="flex items-center px-3 py-1.5 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700"
                >
                  <Pause size={16} className="mr-1" />
                  Pause
                </button>
                
                <button
                  onClick={() => onCompleteTask(task.id)}
                  className="flex items-center px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                >
                  <CheckCircle size={16} className="mr-1" />
                  Complete
                </button>
              </>
            )}
          </>
        )}
        
        <button
          onClick={() => onDeleteTask(task.id)}
          className="flex items-center px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900/70"
        >
          Delete
        </button>
      </div>
    </motion.div>
  );
};

export default TaskItem;
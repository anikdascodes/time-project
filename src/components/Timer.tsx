import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Play, Pause, CheckCircle, Bell, BellOff } from 'lucide-react';
import { Task } from '../types/task';
import { formatTime } from '../utils/timeUtils';

interface TimerProps {
  activeTask: Task | null;
  elapsedTime: number;
  remainingTime: number;
  onPauseTask: (taskId: string) => void;
  onCompleteTask: (taskId: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

const Timer: React.FC<TimerProps> = ({
  activeTask,
  elapsedTime,
  remainingTime,
  onPauseTask,
  onCompleteTask,
  soundEnabled,
  onToggleSound
}) => {
  if (!activeTask) return null;

  const estimatedSeconds = activeTask.estimatedTime * 60;
  const progressPercentage = Math.min(100, (elapsedTime / estimatedSeconds) * 100);
  const isOvertime = remainingTime <= 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4 dark:bg-gray-800 dark:border-gray-700"
      >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-lg truncate pr-2 dark:text-white">
            {activeTask.title}
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={onToggleSound}
              className="flex items-center px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              title={soundEnabled ? "Disable sound alerts" : "Enable sound alerts"}
            >
              {soundEnabled ? <Bell size={16} className="mr-1" /> : <BellOff size={16} className="mr-1" />}
              {soundEnabled ? "Alerts On" : "Alerts Off"}
            </button>
            <button
              onClick={() => onPauseTask(activeTask.id)}
              className="flex items-center px-3 py-1.5 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
            >
              <Pause size={16} className="mr-1" />
              Pause
            </button>
            <button
              onClick={() => onCompleteTask(activeTask.id)}
              className="flex items-center px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <CheckCircle size={16} className="mr-1" />
              Complete
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-3">
          <div className="bg-blue-50 rounded-lg p-3 text-center dark:bg-blue-900">
            <div className="text-xs text-gray-500 mb-1 dark:text-gray-300">Elapsed Time</div>
            <div className="text-xl font-bold text-blue-700 dark:text-blue-300">{formatTime(elapsedTime)}</div>
          </div>
          
          <div className={`${isOvertime ? 'bg-red-50 dark:bg-red-900' : 'bg-green-50 dark:bg-green-900'} rounded-lg p-3 text-center`}>
            <div className="text-xs text-gray-500 mb-1 dark:text-gray-300">{isOvertime ? 'Overtime' : 'Remaining'}</div>
            <div className={`text-xl font-bold ${isOvertime ? 'text-red-700 dark:text-red-300' : 'text-green-700 dark:text-green-300'}`}>
              {isOvertime ? '+' + formatTime(Math.abs(remainingTime)) : formatTime(remainingTime)}
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-3 text-center dark:bg-purple-900">
            <div className="text-xs text-gray-500 mb-1 dark:text-gray-300">Estimated</div>
            <div className="text-xl font-bold text-purple-700 dark:text-purple-300">{formatTime(estimatedSeconds)}</div>
          </div>
        </div>
        
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
          <div 
            className={`absolute top-0 left-0 h-full ${isOvertime ? 'bg-red-500' : 'bg-blue-500'}`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Timer;
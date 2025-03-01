import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Calendar, BarChart2, Timer } from 'lucide-react';
import { TaskStats } from '../types/task';
import { formatTime } from '../utils/timeUtils';

interface TaskStatsProps {
  stats: TaskStats;
}

const TaskStatsDisplay: React.FC<TaskStatsProps> = ({ stats }) => {
  const completionRate = stats.totalTasks > 0 
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
    : 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-4 rounded-lg shadow-md mb-6 dark:bg-gray-800"
    >
      <h2 className="text-lg font-semibold mb-3 flex items-center">
        <BarChart2 size={20} className="mr-2 text-blue-600" />
        Task Statistics
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-3 bg-blue-50 rounded-lg stat-card from-blue-500 to-blue-600 dark:bg-blue-800/50 dark:border dark:border-blue-700"
        >
          <div className="text-xs text-gray-500 mb-1 dark:text-blue-200">Total Tasks</div>
          <div className="text-xl font-bold text-blue-700 flex items-center dark:text-blue-300">
            <CheckCircle size={18} className="mr-2" />
            {stats.totalTasks}
          </div>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-3 bg-green-50 rounded-lg stat-card from-green-500 to-green-600 dark:bg-green-800/50 dark:border dark:border-green-700"
        >
          <div className="text-xs text-gray-500 mb-1 dark:text-green-200">Completion Rate</div>
          <div className="text-xl font-bold text-green-700 flex items-center dark:text-green-300">
            <CheckCircle size={18} className="mr-2" />
            {completionRate}%
          </div>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-3 bg-purple-50 rounded-lg stat-card from-purple-500 to-purple-600 dark:bg-purple-800/50 dark:border dark:border-purple-700"
        >
          <div className="text-xs text-gray-500 mb-1 dark:text-purple-200">Time Planned</div>
          <div className="text-xl font-bold text-purple-700 flex items-center dark:text-purple-300">
            <Calendar size={18} className="mr-2" />
            {formatTime(stats.totalEstimatedTime * 60)}
          </div>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-3 bg-orange-50 rounded-lg stat-card from-orange-500 to-orange-600 dark:bg-orange-800/50 dark:border dark:border-orange-700"
        >
          <div className="text-xs text-gray-500 mb-1 dark:text-orange-200">Time Spent</div>
          <div className="text-xl font-bold text-orange-700 flex items-center dark:text-orange-300">
            <Timer size={18} className="mr-2" />
            {formatTime(stats.totalActiveTime)}
          </div>
        </motion.div>
      </div>
      
      <div className="mt-4">
        <div className="text-xs text-gray-500 mb-1 dark:text-gray-300">Task Completion Progress</div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionRate}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-green-600 h-2.5 rounded-full dark:bg-green-500" 
          ></motion.div>
        </div>
      </div>
    </motion.div>
  );
};


export default TaskStatsDisplay
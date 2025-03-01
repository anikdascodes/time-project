import React, { useState } from 'react';
import { Task, TaskFilter } from '../types/task';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  filter: TaskFilter;
  onStartTask: (taskId: string) => void;
  onPauseTask: (taskId: string) => void;
  onCompleteTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  activeTaskId: string | null;
  elapsedTime: number;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  filter,
  onStartTask,
  onPauseTask,
  onCompleteTask,
  onDeleteTask,
  activeTaskId,
  elapsedTime,
}) => {
  // Apply filters
  const filteredTasks = tasks.filter(task => {
    // Filter by status
    if (filter.status !== 'All' && task.status !== filter.status) {
      return false;
    }
    
    // Filter by priority
    if (filter.priority !== 'All' && task.priority !== filter.priority) {
      return false;
    }
    
    // Filter by search term
    if (filter.searchTerm && !task.title.toLowerCase().includes(filter.searchTerm.toLowerCase()) &&
        !task.description.toLowerCase().includes(filter.searchTerm.toLowerCase()) &&
        !task.tags.some(tag => tag.toLowerCase().includes(filter.searchTerm.toLowerCase()))) {
      return false;
    }
    
    return true;
  });
  
  // Group tasks by status
  const notStartedTasks = filteredTasks.filter(task => task.status === 'Not Started');
  const inProgressTasks = filteredTasks.filter(task => task.status === 'In Progress');
  const pausedTasks = filteredTasks.filter(task => task.status === 'Paused');
  const completedTasks = filteredTasks.filter(task => task.status === 'Completed');

  const renderTaskItems = (taskList: Task[]) => {
    return taskList.map(task => (
      <TaskItem
        key={task.id}
        task={task}
        onStartTask={onStartTask}
        onPauseTask={onPauseTask}
        onCompleteTask={onCompleteTask}
        onDeleteTask={onDeleteTask}
        isActive={task.id === activeTaskId}
        elapsedTime={task.id === activeTaskId ? elapsedTime : undefined}
      />
    ));
  };

  return (
    <div className="my-4">
      {inProgressTasks.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2 text-blue-600 dark:text-blue-400">In Progress</h2>
          {renderTaskItems(inProgressTasks)}
        </div>
      )}
      
      {pausedTasks.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2 text-yellow-600 dark:text-yellow-400">Paused</h2>
          {renderTaskItems(pausedTasks)}
        </div>
      )}
      
      {notStartedTasks.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Not Started</h2>
          {renderTaskItems(notStartedTasks)}
        </div>
      )}
      
      {completedTasks.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-2 text-green-600 dark:text-green-400">Completed</h2>
          {renderTaskItems(completedTasks)}
        </div>
      )}
      
      {filteredTasks.length === 0 && tasks.length > 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No tasks match your filters. Try adjusting your search criteria.
        </div>
      )}
      
      {tasks.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No tasks yet. Create a new task to get started!
        </div>
      )}
    </div>
  );
};

export default TaskList;
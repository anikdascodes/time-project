import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { TaskFilter, TaskStatus, TaskPriority } from '../types/task';

interface TaskFiltersProps {
  filter: TaskFilter;
  onFilterChange: (newFilter: TaskFilter) => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({ filter, onFilterChange }) => {
  const handleStatusChange = (status: TaskStatus | 'All') => {
    onFilterChange({ ...filter, status });
  };

  const handlePriorityChange = (priority: TaskPriority | 'All') => {
    onFilterChange({ ...filter, priority });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filter, searchTerm: e.target.value });
  };

  const clearFilters = () => {
    onFilterChange({ status: 'All', priority: 'All', searchTerm: '' });
  };

  const isFiltering = filter.status !== 'All' || filter.priority !== 'All' || filter.searchTerm !== '';

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4 dark:bg-gray-800 dark:border dark:border-gray-700">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400 dark:text-gray-300" />
          </div>
          <input
            type="text"
            placeholder="Search tasks..."
            value={filter.searchTerm}
            onChange={handleSearchChange}
            className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              <Filter size={16} className="text-gray-400 dark:text-gray-300" />
            </div>
            <select
              value={filter.status}
              onChange={(e) => handleStatusChange(e.target.value as TaskStatus | 'All')}
              className="pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 appearance-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="All">All Statuses</option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Paused">Paused</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              <Filter size={16} className="text-gray-400 dark:text-gray-300" />
            </div>
            <select
              value={filter.priority}
              onChange={(e) => handlePriorityChange(e.target.value as TaskPriority | 'All')}
              className="pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 appearance-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
          
          {isFiltering && (
            <button
              onClick={clearFilters}
              className="flex items-center px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              <X size={16} className="mr-1" />
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;
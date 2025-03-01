export type TaskStatus = 'Not Started' | 'In Progress' | 'Paused' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface Task {
  id: string;
  title: string;
  description: string;
  estimatedTime: number; // in minutes
  status: TaskStatus;
  priority: TaskPriority;
  startTime?: Date;
  completionTime?: Date;
  activeTime: number; // in seconds
  breakDurations: Array<{ startTime: Date; endTime?: Date | null }>;
  lastPausedAt?: Date;
  dueDate?: Date;
  tags: string[];
}

export interface TimerState {
  activeTaskId: string | null;
  timeRemaining: number; // in seconds
  elapsedTime: number; // in seconds
}

export interface TaskFilter {
  status: TaskStatus | 'All';
  priority: TaskPriority | 'All';
  searchTerm: string;
}

export interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  totalEstimatedTime: number; // in minutes
  totalActiveTime: number; // in seconds
  totalBreakTime: number; // in seconds
}

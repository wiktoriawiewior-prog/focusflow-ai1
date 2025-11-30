export type TaskType = 'work' | 'study' | 'project';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  type: TaskType;
  description?: string;
  deadline?: Date;
  estimatedMinutes: number;
  priority: Priority;
  difficulty: Difficulty;
  status: TaskStatus;
  subtasks: SubTask[];
  completedAt?: Date;
  createdAt: Date;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  estimatedMinutes: number;
}

export interface TimeBlock {
  start: string;
  end: string;
  available: boolean;
}

export interface UserPreferences {
  dailyAvailableMinutes: number;
  peakFocusHours: { start: string; end: string }[];
  workingHours: { start: string; end: string };
  pomodoroLength: number;
  shortBreakLength: number;
  longBreakLength: number;
}

export interface ScheduledTask {
  taskId: string;
  date: Date;
  startTime: string;
  endTime: string;
  isBreak?: boolean;
  breakType?: 'short' | 'long';
}

export interface DailySchedule {
  date: Date;
  scheduledTasks: ScheduledTask[];
  totalMinutes: number;
  completionPercentage: number;
}

export interface Habit {
  id: string;
  name: string;
  streak: number;
  completedDates: Date[];
  createdAt: Date;
}

export interface ProductivityStats {
  mostProductiveHours: string[];
  averageCompletionRate: number;
  totalTasksCompleted: number;
  currentStreak: number;
}

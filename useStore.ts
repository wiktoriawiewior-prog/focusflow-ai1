import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, UserPreferences, DailySchedule, Habit, ProductivityStats } from '../types';

interface AppState {
  tasks: Task[];
  preferences: UserPreferences;
  schedules: DailySchedule[];
  habits: Habit[];
  stats: ProductivityStats;
  
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  
  setSchedules: (schedules: DailySchedule[]) => void;
  
  addHabit: (habit: Habit) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  completeHabitToday: (id: string) => void;
  
  updateStats: (stats: Partial<ProductivityStats>) => void;
}

const defaultPreferences: UserPreferences = {
  dailyAvailableMinutes: 480,
  peakFocusHours: [{ start: '09:00', end: '12:00' }],
  workingHours: { start: '08:00', end: '18:00' },
  pomodoroLength: 25,
  shortBreakLength: 5,
  longBreakLength: 15,
};

const defaultStats: ProductivityStats = {
  mostProductiveHours: [],
  averageCompletionRate: 0,
  totalTasksCompleted: 0,
  currentStreak: 0,
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      tasks: [],
      preferences: defaultPreferences,
      schedules: [],
      habits: [],
      stats: defaultStats,

      addTask: (task) =>
        set((state) => ({ tasks: [...state.tasks, task] })),

      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),

      deleteTask: (id) =>
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),

      completeTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, status: 'completed', completedAt: new Date() } : t
          ),
        })),

      updatePreferences: (prefs) =>
        set((state) => ({ preferences: { ...state.preferences, ...prefs } })),

      setSchedules: (schedules) => set({ schedules }),

      addHabit: (habit) =>
        set((state) => ({ habits: [...state.habits, habit] })),

      updateHabit: (id, updates) =>
        set((state) => ({
          habits: state.habits.map((h) => (h.id === id ? { ...h, ...updates } : h)),
        })),

      completeHabitToday: (id) =>
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id
              ? {
                  ...h,
                  completedDates: [...h.completedDates, new Date()],
                  streak: h.streak + 1,
                }
              : h
          ),
        })),

      updateStats: (stats) =>
        set((state) => ({ stats: { ...state.stats, ...stats } })),
    }),
    {
      name: 'focusflow-storage',
    }
  )
);

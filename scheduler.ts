import { Task, UserPreferences, DailySchedule, ScheduledTask } from '../types';
import { addDays, format, startOfDay, parseISO, differenceInMinutes } from 'date-fns';

export function generateSchedule(
  tasks: Task[],
  preferences: UserPreferences,
  startDate: Date,
  days: number
): DailySchedule[] {
  const schedules: DailySchedule[] = [];
  const pendingTasks = tasks
    .filter((t) => t.status !== 'completed')
    .sort((a, b) => {
      const urgencyA = calculateUrgency(a);
      const urgencyB = calculateUrgency(b);
      if (urgencyA !== urgencyB) return urgencyB - urgencyA;
      
      const priorityWeight = { urgent: 4, high: 3, medium: 2, low: 1 };
      const difficultyWeight = { hard: 3, medium: 2, easy: 1 };
      
      const scoreA = priorityWeight[a.priority] + difficultyWeight[a.difficulty];
      const scoreB = priorityWeight[b.priority] + difficultyWeight[b.difficulty];
      
      return scoreB - scoreA;
    });

  // Create a working copy with remaining minutes for each task
  const taskQueue = pendingTasks.map(t => ({
    ...t,
    remainingMinutes: t.estimatedMinutes
  }));
  
  for (let i = 0; i < days; i++) {
    const date = addDays(startDate, i);
    const scheduledTasks: ScheduledTask[] = [];
    let currentTime = parseTime(preferences.workingHours.start);
    const endTime = parseTime(preferences.workingHours.end);
    let dailyMinutes = 0;
    let pomodoroCount = 0;

    // Get tasks that still have remaining time
    const availableTasks = taskQueue.filter(t => t.remainingMinutes > 0);
    let taskIndex = 0;

    while (taskIndex < availableTasks.length && currentTime < endTime && dailyMinutes < preferences.dailyAvailableMinutes) {
      const task = availableTasks[taskIndex];
      const isPeakHour = isInPeakHours(formatTime(currentTime), preferences.peakFocusHours);
      
      // Skip hard tasks during non-peak hours if there are other tasks
      if (task.difficulty === 'hard' && !isPeakHour && taskIndex < availableTasks.length - 1) {
        taskIndex++;
        continue;
      }

      const timeUntilEnd = differenceInMinutes(endTime, currentTime);
      const dailyTimeLeft = preferences.dailyAvailableMinutes - dailyMinutes;
      
      if (timeUntilEnd < 15 || dailyTimeLeft < 15) break;

      const sessionMinutes = Math.min(
        task.remainingMinutes,
        preferences.pomodoroLength,
        timeUntilEnd,
        dailyTimeLeft
      );

      const sessionEnd = addMinutes(currentTime, sessionMinutes);

      scheduledTasks.push({
        taskId: task.id,
        date,
        startTime: formatTime(currentTime),
        endTime: formatTime(sessionEnd),
      });

      dailyMinutes += sessionMinutes;
      currentTime = sessionEnd;
      pomodoroCount++;

      // Reduce remaining time for this task
      task.remainingMinutes -= sessionMinutes;
      
      // If task is done, move to next task, otherwise continue with same task
      if (task.remainingMinutes <= 0) {
        taskIndex++;
      }

      // Add break after pomodoro
      const breakLength =
        pomodoroCount % 4 === 0
          ? preferences.longBreakLength
          : preferences.shortBreakLength;
      
      const breakEnd = addMinutes(currentTime, breakLength);
      if (breakEnd <= endTime && dailyMinutes + breakLength <= preferences.dailyAvailableMinutes) {
        scheduledTasks.push({
          taskId: `break-${i}-${pomodoroCount}`,
          date,
          startTime: formatTime(currentTime),
          endTime: formatTime(breakEnd),
          isBreak: true,
          breakType: pomodoroCount % 4 === 0 ? 'long' : 'short',
        });
        currentTime = breakEnd;
      }
    }

    schedules.push({
      date,
      scheduledTasks,
      totalMinutes: dailyMinutes,
      completionPercentage: 0,
    });
  }

  return schedules;
}

function calculateUrgency(task: Task): number {
  if (!task.deadline) return 0;
  const daysUntilDeadline = differenceInMinutes(task.deadline, new Date()) / (24 * 60);
  if (daysUntilDeadline < 0) return 100;
  if (daysUntilDeadline < 1) return 90;
  if (daysUntilDeadline < 3) return 70;
  if (daysUntilDeadline < 7) return 50;
  return 30;
}

function isInPeakHours(time: string, peakHours: { start: string; end: string }[]): boolean {
  const timeMinutes = parseTime(time);
  return peakHours.some((peak) => {
    const start = parseTime(peak.start);
    const end = parseTime(peak.end);
    return timeMinutes >= start && timeMinutes <= end;
  });
}

function parseTime(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

function addMinutes(time: number, minutes: number): number {
  return time + minutes;
}

export function breakDownTask(task: Task): Task {
  if (task.estimatedMinutes <= 60) return task;

  const numSubtasks = Math.ceil(task.estimatedMinutes / 45);
  const minutesPerSubtask = Math.floor(task.estimatedMinutes / numSubtasks);

  const subtasks = Array.from({ length: numSubtasks }, (_, i) => ({
    id: `${task.id}-sub-${i}`,
    title: `${task.title} - Part ${i + 1}`,
    completed: false,
    estimatedMinutes: minutesPerSubtask,
  }));

  return { ...task, subtasks };
}

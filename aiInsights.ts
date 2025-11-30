import { Task, ProductivityStats, UserPreferences } from '../types';
import { differenceInDays } from 'date-fns';

export function generateInsights(
  tasks: Task[],
  stats: ProductivityStats,
  preferences: UserPreferences
): string[] {
  const insights: string[] = [];
  const pendingTasks = tasks.filter((t) => t.status !== 'completed');
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  
  const urgentTasks = pendingTasks.filter((t) => {
    if (!t.deadline) return false;
    const daysLeft = differenceInDays(t.deadline, new Date());
    return daysLeft <= 2;
  });

  if (urgentTasks.length > 0) {
    insights.push(`⚠️ You have ${urgentTasks.length} urgent task${urgentTasks.length > 1 ? 's' : ''} due soon. Focus on these first!`);
  }

  const hardTasks = pendingTasks.filter((t) => t.difficulty === 'hard');
  if (hardTasks.length > 0) {
    insights.push(`💪 Schedule ${hardTasks.length} difficult task${hardTasks.length > 1 ? 's' : ''} during your peak focus hours (${preferences.peakFocusHours[0]?.start || '9:00'}-${preferences.peakFocusHours[0]?.end || '12:00'}) for best results.`);
  }

  const totalEstimatedMinutes = pendingTasks.reduce((sum, t) => sum + t.estimatedMinutes, 0);
  const daysNeeded = Math.ceil(totalEstimatedMinutes / preferences.dailyAvailableMinutes);
  
  if (daysNeeded > 7) {
    insights.push(`📅 Your current workload requires ${daysNeeded} days. Consider breaking down large tasks or adjusting priorities.`);
  }

  if (stats.averageCompletionRate < 50 && completedTasks.length > 5) {
    insights.push(`🎯 Your completion rate is ${Math.round(stats.averageCompletionRate)}%. Try reducing task estimates or increasing available time.`);
  }

  if (stats.currentStreak >= 3) {
    insights.push(`🔥 Amazing! You're on a ${stats.currentStreak}-day streak. Keep the momentum going!`);
  }

  const workTasks = pendingTasks.filter((t) => t.type === 'work').length;
  const studyTasks = pendingTasks.filter((t) => t.type === 'study').length;
  
  if (workTasks > studyTasks * 3 || studyTasks > workTasks * 3) {
    insights.push(`⚖️ Your tasks are heavily weighted toward ${workTasks > studyTasks ? 'work' : 'study'}. Consider balancing your schedule.`);
  }

  if (insights.length === 0) {
    insights.push(`✨ Great job! Your schedule looks balanced. Stay focused and take regular breaks.`);
  }

  return insights;
}

export function getMotivationalMessage(): string {
  const messages = [
    "🌟 Every small step forward is progress. You've got this!",
    "💡 Focus on one task at a time. Quality over quantity.",
    "🚀 Your future self will thank you for the work you do today.",
    "🎯 Consistency beats perfection. Keep showing up!",
    "⚡ Break time is productive time. Don't skip your breaks!",
    "🌈 Difficult tasks become easier when you break them down.",
    "🏆 You're building great habits. Stay committed!",
    "🔥 Peak performance comes from peak preparation.",
    "💪 Challenge yourself, but remember to rest and recharge.",
    "✨ Progress, not perfection. You're doing amazing!",
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
}

export function suggestOptimizations(tasks: Task[], preferences: UserPreferences): string[] {
  const suggestions: string[] = [];
  
  const longTasks = tasks.filter((t) => t.estimatedMinutes > 120 && t.subtasks.length === 0);
  if (longTasks.length > 0) {
    suggestions.push(`Break down ${longTasks.length} large task${longTasks.length > 1 ? 's' : ''} into smaller subtasks for better progress tracking.`);
  }

  const tasksWithoutDeadlines = tasks.filter((t) => !t.deadline && t.priority !== 'low');
  if (tasksWithoutDeadlines.length > 3) {
    suggestions.push(`Add deadlines to ${tasksWithoutDeadlines.length} tasks to improve planning accuracy.`);
  }

  if (preferences.pomodoroLength > 30) {
    suggestions.push(`Consider shorter focus sessions (25 min) for better concentration and less fatigue.`);
  }

  return suggestions;
}

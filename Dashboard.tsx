import React from 'react';
import { useStore } from '../store/useStore';
import { CheckCircle, Clock, TrendingUp, Flame } from 'lucide-react';

export default function Dashboard() {
  const tasks = useStore((state) => state.tasks);
  const stats = useStore((state) => state.stats);
  const schedules = useStore((state) => state.schedules);

  const pendingTasks = tasks.filter((t) => t.status !== 'completed');
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const totalEstimatedMinutes = pendingTasks.reduce((sum, t) => sum + t.estimatedMinutes, 0);
  
  const todaySchedule = schedules.find((s) => {
    const today = new Date();
    return s.date.toDateString() === today.toDateString();
  });

  const completionRate = tasks.length > 0 
    ? Math.round((completedTasks.length / tasks.length) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Clock size={32} />
            <span className="text-3xl font-bold">{pendingTasks.length}</span>
          </div>
          <div className="text-blue-100">Pending Tasks</div>
          <div className="text-sm text-blue-200 mt-1">
            ~{Math.round(totalEstimatedMinutes / 60)}h remaining
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle size={32} />
            <span className="text-3xl font-bold">{completedTasks.length}</span>
          </div>
          <div className="text-green-100">Completed Tasks</div>
          <div className="text-sm text-green-200 mt-1">{completionRate}% completion rate</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp size={32} />
            <span className="text-3xl font-bold">{stats.totalTasksCompleted}</span>
          </div>
          <div className="text-purple-100">Total Completed</div>
          <div className="text-sm text-purple-200 mt-1">All time</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Flame size={32} />
            <span className="text-3xl font-bold">{stats.currentStreak}</span>
          </div>
          <div className="text-orange-100">Current Streak</div>
          <div className="text-sm text-orange-200 mt-1">Days in a row</div>
        </div>
      </div>

      {todaySchedule && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-bold text-lg mb-3">Today's Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Scheduled Time</div>
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(todaySchedule.totalMinutes / 60)}h {todaySchedule.totalMinutes % 60}m
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Tasks Scheduled</div>
              <div className="text-2xl font-bold text-purple-600">
                {todaySchedule.scheduledTasks.filter((st) => !st.isBreak).length}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border p-6">
        <h3 className="font-bold text-lg mb-3">Quick Stats</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Work Tasks</span>
            <span className="font-semibold">{tasks.filter((t) => t.type === 'work').length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Study Tasks</span>
            <span className="font-semibold">{tasks.filter((t) => t.type === 'study').length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Project Tasks</span>
            <span className="font-semibold">{tasks.filter((t) => t.type === 'project').length}</span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t">
            <span className="text-gray-600">High Priority</span>
            <span className="font-semibold text-red-600">
              {tasks.filter((t) => t.priority === 'urgent' || t.priority === 'high').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

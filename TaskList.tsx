import React from 'react';
import { Task } from '../types';
import { useStore } from '../store/useStore';
import { CheckCircle2, Circle, Clock, AlertCircle, Trash2 } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

export default function TaskList() {
  const tasks = useStore((state) => state.tasks);
  const completeTask = useStore((state) => state.completeTask);
  const deleteTask = useStore((state) => state.deleteTask);

  const pendingTasks = tasks.filter((t) => t.status !== 'completed');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  const getPriorityColor = (priority: string) => {
    const colors = {
      urgent: 'text-red-600 bg-red-50',
      high: 'text-orange-600 bg-orange-50',
      medium: 'text-yellow-600 bg-yellow-50',
      low: 'text-green-600 bg-green-50',
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getDifficultyIcon = (difficulty: string) => {
    const icons = { easy: '●', medium: '●●', hard: '●●●' };
    return icons[difficulty as keyof typeof icons] || '●';
  };

  const getDeadlineStatus = (deadline?: Date) => {
    if (!deadline) return null;
    const days = differenceInDays(deadline, new Date());
    if (days < 0) return { text: 'Overdue', color: 'text-red-600' };
    if (days === 0) return { text: 'Today', color: 'text-orange-600' };
    if (days === 1) return { text: 'Tomorrow', color: 'text-yellow-600' };
    return { text: `${days} days`, color: 'text-gray-600' };
  };

  const TaskItem = ({ task }: { task: Task }) => {
    const deadlineStatus = getDeadlineStatus(task.deadline);
    
    return (
      <div className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow">
        <div className="flex items-start gap-3">
          <button
            onClick={() => completeTask(task.id)}
            className="mt-1 text-gray-400 hover:text-green-600"
          >
            {task.status === 'completed' ? (
              <CheckCircle2 size={24} className="text-green-600" />
            ) : (
              <Circle size={24} />
            )}
          </button>

          <div className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className={`font-semibold ${task.status === 'completed' ? 'line-through text-gray-400' : ''}`}>
                {task.title}
              </h3>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-gray-400 hover:text-red-600"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {task.description && (
              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
            )}

            <div className="flex flex-wrap gap-2 mt-2">
              <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
              <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
                {task.type}
              </span>
              <span className="text-xs px-2 py-1 rounded bg-purple-50 text-purple-700">
                {getDifficultyIcon(task.difficulty)} {task.difficulty}
              </span>
              <span className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700 flex items-center gap-1">
                <Clock size={12} />
                {task.estimatedMinutes} min
              </span>
              {deadlineStatus && (
                <span className={`text-xs px-2 py-1 rounded bg-gray-50 flex items-center gap-1 ${deadlineStatus.color}`}>
                  <AlertCircle size={12} />
                  {deadlineStatus.text}
                </span>
              )}
            </div>

            {task.subtasks.length > 0 && (
              <div className="mt-2 text-xs text-gray-500">
                {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length} subtasks completed
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {pendingTasks.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-3">Pending Tasks ({pendingTasks.length})</h2>
          <div className="space-y-2">
            {pendingTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {completedTasks.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-3">Completed Tasks ({completedTasks.length})</h2>
          <div className="space-y-2">
            {completedTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {tasks.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No tasks yet. Add your first task to get started!</p>
        </div>
      )}
    </div>
  );
}

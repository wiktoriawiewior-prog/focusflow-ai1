import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { generateSchedule } from '../utils/scheduler';
import { format, addDays } from 'date-fns';
import { Calendar, Clock, Coffee, Zap } from 'lucide-react';

export default function Schedule() {
  const tasks = useStore((state) => state.tasks);
  const preferences = useStore((state) => state.preferences);
  const schedules = useStore((state) => state.schedules);
  const setSchedules = useStore((state) => state.setSchedules);
  const [viewDays, setViewDays] = useState(7);

  const handleGenerate = () => {
    const newSchedules = generateSchedule(tasks, preferences, new Date(), viewDays);
    setSchedules(newSchedules);
  };

  const getTaskById = (id: string) => tasks.find((t) => t.id === id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Schedule</h2>
        <div className="flex gap-2">
          <select
            value={viewDays}
            onChange={(e) => setViewDays(Number(e.target.value))}
            className="px-3 py-2 border rounded-lg"
          >
            <option value={1}>Today</option>
            <option value={7}>This Week</option>
            <option value={30}>This Month</option>
          </select>
          <button
            onClick={handleGenerate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Zap size={18} />
            Generate Schedule
          </button>
        </div>
      </div>

      {schedules.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Calendar size={48} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600">No schedule generated yet.</p>
          <p className="text-sm text-gray-500 mt-1">Add tasks and click "Generate Schedule" to create your plan.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {schedules.map((schedule, idx) => (
            <div key={idx} className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Calendar size={20} />
                  {format(schedule.date, 'EEEE, MMMM d, yyyy')}
                </h3>
                <div className="text-sm text-gray-600">
                  {schedule.totalMinutes} minutes scheduled
                </div>
              </div>

              <div className="space-y-2">
                {schedule.scheduledTasks.map((st, stIdx) => {
                  if (st.isBreak) {
                    return (
                      <div
                        key={stIdx}
                        className="flex items-center gap-3 p-3 bg-green-50 rounded border-l-4 border-green-400"
                      >
                        <Coffee size={18} className="text-green-600" />
                        <div className="flex-1">
                          <div className="font-medium text-green-800">
                            {st.breakType === 'long' ? 'Long Break' : 'Short Break'}
                          </div>
                        </div>
                        <div className="text-sm text-green-700 flex items-center gap-1">
                          <Clock size={14} />
                          {st.startTime} - {st.endTime}
                        </div>
                      </div>
                    );
                  }

                  const task = getTaskById(st.taskId);
                  if (!task) return null;

                  return (
                    <div
                      key={stIdx}
                      className="flex items-center gap-3 p-3 bg-blue-50 rounded border-l-4 border-blue-400"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{task.title}</div>
                        <div className="text-xs text-gray-600 mt-1">
                          {task.type} • {task.priority} priority • {task.difficulty} difficulty
                        </div>
                      </div>
                      <div className="text-sm text-blue-700 flex items-center gap-1">
                        <Clock size={14} />
                        {st.startTime} - {st.endTime}
                      </div>
                    </div>
                  );
                })}

                {schedule.scheduledTasks.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No tasks scheduled for this day</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

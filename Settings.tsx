import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Settings as SettingsIcon, Save } from 'lucide-react';

export default function Settings() {
  const preferences = useStore((state) => state.preferences);
  const updatePreferences = useStore((state) => state.updatePreferences);

  const [dailyMinutes, setDailyMinutes] = useState(preferences.dailyAvailableMinutes);
  const [workStart, setWorkStart] = useState(preferences.workingHours.start);
  const [workEnd, setWorkEnd] = useState(preferences.workingHours.end);
  const [peakStart, setPeakStart] = useState(preferences.peakFocusHours[0]?.start || '09:00');
  const [peakEnd, setPeakEnd] = useState(preferences.peakFocusHours[0]?.end || '12:00');
  const [pomodoroLength, setPomodoroLength] = useState(preferences.pomodoroLength);
  const [shortBreak, setShortBreak] = useState(preferences.shortBreakLength);
  const [longBreak, setLongBreak] = useState(preferences.longBreakLength);

  const handleSave = () => {
    updatePreferences({
      dailyAvailableMinutes: dailyMinutes,
      workingHours: { start: workStart, end: workEnd },
      peakFocusHours: [{ start: peakStart, end: peakEnd }],
      pomodoroLength,
      shortBreakLength: shortBreak,
      longBreakLength: longBreak,
    });
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <SettingsIcon size={28} />
        Settings
      </h2>

      <div className="bg-white rounded-lg border p-6 space-y-6">
        <div>
          <h3 className="font-bold text-lg mb-4">Daily Availability</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Available Minutes Per Day: {dailyMinutes} min ({(dailyMinutes / 60).toFixed(1)} hours)
              </label>
              <input
                type="range"
                min="60"
                max="720"
                step="30"
                value={dailyMinutes}
                onChange={(e) => setDailyMinutes(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Working Hours Start</label>
                <input
                  type="time"
                  value={workStart}
                  onChange={(e) => setWorkStart(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Working Hours End</label>
                <input
                  type="time"
                  value={workEnd}
                  onChange={(e) => setWorkEnd(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-4">Peak Focus Hours</h3>
          <p className="text-sm text-gray-600 mb-3">
            Schedule difficult tasks during these hours for maximum productivity
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Peak Start</label>
              <input
                type="time"
                value={peakStart}
                onChange={(e) => setPeakStart(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Peak End</label>
              <input
                type="time"
                value={peakEnd}
                onChange={(e) => setPeakEnd(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-4">Focus Sessions (Pomodoro)</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Focus Session Length: {pomodoroLength} minutes
              </label>
              <input
                type="range"
                min="15"
                max="60"
                step="5"
                value={pomodoroLength}
                onChange={(e) => setPomodoroLength(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Short Break: {shortBreak} min
                </label>
                <input
                  type="range"
                  min="3"
                  max="10"
                  value={shortBreak}
                  onChange={(e) => setShortBreak(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Long Break: {longBreak} min
                </label>
                <input
                  type="range"
                  min="10"
                  max="30"
                  step="5"
                  value={longBreak}
                  onChange={(e) => setLongBreak(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
        >
          <Save size={20} />
          Save Settings
        </button>
      </div>
    </div>
  );
}

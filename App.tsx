import React, { useState } from 'react';
import { LayoutDashboard, ListTodo, Lightbulb, Settings as SettingsIcon, Plus } from 'lucide-react';
import Dashboard from './components/Dashboard';
import TaskList from './components/TaskList';
import Insights from './components/Insights';
import Settings from './components/Settings';
import TaskForm from './components/TaskForm';

type View = 'dashboard' | 'tasks' | 'insights' | 'settings';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [showTaskForm, setShowTaskForm] = useState(false);

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks', icon: ListTodo },
    { id: 'insights', label: 'AI Insights', icon: Lightbulb },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <nav className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg sm:text-xl">F</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold">FocusFlow AI</h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'tasks' && <TaskList />}
        {currentView === 'insights' && <Insights />}
        {currentView === 'settings' && <Settings />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-40 safe-area-bottom">
        <div className="flex items-center justify-around h-16 max-w-7xl mx-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as View)}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 flex-1 transition-colors ${
                  currentView === item.id
                    ? 'text-blue-600'
                    : 'text-gray-600'
                }`}
              >
                <Icon size={22} />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <button
        onClick={() => setShowTaskForm(true)}
        className="fixed bottom-20 right-4 sm:right-6 bg-blue-600 text-white p-3 sm:p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-30"
      >
        <Plus size={24} />
      </button>

      {showTaskForm && <TaskForm onClose={() => setShowTaskForm(false)} />}
    </div>
  );
}

export default App;

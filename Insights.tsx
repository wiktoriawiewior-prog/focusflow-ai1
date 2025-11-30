import React from 'react';
import { useStore } from '../store/useStore';
import { generateInsights, getMotivationalMessage, suggestOptimizations } from '../utils/aiInsights';
import { Lightbulb, TrendingUp, Target } from 'lucide-react';

export default function Insights() {
  const tasks = useStore((state) => state.tasks);
  const stats = useStore((state) => state.stats);
  const preferences = useStore((state) => state.preferences);

  const insights = generateInsights(tasks, stats, preferences);
  const motivationalMsg = getMotivationalMessage();
  const optimizations = suggestOptimizations(tasks, preferences);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">AI Insights</h2>

      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Target size={24} />
          <h3 className="font-bold text-lg">Daily Motivation</h3>
        </div>
        <p className="text-lg">{motivationalMsg}</p>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb size={24} className="text-yellow-500" />
          <h3 className="font-bold text-lg">Smart Insights</h3>
        </div>
        <div className="space-y-3">
          {insights.map((insight, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-blue-50 rounded">
              <div className="text-blue-600 mt-0.5">•</div>
              <p className="flex-1 text-gray-700">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {optimizations.length > 0 && (
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={24} className="text-green-500" />
            <h3 className="font-bold text-lg">Optimization Suggestions</h3>
          </div>
          <div className="space-y-3">
            {optimizations.map((suggestion, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-green-50 rounded">
                <div className="text-green-600 mt-0.5">→</div>
                <p className="flex-1 text-gray-700">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import { Task } from '../App';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Rocket, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface ProductProgressProps {
  progress: number;
  tasks: Task[];
}

export function ProductProgress({ progress, tasks }: ProductProgressProps) {
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const totalTasks = tasks.length;

  const milestones = [
    { name: 'MVP Planning', threshold: 10, completed: progress >= 10 },
    { name: 'Core Features', threshold: 25, completed: progress >= 25 },
    { name: 'Design System', threshold: 40, completed: progress >= 40 },
    { name: 'Beta Testing', threshold: 60, completed: progress >= 60 },
    { name: 'Marketing Launch', threshold: 75, completed: progress >= 75 },
    { name: 'Public Release', threshold: 100, completed: progress >= 100 }
  ];

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Rocket className="w-5 h-5 text-slate-600" />
          <h2 className="text-slate-900">Product Development</h2>
        </div>

        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-700">Overall Progress</span>
            <span className="text-slate-900">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-900">Completed</span>
            </div>
            <p className="text-green-900">{completedTasks} tasks</p>
          </Card>

          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-900">In Progress</span>
            </div>
            <p className="text-blue-900">{inProgressTasks} tasks</p>
          </Card>

          <Card className="p-4 bg-slate-50 border-slate-200">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-4 h-4 text-slate-600" />
              <span className="text-sm text-slate-900">Total</span>
            </div>
            <p className="text-slate-900">{totalTasks} tasks</p>
          </Card>
        </div>

        {/* Milestones */}
        <div className="space-y-3">
          <h3 className="text-slate-900">Development Milestones</h3>
          <div className="space-y-2">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  milestone.completed ? 'bg-green-50' : 'bg-slate-50'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  milestone.completed ? 'bg-green-500' : 'bg-slate-300'
                }`}>
                  {milestone.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  ) : (
                    <span className="text-xs text-white">{index + 1}</span>
                  )}
                </div>
                <span className={`flex-1 ${
                  milestone.completed ? 'text-green-900' : 'text-slate-600'
                }`}>
                  {milestone.name}
                </span>
                <span className={`text-sm ${
                  milestone.completed ? 'text-green-600' : 'text-slate-500'
                }`}>
                  {milestone.threshold}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {progress >= 100 && (
          <div className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-center">
            <p className="text-white">🎉 Product Launch Complete! Congratulations to the team! 🎉</p>
          </div>
        )}
      </div>
    </Card>
  );
}

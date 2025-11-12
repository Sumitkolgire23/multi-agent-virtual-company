import { Agent } from '../App';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle2 } from 'lucide-react';

interface AgentCardProps {
  agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
  const statusColors = {
    active: 'bg-green-500',
    idle: 'bg-gray-400',
    thinking: 'bg-yellow-500',
    meeting: 'bg-blue-500'
  };

  const statusLabels = {
    active: 'Active',
    idle: 'Idle',
    thinking: 'Thinking',
    meeting: 'Meeting'
  };

  return (
    <Card className="p-3 hover:shadow-md transition-shadow bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <div className="text-3xl flex-shrink-0">{agent.avatar}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <h3 className="text-sm text-slate-900 dark:text-white truncate">{agent.name}</h3>
              <div className={`w-1.5 h-1.5 rounded-full ${statusColors[agent.status]} ${agent.status === 'thinking' ? 'animate-pulse' : ''}`} />
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">{agent.role}</p>
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-500 italic line-clamp-2 leading-relaxed">
          {agent.personality}
        </p>

        <div className="flex items-center gap-1.5 pt-1.5 border-t border-slate-200 dark:border-slate-800">
          <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-500 flex-shrink-0" />
          <span className="text-xs text-slate-600 dark:text-slate-400">
            {agent.tasksCompleted} tasks completed
          </span>
        </div>
      </div>
    </Card>
  );
}

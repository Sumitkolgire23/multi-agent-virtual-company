import { Task, Agent } from '../App';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ClipboardList, Bug, Palette, TrendingUp, Lightbulb } from 'lucide-react';

interface TaskBoardProps {
  tasks: Task[];
  agents: Agent[];
  onUpdateStatus: (taskId: string, status: Task['status']) => void;
}

const columns: { status: Task['status']; label: string; color: string }[] = [
  { status: 'backlog', label: 'Backlog', color: 'bg-slate-100' },
  { status: 'in-progress', label: 'In Progress', color: 'bg-blue-100' },
  { status: 'review', label: 'Review', color: 'bg-yellow-100' },
  { status: 'done', label: 'Done', color: 'bg-green-100' }
];

export function TaskBoard({ tasks, agents, onUpdateStatus }: TaskBoardProps) {
  const getAgentById = (id: string) => {
    return agents.find(a => a.id === id);
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
    }
  };

  const getTaskTypeIcon = (type: Task['type']) => {
    switch (type) {
      case 'bug':
        return <Bug className="w-3 h-3" />;
      case 'design':
        return <Palette className="w-3 h-3" />;
      case 'marketing':
        return <TrendingUp className="w-3 h-3" />;
      case 'planning':
        return <Lightbulb className="w-3 h-3" />;
      case 'documentation':
        return <ClipboardList className="w-3 h-3" />;
      case 'financial':
        return <TrendingUp className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getTaskTypeColor = (type: Task['type']) => {
    switch (type) {
      case 'bug':
        return 'bg-red-50 border-red-200';
      case 'design':
        return 'bg-purple-50 border-purple-200';
      case 'marketing':
        return 'bg-blue-50 border-blue-200';
      case 'planning':
        return 'bg-yellow-50 border-yellow-200';
      case 'documentation':
        return 'bg-cyan-50 border-cyan-200';
      case 'financial':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <ClipboardList className="w-5 h-5 text-slate-600" />
        <h2 className="text-slate-900">Task Board</h2>
        <Badge variant="secondary" className="ml-auto">{tasks.length} total tasks</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map(column => {
          const columnTasks = tasks.filter(t => t.status === column.status);
          
          return (
            <div key={column.status} className="space-y-3">
              <div className={`p-3 rounded-lg ${column.color}`}>
                <h3 className="text-slate-900">{column.label}</h3>
                <span className="text-sm text-slate-600">{columnTasks.length} tasks</span>
              </div>

              <div className="space-y-2 min-h-[300px]">
                {columnTasks.map(task => {
                  const assignedAgent = getAgentById(task.assignedTo);
                  const creatorAgent = getAgentById(task.createdBy);
                  
                  return (
                    <Card
                      key={task.id}
                      className={`p-3 hover:shadow-md transition-shadow cursor-pointer ${getTaskTypeColor(task.type)}`}
                      onClick={() => {
                        const statuses: Task['status'][] = ['backlog', 'in-progress', 'review', 'done'];
                        const currentIndex = statuses.indexOf(task.status);
                        if (currentIndex < statuses.length - 1) {
                          onUpdateStatus(task.id, statuses[currentIndex + 1]);
                        }
                      }}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1 flex-1">
                            {getTaskTypeIcon(task.type)}
                            <h4 className="text-sm text-slate-900">{task.title}</h4>
                          </div>
                          <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </Badge>
                        </div>
                        
                        <p className="text-xs text-slate-600">{task.description}</p>
                        
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center gap-1">
                            <span className="text-lg">{assignedAgent?.avatar}</span>
                            <span className="text-xs text-slate-500">{assignedAgent?.name}</span>
                          </div>
                          <span className="text-xs text-slate-400">by {creatorAgent?.avatar}</span>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No tasks yet. Start the simulation to see tasks being created!</p>
        </div>
      )}
    </Card>
  );
}

import { useEffect, useRef, useMemo } from 'react';
import { Message, Agent } from '../App';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { MessageSquare, CheckCircle2, AlertCircle } from 'lucide-react';

interface ChatPanelProps {
  messages: Message[];
  agents: Agent[];
  showTimestamps?: boolean;
  compactMode?: boolean;
}

export function ChatPanel({ messages, agents, showTimestamps = true, compactMode = false }: ChatPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const agentMap = useMemo(() => {
    return new Map(agents.map(a => [a.id, a]));
  }, [agents]);

  const getAgentById = (id: string) => {
    return agentMap.get(id);
  };

  const getMessageIcon = (type: Message['type']) => {
    switch (type) {
      case 'task':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'decision':
        return <AlertCircle className="w-4 h-4" />;
      case 'bug':
        return <AlertCircle className="w-4 h-4" />;
      case 'pr':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'meeting':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getMessageBadgeColor = (type: Message['type']) => {
    switch (type) {
      case 'task':
        return 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300';
      case 'decision':
        return 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300';
      case 'bug':
        return 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300';
      case 'pr':
        return 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300';
      case 'meeting':
        return 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
    }
  };

  // Show only last 100 messages for performance
  const displayMessages = useMemo(() => {
    return messages.slice(-100);
  }, [messages]);

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <h2 className="text-slate-900 dark:text-white">Team Communication</h2>
          <Badge variant="secondary" className="ml-auto">{messages.length} messages</Badge>
        </div>

        <div ref={containerRef} className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {displayMessages.length === 0 ? (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Start the simulation to see team communication</p>
            </div>
          ) : (
            displayMessages.map((message) => {
              const agent = getAgentById(message.agentId);
              return (
                <div
                  key={message.id}
                  className={`flex gap-3 ${compactMode ? 'p-2' : 'p-4'} bg-slate-50 dark:bg-slate-900 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors`}
                >
                  <div className={`${compactMode ? 'text-xl' : 'text-2xl'} flex-shrink-0`}>{agent?.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`${compactMode ? 'text-sm' : ''} text-slate-900 dark:text-white`}>{message.agentName}</span>
                      {showTimestamps && (
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      )}
                      <Badge className={`gap-1 text-xs ${getMessageBadgeColor(message.type)}`}>
                        {getMessageIcon(message.type)}
                        {message.type}
                      </Badge>
                    </div>
                    <p className={`${compactMode ? 'text-sm' : ''} text-slate-700 dark:text-slate-300`}>{message.content}</p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </Card>
  );
}
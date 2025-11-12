import { OKR, Agent } from '../App';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Target, CheckCircle2 } from 'lucide-react';

interface OKRPanelProps {
  okrs: OKR[];
  agents: Agent[];
}

export function OKRPanel({ okrs, agents }: OKRPanelProps) {
  const getAgentById = (id: string) => {
    return agents.find(a => a.id === id);
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-slate-600" />
          <h2 className="text-slate-900">Objectives & Key Results (OKRs)</h2>
        </div>

        {okrs.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Target className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No OKRs set yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {okrs.map(okr => {
              const owner = getAgentById(okr.owner);
              const isComplete = okr.progress >= 100;
              
              return (
                <Card
                  key={okr.id}
                  className={`p-5 border-2 ${isComplete ? 'bg-green-50 border-green-200' : 'border-slate-200'}`}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="w-5 h-5 text-blue-600" />
                          <h3 className="text-slate-900">{okr.objective}</h3>
                          {isComplete && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                        </div>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xl">{owner?.avatar}</span>
                          <span className="text-sm text-slate-600">Owner: {owner?.name}</span>
                        </div>
                      </div>
                      
                      <Badge 
                        className={isComplete ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}
                      >
                        {Math.round(okr.progress)}%
                      </Badge>
                    </div>

                    <Progress value={okr.progress} className="h-2" />

                    <div className="space-y-2">
                      <p className="text-sm text-slate-700">Key Results:</p>
                      <ul className="space-y-1">
                        {okr.keyResults.map((kr, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                            <CheckCircle2 
                              className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                                okr.progress > (index + 1) * (100 / okr.keyResults.length) 
                                  ? 'text-green-600' 
                                  : 'text-slate-300'
                              }`}
                            />
                            <span>{kr}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}

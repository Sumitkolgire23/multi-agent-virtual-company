import { TimelineEvent } from '../App';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, Rocket, Code, UserPlus, DollarSign, Star } from 'lucide-react';

interface TimelinePanelProps {
  events: TimelineEvent[];
}

export function TimelinePanel({ events }: TimelinePanelProps) {
  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'milestone':
        return <Star className="w-5 h-5 text-purple-600" />;
      case 'feature':
        return <Code className="w-5 h-5 text-blue-600" />;
      case 'hire':
        return <UserPlus className="w-5 h-5 text-green-600" />;
      case 'funding':
        return <DollarSign className="w-5 h-5 text-yellow-600" />;
      case 'launch':
        return <Rocket className="w-5 h-5 text-red-600" />;
    }
  };

  const getEventColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'milestone':
        return 'border-purple-200 bg-purple-50';
      case 'feature':
        return 'border-blue-200 bg-blue-50';
      case 'hire':
        return 'border-green-200 bg-green-50';
      case 'funding':
        return 'border-yellow-200 bg-yellow-50';
      case 'launch':
        return 'border-red-200 bg-red-50';
    }
  };

  const getImpactBadge = (impact: TimelineEvent['impact']) => {
    const colors = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-green-100 text-green-700'
    };

    return (
      <Badge className={colors[impact]}>
        {impact.toUpperCase()}
      </Badge>
    );
  };

  const groupByMonth = (events: TimelineEvent[]) => {
    const grouped: { [key: string]: TimelineEvent[] } = {};
    
    events.forEach(event => {
      const monthKey = event.date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      grouped[monthKey].push(event);
    });

    return grouped;
  };

  const groupedEvents = groupByMonth(events);
  const sortedMonths = Object.keys(groupedEvents).sort((a, b) => {
    const dateA = new Date(groupedEvents[a][0].date);
    const dateB = new Date(groupedEvents[b][0].date);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-slate-600" />
          <h2 className="text-slate-900">Company Timeline</h2>
          <Badge variant="secondary" className="ml-auto">{events.length} events</Badge>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No events yet. Start the simulation to build your company history!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {sortedMonths.map(month => (
              <div key={month} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
                  <h3 className="text-slate-900 bg-white px-3">{month}</h3>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
                </div>

                <div className="space-y-3 pl-4 border-l-2 border-slate-200">
                  {groupedEvents[month]
                    .sort((a, b) => b.date.getTime() - a.date.getTime())
                    .map(event => (
                      <Card
                        key={event.id}
                        className={`p-4 border-2 ${getEventColor(event.type)} ml-4 relative`}
                      >
                        <div className="absolute -left-[41px] top-4 bg-white p-1 rounded-full border-2 border-slate-200">
                          {getEventIcon(event.type)}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <h4 className="text-slate-900 mb-1">{event.title}</h4>
                              <p className="text-sm text-slate-600">{event.description}</p>
                            </div>
                            {getImpactBadge(event.impact)}
                          </div>

                          <div className="flex items-center gap-4 pt-2 border-t text-xs text-slate-500">
                            <span>
                              {event.date.toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                            <Badge variant="outline" className="text-xs capitalize">
                              {event.type}
                            </Badge>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {events.length > 0 && (
          <Card className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 border-2">
            <h3 className="text-slate-900 mb-3">Timeline Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {['milestone', 'feature', 'hire', 'funding', 'launch'].map(type => {
                const count = events.filter(e => e.type === type).length;
                return (
                  <div key={type} className="text-center p-3 bg-white rounded-lg border">
                    {getEventIcon(type as TimelineEvent['type'])}
                    <p className="text-xs text-slate-600 mt-1 capitalize">{type}s</p>
                    <p className="text-slate-900">{count}</p>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </Card>
  );
}

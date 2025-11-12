import { Target, TrendingUp, TrendingDown, Flame, Zap, AlertTriangle, Trophy } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Competitor {
  id: string;
  name: string;
  marketShare: number;
  strength: number;
  recentLaunch?: string;
  trend: 'up' | 'down' | 'stable';
}

interface MarketEvent {
  id: string;
  type: 'trend' | 'competitor' | 'crisis' | 'opportunity';
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  severity: number;
  date: Date;
}

interface MarketSimulationProps {
  competitors: Competitor[];
  marketEvents: MarketEvent[];
  marketShare: number;
  industry: string;
  totalMarketSize: number;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function MarketSimulation({ 
  competitors, 
  marketEvents, 
  marketShare, 
  industry,
  totalMarketSize 
}: MarketSimulationProps) {

  // Market share distribution
  const marketShareData = [
    { name: 'Your Company', value: marketShare, color: '#3b82f6' },
    ...competitors.map((c, i) => ({ 
      name: c.name, 
      value: c.marketShare,
      color: COLORS[i + 1] || '#94a3b8'
    }))
  ];

  // Market growth trend
  const marketGrowthData = [
    { month: 'Jan', size: totalMarketSize * 0.7, yourShare: marketShare * 0.5 },
    { month: 'Feb', size: totalMarketSize * 0.75, yourShare: marketShare * 0.6 },
    { month: 'Mar', size: totalMarketSize * 0.82, yourShare: marketShare * 0.75 },
    { month: 'Apr', size: totalMarketSize * 0.88, yourShare: marketShare * 0.85 },
    { month: 'May', size: totalMarketSize * 0.94, yourShare: marketShare * 0.92 },
    { month: 'Jun', size: totalMarketSize, yourShare: marketShare }
  ];

  // Market position
  const yourRank = competitors.filter(c => c.marketShare > marketShare).length + 1;
  const totalCompetitors = competitors.length + 1;

  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Market Share</p>
              <p className="mt-2 text-3xl">{marketShare.toFixed(1)}%</p>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="size-3" /> +2.3% this month
              </p>
            </div>
            <Target className="size-5 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Market Rank</p>
              <p className="mt-2 text-3xl">#{yourRank}</p>
              <p className="text-xs text-muted-foreground mt-1">
                of {totalCompetitors} companies
              </p>
            </div>
            <Trophy className={`size-5 ${yourRank <= 3 ? 'text-yellow-500' : 'text-gray-400'}`} />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Market Size</p>
              <p className="mt-2 text-2xl">${(totalMarketSize / 1000000).toFixed(1)}M</p>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="size-3" /> Growing market
              </p>
            </div>
            <Zap className="size-5 text-purple-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Industry</p>
              <p className="mt-2 text-xl">{industry}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {competitors.length} active competitors
              </p>
            </div>
            <Flame className="size-5 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Market Share Chart */}
      <Card className="p-6">
        <h3 className="mb-4">Market Share Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={marketShareData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {marketShareData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="space-y-3">
            {marketShareData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm">{item.name}</span>
                </div>
                <span className="font-medium">{item.value.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Market Growth */}
      <Card className="p-6">
        <h3 className="mb-4">Market Growth & Your Position</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={marketGrowthData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="size" stackId="1" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.3} name="Total Market ($M)" />
            <Area type="monotone" dataKey="yourShare" stackId="2" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Your Share (%)" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Competitors */}
      <Card className="p-6">
        <h3 className="mb-4">Competitor Analysis</h3>
        <div className="space-y-4">
          {competitors.map((competitor) => (
            <div key={competitor.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{competitor.name}</h4>
                    {competitor.trend === 'up' && <TrendingUp className="size-4 text-green-500" />}
                    {competitor.trend === 'down' && <TrendingDown className="size-4 text-red-500" />}
                  </div>
                  {competitor.recentLaunch && (
                    <p className="text-sm text-orange-500 mt-1">
                      🚀 Recently launched: {competitor.recentLaunch}
                    </p>
                  )}
                </div>
                <Badge variant={competitor.strength > 70 ? 'default' : 'secondary'}>
                  {competitor.strength > 70 ? 'Strong' : competitor.strength > 40 ? 'Medium' : 'Weak'}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Market Share</p>
                  <Progress value={competitor.marketShare * 2} className="h-2" />
                  <p className="mt-1 font-medium">{competitor.marketShare.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Competitive Strength</p>
                  <Progress value={competitor.strength} className="h-2" />
                  <p className="mt-1 font-medium">{competitor.strength}/100</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Market Events */}
      <Card className="p-6">
        <h3 className="mb-4">Recent Market Events</h3>
        <div className="space-y-3">
          {marketEvents.slice(0, 5).map((event) => (
            <div key={event.id} className="flex gap-3 border-l-4 pl-4 py-2" 
              style={{ 
                borderColor: event.impact === 'positive' ? '#10b981' : 
                            event.impact === 'negative' ? '#ef4444' : '#94a3b8' 
              }}>
              <div className="flex-shrink-0 mt-1">
                {event.type === 'trend' && <TrendingUp className="size-4" />}
                {event.type === 'competitor' && <Target className="size-4" />}
                {event.type === 'crisis' && <AlertTriangle className="size-4 text-red-500" />}
                {event.type === 'opportunity' && <Zap className="size-4 text-yellow-500" />}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-sm">{event.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                  </div>
                  <Badge variant={event.impact === 'positive' ? 'default' : event.impact === 'negative' ? 'destructive' : 'secondary'}>
                    {event.impact}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {event.date.toLocaleDateString()} • Impact: {event.severity}/10
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

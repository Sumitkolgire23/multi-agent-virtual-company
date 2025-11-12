import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, TrendingDown, Zap, Target, DollarSign, Users, Calendar, Award } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import type { Agent, Task, FinancialRecord, TimelineEvent } from '../App';

interface AnalyticsProps {
  agents: Agent[];
  tasks: Task[];
  financialRecords: FinancialRecord[];
  timeline: TimelineEvent[];
  currentDate: Date;
  productProgress: number;
  metrics: {
    tasksCompleted: number;
    features: number;
    bugs: number;
    prsOpened: number;
    prsMerged: number;
    users: number;
    revenue: number;
    testCoverage: number;
    docsPages: number;
  };
}

interface Snapshot {
  date: Date;
  metrics: any;
  productProgress: number;
  revenue: number;
  users: number;
  tasksCompleted: number;
}

export function AdvancedAnalytics({ agents, tasks, financialRecords, timeline, currentDate, productProgress, metrics }: AnalyticsProps) {
  
  // Calculate velocity over time (tasks per sprint)
  const calculateVelocity = () => {
    const sprints: { [key: string]: number } = {};
    tasks.forEach(task => {
      if (task.status === 'done') {
        const sprint = Math.floor(Math.random() * 5); // Simplified sprint assignment
        const sprintKey = `Sprint ${sprint + 1}`;
        sprints[sprintKey] = (sprints[sprintKey] || 0) + 1;
      }
    });
    
    return Object.entries(sprints).map(([name, completed]) => ({
      name,
      completed,
      planned: Math.floor(completed * 1.2)
    }));
  };

  // Calculate agent performance
  const calculateAgentPerformance = () => {
    return agents.map(agent => ({
      name: agent.name,
      tasks: agent.tasksCompleted,
      efficiency: Math.min(100, agent.tasksCompleted * 8 + Math.random() * 20),
      quality: Math.min(100, 70 + Math.random() * 30),
      collaboration: Math.min(100, 60 + Math.random() * 40),
    }));
  };

  // Calculate burndown data
  const calculateBurndown = () => {
    const totalTasks = tasks.length;
    const daysInSprint = 14;
    const data = [];
    
    for (let day = 0; day <= daysInSprint; day++) {
      const idealRemaining = totalTasks * (1 - day / daysInSprint);
      const actualCompleted = Math.min(metrics.tasksCompleted, totalTasks * (day / daysInSprint) + Math.random() * 5);
      const actualRemaining = totalTasks - actualCompleted;
      
      data.push({
        day: `Day ${day}`,
        ideal: Math.max(0, idealRemaining),
        actual: Math.max(0, actualRemaining)
      });
    }
    
    return data;
  };

  // Predictive analytics
  const calculatePredictions = () => {
    const avgRevenueGrowth = financialRecords.length > 1 
      ? (financialRecords[financialRecords.length - 1].revenue - financialRecords[0].revenue) / financialRecords.length 
      : 1000;
    
    const currentRevenue = metrics.revenue;
    const currentBurnRate = financialRecords[financialRecords.length - 1]?.expenses || 50000;
    const currentCash = financialRecords[financialRecords.length - 1]?.cash || 500000;
    
    const monthsOfRunway = currentBurnRate > 0 ? Math.floor(currentCash / currentBurnRate) : 999;
    const projectedLaunchDate = new Date(currentDate.getTime() + (100 - productProgress) * 24 * 60 * 60 * 1000);
    const projectedBreakEven = currentBurnRate > 0 ? Math.ceil((currentBurnRate - currentRevenue) / Math.max(avgRevenueGrowth, 1000)) : 0;
    
    return {
      runway: monthsOfRunway,
      launchDate: projectedLaunchDate.toLocaleDateString(),
      breakEvenMonths: Math.max(0, projectedBreakEven),
      projectedMRR6Months: Math.floor(currentRevenue + avgRevenueGrowth * 6)
    };
  };

  // Revenue trend with forecast
  const calculateRevenueTrend = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
    return months.map((month, index) => {
      const baseRevenue = metrics.revenue * (index + 1) / 8;
      const growth = baseRevenue * 0.15;
      
      return {
        month,
        actual: index < 5 ? Math.floor(baseRevenue) : null,
        forecast: index >= 4 ? Math.floor(baseRevenue + growth) : null,
        target: Math.floor(baseRevenue * 1.3)
      };
    });
  };

  // Metric trends
  const calculateMetricTrends = () => {
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    return weeks.map((week, index) => ({
      week,
      users: Math.floor(metrics.users * (index + 1) / 4),
      revenue: Math.floor(metrics.revenue * (index + 1) / 4),
      tasks: Math.floor(metrics.tasksCompleted * (index + 1) / 4)
    }));
  };

  const velocityData = calculateVelocity();
  const agentPerformance = calculateAgentPerformance();
  const burndownData = calculateBurndown();
  const predictions = calculatePredictions();
  const revenueTrend = calculateRevenueTrend();
  const metricTrends = calculateMetricTrends();

  return (
    <div className="space-y-6">
      {/* Predictions Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Runway</p>
              <p className="mt-2 text-2xl">{predictions.runway} months</p>
              <p className="text-xs text-muted-foreground mt-1">
                {predictions.runway < 6 ? '⚠️ Low runway' : '✓ Healthy'}
              </p>
            </div>
            <Calendar className="size-5 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Launch Date</p>
              <p className="mt-2 text-lg">{predictions.launchDate}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {productProgress}% complete
              </p>
            </div>
            <Target className="size-5 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Break Even</p>
              <p className="mt-2 text-2xl">{predictions.breakEvenMonths}mo</p>
              <p className="text-xs text-muted-foreground mt-1">
                Projected timeline
              </p>
            </div>
            <DollarSign className="size-5 text-purple-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">MRR (6mo)</p>
              <p className="mt-2 text-2xl">${(predictions.projectedMRR6Months / 1000).toFixed(0)}k</p>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="size-3" /> +15% growth
              </p>
            </div>
            <TrendingUp className="size-5 text-green-500" />
          </div>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="velocity">Velocity</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
        </TabsList>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <Card className="p-6">
            <h3 className="mb-4">Burndown Chart</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={burndownData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="ideal" stroke="#94a3b8" strokeDasharray="5 5" name="Ideal" />
                <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2} name="Actual" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4">Key Metrics Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={metricTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="users" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} name="Users" />
                <Area type="monotone" dataKey="tasks" stackId="2" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Tasks" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        {/* Velocity Tab */}
        <TabsContent value="velocity" className="space-y-4">
          <Card className="p-6">
            <h3 className="mb-4">Sprint Velocity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={velocityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="planned" fill="#94a3b8" name="Planned" />
                <Bar dataKey="completed" fill="#3b82f6" name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Avg Velocity</p>
              <p className="mt-2 text-3xl">{velocityData.length > 0 ? Math.floor(velocityData.reduce((sum, s) => sum + s.completed, 0) / velocityData.length) : 0}</p>
              <p className="text-xs text-green-600 mt-1">Tasks per sprint</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Completion Rate</p>
              <p className="mt-2 text-3xl">{velocityData.length > 0 ? Math.floor((velocityData.reduce((sum, s) => sum + s.completed, 0) / velocityData.reduce((sum, s) => sum + s.planned, 1)) * 100) : 0}%</p>
              <p className="text-xs text-muted-foreground mt-1">vs planned</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Trend</p>
              <p className="mt-2 text-3xl flex items-center gap-2">
                <TrendingUp className="size-6 text-green-500" /> +12%
              </p>
              <p className="text-xs text-green-600 mt-1">Improving</p>
            </Card>
          </div>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-4">
          <Card className="p-6">
            <h3 className="mb-4">Revenue Forecast</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2} name="Actual" />
                <Line type="monotone" dataKey="forecast" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" name="Forecast" />
                <Line type="monotone" dataKey="target" stroke="#10b981" strokeWidth={1} strokeDasharray="3 3" name="Target" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Monthly Recurring Revenue</p>
              <p className="mt-2 text-3xl">${(metrics.revenue / 1000).toFixed(1)}k</p>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="size-3" /> +23% from last month
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Annual Run Rate</p>
              <p className="mt-2 text-3xl">${(metrics.revenue * 12 / 1000).toFixed(0)}k</p>
              <p className="text-xs text-muted-foreground mt-1">Based on current MRR</p>
            </Card>
          </div>
        </TabsContent>

        {/* Agents Tab */}
        <TabsContent value="agents" className="space-y-4">
          <Card className="p-6">
            <h3 className="mb-4">Agent Performance Radar</h3>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={agentPerformance}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Efficiency" dataKey="efficiency" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                <Radar name="Quality" dataKey="quality" stroke="#10b981" fill="#10b981" fillOpacity={0.5} />
                <Radar name="Collaboration" dataKey="collaboration" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-1 gap-3">
            {agentPerformance.map((agent, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{agent.name}</p>
                    <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Tasks</p>
                        <p className="mt-1 font-medium">{agent.tasks}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Efficiency</p>
                        <p className="mt-1 font-medium">{agent.efficiency.toFixed(0)}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Quality</p>
                        <p className="mt-1 font-medium">{agent.quality.toFixed(0)}%</p>
                      </div>
                    </div>
                  </div>
                  <Award className={`size-6 ${agent.tasks > 15 ? 'text-yellow-500' : 'text-gray-400'}`} />
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

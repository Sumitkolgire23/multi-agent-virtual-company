import { Card } from './ui/card';
import { TrendingUp, Users, DollarSign, Zap, BookOpen, Bug, GitPullRequest, CheckCircle2 } from 'lucide-react';

interface CompanyMetricsProps {
  metrics: {
    tasksCompleted: number;
    features: number;
    users: number;
    revenue: number;
    testCoverage: number;
    docsPages: number;
    bugs: number;
    prsOpened: number;
    prsMerged: number;
  };
  productProgress: number;
}

export function CompanyMetrics({ metrics, productProgress }: CompanyMetricsProps) {
  const metricCards = [
    {
      label: 'Tasks Done',
      value: metrics.tasksCompleted,
      icon: CheckCircle2,
      color: 'bg-blue-500',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      label: 'PRs Merged',
      value: `${metrics.prsMerged}/${metrics.prsOpened}`,
      icon: GitPullRequest,
      color: 'bg-purple-500',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      label: 'Beta Users',
      value: metrics.users.toLocaleString(),
      icon: Users,
      color: 'bg-green-500',
      gradient: 'from-green-500 to-green-600'
    },
    {
      label: 'Revenue (MRR)',
      value: `$${metrics.revenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-orange-500',
      gradient: 'from-orange-500 to-orange-600'
    },
    {
      label: 'Docs Pages',
      value: metrics.docsPages,
      icon: BookOpen,
      color: 'bg-cyan-500',
      gradient: 'from-cyan-500 to-cyan-600'
    },
    {
      label: 'Bugs Found',
      value: metrics.bugs,
      icon: Bug,
      color: 'bg-red-500',
      gradient: 'from-red-500 to-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {metricCards.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card
            key={index}
            className="p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${metric.gradient}`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-600 mb-1">{metric.label}</p>
              <p className="text-slate-900">{metric.value}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

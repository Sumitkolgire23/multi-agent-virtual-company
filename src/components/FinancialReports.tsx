import { FinancialRecord } from '../App';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, Clock } from 'lucide-react';
import { Progress } from './ui/progress';

interface FinancialReportsProps {
  records: FinancialRecord[];
  currentMetrics: any;
  currentDate: Date;
}

export function FinancialReports({ records, currentMetrics, currentDate }: FinancialReportsProps) {
  const latestRecord = records[records.length - 1];
  const previousRecord = records[records.length - 2];

  const calculateGrowth = (current: number, previous: number) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  const revenueGrowth = latestRecord && previousRecord 
    ? calculateGrowth(latestRecord.revenue, previousRecord.revenue)
    : 0;

  const profitMargin = latestRecord 
    ? ((latestRecord.profit / latestRecord.revenue) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Current Financial Overview */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <DollarSign className="w-5 h-5 text-slate-600" />
          <h2 className="text-slate-900">Financial Dashboard</h2>
          <Badge variant="secondary" className="ml-auto">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </Badge>
        </div>

        {!latestRecord ? (
          <div className="text-center py-12 text-slate-500">
            <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Financial data will be generated monthly</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-green-900">Monthly Revenue (MRR)</p>
                    {revenueGrowth > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <p className="text-green-900">${latestRecord.mrr.toLocaleString()}</p>
                  {previousRecord && (
                    <Badge className={`text-xs ${revenueGrowth > 0 ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                      {revenueGrowth > 0 ? '+' : ''}{revenueGrowth.toFixed(1)}% MoM
                    </Badge>
                  )}
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <div className="space-y-2">
                  <p className="text-sm text-blue-900">Annual Recurring Revenue (ARR)</p>
                  <p className="text-blue-900">${latestRecord.arr.toLocaleString()}</p>
                  <Badge className="text-xs bg-blue-200 text-blue-800">
                    12x MRR
                  </Badge>
                </div>
              </Card>

              <Card className={`p-4 bg-gradient-to-br ${latestRecord.profit > 0 ? 'from-green-50 to-green-100 border-green-200' : 'from-red-50 to-red-100 border-red-200'}`}>
                <div className="space-y-2">
                  <p className={`text-sm ${latestRecord.profit > 0 ? 'text-green-900' : 'text-red-900'}`}>
                    Monthly Profit/Loss
                  </p>
                  <p className={latestRecord.profit > 0 ? 'text-green-900' : 'text-red-900'}>
                    ${Math.abs(latestRecord.profit).toLocaleString()}
                  </p>
                  <Badge className={`text-xs ${latestRecord.profit > 0 ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                    {profitMargin.toFixed(1)}% margin
                  </Badge>
                </div>
              </Card>

              <Card className={`p-4 bg-gradient-to-br ${latestRecord.runway > 12 ? 'from-green-50 to-green-100 border-green-200' : 'from-orange-50 to-orange-100 border-orange-200'}`}>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm ${latestRecord.runway > 12 ? 'text-green-900' : 'text-orange-900'}`}>
                      Runway
                    </p>
                    {latestRecord.runway < 12 && <AlertTriangle className="w-4 h-4 text-orange-600" />}
                  </div>
                  <p className={latestRecord.runway > 12 ? 'text-green-900' : 'text-orange-900'}>
                    {latestRecord.runway} months
                  </p>
                  <Badge className={`text-xs ${latestRecord.runway > 12 ? 'bg-green-200 text-green-800' : 'bg-orange-200 text-orange-800'}`}>
                    {latestRecord.runway > 12 ? 'Healthy' : 'Monitor'}
                  </Badge>
                </div>
              </Card>
            </div>

            {/* Expense Breakdown */}
            <Card className="p-4 border-2">
              <h3 className="text-slate-900 mb-4">Expense Breakdown</h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Team Salaries</span>
                    <span className="text-slate-900">${Math.floor(latestRecord.expenses * 0.6).toLocaleString()}</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Infrastructure & Tools</span>
                    <span className="text-slate-900">${Math.floor(latestRecord.expenses * 0.2).toLocaleString()}</span>
                  </div>
                  <Progress value={20} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Marketing & Sales</span>
                    <span className="text-slate-900">${Math.floor(latestRecord.expenses * 0.15).toLocaleString()}</span>
                  </div>
                  <Progress value={15} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Other</span>
                    <span className="text-slate-900">${Math.floor(latestRecord.expenses * 0.05).toLocaleString()}</span>
                  </div>
                  <Progress value={5} className="h-2" />
                </div>

                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-900">Total Monthly Expenses</span>
                    <span className="text-slate-900">${latestRecord.expenses.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Monthly History */}
            <Card className="p-4 border-2">
              <h3 className="text-slate-900 mb-4">Monthly Financial History</h3>
              <div className="space-y-2">
                {records.slice().reverse().map((record, index) => {
                  const isProfit = record.profit > 0;
                  
                  return (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <div>
                          <p className="text-sm text-slate-900">{record.month}</p>
                          <p className="text-xs text-slate-500">
                            Burn Rate: ${record.burnRate.toLocaleString()}/mo
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-slate-900">
                          Revenue: ${record.revenue.toLocaleString()}
                        </p>
                        <p className={`text-xs ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                          {isProfit ? 'Profit' : 'Loss'}: ${Math.abs(record.profit).toLocaleString()}
                        </p>
                      </div>

                      <Badge className={isProfit ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                        {record.runway}mo runway
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Financial Health Alert */}
            {latestRecord.runway < 6 && (
              <Card className="p-4 bg-red-50 border-2 border-red-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-red-900 mb-1">⚠️ Low Runway Alert</h3>
                    <p className="text-sm text-red-700">
                      Company runway is below 6 months. Consider raising funds, reducing costs, or accelerating revenue growth.
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

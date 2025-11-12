import { Download, Upload, FileJson, FileText, Table, Share2, Copy, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useState } from 'react';
import { toast } from 'sonner@2.0.3';

interface ExportImportProps {
  simulationData: {
    projectConfig: any;
    agents: any[];
    tasks: any[];
    messages: any[];
    pullRequests: any[];
    okrs: any[];
    documentation: any[];
    financialRecords: any[];
    timeline: any[];
    metrics: any;
    currentDate: Date;
    productProgress: number;
  };
  onImportData: (data: any) => void;
}

export function ExportImport({ simulationData, onImportData }: ExportImportProps) {
  const [copied, setCopied] = useState(false);

  // Export full simulation as JSON
  const exportFullSimulation = () => {
    const dataToExport = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      ...simulationData
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `simulation-${simulationData.projectConfig?.name || 'export'}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Simulation exported successfully!');
  };

  // Export tasks as CSV
  const exportTasksCSV = () => {
    const headers = ['ID', 'Title', 'Status', 'Assigned To', 'Priority', 'Type', 'Created By'];
    const rows = simulationData.tasks.map(task => [
      task.id,
      task.title,
      task.status,
      task.assignedTo,
      task.priority,
      task.type,
      task.createdBy
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Tasks exported as CSV!');
  };

  // Export financial report as CSV
  const exportFinancialsCSV = () => {
    const headers = ['Date', 'Type', 'Revenue', 'Expenses', 'Cash', 'MRR', 'ARR', 'Burn Rate', 'Runway'];
    const rows = simulationData.financialRecords.map(record => [
      new Date(record.date).toISOString().split('T')[0],
      record.type,
      record.revenue || 0,
      record.expenses || 0,
      record.cash || 0,
      record.mrr || 0,
      record.arr || 0,
      record.burnRate || 0,
      record.runway || 0
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financials-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Financial report exported as CSV!');
  };

  // Export metrics summary
  const exportMetricsSummary = () => {
    const summary = {
      exportDate: new Date().toISOString(),
      projectName: simulationData.projectConfig?.name,
      industry: simulationData.projectConfig?.industry,
      currentProgress: simulationData.productProgress,
      metrics: simulationData.metrics,
      teamSize: simulationData.agents.length,
      totalTasks: simulationData.tasks.length,
      completedTasks: simulationData.tasks.filter((t: any) => t.status === 'done').length,
      openPRs: simulationData.pullRequests.filter((pr: any) => pr.status === 'open').length,
      totalDocPages: simulationData.documentation.length,
      activeOKRs: simulationData.okrs.filter((okr: any) => okr.status === 'in-progress').length
    };

    const blob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `metrics-summary-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Metrics summary exported!');
  };

  // Copy shareable link (simulation data as base64)
  const copyShareableLink = () => {
    const compactData = {
      name: simulationData.projectConfig?.name,
      industry: simulationData.projectConfig?.industry,
      progress: simulationData.productProgress,
      metrics: simulationData.metrics
    };

    const encoded = btoa(JSON.stringify(compactData));
    const shareableText = `Check out my startup simulation: ${simulationData.projectConfig?.name}\nProgress: ${simulationData.productProgress}%\nRevenue: $${(simulationData.metrics.revenue / 1000).toFixed(0)}k MRR\nUsers: ${simulationData.metrics.users}\n\nData: ${encoded.substring(0, 100)}...`;
    
    navigator.clipboard.writeText(shareableText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast.success('Shareable summary copied to clipboard!');
  };

  // Handle import
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        onImportData(data);
        toast.success('Simulation imported successfully!');
      } catch (error) {
        toast.error('Failed to import: Invalid file format');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3>Export & Share</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Download your simulation data in various formats
            </p>
          </div>
          <Badge variant="secondary">
            {simulationData.tasks.length} tasks • {simulationData.messages.length} messages
          </Badge>
        </div>

        <Tabs defaultValue="export" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="export">Export</TabsTrigger>
            <TabsTrigger value="import">Import</TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-4 mt-6">
            {/* Full Simulation Export */}
            <div className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <FileJson className="size-5 text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-medium">Full Simulation (JSON)</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Complete simulation data including all agents, tasks, messages, and metrics
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Recommended for backup and restoration
                    </p>
                  </div>
                </div>
                <Button onClick={exportFullSimulation}>
                  <Download className="size-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Tasks CSV */}
            <div className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <Table className="size-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-medium">Tasks (CSV)</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      All tasks with status, priority, and assignments
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {simulationData.tasks.length} tasks available
                    </p>
                  </div>
                </div>
                <Button onClick={exportTasksCSV} variant="outline">
                  <Download className="size-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>

            {/* Financial Report */}
            <div className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <FileText className="size-5 text-purple-500 mt-1" />
                  <div>
                    <h4 className="font-medium">Financial Report (CSV)</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Revenue, expenses, MRR, ARR, and runway data
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {simulationData.financialRecords.length} financial records
                    </p>
                  </div>
                </div>
                <Button onClick={exportFinancialsCSV} variant="outline">
                  <Download className="size-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>

            {/* Metrics Summary */}
            <div className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <FileJson className="size-5 text-orange-500 mt-1" />
                  <div>
                    <h4 className="font-medium">Metrics Summary (JSON)</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      High-level overview of all key performance indicators
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Lightweight summary for quick analysis
                    </p>
                  </div>
                </div>
                <Button onClick={exportMetricsSummary} variant="outline">
                  <Download className="size-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Share */}
            <div className="border rounded-lg p-4 bg-muted/50">
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <Share2 className="size-5 text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-medium">Share Summary</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Copy a shareable summary of your simulation to clipboard
                    </p>
                  </div>
                </div>
                <Button onClick={copyShareableLink} variant="outline">
                  {copied ? (
                    <>
                      <CheckCircle className="size-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="size-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="import" className="space-y-4 mt-6">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Upload className="size-12 mx-auto text-muted-foreground mb-4" />
              <h4 className="font-medium mb-2">Import Simulation</h4>
              <p className="text-sm text-muted-foreground mb-6">
                Upload a previously exported simulation JSON file to restore your progress
              </p>
              
              <div className="flex justify-center">
                <label className="cursor-pointer">
                  <Button asChild>
                    <span>
                      <Upload className="size-4 mr-2" />
                      Choose File
                    </span>
                  </Button>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950 rounded-lg text-left">
                <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                  ⚠️ Important
                </p>
                <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
                  Importing will replace your current simulation. Make sure to export your current progress first if you want to keep it.
                </p>
              </div>
            </div>

            <Card className="p-4 bg-muted/50">
              <h4 className="font-medium mb-2">Supported Formats</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Full simulation JSON exports from this app</li>
                <li>• Version 1.0 format required</li>
                <li>• Maximum file size: 10MB</li>
              </ul>
            </Card>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Quick Stats */}
      <Card className="p-6">
        <h3 className="mb-4">Export Preview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 border rounded-lg">
            <p className="text-sm text-muted-foreground">Project</p>
            <p className="font-medium mt-1">{simulationData.projectConfig?.name || 'Unnamed'}</p>
          </div>
          <div className="p-3 border rounded-lg">
            <p className="text-sm text-muted-foreground">Progress</p>
            <p className="font-medium mt-1">{simulationData.productProgress}%</p>
          </div>
          <div className="p-3 border rounded-lg">
            <p className="text-sm text-muted-foreground">Total Tasks</p>
            <p className="font-medium mt-1">{simulationData.tasks.length}</p>
          </div>
          <div className="p-3 border rounded-lg">
            <p className="text-sm text-muted-foreground">Messages</p>
            <p className="font-medium mt-1">{simulationData.messages.length}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

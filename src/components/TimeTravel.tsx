import { useState } from 'react';
import { History, RotateCcw, GitBranch, Play, Pause, Clock, Archive, GitCompare } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

export interface Snapshot {
  id: string;
  date: Date;
  label: string;
  simulationDay: number;
  data: {
    agents: any[];
    tasks: any[];
    messages: any[];
    pullRequests: any[];
    okrs: any[];
    documentation: any[];
    financialRecords: any[];
    timeline: any[];
    productProgress: number;
    metrics: any;
  };
  isBranch?: boolean;
  parentId?: string;
}

interface TimeTravelProps {
  snapshots: Snapshot[];
  currentSnapshotIndex: number;
  onRestoreSnapshot: (snapshot: Snapshot) => void;
  onCreateBranch: (snapshot: Snapshot, branchName: string) => void;
  onCompareSnapshots: (snapshot1: Snapshot, snapshot2: Snapshot) => void;
  isSimulating: boolean;
}

export function TimeTravel({ 
  snapshots, 
  currentSnapshotIndex, 
  onRestoreSnapshot,
  onCreateBranch,
  onCompareSnapshots,
  isSimulating
}: TimeTravelProps) {
  const [selectedSnapshot, setSelectedSnapshot] = useState<Snapshot | null>(null);
  const [branchName, setBranchName] = useState('');
  const [compareMode, setCompareMode] = useState(false);
  const [compareSnapshots, setCompareSnapshots] = useState<[Snapshot | null, Snapshot | null]>([null, null]);

  const handleSliderChange = (value: number[]) => {
    const index = value[0];
    if (snapshots[index]) {
      setSelectedSnapshot(snapshots[index]);
    }
  };

  const handleRestore = () => {
    if (selectedSnapshot) {
      onRestoreSnapshot(selectedSnapshot);
    }
  };

  const handleCreateBranch = () => {
    if (selectedSnapshot && branchName.trim()) {
      onCreateBranch(selectedSnapshot, branchName);
      setBranchName('');
    }
  };

  const toggleCompareSnapshot = (snapshot: Snapshot) => {
    if (compareSnapshots[0] === null) {
      setCompareSnapshots([snapshot, null]);
    } else if (compareSnapshots[1] === null) {
      setCompareSnapshots([compareSnapshots[0], snapshot]);
    } else {
      setCompareSnapshots([snapshot, null]);
    }
  };

  const handleCompare = () => {
    if (compareSnapshots[0] && compareSnapshots[1]) {
      onCompareSnapshots(compareSnapshots[0], compareSnapshots[1]);
    }
  };

  const currentSnapshot = selectedSnapshot || snapshots[currentSnapshotIndex];

  return (
    <div className="space-y-6">
      {/* Timeline Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <History className="size-6 text-blue-500" />
            <div>
              <h3>Time Travel & Replay</h3>
              <p className="text-sm text-muted-foreground">
                {snapshots.length} snapshots available
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={compareMode ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setCompareMode(!compareMode);
                setCompareSnapshots([null, null]);
              }}
            >
              <GitCompare className="size-4 mr-2" />
              Compare
            </Button>
            {isSimulating && (
              <Badge variant="secondary">
                <Clock className="size-3 mr-1" />
                Recording...
              </Badge>
            )}
          </div>
        </div>

        {/* Timeline Slider */}
        {snapshots.length > 0 && (
          <div className="space-y-4">
            <div className="px-2">
              <Slider
                value={[selectedSnapshot ? snapshots.indexOf(selectedSnapshot) : currentSnapshotIndex]}
                onValueChange={handleSliderChange}
                max={snapshots.length - 1}
                step={1}
                className="w-full"
                disabled={isSimulating}
              />
            </div>
            
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{snapshots[0]?.date.toLocaleString()}</span>
              <span className="font-medium text-foreground">
                Day {currentSnapshot?.simulationDay || 0}
              </span>
              <span>{snapshots[snapshots.length - 1]?.date.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Current Snapshot Info */}
        {currentSnapshot && (
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-medium">{currentSnapshot.label}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {currentSnapshot.date.toLocaleString()}
                </p>
              </div>
              {currentSnapshot.isBranch && (
                <Badge variant="secondary">
                  <GitBranch className="size-3 mr-1" />
                  Branch
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Progress</p>
                <p className="font-medium mt-1">{currentSnapshot.data.productProgress}%</p>
              </div>
              <div>
                <p className="text-muted-foreground">Tasks</p>
                <p className="font-medium mt-1">{currentSnapshot.data.tasks.length}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Revenue</p>
                <p className="font-medium mt-1">${(currentSnapshot.data.metrics.revenue / 1000).toFixed(0)}k</p>
              </div>
              <div>
                <p className="text-muted-foreground">Users</p>
                <p className="font-medium mt-1">{currentSnapshot.data.metrics.users}</p>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button 
                size="sm" 
                onClick={handleRestore}
                disabled={isSimulating || currentSnapshotIndex === snapshots.indexOf(currentSnapshot)}
              >
                <RotateCcw className="size-4 mr-2" />
                Restore to this point
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" disabled={isSimulating}>
                    <GitBranch className="size-4 mr-2" />
                    Create Branch
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Timeline Branch</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Branch Name</label>
                      <input
                        type="text"
                        className="w-full mt-2 px-3 py-2 border rounded-md"
                        placeholder="e.g., 'What if we focused on enterprise?'"
                        value={branchName}
                        onChange={(e) => setBranchName(e.target.value)}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Create a new timeline branch from this point to explore alternative scenarios.
                    </p>
                    <Button onClick={handleCreateBranch} disabled={!branchName.trim()}>
                      Create Branch
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}
      </Card>

      {/* Snapshot List */}
      <Card className="p-6">
        <h3 className="mb-4">All Snapshots</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {snapshots.map((snapshot, index) => (
            <div
              key={snapshot.id}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedSnapshot?.id === snapshot.id 
                  ? 'bg-blue-50 border-blue-300 dark:bg-blue-950' 
                  : 'hover:bg-muted'
              } ${
                compareMode && (compareSnapshots[0]?.id === snapshot.id || compareSnapshots[1]?.id === snapshot.id)
                  ? 'ring-2 ring-blue-500'
                  : ''
              }`}
              onClick={() => {
                if (compareMode) {
                  toggleCompareSnapshot(snapshot);
                } else {
                  setSelectedSnapshot(snapshot);
                }
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Archive className="size-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">{snapshot.label}</p>
                    <p className="text-xs text-muted-foreground">
                      Day {snapshot.simulationDay} • {snapshot.date.toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {snapshot.isBranch && (
                    <Badge variant="secondary" className="text-xs">
                      <GitBranch className="size-3 mr-1" />
                      Branch
                    </Badge>
                  )}
                  {index === currentSnapshotIndex && !selectedSnapshot && (
                    <Badge variant="default" className="text-xs">Current</Badge>
                  )}
                  {compareMode && (
                    <>
                      {compareSnapshots[0]?.id === snapshot.id && (
                        <Badge className="text-xs bg-blue-500">A</Badge>
                      )}
                      {compareSnapshots[1]?.id === snapshot.id && (
                        <Badge className="text-xs bg-green-500">B</Badge>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mt-2 text-xs text-muted-foreground">
                <span>Progress: {snapshot.data.productProgress}%</span>
                <span>Tasks: {snapshot.data.tasks.length}</span>
                <span>Revenue: ${(snapshot.data.metrics.revenue / 1000).toFixed(0)}k</span>
                <span>Users: {snapshot.data.metrics.users}</span>
              </div>
            </div>
          ))}
        </div>

        {compareMode && compareSnapshots[0] && compareSnapshots[1] && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Comparing 2 snapshots</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {compareSnapshots[0].label} vs {compareSnapshots[1].label}
                </p>
              </div>
              <Button size="sm" onClick={handleCompare}>
                <GitCompare className="size-4 mr-2" />
                View Comparison
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
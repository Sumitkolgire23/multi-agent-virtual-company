import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, FolderOpen, Trash2, Calendar, Clock } from 'lucide-react';
import { projectId } from '../utils/supabase/info';

interface SavedSimulation {
  id: string;
  projectName: string;
  domain: string;
  currentDate: string;
  productProgress: number;
  updatedAt: string;
  metrics: any;
}

export function SavedSimulationsModal({ 
  open, 
  onClose,
  onLoad
}: { 
  open: boolean; 
  onClose: () => void;
  onLoad: (simulation: any) => void;
}) {
  const { user, accessToken } = useAuth();
  const [simulations, setSimulations] = useState<SavedSimulation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && user && accessToken) {
      loadSimulations();
    }
  }, [open, user, accessToken]);

  const loadSimulations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-49b02a60/simulations`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load simulations');
      }

      setSimulations(data.simulations || []);
    } catch (err: any) {
      console.error('Failed to load simulations:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-49b02a60/simulation/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete simulation');
      }

      setSimulations(sims => sims.filter(s => s.id !== id));
    } catch (err: any) {
      console.error('Failed to delete simulation:', err);
      setError(err.message);
    }
  };

  const handleLoad = (simulation: SavedSimulation) => {
    onLoad(simulation);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <FolderOpen className="w-5 h-5" />
            <DialogTitle>Saved Simulations</DialogTitle>
          </div>
          <DialogDescription>
            Load a previously saved simulation to continue where you left off.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[500px] overflow-y-auto space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : simulations.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No saved simulations yet.</p>
              <p className="text-sm">Your simulations will appear here when saved.</p>
            </div>
          ) : (
            simulations.map((sim) => (
              <Card key={sim.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{sim.projectName}</h3>
                      <Badge variant="secondary" className="capitalize text-xs">
                        {sim.domain}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        <span>Simulation Date: {new Date(sim.currentDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        <span>Last Updated: {new Date(sim.updatedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs">
                          Progress: <span className="font-semibold">{Math.round(sim.productProgress)}%</span>
                        </span>
                        {sim.metrics && (
                          <>
                            <span className="text-xs">
                              Tasks: <span className="font-semibold">{sim.metrics.tasksCompleted}</span>
                            </span>
                            <span className="text-xs">
                              Users: <span className="font-semibold">{sim.metrics.users}</span>
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      onClick={() => handleLoad(sim)}
                    >
                      Load
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(sim.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

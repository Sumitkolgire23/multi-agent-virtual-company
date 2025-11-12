import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Settings, Bell, Zap, Users, Save, Check } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export interface UserSettings {
  notifications: {
    agentMessages: boolean;
    taskUpdates: boolean;
    milestones: boolean;
    financialAlerts: boolean;
  };
  simulation: {
    autoSave: boolean;
    autoSaveInterval: number;
    defaultSpeed: number;
    pauseOnMilestone: boolean;
  };
  agents: {
    activityFrequency: 'low' | 'medium' | 'high';
    enableRandomEvents: boolean;
    smartResponses: boolean;
  };
  ui: {
    compactMode: boolean;
    showTimestamps: boolean;
    animationsEnabled: boolean;
  };
}

const defaultSettings: UserSettings = {
  notifications: {
    agentMessages: true,
    taskUpdates: true,
    milestones: true,
    financialAlerts: true,
  },
  simulation: {
    autoSave: true,
    autoSaveInterval: 5,
    defaultSpeed: 1,
    pauseOnMilestone: false,
  },
  agents: {
    activityFrequency: 'medium',
    enableRandomEvents: true,
    smartResponses: true,
  },
  ui: {
    compactMode: false,
    showTimestamps: true,
    animationsEnabled: true,
  },
};

export function SettingsModal({ 
  open, 
  onClose,
  settings,
  onSettingsChange 
}: { 
  open: boolean; 
  onClose: () => void;
  settings: UserSettings;
  onSettingsChange: (settings: UserSettings) => void;
}) {
  const { user, accessToken } = useAuth();
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      onSettingsChange(localSettings);

      if (user && accessToken) {
        await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-49b02a60/settings`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(localSettings)
          }
        );
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Settings className="w-5 h-5" />
            <DialogTitle>Settings</DialogTitle>
          </div>
          <DialogDescription>
            Customize your simulation experience and preferences.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="notifications" className="text-xs">
              <Bell className="w-3 h-3 mr-1" />
              Alerts
            </TabsTrigger>
            <TabsTrigger value="simulation" className="text-xs">
              <Zap className="w-3 h-3 mr-1" />
              Sim
            </TabsTrigger>
            <TabsTrigger value="agents" className="text-xs">
              <Users className="w-3 h-3 mr-1" />
              Agents
            </TabsTrigger>
            <TabsTrigger value="ui" className="text-xs">UI</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Agent Messages</Label>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Get notified when agents post messages
                  </p>
                </div>
                <Switch
                  checked={localSettings.notifications.agentMessages}
                  onCheckedChange={(checked) =>
                    setLocalSettings({
                      ...localSettings,
                      notifications: { ...localSettings.notifications, agentMessages: checked }
                    })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Task Updates</Label>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Notify when tasks are created or completed
                  </p>
                </div>
                <Switch
                  checked={localSettings.notifications.taskUpdates}
                  onCheckedChange={(checked) =>
                    setLocalSettings({
                      ...localSettings,
                      notifications: { ...localSettings.notifications, taskUpdates: checked }
                    })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Milestones</Label>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Alert for important company milestones
                  </p>
                </div>
                <Switch
                  checked={localSettings.notifications.milestones}
                  onCheckedChange={(checked) =>
                    setLocalSettings({
                      ...localSettings,
                      notifications: { ...localSettings.notifications, milestones: checked }
                    })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Financial Alerts</Label>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Warn about runway and budget issues
                  </p>
                </div>
                <Switch
                  checked={localSettings.notifications.financialAlerts}
                  onCheckedChange={(checked) =>
                    setLocalSettings({
                      ...localSettings,
                      notifications: { ...localSettings.notifications, financialAlerts: checked }
                    })
                  }
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="simulation" className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-save</Label>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Automatically save simulation progress
                  </p>
                </div>
                <Switch
                  checked={localSettings.simulation.autoSave}
                  onCheckedChange={(checked) =>
                    setLocalSettings({
                      ...localSettings,
                      simulation: { ...localSettings.simulation, autoSave: checked }
                    })
                  }
                />
              </div>

              {localSettings.simulation.autoSave && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Auto-save Interval: {localSettings.simulation.autoSaveInterval} min</Label>
                    <Slider
                      value={[localSettings.simulation.autoSaveInterval]}
                      onValueChange={([value]) =>
                        setLocalSettings({
                          ...localSettings,
                          simulation: { ...localSettings.simulation, autoSaveInterval: value }
                        })
                      }
                      min={1}
                      max={15}
                      step={1}
                    />
                  </div>
                </>
              )}

              <Separator />

              <div className="space-y-2">
                <Label>Default Simulation Speed: {localSettings.simulation.defaultSpeed}x</Label>
                <Slider
                  value={[localSettings.simulation.defaultSpeed]}
                  onValueChange={([value]) =>
                    setLocalSettings({
                      ...localSettings,
                      simulation: { ...localSettings.simulation, defaultSpeed: value }
                    })
                  }
                  min={1}
                  max={10}
                  step={1}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Pause on Milestone</Label>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Auto-pause when reaching major milestones
                  </p>
                </div>
                <Switch
                  checked={localSettings.simulation.pauseOnMilestone}
                  onCheckedChange={(checked) =>
                    setLocalSettings({
                      ...localSettings,
                      simulation: { ...localSettings.simulation, pauseOnMilestone: checked }
                    })
                  }
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="agents" className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Activity Frequency</Label>
                <Select
                  value={localSettings.agents.activityFrequency}
                  onValueChange={(value: 'low' | 'medium' | 'high') =>
                    setLocalSettings({
                      ...localSettings,
                      agents: { ...localSettings.agents, activityFrequency: value }
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Slower pace</SelectItem>
                    <SelectItem value="medium">Medium - Balanced</SelectItem>
                    <SelectItem value="high">High - Fast-paced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Random Events</Label>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Enable unexpected challenges and opportunities
                  </p>
                </div>
                <Switch
                  checked={localSettings.agents.enableRandomEvents}
                  onCheckedChange={(checked) =>
                    setLocalSettings({
                      ...localSettings,
                      agents: { ...localSettings.agents, enableRandomEvents: checked }
                    })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Smart Responses</Label>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Use domain-specific knowledge for agent actions
                  </p>
                </div>
                <Switch
                  checked={localSettings.agents.smartResponses}
                  onCheckedChange={(checked) =>
                    setLocalSettings({
                      ...localSettings,
                      agents: { ...localSettings.agents, smartResponses: checked }
                    })
                  }
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ui" className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Compact Mode</Label>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Show more information in less space
                  </p>
                </div>
                <Switch
                  checked={localSettings.ui.compactMode}
                  onCheckedChange={(checked) =>
                    setLocalSettings({
                      ...localSettings,
                      ui: { ...localSettings.ui, compactMode: checked }
                    })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Timestamps</Label>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Display time for messages and events
                  </p>
                </div>
                <Switch
                  checked={localSettings.ui.showTimestamps}
                  onCheckedChange={(checked) =>
                    setLocalSettings({
                      ...localSettings,
                      ui: { ...localSettings.ui, showTimestamps: checked }
                    })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Animations</Label>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Enable smooth transitions and effects
                  </p>
                </div>
                <Switch
                  checked={localSettings.ui.animationsEnabled}
                  onCheckedChange={(checked) =>
                    setLocalSettings({
                      ...localSettings,
                      ui: { ...localSettings.ui, animationsEnabled: checked }
                    })
                  }
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {saveSuccess && (
          <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
            <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              Settings saved successfully!
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2 justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Save className="w-4 h-4 mr-2 animate-pulse" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { defaultSettings };

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Rocket } from 'lucide-react';

export interface ProjectConfig {
  projectName: string;
  domain: string;
  duration: number; // in months
  description: string;
}

interface ProjectSetupModalProps {
  open: boolean;
  onSubmit: (config: ProjectConfig) => void;
}

const projectDomains = [
  { value: 'saas', label: 'SaaS Platform', desc: 'Subscription software service' },
  { value: 'ecommerce', label: 'E-Commerce', desc: 'Online retail store' },
  { value: 'fintech', label: 'FinTech', desc: 'Financial technology platform' },
  { value: 'healthcare', label: 'HealthTech', desc: 'Healthcare & medical services' },
  { value: 'edtech', label: 'EdTech', desc: 'Educational technology' },
  { value: 'marketplace', label: 'Marketplace', desc: 'Two-sided platform' },
  { value: 'social', label: 'Social Network', desc: 'Community & engagement' },
  { value: 'ai', label: 'AI/ML Platform', desc: 'Artificial intelligence service' },
  { value: 'gaming', label: 'Gaming', desc: 'Video game or platform' },
  { value: 'crypto', label: 'Web3/Crypto', desc: 'Blockchain application' }
];

export function ProjectSetupModal({ open, onSubmit }: ProjectSetupModalProps) {
  const [config, setConfig] = useState<ProjectConfig>({
    projectName: '',
    domain: 'saas',
    duration: 6,
    description: ''
  });

  const handleSubmit = () => {
    if (config.projectName.trim()) {
      onSubmit(config);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-slate-900 dark:text-white">Setup Your Virtual Startup</DialogTitle>
              <DialogDescription className="text-sm text-slate-600 dark:text-slate-400">
                Configure your simulation parameters
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="projectName">Project Name</Label>
            <Input
              id="projectName"
              placeholder="e.g., TaskFlow, ShopEase, HealthHub"
              value={config.projectName}
              onChange={(e) => setConfig({ ...config, projectName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="domain">Industry Domain</Label>
            <Select value={config.domain} onValueChange={(value) => setConfig({ ...config, domain: value })}>
              <SelectTrigger id="domain">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {projectDomains.map(domain => (
                  <SelectItem key={domain.value} value={domain.value}>
                    {domain.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Simulation Duration (months)</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              max="24"
              value={config.duration}
              onChange={(e) => setConfig({ ...config, duration: parseInt(e.target.value) || 6 })}
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              How many months to simulate (1-24 months)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Project Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe what this startup will build..."
              value={config.description}
              onChange={(e) => setConfig({ ...config, description: e.target.value })}
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button onClick={handleSubmit} size="lg" className="gap-2">
            <Rocket className="w-4 h-4" />
            Launch Simulation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
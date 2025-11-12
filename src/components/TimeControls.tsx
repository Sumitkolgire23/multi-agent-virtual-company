import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { FastForward, Calendar, Zap } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface TimeControlsProps {
  isSimulating: boolean;
  simulationSpeed: number;
  onSpeedChange: (speed: number) => void;
  onSkipTime: (days: number) => void;
}

export function TimeControls({ 
  isSimulating, 
  simulationSpeed, 
  onSpeedChange,
  onSkipTime 
}: TimeControlsProps) {
  const speeds = [
    { value: 0.5, label: '0.5x' },
    { value: 1, label: '1x' },
    { value: 2, label: '2x' },
    { value: 5, label: '5x' },
    { value: 10, label: '10x' }
  ];

  return (
    <div className="flex gap-2">
      {/* Speed Control */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Zap className="w-4 h-4" />
            Speed: {simulationSpeed}x
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {speeds.map(speed => (
            <DropdownMenuItem 
              key={speed.value}
              onClick={() => onSpeedChange(speed.value)}
            >
              {speed.label}
              {speed.value === simulationSpeed && ' ✓'}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Skip Time */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <FastForward className="w-4 h-4" />
            Skip Time
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onSkipTime(7)}>
            <Calendar className="w-4 h-4 mr-2" />
            Skip 1 Week
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSkipTime(14)}>
            <Calendar className="w-4 h-4 mr-2" />
            Skip 2 Weeks
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSkipTime(30)}>
            <Calendar className="w-4 h-4 mr-2" />
            Skip 1 Month
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSkipTime(90)}>
            <Calendar className="w-4 h-4 mr-2" />
            Skip 3 Months
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

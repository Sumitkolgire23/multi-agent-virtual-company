import { useState, useRef, useEffect, useCallback } from 'react';
import { TimelineEvent, UserSettings } from '../types';
import { toast } from 'sonner';

interface UseTimeProps {
    settings: UserSettings;
    simulationSpeed: number;
    isSimulating: boolean;
    onTick: () => void;
}

export function useTime({ settings, simulationSpeed, isSimulating, onTick }: UseTimeProps) {
    const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1));
    const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const advanceTime = useCallback(() => {
        setCurrentDate(prev => {
            const next = new Date(prev);
            next.setDate(next.getDate() + 1);
            return next;
        });
    }, []);

    const addTimelineEvent = useCallback((event: Omit<TimelineEvent, 'id' | 'date'>) => {
        const newEvent: TimelineEvent = {
            id: Date.now().toString() + Math.random(),
            date: new Date(currentDate),
            ...event
        };
        setTimeline(prev => [...prev, newEvent]);
    }, [currentDate]);

    const skipTime = useCallback((days: number) => {
        const iterations = Math.floor(days / 2);
        for (let i = 0; i < iterations; i++) {
            onTick();
        }
        setCurrentDate(prev => {
            const next = new Date(prev);
            next.setDate(next.getDate() + days);
            return next;
        });
        addTimelineEvent({
            title: `Fast-forwarded ${days} days`,
            description: `Simulated ${days} days of work`,
            type: 'milestone',
            impact: 'medium'
        });
    }, [addTimelineEvent, onTick]);

    useEffect(() => {
        if (isSimulating) {
            const activityMultiplier = settings.agents.activityFrequency === 'high' ? 0.5 :
                settings.agents.activityFrequency === 'low' ? 2 : 1;
            const baseInterval = (3000 * activityMultiplier) / simulationSpeed;

            intervalRef.current = setInterval(() => {
                onTick();
                advanceTime();
            }, baseInterval);

            return () => {
                if (intervalRef.current) clearInterval(intervalRef.current);
            };
        }
    }, [isSimulating, simulationSpeed, settings.agents.activityFrequency, onTick, advanceTime]);

    // Sprint Meeting Logic
    useEffect(() => {
        const dayOfYear = Math.floor((currentDate.getTime() - new Date(currentDate.getFullYear(), 0, 0).getTime()) / 86400000);
        if (dayOfYear % 14 === 0 && isSimulating && settings.simulation.pauseOnMilestone) {
            // Logic handled in parent or agent loop usually, but we can expose a "sprintDay" flag or similar
            // For now, let's just keep track of time.
        }
    }, [currentDate, isSimulating, settings.simulation.pauseOnMilestone]);

    const resetTime = useCallback(() => {
        setCurrentDate(new Date(2025, 0, 1));
        setTimeline([]);
    }, []);

    return {
        currentDate,
        timeline,
        setCurrentDate,
        setTimeline,
        addTimelineEvent,
        skipTime,
        resetTime
    };
}

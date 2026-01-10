import { useState, useCallback } from 'react';

export interface Metrics {
    tasksCompleted: number;
    features: number;
    bugs: number;
    prsOpened: number;
    prsMerged: number;
    users: number;
    revenue: number;
    testCoverage: number;
    docsPages: number;
}

export const initialMetrics: Metrics = {
    tasksCompleted: 0,
    features: 0,
    bugs: 0,
    prsOpened: 0,
    prsMerged: 0,
    users: 0,
    revenue: 0,
    testCoverage: 0,
    docsPages: 0
};

export function useMetrics() {
    const [metrics, setMetrics] = useState<Metrics>(initialMetrics);
    const [productProgress, setProductProgress] = useState(0);

    const updateMetricsAndProgress = useCallback(() => {
        if (Math.random() > 0.7) {
            setProductProgress(prev => Math.min(100, prev + Math.random() * 3));
            setMetrics(prev => ({
                ...prev,
                features: prev.features + (Math.random() > 0.85 ? 1 : 0),
                users: prev.users + Math.floor(Math.random() * 25),
                revenue: prev.revenue + Math.floor(Math.random() * 250),
                testCoverage: Math.min(100, prev.testCoverage + Math.random() * 2)
            }));
        }
    }, []);

    const resetMetrics = useCallback(() => {
        setMetrics(initialMetrics);
        setProductProgress(0);
    }, []);

    return {
        metrics,
        productProgress,
        setMetrics,
        setProductProgress,
        updateMetricsAndProgress,
        resetMetrics
    };
}

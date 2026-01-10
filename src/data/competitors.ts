export const competitorNames = [
    { name: 'TechCore Inc', marketShare: 15, strength: 75, trend: 'up' as const },
    { name: 'InnovateLabs', marketShare: 22, strength: 85, trend: 'up' as const, recentLaunch: 'AI-powered analytics' },
    { name: 'StartupBoost', marketShare: 12, strength: 65, trend: 'stable' as const },
    { name: 'FastGrow Systems', marketShare: 18, strength: 72, trend: 'up' as const },
    { name: 'Legacy Solutions', marketShare: 28, strength: 55, trend: 'down' as const }
];

export const initialMarketEvents = [
    {
        id: '1',
        type: 'trend' as const,
        title: 'Industry Growth Accelerating',
        description: 'Market seeing 35% YoY growth',
        impact: 'positive' as const,
        severity: 8,
        date: new Date()
    },
    {
        id: '2',
        type: 'competitor' as const,
        title: 'Competitor Raises Series B',
        description: 'InnovateLabs raised $50M, expanding aggressively',
        impact: 'negative' as const,
        severity: 6,
        date: new Date()
    }
];

import { useState, useCallback } from 'react';
import { FinancialRecord, UserSettings } from '../types';
import { toast } from 'sonner';

export function useFinancials(settings: UserSettings) {
    const [financialRecords, setFinancialRecords] = useState<FinancialRecord[]>([]);

    const generateMonthlyFinancialReport = useCallback((month: string, currentRevenue: number) => {
        const expenses = 85000 + Math.random() * 15000;
        const profit = currentRevenue - expenses;
        const runway = profit < 0 ? Math.max(6, 18 - (Math.abs(profit) / 10000)) : 24;

        const newRecord: FinancialRecord = {
            month,
            revenue: currentRevenue,
            expenses: Math.floor(expenses),
            profit: Math.floor(profit),
            runway: Math.floor(runway),
            arr: Math.floor(currentRevenue * 12),
            mrr: Math.floor(currentRevenue),
            burnRate: Math.floor(Math.abs(profit)),
            cash: 0 // In a real app we'd track cash flow properly
        };

        setFinancialRecords(prev => [...prev, newRecord]);
        if (settings.notifications.financialAlerts && runway < 12) {
            toast.warning(`⚠️ Runway is ${Math.floor(runway)} months - consider fundraising`);
        }
    }, [settings.notifications.financialAlerts]);

    const resetFinancials = useCallback(() => {
        setFinancialRecords([]);
    }, []);

    return {
        financialRecords,
        setFinancialRecords,
        generateMonthlyFinancialReport,
        resetFinancials
    };
}

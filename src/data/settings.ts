import { UserSettings } from '../types';

export const defaultSettings: UserSettings = {
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

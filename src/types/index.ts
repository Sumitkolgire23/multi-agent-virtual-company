export interface Agent {
    id: string;
    name: string;
    role: string;
    avatar: string;
    status: 'active' | 'idle' | 'thinking' | 'meeting';
    personality: string;
    tasksCompleted: number;
}

export interface Message {
    id: string;
    agentId: string;
    agentName: string;
    content: string;
    timestamp: Date;
    type: 'message' | 'task' | 'decision' | 'bug' | 'pr' | 'meeting' | 'documentation' | 'financial';
}

export interface Task {
    id: string;
    title: string;
    description: string;
    assignedTo: string;
    status: 'backlog' | 'in-progress' | 'review' | 'done';
    createdBy: string;
    priority: 'low' | 'medium' | 'high';
    type: 'feature' | 'bug' | 'design' | 'marketing' | 'planning' | 'documentation' | 'financial';
}

export interface PullRequest {
    id: string;
    title: string;
    description: string;
    author: string;
    status: 'open' | 'approved' | 'merged' | 'rejected';
    reviewers: string[];
    createdAt: Date;
}

export interface OKR {
    id: string;
    objective: string;
    keyResults: string[];
    progress: number;
    owner: string;
}

export interface Documentation {
    id: string;
    title: string;
    type: 'api' | 'user-guide' | 'technical' | 'onboarding';
    content: string;
    author: string;
    lastUpdated: Date;
    version: string;
}

export interface FinancialRecord {
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
    runway: number;
    arr: number;
    mrr: number;
    burnRate: number;
    cash?: number;
}

export interface TimelineEvent {
    id: string;
    date: Date;
    title: string;
    description: string;
    type: 'milestone' | 'feature' | 'hire' | 'funding' | 'launch';
    impact: 'high' | 'medium' | 'low';
}

export interface ProjectConfig {
    projectName: string;
    domain: string;
    duration: number; // in months
    description: string;
}

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

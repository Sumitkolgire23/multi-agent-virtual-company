import { useState, useCallback } from 'react';
import { Agent, Message, Task, PullRequest, Documentation, UserSettings, ProjectConfig } from '../types';
import { initialAgents } from '../data/agents';
import { getRandomEvent } from '../utils/domainKnowledge';
import { toast } from 'sonner';

interface UseAgentLoopProps {
    settings: UserSettings;
    projectConfig: ProjectConfig | null;
    currentDate: Date;
    onUpdateMetrics: () => void;
    setMetrics: React.Dispatch<React.SetStateAction<any>>;
}

export function useAgentLoop({ settings, projectConfig, currentDate, onUpdateMetrics, setMetrics }: UseAgentLoopProps) {
    const [agents, setAgents] = useState<Agent[]>(initialAgents);
    const [messages, setMessages] = useState<Message[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
    const [documentation, setDocumentation] = useState<Documentation[]>([]);

    const addMessage = useCallback((agent: Agent, content: string, type: Message['type']) => {
        const newMessage: Message = {
            id: Date.now().toString() + Math.random(),
            agentId: agent.id,
            agentName: agent.name,
            content,
            timestamp: new Date(currentDate),
            type
        };
        setMessages(prev => [...prev, newMessage]);
    }, [currentDate]);

    const createTask = (agent: Agent, activity: any) => {
        const newTask: Task = {
            id: Date.now().toString() + Math.random(),
            title: activity.title,
            description: activity.description,
            assignedTo: agents[Math.floor(Math.random() * agents.length)].id,
            status: 'backlog',
            createdBy: agent.id,
            priority: activity.priority,
            type: activity.taskType
        };
        setTasks(prev => [...prev, newTask]);
        addMessage(agent, `Created new task: ${activity.title}`, 'task');
        if (settings.notifications.taskUpdates) toast.info(`📋 New task: ${activity.title}`);
    };

    const createDocumentation = (agent: Agent, activity: any) => {
        // ... logic simplified for brevity, assume similar to before
        const docContents: { [key: string]: string } = {
            api: `# API Documentation\n\n## Authentication\nAll API requests require authentication.\n`,
            'user-guide': `# User Guide\n\nWelcome to our platform!\n`,
            technical: `# Technical Architecture\n\n## System Overview\nMicroservices architecture.\n`,
            onboarding: `# Onboarding Guide\n\n## Welcome!\nThank you for joining us.\n`
        };
        const newDoc: Documentation = {
            id: Date.now().toString() + Math.random(),
            title: activity.title || `${activity.docType} Documentation`,
            type: activity.docType,
            content: docContents[activity.docType] || 'Documentation content...',
            author: agent.id,
            lastUpdated: new Date(currentDate),
            version: '1.0.0'
        };
        setDocumentation(prev => [...prev, newDoc]);
        addMessage(agent, `📄 Published: ${newDoc.title}`, 'documentation');
        setMetrics((prev: any) => ({ ...prev, docsPages: prev.docsPages + 1 }));
    };

    const reportBug = (agent: Agent) => {
        const bugs = ['Found a memory leak', 'Login button issue', 'API error'];
        const bug = bugs[Math.floor(Math.random() * bugs.length)];
        const newTask: Task = {
            id: Date.now().toString() + Math.random(),
            title: `Bug: ${bug}`,
            description: 'Needs attention',
            assignedTo: 'developer',
            status: 'backlog',
            createdBy: agent.id,
            priority: 'high',
            type: 'bug'
        };
        setTasks(prev => [...prev, newTask]);
        addMessage(agent, `🐛 Found bug: ${bug}`, 'bug');
        setMetrics((prev: any) => ({ ...prev, bugs: prev.bugs + 1 }));
    };

    const createPullRequest = (agent: Agent) => {
        const prTitles = ['Add auth flow', 'Optimize DB', 'Fix bug'];
        const newPR: PullRequest = {
            id: Date.now().toString() + Math.random(),
            title: prTitles[Math.floor(Math.random() * prTitles.length)],
            description: 'Ready for review',
            author: agent.id,
            status: 'open',
            reviewers: ['qa', 'ceo'],
            createdAt: new Date(currentDate)
        };
        setPullRequests(prev => [...prev, newPR]);
        addMessage(agent, `📝 Opened PR: ${newPR.title}`, 'pr');
        setMetrics((prev: any) => ({ ...prev, prsOpened: prev.prsOpened + 1 }));
    };

    const reviewPullRequest = (agent: Agent) => {
        const openPRs = pullRequests.filter(pr => pr.status === 'open');
        if (openPRs.length > 0) {
            const pr = openPRs[Math.floor(Math.random() * openPRs.length)];
            setPullRequests(prev => prev.map(p => p.id === pr.id ? { ...p, status: 'approved' } : p));
            addMessage(agent, `✅ Approved PR: ${pr.title}`, 'pr');
        }
    };

    const completeRandomTask = (agent: Agent) => {
        const incompleteTasks = tasks.filter(t => t.status !== 'done' && t.assignedTo === agent.id);
        if (incompleteTasks.length > 0) {
            const task = incompleteTasks[Math.floor(Math.random() * incompleteTasks.length)];
            setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'done' } : t));
            setMetrics((prev: any) => ({ ...prev, tasksCompleted: prev.tasksCompleted + 1 }));
            setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, tasksCompleted: a.tasksCompleted + 1 } : a));
            addMessage(agent, `✅ Completed: ${task.title}`, 'task');
        }
    };

    const executeActivity = (agent: Agent, activity: any) => {
        switch (activity.type) {
            case 'message': addMessage(agent, activity.content, 'message'); break;
            case 'task': createTask(agent, activity); break;
            case 'complete': completeRandomTask(agent); break;
            case 'bug': reportBug(agent); break;
            case 'pr': createPullRequest(agent); break;
            case 'review': reviewPullRequest(agent); break;
            case 'decision': addMessage(agent, activity.content, 'decision'); break;
            case 'documentation': createDocumentation(agent, activity); break;
            case 'financial': addMessage(agent, activity.content, 'financial'); break;
        }
    };

    const getAgentActivities = (agent: Agent) => {
        // Ideally moved to utils or data
        // For now, same hardcoded list
        const activities: { [key: string]: any[] } = {
            ceo: [
                { type: 'message', content: 'We need to prioritize user onboarding this week. Thoughts?' },
                { type: 'task', title: 'Define Q1 OKRs', description: 'Set quarterly objectives', priority: 'high', taskType: 'planning' }
            ],
            developer: [
                { type: 'message', content: 'Just deployed the new authentication system.' },
                { type: 'pr', content: '' }
            ],
            designer: [{ type: 'message', content: 'New mockups are ready.' }],
            marketer: [{ type: 'message', content: 'Social engagement is up.' }],
            qa: [{ type: 'bug', content: '' }],
            docs: [{ type: 'documentation', content: '', docType: 'api', title: 'API Reference' }],
            cfo: [{ type: 'financial', content: 'Monthly financial review.' }]
        };
        return activities[agent.id] || [{ type: 'message', content: 'Working...' }];
    };

    const simulateAgentActivity = useCallback(async () => {
        if (!projectConfig) return;

        try {
            // BACKEND INTEGRATION (Phase 1)
            // Call the local python backend
            const payload = {
                agents: agents,
                projectConfig: projectConfig,
                currentDate: currentDate.toISOString()
            };

            const response = await fetch('http://localhost:8000/simulation/tick', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();

                // Process backend actions
                if (data.actions && data.actions.length > 0) {
                    const action = data.actions[0]; // Process one for now
                    const agent = agents.find(a => a.id === action.agentId) || agents[0];

                    setAgents(prev => prev.map(a =>
                        a.id === agent.id ? { ...a, status: 'active' as const } : a
                    ));

                    executeActivity(agent, action);
                }

                // Process backend events
                if (data.events && data.events.length > 0) {
                    data.events.forEach((event: string) => addMessage(initialAgents[0], event, 'decision'));
                }

                // Process backend metrics
                if (data.metrics_update) {
                    setMetrics((prev: any) => ({ ...prev, ...data.metrics_update }));
                } else {
                    onUpdateMetrics(); // Fallback metric update
                }
                return;
            }
        } catch (error) {
            console.warn("Backend tick failed, falling back to local simulation:", error);
        }

        // FALLBACK LOCAL SIMULATION
        const randomAgent = agents[Math.floor(Math.random() * agents.length)];

        if (settings.agents.enableRandomEvents && projectConfig) {
            const randomEvent = getRandomEvent(projectConfig.domain);
            if (randomEvent) {
                addMessage(initialAgents[0], randomEvent, 'decision');
                return;
            }
        }

        const activities = getAgentActivities(randomAgent);
        const activity = activities[Math.floor(Math.random() * activities.length)];

        setAgents(prev => prev.map(a =>
            a.id === randomAgent.id ? { ...a, status: 'thinking' as const } : a
        ));

        setTimeout(() => {
            setAgents(prev => prev.map(a =>
                a.id === randomAgent.id ? { ...a, status: 'active' as const } : a
            ));
            executeActivity(randomAgent, activity);
            onUpdateMetrics();
        }, 500);
    }, [agents, settings, projectConfig, currentDate, onUpdateMetrics]);

    const resetAgents = useCallback(() => {
        setAgents(initialAgents);
        setMessages([]);
        setTasks([]);
        setPullRequests([]);
        setDocumentation([]);
    }, []);

    return {
        agents,
        messages,
        tasks,
        pullRequests,
        documentation,
        setAgents,
        setMessages,
        setTasks,
        setPullRequests,
        setDocumentation,
        simulateAgentActivity,
        addMessage,
        resetAgents
    };
}

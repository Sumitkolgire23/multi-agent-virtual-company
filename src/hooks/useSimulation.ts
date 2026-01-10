import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../components/AuthContext';
import { projectId } from '../utils/supabase/info';
import {
    ProjectConfig, UserSettings, Snapshot, Task
} from '../types';
import { initialAgents } from '../data/agents';
import { getOKRsForDomain } from '../data/okrs';
import { competitorNames, initialMarketEvents } from '../data/competitors';
import { defaultSettings } from '../data/settings';
import { useTime } from './useTime';
import { useFinancials } from './useFinancials';
import { useMetrics } from './useMetrics';
import { useAgentLoop } from './useAgentLoop';

export function useSimulation() {
    const { user, accessToken } = useAuth();

    // UI State
    const [showSetup, setShowSetup] = useState(true);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showSavedSims, setShowSavedSims] = useState(false);

    // Core Data State
    const [projectConfig, setProjectConfig] = useState<ProjectConfig | null>(null);
    const [settings, setSettings] = useState<UserSettings>(defaultSettings);
    const [isSimulating, setIsSimulating] = useState(false);
    const [simulationSpeed, setSimulationSpeed] = useState(1);

    // Domain State
    const [okrs, setOKRs] = useState<any[]>([]); // Typed as OKR[] in sub-hooks if needed, but here simple
    const [competitors, setCompetitors] = useState<any[]>([]);
    const [marketEvents, setMarketEvents] = useState<any[]>([]);
    const [marketShare, setMarketShare] = useState(5.0);
    const [totalMarketSize, setTotalMarketSize] = useState(50000000);
    const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
    const [currentSnapshotIndex, setCurrentSnapshotIndex] = useState(0);

    const autoSaveRef = useRef<NodeJS.Timeout | null>(null);

    // Sub-hooks
    const {
        metrics, productProgress, setMetrics, setProductProgress, updateMetricsAndProgress, resetMetrics
    } = useMetrics();

    const {
        currentDate, timeline, setTimeline, setCurrentDate, addTimelineEvent, skipTime, resetTime
    } = useTime({
        settings,
        simulationSpeed,
        isSimulating,
        onTick: () => simulateAgentActivity()
    });

    const {
        financialRecords, setFinancialRecords, generateMonthlyFinancialReport, resetFinancials
    } = useFinancials(settings);

    const {
        agents, messages, tasks, pullRequests, documentation,
        setAgents, setMessages, setTasks, setPullRequests, setDocumentation,
        simulateAgentActivity, addMessage, resetAgents
    } = useAgentLoop({
        settings,
        projectConfig,
        currentDate,
        onUpdateMetrics: updateMetricsAndProgress,
        setMetrics
    });

    // Load settings on mount
    useEffect(() => {
        if (user && accessToken) {
            loadSettings();
        }
    }, [user, accessToken]);

    // Financial Reporting Loop integration
    useEffect(() => {
        const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
        const existingRecord = financialRecords.find(r => r.month === currentMonth);

        if (!existingRecord && currentDate.getDate() === 1) {
            generateMonthlyFinancialReport(currentMonth, metrics.revenue);
        }
    }, [currentDate, financialRecords, generateMonthlyFinancialReport, metrics.revenue]);

    // Auto-save functionality
    useEffect(() => {
        if (settings.simulation.autoSave && projectConfig && user && accessToken && !showSetup) {
            const interval = settings.simulation.autoSaveInterval * 60 * 1000;

            autoSaveRef.current = setInterval(() => {
                handleSaveSimulation();
            }, interval);

            return () => {
                if (autoSaveRef.current) clearInterval(autoSaveRef.current);
            };
        }
    }, [settings.simulation.autoSave, settings.simulation.autoSaveInterval, projectConfig, user, showSetup]);

    const loadSettings = async () => {
        if (!projectId || !accessToken) return;
        try {
            const response = await fetch(
                `https://${projectId}.supabase.co/functions/v1/make-server-49b02a60/settings`,
                { headers: { 'Authorization': `Bearer ${accessToken}` } }
            );
            const data = await response.json();
            if (data.settings) {
                setSettings(data.settings);
                setSimulationSpeed(data.settings.simulation.defaultSpeed);
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    };

    const handleSaveSimulation = async () => {
        if (!user || !accessToken || !projectConfig || !projectId) {
            toast.error('Please sign in to save simulations');
            return;
        }
        try {
            const simulationData = {
                id: Date.now().toString(),
                projectName: projectConfig.projectName,
                domain: projectConfig.domain,
                currentDate: currentDate.toISOString(),
                productProgress,
                metrics,
                agents,
                messages: messages.slice(-50),
                tasks,
                pullRequests,
                okrs,
                documentation,
                financialRecords,
                timeline
            };
            const response = await fetch(
                `https://${projectId}.supabase.co/functions/v1/make-server-49b02a60/save-simulation`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
                    body: JSON.stringify(simulationData)
                }
            );
            if (response.ok) toast.success('Simulation saved successfully!');
        } catch (error) {
            console.error('Failed to save simulation:', error);
            toast.error('Failed to save simulation');
        }
    };

    const handleLoadSimulation = (simulation: any) => {
        setProjectConfig({
            projectName: simulation.projectName,
            domain: simulation.domain,
            duration: 6,
            description: ''
        });
        setCurrentDate(new Date(simulation.currentDate));
        setProductProgress(simulation.productProgress);
        setMetrics(simulation.metrics);
        setAgents(simulation.agents || initialAgents);
        setMessages(simulation.messages || []);
        setTasks(simulation.tasks || []);
        setPullRequests(simulation.pullRequests || []);
        setOKRs(simulation.okrs || []);
        setDocumentation(simulation.documentation || []);
        setFinancialRecords(simulation.financialRecords || []);
        setTimeline(simulation.timeline || []);
        setShowSetup(false);
        setShowSavedSims(false);
        toast.success('Simulation loaded!');
    };

    const handleProjectSetup = (config: ProjectConfig) => {
        setProjectConfig(config);
        setShowSetup(false);

        const domainOKRs = getOKRsForDomain(config.domain);
        setOKRs(domainOKRs);

        setCompetitors(competitorNames.map((c, i) => ({ ...c, id: `comp-${i}` })));
        setMarketEvents(initialMarketEvents);

        // Initial snapshot logic... quite verbose, maybe move to useTimeTravel?
        // kept simple here for now
        const initialSnapshot: Snapshot = {
            id: 'snapshot-0',
            date: new Date(),
            label: 'Project Start',
            simulationDay: 0,
            data: {
                agents: initialAgents,
                tasks: [],
                messages: [],
                pullRequests: [],
                okrs: domainOKRs,
                documentation: [],
                financialRecords: [],
                timeline: [],
                productProgress: 0,
                metrics: {
                    tasksCompleted: 0, features: 0, bugs: 0, prsOpened: 0, prsMerged: 0,
                    users: 0, revenue: 0, testCoverage: 0, docsPages: 0
                }
            }
        };
        setSnapshots([initialSnapshot]);

        addTimelineEvent({
            title: `${config.projectName} Founded`,
            description: `Started ${config.domain} project with ${config.duration} month timeline`,
            type: 'milestone',
            impact: 'high'
        });

        if (settings.notifications.milestones) {
            toast.success(`🚀 ${config.projectName} simulation started!`);
        }
    };

    const startSimulation = () => {
        setIsSimulating(true);
        addMessage(initialAgents[0], `🚀 Let's build ${projectConfig?.projectName || 'something amazing'}!`, 'decision');
    };

    const stopSimulation = () => setIsSimulating(false);

    const resetSimulation = () => {
        setIsSimulating(false);
        setShowSetup(true);
        setProjectConfig(null);
        resetAgents();
        resetMetrics();
        resetFinancials();
        resetTime();
        setProductProgress(0);
        setSnapshots([]);
    };

    const newTaskUpdateStatus = (taskId: string, status: Task['status']) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
    };

    return {
        state: {
            showSetup, showAuthModal, showSettings, showSavedSims,
            projectConfig, settings, agents, messages, tasks,
            pullRequests, okrs, documentation, financialRecords,
            timeline, isSimulating, simulationSpeed, productProgress,
            currentDate, metrics, snapshots, currentSnapshotIndex,
            competitors, marketEvents, marketShare, totalMarketSize
        },
        actions: {
            setShowSetup, setShowAuthModal, setShowSettings, setShowSavedSims,
            setSettings, setSimulationSpeed, handleSaveSimulation,
            handleLoadSimulation, handleProjectSetup, startSimulation,
            stopSimulation, resetSimulation, skipTime, newTaskUpdateStatus,
            setSnapshots, setCurrentSnapshotIndex
        }
    };
}

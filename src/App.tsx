import { Briefcase, Zap, Pause, Sun, Moon, RotateCcw, Settings, Save, User, FolderOpen, LogOut, LogIn, TrendingUp, History, Download } from 'lucide-react';
import { Button } from './components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Badge } from './components/ui/badge';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import { getSmartAgentAction, getRandomEvent, getDomainMetrics } from './utils/domainKnowledge';
import { projectId } from './utils/supabase/info';
import { ThemeProvider, useTheme } from './components/ThemeProvider';
import { AuthProvider, useAuth } from './components/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { ProjectSetupModal } from './components/ProjectSetupModal';
import { AuthModal } from './components/AuthModal';
import { SettingsModal } from './components/SettingsModal';
import { SavedSimulationsModal } from './components/SavedSimulationsModal';
import { AgentCard } from './components/AgentCard';
import { CompanyMetrics } from './components/CompanyMetrics';
import { ChatPanel } from './components/ChatPanel';
import { TaskBoard } from './components/TaskBoard';
import { PullRequestPanel } from './components/PullRequestPanel';
import { OKRPanel } from './components/OKRPanel';
import { DocumentationPanel } from './components/DocumentationPanel';
import { FinancialReports } from './components/FinancialReports';
import { TimelinePanel } from './components/TimelinePanel';
import { ProductProgress } from './components/ProductProgress';
import { TimeControls } from './components/TimeControls';
import { AdvancedAnalytics } from './components/AdvancedAnalytics';
import { MarketSimulation } from './components/MarketSimulation';
import { TimeTravel, type Snapshot } from './components/TimeTravel';
import { ExportImport } from './components/ExportImport';
import { defaultSettings } from './components/SettingsModal';
import type { ProjectConfig, UserSettings } from './components/ProjectSetupModal';

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
}

export interface TimelineEvent {
  id: string;
  date: Date;
  title: string;
  description: string;
  type: 'milestone' | 'feature' | 'hire' | 'funding' | 'launch';
  impact: 'high' | 'medium' | 'low';
}

const initialAgents: Agent[] = [
  {
    id: 'ceo',
    name: 'Alex Chen',
    role: 'CEO',
    avatar: '👔',
    status: 'active',
    personality: 'Strategic visionary, drives product direction',
    tasksCompleted: 0
  },
  {
    id: 'developer',
    name: 'Sam Rodriguez',
    role: 'Lead Developer',
    avatar: '💻',
    status: 'active',
    personality: 'Tech-savvy problem solver, builds features',
    tasksCompleted: 0
  },
  {
    id: 'designer',
    name: 'Maya Patel',
    role: 'UX Designer',
    avatar: '🎨',
    status: 'active',
    personality: 'User-focused creative, designs experiences',
    tasksCompleted: 0
  },
  {
    id: 'marketer',
    name: 'Jordan Kim',
    role: 'Marketing Lead',
    avatar: '📱',
    status: 'active',
    personality: 'Growth hacker, builds audience & brand',
    tasksCompleted: 0
  },
  {
    id: 'qa',
    name: 'Taylor Swift',
    role: 'QA Engineer',
    avatar: '🧪',
    status: 'active',
    personality: 'Quality guardian, ensures reliability',
    tasksCompleted: 0
  },
  {
    id: 'docs',
    name: 'Riley Morgan',
    role: 'Documentation Lead',
    avatar: '📚',
    status: 'active',
    personality: 'Clear communicator, makes complex simple',
    tasksCompleted: 0
  },
  {
    id: 'cfo',
    name: 'Casey Lin',
    role: 'CFO',
    avatar: '💰',
    status: 'active',
    personality: 'Financial strategist, manages growth & runway',
    tasksCompleted: 0
  }
];

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const { user, accessToken, signOut } = useAuth();
  
  const [showSetup, setShowSetup] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSavedSims, setShowSavedSims] = useState(false);
  
  const [projectConfig, setProjectConfig] = useState<ProjectConfig | null>(null);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [messages, setMessages] = useState<Message[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [okrs, setOKRs] = useState<OKR[]>([]);
  const [documentation, setDocumentation] = useState<Documentation[]>([]);
  const [financialRecords, setFinancialRecords] = useState<FinancialRecord[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [productProgress, setProductProgress] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1));
  const [metrics, setMetrics] = useState({
    tasksCompleted: 0,
    features: 0,
    bugs: 0,
    prsOpened: 0,
    prsMerged: 0,
    users: 0,
    revenue: 0,
    testCoverage: 0,
    docsPages: 0
  });

  // New state for advanced features
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [currentSnapshotIndex, setCurrentSnapshotIndex] = useState(0);
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [marketEvents, setMarketEvents] = useState<any[]>([]);
  const [marketShare, setMarketShare] = useState(5.0);
  const [totalMarketSize, setTotalMarketSize] = useState(50000000);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null);
  const snapshotRef = useRef<NodeJS.Timeout | null>(null);

  // Load settings on mount
  useEffect(() => {
    if (user && accessToken) {
      loadSettings();
    }
  }, [user, accessToken]);

  // Auto-save functionality
  useEffect(() => {
    if (settings.simulation.autoSave && projectConfig && user && accessToken && !showSetup) {
      const interval = settings.simulation.autoSaveInterval * 60 * 1000; // Convert to ms
      
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
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
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
        messages: messages.slice(-50), // Save last 50 messages
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
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(simulationData)
        }
      );

      if (response.ok) {
        toast.success('Simulation saved successfully!');
      }
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

    // Initialize competitors for the market
    const competitorNames = [
      { name: 'TechCore Inc', marketShare: 15, strength: 75, trend: 'up' as const },
      { name: 'InnovateLabs', marketShare: 22, strength: 85, trend: 'up' as const, recentLaunch: 'AI-powered analytics' },
      { name: 'StartupBoost', marketShare: 12, strength: 65, trend: 'stable' as const },
      { name: 'FastGrow Systems', marketShare: 18, strength: 72, trend: 'up' as const },
      { name: 'Legacy Solutions', marketShare: 28, strength: 55, trend: 'down' as const }
    ];
    setCompetitors(competitorNames.map((c, i) => ({ ...c, id: `comp-${i}` })));

    // Initialize market events
    const initialMarketEvents = [
      {
        id: '1',
        type: 'trend' as const,
        title: 'Industry Growth Accelerating',
        description: `${config.domain} market seeing 35% YoY growth`,
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
    setMarketEvents(initialMarketEvents);

    // Create initial snapshot
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
          tasksCompleted: 0,
          features: 0,
          bugs: 0,
          prsOpened: 0,
          prsMerged: 0,
          users: 0,
          revenue: 0,
          testCoverage: 0,
          docsPages: 0
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

  const getOKRsForDomain = (domain: string): OKR[] => {
    const baseOKRs: { [key: string]: OKR[] } = {
      saas: [
        {
          id: '1',
          objective: 'Launch SaaS MVP Successfully',
          keyResults: ['Ship 10 core features', 'Achieve 95% test coverage', 'Onboard 100 beta users'],
          progress: 0,
          owner: 'ceo'
        },
        {
          id: '2',
          objective: 'Build Strong Market Presence',
          keyResults: ['Grow to 1K users', 'Achieve $10K MRR', 'Get 3 case studies'],
          progress: 0,
          owner: 'marketer'
        }
      ],
      ecommerce: [
        {
          id: '1',
          objective: 'Launch Online Store',
          keyResults: ['List 100 products', 'Process 500 orders', 'Achieve 3% conversion rate'],
          progress: 0,
          owner: 'ceo'
        },
        {
          id: '2',
          objective: 'Drive Traffic & Sales',
          keyResults: ['Reach 10K monthly visitors', 'Hit $50K GMV', 'Build email list of 2K'],
          progress: 0,
          owner: 'marketer'
        }
      ],
      fintech: [
        {
          id: '1',
          objective: 'Build Secure Platform',
          keyResults: ['Pass security audit', 'Achieve SOC 2 compliance', 'Zero security incidents'],
          progress: 0,
          owner: 'developer'
        },
        {
          id: '2',
          objective: 'Acquire Users',
          keyResults: ['Onboard 1K users', 'Process $1M transactions', 'Achieve 40% retention'],
          progress: 0,
          owner: 'ceo'
        }
      ],
      healthcare: [
        {
          id: '1',
          objective: 'Ensure HIPAA Compliance',
          keyResults: ['Complete security audit', 'Train all staff', 'Implement data encryption'],
          progress: 0,
          owner: 'ceo'
        },
        {
          id: '2',
          objective: 'Build Provider Network',
          keyResults: ['Onboard 50 providers', 'Achieve 90% satisfaction', '1K patient visits'],
          progress: 0,
          owner: 'ceo'
        }
      ],
      default: [
        {
          id: '1',
          objective: 'Launch MVP Successfully',
          keyResults: ['Ship 10 core features', 'Achieve 95% test coverage', 'Onboard 100 users'],
          progress: 0,
          owner: 'ceo'
        },
        {
          id: '2',
          objective: 'Achieve Product-Market Fit',
          keyResults: ['Reach 1K users', 'Achieve $20K MRR', '60% user retention'],
          progress: 0,
          owner: 'ceo'
        }
      ]
    };

    return baseOKRs[domain] || baseOKRs.default;
  };

  useEffect(() => {
    if (isSimulating) {
      const activityMultiplier = settings.agents.activityFrequency === 'high' ? 0.5 : 
                                 settings.agents.activityFrequency === 'low' ? 2 : 1;
      const baseInterval = (3000 * activityMultiplier) / simulationSpeed;
      
      intervalRef.current = setInterval(() => {
        simulateAgentActivity();
        advanceTime();
      }, baseInterval);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [isSimulating, simulationSpeed, settings.agents.activityFrequency, messages, tasks, pullRequests]);

  const advanceTime = () => {
    setCurrentDate(prev => {
      const next = new Date(prev);
      next.setDate(next.getDate() + 1);
      return next;
    });
  };

  const skipTime = (days: number) => {
    const iterations = Math.floor(days / 2);
    for (let i = 0; i < iterations; i++) {
      simulateAgentActivity();
      updateMetricsAndProgress();
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
  };

  useEffect(() => {
    const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    const existingRecord = financialRecords.find(r => r.month === currentMonth);
    
    if (!existingRecord && currentDate.getDate() === 1) {
      generateMonthlyFinancialReport(currentMonth);
    }
  }, [currentDate]);

  useEffect(() => {
    const dayOfYear = Math.floor((currentDate.getTime() - new Date(currentDate.getFullYear(), 0, 0).getTime()) / 86400000);
    if (dayOfYear % 14 === 0 && isSimulating) {
      conductSprintMeeting();
    }
  }, [currentDate]);

  const conductSprintMeeting = () => {
    setAgents(prev => prev.map(a => ({ ...a, status: 'meeting' as const })));
    
    addMessage(initialAgents[0], '📅 Sprint Planning Meeting - Let\'s review our progress and set new goals!', 'meeting');
    
    if (settings.simulation.pauseOnMilestone) {
      setIsSimulating(false);
      toast.info('Simulation paused for sprint meeting');
    }
    
    setTimeout(() => {
      const randomAgent = agents[Math.floor(Math.random() * agents.length)];
      const meetingComments = [
        'We\'re making great progress on the core features!',
        'I think we should focus more on testing this sprint.',
        'Customer feedback has been positive, let\'s capitalize on that.',
        'We need to address technical debt before it becomes a problem.',
        'Marketing metrics are trending upward!',
        'Documentation is helping reduce support tickets.',
        'Our burn rate is healthy - we have good runway.'
      ];
      addMessage(randomAgent, meetingComments[Math.floor(Math.random() * meetingComments.length)], 'meeting');
      
      setAgents(prev => prev.map(a => ({ ...a, status: 'active' as const })));
    }, 2000);
  };

  const generateMonthlyFinancialReport = (month: string) => {
    const baseRevenue = metrics.revenue;
    const expenses = 85000 + Math.random() * 15000;
    const profit = baseRevenue - expenses;
    const runway = profit < 0 ? Math.max(6, 18 - (Math.abs(profit) / 10000)) : 24;

    const newRecord: FinancialRecord = {
      month,
      revenue: baseRevenue,
      expenses: Math.floor(expenses),
      profit: Math.floor(profit),
      runway: Math.floor(runway),
      arr: Math.floor(baseRevenue * 12),
      mrr: Math.floor(baseRevenue),
      burnRate: Math.floor(Math.abs(profit))
    };

    setFinancialRecords(prev => [...prev, newRecord]);

    if (settings.notifications.financialAlerts && runway < 12) {
      toast.warning(`⚠️ Runway is ${Math.floor(runway)} months - consider fundraising`);
    }
  };

  const simulateAgentActivity = async () => {
    const randomAgent = agents[Math.floor(Math.random() * agents.length)];
    
    // Check for random events
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
      updateMetricsAndProgress();
    }, 500 / simulationSpeed);
  };

  const executeActivity = (agent: Agent, activity: any) => {
    switch (activity.type) {
      case 'message':
        addMessage(agent, activity.content, 'message');
        break;
      case 'task':
        createTask(agent, activity);
        break;
      case 'complete':
        completeRandomTask(agent);
        break;
      case 'bug':
        reportBug(agent);
        break;
      case 'pr':
        createPullRequest(agent);
        break;
      case 'review':
        reviewPullRequest(agent);
        break;
      case 'decision':
        addMessage(agent, activity.content, 'decision');
        break;
      case 'documentation':
        createDocumentation(agent, activity);
        break;
      case 'financial':
        addMessage(agent, activity.content, 'financial');
        break;
    }
  };

  const getAgentActivities = (agent: Agent) => {
    const activities: { [key: string]: any[] } = {
      ceo: [
        { type: 'message', content: 'We need to prioritize user onboarding this week. Thoughts?' },
        { type: 'message', content: 'Great progress team! Let\'s focus on the MVP features.' },
        { type: 'decision', content: 'Approved the new feature roadmap. Let\'s execute!' },
        { type: 'task', title: 'Define Q1 OKRs', description: 'Set quarterly objectives and key results', priority: 'high', taskType: 'planning' },
        { type: 'message', content: 'Customer feedback is coming in positive! Keep it up.' },
        { type: 'decision', content: 'Let\'s pivot our pricing strategy based on user research.' }
      ],
      developer: [
        { type: 'message', content: 'Just deployed the new authentication system. Testing now.' },
        { type: 'message', content: 'Working on the API optimization - should improve speed by 40%.' },
        { type: 'task', title: 'Build user dashboard', description: 'Create analytics dashboard for users', priority: 'high', taskType: 'feature' },
        { type: 'complete', content: '' },
        { type: 'pr', content: '' },
        { type: 'message', content: 'Refactoring the payment service for better scalability.' }
      ],
      designer: [
        { type: 'message', content: 'New mockups are ready for the landing page redesign!' },
        { type: 'message', content: 'User research shows we need better mobile navigation.' },
        { type: 'task', title: 'Design onboarding flow', description: 'Create user-friendly onboarding wireframes', priority: 'medium', taskType: 'design' },
        { type: 'message', content: 'Updated the design system with new color palette.' },
        { type: 'complete', content: '' },
        { type: 'message', content: 'Created interactive prototypes for user testing.' }
      ],
      marketer: [
        { type: 'message', content: 'Our social media engagement is up 35% this week!' },
        { type: 'message', content: 'Planning a launch campaign for next month. Need input.' },
        { type: 'task', title: 'Create launch content', description: 'Prepare blog posts and social content', priority: 'medium', taskType: 'marketing' },
        { type: 'message', content: 'SEO improvements are showing results - organic traffic doubled!' },
        { type: 'message', content: 'Reaching out to potential beta users for feedback.' },
        { type: 'complete', content: '' }
      ],
      qa: [
        { type: 'message', content: 'Running automated test suite on latest build...' },
        { type: 'bug', content: '' },
        { type: 'message', content: 'Test coverage is now at 87% and climbing!' },
        { type: 'review', content: '' },
        { type: 'message', content: 'Performance tests passed - load time under 2 seconds!' },
        { type: 'complete', content: '' }
      ],
      docs: [
        { type: 'documentation', content: '', docType: 'api', title: 'API Reference' },
        { type: 'documentation', content: '', docType: 'user-guide', title: 'User Guide' },
        { type: 'message', content: 'Updated onboarding documentation based on user feedback.' },
        { type: 'task', title: 'Create video tutorials', description: 'Produce tutorial videos for new features', priority: 'medium', taskType: 'documentation' },
        { type: 'complete', content: '' },
        { type: 'message', content: 'Published technical architecture documentation for developers.' }
      ],
      cfo: [
        { type: 'financial', content: 'Monthly financial review: Revenue up 23%, runway stable at 16 months.' },
        { type: 'message', content: 'Analyzing pricing model optimization opportunities.' },
        { type: 'task', title: 'Prepare investor deck', description: 'Update financial projections for Series A', priority: 'high', taskType: 'financial' },
        { type: 'financial', content: 'CAC decreased by 18% through improved conversion funnel.' },
        { type: 'complete', content: '' },
        { type: 'message', content: 'Negotiated better terms with infrastructure provider - 25% cost savings.' }
      ]
    };

    return activities[agent.id] || [];
  };

  const addMessage = (agent: Agent, content: string, type: Message['type']) => {
    const newMessage: Message = {
      id: Date.now().toString() + Math.random(),
      agentId: agent.id,
      agentName: agent.name,
      content,
      timestamp: new Date(currentDate),
      type
    };

    setMessages(prev => [...prev, newMessage]);

    if (settings.notifications.agentMessages && type === 'message') {
      // toast.info(`${agent.name}: ${content.substring(0, 50)}...`);
    }
  };

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

    if (settings.notifications.taskUpdates) {
      toast.info(`📋 New task: ${activity.title}`);
    }
  };

  const createDocumentation = (agent: Agent, activity: any) => {
    const docContents: { [key: string]: string } = {
      api: `# API Documentation\\n\\n## Authentication\\nAll API requests require authentication using JWT tokens.\\n\\n## Endpoints\\n- GET /api/users - List all users\\n- POST /api/users - Create new user\\n- GET /api/products - List products`,
      'user-guide': `# User Guide\\n\\nWelcome to our platform! This guide will help you get started.\\n\\n## Getting Started\\n1. Create an account\\n2. Complete your profile\\n3. Start using features\\n\\n## Tips & Tricks\\n- Use keyboard shortcuts for faster navigation\\n- Enable notifications for updates`,
      technical: `# Technical Architecture\\n\\n## System Overview\\nOur platform uses a microservices architecture with React frontend and Node.js backend.\\n\\n## Database Schema\\nPostgreSQL for relational data, Redis for caching.`,
      onboarding: `# Onboarding Guide\\n\\n## Welcome!\\nThank you for joining us. Here's how to get started:\\n\\n1. Complete your profile\\n2. Explore the dashboard\\n3. Join your first project`
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
    setMetrics(prev => ({ ...prev, docsPages: prev.docsPages + 1 }));
  };

  const reportBug = (agent: Agent) => {
    const bugs = [
      'Found a memory leak in the user session handler',
      'Login button not responsive on mobile Safari',
      'Payment confirmation email has wrong template',
      'Dashboard charts rendering incorrectly on Firefox',
      'API returning 500 error on edge case inputs'
    ];
    
    const bug = bugs[Math.floor(Math.random() * bugs.length)];
    const newTask: Task = {
      id: Date.now().toString() + Math.random(),
      title: `Bug: ${bug}`,
      description: 'Needs immediate attention',
      assignedTo: 'developer',
      status: 'backlog',
      createdBy: agent.id,
      priority: 'high',
      type: 'bug'
    };

    setTasks(prev => [...prev, newTask]);
    addMessage(agent, `🐛 Found bug: ${bug}`, 'bug');
    setMetrics(prev => ({ ...prev, bugs: prev.bugs + 1 }));
  };

  const createPullRequest = (agent: Agent) => {
    const prTitles = [
      'Add user authentication flow',
      'Implement dark mode toggle',
      'Optimize database queries',
      'Add email notification system',
      'Refactor component architecture'
    ];

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
    setMetrics(prev => ({ ...prev, prsOpened: prev.prsOpened + 1 }));
  };

  const reviewPullRequest = (agent: Agent) => {
    const openPRs = pullRequests.filter(pr => pr.status === 'open');
    if (openPRs.length > 0) {
      const pr = openPRs[Math.floor(Math.random() * openPRs.length)];
      const approved = Math.random() > 0.3;

      setPullRequests(prev => prev.map(p => 
        p.id === pr.id ? { ...p, status: approved ? 'approved' : 'open' } : p
      ));

      addMessage(agent, `${approved ? '✅ Approved' : '💬 Commented on'} PR: ${pr.title}`, 'pr');

      if (approved && Math.random() > 0.5) {
        setTimeout(() => mergePullRequest(pr.id), 1000);
      }
    }
  };

  const mergePullRequest = (prId: string) => {
    setPullRequests(prev => prev.map(pr => 
      pr.id === prId ? { ...pr, status: 'merged' as const } : pr
    ));
    setMetrics(prev => ({ ...prev, prsMerged: prev.prsMerged + 1 }));
  };

  const completeRandomTask = (agent: Agent) => {
    const incompleteTasks = tasks.filter(t => t.status !== 'done' && t.assignedTo === agent.id);
    if (incompleteTasks.length > 0) {
      const task = incompleteTasks[Math.floor(Math.random() * incompleteTasks.length)];
      updateTaskStatus(task.id, 'done');
      setMetrics(prev => ({ ...prev, tasksCompleted: prev.tasksCompleted + 1 }));
      setAgents(prev => prev.map(a => 
        a.id === agent.id ? { ...a, tasksCompleted: a.tasksCompleted + 1 } : a
      ));
      addMessage(agent, `✅ Completed: ${task.title}`, 'task');

      if (settings.notifications.taskUpdates) {
        toast.success(`✅ ${agent.name} completed: ${task.title}`);
      }
    }
  };

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
  };

  const updateMetricsAndProgress = () => {
    if (Math.random() > 0.7) {
      setProductProgress(prev => Math.min(100, prev + Math.random() * 3));
      setMetrics(prev => ({
        ...prev,
        features: prev.features + (Math.random() > 0.85 ? 1 : 0),
        users: prev.users + Math.floor(Math.random() * 25),
        revenue: prev.revenue + Math.floor(Math.random() * 250),
        testCoverage: Math.min(100, prev.testCoverage + Math.random() * 2)
      }));

      setOKRs(prev => prev.map(okr => ({
        ...okr,
        progress: Math.min(100, okr.progress + Math.random() * 5)
      })));
    }
  };

  const addTimelineEvent = (event: Omit<TimelineEvent, 'id' | 'date'>) => {
    const newEvent: TimelineEvent = {
      id: Date.now().toString() + Math.random(),
      date: new Date(currentDate),
      ...event
    };
    setTimeline(prev => [...prev, newEvent]);
  };

  const startSimulation = () => {
    setIsSimulating(true);
    addMessage(initialAgents[0], `🚀 Alright team, let's build ${projectConfig?.projectName || 'something amazing'}! Sprint starts now.`, 'decision');
  };

  const stopSimulation = () => {
    setIsSimulating(false);
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setShowSetup(true);
    setProjectConfig(null);
    setMessages([]);
    setTasks([]);
    setPullRequests([]);
    setDocumentation([]);
    setFinancialRecords([]);
    setTimeline([]);
    setProductProgress(0);
    setCurrentDate(new Date(2025, 0, 1));
    setSimulationSpeed(settings.simulation.defaultSpeed);
    setMetrics({ 
      tasksCompleted: 0, 
      features: 0, 
      bugs: 0, 
      prsOpened: 0, 
      prsMerged: 0, 
      users: 0, 
      revenue: 0,
      testCoverage: 0,
      docsPages: 0
    });
    setAgents(initialAgents);
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
  };

  if (showSetup) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full space-y-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl shadow-lg">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl text-slate-900 dark:text-white mb-2">Virtual Startup Simulator</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Watch AI agents build a startup from scratch with realistic workflows
            </p>
          </div>

          <div className="flex gap-3 justify-center">
            <ProjectSetupModal open={showSetup} onSubmit={handleProjectSetup} />
            
            {user ? (
              <>
                <Button variant="outline" onClick={() => setShowSavedSims(true)}>
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Load Simulation
                </Button>
                <Button variant="outline" onClick={() => setShowSettings(true)}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
                <Button variant="ghost" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setShowAuthModal(true)}>
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
            
            <Button variant="outline" size="icon" onClick={toggleTheme}>
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
        <SettingsModal 
          open={showSettings} 
          onClose={() => setShowSettings(false)}
          settings={settings}
          onSettingsChange={setSettings}
        />
        <SavedSimulationsModal
          open={showSavedSims}
          onClose={() => setShowSavedSims(false)}
          onLoad={handleLoadSimulation}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-[1600px] mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl text-slate-900 dark:text-white">{projectConfig?.projectName || 'Virtual Startup Simulator'}</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            {projectConfig && (
              <Badge variant="secondary" className="ml-2 capitalize">
                {projectConfig.domain}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <>
                <Button variant="ghost" size="sm" onClick={() => setShowSavedSims(true)}>
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Load
                </Button>
                <Button variant="ghost" size="sm" onClick={handleSaveSimulation}>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowSettings(true)}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
                <Button variant="ghost" size="icon" title={user.name}>
                  <User className="w-4 h-4" />
                </Button>
              </>
            )}

            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>

            <TimeControls
              isSimulating={isSimulating}
              simulationSpeed={simulationSpeed}
              onSpeedChange={setSimulationSpeed}
              onSkipTime={skipTime}
            />
            
            {!isSimulating ? (
              <Button onClick={startSimulation} size="lg" className="gap-2">
                <Zap className="w-4 h-4" />
                Start
              </Button>
            ) : (
              <Button onClick={stopSimulation} variant="secondary" size="lg" className="gap-2">
                <Pause className="w-4 h-4" />
                Pause
              </Button>
            )}
            
            <Button onClick={resetSimulation} variant="outline" size="lg" className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </div>

        {/* Agents */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {agents.map(agent => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>

        {/* Metrics */}
        <CompanyMetrics metrics={metrics} productProgress={productProgress} />

        {/* Main Content */}
        <Tabs defaultValue="chat" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6 lg:grid-cols-12 bg-slate-100 dark:bg-slate-900\">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="prs">PRs</TabsTrigger>
            <TabsTrigger value="okrs">OKRs</TabsTrigger>
            <TabsTrigger value="docs">Docs</TabsTrigger>
            <TabsTrigger value="finance">Finance</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="product">Product</TabsTrigger>
            <TabsTrigger value="analytics">
              <TrendingUp className="w-4 h-4 mr-1" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="market">Market</TabsTrigger>
            <TabsTrigger value="timetravel">
              <History className="w-4 h-4 mr-1" />
              Time Travel
            </TabsTrigger>
            <TabsTrigger value="export">
              <Download className="w-4 h-4 mr-1" />
              Export
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat">
            <ChatPanel 
              messages={messages} 
              agents={agents} 
              showTimestamps={settings.ui.showTimestamps}
              compactMode={settings.ui.compactMode}
            />
          </TabsContent>

          <TabsContent value="tasks">
            <TaskBoard tasks={tasks} agents={agents} onUpdateStatus={updateTaskStatus} />
          </TabsContent>

          <TabsContent value="prs">
            <PullRequestPanel pullRequests={pullRequests} agents={agents} />
          </TabsContent>

          <TabsContent value="okrs">
            <OKRPanel okrs={okrs} agents={agents} />
          </TabsContent>

          <TabsContent value="docs">
            <DocumentationPanel documentation={documentation} agents={agents} />
          </TabsContent>

          <TabsContent value="finance">
            <FinancialReports 
              records={financialRecords} 
              currentMetrics={metrics}
              currentDate={currentDate}
            />
          </TabsContent>

          <TabsContent value="timeline">
            <TimelinePanel events={timeline} />
          </TabsContent>

          <TabsContent value="product">
            <ProductProgress progress={productProgress} tasks={tasks} />
          </TabsContent>

          <TabsContent value="analytics">
            <AdvancedAnalytics
              agents={agents}
              tasks={tasks}
              financialRecords={financialRecords}
              timeline={timeline}
              currentDate={currentDate}
              productProgress={productProgress}
              metrics={metrics}
            />
          </TabsContent>

          <TabsContent value="market">
            <MarketSimulation
              competitors={competitors}
              marketEvents={marketEvents}
              marketShare={marketShare}
              industry={projectConfig?.domain || 'saas'}
              totalMarketSize={totalMarketSize}
            />
          </TabsContent>

          <TabsContent value="timetravel">
            <TimeTravel
              snapshots={snapshots}
              currentSnapshotIndex={currentSnapshotIndex}
              onRestoreSnapshot={(snapshot) => {
                // Restore simulation state from snapshot
                setAgents(snapshot.data.agents);
                setTasks(snapshot.data.tasks);
                setMessages(snapshot.data.messages);
                setPullRequests(snapshot.data.pullRequests);
                setOKRs(snapshot.data.okrs);
                setDocumentation(snapshot.data.documentation);
                setFinancialRecords(snapshot.data.financialRecords);
                setTimeline(snapshot.data.timeline);
                setProductProgress(snapshot.data.productProgress);
                setMetrics(snapshot.data.metrics);
                toast.success(`Restored to ${snapshot.label}`);
              }}
              onCreateBranch={(snapshot, branchName) => {
                const newSnapshot: Snapshot = {
                  ...snapshot,
                  id: Date.now().toString(),
                  label: branchName,
                  isBranch: true,
                  parentId: snapshot.id
                };
                setSnapshots(prev => [...prev, newSnapshot]);
                toast.success(`Branch "${branchName}" created`);
              }}
              onCompareSnapshots={(s1, s2) => {
                toast.info(`Comparing: ${s1.label} vs ${s2.label}`);
                // Could implement detailed comparison view
              }}
              isSimulating={isSimulating}
            />
          </TabsContent>

          <TabsContent value="export">
            <ExportImport
              simulationData={{
                projectConfig,
                agents,
                tasks,
                messages,
                pullRequests,
                okrs,
                documentation,
                financialRecords,
                timeline,
                metrics,
                currentDate,
                productProgress
              }}
              onImportData={(data) => {
                if (data.projectConfig) setProjectConfig(data.projectConfig);
                if (data.agents) setAgents(data.agents);
                if (data.tasks) setTasks(data.tasks);
                if (data.messages) setMessages(data.messages);
                if (data.pullRequests) setPullRequests(data.pullRequests);
                if (data.okrs) setOKRs(data.okrs);
                if (data.documentation) setDocumentation(data.documentation);
                if (data.financialRecords) setFinancialRecords(data.financialRecords);
                if (data.timeline) setTimeline(data.timeline);
                if (data.metrics) setMetrics(data.metrics);
                if (data.productProgress) setProductProgress(data.productProgress);
                if (data.currentDate) setCurrentDate(new Date(data.currentDate));
              }}
            />
          </TabsContent>
        </Tabs>
      </div>

      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <SettingsModal 
        open={showSettings} 
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />
      <SavedSimulationsModal
        open={showSavedSims}
        onClose={() => setShowSavedSims(false)}
        onLoad={handleLoadSimulation}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}
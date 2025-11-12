import { Agent } from '../App';
import { projectId, publicAnonKey } from './supabase/info';

export interface DomainActivity {
  type: 'message' | 'task' | 'complete' | 'bug' | 'pr' | 'review' | 'decision' | 'documentation' | 'financial';
  content?: string;
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  taskType?: string;
  docType?: string;
}

// Expand domain knowledge with more domains
export const domainTemplates = {
  saas: {
    name: 'SaaS Platform',
    focus: 'Recurring revenue, user retention, feature velocity',
    challenges: ['Churn rate', 'Product-market fit', 'CAC:LTV ratio', 'Technical debt'],
  },
  ecommerce: {
    name: 'E-commerce',
    focus: 'Conversion rate, GMV, customer lifetime value',
    challenges: ['Cart abandonment', 'Inventory management', 'Shipping logistics', 'Returns'],
  },
  fintech: {
    name: 'FinTech',
    focus: 'Security, compliance, transaction volume',
    challenges: ['Regulatory compliance', 'Fraud prevention', 'Banking partnerships', 'Trust'],
  },
  healthcare: {
    name: 'HealthTech',
    focus: 'Patient outcomes, HIPAA compliance, provider network',
    challenges: ['Data privacy', 'Medical accuracy', 'Insurance integration', 'Regulations'],
  },
  edtech: {
    name: 'EdTech',
    focus: 'Learning outcomes, engagement, content quality',
    challenges: ['Course completion', 'Accreditation', 'Teacher quality', 'Pricing'],
  },
  marketplace: {
    name: 'Marketplace',
    focus: 'Supply-demand balance, GMV, take rate',
    challenges: ['Network effects', 'Trust & safety', 'Payment escrow', 'Quality control'],
  },
  social: {
    name: 'Social Network',
    focus: 'User engagement, DAU/MAU, viral growth',
    challenges: ['Content moderation', 'Retention', 'Monetization', 'Privacy'],
  },
  ai: {
    name: 'AI/ML Platform',
    focus: 'Model accuracy, inference speed, API reliability',
    challenges: ['Training costs', 'Data quality', 'Bias mitigation', 'Explainability'],
  },
  gaming: {
    name: 'Gaming',
    focus: 'Player retention, ARPU, viral coefficient',
    challenges: ['Live ops', 'Monetization balance', 'Server costs', 'Community toxicity'],
  },
  crypto: {
    name: 'Web3/Crypto',
    focus: 'TVL, community, tokenomics',
    challenges: ['Security audits', 'Regulations', 'Gas fees', 'Market volatility'],
  },
};

// Enhanced random events based on domain
export const domainRandomEvents: { [key: string]: string[] } = {
  saas: [
    '🎉 Major enterprise client signed! $50K ARR contract',
    '⚠️ Competitor launched similar feature - need to differentiate',
    '🐛 Critical bug affecting 5% of users - all hands on deck',
    '📈 Product Hunt launch went viral! 500 signups today',
    '💡 Customer feedback suggests major new feature opportunity',
    '🔒 Security audit completed - need to fix 3 vulnerabilities',
    '🤝 Partnership opportunity with major platform',
  ],
  ecommerce: [
    '📦 Supply chain delay affecting 20% of inventory',
    '🎁 Holiday season spike - 3x normal traffic expected',
    '⭐ Influencer partnership driving huge traffic',
    '💳 Payment processor went down for 2 hours',
    '🚚 Shipping carrier increased rates by 15%',
    '🔥 Flash sale generated 200% of daily revenue',
    '📸 User-generated content campaign went viral',
  ],
  fintech: [
    '🏦 Banking partner changed API - urgent integration needed',
    '⚖️ New regulation announced - compliance review required',
    '🔐 Security audit passed with flying colors',
    '💰 Funding round closed - $5M raised',
    '🚨 Fraud detection caught major attempted breach',
    '📊 Transaction volume doubled month-over-month',
    '🤝 Major card network approved partnership',
  ],
  healthcare: [
    '🏥 New provider network partnership signed',
    '⚕️ FDA approval process initiated',
    '🔒 HIPAA audit completed successfully',
    '📱 Telemedicine demand surge - need to scale',
    '💊 Integration with major pharmacy chain',
    '📋 Insurance reimbursement approved',
    '🧪 Clinical validation study shows positive results',
  ],
  edtech: [
    '🎓 University partnership announced',
    '📚 Course completion rate improved to 75%',
    '👨‍🏫 Top instructor recruited from competitor',
    '🏆 Won "Best EdTech Platform" award',
    '💻 Live class feature driving 40% more engagement',
    '📝 Accreditation received for certificate programs',
    '🌍 International expansion - launching in 3 new countries',
  ],
  marketplace: [
    '🚀 Crossed critical mass - network effects kicking in',
    '⚠️ Fraud attempt detected and prevented',
    '💵 Average transaction value increased 30%',
    '🤝 Major supplier joined platform',
    '⭐ Trust score system improved quality by 25%',
    '📈 Supply outpacing demand - need more buyers',
    '🔧 Payment escrow system upgrade complete',
  ],
  social: [
    '📱 Viral feature spreading organically',
    '⚠️ Content moderation challenge - reviewing policies',
    '🎯 Engagement rate highest in company history',
    '💬 Influencers creating buzz around platform',
    '🔒 Privacy settings enhanced after user feedback',
    '📊 DAU/MAU ratio reached 50%',
    '🌟 Celebrity joined and brought 100K followers',
  ],
  ai: [
    '🤖 Model accuracy improved to 95%',
    '⚡ Inference latency reduced by 60%',
    '📊 Training costs optimized - 40% savings',
    '🔬 Research paper published about our approach',
    '⚠️ Bias detected in model - retraining needed',
    '🚀 New model version deployed to production',
    '🏆 Outperformed competitors in benchmark',
  ],
  gaming: [
    '🎮 Player retention improved to 40% D7',
    '🎨 New cosmetic items generated $50K in 24 hours',
    '⚔️ Tournament attracted 10K participants',
    '🐛 Major exploit discovered - hotfix deployed',
    '🌟 Streamer with 1M followers playing our game',
    '💰 ARPU increased 25% after monetization update',
    '🌍 Launched in Asia - huge player surge',
  ],
  crypto: [
    '💎 TVL crossed $10M milestone',
    '🔒 Smart contract audit completed - no critical issues',
    '📈 Token price increased 50% this week',
    '⚠️ Gas fees spiking - users complaining',
    '🤝 Major DeFi protocol integration complete',
    '🔐 Security incident prevented - multisig working',
    '🏛️ DAO governance proposal passed',
  ],
};

// Get smart agent action using backend or fallback to local
export async function getSmartAgentAction(
  agent: Agent,
  domain: string,
  context: any,
  useBackend: boolean = false
): Promise<DomainActivity | null> {
  if (useBackend) {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-49b02a60/agent-action`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            agentId: agent.id,
            domain,
            context,
            actionType: Math.random() > 0.5 ? 'message' : 'task'
          })
        }
      );

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Failed to get smart action from backend:', error);
      // Fallback to local
    }
  }

  // Local fallback - this is already quite comprehensive
  return null;
}

// Get random event for domain
export function getRandomEvent(domain: string): string | null {
  const events = domainRandomEvents[domain];
  if (!events || Math.random() > 0.1) { // 10% chance
    return null;
  }
  return events[Math.floor(Math.random() * events.length)];
}

// Get domain-specific metrics labels
export function getDomainMetrics(domain: string): { [key: string]: string } {
  const metricsMap: { [key: string]: { [key: string]: string } } = {
    saas: {
      users: 'Active Users',
      revenue: 'MRR',
      features: 'Features Shipped',
    },
    ecommerce: {
      users: 'Customers',
      revenue: 'GMV',
      features: 'Products Listed',
    },
    fintech: {
      users: 'Account Holders',
      revenue: 'Transaction Volume',
      features: 'Integrations',
    },
    healthcare: {
      users: 'Patients',
      revenue: 'Monthly Revenue',
      features: 'Services Offered',
    },
    edtech: {
      users: 'Students',
      revenue: 'Course Revenue',
      features: 'Courses Published',
    },
    marketplace: {
      users: 'Active Users',
      revenue: 'GMV',
      features: 'Listings',
    },
    social: {
      users: 'DAU',
      revenue: 'Ad Revenue',
      features: 'Features Launched',
    },
    ai: {
      users: 'API Users',
      revenue: 'API Revenue',
      features: 'Model Versions',
    },
    gaming: {
      users: 'Daily Players',
      revenue: 'Daily Revenue',
      features: 'Game Modes',
    },
    crypto: {
      users: 'Wallet Addresses',
      revenue: 'TVL',
      features: 'Smart Contracts',
    },
  };

  return metricsMap[domain] || metricsMap.saas;
}

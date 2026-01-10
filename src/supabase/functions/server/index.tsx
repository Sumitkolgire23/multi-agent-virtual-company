import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2.39.3';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Health check
app.get('/make-server-49b02a60/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Sign up route
app.post('/make-server-49b02a60/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm email since email server isn't configured
      email_confirm: true
    });

    if (error) {
      console.log(`Error creating user during signup: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    console.log(`Successfully created user: ${email}`);
    return c.json({ user: data.user });
  } catch (error) {
    console.log(`Error during signup process: ${error}`);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

// Save simulation state
app.post('/make-server-49b02a60/save-simulation', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized - invalid or missing token' }, 401);
    }

    const simulationData = await c.req.json();
    const key = `simulation:${user.id}:${simulationData.id}`;
    
    await kv.set(key, JSON.stringify({
      ...simulationData,
      userId: user.id,
      updatedAt: new Date().toISOString()
    }));

    console.log(`Saved simulation ${simulationData.id} for user ${user.id}`);
    return c.json({ success: true, id: simulationData.id });
  } catch (error) {
    console.log(`Error saving simulation: ${error}`);
    return c.json({ error: 'Failed to save simulation' }, 500);
  }
});

// Load user simulations
app.get('/make-server-49b02a60/simulations', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized - invalid or missing token' }, 401);
    }

    const simulations = await kv.getByPrefix(`simulation:${user.id}:`);
    const parsed = simulations.map(s => JSON.parse(s.value));
    
    console.log(`Retrieved ${parsed.length} simulations for user ${user.id}`);
    return c.json({ simulations: parsed });
  } catch (error) {
    console.log(`Error loading simulations: ${error}`);
    return c.json({ error: 'Failed to load simulations' }, 500);
  }
});

// Delete simulation
app.delete('/make-server-49b02a60/simulation/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized - invalid or missing token' }, 401);
    }

    const id = c.req.param('id');
    const key = `simulation:${user.id}:${id}`;
    
    await kv.del(key);
    
    console.log(`Deleted simulation ${id} for user ${user.id}`);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting simulation: ${error}`);
    return c.json({ error: 'Failed to delete simulation' }, 500);
  }
});

// Save user settings
app.post('/make-server-49b02a60/settings', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized - invalid or missing token' }, 401);
    }

    const settings = await c.req.json();
    const key = `settings:${user.id}`;
    
    await kv.set(key, JSON.stringify({
      ...settings,
      userId: user.id,
      updatedAt: new Date().toISOString()
    }));

    console.log(`Saved settings for user ${user.id}`);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error saving settings: ${error}`);
    return c.json({ error: 'Failed to save settings' }, 500);
  }
});

// Load user settings
app.get('/make-server-49b02a60/settings', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized - invalid or missing token' }, 401);
    }

    const key = `settings:${user.id}`;
    const settingsStr = await kv.get(key);
    
    const settings = settingsStr ? JSON.parse(settingsStr) : null;
    
    console.log(`Retrieved settings for user ${user.id}`);
    return c.json({ settings });
  } catch (error) {
    console.log(`Error loading settings: ${error}`);
    return c.json({ error: 'Failed to load settings' }, 500);
  }
});

// Get AI agent response based on domain knowledge
app.post('/make-server-49b02a60/agent-action', async (c) => {
  try {
    const { agentId, domain, context, actionType } = await c.req.json();
    
    // Domain-specific knowledge base
    const response = generateDomainSpecificAction(agentId, domain, context, actionType);
    
    return c.json({ response });
  } catch (error) {
    console.log(`Error generating agent action: ${error}`);
    return c.json({ error: 'Failed to generate agent action' }, 500);
  }
});

function generateDomainSpecificAction(
  agentId: string,
  domain: string,
  context: any,
  actionType: string
): any {
  const domainKnowledge: any = {
    saas: {
      ceo: {
        messages: [
          'Let\'s focus on reducing customer churn - it\'s 5x cheaper than acquiring new users',
          'We need to improve our activation rate. Only 40% of signups complete onboarding',
          'Time to explore a product-led growth strategy with a freemium tier',
          'Our CAC is too high. Let\'s double down on content marketing and SEO',
          'Should we consider adding enterprise features for upmarket expansion?'
        ],
        tasks: [
          { title: 'Analyze user cohort retention', description: 'Review monthly cohort analysis and identify drop-off points', priority: 'high', taskType: 'planning' },
          { title: 'Define pricing tier strategy', description: 'Research competitor pricing and create tiered model', priority: 'high', taskType: 'planning' },
          { title: 'Plan product roadmap for Q2', description: 'Prioritize features based on customer feedback and metrics', priority: 'medium', taskType: 'planning' }
        ]
      },
      developer: {
        messages: [
          'Implementing webhook system for better integration capabilities',
          'Building API rate limiting to prevent abuse and ensure stability',
          'Adding multi-tenancy support for enterprise customers',
          'Optimizing database queries - reduced load time by 60%',
          'Setting up automated scaling for traffic spikes'
        ],
        tasks: [
          { title: 'Build SSO integration', description: 'Implement SAML/OAuth for enterprise SSO', priority: 'high', taskType: 'feature' },
          { title: 'Create REST API v2', description: 'Design and implement versioned API with better docs', priority: 'high', taskType: 'feature' },
          { title: 'Add usage analytics', description: 'Track feature usage and user behavior patterns', priority: 'medium', taskType: 'feature' }
        ]
      },
      marketer: {
        messages: [
          'Our trial-to-paid conversion is at 18% - industry average is 25%',
          'Content marketing is driving 40% of our organic signups',
          'Planning product hunt launch for next month - need assets ready',
          'User testimonials increased conversion by 12% - need more case studies',
          'Implementing drip email campaigns for trial users'
        ],
        tasks: [
          { title: 'Create comparison pages', description: 'Build SEO-optimized competitor comparison pages', priority: 'high', taskType: 'marketing' },
          { title: 'Launch referral program', description: 'Design and implement customer referral incentives', priority: 'medium', taskType: 'marketing' },
          { title: 'Product demo videos', description: 'Create walkthrough videos for key features', priority: 'medium', taskType: 'marketing' }
        ]
      }
    },
    ecommerce: {
      ceo: {
        messages: [
          'Cart abandonment rate is 70% - we need to address this immediately',
          'Let\'s explore subscription box model to increase LTV',
          'Should we expand to Amazon FBA or focus on DTC strategy?',
          'Mobile conversion is 30% lower than desktop - major opportunity',
          'Need to optimize for faster checkout - every second costs us conversions'
        ],
        tasks: [
          { title: 'Analyze shopping behavior', description: 'Deep dive into cart abandonment reasons', priority: 'high', taskType: 'planning' },
          { title: 'Expansion strategy research', description: 'Evaluate marketplace vs DTC growth paths', priority: 'high', taskType: 'planning' },
          { title: 'Loyalty program design', description: 'Create customer retention program structure', priority: 'medium', taskType: 'planning' }
        ]
      },
      developer: {
        messages: [
          'Implementing one-click checkout to reduce friction',
          'Building product recommendation engine with ML',
          'Optimizing image loading - improved page speed by 40%',
          'Adding inventory management system integration',
          'Setting up abandoned cart recovery emails'
        ],
        tasks: [
          { title: 'Payment gateway integration', description: 'Add Apple Pay, Google Pay, and Buy Now Pay Later', priority: 'high', taskType: 'feature' },
          { title: 'Build wishlist feature', description: 'Allow users to save items for later', priority: 'medium', taskType: 'feature' },
          { title: 'Size recommendation tool', description: 'ML-based size fitting recommendations', priority: 'medium', taskType: 'feature' }
        ]
      },
      marketer: {
        messages: [
          'Facebook ads ROA is 3.2x - scaling winning campaigns',
          'Email marketing generates 30% of revenue - highest ROI channel',
          'User-generated content increased trust and conversion by 15%',
          'Planning flash sale for weekend - expecting 200% traffic spike',
          'Influencer partnerships driving quality traffic and brand awareness'
        ],
        tasks: [
          { title: 'Create seasonal campaigns', description: 'Plan holiday shopping campaign strategy', priority: 'high', taskType: 'marketing' },
          { title: 'Optimize product pages', description: 'A/B test product descriptions and images', priority: 'high', taskType: 'marketing' },
          { title: 'Build ambassador program', description: 'Recruit and manage brand ambassadors', priority: 'medium', taskType: 'marketing' }
        ]
      }
    },
    fintech: {
      ceo: {
        messages: [
          'Compliance is critical - we need SOC 2 Type 2 before Series A',
          'Transaction volume growing 25% MoM but we need better unit economics',
          'Exploring banking-as-a-service partnerships for embedded finance',
          'Fraud prevention is paramount - one major incident could destroy trust',
          'Should we apply for our own banking charter or continue with partners?'
        ],
        tasks: [
          { title: 'Regulatory compliance audit', description: 'Prepare for upcoming compliance review', priority: 'high', taskType: 'planning' },
          { title: 'Partnership strategy', description: 'Evaluate potential banking and card network partners', priority: 'high', taskType: 'planning' },
          { title: 'Risk management framework', description: 'Develop comprehensive risk assessment process', priority: 'high', taskType: 'planning' }
        ]
      },
      developer: {
        messages: [
          'Implementing real-time fraud detection with ML models',
          'Building PCI DSS compliant payment processing system',
          'Adding 2FA and biometric authentication for security',
          'Creating audit logging for all financial transactions',
          'Optimizing transaction processing - now sub-100ms latency'
        ],
        tasks: [
          { title: 'Build KYC verification', description: 'Integrate identity verification service', priority: 'high', taskType: 'feature' },
          { title: 'Transaction monitoring', description: 'Real-time anomaly detection system', priority: 'high', taskType: 'feature' },
          { title: 'Implement ACH payments', description: 'Add bank transfer capabilities', priority: 'medium', taskType: 'feature' }
        ]
      },
      marketer: {
        messages: [
          'Trust is everything in fintech - highlighting security in all messaging',
          'Educational content performing well - people need to understand how we work',
          'Partnerships with financial influencers building credibility',
          'Referral program driving 40% of new users - incentives work in fintech',
          'Comparison tools showing we save users $500/year on average'
        ],
        tasks: [
          { title: 'Create trust badges', description: 'Design security and compliance badge system', priority: 'high', taskType: 'marketing' },
          { title: 'Financial literacy content', description: 'Build educational blog and video content', priority: 'medium', taskType: 'marketing' },
          { title: 'Launch savings calculator', description: 'Interactive tool showing potential savings', priority: 'medium', taskType: 'marketing' }
        ]
      }
    },
    healthcare: {
      ceo: {
        messages: [
          'HIPAA compliance is non-negotiable - every feature needs security review',
          'Patient data privacy must be our top priority in every decision',
          'Telemedicine demand up 300% - need to scale infrastructure',
          'Provider network expansion critical for market penetration',
          'Insurance integration complexity is slowing us down - need strategy'
        ],
        tasks: [
          { title: 'HIPAA audit preparation', description: 'Complete security and privacy compliance review', priority: 'high', taskType: 'planning' },
          { title: 'Provider onboarding', description: 'Streamline medical professional registration', priority: 'high', taskType: 'planning' },
          { title: 'Payer partnerships', description: 'Negotiate insurance coverage agreements', priority: 'medium', taskType: 'planning' }
        ]
      },
      developer: {
        messages: [
          'Implementing end-to-end encryption for all patient data',
          'Building FHIR-compliant API for EHR integration',
          'Adding secure video conferencing for telehealth',
          'Creating patient consent management system',
          'Optimizing prescription refill workflow'
        ],
        tasks: [
          { title: 'Build appointment scheduling', description: 'Real-time availability and booking system', priority: 'high', taskType: 'feature' },
          { title: 'E-prescribing integration', description: 'Connect to pharmacy networks', priority: 'high', taskType: 'feature' },
          { title: 'Lab results portal', description: 'Secure test results viewing for patients', priority: 'medium', taskType: 'feature' }
        ]
      },
      marketer: {
        messages: [
          'Patient testimonials are powerful - real stories build trust',
          'Educational content about preventive care resonates strongly',
          'Provider credentials and expertise must be highlighted',
          'Mobile-first approach critical - most users book on phones',
          'Community outreach programs building local brand awareness'
        ],
        tasks: [
          { title: 'Patient education series', description: 'Create health literacy content library', priority: 'high', taskType: 'marketing' },
          { title: 'Provider spotlights', description: 'Feature medical professional backgrounds', priority: 'medium', taskType: 'marketing' },
          { title: 'Symptom checker tool', description: 'Interactive health assessment tool', priority: 'medium', taskType: 'marketing' }
        ]
      }
    },
    edtech: {
      ceo: {
        messages: [
          'Course completion rate is 65% - need to improve engagement',
          'Exploring B2B sales to enterprises and educational institutions',
          'Accreditation will open doors to traditional education market',
          'Student success metrics are our North Star - everything ties to outcomes',
          'Should we focus on upskilling professionals or K-12 market?'
        ],
        tasks: [
          { title: 'Define learning outcomes', description: 'Establish measurable success criteria', priority: 'high', taskType: 'planning' },
          { title: 'Enterprise package design', description: 'Create B2B offering for companies', priority: 'high', taskType: 'planning' },
          { title: 'Instructor recruitment', description: 'Build pipeline for quality educators', priority: 'medium', taskType: 'planning' }
        ]
      },
      developer: {
        messages: [
          'Building adaptive learning algorithm to personalize content',
          'Implementing progress tracking and achievements system',
          'Adding live class features with breakout rooms',
          'Creating mobile app for offline learning',
          'Optimizing video streaming for low-bandwidth areas'
        ],
        tasks: [
          { title: 'Build quiz engine', description: 'Interactive assessment and feedback system', priority: 'high', taskType: 'feature' },
          { title: 'Discussion forums', description: 'Student-teacher communication platform', priority: 'medium', taskType: 'feature' },
          { title: 'Certificate system', description: 'Generate completion certificates', priority: 'medium', taskType: 'feature' }
        ]
      },
      marketer: {
        messages: [
          'Free trial-to-paid conversion at 22% - solid but can improve',
          'Student success stories are our best marketing asset',
          'SEO for "how to learn X" queries driving quality traffic',
          'Partnership with career platforms boosting enrollment',
          'LinkedIn ads performing well for professional upskilling courses'
        ],
        tasks: [
          { title: 'Create course previews', description: 'Free sample lessons to showcase value', priority: 'high', taskType: 'marketing' },
          { title: 'Alumni network', description: 'Build community of successful graduates', priority: 'medium', taskType: 'marketing' },
          { title: 'Scholarship program', description: 'Offer need-based learning opportunities', priority: 'medium', taskType: 'marketing' }
        ]
      }
    }
  };

  const agentKnowledge = domainKnowledge[domain]?.[agentId] || domainKnowledge.saas?.[agentId];
  
  if (!agentKnowledge) {
    return null;
  }

  if (actionType === 'message') {
    const messages = agentKnowledge.messages || [];
    return messages[Math.floor(Math.random() * messages.length)];
  } else if (actionType === 'task') {
    const tasks = agentKnowledge.tasks || [];
    return tasks[Math.floor(Math.random() * tasks.length)];
  }

  return null;
}

Deno.serve(app.fetch);

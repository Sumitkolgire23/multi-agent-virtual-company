# Virtual Startup Simulator - Multi-Agent AI Company Builder

An advanced real-time simulation that uses autonomous AI agents (CEO, Developer, Designer, Marketer, QA Engineer, Documentation Lead, and CFO) to collaboratively build a startup from scratch.

## 🚀 Key Features

### Core Simulation
- **7 AI Agents** with distinct personalities and roles
- **Real-time communication** between agents with Slack-style chat
- **Kanban task board** with drag-and-drop status management
- **Pull request workflows** with code review cycles
- **Sprint planning meetings** every 14 days
- **OKR tracking** with progress visualization
- **Financial reports** with MRR/ARR, runway, and burn rate
- **Live documentation** generation
- **Timeline view** of company milestones

### Domain-Specific Intelligence 🧠
Agents adapt their behavior based on the project domain:
- **SaaS Platform** - Focus on MRR, churn, product-led growth
- **E-commerce** - Cart optimization, GMV, conversion rate
- **FinTech** - Compliance, security audits, transaction volume
- **HealthTech** - HIPAA compliance, provider networks, patient outcomes
- **EdTech** - Course completion, accreditation, learning outcomes
- **Marketplace** - Network effects, trust & safety, GMV
- **Social Network** - DAU/MAU, engagement, content moderation
- **AI/ML Platform** - Model accuracy, inference speed, training costs
- **Gaming** - Player retention, ARPU, monetization
- **Web3/Crypto** - TVL, smart contracts, tokenomics

### Authentication & Persistence 🔐
- **Supabase Authentication** - Email/password sign-in
- **Save/Load Simulations** - Continue where you left off
- **Auto-save** - Configurable auto-save intervals
- **Multi-device access** - Access your simulations anywhere
- **User settings** - Personalized preferences stored securely

### Advanced Settings ⚙️
- **Notification Control** - Agent messages, task updates, milestones, financial alerts
- **Simulation Speed** - 1x to 10x with default speed preference
- **Agent Activity** - Low/Medium/High frequency control
- **Random Events** - Domain-specific challenges and opportunities
- **Smart Responses** - AI-powered domain knowledge integration
- **UI Customization** - Compact mode, timestamps, animations
- **Pause on Milestone** - Auto-pause for important events

### Performance Optimizations ⚡
- **Virtualized Lists** - Only render visible messages (last 100)
- **Memoized Components** - Prevent unnecessary re-renders
- **Agent Map** - O(1) agent lookup with useMemo
- **Debounced Updates** - Efficient state management
- **Lazy Loading** - Tab content loaded on demand
- **Optimized Re-renders** - React performance best practices

### Dark/Light Theme 🌓
- Persistent theme preference
- Smooth transitions
- Accessible color contrast
- Beautiful gradients and shadows

## 🎮 How to Use

1. **Start**: Configure your project name, domain, and duration
2. **Simulate**: Click "Start" to watch agents autonomously work
3. **Control**: Adjust speed (1x-10x) or skip time (7-30 days)
4. **Explore**: View chat, tasks, PRs, OKRs, docs, finance, timeline
5. **Save**: Sign in to save simulations and sync across devices
6. **Customize**: Adjust settings for your preferred experience

## 🏗️ Technical Architecture

### Frontend
- **React 19** with TypeScript
- **Tailwind CSS v4** for styling
- **ShadCN UI** components
- **Lucide React** icons
- **Sonner** for toast notifications
- **Motion** for animations

### Backend
- **Supabase** for authentication and storage
- **Hono** web server in Deno Edge Functions
- **KV Store** for simulation state and settings
- **JWT** authentication with access tokens

### Performance Features
- Component memoization
- Virtual scrolling for large lists
- Efficient state updates
- Lazy-loaded tabs
- Optimized re-render cycles

## 📊 Metrics Tracked

- Tasks Completed
- Features Shipped
- Bugs Reported
- PRs Opened/Merged
- Active Users
- Revenue (MRR/ARR)
- Test Coverage
- Documentation Pages
- Product Progress %

## 🎯 Domain-Specific Events

Each domain has unique random events that can occur:
- SaaS: Enterprise deals, churn alerts, competitor launches
- E-commerce: Supply chain issues, influencer partnerships, flash sales
- FinTech: Banking API changes, security audits, fraud detection
- HealthTech: Provider partnerships, HIPAA audits, telemedicine surges
- EdTech: University partnerships, accreditation, student success
- And more...

## 🔧 Configuration Options

### Simulation Settings
- Auto-save enabled/disabled
- Auto-save interval (1-15 minutes)
- Default simulation speed (1-10x)
- Pause on milestone

### Agent Settings
- Activity frequency (low/medium/high)
- Enable random events
- Smart domain-specific responses

### Notification Settings
- Agent messages
- Task updates
- Milestones
- Financial alerts

### UI Settings
- Compact mode
- Show timestamps
- Animations enabled

## 🚀 Getting Started

1. Launch the app
2. Create a project or sign in to load a saved simulation
3. Configure your startup (name, domain, duration)
4. Watch AI agents build your company!
5. Adjust settings and speed as desired
6. Save your progress anytime

## 💡 Tips

- **Speed Control**: Use 5-10x speed to quickly see progress
- **Time Skip**: Jump ahead 7-30 days to simulate months of work
- **Settings**: Customize agent activity and notifications for your preference
- **Save Often**: Use auto-save or manual save to preserve your simulation
- **Domain Choice**: Pick a domain that matches your interest for more relevant simulation

## 🎨 Features

- Beautiful dark/light theme
- Responsive design (mobile-friendly)
- Smooth animations
- Toast notifications for key events
- Real-time updates
- Intuitive UI/UX

---

Built with ❤️ using React, Supabase, and AI-powered agent simulation

import { OKR } from '../types';

export const getOKRsForDomain = (domain: string): OKR[] => {
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

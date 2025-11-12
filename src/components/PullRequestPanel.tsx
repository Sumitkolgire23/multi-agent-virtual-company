import { PullRequest, Agent } from '../App';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { GitPullRequest, GitMerge, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface PullRequestPanelProps {
  pullRequests: PullRequest[];
  agents: Agent[];
}

export function PullRequestPanel({ pullRequests, agents }: PullRequestPanelProps) {
  const getAgentById = (id: string) => {
    return agents.find(a => a.id === id);
  };

  const getStatusIcon = (status: PullRequest['status']) => {
    switch (status) {
      case 'open':
        return <GitPullRequest className="w-4 h-4 text-blue-600" />;
      case 'approved':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'merged':
        return <GitMerge className="w-4 h-4 text-purple-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: PullRequest['status']) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'merged':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
    }
  };

  const openPRs = pullRequests.filter(pr => pr.status === 'open').length;
  const mergedPRs = pullRequests.filter(pr => pr.status === 'merged').length;

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <GitPullRequest className="w-5 h-5 text-slate-600" />
            <h2 className="text-slate-900">Pull Requests</h2>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="gap-1">
              <Clock className="w-3 h-3" />
              {openPRs} open
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <GitMerge className="w-3 h-3" />
              {mergedPRs} merged
            </Badge>
          </div>
        </div>

        <div className="space-y-3">
          {pullRequests.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <GitPullRequest className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No pull requests yet. Start the simulation to see PRs!</p>
            </div>
          ) : (
            pullRequests.map(pr => {
              const author = getAgentById(pr.author);
              
              return (
                <Card
                  key={pr.id}
                  className={`p-4 border-2 ${getStatusColor(pr.status)}`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2 flex-1">
                        {getStatusIcon(pr.status)}
                        <div className="flex-1">
                          <h3 className="text-slate-900 mb-1">{pr.title}</h3>
                          <p className="text-sm text-slate-600">{pr.description}</p>
                        </div>
                      </div>
                      <Badge className="capitalize">{pr.status}</Badge>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{author?.avatar}</span>
                        <div>
                          <p className="text-sm text-slate-900">{author?.name}</p>
                          <p className="text-xs text-slate-500">
                            {pr.createdAt.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-xs text-slate-500">Reviewers:</span>
                        {pr.reviewers.map(reviewerId => {
                          const reviewer = getAgentById(reviewerId);
                          return (
                            <span key={reviewerId} className="text-lg" title={reviewer?.name}>
                              {reviewer?.avatar}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </Card>
  );
}

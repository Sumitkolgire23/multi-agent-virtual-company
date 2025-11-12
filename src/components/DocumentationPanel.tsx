import { Documentation, Agent } from '../App';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { BookOpen, FileText, Users, Code, Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface DocumentationPanelProps {
  documentation: Documentation[];
  agents: Agent[];
}

export function DocumentationPanel({ documentation, agents }: DocumentationPanelProps) {
  const getAgentById = (id: string) => {
    return agents.find(a => a.id === id);
  };

  const downloadDoc = (doc: Documentation) => {
    const blob = new Blob([doc.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title.replace(/\s+/g, '-').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAllDocs = () => {
    const allContent = documentation.map(doc => 
      `# ${doc.title}\n\nType: ${doc.type}\nAuthor: ${getAgentById(doc.author)?.name}\nVersion: ${doc.version}\nLast Updated: ${doc.lastUpdated.toLocaleDateString()}\n\n${doc.content}\n\n---\n\n`
    ).join('\n');
    
    const blob = new Blob([allContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'all-documentation.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getDocIcon = (type: Documentation['type']) => {
    switch (type) {
      case 'api':
        return <Code className="w-4 h-4" />;
      case 'user-guide':
        return <Users className="w-4 h-4" />;
      case 'technical':
        return <FileText className="w-4 h-4" />;
      case 'onboarding':
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getDocColor = (type: Documentation['type']) => {
    switch (type) {
      case 'api':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'user-guide':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'technical':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'onboarding':
        return 'bg-orange-100 text-orange-700 border-orange-200';
    }
  };

  const docsByType = {
    api: documentation.filter(d => d.type === 'api'),
    'user-guide': documentation.filter(d => d.type === 'user-guide'),
    technical: documentation.filter(d => d.type === 'technical'),
    onboarding: documentation.filter(d => d.type === 'onboarding')
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <h2 className="text-slate-900 dark:text-white">Documentation Portal</h2>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{documentation.length} documents</Badge>
            {documentation.length > 0 && (
              <Button onClick={downloadAllDocs} variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Download All
              </Button>
            )}
          </div>
        </div>

        {documentation.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No documentation yet. Start the simulation to see docs being created!</p>
          </div>
        ) : (
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All ({documentation.length})</TabsTrigger>
              <TabsTrigger value="api">API ({docsByType.api.length})</TabsTrigger>
              <TabsTrigger value="user-guide">Guides ({docsByType['user-guide'].length})</TabsTrigger>
              <TabsTrigger value="technical">Technical ({docsByType.technical.length})</TabsTrigger>
              <TabsTrigger value="onboarding">Onboarding ({docsByType.onboarding.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3">
              {documentation.map(doc => {
                const author = getAgentById(doc.author);
                
                return (
                  <Card key={doc.id} className={`p-4 border-2 ${getDocColor(doc.type)}`}>
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2 flex-1">
                          {getDocIcon(doc.type)}
                          <div className="flex-1">
                            <h3 className="text-slate-900 dark:text-white mb-1">{doc.title}</h3>
                            <Badge variant="outline" className="text-xs capitalize mb-2">
                              {doc.type.replace('-', ' ')}
                            </Badge>
                            <div className="bg-white/50 dark:bg-slate-800/50 p-3 rounded border border-slate-200 dark:border-slate-700 mt-2">
                              <pre className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono">
                                {doc.content.substring(0, 200)}...
                              </pre>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Badge variant="secondary">v{doc.version}</Badge>
                          <Button onClick={() => downloadDoc(doc)} variant="outline" size="sm" className="gap-1">
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{author?.avatar}</span>
                          <div>
                            <p className="text-sm text-slate-900">{author?.name}</p>
                            <p className="text-xs text-slate-500">
                              Updated {doc.lastUpdated.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </TabsContent>

            {Object.entries(docsByType).map(([type, docs]) => (
              <TabsContent key={type} value={type} className="space-y-3">
                {docs.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <p>No {type.replace('-', ' ')} documentation yet</p>
                  </div>
                ) : (
                  docs.map(doc => {
                    const author = getAgentById(doc.author);
                    
                    return (
                      <Card key={doc.id} className={`p-4 border-2 ${getDocColor(doc.type)}`}>
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <h3 className="text-slate-900 mb-2">{doc.title}</h3>
                              <div className="bg-white/50 p-3 rounded border border-slate-200">
                                <pre className="text-xs text-slate-700 whitespace-pre-wrap font-mono">
                                  {doc.content}
                                </pre>
                              </div>
                            </div>
                            <Badge variant="secondary">v{doc.version}</Badge>
                          </div>

                          <div className="flex items-center gap-2 pt-2 border-t">
                            <span className="text-lg">{author?.avatar}</span>
                            <span className="text-sm text-slate-600">{author?.name}</span>
                            <span className="text-xs text-slate-400 ml-auto">
                              {doc.lastUpdated.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </Card>
                    );
                  })
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </Card>
  );
}

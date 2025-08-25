
import React, { useState, useEffect } from 'react';
import { useDebates } from './DebatesContext';
import { Link, useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { createPageUrl } from './utils';
import { MessageSquare, Trash2, PlusCircle, Trophy, ChevronDown, ChevronRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export default function Sidebar() {
  const { debates, isLoading, deleteDebate } = useDebates();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentDebateId = searchParams.get('id');
  
  const [isDebatesOpen, setIsDebatesOpen] = useState(false);

  useEffect(() => {
    // Open the debate list by default if there are debates
    if (debates.length > 0) {
      setIsDebatesOpen(true);
    }
  }, [debates.length]);

  const handleDelete = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    deleteDebate(id);
    if (currentDebateId === id) {
      navigate(createPageUrl('Home'));
    }
  };

  return (
    <aside className="w-80 bg-background-alt flex flex-col border-r border-border h-screen sticky top-0 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between flex-shrink-0">
        <Link to={createPageUrl('Home')} className="hover:opacity-80 transition-opacity">
          <h2 className="text-lg font-bold text-foreground">AI Debate Club</h2>
        </Link>
        <Link to={createPageUrl('Home')}>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <PlusCircle className="w-5 h-5" />
          </Button>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Manage Debates */}
        <div className="border-b border-border">
          <Collapsible open={isDebatesOpen} onOpenChange={setIsDebatesOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-4 font-semibold text-left">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  Manage Debates
                </div>
                {isDebatesOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-2 pb-2">
              <div className="space-y-1">
                {isLoading && (
                  <div className="text-center text-muted-foreground p-4 text-sm">
                    Loading debates...
                  </div>
                )}
                {!isLoading && debates.length === 0 && (
                  <div className="text-center text-muted-foreground p-4 text-sm">
                    No debates yet. Start one!
                  </div>
                )}
                {debates.map((debate) => (
                  <Link
                    key={debate.id}
                    to={createPageUrl('Debate') + `?id=${debate.id}`}
                    className={`group flex items-center justify-between p-3 rounded-lg transition-colors ${
                      currentDebateId === debate.id
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <span className="text-sm font-medium truncate flex-1">
                        {debate.topic}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7 flex-shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-destructive/20 hover:text-destructive"
                        onClick={(e) => handleDelete(e, debate.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Link>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Leaderboard Link */}
        <div className="border-b border-border p-2">
           <Link to={createPageUrl('Leaderboard')}>
             <Button variant="ghost" className="w-full justify-start p-2 font-semibold text-left">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  Leaderboard
                </div>
              </Button>
            </Link>
        </div>
        
        {/* AI Personalities Link */}
        <div className="p-2">
           <Link to={createPageUrl('Personalities')}>
             <Button variant="ghost" className="w-full justify-start p-2 font-semibold text-left">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-400" />
                  AI Personalities
                </div>
              </Button>
            </Link>
        </div>
      </div>
    </aside>
  );
}

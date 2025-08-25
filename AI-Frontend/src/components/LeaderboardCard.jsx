import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Laugh, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { aiPersonas } from './MockData';

export default function LeaderboardCard({ persona, index, stats }) {
  const personaData = aiPersonas.find(p => p.name === persona);
  const isTopThree = index < 3;
  const podiumColors = ['text-yellow-400', 'text-gray-400', 'text-amber-500'];
  const winRate = stats.selectedCount > 0 ? (stats.wins / stats.selectedCount) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg bg-card border-border ${
        isTopThree ? 'ring-2 ring-primary/50' : ''
      }`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="text-2xl">{personaData?.avatar}</span>
                {isTopThree && (
                  <div className={`absolute -top-1 -right-1 ${podiumColors[index]}`}>
                    <Trophy className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">{persona}</h3>
                <p className="text-xs text-muted-foreground">{personaData?.style}</p>
              </div>
            </div>
            <Badge variant={isTopThree ? "default" : "secondary"} className={`text-lg px-3 py-1 ${isTopThree ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              #{index + 1}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-muted-foreground">Debate Performance</span>
                </div>
                <span className="text-sm font-semibold text-muted-foreground">{winRate.toFixed(0)}% Win Rate</span>
              </div>
              <Progress value={winRate} className="h-2" />
              <p className="text-2xl font-bold text-primary">{stats.wins} Wins / {stats.selectedCount} Played</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Laugh className="w-4 h-4 text-pink-400" />
                <span className="text-sm text-muted-foreground">Funny Votes</span>
              </div>
              <p className="text-xl font-semibold text-muted-foreground">{stats.funnyVotes}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-muted-foreground">Creative Votes</span>
              </div>
              <p className="text-xl font-semibold text-muted-foreground">{stats.creativeVotes}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
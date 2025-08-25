
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, RotateCcw, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { createPageUrl } from '../components/utils'; // Changed import path
import { useDebates } from '../components/DebatesContext';
import { aiPersonas } from '../components/MockData'; // Only for static avatar/style info
import VotingPanel from '../components/VotingPanel';

export default function ResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getDebateById, submitVotes } = useDebates();
  const debateId = searchParams.get('id');
  
  const [debate, setDebate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadDebate = useCallback(async () => {
    if (!debateId) {
      navigate(createPageUrl('Home'));
      return;
    }
    
    setIsLoading(true);
    try {
      const debateData = await getDebateById(debateId);
      if (debateData) {
        setDebate(debateData);
      } else {
        navigate(createPageUrl('Home'));
      }
    } catch (error) {
      console.error('Error loading debate results:', error);
      navigate(createPageUrl('Home'));
    } finally {
      setIsLoading(false);
    }
  }, [debateId, getDebateById, navigate]);

  useEffect(() => {
    loadDebate();
  }, [loadDebate]);

  const handleVote = async (voteData) => {
    const finalVotes = await submitVotes(debateId, voteData);
    setDebate(prev => ({ ...prev, votes: finalVotes, current_round: 'results' }));
  };

  const getActivePersonas = () => {
    if (!debate) return [];
    // Updated logic to filter personas based on debate.selected_ais array
    return aiPersonas.filter(p => debate.selected_ais && debate.selected_ais.includes(p.name));
  };

  const handleStartNew = () => {
    navigate(createPageUrl('Home'));
  };

  const handleViewLeaderboard = () => {
    navigate(createPageUrl('Leaderboard'));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!debate) return null;

  const activePersonas = getActivePersonas();
  const hasVoted = !!debate.votes;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <Button
            variant="outline"
            onClick={() => navigate(createPageUrl('Debate') + `?id=${debateId}`)}
            className="flex items-center gap-2 border-border"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Debate
          </Button>
          <Button
            variant="outline"
            onClick={handleViewLeaderboard}
            className="flex items-center gap-2 border-border"
          >
            <BarChart3 className="w-4 h-4" />
            View Leaderboard
          </Button>
        </motion.div>

        {/* Topic Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-8 shadow-lg bg-card border-border">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-card-foreground mb-2">
                Debate Results
              </CardTitle>
              <p className="text-lg text-muted-foreground">
                "{debate.topic}"
              </p>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Voting Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="shadow-xl bg-card border-border">
            <CardContent className="p-8">
              <VotingPanel
                personas={activePersonas}
                onVote={handleVote}
                existingVotes={debate.votes}
                hasVoted={hasVoted}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center gap-4"
        >
          <Button
            onClick={handleStartNew}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <RotateCcw className="w-4 h-4" />
            Start New Debate
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

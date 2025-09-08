
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Users, Zap, CheckSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPageUrl } from '../components/utils';
import { useDebates } from '../components/DebatesContext';
import { aiPersonas } from '../components/MockData'; // Only needed for static data like avatar
import DebateRound from '../components/DebateRound';
import UserInput from '../components/UserInput';

const rounds = ['opening', 'rebuttal', 'crosstalk', 'closing'];

export default function DebatePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { activeDebate, getDebateById, updateDebate, submitUserMessage, isConnected } = useDebates();
  const debateId = searchParams.get('id');
  
  const [activeRound, setActiveRound] = useState('opening');
  // Local loading state for generating next round, separate from connection status
  const [isGenerating, setIsGenerating] = useState(false); 

  useEffect(() => {
    if (debateId && isConnected) {
      // Request the debate details when the component mounts or ID changes
      getDebateById(debateId);
    } else if (!debateId) {
      // If no debateId is provided, navigate home
      navigate(createPageUrl('Home'));
    }
  }, [debateId, isConnected, getDebateById, navigate]);

  useEffect(() => {
    // When the activeDebate data arrives from the context, update the local activeRound
    if (activeDebate) {
      setActiveRound(activeDebate.current_round || 'opening');
      // If we were waiting for generation, we can stop now
      setIsGenerating(false);
    }
  }, [activeDebate]);

  const handleNextRound = () => {
    if (!activeDebate) return;

    const currentProgressIndex = rounds.indexOf(activeDebate.current_round);
    if (currentProgressIndex < rounds.length - 1) {
      const nextRound = rounds[currentProgressIndex + 1];
      setIsGenerating(true); // Show a spinner immediately
      
      // Just send the update request. The UI will update when the new data arrives via WebSocket.
      updateDebate(debateId, { 
        current_round: nextRound,
        generate_responses: true
      });
    }
  };

  const handleGoToVoting = () => {
    updateDebate(debateId, { current_round: 'voting' });
    navigate(createPageUrl('Results') + `?id=${debateId}`);
  };

  const handleUserMessage = useCallback((message) => {
    // This function is now fire-and-forget. The context handles the logic.
    // Use useCallback to prevent stale state issues with activeRound.
    submitUserMessage(debateId, activeRound, message);
  }, [debateId, activeRound, submitUserMessage]); // Dependencies for useCallback

  const getActivePersonas = () => {
    if (!activeDebate) return [];
    return aiPersonas.filter(p => activeDebate.selected_ais && activeDebate.selected_ais.includes(p.name));
  };

  // Show a loading screen if the connection is down or we don't have the debate data yet.
  if (!isConnected || !activeDebate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">{!isConnected ? 'Connecting...' : 'Loading debate...'}</p>
        </div>
      </div>
    );
  }

  const debate = activeDebate; // Use a shorter alias for convenience
  const activePersonas = getActivePersonas();
  const currentProgressIndex = rounds.indexOf(debate.current_round);
  const isFinalRoundActive = currentProgressIndex === rounds.length - 1;
  const roundResponses = debate.rounds_data ? (debate.rounds_data[activeRound] || []) : [];
  const userMessageForRound = debate.user_messages ? debate.user_messages[activeRound] : null;
  const selectedAIs = debate.selected_ais || [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <Badge variant="secondary" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              {selectedAIs.length} AI Debater{selectedAIs.length !== 1 ? 's' : ''}
            </Badge>
            {debate.user_participated && (
              <Badge className="bg-primary/20 text-primary border-primary/30">
                You're a Participant
              </Badge>
            )}
          </div>
          <h1 className="text-3xl font-bold text-foreground">"{debate.topic}"</h1>
        </motion.div>
        
        {/* Round Toggles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center gap-2 mb-8 bg-card p-2 rounded-lg border-border"
        >
          {rounds.map((round, index) => {
            const isLocked = index > currentProgressIndex;
            return (
              <Button
                key={round}
                variant={activeRound === round ? 'secondary' : 'ghost'}
                className={`capitalize transition-all duration-200 ${
                  activeRound === round ? 'text-foreground' : 'text-muted-foreground'
                } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => !isLocked && setActiveRound(round)}
                disabled={isLocked || isGenerating}
              >
                {round}
              </Button>
            );
          })}
        </motion.div>

        {/* Debate Content with Loading State */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          {isGenerating ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto" />
                <p className="text-muted-foreground">Generating AI responses...</p>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <DebateRound
                key={activeRound}
                round={activeRound}
                personas={activePersonas}
                responses={roundResponses}
                userMessage={userMessageForRound}
                isActive={true}
              />
            </AnimatePresence>
          )}
        </motion.div>

        {/* User Input - only show when not generating */}
        {debate.user_participated && !isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <UserInput
              onSubmit={handleUserMessage}
              disabled={!!userMessageForRound}
              placeholder={`Share your thoughts for the ${activeRound} round...`}
            />
          </motion.div>
        )}

        {/* Navigation Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center"
        >
          {isFinalRoundActive ? (
            <Button
              onClick={handleGoToVoting}
              size="lg"
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={isGenerating}
            >
              <CheckSquare className="w-5 h-5" />
              Finish Debate & Go to Voting
            </Button>
          ) : (
            <Button
              onClick={handleNextRound}
              size="lg"
              className="flex items-center gap-2"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-muted border-t-primary rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  Proceed to {rounds[currentProgressIndex + 1]}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  );
}

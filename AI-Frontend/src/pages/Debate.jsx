
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Users, Zap, CheckSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPageUrl } from '../components/utils'; // Changed path from '../utils' to '../components/utils'
import { useDebates } from '../components/DebatesContext';
import { aiPersonas } from '../components/MockData'; // Only needed for static data like avatar
import DebateRound from '../components/DebateRound';
import UserInput from '../components/UserInput';

const rounds = ['opening', 'rebuttal', 'crosstalk', 'closing'];

export default function DebatePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getDebateById, updateDebate, submitUserMessage } = useDebates();
  const debateId = searchParams.get('id');
  
  const [debate, setDebate] = useState(null);
  const [activeRound, setActiveRound] = useState('opening');
  const [isLoading, setIsLoading] = useState(true);

  const loadDebateData = useCallback(async () => {
    setIsLoading(true);
    try {
      const debateData = await getDebateById(debateId);
      if (debateData) {
        setDebate(debateData);
        setActiveRound(debateData.current_round || 'opening');
      } else {
        navigate(createPageUrl('Home'));
      }
    } catch (error) {
      console.error('Error loading debate:', error);
      navigate(createPageUrl('Home'));
    } finally {
      setIsLoading(false);
    }
  }, [debateId, getDebateById, navigate]);

  useEffect(() => {
    if (debateId) {
      loadDebateData();
    } else {
      navigate(createPageUrl('Home'));
    }
  }, [debateId, loadDebateData, navigate]);

  const handleNextRound = async () => {
    const currentProgressIndex = rounds.indexOf(debate.current_round);
    if (currentProgressIndex < rounds.length - 1) {
      const nextRound = rounds[currentProgressIndex + 1];
      
      setIsLoading(true); // Add loading state for generating responses
      
      try {
        // First update the round AND trigger AI response generation
        const updatedDebate = await updateDebate(debateId, { 
          current_round: nextRound,
          generate_responses: true // Signal backend to generate responses for this round
        });
        
        
        setDebate({ ...updatedDebate });
        setActiveRound(nextRound);
      } catch (error) {
        console.error("Error proceeding to next round:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGoToVoting = async () => {
    await updateDebate(debateId, { current_round: 'voting' });
    navigate(createPageUrl('Results') + `?id=${debateId}`);
  };

  const handleUserMessage = async (message) => {
    const updatedMessages = await submitUserMessage(debateId, activeRound, message);
    setDebate(prev => ({ ...prev, user_messages: updatedMessages }));
  };

  const getActivePersonas = () => {
    if (!debate) return [];
    return aiPersonas.filter(p => debate.selected_ais && debate.selected_ais.includes(p.name));
  };

  if (isLoading && !debate) { 
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading debate...</p>
        </div>
      </div>
    );
  }

  if (!debate) return null;

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
                disabled={isLocked || isLoading} // Also disable if generating responses
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
          {isLoading && debate ? ( 
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

        {/* User Input - only show when not loading */}
        {debate.user_participated && !isLoading && (
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
              disabled={isLoading}
            >
              <CheckSquare className="w-5 h-5" />
              Finish Debate & Go to Voting
            </Button>
          ) : (
            <Button
              onClick={handleNextRound}
              size="lg"
              className="flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
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
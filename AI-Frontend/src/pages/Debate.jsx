import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Users, Zap, CheckSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPageUrl } from '../components/utils';
import { useDebates } from '../components/DebatesContext';
import { aiPersonas } from '../components/MockData';
import DebateRound from '../components/DebateRound';
import UserInput from '../components/UserInput';
import ConnectionStatus from '../components/ConnectionStatus';

const rounds = ['opening', 'rebuttal', 'crosstalk', 'closing'];

export default function DebatePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { 
    getDebateById, 
    updateDebate, 
    submitUserMessage, 
    activeDebate, 
    connectionStatus 
  } = useDebates();
  const debateId = searchParams.get('id');
  
  const [debate, setDebate] = useState(null);
  const [activeRound, setActiveRound] = useState('opening');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingRound, setIsProcessingRound] = useState(false);

  // Use activeDebate from context when available, otherwise use local state
  const currentDebate = activeDebate || debate;

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

  // Sync activeRound with current debate data
  useEffect(() => {
    if (currentDebate?.current_round && currentDebate.current_round !== activeRound) {
      setActiveRound(currentDebate.current_round);
    }
  }, [currentDebate?.current_round, activeRound]);

  const handleNextRound = async () => {
    const currentProgressIndex = rounds.indexOf(currentDebate.current_round);
    if (currentProgressIndex < rounds.length - 1) {
      const nextRound = rounds[currentProgressIndex + 1];
      
      setIsProcessingRound(true);
      
      try {
        // With WebSocket, this will trigger real-time updates
        await updateDebate(debateId, { 
          current_round: nextRound,
          generate_responses: true
        });
        
        // If using WebSocket, the state will be updated via the WebSocket message
        // If not, the updateDebate function will handle the state update
        
      } catch (error) {
        console.error("Error proceeding to next round:", error);
      } finally {
        // Small delay to show the processing state
        setTimeout(() => setIsProcessingRound(false), 500);
      }
    }
  };

  const handleGoToVoting = async () => {
    await updateDebate(debateId, { current_round: 'voting' });
    navigate(createPageUrl('Results') + `?id=${debateId}`);
  };

  const handleUserMessage = async (message) => {
    const updatedMessages = await submitUserMessage(debateId, activeRound, message);
    
    // If not using WebSocket, update local state
    if (!activeDebate) {
      setDebate(prev => ({ ...prev, user_messages: updatedMessages }));
    }
  };

  const getActivePersonas = () => {
    if (!currentDebate) return [];
    return aiPersonas.filter(p => currentDebate.selected_ais && currentDebate.selected_ais.includes(p.name));
  };

  if (isLoading && !currentDebate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading debate...</p>
        </div>
      </div>
    );
  }

  if (!currentDebate) return null;

  const activePersonas = getActivePersonas();
  const currentProgressIndex = rounds.indexOf(currentDebate.current_round);
  const isFinalRoundActive = currentProgressIndex === rounds.length - 1;
  const roundResponses = currentDebate.rounds_data ? (currentDebate.rounds_data[activeRound] || []) : [];
  const userMessageForRound = currentDebate.user_messages ? currentDebate.user_messages[activeRound] : null;
  const selectedAIs = currentDebate.selected_ais || [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header with Connection Status */}
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
            {currentDebate.user_participated && (
              <Badge className="bg-primary/20 text-primary border-primary/30">
                You're a Participant
              </Badge>
            )}
            <ConnectionStatus status={connectionStatus} />
          </div>
          <h1 className="text-3xl font-bold text-foreground">"{currentDebate.topic}"</h1>
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
                disabled={isLocked || isProcessingRound}
              >
                {round}
              </Button>
            );
          })}
        </motion.div>

        {/* Debate Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <AnimatePresence mode="wait">
            <DebateRound
              key={`${activeRound}-${currentDebate.id}`} // Force re-render when debate changes
              round={activeRound}
              personas={activePersonas}
              responses={roundResponses}
              userMessage={userMessageForRound}
              isActive={true}
              connectionStatus={connectionStatus}
            />
          </AnimatePresence>
        </motion.div>

        {/* User Input - only show when not processing and user is participating */}
        {currentDebate.user_participated && !isProcessingRound && (
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
              disabled={isProcessingRound}
            >
              <CheckSquare className="w-5 h-5" />
              Finish Debate & Go to Voting
            </Button>
          ) : (
            <Button
              onClick={handleNextRound}
              size="lg"
              className="flex items-center gap-2"
              disabled={isProcessingRound}
            >
              {isProcessingRound ? (
                <>
                  <div className="w-5 h-5 border-2 border-muted border-t-primary rounded-full animate-spin" />
                  Generating Responses...
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
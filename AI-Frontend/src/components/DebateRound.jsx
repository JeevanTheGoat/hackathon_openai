import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ArrowLeft, Loader2, Zap } from 'lucide-react';
import PersonaBubble from './PersonaBubble';

const roundTitles = {
  opening: "Opening Statements",
  rebuttal: "Rebuttals", 
  crosstalk: "Cross-Talk",
  closing: "Closing Arguments"
};

const roundDescriptions = {
  opening: "Each AI presents their initial position",
  rebuttal: "AIs respond to opposing viewpoints",
  crosstalk: "Interactive discussion and debate",
  closing: "Final statements and conclusions"
};

export default function DebateRound({ 
  round, 
  personas, 
  responses, 
  userMessage, 
  isActive,
  connectionStatus = 'disconnected'
}) {
  const [currentResponseIndex, setCurrentResponseIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  // Debug logging
  console.log(`DebateRound rendered:`, {
    round,
    responsesLength: responses?.length || 0,
    responses: responses,
    currentResponseIndex,
    userMessage: !!userMessage,
    connectionStatus
  });

  useEffect(() => {
    console.log(`DebateRound useEffect: responses changed`, {
      round,
      responsesLength: responses?.length || 0
    });
    
    // Reset to first response when new data comes in
    setCurrentResponseIndex(0);
    
    // Check if we're waiting for more responses (WebSocket mode)
    if (connectionStatus === 'connected' && responses?.length < personas.length) {
      setIsGenerating(true);
    } else {
      setIsGenerating(false);
    }
  }, [responses, round, connectionStatus, personas.length]);

  // Auto-advance to new responses when they come in via WebSocket
  useEffect(() => {
    if (connectionStatus === 'connected' && responses?.length > 0) {
      // If we were at the end and a new response came in, move to it
      const totalResponses = responses.length + (userMessage ? 1 : 0);
      if (currentResponseIndex >= totalResponses - 1 && responses.length > currentResponseIndex) {
        setCurrentResponseIndex(responses.length - 1);
      }
    }
  }, [responses?.length, connectionStatus, currentResponseIndex, userMessage]);

  if (!isActive) return null;

  // Defensive programming - handle undefined/null responses
  const safeResponses = responses || [];
  const totalResponses = safeResponses.length + (userMessage ? 1 : 0);
  const hasUserMessage = !!userMessage;
  
  // Show generating state if we're connected and expecting more responses
  const expectedResponses = personas.length;
  const waitingForResponses = connectionStatus === 'connected' && 
                              safeResponses.length < expectedResponses && 
                              safeResponses.length > 0;
  
  const handleNext = () => {
    console.log(`Next clicked:`, { currentResponseIndex, totalResponses });
    if (currentResponseIndex < totalResponses - 1) {
      setCurrentResponseIndex(currentResponseIndex + 1);
    }
  };

  const handlePrevious = () => {
    console.log(`Previous clicked:`, { currentResponseIndex });
    if (currentResponseIndex > 0) {
      setCurrentResponseIndex(currentResponseIndex - 1);
    }
  };

  const isShowingUserMessage = hasUserMessage && currentResponseIndex === safeResponses.length;
  const currentResponse = isShowingUserMessage ? null : safeResponses[currentResponseIndex];
  const currentPersona = currentResponse ? personas.find(p => p.name === currentResponse.sender) : null;

  console.log(`Current display state:`, {
    isShowingUserMessage,
    currentResponse,
    currentPersona: currentPersona?.name || 'none',
    waitingForResponses,
    expectedResponses,
    actualResponses: safeResponses.length
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">{roundTitles[round]}</h2>
        <p className="text-muted-foreground">{roundDescriptions[round]}</p>
        
        <div className="flex items-center justify-center gap-4 mt-4">
          <span className="text-sm text-muted-foreground">
            {totalResponses > 0 ? `Response ${currentResponseIndex + 1} of ${totalResponses}` : 'No responses yet'}
          </span>
          
          {waitingForResponses && (
            <Badge variant="outline" className="flex items-center gap-2 bg-primary/10 text-primary border-primary/30">
              <Loader2 className="w-3 h-3 animate-spin" />
              Generating ({safeResponses.length}/{expectedResponses})
            </Badge>
          )}
          
          {connectionStatus === 'connected' && !waitingForResponses && safeResponses.length > 0 && (
            <Badge variant="outline" className="flex items-center gap-2 bg-green-500/10 text-green-400 border-green-500/30">
              <Zap className="w-3 h-3" />
              Live
            </Badge>
          )}
          
          <div className="flex gap-1">
            {Array.from({ length: totalResponses }).map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index <= currentResponseIndex ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="min-h-[200px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {totalResponses === 0 ? (
            <div className="text-center p-8 space-y-4" key="no-responses">
              <div className="w-16 h-16 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto" />
              <p className="text-muted-foreground">
                {connectionStatus === 'connected' ? 
                  'Waiting for AI responses...' : 
                  'No responses available for this round yet.'
                }
              </p>
            </div>
          ) : isShowingUserMessage ? (
            <PersonaBubble
              key="user-message"
              isUser={true}
              message={userMessage}
              delay={0}
            />
          ) : currentResponse && currentPersona ? (
            <PersonaBubble
              key={`${currentResponse.sender}-${currentResponseIndex}-${round}`}
              persona={currentPersona}
              message={currentResponse.content}
              delay={0}
            />
          ) : (
            <div className="text-center p-4" key="no-response">
              <p className="text-muted-foreground">No response available</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {totalResponses > 1 && (
        <div className="flex justify-center gap-4">
          <Button
            onClick={handlePrevious}
            disabled={currentResponseIndex === 0}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={currentResponseIndex >= totalResponses - 1}
            className="flex items-center gap-2"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </motion.div>
  );
}
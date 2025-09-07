
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';
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
  isActive 
}) {
  const [currentResponseIndex, setCurrentResponseIndex] = useState(0);

  // Debug logging
  console.log(`DebateRound rendered:`, {
    round,
    responsesLength: responses?.length || 0,
    responses: responses,
    currentResponseIndex,
    userMessage: !!userMessage
  });

  useEffect(() => {
    console.log(`DebateRound useEffect: responses changed`, {
      round,
      responsesLength: responses?.length || 0
    });
    
    // Reset to first response when new data comes in
    setCurrentResponseIndex(0);
  }, [responses, round]);

  if (!isActive) return null;

  // Defensive programming - handle undefined/null responses
  const safeResponses = responses || [];
  const totalResponses = safeResponses.length + (userMessage ? 1 : 0);
  const hasUserMessage = !!userMessage;
  
  // Additional safety check
  if (totalResponses === 0) {
    console.warn(`No responses available for round ${round}`, { safeResponses, userMessage });
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">No responses available for this round yet.</p>
      </div>
    );
  }
  
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
    currentPersona: currentPersona?.name || 'none'
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
            Response {currentResponseIndex + 1} of {totalResponses}
          </span>
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
          {isShowingUserMessage ? (
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
            <div className="text-center p-4">
              <p className="text-muted-foreground">No response available</p>
            </div>
          )}
        </AnimatePresence>
      </div>

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
    </motion.div>
  );
}

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

  // FORCE component to re-render when responses change
  useEffect(() => {
    console.log(`DebateRound: Received ${responses.length} responses for round ${round}`, responses);
    setCurrentResponseIndex(0); // Reset to first response when new data comes in
  }, [responses, round]);

  if (!isActive) return null;

  const totalResponses = responses.length + (userMessage ? 1 : 0);
  const hasUserMessage = !!userMessage;
  
  const handleNext = () => {
    if (currentResponseIndex < totalResponses - 1) {
      setCurrentResponseIndex(currentResponseIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentResponseIndex > 0) {
      setCurrentResponseIndex(currentResponseIndex - 1);
    }
  };

  const isShowingUserMessage = hasUserMessage && currentResponseIndex === responses.length;
  const currentResponse = isShowingUserMessage ? null : responses[currentResponseIndex];
  const currentPersona = currentResponse ? personas.find(p => p.name === currentResponse.sender) : null;

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
              key={`${currentResponse.sender}-${currentResponseIndex}`}
              persona={currentPersona}
              message={currentResponse.content}
              delay={0}
            />
          ) : null}
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

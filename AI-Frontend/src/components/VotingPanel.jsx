import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Laugh, Sparkles, CheckCircle, Loader2 } from 'lucide-react';

export default function VotingPanel({ personas, onVote, existingVotes, hasVoted }) {
  const [votes, setVotes] = useState({
    bestArgument: null,
    funniest: null,
    mostCreative: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (existingVotes) {
      setVotes(existingVotes);
    }
  }, [existingVotes]);

  const handleSelectVote = (category, personaName) => {
    if (hasVoted || isSubmitting) return;
    setVotes(prev => ({ ...prev, [category]: personaName }));
  };

  const handleConfirmVotes = async () => {
    const allVotesIn = Object.values(votes).every(vote => vote !== null);
    if (!allVotesIn) return; // Maybe show a message to the user

    setIsSubmitting(true);
    try {
      await onVote(votes);
      // The parent component will handle the state change to show the results.
    } catch (error) {
      console.error('Error submitting votes:', error);
      // TODO: Show an error to the user
    } finally {
      setIsSubmitting(false);
    }
  };

  const votingCategories = [
    { key: 'bestArgument', title: 'Best Argument', icon: Trophy, color: 'text-yellow-400', description: 'Most convincing and well-reasoned argument' },
    { key: 'funniest', title: 'Funniest Response', icon: Laugh, color: 'text-pink-400', description: 'Most humorous and entertaining argument' },
    { key: 'mostCreative', title: 'Most Creative', icon: Sparkles, color: 'text-purple-400', description: 'Most original and innovative perspective' }
  ];

  if (hasVoted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8"
      >
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">Thank You for Voting!</h3>
        <p className="text-muted-foreground mb-6">Your votes have been recorded. Here's what you chose:</p>
        
        <div className="space-y-2">
          {votingCategories.map((category) => {
            const votedPersona = personas.find(p => p.name === votes[category.key]);
            return (
              <div key={category.key} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="font-medium text-foreground">{category.title}:</span>
                <Badge variant="secondary" className="flex items-center gap-1 bg-background text-foreground">
                  {votedPersona?.avatar} {votedPersona?.name}
                </Badge>
              </div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  const allVotesSelected = Object.values(votes).every(v => v !== null);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Vote for the Best!</h2>
        <p className="text-muted-foreground">Choose winners in each category, then confirm your choices.</p>
      </div>

      {votingCategories.map((category) => (
        <Card key={category.key} className="overflow-hidden bg-muted border-border">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <category.icon className={`w-5 h-5 ${category.color}`} />
              {category.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{category.description}</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {personas.map((persona) => (
                <Button
                  key={persona.name}
                  variant={votes[category.key] === persona.name ? "default" : "outline"}
                  className={`p-4 h-auto justify-start text-left border-border ${
                    votes[category.key] === persona.name 
                      ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                      : 'bg-card hover:bg-card/80'
                  }`}
                  onClick={() => handleSelectVote(category.key, persona.name)}
                  disabled={isSubmitting}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{persona.avatar}</span>
                    <div>
                      <div className="font-medium">{persona.name}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="text-center pt-4">
        <Button
          size="lg"
          onClick={handleConfirmVotes}
          disabled={!allVotesSelected || isSubmitting}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Submitting Votes...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Confirm All Votes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
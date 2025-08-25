
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Users, Zap, ArrowRight, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../components/utils'; // Updated import path
import { useDebates } from '../components/DebatesContext';
import { aiPersonas, sampleTopics } from '../components/MockData';

export default function HomePage() {
  const navigate = useNavigate();
  const { addDebate } = useDebates();
  const [topic, setTopic] = useState('');
  const [selectedAIs, setSelectedAIs] = useState([]); // Changed from mode/selectedAI
  const [userParticipation, setUserParticipation] = useState(true);
  const [isStarting, setIsStarting] = useState(false);

  const handleStartDebate = async () => {
    if (!topic.trim() || selectedAIs.length === 0) return;

    setIsStarting(true);
    
    try {
      const debateData = {
        topic: topic.trim(),
        selected_ais: selectedAIs, // Send array of selected AI names
        user_participated: userParticipation,
      };
      
      const newDebate = await addDebate(debateData);
      navigate(createPageUrl('Debate') + `?id=${newDebate.id}`);
    } catch (error) {
      console.error("Failed to start debate:", error);
      setIsStarting(false);
    }
  };

  const handleSampleTopic = (sampleTopic) => {
    setTopic(sampleTopic);
  };
  
  const handleClearForm = () => {
    setTopic('');
    setSelectedAIs([]);
    setUserParticipation(true);
  }

  const handleAIToggle = (aiName) => {
    setSelectedAIs(prev => {
      if (prev.includes(aiName)) {
        return prev.filter(name => name !== aiName);
      } else {
        return [...prev, aiName];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedAIs.length === aiPersonas.length) {
      setSelectedAIs([]);
    } else {
      setSelectedAIs(aiPersonas.map(ai => ai.name));
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-green-400 bg-clip-text text-transparent mb-4">
            AI Debate Club
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose your AI debaters and watch them clash, or join the conversation yourself
          </p>
        </motion.div>

        {/* AI Personas Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-foreground mb-4 text-center">Meet Our AI Debaters</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {aiPersonas.map((persona, index) => (
              <motion.div
                key={persona.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="text-center"
              >
                <div className={`p-3 rounded-xl border ${persona.color.replace('bg-', 'border-')} bg-card transition-transform hover:scale-105`}>
                  <div className="text-2xl mb-1">{persona.avatar}</div>
                  <div className="text-xs font-semibold">{persona.name}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="shadow-xl border-border bg-card">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-card-foreground">Start a New Debate</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Topic Input */}
              <div className="space-y-3">
                <Label className="text-base font-semibold text-card-foreground">What should we debate?</Label>
                <Textarea
                  placeholder="e.g., Should AI replace human teachers?"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="min-h-[100px] text-base bg-muted text-foreground placeholder:text-muted-foreground border-border"
                />
              </div>

              {/* Sample Topics */}
              <div className="space-y-3">
                <Label className="text-sm text-muted-foreground">Or try one of these popular topics:</Label>
                <div className="flex flex-wrap gap-2">
                  {sampleTopics.map((sampleTopic, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSampleTopic(sampleTopic)}
                      className="text-xs text-muted-foreground border-border hover:bg-muted hover:border-primary/50 hover:text-foreground"
                    >
                      {sampleTopic}
                    </Button>
                  ))}
                </div>
              </div>

              {/* AI Selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold text-card-foreground">Choose Your AI Debaters</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{selectedAIs.length} selected</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAll}
                      className="text-xs border-border"
                    >
                      {selectedAIs.length === aiPersonas.length ? 'Deselect All' : 'Select All'}
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {aiPersonas.map((persona) => (
                    <Button
                      key={persona.name}
                      variant={selectedAIs.includes(persona.name) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleAIToggle(persona.name)}
                      className={`justify-start p-4 h-auto transition-all ${
                        selectedAIs.includes(persona.name) 
                          ? 'bg-primary text-primary-foreground shadow-md' 
                          : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{persona.avatar}</span>
                        <span className="text-xs font-medium">{persona.name}</span>
                      </div>
                    </Button>
                  ))}
                </div>
                
                {selectedAIs.length === 0 && (
                  <p className="text-sm text-destructive">Please select at least one AI to start the debate.</p>
                )}
              </div>

              {/* User Participation Toggle */}
              <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
                <Switch
                  id="user-participation"
                  checked={userParticipation}
                  onCheckedChange={setUserParticipation}
                />
                <Label htmlFor="user-participation" className="flex-1">
                  <span className="font-medium text-foreground">Join the debate as a participant</span>
                  <p className="text-sm text-muted-foreground">Add your own arguments during the debate</p>
                </Label>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleClearForm}
                  variant="outline"
                  className="w-full sm:w-auto text-base py-6 border-border"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Clear
                </Button>
                <Button
                  onClick={handleStartDebate}
                  disabled={!topic.trim() || selectedAIs.length === 0 || isStarting}
                  className="w-full text-lg py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isStarting ? (
                    <>
                      <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                      Starting Debate...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-5 h-5 mr-2" />
                      Start the Debate! ({selectedAIs.length} AI{selectedAIs.length !== 1 ? 's' : ''})
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

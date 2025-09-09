import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { aiPersonas } from '../components/MockData';
import { createPageUrl } from '../components/utils'; // Corrected import path

export default function PersonalitiesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Button
            variant="outline"
            size="icon"
            className="border-border"
            onClick={() => navigate(createPageUrl('Home'))}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">AI Personalities</h1>
            <p className="text-muted-foreground">Meet the debaters. Each AI has a unique style, strength, and weakness.</p>
          </div>
        </motion.div>

        {/* Personalities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiPersonas.map((persona, index) => (
            <motion.div
              key={persona.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full bg-card border-border flex flex-col shadow-lg hover:shadow-primary/20 transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{persona.avatar}</span>
                    <div>
                      <CardTitle className="text-xl text-card-foreground">{persona.name}</CardTitle>
                      <CardDescription className="italic">{persona.style}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between">
                  <p className="text-muted-foreground mb-4">{persona.description}</p>
                  <div className="space-y-3 mt-auto pt-4 border-t border-border/50">
                    <div className="flex items-start gap-3">
                      <Zap className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-foreground">Strength</h4>
                        <p className="text-sm text-muted-foreground">{persona.strength}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Target className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-foreground">Weakness</h4>
                        <p className="text-sm text-muted-foreground">{persona.weakness}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
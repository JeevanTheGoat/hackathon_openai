
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LeaderboardCard from '../components/LeaderboardCard';
import { useDebates } from '../components/DebatesContext'; // Use context
import { createPageUrl } from '../components/utils'; // Corrected import path

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const { fetchLeaderboardData } = useDebates(); // Get function from context
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      setIsLoading(true);
      try {
        const data = await fetchLeaderboardData();
        const sortedData = [...data].sort((a, b) => b.wins - a.wins);
        setLeaderboardData(sortedData);
      } catch (error) {
        console.error('Error loading leaderboard:', error);
        // TODO: Display an error message to the user
      } finally {
        setIsLoading(false);
      }
    };
    loadLeaderboard();
  }, [fetchLeaderboardData]); // Add fetchLeaderboardData to dependency array

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-12">
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
            <h1 className="text-3xl font-bold text-foreground">AI Leaderboard</h1>
            <p className="text-muted-foreground">See which AI personalities are dominating the debates.</p>
          </div>
        </motion.div>

        {/* Leaderboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
          {leaderboardData.map((stats, index) => (
            <LeaderboardCard
              key={stats.name}
              persona={stats.name}
              stats={stats}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

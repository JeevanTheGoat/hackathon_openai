import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  manageDebate,
  submitVotes as apiSubmitVotes,
  fetchLeaderboardData as apiFetchLeaderboardData,
} from './api';

const DebatesContext = createContext();

export const useDebates = () => useContext(DebatesContext);

export const DebatesProvider = ({ children }) => {
  const [debates, setDebates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDebates = async () => {
      setIsLoading(true);
      try {
        const debateList = await manageDebate({ method: 'GET' });
        setDebates(debateList);
      } catch (error) {
        console.error("Failed to fetch debates:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDebates();
  }, []);

  const addDebate = async (debateData) => {
    const newDebate = await manageDebate({ method: 'POST', data: debateData });
    setDebates(prev => [{ id: newDebate.id, topic: newDebate.topic }, ...prev]);
    return newDebate;
  };

  const deleteDebate = async (debateId) => {
    setDebates(prev => prev.filter(d => d.id !== debateId));
    try {
      await manageDebate({ method: 'DELETE', debateId });
    } catch (error) {
      console.error("Failed to delete debate:", error);
      // Re-add debate to list on failure? Or show error.
    }
  };

  const getDebateById = useCallback(async (debateId) => {
    return await manageDebate({ method: 'GET', debateId });
  }, []);

  const updateDebate = async (debateId, updatedData) => {
    return await manageDebate({ method: 'PATCH', debateId, data: updatedData });
  };
  
  const submitUserMessage = async (debateId, round, message) => {
    // This is now part of the general 'updateDebate' logic
    const debate = await getDebateById(debateId);
    const user_messages = { ...(debate.user_messages || {}), [round]: message };
    await updateDebate(debateId, { user_messages });
    return user_messages;
  };

  const submitVotes = async (debateId, votes) => {
    return await apiSubmitVotes(debateId, votes);
  };

  const value = {
    debates,
    isLoading,
    addDebate,
    deleteDebate,
    getDebateById,
    updateDebate,
    submitUserMessage,
    submitVotes,
    fetchLeaderboardData: apiFetchLeaderboardData, // Expose leaderboard fetch
  };

  return (
    <DebatesContext.Provider value={value}>
      {children}
    </DebatesContext.Provider>
  );
};
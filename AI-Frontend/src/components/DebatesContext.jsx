import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
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
  const [activeDebate, setActiveDebate] = useState(null);
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected'); // disconnected, connecting, connected
  const socketRef = useRef(null);

  const handleWebSocketMessage = useCallback((message) => {
    console.log('WebSocket message received:', message);

    switch (message.type) {
      case 'DEBATE_DATA':
        // Full debate data received
        setActiveDebate(message.payload);
        break;

      case 'NEW_RESPONSE':
        // A new AI response has been generated
        setActiveDebate(prev => {
          if (!prev) return prev;
          
          const { round, response } = message.payload;
          const updatedRoundsData = {
            ...prev.rounds_data,
            [round]: [...(prev.rounds_data[round] || []), response]
          };
          
          return {
            ...prev,
            rounds_data: updatedRoundsData
          };
        });
        break;

      case 'ROUND_UPDATED':
        // Entire round data updated (batch of responses)
        setActiveDebate(prev => {
          if (!prev) return prev;
          
          const { round, responses } = message.payload;
          return {
            ...prev,
            rounds_data: {
              ...prev.rounds_data,
              [round]: responses
            }
          };
        });
        break;

      case 'DEBATE_UPDATED':
        // General debate update (status, round, etc.)
        setActiveDebate(prev => ({
          ...prev,
          ...message.payload
        }));
        break;

      case 'USER_MESSAGE_ADDED':
        // User message was added
        setActiveDebate(prev => {
          if (!prev) return prev;
          
          const { round, message: userMessage } = message.payload;
          return {
            ...prev,
            user_messages: {
              ...prev.user_messages,
              [round]: userMessage
            }
          };
        });
        break;

      case 'ERROR':
        console.error('WebSocket error from server:', message.payload);
        break;

      default:
        console.warn('Unknown WebSocket message type:', message.type);
    }
  }, []);

  const disconnectWebSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
      setSocket(null);
      setConnectionStatus('disconnected');
    }
  }, []);

  const connectWebSocket = useCallback((debateId) => {
    if (socketRef.current) {
      socketRef.current.close();
    }

    setConnectionStatus('connecting');
    
    // TODO: Replace with actual WebSocket endpoint
    const wsUrl = `wss://your-backend.com/debates/${debateId}/live`;
    // For development, you might use: `ws://localhost:8000/debates/${debateId}/live`
    
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log(`WebSocket connected for debate ${debateId}`);
      setSocket(ws);
      setConnectionStatus('connected');
      socketRef.current = ws;

      // Request initial debate data
      ws.send(JSON.stringify({
        type: 'GET_DEBATE_DATA',
        payload: { debateId }
      }));
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      handleWebSocketMessage(message);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('disconnected');
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setSocket(null);
      setConnectionStatus('disconnected');
      socketRef.current = null;
    };
  }, [handleWebSocketMessage]);

  // WebSocket connection management
  useEffect(() => {
    // Only connect WebSocket when we have an active debate
    if (activeDebate?.id) {
      connectWebSocket(activeDebate.id);
    }

    return () => {
      disconnectWebSocket();
    };
  }, [activeDebate?.id, connectWebSocket, disconnectWebSocket]);

  // HTTP-based functions for non-real-time operations
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
    if (activeDebate?.id === debateId) {
      setActiveDebate(null);
      disconnectWebSocket();
    }
    try {
      await manageDebate({ method: 'DELETE', debateId });
    } catch (error) {
      console.error("Failed to delete debate:", error);
    }
  };

  // WebSocket-enabled debate functions
  const getDebateById = useCallback(async (debateId) => {
    // First, get basic data via HTTP
    const debateData = await manageDebate({ method: 'GET', debateId });
    setActiveDebate(debateData);
    
    // WebSocket will handle live updates once connected
    return debateData;
  }, []);

  const updateDebate = useCallback(async (debateId, updatedData) => {
    // Send update via WebSocket if connected, otherwise fall back to HTTP
    if (socket && connectionStatus === 'connected') {
      socket.send(JSON.stringify({
        type: 'UPDATE_DEBATE',
        payload: { debateId, data: updatedData }
      }));
      
      // Don't return anything - the update will come via WebSocket message
      return activeDebate;
    } else {
      // Fallback to HTTP if WebSocket not available
      await manageDebate({ method: 'PATCH', debateId, data: updatedData });
      const freshlyFetchedDebate = await manageDebate({ method: 'GET', debateId });
      setActiveDebate(freshlyFetchedDebate);
      return freshlyFetchedDebate;
    }
  }, [socket, connectionStatus, activeDebate]);

  const submitUserMessage = useCallback(async (debateId, round, message) => {
    if (socket && connectionStatus === 'connected') {
      socket.send(JSON.stringify({
        type: 'ADD_USER_MESSAGE',
        payload: { debateId, round, message }
      }));
      
      // Update local state immediately for better UX
      setActiveDebate(prev => ({
        ...prev,
        user_messages: {
          ...prev.user_messages,
          [round]: message
        }
      }));
      
      return { ...activeDebate.user_messages, [round]: message };
    } else {
      // Fallback to HTTP
      const debate = await getDebateById(debateId);
      const user_messages = { ...(debate.user_messages || {}), [round]: message };
      await updateDebate(debateId, { user_messages });
      return user_messages;
    }
  }, [socket, connectionStatus, activeDebate, getDebateById, updateDebate]);

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
    fetchLeaderboardData: apiFetchLeaderboardData,
    
    // WebSocket-specific state
    activeDebate,
    connectionStatus,
    socket,
  };

  return (
    <DebatesContext.Provider value={value}>
      {children}
    </DebatesContext.Provider>
  );
};
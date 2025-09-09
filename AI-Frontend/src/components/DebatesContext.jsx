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
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const socketRef = useRef(null);

  const handleWebSocketMessage = useCallback((message) => {
    console.log('WebSocket message received:', message);

    switch (message.type) {
      case 'DEBATE_DATA':
        setActiveDebate(message.payload);
        break;

      case 'NEW_RESPONSE':
        setActiveDebate(prev => {
          if (!prev) return prev;
          const { round, response } = message.payload;
          return {
            ...prev,
            rounds_data: {
              ...prev.rounds_data,
              [round]: [...(prev.rounds_data[round] || []), response]
            }
          };
        });
        break;

      case 'ROUND_UPDATED':
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
        setActiveDebate(prev => ({ ...prev, ...message.payload }));
        break;

      case 'USER_MESSAGE_ADDED':
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

    const wsUrl = `ws://localhost:8080/debates/${debateId}/live`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log(`WebSocket connected for debate ${debateId}`);
      setSocket(ws);
      setConnectionStatus('connected');
      socketRef.current = ws;

      // Request initial debate data
      ws.send(JSON.stringify({
        type: 'GET_DEBATE_DATA',
        payload: { debateId } // match backend naming
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

  useEffect(() => {
    if (activeDebate?.id) {
      connectWebSocket(activeDebate.id);
    }
    return () => disconnectWebSocket();
  }, [activeDebate?.id, connectWebSocket, disconnectWebSocket]);

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

  const getDebateById = useCallback(async (debateId) => {
    const debateData = await manageDebate({ method: 'GET', debateId });
    setActiveDebate(debateData);
    return debateData;
  }, []);

  const updateDebate = useCallback(async (debateId, updatedData) => {
    if (socket && connectionStatus === 'connected') {
      socket.send(JSON.stringify({
        type: 'UPDATE_DEBATE',
        payload: { debateId, data: updatedData } // send debateId + data
      }));
      return activeDebate;
    } else {
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
        payload: { debateId, round, message } // match backend
      }));

      setActiveDebate(prev => ({
        ...prev,
        user_messages: { ...prev.user_messages, [round]: message }
      }));

      return { ...activeDebate.user_messages, [round]: message };
    } else {
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

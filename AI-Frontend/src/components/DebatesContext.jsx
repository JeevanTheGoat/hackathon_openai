
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const DebatesContext = createContext();

export const useDebates = () => useContext(DebatesContext);

// This is a placeholder. Replace with your actual WebSocket server URL.
const WEBSOCKET_URL = 'wss://your-websocket-endpoint.com/ws';

export const DebatesProvider = ({ children }) => {
  const [debates, setDebates] = useState([]); // Holds the list of {id, topic}
  const [activeDebate, setActiveDebate] = useState(null); // Holds the full, detailed active debate object
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  
  const socket = useRef(null);
  const requestCallbacks = useRef({});

  useEffect(() => {
    // Connect to the WebSocket server
    socket.current = new WebSocket(WEBSOCKET_URL);

    socket.current.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      // Request initial data needed for the app
      socket.current.send(JSON.stringify({ type: 'GET_DEBATE_LIST' }));
    };

    socket.current.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    socket.current.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    // Central message handler
    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('WebSocket message received:', message);

      // Handle responses to specific requests that had a callback
      if (message.requestId && requestCallbacks.current[message.requestId]) {
        requestCallbacks.current[message.requestId](message.payload);
        delete requestCallbacks.current[message.requestId];
      }

      // Handle broadcast/state update messages
      switch (message.type) {
        case 'DEBATE_LIST_UPDATED':
          setDebates(message.payload);
          break;
        case 'DEBATE_UPDATED':
          // Use functional update to avoid stale closure on `activeDebate`
          setActiveDebate(prevActiveDebate => {
            if (prevActiveDebate?.id === message.payload.id) {
              return message.payload;
            }
            return prevActiveDebate;
          });
          break;
        case 'DEBATE_DELETED':
           setDebates(prev => prev.filter(d => d.id !== message.payload.id));
           // Use functional update here as well
           setActiveDebate(prevActiveDebate => {
             if (prevActiveDebate?.id === message.payload.id) {
               return null; // Clear active debate if it was deleted
             }
             return prevActiveDebate;
           });
          break;
        case 'LEADERBOARD_UPDATED':
          setLeaderboardData(message.payload);
          break;
        default:
          // Ignore messages we don't recognize
          break;
      }
    };

    // Cleanup on unmount
    return () => {
      socket.current.close();
    };
  }, []); // This effect runs only once

  const sendMessage = (type, payload = {}, callback) => {
    if (socket.current?.readyState === WebSocket.OPEN) {
      const requestId = callback ? Date.now().toString() + Math.random() : null;
      if (requestId) {
        requestCallbacks.current[requestId] = callback;
      }
      socket.current.send(JSON.stringify({ type, payload, requestId }));
    } else {
      console.error('WebSocket is not connected.');
    }
  };

  // --- Rewritten Context Functions ---

  const addDebate = (debateData) => {
    return new Promise((resolve) => {
      sendMessage('CREATE_DEBATE', { data: debateData }, (newDebate) => {
        // Also update the activeDebate state immediately after creation
        setActiveDebate(newDebate);
        resolve(newDebate);
      });
    });
  };

  const deleteDebate = (debateId) => {
    sendMessage('DELETE_DEBATE', { debateId });
  };
  
  const getDebateById = useCallback((debateId) => {
    // Set active debate to null while we wait for new data to prevent showing stale data
    setActiveDebate(null); 
    sendMessage('GET_DEBATE_DETAILS', { debateId }, (debateDetails) => {
        setActiveDebate(debateDetails);
    });
  }, []);

  const updateDebate = (debateId, updatedData) => {
    sendMessage('UPDATE_DEBATE', { debateId, data: updatedData });
  };
  
  const submitUserMessage = (debateId, round, message) => {
    // When submitting a message, we can't rely on the activeDebate state here
    // as it might be stale. The backend should handle adding the message.
    sendMessage('UPDATE_DEBATE', { debateId, data: { user_message: { round, message } } });
  };

  const submitVotes = (debateId, votes) => {
    sendMessage('SUBMIT_VOTES', { debateId, data: votes });
  };

  const fetchLeaderboardData = useCallback(() => {
     sendMessage('GET_LEADERBOARD');
  }, []);

  const value = {
    debates,
    activeDebate,
    leaderboardData,
    isConnected,
    addDebate,
    deleteDebate,
    getDebateById,
    updateDebate,
    submitUserMessage,
    submitVotes,
    fetchLeaderboardData,
  };

  return (
    <DebatesContext.Provider value={value}>
      {children}
    </DebatesContext.Provider>
  );
};

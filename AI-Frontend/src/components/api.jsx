
import { aiPersonas } from './MockData';
import axios from 'axios'

// DELETE THIS AFTER CONNECTING REAL API - only simulates network delay
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// WebSocket endpoint configuration
export const WS_CONFIG = {
  // TODO: Replace with actual WebSocket base URL
  BASE_URL: 'ws://localhost:8080',
  // For development: 'ws://localhost:8000'
  
  // WebSocket endpoints
  DEBATE_LIVE: (debateId) => `${WS_CONFIG.BASE_URL}/debates/${debateId}/live`,
};

export const manageDebate = async ({ method, debateId, data }) => {
  console.log(`API CALL: manageDebate`, { method, debateId, data });

  const baseUrl = "http://localhost:8080/api/debates";
  const url = debateId ? `${baseUrl}/${debateId}` : baseUrl;

  if (method === "GET" && !debateId) {
    const res = await axios.get(baseUrl);
    return res.data;
  }

  if (method === "GET" && debateId) {
    const res = await axios.get(url);
    return res.data;
  }

  if (method === "POST") {
    const res = await axios.post(baseUrl, data);
    return res.data;
  }

  if (method === "DELETE") {
    await axios.delete(url);
    return { success: true };
  }

  if(method === "PATCH"){
    const res = await axios.patch(url,data);
    return res.data;
  }

  throw new Error(`Unsupported method: ${method}`);

  
};



export const submitVotes = async (debateId, votes) => {
  const baseUrl = "http://localhost:8080/api/votes";
  const url = `${baseUrl}/${debateId}`;
  console.log(`API CALL: submitVotes(${debateId})`, votes);

  const res = await axios.post(url, votes);
  return res.data;
};


export const fetchLeaderboardData = async () => {

  const baseUrl = "http://localhost:8080/api/leaderboard";

  const res = await axios.get(baseUrl)
  console.log(res.data);
  return res.data;

  
};






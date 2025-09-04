/**
 * ==========================================================================================
 *                          INSTRUCTIONS FOR BACKEND DEVELOPER
 * ==========================================================================================
 *
 * This file contains the functions the frontend uses to talk to the backend.
 * Your task is to replace the MOCK LOGIC in the 3 functions below with
 * real API calls (`fetch`) to endpoints.
 *
 * The mock logic is here so the app works for demonstration purposes.
 * Just replace the sections marked with "--- MOCK LOGIC (to be replaced) ---".
 *
 * The function signatures and expected return values are already defined.
 *
 * ==========================================================================================
 */

// DELETE THIS AFTER CONNECTING REAL API - only needed for mock data
import { aiPersonas } from './MockData';

// DELETE THIS AFTER CONNECTING REAL API - only simulates network delay
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- API 1: DEBATE & RESPONSE MANAGEMENT ---

/**
 * Fetches, creates, or updates a debate.
 * This is the primary endpoint for all debate-related actions.
 */
export const manageDebate = async ({ method, debateId, data }) => {
  console.log(`API CALL: manageDebate`, { method, debateId, data });

  // --- MOCK LOGIC (to be replaced) ---
  // TODO: Replace the mock logic below with a single fetch call to main debate endpoint.
  // EXAMPLE:
  //   const url = debateId ? `/api/debates/${debateId}` : '/api/debates';
  //   const response = await fetch(url, { method, body: data ? JSON.stringify(data) : undefined, headers: {'Content-Type': 'application/json'} });
  //   return response.json();
  // -----------------------------------

  // DELETE ALL OF THIS MOCK LOGIC AFTER CONNECTING REAL API
  await sleep(800);

  let debates = JSON.parse(localStorage.getItem('ai-debates') || '[]');

  if (method === 'GET' && !debateId) {
    return debates.map(({ id, topic }) => ({ id, topic }));
  }

  if (method === 'GET' && debateId) {
    let debate = debates.find(d => d.id === debateId);
    if (debate && (!debate.rounds_data || Object.keys(debate.rounds_data).length === 0)) {
       debate.rounds_data = mockGenerateAllResponses(debate);
    }
    return debate;
  }

  if (method === 'POST') {
    const newDebate = { ...data, id: Date.now().toString(), current_round: 'opening', votes: null, user_messages: {}, rounds_data: {} };
    newDebate.rounds_data = mockGenerateAllResponses(newDebate);
    debates.unshift(newDebate);
    localStorage.setItem('ai-debates', JSON.stringify(debates));
    return newDebate;
  }
  
  if (method === 'PATCH' && debateId) {
     let debateToUpdate;
     const updatedDebates = debates.map(d => {
       if (d.id === debateId) {
         debateToUpdate = { ...d, ...data };
         return debateToUpdate;
       }
       return d;
     });
     localStorage.setItem('ai-debates', JSON.stringify(updatedDebates));
     return debateToUpdate;
  }
  
  if (method === 'DELETE' && debateId) {
     const filteredDebates = debates.filter(d => d.id !== debateId);
     localStorage.setItem('ai-debates', JSON.stringify(filteredDebates));
     return { success: true };
  }

  return null;
  // END OF DELETABLE MOCK LOGIC
};

// --- API 2: VOTING SYSTEM ---

/**
 * Submits user votes and gets results.
 * Expected input: { bestArgument: "AI_NAME", funniest: "AI_NAME", mostCreative: "AI_NAME" }
 * Expected output: Same object echoed back to confirm votes were saved
 */
export const submitVotes = async (debateId, votes) => {
  console.log(`API CALL: submitVotes(${debateId})`, votes);
  
  // --- MOCK LOGIC (to be replaced) ---
  // TODO: Replace this with a fetch call to voting endpoint.
  // EXAMPLE:
  //   const response = await fetch(`/api/votes/${debateId}`, { method: 'POST', body: JSON.stringify(votes), headers: {'Content-Type': 'application/json'} });
  //   return response.json();
  // -----------------------------------

  // DELETE ALL OF THIS MOCK LOGIC AFTER CONNECTING REAL API
  await sleep(800);
  
  let debates = JSON.parse(localStorage.getItem('ai-debates') || '[]');
  const updatedDebates = debates.map(d => {
    if (d.id === debateId) {
      return { ...d, votes, current_round: 'results' };
    }
    return d;
  });
  localStorage.setItem('ai-debates', JSON.stringify(updatedDebates));
  return votes;
  // END OF DELETABLE MOCK LOGIC
};


// --- API 3: LEADERBOARD ---

/**
 * Fetches the AI leaderboard data.
 * Expected output: Array of objects with { name, wins, funnyVotes, creativeVotes, selectedCount }
 */
export const fetchLeaderboardData = async () => {
  console.log("API CALL: fetchLeaderboardData");
  
  // --- MOCK LOGIC (to be replaced) ---
  // TODO: Replace this with a fetch call to leaderboard endpoint.
  // EXAMPLE:
  //   const response = await fetch('/api/leaderboard');
  //   return response.json();
  // -----------------------------------
  
  // DELETE ALL OF THIS MOCK LOGIC AFTER CONNECTING REAL API
  await sleep(1200);
  return [
    { name: "FUNNY", wins: 18, funnyVotes: 45, creativeVotes: 12, selectedCount: 32 },
    { name: "SERIOUS", wins: 22, funnyVotes: 2, creativeVotes: 8, selectedCount: 28 },
    { name: "AGGRESSIVE", wins: 15, funnyVotes: 8, creativeVotes: 5, selectedCount: 25 },
    { name: "NICE", wins: 12, funnyVotes: 15, creativeVotes: 18, selectedCount: 22 },
    { name: "CREATIVE", wins: 8, funnyVotes: 25, creativeVotes: 38, selectedCount: 18 },
    { name: "CALM", wins: 14, funnyVotes: 6, creativeVotes: 22, selectedCount: 16 },
    { name: "ANGRY", wins: 9, funnyVotes: 18, creativeVotes: 4, selectedCount: 12 }
  ];
  // END OF DELETABLE MOCK LOGIC
};


// DELETE THIS ENTIRE FUNCTION AFTER CONNECTING REAL API - only generates fake AI responses
const mockGenerateAllResponses = (debateData) => {
  const selectedPersonas = aiPersonas.filter(p => 
    debateData.selected_ais && debateData.selected_ais.includes(p.name)
  );

  const rounds = ['opening', 'rebuttal', 'crosstalk', 'closing'];
  const data = {};

  const generateMockResponse = (persona, topic, round) => {
    const responses = {
      opening: `This is my opening statement on "${topic}" from the perspective of a ${persona.tone} AI.`,
      rebuttal: `This is my rebuttal on "${topic}" with a ${persona.tone} tone.`,
      crosstalk: `This is my crosstalk point about "${topic}", you can tell I am ${persona.tone}.`,
      closing: `And this is my final, ${persona.tone} closing argument for the debate on "${topic}".`
    };
    return responses[round] || "I have nothing to say.";
  };

  rounds.forEach(round => {
    data[round] = selectedPersonas.map(persona => ({
      sender: persona.name,
      content: generateMockResponse(persona, debateData.topic, round)
    }));
  });
  return data;
};
<<<<<<< HEAD
import axios from 'axios';
=======
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
>>>>>>> cf530b1446cb88ade2eade153c856130e4e4b895

export const manageDebate = async ({ method, debateId, data }) => {
  console.log(`API CALL: manageDebate`, { method, debateId, data });

<<<<<<< HEAD
  const baseUrl = "http://localhost:8080/api/debates";
  const url = debateId ? `${baseUrl}/${debateId}` : baseUrl;
=======
  // --- MOCK LOGIC (to be replaced) ---
  // TODO: Replace the mock logic below with a single fetch call to main debate endpoint.
  // EXAMPLE:
  //   const url = debateId ? `/api/debates/${debateId}` : '/api/debates';
  //   const response = await fetch(url, { method, body: data ? JSON.stringify(data) : undefined, headers: {'Content-Type': 'application/json'} });
  //   return response.json();
  // -----------------------------------
>>>>>>> cf530b1446cb88ade2eade153c856130e4e4b895

  if (method === "GET" && !debateId) {
    const res = await axios.get(baseUrl);
    console.log(res.data);
    return res.data;
  }

  if (method === "GET" && debateId) {
    const res = await axios.get(url);
    console.log(res.data);
    return res.data;
  }

  if (method === "POST") {
    const res = await axios.post(baseUrl, data);
    console.log(data);
    console.log(res.data);
    return res.data;
  }

  if (method === "DELETE") {
    await axios.delete(url);
    return { success: true };
  }

  if(method === "PATCH"){
    const res = await axios.patch(url,data);
    console.log(data);
    console.log(res.data);
    return res.data;
  }

  throw new Error(`Unsupported method: ${method}`);

  
};

export const submitVotes = async (debateId, votes) => {
<<<<<<< HEAD
  const baseUrl = "http://localhost:8080/api/votes";
  const url = `${baseUrl}/${debateId}`;
=======
  console.log(`API CALL: submitVotes(${debateId})`, votes);
  
  // --- MOCK LOGIC (to be replaced) ---
  // TODO: Replace this with a fetch call to voting endpoint.
  // EXAMPLE:
  //   const response = await fetch(`/api/votes/${debateId}`, { method: 'POST', body: JSON.stringify(votes), headers: {'Content-Type': 'application/json'} });
  //   return response.json();
  // -----------------------------------
>>>>>>> cf530b1446cb88ade2eade153c856130e4e4b895

  const res = await axios.post(url, votes);
  console.log(res.data);
  return res.data;
};



export const fetchLeaderboardData = async () => {

  const baseUrl = "http://localhost:8080/api/leaderboard";

  const res = await axios.get(baseUrl)
  return res.data;

  
<<<<<<< HEAD
=======
  // --- MOCK LOGIC (to be replaced) ---
  // TODO: Replace this with a fetch call to leaderboard endpoint.
  // EXAMPLE:
  //   const response = await fetch('/api/leaderboard');
  //   return response.json();
  // -----------------------------------
>>>>>>> cf530b1446cb88ade2eade153c856130e4e4b895
  
};

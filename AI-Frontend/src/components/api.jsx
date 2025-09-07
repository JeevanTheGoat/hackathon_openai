import axios from 'axios';

export const manageDebate = async ({ method, debateId, data }) => {
  console.log(`API CALL: manageDebate`, { method, debateId, data });

  const baseUrl = "http://localhost:8080/api/debates";
  const url = debateId ? `${baseUrl}/${debateId}` : baseUrl;

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
  const baseUrl = "http://localhost:8080/api/votes";
  const url = `${baseUrl}/${debateId}`;

  const res = await axios.post(url, votes);
  console.log(res.data);
  return res.data;
};



export const fetchLeaderboardData = async () => {

  const baseUrl = "http://localhost:8080/api/leaderboard";

  const res = await axios.get(baseUrl)
  return res.data;

  
  
};

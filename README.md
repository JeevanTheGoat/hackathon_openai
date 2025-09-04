# hackathon_openai

# AI DebateMate is a fun and interactive platform where multiple AI debaters argue on a wide range of topics, it ranges from fun to interactive to serious or random

# AI DebateMate brings debates to life by allowing 7 AI debaters to take on unique perspectives and personalities
# The vision of this project is to 

- Explore AI-driven discourse in real time.
- Provide an educational tool for argumentation and critical thinking.
- Deliver entertainment through humorous and unexpected debates.
Example topics Include:
- Should pineapple be allowed on pizza?
- Will AI replace teachers by 2030?
- Is homework still relevant in 2025? 

# Features
Multi-AI Debate Simulation: Watch 5 AI debaters argue with structured phases:
- Opening statements
- Rebuttals
- Cross-talk
- Closing arguments
- Voting System: Users can vote for the winner after each debate.
- Leaderboard: highlights the prompoters and the results based on the voting

# Getting Started
Python 3.9+
Node.js 18+
gpt-oss-20b
fast api key

1. Clone the Repository
git clone https://github.com/JeevanTheGoat/hackathon_openai.git
cd hackathon_openai
2. Create and Activate Virtual Environment
python -m venv venv
source venv/bin/activate
3. pip install -r requirements.txt
4. Add Environment Variables
Create a .env file in the project root:
OPENAI_API_KEY=your_openai_api_key_here
5. Run the Backend
uvicorn main:app --reload

#Usage 
Endpoint: Generate Debate
POST /ai/debate
Example Request
{
  "topic": "Should artificial intelligence be regulated?",
  "num_debaters": 7
}

Example Response
{
  "topic": "Should artificial intelligence be regulated?",
  "debate": [
    {"agent": "AI_1", "response": "Yes, AI should be regulated to ensure safety and prevent misuse."},
    {"agent": "AI_2", "response": "No, regulation may stifle innovation and slow progress."}
  ]
}

#Testing Instructions
pytest

Sample Data for Testing
Create a sample file called sample_input.json:
{
  "topic": "Will AI replace human jobs?",
  "num_debaters": 7
}
Run test with:
curl -X POST http://127.0.0.1:8000/ai/debate \
-H "Content-Type: application/json" \
-d @sample_input.json

#Contributing
We welcome contributions!
To contribute:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

#Lisence 
This project is licensed under the MIT License - see the LICENSE
 file for details.

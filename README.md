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
Java 17+
fast api key

#Installation 

1. Clone the Repository
git clone https://github.com/JeevanTheGoat/hackathon_openai.git
cd hackathon_openai

2. Configure Environment Variables

In src/main/resources/application.properties:
openai.api.key=YOUR_OPENAI_API_KEY
server.port=8080

3. Build and Run the Backend

Using Maven:
mvn clean install
mvn spring-boot:run
Your backend will now run at:
http://localhost:8080

#Usage
Endpoint: Generate Debate

POST /ai/debate

Example Request
{
  "topic": "Should artificial intelligence be regulated?",
  "numDebaters": 7
}

Example Response
{
  "topic": "Should artificial intelligence be regulated?",
  "debate": [
    {
      "agent": "AI_1",
      "response": "AI must be regulated to ensure safety and prevent misuse."
    },
    {
      "agent": "AI_2",
      "response": "Regulation could limit innovation and slow progress."
    }
  ]
}

#Testing Instructions

We use JUnit for testing and curl for manual endpoint testing.

Run Automated Tests
mvn test

Manual Testing with Curl
Create a file named sample_input.json:
{
  "topic": "Will AI replace human jobs?",
  "numDebaters": 7
}
Run:
curl -X POST http://localhost:8080/ai/debate \
-H "Content-Type: application/json" \
-d @sample_input.json

# Sample Output
{
  "topic": "Will AI replace human jobs?",
  "debate": [
    {
      "agent": "AI_1",
      "response": "AI will replace repetitive and dangerous jobs, freeing humans for creative tasks."
    },
    {
      "agent": "AI_2",
      "response": "While AI will automate some roles, humans will always be needed for oversight and ethics."
    },
    {
      "agent": "AI_3",
      "response": "Both AI and humans must coexist, with education adapting to this shift."
    }
  ]
}

# Contributing

We welcome contributions!
To contribute:

Fork this repository

Create a new feature branch

Submit a pull request

# License

This project is licensed under the MIT License – see the LICENSE
 file for details.

# Hackathon Checklist

 Clear setup instructions

 Testing data included (sample_input.json)

 Demo-ready backend with /ai/debate endpoint

 Unique project purpose explained clearly

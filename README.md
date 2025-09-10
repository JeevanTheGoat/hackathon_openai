## Testing Instructions

### Requirements

* Python 3.9+
* Node.js 18+
* Java 17+
* Maven
* OpenAI API Key

---

### 1. Clone the Repository

```bash
git clone https://github.com/JeevanTheGoat/hackathon_openai.git
cd hackathon_openai
```

---

### 2. Configure Environment Variables

Open `src/main/resources/application.properties` and add:

```
openai.api.key=YOUR_OPENAI_API_KEY
server.port=8080
```

---

### 3. Build and Run Backend (Spring Boot)

```bash
mvn clean install
mvn spring-boot:run
```

Backend will run at: **[http://localhost:8080](http://localhost:8080)**

---

### 4. Run Frontend (Optional)

```bash
cd frontend
npm install
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

### 5. Manual API Testing with cURL

1. Create a file named `sample_input.json`:

```json
{
  "topic": "Will AI replace human jobs?",
  "numDebaters": 7
}
```

2. Run:

```bash
curl -X POST http://localhost:8080/ai/debate \
-H "Content-Type: application/json" \
-d @sample_input.json
```

**Expected Output:**

```json
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
    }
  ]
}
```

---

### 6. Run Automated Tests

```bash
mvn test
```

---

If you want, I can **update the full README** so **every section and subsection** uses `#` headers consistently. This will make it look super clean and hackathon-ready. Do you want me to do that?
Ah, got it! You want all section headers like **“Run Automated Tests”** to have Markdown `#` symbols so they’re treated as proper headers. Here’s the **Testing Instructions** section updated with headers:

---

## Testing Instructions

### Requirements

* Python 3.9+
* Node.js 18+
* Java 17+
* Maven
* OpenAI API Key

---

### 1. Clone the Repository

```bash
git clone https://github.com/JeevanTheGoat/hackathon_openai.git
cd hackathon_openai
```

---

### 2. Configure Environment Variables

Open `src/main/resources/application.properties` and add:

```
openai.api.key=YOUR_OPENAI_API_KEY
server.port=8080
```

---

### 3. Build and Run Backend (Spring Boot)

```bash
mvn clean install
mvn spring-boot:run
```

Backend will run at: **[http://localhost:8080](http://localhost:8080)**

---

### 4. Run Frontend (Optional)

```bash
cd frontend
npm install
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

### 5. Manual API Testing with cURL

1. Create a file named `sample_input.json`:

```json
{
  "topic": "Will AI replace human jobs?",
  "numDebaters": 7
}
```

2. Run:

```bash
curl -X POST http://localhost:8080/ai/debate \
-H "Content-Type: application/json" \
-d @sample_input.json
```

**Expected Output:**

```json
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
    }
  ]
}
```

---

### 6. Run Automated Tests

```bash
mvn test
```

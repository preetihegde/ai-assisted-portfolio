# AI-Assisted Portfolio

An interactive AI-powered portfolio that allows visitors to explore my experience, projects, and technical skills through natural language conversations.

Instead of navigating multiple pages, users can simply ask questions like:

- "Tell me about your master's thesis."
- "What AI projects have you built?"
- "What backend technologies have you worked with?"
- "Show me your experience with RAG."

The application combines a React portfolio frontend with a FastAPI backend and a Retrieval-Augmented Generation (RAG) pipeline to provide accurate, context-aware responses.

---

## Features

- Interactive AI chatbot
- Retrieval-Augmented Generation (RAG)
- Context-aware conversations
- Follow-up question understanding
- Automatic question rewriting
- Semantic document retrieval
- Portfolio knowledge base
- Chat history support
- Responsive React UI

---

# System Architecture

```
                    User
                      │
                      ▼
          React + TypeScript (Vite)
                      │
               POST /api/chat
                      │
                      ▼
               FastAPI Backend
                      │
        ┌─────────────┴─────────────┐
        │                           │
        ▼                           ▼
 Chat History Service        Intent Classifier
                                     │
                             Follow-up Question?
                                     │
                         Yes ───────► Question Rewriter
                                     │
                                     ▼
                           Retrieval Service
                                     │
                                     ▼
                           Gemini Embedding API
                                     │
                                     ▼
                               Vector Database
                                     │
                          Top Relevant Chunks
                                     │
                                     ▼
                              Prompt Builder
                                     │
                                     ▼
                           Groq LLM (Generation)
                                     │
                                     ▼
                            Response Parser
                                     │
                                     ▼
                              JSON Response
                                     │
                                     ▼
                               React Frontend
```

---

# Ingestion Pipeline

Documents are processed offline before becoming searchable.

```
Knowledge Repository
        │
        ▼
Document Parsing
        │
        ▼
Chunking Strategy
        │
        ▼
Google Gemini Embedding API
        │
        ▼
Vector Store Creation
        │
        ▼
Knowledge Index
```

---

# Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Markdown Rendering

---

## Backend

- FastAPI
- Python
- REST APIs

---

## AI & Retrieval

- Retrieval-Augmented Generation (RAG)
- Google Gemini Embedding API
- Groq API (LLM Inference)
- Semantic Search
- Prompt Engineering

---

## Knowledge Base

- Markdown
- PDF
- DOCX
- FAQ Documents
- Resume/CV

---

## Project Structure

```
.
├── frontend
│   ├── src
│   ├── components
│   ├── pages
│   └── assets
│
├── backend
│   ├── api
│   ├── prompts
│   ├── knowledge_repository
│   ├── services
│   ├── utils
│   └── app.py
│
└── README.md
```

---

# Chat Flow

1. User submits a question.
2. FastAPI receives the request.
3. Conversation history is loaded.
4. Intent classifier detects whether the query is a follow-up.
5. If necessary, the question is rewritten into a standalone query.
6. Google Gemini Embedding API generates the query embedding.
7. Semantic search retrieves the most relevant knowledge chunks.
8. Prompt Builder combines:
   - System Prompt
   - Retrieved Context
   - Chat History
   - User Question
9. Groq LLM generates the response.
10. Response is returned to the frontend.

---

# Knowledge Repository

The chatbot retrieves information from:

- Resume
- Experience
- Projects
- Skills
- Education
- Master's Thesis
- FAQs
- Portfolio Content

All documents are embedded during ingestion and stored in the vector database.

---

# Key Features

### Retrieval-Augmented Generation

Responses are grounded using relevant portfolio documents instead of relying solely on the language model.

### Follow-up Question Handling

The chatbot understands conversational context and rewrites follow-up questions into standalone queries for better retrieval.

### Semantic Search

User questions are matched based on meaning rather than exact keyword matches using Google Gemini embeddings.

### Prompt Engineering

Responses are generated using:

- System prompts
- Retrieved documents
- Conversation history
- User query

to improve factual accuracy.

---

# Running Locally

## Clone the repository

```bash
git clone https://github.com/<your-username>/<repo>.git
cd <repo>
```

---

## Backend

```bash
cd backend

python -m venv venv

source venv/bin/activate
# Windows
venv\Scripts\activate

pip install -r requirements.txt

uvicorn app:app --reload
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# Environment Variables

Create a `.env` file.

```env
GROQ_API_KEY=your_groq_key

GOOGLE_API_KEY=your_google_api_key
```

---

# Future Improvements

- Hybrid Search (Keyword + Semantic)
- Reranking
- Streaming Responses
- Observability & Logging
- Evaluation Pipeline
- Multi-language Support
- Feedback Collection
- Persistent Chat Sessions

---

# Author

**Preeti Hegde**

AI Engineer | Software Engineer

- Computer Vision
- Retrieval-Augmented Generation (RAG)
- Generative AI
- Backend Development
- FastAPI
- Java
- Python

---

## License

This project is licensed under the MIT License.

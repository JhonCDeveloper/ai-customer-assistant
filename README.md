# AI Customer Assistant - RAG Backend

A professional Retrieval-Augmented Generation (RAG) backend designed for a Language Academy. This system uses Node.js, Express, and LangChain to provide intelligent responses based on local documentation.

## 🚀 Features

- **RAG Implementation**: Uses LangChain to process local markdown documents and provide context-aware answers.
- **RESTful API**: Simple and efficient endpoint for chat integration.
- **OpenAI Integration**: Leverages `gpt-4o-mini` for fast and accurate responses.
- **Context-Strictness**: Designed to only answer using provided documentation, ensuring reliability.
- **n8n Ready**: Optimized for integration with automation platforms like n8n.

## 🛠️ Technology Stack

- **Runtime**: Node.js (v20+)
- **Framework**: Express.js
- **AI Framework**: LangChain
- **LLM**: OpenAI (GPT-4o-mini)
- **Vector Store**: MemoryVectorStore (In-memory)

## 📁 Project Structure

```text
.
├── src/
│   ├── app.js            # Main entry point and server setup
│   ├── routes/
│   │   └── chat.js       # Chat logic and OpenAI integration
│   └── services/
│       └── ragService.js # Vector store and document processing
├── data/                 # Knowledge base (Markdown files)
├── .env                  # Environment variables (not tracked)
└── package.json          # Node.js dependencies
```

## ⚙️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd ai-customer-assistant
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3000
   ```

4. **Add your Knowledge Base**:
   Place your documentation in the `data/` folder as `.md` files.

## 🏃 Running the Application

Start the server:
```bash
node src/app.js
```
The server will initialize the vector store and start listening on the configured port (default: 3000).

## 🔌 API Documentation

### POST /chat

Sends a user message to the assistant and receives a context-aware response.

**Request Body:**
```json
{
  "message": "What courses do you offer?"
}
```

**Successful Response:**
```json
{
  "answer": "We offer English, French, and Spanish courses at all levels...",
  "needs_human": false
}
```

**Uncertain Response:**
```json
{
  "answer": "I don't have enough information to answer that. Let me connect you with a human agent.",
  "needs_human": true
}
```

## 🤖 n8n Integration

To connect this backend with n8n:
1. Use an **HTTP Request** node.
2. **Method**: `POST`.
3. **URL**: `http://localhost:3000/chat` (or `http://host.docker.internal:3000/chat` if using Docker).
4. **Body**: `{"message": "{{$json[\"message\"]}}" }`.

## 📄 License
This project is for internal use at the Language Academy.

# MiniVault API

## 🚀 Quick Start

1. **Install [Node.js](https://nodejs.org/) and [Ollama](https://ollama.com/download)**
2. **Pull the model:**
   ```sh
   ollama pull phi3
   ```
3. **Install dependencies:**
   ```sh
   npm install
   ```
4. **Start the server:**
   ```sh
   npm start
   ```
5. **Test the API:**
   ```sh
   curl -X POST http://localhost:3000/generate \
     -H "Content-Type: application/json" \
     -d '{"prompt": "Hello, world!"}'
   ```

A lightweight local REST API that simulates a core feature of ModelVault's product: receiving a prompt and returning a generated response.

## 🚀 Features

- **POST /generate** endpoint for prompt-to-response generation
- **Local file logging** of all interactions to `logs/log.jsonl`
- **Stubbed responses** (with option for local LLM integration)
- **Health check** endpoint
- **CORS enabled** for frontend integration

## 📋 Requirements

- Node.js (v14 or higher)
- npm or yarn

## 🛠️ Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   # Production
   npm start
   
   # Development (with auto-restart)
   npm run dev
   ```

3. **Verify it's running:**
   - Visit `http://localhost:3000` for API info
   - Visit `http://localhost:3000/health` for health check

## 📡 API Usage

### Generate Response

**Endpoint:** `POST /generate`

**Request:**
```json
{
  "prompt": "What is the capital of France?"
}
```

**Response:**
```json
{
  "response": "This is a stubbed response to your prompt."
}
```

### Health Check

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 📝 Logging

All prompt/response interactions are automatically logged to `logs/log.jsonl` in JSONL format:

```json
{"timestamp":"2024-01-15T10:30:00.000Z","prompt":"What is the capital of France?","response":"This is a stubbed response to your prompt."}
{"timestamp":"2024-01-15T10:31:00.000Z","prompt":"Tell me a joke","response":"Based on your input, here's a generated response."}
```

## 🧪 Testing

### Using curl:
```bash
curl -X POST http://localhost:3000/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello, world!"}'
```

### Using Postman:
- Import the provided Postman collection (see `postman_collection.json`)
- Or manually create a POST request to `http://localhost:3000/generate`

## 🏗️ Project Structure

```
minivault-api/
├── app.js                 # Main API server
├── package.json           # Dependencies and scripts
├── README.md             # This file
├── logs/
│   └── log.jsonl         # Interaction logs (auto-generated)
└── postman_collection.json # API testing collection
```

## 💡 Design Choices, Tradeoffs, and Future Improvements

- **Design Choices:**
  - Chose Node.js + Express for rapid prototyping and easy REST API development.
  - Used Ollama for local LLM inference to ensure 100% offline capability and easy model management.
  - Streaming support added for a modern, interactive user experience.
- **Tradeoffs:**
  - File-based logging is simple and robust for this use case, but not suitable for high-scale production.
  - Synchronous logging for simplicity; could be made async for higher throughput.
- **Future Improvements:**
  - Add support for selecting different models via request param.
  - Add authentication/rate limiting for production use.
  - Add unit and integration tests for robustness.

## 🎯 Bonus Features (Planned)

- [ ] Local LLM integration via Ollama
- [ ] Streaming response output
- [ ] CLI tool for testing
- [ ] Enhanced Postman collection

## 📄 License

MIT License 

## ✨ Design & Bonus Features

- **Local LLM integration:** Uses Ollama with the phi3 model for real, offline AI responses.
- **/generate endpoint:** Standard POST endpoint for prompt/response.
- **Streaming support:** Add `?stream=true` to /generate to receive the LLM output in real time, token-by-token (bonus feature).
- **Logging:** All prompt/response pairs are logged to `logs/log.jsonl`.
- **Postman collection:** Included for easy API testing.
- **No cloud APIs:** 100% local, no internet required for inference.

## 🚀 Streaming vs Non-Streaming

| Feature         | Non-Streaming (Default)         | Streaming (`?stream=true`)         |
|-----------------|---------------------------------|------------------------------------|
| Response timing | After full answer is ready      | As soon as each chunk is ready     |
| User experience | Waits for whole answer          | Sees answer appear in real time    |
| API complexity  | Simple                          | Slightly more complex              |
| Use case        | Short/quick answers             | Long/interactive answers           |

- **Non-Streaming:**
  - The API waits for the full LLM answer, then returns it as a single JSON response.
  - Example:
    ```sh
    curl -X POST http://localhost:3000/generate \
      -H "Content-Type: application/json" \
      -d '{"prompt": "What is the capital of France?"}'
    ```
- **Streaming:**
  - The API streams the LLM output as it is generated, so you see the answer appear in real time.
  - Example:
    ```sh
    curl -N -X POST "http://localhost:3000/generate?stream=true" \
      -H "Content-Type: application/json" \
      -d '{"prompt": "Tell me a joke about Paris."}'
    ```

## ✅ Final Submission Checklist

- [x] **/generate endpoint** (POST, prompt in, response out)
- [x] **Local LLM integration** (Ollama, phi3)
- [x] **Streaming output** (`?stream=true`)
- [x] **Logging to logs/log.jsonl**
- [x] **README with setup, usage, and design notes**
- [x] **Postman collection for easy testing**
- [x] **No cloud APIs used**
- [x] **Bonus features implemented**

---



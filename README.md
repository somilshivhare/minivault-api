# MiniVault API

A lightweight, open-source REST API that simulates a core feature of ModelVault’s product: receiving a prompt and returning a generated response using a local LLM.  
**Runs 100% locally—no cloud APIs, no data leaves your machine!**

---

## 🚀 Quick Start (with phi-3)

1. **Install [Node.js](https://nodejs.org/) and [Ollama](https://ollama.com/download)**
2. **Pull the phi-3 model (recommended and tested):**
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

---

## 🌟 Features

- **POST /generate** endpoint for prompt-to-response generation
- **Local LLM integration** via Ollama (**phi-3 model by default**)
- **Streaming support:** Add `?stream=true` to stream output token-by-token
- **Local file logging** of all interactions to `logs/log.jsonl`
- **Health check** endpoint (`/health`)
- **CORS enabled** for easy frontend integration
- **Postman collection** included for easy API testing

---

## 📋 Requirements

- Node.js (v14 or higher)
- [Ollama](https://ollama.com/download) (for local LLM)
- **phi-3 model** (see Quick Start)
- npm or yarn

---

## 🛠️ Setup

1. **Install dependencies:**  
   `npm install`
2. **Start the server:**  
   `npm start`
3. **Verify it's running:**  
   - Visit `http://localhost:3000` for API info  
   - Visit `http://localhost:3000/health` for health check

---

## 📡 API Usage

### Generate Response

**Endpoint:** `POST /generate`

**Request:**
```json
{ "prompt": "What is the capital of France?" }
```
**Response:**
```json
{ "response": "Paris is the capital of France." }
```

**Streaming:**  
Add `?stream=true` to the endpoint to receive the response in real time.

---

### Health Check

**Endpoint:** `GET /health`

**Response:**
```json
{ "status": "OK", "timestamp": "..." }
```

---

## 📝 Logging

All prompt/response interactions are automatically logged to `logs/log.jsonl` in JSONL format:
```json
{"timestamp":"...","prompt":"...","response":"..."}
```

---

## 🧪 Testing

- **curl:**  
  ```sh
  curl -X POST http://localhost:3000/generate \
    -H "Content-Type: application/json" \
    -d '{"prompt": "Hello, world!"}'
  ```
- **Streaming:**  
  ```sh
  curl -N -X POST "http://localhost:3000/generate?stream=true" \
    -H "Content-Type: application/json" \
    -d '{"prompt": "Tell me a joke about Paris."}'
  ```
- **Postman:**  
  Import the provided `postman_collection.json` or create requests manually.

---

## 🏗️ Project Structure

```
minivault-api/
├── app.js                 # Main API server
├── package.json           # Dependencies and scripts
├── README.md              # This file
├── logs/
│   └── log.jsonl          # Interaction logs (auto-generated)
└── postman_collection.json # API testing collection
```

---

## 💡 Design Choices, Tradeoffs, and Future Improvements

- **Design Choices:**  
  - Node.js + Express for rapid prototyping and REST API development  
  - Ollama for local LLM inference (**phi-3 as the default and recommended model**)  
  - Streaming support for a modern, interactive user experience
- **Tradeoffs:**  
  - File-based logging is simple and robust for this use case, but not suitable for high-scale production  
  - Synchronous logging for simplicity; could be made async for higher throughput
- **Future Improvements:**  
  - Support for selecting different models via request param  
  - Authentication/rate limiting for production use  
  - Unit and integration tests for robustness

---

## 🚀 Streaming vs Non-Streaming

| Feature         | Non-Streaming (Default)    | Streaming (`?stream=true`)        |
|-----------------|---------------------------|-----------------------------------|
| Response timing | After full answer is ready | As soon as each chunk is ready    |
| User experience | Waits for whole answer     | Sees answer appear in real time   |
| API complexity  | Simple                    | Slightly more complex             |
| Use case        | Short/quick answers        | Long/interactive answers          |

---

## ✅ Final Submission Checklist

- [x] **/generate endpoint** (POST, prompt in, response out)
- [x] **Local LLM integration** (Ollama, **phi-3**)
- [x] **Streaming output** (`?stream=true`)
- [x] **Logging to logs/log.jsonl**
- [x] **README with setup, usage, and design notes**
- [x] **Postman collection for easy testing**
- [x] **No cloud APIs used**
- [x] **Bonus features implemented**

---

## 📄 License

MIT License

---

**This project is open to all! Fork, star, or contribute if you find it useful.**  
[GitHub Repo](https://github.com/somilshivhare/minivault-api)



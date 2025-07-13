const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
// Remove: const fetch = require('node-fetch');
// Add dynamic import for fetch (node-fetch v3+ and Node.js v22+ CommonJS)
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Ensure logs directory exists
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const logFile = path.join(logsDir, 'log.jsonl');

// Helper function to log interactions
function logInteraction(prompt, response) {
    const logEntry = {
        timestamp: new Date().toISOString(),
        prompt: prompt,
        response: response
    };
    
    fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
}

// Stubbed response generator (for now)
function generateStubbedResponse(prompt) {
    const responses = [
        "This is a stubbed response to your prompt.",
        "Based on your input, here's a generated response.",
        "I understand you're asking about: " + prompt.substring(0, 50) + "...",
        "Here's what I think about your question.",
        "Generated response for your prompt."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
}

// POST /generate endpoint
app.post('/generate', async (req, res) => {
    try {
        const { prompt } = req.body;
        const streamMode = req.query.stream === 'true';
        // Validate input
        if (!prompt || typeof prompt !== 'string') {
            return res.status(400).json({
                error: 'Invalid input. "prompt" field is required and must be a string.'
            });
        }

        const ollamaUrl = 'http://localhost:11434/api/generate';
        const ollamaBody = {
            model: 'phi3',
            prompt: prompt,
            stream: streamMode
        };

        if (streamMode) {
            // Streaming mode: forward Ollama's stream to the client
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            let fullResponse = '';
            try {
                const ollamaRes = await fetch(ollamaUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(ollamaBody)
                });
                if (!ollamaRes.ok || !ollamaRes.body) {
                    throw new Error(`Ollama API error: ${ollamaRes.status}`);
                }
                ollamaRes.body.on('data', (chunk) => {
                    const lines = chunk.toString().split('\n');
                    lines.forEach(line => {
                        if (line.trim()) {
                            try {
                                const data = JSON.parse(line);
                                if (data.response) {
                                    res.write(data.response);
                                    fullResponse += data.response;
                                }
                                if (data.done) {
                                    res.end();
                                }
                            } catch (e) {
                                // Ignore parse errors for incomplete lines
                            }
                        }
                    });
                });
                ollamaRes.body.on('end', () => {
                    logInteraction(prompt, fullResponse);
                    if (!res.writableEnded) res.end();
                });
                ollamaRes.body.on('error', (err) => {
                    console.error('Stream error:', err);
                    if (!res.writableEnded) res.end();
                });
            } catch (ollamaErr) {
                console.error('Error calling Ollama (stream):', ollamaErr);
                res.write('[Error: Could not get response from local LLM]');
                res.end();
            }
            return;
        }

        // Non-streaming mode (default)
        let responseText = '';
        try {
            const ollamaRes = await fetch(ollamaUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ollamaBody)
            });
            if (!ollamaRes.ok) {
                throw new Error(`Ollama API error: ${ollamaRes.status}`);
            }
            const ollamaData = await ollamaRes.json();
            responseText = ollamaData.response || '[No response from LLM]';
        } catch (ollamaErr) {
            console.error('Error calling Ollama:', ollamaErr);
            responseText = '[Error: Could not get response from local LLM]';
        }
        logInteraction(prompt, responseText);
        res.json({ response: responseText });
    } catch (error) {
        console.error('Error in /generate endpoint:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'MiniVault API',
        version: '1.0.0',
        endpoints: {
            'POST /generate': 'Generate response from prompt',
            'GET /health': 'Health check'
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 MiniVault API running on http://localhost:${PORT}`);
    console.log(`📝 Logs will be written to: ${logFile}`);
}); 
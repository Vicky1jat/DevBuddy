// server/index.js
import express from 'express';
import cors from 'cors';
import { askGPT } from './controllers/devbuddyController.js';
import { runCode } from './controllers/judge0Controller.js';

const app = express();
app.use(cors()); // important for local dev
app.use(express.json());

// API route
app.post('/api/ask', askGPT);

app.post('/api/run-code', runCode);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 DevBuddy backend running on http://localhost:${PORT}`);
});

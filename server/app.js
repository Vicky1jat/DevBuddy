// server/index.js
import express from 'express';
import cors from 'cors';
import 'dotenv/config'; 

import router from './routes/index.js';

const app = express();
app.use(cors()); // important for local dev
app.use(express.json());

// API route
app.use('/api', router);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 DevBuddy backend running on http://localhost:${PORT}`);
});
app.get('/', (req, res) => {
  res.send('DevBuddy API is live 🚀');
});


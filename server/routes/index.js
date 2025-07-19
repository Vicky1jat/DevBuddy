import express from 'express';
import { askGPT } from '../controllers/devbuddyController.js';
import { runCode } from '../controllers/judge0Controller.js';
const router = express.Router();

router.post('/ask', askGPT);

router.post('/run-code', runCode);

export default router;

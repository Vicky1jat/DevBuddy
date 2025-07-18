import express from 'express';
import { askGPT } from '../controllers/devbuddyController.js';

const router = express.Router();
router.post('/ask', askGPT);

export default router;

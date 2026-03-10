import express from 'express';
import { chatWithBot } from '../controllers/chatbotController';
import { optionalAuth } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', optionalAuth as any, chatWithBot);

export default router;

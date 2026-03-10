import express from 'express';
import { getEvents, getEventById, createEvent } from '../controllers/eventController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').get(getEvents).post(protect, createEvent);
router.route('/:id').get(getEventById);

export default router;

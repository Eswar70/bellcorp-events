import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { registerForEvent, cancelRegistration, getMyRegistrations } from '../controllers/registrationController';

const router = express.Router();

router.route('/my').get(protect, getMyRegistrations);
router.route('/:eventId').post(protect, registerForEvent);
router.route('/:id').delete(protect, cancelRegistration);

export default router;

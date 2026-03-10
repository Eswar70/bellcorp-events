import { Request, Response } from 'express';
import Registration from '../models/Registration';
import Event from '../models/Event';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Register for an event
// @route   POST /api/registrations/:eventId
// @access  Private
export const registerForEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const eventId = req.params.eventId as string;
    const userId = req.user._id;

    const event = await Event.findById(eventId);

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    if (event.availableSeats <= 0) {
      res.status(400).json({ message: 'Event is fully booked' });
      return;
    }

    const registrationExists = await Registration.findOne({ user: userId, event: eventId as any });

    if (registrationExists) {
      res.status(400).json({ message: 'You are already registered for this event' });
      return;
    }

    const registration = await Registration.create({
      user: userId,
      event: eventId as any,
    });

    event.availableSeats -= 1;
    await event.save();

    res.status(201).json(registration);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Cancel an event registration
// @route   DELETE /api/registrations/:id
// @access  Private
export const cancelRegistration = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const registrationId = req.params.id;
    const registration = await Registration.findById(registrationId);

    if (!registration) {
      res.status(404).json({ message: 'Registration not found' });
      return;
    }

    if (registration.user.toString() !== req.user._id.toString()) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const event = await Event.findById(registration.event);

    await registration.deleteOne();

    if (event) {
      event.availableSeats += 1;
      await event.save();
    }

    res.json({ message: 'Registration cancelled' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user registrations (upcoming vs past)
// @route   GET /api/registrations/my
// @access  Private
export const getMyRegistrations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .populate('event')
      .sort({ registrationDate: -1 });

    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

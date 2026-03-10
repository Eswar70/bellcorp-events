import { Request, Response } from 'express';
import Event from '../models/Event';

// @desc    Fetch all events with pagination, search, and filtering
// @route   GET /api/events
// @access  Public
export const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;

    // Search query
    const keyword = req.query.keyword
      ? {
          $text: { $search: req.query.keyword as string },
        }
      : {};

    // Filter queries
    const filters: any = {};
    if (req.query.category) {
      filters.tags = { $in: [req.query.category] };
    }
    if (req.query.dateStr) {
      // simple exact date match or future dates
      const dateParam = new Date(req.query.dateStr as string);
      filters.date = { $gte: dateParam };
    }

    const query = { ...keyword, ...filters };

    const count = await Event.countDocuments(query);
    const events = await Event.find(query)
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ date: 1 }); // Sort by upcoming date ascending

    res.json({ events, page, pages: Math.ceil(count / pageSize), total: count });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Fetch single event
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);

    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create an event
// @route   POST /api/events
// @access  Private
export const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, organizer, location, date, description, capacity, tags } = req.body;

    const event = new Event({
      name,
      organizer,
      location,
      date,
      description,
      capacity,
      availableSeats: capacity, // initially full capacity
      tags,
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

import { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import Event from '../models/Event';
import Registration from '../models/Registration';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Chat with bot about events
// @route   POST /api/chatbot
// @access  Public
export const chatWithBot = async (req: Request, res: Response): Promise<void> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
    const { message } = req.body;

    if (!message) {
      res.status(400).json({ message: 'Please provide a message' });
      return;
    }

    // Fetch some upcoming events to give context to the bot
    const events = await Event.find({ availableSeats: { $gt: 0 } }).limit(10).select('name date location description');
    
    let eventContext = 'Here is a list of upcoming events:\n';
    events.forEach((ev) => {
      eventContext += `- ${ev.name} (ID: ${ev._id}) on ${new Date(ev.date).toDateString()} at ${ev.location}. Description: ${ev.description}\n`;
    });

    const authReq = req as AuthRequest;
    const isGuest = !authReq.user;

    const prompt = `You are a highly professional event management assistant for Bellcorp. Your goal is to assist users politely and concisely.

Context of upcoming events:
${eventContext}

User says: "${message}"

Respond directly to the user based ONLY on the context above. 
IMPORTANT CONSTRAINTS:
- Do NOT use any Markdown formatting whatsoever (no bolding, no asterisks, no bullet points).
- Respond in short, conversational, professional paragraphs seamlessly blending the event information into your normal text.
- If they ask for something not in the context, politely let them know you don't have that information right now.
- IF the user explicitly asks to book or register for a SPECIFIC event that is listed in the context:
  ${isGuest 
    ? "You MUST politely decline and tell them they need to log in or create an account before they can book tickets through you."
    : "You MUST append exactly this string at the very end of your response (nowhere else): [ACTION: BOOK, EVENT_ID: <the_id_here>]"
   }`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let reply = response.text || '';
    
    // Check for auto-book action
    const bookMatch = reply.match(/\[ACTION:\s*BOOK,\s*EVENT_ID:\s*([a-f\d]{24})\]/i);
    
    if (bookMatch) {
      const eventId = bookMatch[1];
      // Remove the action string from the user-facing reply
      reply = reply.replace(bookMatch[0], '').trim();
      
      if (!isGuest && authReq.user) {
        try {
          const event = await Event.findById(eventId);
          if (event && event.availableSeats > 0) {
            // Check if already registered
            const existingReg = await Registration.findOne({ user: authReq.user._id, event: eventId });
            if (existingReg) {
               reply += `\n\nIt looks like you are already registered for ${event.name}!`;
            } else {
               await Registration.create({ user: authReq.user._id, event: eventId });
               event.availableSeats -= 1;
               await event.save();
               reply += `\n\nGreat news! I have successfully booked your ticket for ${event.name}.`;
            }
          } else {
            reply += `\n\nI tried to book this event for you, but unfortunately, it is currently sold out.`;
          }
        } catch (err) {
          console.error('Auto-book error:', err);
          reply += `\n\nI tried to book this event for you, but encountered a system error. Please try registering manually on the event page.`;
        }
      }
    }

    res.json({ reply });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ message: 'Failed to communicate with chatbot service.' });
  }
};

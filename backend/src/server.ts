import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';

dotenv.config();

// Connect to database
connectDB();

const app: Application = express();

import authRoutes from './routes/authRoutes';
import eventRoutes from './routes/eventRoutes';
import registrationRoutes from './routes/registrationRoutes';
import chatbotRoutes from './routes/chatbotRoutes';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Trigger nodemon restart

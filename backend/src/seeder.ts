import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Event from './models/Event';
import connectDB from './config/db';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Event.deleteMany({});

    const sampleEvents = [
      {
        name: 'React Advanced Conference 2026',
        organizer: 'TechFronters',
        location: 'San Francisco, CA',
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        description: 'Join the top experts in the React ecosystem for 3 days of talks, workshops, and networking. Discover the latest in concurrent rendering, React Server Components, and more.',
        capacity: 500,
        availableSeats: 500,
        tags: ['Conference', 'React', 'Frontend'],
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000'
      },
      {
        name: 'Web3 & Blockchain Summit',
        organizer: 'Crypto Innovators',
        location: 'New York, NY',
        date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        description: 'Explore the infinite possibilities of decentralized web infrastructure. Perfect for developers, investors, and visionaries looking to shape the future of Web3.',
        capacity: 200,
        availableSeats: 5,
        tags: ['Conference', 'Blockchain', 'Web3'],
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1000'
      },
      {
        name: 'Startup Founders Mixer',
        organizer: 'Bellcorp Mixers',
        location: 'London, UK',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        description: 'An exclusive networking event for early-stage startup founders to meet investors, exchange ideas, and build valuable partnerships.',
        capacity: 100,
        availableSeats: 100,
        tags: ['Networking', 'Startup', 'Business'],
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000'
      },
      {
        name: 'GenAI Hackathon',
        organizer: 'Google Developers',
        location: 'Virtual',
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        description: 'Build the next revolutionary application using Google Gemini API. 48 hours of coding, coaching, and incredible prizes.',
        capacity: 1000,
        availableSeats: 0,
        tags: ['Hackathon', 'AI', 'Coding'],
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1000'
      },
      {
        name: 'Mastering Full-Stack TypeScript',
        organizer: 'CodeMasters',
        location: 'Austin, TX',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        description: 'An intensive 2-day workshop covering everything from setting up tsconfig to advanced generic types in React and Node.js.',
        capacity: 50,
        availableSeats: 0,
        tags: ['Workshop', 'TypeScript', 'Full-Stack'],
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1000'
      },
      {
        name: 'Global Design Leadership',
        organizer: 'Creative Heads',
        location: 'Paris, France',
        date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        description: 'A premium retreat for design leaders focusing on team building, scaling design systems, and creative direction.',
        capacity: 120,
        availableSeats: 80,
        tags: ['Design', 'Leadership', 'Conference'],
        image: 'https://images.unsplash.com/photo-1558403194-611308249627?auto=format&fit=crop&q=80&w=1000'
      },
      {
        name: 'Cybersecurity Strategies 2026',
        organizer: 'SecureNet',
        location: 'Washington, DC',
        date: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
        description: 'Learn the latest defense mechanisms against next-gen cyber threats from top industry experts and government officials.',
        capacity: 300,
        availableSeats: 250,
        tags: ['Security', 'Tech', 'Conference'],
        image: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?auto=format&fit=crop&q=80&w=1000'
      },
      {
        name: 'Product Management Masterclass',
        organizer: 'Product Growth',
        location: 'Virtual',
        date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
        description: 'A deep dive into product sense, execution, and strategy. Perfect for aspiring PMs or those looking to level up.',
        capacity: 500,
        availableSeats: 120,
        tags: ['Product', 'Workshop', 'Management'],
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1000'
      }
    ];

    await Event.insertMany(sampleEvents);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

importData();

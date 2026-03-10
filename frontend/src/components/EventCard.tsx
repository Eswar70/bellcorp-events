import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Tag, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

export interface EventData {
  _id: string;
  name: string;
  organizer: string;
  location: string;
  date: string;
  description: string;
  capacity: number;
  availableSeats: number;
  tags: string[];
  image?: string;
}

export const EventCard: React.FC<{ event: EventData; index: number }> = ({ event, index }) => {
  const dateObj = new Date(event.date);
  const month = dateObj.toLocaleString('en-US', { month: 'short' });
  const day = dateObj.getDate();
  const time = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const isFull = event.availableSeats <= 0;
  const isAlmostFull = event.availableSeats > 0 && event.availableSeats <= 5;
  const percentFilled = Math.round(((event.capacity - event.availableSeats) / event.capacity) * 100);

  const { user } = useAuth();
  
  const { data: registrations } = useQuery<{ event: { _id: string } }[]>({
    queryKey: ['my-registrations'],
    queryFn: async () => {
      const config = { headers: { Authorization: `Bearer ${user?.token}` } };
      const { data } = await axios.get('https://bellcorp-backend.vercel.app/api/registrations/my', config);
      return data;
    },
    enabled: !!user,
  });

  const isBooked = registrations?.some(reg => reg.event._id === event._id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="group relative bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
    >
      <Link to={`/events/${event._id}`} className="absolute inset-0 z-10">
        <span className="sr-only">View {event.name} details</span>
      </Link>

      <div className="h-48 relative bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
        {event.image ? (
          <img src={event.image} alt={event.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-400/20 to-indigo-500/20 mix-blend-multiply group-hover:scale-105 transition-transform duration-700"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
        
        {/* Date Badge */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 text-center shadow-sm">
          <div className="text-xs font-bold text-brand-600 uppercase">{month}</div>
          <div className="text-xl font-display font-bold text-slate-900 leading-none">{day}</div>
        </div>

        {/* Status Badge */}
        <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
          {event.tags && event.tags[0] && (
            <div className="bg-slate-900/70 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-lg flex items-center">
              <Tag className="w-3 h-3 mr-1" />
              {event.tags[0]}
            </div>
          )}
          {isFull ? (
             <div className="bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-lg">
               Sold Out
             </div>
          ) : isAlmostFull ? (
             <div className="bg-orange-500/90 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-lg">
               Only {event.availableSeats} left
             </div>
          ) : null}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-display font-bold text-slate-900 mb-2 group-hover:text-brand-600 transition-colors line-clamp-1">
          {event.name}
        </h3>
        
        <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-grow">
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-slate-600">
            <Calendar className="w-4 h-4 mr-2 text-brand-500 flex-shrink-0" />
            <span className="truncate">{time}</span>
          </div>
          <div className="flex items-center text-sm text-slate-600">
            <MapPin className="w-4 h-4 mr-2 text-brand-500 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center text-sm text-slate-600">
            <Users className="w-4 h-4 mr-2 text-brand-500 flex-shrink-0" />
            <span className="truncate">{event.capacity - event.availableSeats} / {event.capacity} Attendees</span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1.5">
            <span>{percentFilled}% Filled</span>
            <span>{event.capacity - event.availableSeats} / {event.capacity}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div 
              className={clsx("h-2 rounded-full transition-all duration-500", 
                percentFilled > 90 ? "bg-red-500" : percentFilled > 75 ? "bg-orange-500" : "bg-brand-500"
              )} 
              style={{ width: `${percentFilled}%` }}
            ></div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">By {event.organizer}</span>
          <span className={clsx(
            "text-sm font-semibold flex items-center",
            isBooked ? "text-green-600" : isFull ? "text-slate-400" : "text-brand-600 group-hover:translate-x-1 transition-transform"
          )}>
            {isBooked ? <><CheckCircle2 className="w-4 h-4 mr-1"/> Booked</> : isFull ? 'Waitlist' : 'Get Tickets \u2192'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;

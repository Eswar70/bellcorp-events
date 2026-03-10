import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Calendar, MapPin, Users, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { type EventData } from '../components/EventCard';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [registerError, setRegisterError] = useState('');

  const { data: event, isLoading, isError } = useQuery<EventData>({
    queryKey: ['event', id],
    queryFn: async () => {
      const { data } = await axios.get(`http://localhost:5000/api/events/${id}`);
      return data;
    },
  });

  const registerMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Must be logged in');
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.post(`http://localhost:5000/api/registrations/${id}`, {}, config);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', id] });
      queryClient.invalidateQueries({ queryKey: ['my-registrations'] });
      // Redirect or show success
      navigate('/dashboard');
    },
    onError: (error: any) => {
      setRegisterError(error.response?.data?.message || 'Registration failed');
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-32 mb-6"></div>
          
          <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100">
            <div className="h-64 sm:h-80 bg-slate-200"></div>
            <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="md:col-span-2 space-y-4">
                <div className="h-8 bg-slate-200 rounded w-1/3 mb-6"></div>
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                <div className="h-4 bg-slate-200 rounded w-4/6 mt-6"></div>
                <div className="h-4 bg-slate-200 rounded w-full"></div>
              </div>
              <div className="md:col-span-1">
                 <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-6">
                    <div className="flex items-center gap-4"><div className="w-10 h-10 bg-slate-200 rounded-xl"></div><div className="h-4 w-24 bg-slate-200 rounded"></div></div>
                    <div className="flex items-center gap-4"><div className="w-10 h-10 bg-slate-200 rounded-xl"></div><div className="h-4 w-24 bg-slate-200 rounded"></div></div>
                    <div className="flex items-center gap-4"><div className="w-10 h-10 bg-slate-200 rounded-xl"></div><div className="h-4 w-24 bg-slate-200 rounded"></div></div>
                    <div className="h-14 bg-slate-200 rounded-xl w-full mt-4"></div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 bg-slate-50 dark:bg-dark-900 transition-colors text-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Event not found</h2>
        <Link to="/" className="text-brand-600 dark:text-brand-400 mt-4 inline-block hover:underline">Back to exploring</Link>
      </div>
    );
  }

  const dateObj = new Date(event.date);
  const fullDate = dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const time = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const isFull = event.availableSeats <= 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-900 pt-24 pb-20 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center text-slate-500 dark:text-slate-400 font-medium hover:text-brand-600 dark:hover:text-brand-400 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Events
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white dark:bg-dark-800 rounded-3xl overflow-hidden shadow-xl border border-slate-100 dark:border-dark-700 transition-colors"
        >
          {/* Header Image Area */}
          <div className="h-64 sm:h-96 bg-slate-900 relative group overflow-hidden">
            {event.image && (
              <img src={event.image} alt={event.name} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000" />
            )}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-600/40 to-indigo-900/40 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 dark:from-dark-900 via-slate-900/60 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <div className="flex flex-wrap gap-2 mb-4">
                {event.tags?.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-medium border border-white/10">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-2 leading-tight">
                {event.name}
              </h1>
              <p className="text-slate-300 font-medium text-lg">Organized by {event.organizer}</p>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-10">
            
            {/* Main Info */}
            <div className="md:col-span-2 space-y-8">
              <section>
                <motion.h3 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl font-display font-bold text-slate-900 dark:text-white mb-4"
                >
                   About This Event
                </motion.h3>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="prose prose-slate dark:prose-invert prose-lg max-w-none text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line text-base"
                >
                  {event.description}
                </motion.div>
              </section>
            </div>

            {/* Sticky Sidebar */}
            <div className="md:col-span-1">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-slate-50 dark:bg-dark-900/50 rounded-2xl p-6 border border-slate-100 dark:border-dark-700 sticky top-24 shadow-sm transition-colors"
              >
                
                <div className="space-y-6 mb-8">
                  <div className="flex items-start">
                    <div className="bg-white dark:bg-dark-800 p-2 rounded-xl shadow-sm mr-4 text-brand-600 dark:text-brand-400 border border-slate-100 dark:border-dark-700">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{fullDate}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{time}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-white dark:bg-dark-800 p-2 rounded-xl shadow-sm mr-4 text-brand-600 dark:text-brand-400 border border-slate-100 dark:border-dark-700">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Location</p>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{event.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-white dark:bg-dark-800 p-2 rounded-xl shadow-sm mr-4 text-brand-600 dark:text-brand-400 border border-slate-100 dark:border-dark-700">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Availability</p>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                        {event.availableSeats} of {event.capacity} seats remaining
                      </p>
                    </div>
                  </div>
                </div>

                {registerError && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm flex items-start">
                    <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    {registerError}
                  </div>
                )}

                {!user ? (
                  <Link
                    to="/login"
                    className="w-full block text-center py-4 bg-slate-900 dark:bg-brand-600 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 dark:hover:bg-brand-700 transition-colors"
                  >
                    Log in to Register
                  </Link>
                ) : isFull ? (
                  <button
                    disabled
                    className="w-full py-4 bg-slate-200 text-slate-500 font-bold rounded-xl cursor-not-allowed"
                  >
                    Event is Full
                  </button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => registerMutation.mutate()}
                    disabled={registerMutation.isPending}
                    className="w-full py-4 bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:from-brand-500 hover:to-indigo-500 transition-all focus:ring-4 focus:ring-brand-200 dark:focus:ring-brand-900/30 flex items-center justify-center relative overflow-hidden group"
                  >
                    {/* Button hover flare animation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] xl:group-hover:translate-x-[150%] transition-transform duration-700 skew-x-12"></div>
                    
                    {registerMutation.isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2 relative z-10" />
                        <span className="relative z-10">Secure Your Spot</span>
                      </>
                    )}
                  </motion.button>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EventDetail;

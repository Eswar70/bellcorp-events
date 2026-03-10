import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { type EventData } from '../components/EventCard';
import { Calendar, MapPin, XCircle, Clock, CheckCircle2, Loader2, RefreshCw, QrCode } from 'lucide-react';

interface Registration {
  _id: string;
  event: EventData;
  registrationDate: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const { data: registrations, isLoading, isError, refetch } = useQuery<Registration[]>({
    queryKey: ['my-registrations'],
    queryFn: async () => {
      const config = { headers: { Authorization: `Bearer ${user?.token}` } };
      const { data } = await axios.get('http://localhost:5000/api/registrations/my', config);
      return data;
    },
    enabled: !!user,
  });

  const cancelMutation = useMutation({
    mutationFn: async (registrationId: string) => {
      const config = { headers: { Authorization: `Bearer ${user?.token}` } };
      await axios.delete(`http://localhost:5000/api/registrations/${registrationId}`, config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-registrations'] });
    },
  });

  const handleCancel = (id: string, eventName: string) => {
    if (window.confirm(`Are you sure you want to cancel your registration for ${eventName}?`)) {
      cancelMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-dark-900 pt-24 pb-20 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
          <div className="mb-10">
            <div className="h-10 bg-slate-200 rounded-xl w-64 mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-96"></div>
          </div>
          <div className="flex space-x-2 mb-8 bg-slate-200/50 p-1 rounded-2xl w-fit">
             <div className="h-10 w-36 bg-slate-200 rounded-xl"></div>
             <div className="h-10 w-36 bg-slate-200 rounded-xl"></div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex gap-6 items-center">
                <div className="h-24 w-24 bg-slate-200 rounded-xl hidden md:block"></div>
                <div className="flex-grow space-y-3">
                  <div className="h-4 w-20 bg-slate-200 rounded mb-2"></div>
                  <div className="h-6 w-3/4 bg-slate-200 rounded"></div>
                  <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
                </div>
                <div className="h-10 w-32 bg-slate-200 rounded-xl"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col justify-center items-center bg-slate-50 dark:bg-dark-900 transition-colors">
        <p className="text-red-500 dark:text-red-400 mb-4">Failed to load registrations. Please try again.</p>
        <button onClick={() => refetch()} className="px-4 py-2 bg-slate-200 rounded-lg flex items-center">
          <RefreshCw className="w-4 h-4 mr-2" /> Retry
        </button>
      </div>
    );
  }

  const now = new Date();
  
  const upcomingEvents = registrations?.filter(reg => new Date(reg.event.date) >= now) || [];
  const pastEvents = registrations?.filter(reg => new Date(reg.event.date) < now) || [];

  const displayEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-900 pt-24 pb-20 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10">
          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">My Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your event registrations and history</p>
        </div>

        {/* Custom Tabs */}
        <div className="flex space-x-1 mb-8 bg-slate-200/50 dark:bg-dark-800 p-1 rounded-2xl w-fit transition-colors">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'upcoming' 
                ? 'bg-white dark:bg-dark-700 text-slate-900 dark:text-white shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Upcoming Events <span className="ml-2 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 px-2 py-0.5 rounded-full text-xs">{upcomingEvents.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'past' 
                ? 'bg-white dark:bg-dark-700 text-slate-900 dark:text-white shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Past Events <span className="ml-2 bg-slate-200 dark:bg-dark-600 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full text-xs">{pastEvents.length}</span>
          </button>
        </div>

        {displayEvents.length === 0 ? (
          <div className="bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 border-dashed rounded-3xl p-12 text-center transition-colors">
            <div className="w-16 h-16 bg-slate-50 dark:bg-dark-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              No {activeTab} registrations
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              You haven't registered for any events {activeTab === 'past' ? 'in the past' : 'yet'}.
            </p>
            {activeTab === 'upcoming' && (
              <Link
                to="/"
                className="inline-flex items-center px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-colors"
              >
                Browse Events
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {displayEvents.map((reg) => {
              const dateObj = new Date(reg.event.date);
              const isPast = dateObj < now;
              
              return (
                <div key={reg._id} className="bg-white dark:bg-dark-800 rounded-3xl shadow-sm border border-slate-200 dark:border-dark-700 flex flex-col md:flex-row relative overflow-hidden group hover:shadow-xl transition-shadow">
                  {/* Decorative side accent */}
                  <div className={`absolute left-0 top-0 bottom-0 w-2 ${isPast ? 'bg-slate-300 dark:bg-slate-600' : 'bg-brand-500'}`}></div>
                  
                  {/* Ticket Left Section: Event Info */}
                  <div className="flex-grow p-6 md:p-8 relative">
                    {/* Background Graphic */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-full blur-3xl opacity-50 dark:opacity-5 pointer-events-none -mt-10 -mr-10"></div>
                    
                    <div className="flex items-center gap-3 mb-4">
                      {isPast ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          ATTENDED
                        </span>
                       ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 uppercase tracking-widest">
                          <Clock className="w-3.5 h-3.5 mr-1" />
                          Active Ticket
                        </span>
                      )}
                      {reg.event.tags?.[0] && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400 border border-brand-100 dark:border-brand-800 uppercase tracking-widest">
                          {reg.event.tags[0]}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-2xl font-display font-black text-slate-900 dark:text-white mb-4 line-clamp-2 leading-tight">
                      {reg.event.name}
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold mb-1">Date & Time</p>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                           {dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold mb-1">Location</p>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center">
                          <MapPin className="w-3.5 h-3.5 mr-1 text-brand-500 shrink-0" />
                          <span className="truncate">{reg.event.location}</span>
                        </p>
                      </div>
                    </div>

                    {/* Capacity Progress Bar */}
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-dark-700">
                       <div className="flex justify-between text-xs font-semibold mb-2">
                         <span className="text-slate-500 uppercase tracking-wider">Event Capacity</span>
                         <span className={reg.event.availableSeats <= 10 ? 'text-orange-500' : 'text-brand-600 dark:text-brand-400'}>
                            {reg.event.capacity - reg.event.availableSeats} / {reg.event.capacity} Filled
                         </span>
                       </div>
                       <div className="h-2 w-full bg-slate-100 dark:bg-dark-700 rounded-full overflow-hidden">
                         <div 
                           className={`h-full rounded-full transition-all duration-1000 ${reg.event.availableSeats <= 10 ? 'bg-orange-500' : 'bg-brand-500'}`}
                           style={{ width: `${Math.min(100, Math.max(0, ((reg.event.capacity - reg.event.availableSeats) / reg.event.capacity) * 100))}%` }}
                         ></div>
                       </div>
                    </div>
                  </div>

                  {/* Ticket Divider (Perforated Edge) */}
                  <div className="hidden md:flex flex-col items-center justify-center relative w-8">
                     <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0 border-l-2 border-dashed border-slate-200 dark:border-dark-600"></div>
                     <div className="absolute -top-4 w-8 h-8 rounded-full bg-slate-50 dark:bg-dark-900"></div>
                     <div className="absolute -bottom-4 w-8 h-8 rounded-full bg-slate-50 dark:bg-dark-900"></div>
                  </div>

                  {/* Ticket Right Section: QR / Barcode & Actions */}
                  <div className="md:w-64 bg-slate-50 dark:bg-dark-800/50 p-6 md:p-8 flex flex-col justify-between items-center border-t md:border-t-0 md:border-l border-slate-100 dark:border-dark-700 border-dashed md:border-solid">
                    <div className="text-center w-full">
                      <p className="text-[10px] font-bold tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2">ADMIT ONE</p>
                      <div className="bg-white dark:bg-white/90 p-3 rounded-xl shadow-sm inline-block mx-auto mb-3">
                         <QrCode className="w-20 h-20 text-slate-800" />
                      </div>
                      <p className="text-[8px] tracking-[0.3em] font-mono text-slate-400 dark:text-slate-500">ID: {reg._id.slice(-8).toUpperCase()}</p>
                    </div>

                    <div className="w-full space-y-2 mt-6">
                      <Link
                        to={`/events/${reg.event._id}`}
                        className="block w-full text-center px-4 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-brand-600 dark:hover:bg-brand-700 text-white font-bold rounded-xl transition-colors text-sm"
                      >
                        View Details
                      </Link>
                      {!isPast && (
                        <button
                          onClick={() => handleCancel(reg._id, reg.event.name)}
                          disabled={cancelMutation.isPending}
                          className="w-full text-center px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 font-bold rounded-xl transition-colors flex items-center justify-center text-xs tracking-wider"
                        >
                          {cancelMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <XCircle className="w-3.5 h-3.5 mr-1" />}
                          CANCEL TICKET
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

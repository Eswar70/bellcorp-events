import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Search, Calendar, CheckCircle2, Star, MessageCircleQuestion } from 'lucide-react';
import { EventCard, type EventData } from '../components/EventCard';

interface EventsResponse {
  events: EventData[];
  page: number;
  pages: number;
  total: number;
}

const Home: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  const fetchEvents = async (pageParam = 1, search = '', filterCategory = '') => {
    let url = `http://localhost:5000/api/events?pageNumber=${pageParam}`;
    if (search) url += `&keyword=${search}`;
    if (filterCategory) url += `&category=${filterCategory}`;
    const { data } = await axios.get<EventsResponse>(url);
    return data;
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['events', page, searchQuery, category],
    queryFn: () => fetchEvents(page, searchQuery, category),
    staleTime: 50000,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(keyword);
    setPage(1);
  };

  useEffect(() => {
    if (keyword === '') {
      setSearchQuery('');
      setPage(1);
    }
  }, [keyword]);

  const categories = ['Conference', 'Workshop', 'Networking', 'Social', 'Hackathon'];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-900 pb-20 transition-colors">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-600/20 to-indigo-600/20 mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 text-white">Discover Exceptional Events</h1>
          <p className="text-lg md:text-xl text-slate-300 dark:text-slate-200 max-w-2xl mx-auto mb-10">
            Find and register for the most exciting conferences, workshops, and networking events around the world.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-2">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search for events, organizers, or locations..."
                className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-dark-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xl text-lg transition-colors border border-transparent dark:border-dark-700"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-2xl transition-colors shadow-lg text-lg flex items-center justify-center whitespace-nowrap"
            >
              Find Events
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white transition-colors">
            {searchQuery ? `Search results for "${searchQuery}"` : 'Upcoming Events'}
          </h2>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto hidescrollbar">
            <button
              onClick={() => { setCategory(''); setPage(1); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${category === '' ? 'bg-slate-900 dark:bg-brand-600 text-white' : 'bg-white dark:bg-dark-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-dark-700 hover:bg-slate-50 dark:hover:bg-dark-700'}`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => { setCategory(c); setPage(1); }}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${category === c ? 'bg-slate-900 dark:bg-brand-600 text-white' : 'bg-white dark:bg-dark-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-dark-700 hover:bg-slate-50 dark:hover:bg-dark-700'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col h-full animate-pulse min-h-[400px]">
                <div className="bg-slate-200 h-48 rounded-xl mb-4 w-full"></div>
                <div className="flex-grow flex flex-col gap-3">
                  <div className="bg-slate-200 h-6 w-3/4 rounded-md"></div>
                  <div className="bg-slate-200 h-4 w-full rounded-md mt-2"></div>
                  <div className="bg-slate-200 h-4 w-5/6 rounded-md"></div>
                  <div className="mt-8 space-y-2">
                    <div className="bg-slate-200 h-4 w-1/2 rounded-md"></div>
                    <div className="bg-slate-200 h-4 w-2/3 rounded-md"></div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between">
                  <div className="bg-slate-200 h-4 w-1/4 rounded-md"></div>
                  <div className="bg-slate-200 h-4 w-1/5 rounded-md"></div>
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-2xl text-center border border-red-100 dark:border-red-900/30">
            <p className="font-semibold">Oops! Something went wrong.</p>
            <p className="text-sm mt-1">{(error as any)?.message || 'Failed to load events.'}</p>
          </div>
        ) : data?.events.length === 0 ? (
          <div className="bg-white dark:bg-dark-800 border border-slate-100 dark:border-dark-700 rounded-3xl p-12 text-center shadow-sm transition-colors">
            <div className="w-20 h-20 bg-slate-50 dark:bg-dark-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No events found</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">We couldn't find any events matching your current search and filter criteria. Try adjusting them to see more results.</p>
            <button
              onClick={() => { setKeyword(''); setSearchQuery(''); setCategory(''); setPage(1); }}
              className="mt-6 px-6 py-2 bg-slate-100 dark:bg-dark-700 hover:bg-slate-200 dark:hover:bg-dark-600 text-slate-700 dark:text-slate-200 font-semibold rounded-xl transition-colors"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
            {data?.events.map((event, index) => (
              <EventCard key={event._id} event={event} index={index} />
            ))}
          </div>
        )}

        {/* Pagination placeholder if pages > 1 */}
        {data && data.pages > 1 && (
          <div className="mt-12 flex justify-center space-x-2">
            {[...Array(data.pages).keys()].map((p) => (
              <button
                key={p + 1}
                onClick={() => setPage(p + 1)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-medium transition-colors ${page === p + 1 ? 'bg-brand-500 text-white shadow-md' : 'bg-white dark:bg-dark-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-dark-700 hover:bg-slate-50 dark:hover:bg-dark-700'}`}
              >
                {p + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* About Us / Why Choose Us Section */}
      <div className="bg-white dark:bg-dark-900 py-24 mt-20 border-t border-slate-100 dark:border-dark-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white mb-4">Why Choose Bellcorp Events?</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400">We are the premier platform for discovering and managing transformative professional experiences globally.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: 'Curated Excellence', desc: 'Every event gets thoroughly vetted by our team to guarantee world-class networking and learning.' },
              { title: 'Seamless Booking', desc: 'Book your spot in seconds. With our conversational AI, you can even register hands-free.' },
              { title: 'Global Community', desc: 'Join thousands of professionals growing their networks and careers through our events.' }
            ].map((feature, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-dark-800 rounded-3xl p-8 hover:shadow-lg transition-shadow border border-slate-100 dark:border-dark-700">
                <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-2xl flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-slate-900 py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-600/10 to-indigo-600/10 mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Loved by Professionals</h2>
            <p className="text-slate-400 text-lg">See what our attendees have to say.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Sarah J.', role: 'Product Manager', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', quote: 'Bellcorp Events transformed how I network. The AI booking feature is pure magic!' },
              { name: 'Michael T.', role: 'Software Engineer', image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150', quote: 'I found the exact React conference I was looking for. The interface is incredibly smooth.' },
              { name: 'Elena R.', role: 'Startup Founder', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150', quote: 'Such a premium experience. The event reminders and dashboard keep my busy schedule organized.' }
            ].map((review, i) => (
              <div key={i} className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-3xl border border-slate-700">
                <div className="flex text-yellow-500 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="italic text-slate-300 mb-6 font-light">"{review.quote}"</p>
                <div className="flex items-center">
                  <img src={review.image} alt={review.name} className="w-12 h-12 object-cover rounded-full mr-4 border-2 border-slate-700" />
                  <div>
                    <h4 className="font-bold text-sm bg-clip-text text-transparent bg-gradient-to-r from-brand-300 to-indigo-300">{review.name}</h4>
                    <p className="text-xs text-slate-400">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="py-24 bg-slate-50 dark:bg-dark-900 transition-colors">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg">Everything you need to know about using the platform.</p>
          </div>
          
          <div className="space-y-6">
            {[
              { q: 'How do I register for an event?', a: 'You can simply click "Get Tickets" on any event card, or use the microphone to tell our AI Assistant to book it for you.' },
              { q: 'Is there a limit to how many events I can attend?', a: 'No limits! As long as there are available seats, you can register for as many events as your schedule allows.' },
              { q: 'How do I cancel my registration?', a: 'Navigate to your Dashboard, find the event under "Upcoming Events," and click the cancel button. Your seat will be given to someone on the waitlist.' }
            ].map((faq, i) => (
              <div key={i} className="bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-dark-700 flex gap-4 items-start transition-colors">
                <div className="bg-brand-50 dark:bg-brand-900/30 text-brand-500 dark:text-brand-400 p-2 rounded-xl mt-1">
                  <MessageCircleQuestion className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2">{faq.q}</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

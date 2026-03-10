import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User as UserIcon, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-brand-100 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 p-4 transition-colors relative overflow-hidden">
      {/* Background Animated Orbs */}
      <motion.div 
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }} 
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 right-1/4 w-96 h-96 bg-brand-400/30 dark:bg-brand-600/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div 
        animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.5, 0.3] }} 
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-indigo-400/30 dark:bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass dark:glass-dark rounded-3xl p-8 relative overflow-hidden shadow-2xl transition-colors">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-400 via-indigo-400 to-brand-600"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 dark:bg-dark-800 text-white shadow-lg mb-4 border border-slate-800 dark:border-dark-700">
                <Sparkles className="w-8 h-8 text-brand-300 dark:text-brand-400" />
              </div>
              <h2 className="text-3xl font-display font-bold text-dark-900 dark:text-white">Create Account</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Join Bellcorp to register for exclusive events</p>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 mb-6 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-xl text-center">
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-dark-700 rounded-xl bg-white/60 dark:bg-dark-900/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-dark-900 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 focus:border-transparent transition duration-200"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-dark-700 rounded-xl bg-white/60 dark:bg-dark-900/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-dark-900 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 focus:border-transparent transition duration-200"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-dark-700 rounded-xl bg-white/60 dark:bg-dark-900/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-dark-900 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 focus:border-transparent transition duration-200"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-slate-900 dark:bg-brand-600 hover:bg-slate-800 dark:hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 dark:focus:ring-brand-500 dark:focus:ring-offset-dark-900 transform transition-all"
              >
                {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Sign Up'}
              </motion.button>
            </form>

            <div className="mt-8 text-center text-sm">
              <span className="text-slate-500 dark:text-slate-400">Already have an account? </span>
              <Link to="/login" className="font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-500 dark:hover:text-brand-300 transition-colors">
                Log In
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;

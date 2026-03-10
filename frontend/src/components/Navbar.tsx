import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Menu, X, User, LogOut, Ticket, Sparkles, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 w-full glass z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-slate-900">Bellcorp<span className="text-brand-600">Events</span></span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium text-slate-2000 hover:text-brand-600 transition-colors">Explore</Link>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-600 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <div className="flex items-center space-x-6">
                <Link to="/dashboard" className="flex items-center space-x-1 text-sm font-medium text-slate-2000 hover:text-brand-600 transition-colors">
                  <Ticket className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <div className="h-4 w-px bg-slate-200"></div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-semibold text-slate-900">{user.name}</span>
                  <button onClick={handleLogout} className="text-slate-800 hover:text-red-500 transition-colors">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">Log In</Link>
                <Link to="/register" className="text-sm font-medium bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors shadow-sm">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-300 hover:text-brand-600 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-600 dark:text-slate-300 hover:text-brand-600 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 dark:bg-dark-900/95 backdrop-blur-lg border-t border-slate-100 dark:border-dark-800 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl text-base font-medium light:text-slate-800 dark:text-slate-2000 hover:bg-brand-50 hover:text-brand-600">Explore Events</Link>

              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl text-base font-medium light:text-slate-800 dark:text-slate-2000 hover:bg-brand-50 hover:text-brand-600">My Dashboard</Link>
                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center px-3 py-2">
                      <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold mr-3">
                        {user.name.charAt(0)}
                      </div>
                      <div className="text-base font-medium text-slate-800 dark:text-white">{user.name}</div>
                    </div>
                    <button onClick={handleLogout} className="mt-2 w-full text-left px-3 py-2 rounded-xl text-base font-medium text-red-600 hover:bg-red-50">Log Out</button>
                  </div>
                </>
              ) : (
                <div className="pt-4 border-t border-slate-100 flex flex-col space-y-3">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center px-4 py-3 border border-slate-200 rounded-xl text-base font-medium text-slate-700 bg-white hover:bg-slate-50">Log In</Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center px-4 py-3 rounded-xl text-base font-medium text-white bg-slate-900 hover:bg-slate-800">Sign Up</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;

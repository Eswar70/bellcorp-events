import React from 'react';
import { Sparkles, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-white mb-6">
              <Sparkles className="w-8 h-8 text-brand-500" />
              <span className="text-2xl font-display font-bold">Bellcorp Events</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Elevating event experiences globally. We connect ambitious professionals with transformative conferences, workshops, and exclusive networking moments.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Explore</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-brand-400 transition-colors flex items-center">About Us</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors flex items-center">Upcoming Events</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors flex items-center">Speakers Directory</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors flex items-center">Pricing Plans</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors flex items-center">Blog & News</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Support</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-brand-400 transition-colors flex items-center">Help Center</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors flex items-center">Terms of Service</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors flex items-center">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors flex items-center">Event Guidelines</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors flex items-center">Accessibility</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 text-brand-500 flex-shrink-0 mt-0.5" />
                <span>1200 Innovation Drive<br />Suite 400<br />San Francisco, CA 94103</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-brand-500 flex-shrink-0" />
                <span>+1 (800) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-brand-500 flex-shrink-0" />
                <span>support@bellcorpevents.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Bellcorp Event Management. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-slate-300">Terms</a>
            <a href="#" className="hover:text-slate-300">Privacy</a>
            <a href="#" className="hover:text-slate-300">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

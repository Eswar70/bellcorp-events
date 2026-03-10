import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

// Add TypeScript declaration for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface Message {
  id: string;
  text: string;
  isBot: boolean;
}

const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hi there! I am your Event Assistant. Ask me about upcoming events or for recommendations!', isBot: true }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { user } = useAuth();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition. Please use Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      setInputValue(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    
    // Add user message
    const newMsg: Message = { id: Date.now().toString(), text: userMessage, isBot: false };
    setMessages(prev => [...prev, newMsg]);
    setIsLoading(true);

    try {
      const config = user ? { headers: { Authorization: `Bearer ${user.token}` } } : {};
      const { data } = await axios.post('https://bellcorp-backend.vercel.app/api/chatbot', { message: userMessage }, config);
      
      const botMsg: Message = { id: (Date.now() + 1).toString(), text: data.reply, isBot: true };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
       const errorMsg: Message = { id: (Date.now() + 1).toString(), text: "Sorry, I'm having trouble connecting right now. Please try again later.", isBot: true };
       setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:bottom-6 sm:right-6 sm:left-auto z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden w-[calc(100vw-3rem)] sm:w-[350px] flex flex-col"
            style={{ height: 'calc(100vh - 120px)', maxHeight: '600px' }}
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-brand-600 to-indigo-600 p-4 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-brand-200" />
                <h3 className="font-bold font-display">Event Assistant</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                  <div 
                    className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${
                      msg.isBot 
                        ? 'bg-white text-slate-800 border border-slate-100 rounded-tl-none' 
                        : 'bg-brand-600 text-white rounded-tr-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-100 rounded-2xl p-3 rounded-tl-none flex space-x-2 shadow-sm">
                     <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce"></span>
                     <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                     <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={isListening ? "Listening..." : "Ask me anything..."}
                className="flex-1 bg-slate-50 text-slate-900 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                disabled={isLoading}
              />
              <div className="flex shrink-0">
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`ml-1 p-2 rounded-xl transition-colors ${
                    isListening ? 'text-red-500 bg-red-50 animate-pulse' : 'text-slate-400 hover:text-brand-500 hover:bg-slate-50'
                  }`}
                  title="Speak to the assistant"
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className={`ml-1 p-2 rounded-xl transition-colors ${
                    inputValue.trim() && !isLoading
                      ? 'bg-brand-600 text-white hover:bg-brand-700' 
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all transform hover:scale-105 ${
          isOpen ? 'bg-slate-800 text-white' : 'bg-gradient-to-tr from-brand-600 to-indigo-600 text-white'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </div>
  );
};

export default ChatbotWidget;

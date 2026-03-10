import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatbotWidget from './components/ChatbotWidget';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import EventDetail from './pages/EventDetail';
import Dashboard from './pages/Dashboard';
import CustomCursor from './components/CustomCursor';

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <CustomCursor />
          <div className="min-h-screen flex flex-col pt-16 bg-slate-50 dark:bg-dark-900 transition-colors">
            <Navbar />
            
            <main className="flex-grow bg-slate-50 dark:bg-dark-900 transition-colors">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/events/:id" element={<EventDetail />} />
                
                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                </Route>
                
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            
            <Footer />
            <ChatbotWidget />
          </div>
        </Router>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;

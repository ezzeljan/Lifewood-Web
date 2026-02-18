import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './pages/Hero';
import AiInitiatives from './pages/AiInitiatives';
import OurCompany from './pages/OurCompany';
import Philanthropy from './pages/Philanthropy';
import Careers from './pages/Careers';
import Contact from './pages/Contact';
import './styles/global.css';
import './App.css';

// Page Transition Component
function PageTransition({ children }) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PageTransition><Hero /></PageTransition>} />
      <Route path="/ai-initiatives" element={<PageTransition><AiInitiatives /></PageTransition>} />
      <Route path="/company" element={<PageTransition><OurCompany /></PageTransition>} />
      <Route path="/philanthropy" element={<PageTransition><Philanthropy /></PageTransition>} />
      <Route path="/careers" element={<PageTransition><Careers /></PageTransition>} />
      <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <Navigation />
      <AppRoutes />
    </Router>
  );
}

import { Link } from 'react-router-dom';
import './Footer.css';
import logo from '../assets/logo.png';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'About Us', path: '/about' },
      { label: 'Careers', path: '/careers' },
      { label: 'Offices', path: '/offices' },
    ],
    initiatives: [
      { label: 'AI Services', path: '/ai-services' },
      { label: 'AI Projects', path: '/ai-projects' },
      { label: 'Philanthropy', path: '/philanthropy' },
    ],
    contact: [
      { label: 'Get In Touch', path: '/contact' },
      { label: 'Support', path: '/contact' },
    ],
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Logo and Brand */}
          <div className="footer-section footer-brand">
            <Link to="/" className="footer-logo">
              <img src={logo} alt="Lifewood" className="footer-logo-img" />
              <span className="footer-logo-text">Lifewood</span>
            </Link>
            <p className="footer-tagline">
              Empowering companies with transformative AI solutions.
            </p>
          </div>

          {/* Company Links */}
          <div className="footer-section">
            <h4 className="footer-section-title">Company</h4>
            <ul className="footer-links">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link to={link.path}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Initiatives Links */}
          <div className="footer-section">
            <h4 className="footer-section-title">AI Initiatives</h4>
            <ul className="footer-links">
              {footerLinks.initiatives.map((link) => (
                <li key={link.path}>
                  <Link to={link.path}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Links */}
          <div className="footer-section">
            <h4 className="footer-section-title">Contact</h4>
            <ul className="footer-links">
              {footerLinks.contact.map((link) => (
                <li key={link.path}>
                  <Link to={link.path}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {currentYear} Lifewood. All rights reserved.
          </p>
          <div className="footer-legal">
            <Link to="/privacy">Privacy Policy</Link>
            <span className="separator">•</span>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

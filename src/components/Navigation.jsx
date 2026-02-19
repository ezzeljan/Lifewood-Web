import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import './Navigation.css';
import logo from '../assets/logo.png';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const menuRef = useRef(null);

  const navLinks = [
    { path: '/', label: 'Home' },
    {
      path: '/ai-initiatives',
      label: 'AI Initiatives',
      children: [
        { path: '/ai-services', label: 'AI Services' },
        { path: '/ai-projects', label: 'AI Projects' },
      ]
    },
    {
      path: '/company',
      label: 'Our Company',
      children: [
        { path: '/about', label: 'About Us' },
        { path: '/offices', label: 'Offices' },
      ]
    },
    { path: '/philanthropy', label: 'Impact' },
    { path: '/careers', label: 'Careers' },
    { path: '/contact', label: 'Contact' }
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-container" ref={menuRef}>
        <Link to="/" className="nav-logo">
          <img src={logo} alt="Lifewood" className="nav-logo-img" />
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          {navLinks.map((link, index) => (
            <li
              key={link.path}
              className={`nav-item ${link.children ? 'has-dropdown' : ''}`}
              onMouseEnter={() => link.children && setActiveDropdown(index)}
              onMouseLeave={() => link.children && setActiveDropdown(null)}
            >
              {link.children ? (
                <span className="nav-link" style={{ cursor: 'default' }}>
                  {link.label}
                  {link.children && <ChevronDown size={14} className="ml-1" strokeWidth={2.5} />}
                </span>
              ) : (
                <Link
                  to={link.path}
                  className="nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                  {link.children && <ChevronDown size={14} className="ml-1" strokeWidth={2.5} />}
                </Link>
              )}

              {link.children && (
                <ul className={`dropdown-menu ${activeDropdown === index ? 'active' : ''}`}>
                  {link.children.map((child) => (
                    <li key={child.path}>
                      <Link
                        to={child.path}
                        className="dropdown-link"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setActiveDropdown(null);
                        }}
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

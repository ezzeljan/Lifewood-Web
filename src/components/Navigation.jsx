import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import logo from '../assets/logo.png';
import './Navigation.css';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileView, setIsMobileView] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth <= 992 : false
  );
  const menuRef = useRef(null);
  const location = useLocation();

  const isPathActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const isItemActive = (item) => {
    if (isPathActive(item.path)) return true;
    if (item.children) {
      return item.children.some(child => isPathActive(child.path));
    }
    return false;
  };

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
    const mediaQuery = window.matchMedia('(max-width: 992px)');
    const handleViewportChange = (event) => {
      const mobile = event.matches;
      setIsMobileView(mobile);
      if (!mobile) {
        setIsMenuOpen(false);
        setActiveDropdown(null);
      }
    };

    setIsMobileView(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleViewportChange);
    return () => mediaQuery.removeEventListener('change', handleViewportChange);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
    // Close navigation overlays on route change.
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isMobileView) return;

    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen, isMobileView]);

  return (
    <nav className="navbar">
      <div className="nav-container" ref={menuRef}>

        <button
          className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={() => {
            setIsMenuOpen((prev) => !prev);
            setActiveDropdown(null);
          }}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul id="primary-navigation" className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          {navLinks.map((link, index) => (
            <li
              key={link.path}
              className={`nav-item ${link.children ? 'has-dropdown' : ''}`}
              onMouseEnter={() => {
                if (!isMobileView && link.children) setActiveDropdown(index);
              }}
              onMouseLeave={() => {
                if (!isMobileView && link.children) setActiveDropdown(null);
              }}
            >
              {link.children ? (
                <button
                  type="button"
                  className={`nav-link ${isItemActive(link) ? 'active' : ''}`}
                  onClick={() => setActiveDropdown(activeDropdown === index ? null : index)}
                  aria-expanded={activeDropdown === index}
                  aria-haspopup="true"
                >
                  {link.label}
                  {link.children && <ChevronDown size={14} className="ml-1" strokeWidth={2.5} />}
                </button>
              ) : (
                <Link
                  to={link.path}
                  className={`nav-link ${isItemActive(link) ? 'active' : ''}`}
                  onClick={() => {
                    setIsMenuOpen(false);
                    setActiveDropdown(null);
                  }}
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
                        className={`dropdown-link ${isItemActive(child) ? 'active' : ''}`}
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

      <div className="navbar-logo-container">
        <Link to="/" className="nav-logo-link">
          <img src={logo} alt="Lifewood Logo" className="nav-logo-img" />
        </Link>
      </div>
    </nav>
  );
}

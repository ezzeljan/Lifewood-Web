import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import ServicesSection from '../components/ServicesSection';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);

  // About Section Refs
  const aboutRef = useRef(null);
  const aboutTextRef = useRef(null);

  // Clients Section Refs
  const clientsRef = useRef(null);

  useEffect(() => {
    // --- Hero Initial Animation ---
    const tl = gsap.timeline();

    tl.fromTo(titleRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    )
      .fromTo(subtitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
      .fromTo(ctaRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)' }, '-=0.4');

    // --- Parallax Effect ---
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const xPercent = (e.clientX / window.innerWidth) * 10 - 5;
      gsap.to(containerRef.current, {
        '--hero-rotation': xPercent * 0.3,
        duration: 1,
        ease: 'power2.out'
      });
    };
    window.addEventListener('mousemove', handleMouseMove);

    if (aboutRef.current && aboutTextRef.current) {
      // Split text animation (Scroll Reveal Style)
      const words = aboutRef.current.querySelectorAll('.about-word');

      gsap.fromTo(words,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.02,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: aboutRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    // --- Clients Section Animation (Fade In) ---
    if (clientsRef.current) {
      gsap.fromTo(clientsRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: clientsRef.current,
            start: 'top 85%',
          }
        }
      );
    }

    // --- Stats Counter Animation ---
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
      const target = parseFloat(stat.getAttribute('data-target'));

      gsap.to(stat, {
        innerHTML: target,
        duration: 2.5,
        ease: 'power2.out',
        snap: { innerHTML: 1 },
        scrollTrigger: {
          trigger: stat,
          start: 'top 85%',
          toggleActions: 'play none none reverse', // Replays on scroll up/down
        },
        onUpdate: function () {
          stat.innerHTML = Math.ceil(this.targets()[0].innerHTML).toLocaleString();
        }
      });
    });

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const clients = [
    { name: 'Google', logo: 'https://placehold.co/200x80?text=Google' },
    { name: 'ancestry', logo: 'https://framerusercontent.com/images/Yq2A1QFJLXgGQ3b7NZPthsD9RBk.png?scale-down-to=1024&width=1920&height=1080' },
    { name: 'Moore Foundation', logo: 'https://placehold.co/200x80?text=Amazon' },
    { name: 'BYU Pathway Worldwide', logo: 'https://placehold.co/200x80?text=IBM' },
    { name: 'FamilySearch', logo: 'https://placehold.co/200x80?text=Oracle' },
    { name: 'Microsoft', logo: 'https://placehold.co/200x80?text=Intel' },
    { name: 'Apple', logo: 'https://placehold.co/200x80?text=Nvidia' },
  ];

  return (
    <div className="hero-page-wrapper">
      {/* 1. Hero Section */}
      <main className="hero" ref={containerRef} style={{ transform: 'perspective(1000px) rotateY(var(--hero-rotation, 0deg))' }}>
        <div className="hero-content">
          <h1 ref={titleRef} className="hero-title">
            The world’s leading provider<br />
            of AI-powered data solutions.
          </h1>

          <div ref={ctaRef} className="hero-cta">
            <Link to="/contact" className="btn btn-primary">
              Get In Touch
            </Link>
          </div>
        </div>
        <div className="hero-bg-decoration"></div>
      </main>

      {/* 2. About Us Section */}
      <section ref={aboutRef} className="about-section relative">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-overlay">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2072"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="about-container relative z-10 text-center">
          <h2 className="text-3xl font-bold text-[#FFB347] mb-6">About Us</h2>
          <p ref={aboutTextRef} className="about-text text-xl leading-relaxed max-w-3xl mx-auto">
            {"We empower our company and our clients to realize the transformative power of AI.".split(" ").map((word, index) => (
              <span key={index} className="about-word inline-block mr-2 opacity-0">
                {word}
              </span>
            ))}
          </p>
        </div>
      </section>

      {/* --- Global Stats Section --- */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-number" data-target="40">0</span>
            <span className="stat-symbol">+</span>
            <p className="stat-label">Global Delivery Centers</p>
          </div>
          <div className="stat-item">
            <span className="stat-number" data-target="30">0</span>
            <span className="stat-symbol">+</span>
            <p className="stat-label">Countries Across All Continents</p>
          </div>
          <div className="stat-item">
            <span className="stat-number" data-target="50">0</span>
            <span className="stat-symbol">+</span>
            <p className="stat-label">Language Capabilities and Dialects</p>
          </div>
          <div className="stat-item">
            <span className="stat-number" data-target="56000">0</span>
            <span className="stat-symbol">+</span>
            <p className="stat-label">Global Online Resources</p>
          </div>
        </div>
      </section>

      {/* 3. Clients & Partners Section */}
      <section ref={clientsRef} className="clients-section">
        <div className="clients-container">
          <h2 className="clients-title">Clients & Partners</h2>
          <p className="clients-desc">
            We are proud to partner and work with leading organizations worldwide in transforming data into meaningful solutions. Lifewood’s commitment to innovation and excellence has earned the trust of global brands across industries. Here are some of the valued clients and partners we’ve collaborated with:
          </p>
          <div className="scrolling-wrapper">
            <div className="clients-track">
              {/* Double the list for seamless infinite scroll */}
              {[...clients, ...clients].map((client, index) => (
                <div key={index} className="client-item">
                  {/* Using text for now as placeholder images might break or look bad without proper styling */}
                  <span>{client.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. AI Data Services Section */}
      <ServicesSection />


    </div>
  );
}

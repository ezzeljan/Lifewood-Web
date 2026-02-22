import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import ServicesSection from '../components/ServicesSection';
import Clients from './Clients';
import Waves from '../components/Waves';
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

  // Video Section Refs
  const videoSectionRef = useRef(null);
  const videoWrapperRef = useRef(null);

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
      const words = aboutRef.current.querySelectorAll('.about-char');

      gsap.fromTo(words,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.01,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: aboutRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }







    // --- Video Expansion Animation ---
    if (videoSectionRef.current && videoWrapperRef.current) {
      gsap.fromTo(videoWrapperRef.current,
        {
          width: '60%',
          height: '60vh',
          borderRadius: '32px'
        },
        {
          width: '100vw',
          height: '100vh',
          borderRadius: '0px',
          ease: 'none',
          scrollTrigger: {
            trigger: videoSectionRef.current,
            start: 'top bottom',
            end: 'center center',
            scrub: true,
          }
        }
      );
    }

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="hero-page-wrapper">
      {/* 1. Hero Section */}
      <main className="hero relative overflow-hidden flex items-center justify-center" ref={containerRef} style={{ transform: 'perspective(1000px) rotateY(var(--hero-rotation, 0deg))' }}>
        {/* Waves Background */}
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30 pointer-events-none">
          <Waves
            lineColor="#046241"
            backgroundColor="transparent"
            waveSpeedX={0.02}
            waveSpeedY={0.01}
          />
        </div>

        <div className="hero-content relative z-10 text-center">
          <h1 ref={titleRef} className="hero-title">
            The world’s leading provider<br />
            of AI-powered data solutions.
          </h1>

          <div ref={ctaRef} className="hero-cta mt-8">
            <Link to="/contact" className="btn btn-primary">
              Get In Touch
            </Link>
          </div>
        </div>
        <div className="hero-bg-decoration pointer-events-none"></div>
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

          <p ref={aboutTextRef} className="about-text text-xl leading-relaxed max-w-3xl mx-auto">
            {"We empower our company and our clients to realize the transformative power of AI.".split(" ").map((word, wIndex) => (
              <span key={wIndex} className="about-word inline-block mr-2">
                {word.split("").map((char, cIndex) => (
                  <span key={cIndex} className="about-char inline-block opacity-0">
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </p>
        </div>
      </section>

      {/* 3. Bento Grid Features Section */}
      <section className="bento-grid-section">
        <h2 className="bento-title">Built for Global Scale</h2>
        <div className="bento-grid-container">
          <div className="bento-card card-primary">
            <div className="bento-card-content">
              <div className="bento-stat">
                <span className="bento-number">40</span>
                <span className="bento-symbol">+</span>
              </div>
              <h3 className="bento-label">Global Delivery Centers</h3>
              <p className="bento-caption">Lifewood operates 40+ secure delivery centers worldwide, providing the backbone for AI data operations. These hubs ensure sensitive data is processed in controlled environments, with industrialized workflows and strict compliance standards across all regions.</p>
            </div>

          </div>

          <div className="bento-card card-secondary">
            <div className="bento-card-content">
              <div className="bento-stat">
                <span className="bento-number">30</span>
                <span className="bento-symbol">+</span>
              </div>
              <h3 className="bento-label">Countries Across All Continents</h3>
              <p className="bento-caption">Lifewood’s global footprint spans 30+ countries and 40+ centers, including extensive operations in Africa, Asia, Europe, and the Americas, enabling region-specific datasets that reflect cultural and linguistic diversity.</p>
            </div>

          </div>

          <div className="bento-card card-secondary">
            <div className="bento-card-content">
              <div className="bento-stat">
                <span className="bento-number">50</span>
                <span className="bento-symbol">+</span>
              </div>
              <h3 className="bento-label">Language Capabilities and Dialects</h3>
              <p className="bento-caption">Lifewood provides data services in 50+ languages and dialects, building diverse multilingual datasets for LLMs, voice AI, and enterprise applications.</p>
            </div>

          </div>

          <div className="bento-card card-wide">
            <div className="bento-card-content">
              <div className="bento-stat">
                <span className="bento-number">56,000</span>
                <span className="bento-symbol">+</span>
              </div>
              <h3 className="bento-label">Global Online Resources</h3>
              <p className="bento-caption">With 56,788 online specialists worldwide, Lifewood mobilizes a flexible workforce for scalable data collection, annotation, and quality assurance, operating 24/7 across regions.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Video Embed Section (Scroll Expand) */}
      <section ref={videoSectionRef} className="video-section relative w-full h-[120vh] flex items-start justify-center overflow-hidden bg-transparent">
        <div
          ref={videoWrapperRef}
          className="video-wrapper relative overflow-hidden shadow-2xl z-20 origin-center"
          style={{ width: '60%', height: '60vh', borderRadius: '32px' }} // Initial state matches GSAP from
        >
          <iframe
            className="w-full h-full object-cover"
            src="https://www.youtube.com/embed/Cdn9Q_Qo40E?si=-m6VxhP2JBcEO9Yc&autoplay=1&mute=1&loop=1&playlist=Cdn9Q_Qo40E&controls=0&showinfo=0&rel=0"
            title="Lifewood AI"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
          {/* Overlay to prevent scroll stealing (optional) */}
          <div className="absolute inset-0 pointer-events-none"></div>
        </div>
      </section>

      {/* 3. Clients & Partners Section - Sticker Wall (Imported) */}
      <Clients />

      {/* 4. AI Data Services Section */}
      <ServicesSection />


    </div>
  );
}

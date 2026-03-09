import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import ServicesSection from '../components/ServicesSection';
import Clients from './Clients';
import Grainient from '../components/Grainient';
import GlassSurface from '../components/GlassSurface';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const amazedRef = useRef(null);

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






    // --- Amazed Color Change at Footer Bottom ---
    if (amazedRef.current) {
      gsap.to(amazedRef.current, {
        color: '#FFB347',
        duration: 0.5,
        scrollTrigger: {
          trigger: 'body', // Use body to detect end of page
          start: 'bottom bottom', // When bottom of body hits bottom of viewport
          end: 'bottom bottom',
          toggleActions: 'play none none reverse',
          onEnter: () => gsap.to(amazedRef.current, { color: '#FFB347', duration: 0.5 }),
          onLeaveBack: () => gsap.to(amazedRef.current, { color: '#133020', duration: 0.5 }),
        }
      });
    }

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="hero-page-wrapper">
      {/* 1. Hero Section */}
      <main className="hero relative overflow-hidden flex items-center justify-center" ref={containerRef} style={{ transform: 'perspective(1000px) rotateY(var(--hero-rotation, 0deg))' }}>
        {/* Grainient Background */}
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
          <Grainient
            color1="#ffb347"
            color2="#ffffff"
            color3="#133020"
            timeSpeed={0.25}
            colorBalance={0.15}
            warpStrength={1}
            warpFrequency={5}
            warpSpeed={2}
            warpAmplitude={50}
            blendAngle={0}
            blendSoftness={0.05}
            rotationAmount={500}
            noiseScale={2}
            grainAmount={0}
            grainScale={2}
            grainAnimated={false}
            contrast={1.4}
            gamma={1}
            saturation={1}
            centerX={0}
            centerY={0}
            zoom={0.9}
          />
        </div>

        <div className="hero-content relative z-10 text-center">
          <h1 ref={titleRef} className="hero-title text-black">
            <span>The world’s leading provider</span>
            <br />
            <span>of AI-powered data solutions.</span>
          </h1>

          <div ref={ctaRef} className="hero-cta mt-8 flex justify-center gap-4">
            <Link to="/contact" className="button1" style={{ textDecoration: 'none' }}>

              Contact Us
            </Link>
            <Link to="/about" className="button1" style={{ textDecoration: 'none' }}>
              <span className="button1__icon-wrapper">
                <svg viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="button1__icon-svg" width={10}>
                  <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor" />
                </svg>
                <svg viewBox="0 0 14 15" fill="none" width={10} xmlns="http://www.w3.org/2000/svg" className="button1__icon-svg button1__icon-svg--copy">
                  <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor" />
                </svg>
              </span>
              Learn More
            </Link>
          </div>
        </div>
        <div className="hero-bg-decoration pointer-events-none"></div>
      </main>

      {/* About Us Two-Column Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        <div className="flex flex-col items-start justify-start gap-6 md:col-span-4">
          <div className="border border-gray-400 rounded-full px-4 py-1.5 bg-transparent">
            <span className="text-xs font-medium tracking-wider text-gray-900">About Us</span>
          </div>

        </div>
        <div className="md:col-span-8">
          <p className="text-xl md:text-2xl leading-relaxed text-gray-800 font-extralight mb-8">
            At Lifewood we empower our company and our clients to realize the transformative power of Al: bringing big data to life: launching new ways of thinking, learning and doing; for the good of humankind.
          </p>
          <Link to="/about" className="button1" style={{ textDecoration: 'none' }}>
            <span className="button1__icon-wrapper">
              <svg viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="button1__icon-svg" width={10}>
                <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor" />
              </svg>
              <svg viewBox="0 0 14 15" fill="none" width={10} xmlns="http://www.w3.org/2000/svg" className="button1__icon-svg button1__icon-svg--copy">
                <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor" />
              </svg>
            </span>
            Know Us Better
          </Link>
        </div>
      </section>

      {/* 3. Features Row Section */}
      <section className="features-row-section">
        <div className="features-row-grid">
          <div className="feature-card">
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop"
              alt="Global Delivery Centers"
              className="feature-card-bg"
            />
            <div className="feature-card-overlay"></div>
            <div className="feature-card-content">
              <div className="feature-stat">
                <span className="feature-number">40</span>
                <span className="feature-symbol">+</span>
              </div>
              <h3 className="feature-label">Global Delivery Centers</h3>
              <p className="feature-caption">Lifewood operates 40+ secure delivery centers worldwide, providing the backbone for AI data operations.</p>
            </div>
          </div>

          <div className="feature-card">
            <img
              src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=800&auto=format&fit=crop"
              alt="Global Footprint"
              className="feature-card-bg"
            />
            <div className="feature-card-overlay"></div>
            <div className="feature-card-content">
              <div className="feature-stat">
                <span className="feature-number">30</span>
                <span className="feature-symbol">+</span>
              </div>
              <h3 className="feature-label">Global Footprint</h3>
              <p className="feature-caption">Lifewood’s footprint spans 30+ countries including extensive operations in Africa, Asia, Europe, and the Americas.</p>
            </div>
          </div>

          <div className="feature-card">
            <img
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop"
              alt="Language Capabilities"
              className="feature-card-bg"
            />
            <div className="feature-card-overlay"></div>
            <div className="feature-card-content">
              <div className="feature-stat">
                <span className="feature-number">50</span>
                <span className="feature-symbol">+</span>
              </div>
              <h3 className="feature-label">Language Capabilities</h3>
              <p className="feature-caption">Lifewood provides data services in 50+ languages and dialects, building diverse multilingual datasets for LLMs.</p>
            </div>
          </div>

          <div className="feature-card">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop"
              alt="Global Online Resources"
              className="feature-card-bg"
            />
            <div className="feature-card-overlay"></div>
            <div className="feature-card-content">
              <div className="feature-stat">
                <span className="feature-number">56k</span>
                <span className="feature-symbol">+</span>
              </div>
              <h3 className="feature-label">Global Online Resources</h3>
              <p className="feature-caption">With 56,788 online specialists worldwide, Lifewood mobilizes a flexible workforce for scalable data collection.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Clients & Partners Section - Sticker Wall (Imported) */}
      <Clients />

      {/* 4. AI Data Services Section */}
      <ServicesSection />

      {/* 5. Amazed Section */}
      <section className="amazed-section py-4 bg-white text-center overflow-hidden">
        <div className="container mx-auto">
          <h2 className="amazed-title" ref={amazedRef}>
            be amazed
          </h2>
        </div>
      </section>


    </div>
  );
}

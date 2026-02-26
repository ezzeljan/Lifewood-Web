import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import ServicesSection from '../components/ServicesSection';
import Clients from './Clients';
import Grainient from '../components/Grainient';
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
            color1="#ffc370"
            color2="#133020"
            color3="#ffb347"
            timeSpeed={0.25}
            colorBalance={0}
            warpStrength={1}
            warpFrequency={5}
            warpSpeed={2}
            warpAmplitude={50}
            blendAngle={0}
            blendSoftness={0.05}
            rotationAmount={500}
            noiseScale={2}
            grainAmount={0.1}
            grainScale={2}
            grainAnimated={false}
            contrast={1.5}
            gamma={1}
            saturation={1}
            centerX={0}
            centerY={0}
            zoom={0.9}
          />
        </div>

        <div className="hero-content relative z-10 text-center">
          <h1 ref={titleRef} className="hero-title">
            <span>The world’s leading provider</span>
            <br />
            <span>of AI-powered data solutions.</span>
          </h1>

          <div ref={ctaRef} className="hero-cta mt-8 flex justify-center">
            <Link to="/contact" style={{ textDecoration: 'none' }}>
              <button className="custom-signup-btn">
                Contact Us
              </button>
            </Link>
          </div>
        </div>
        <div className="hero-bg-decoration pointer-events-none"></div>
      </main>

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

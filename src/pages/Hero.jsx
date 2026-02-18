import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import './Hero.css';

export default function Hero() {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    try {
      // Ensure elements are visible
      if (titleRef.current) titleRef.current.style.opacity = '1';
      if (subtitleRef.current) subtitleRef.current.style.opacity = '1';
      if (ctaRef.current) ctaRef.current.style.opacity = '1';

      // Create timeline for staggered animations
      const tl = gsap.timeline();

      // Animate title with character reveal effect
      tl.fromTo(titleRef.current, 
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out'
        }
      )
      // Animate subtitle
      .fromTo(subtitleRef.current, 
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out'
        }, '-=0.5')
      // Animate CTA button
      .fromTo(ctaRef.current, 
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: 'elastic.out(1, 0.5)'
        }, '-=0.4');
    } catch (error) {
      console.warn('Animation error:', error);
      // Ensure fallback visibility
      if (titleRef.current) titleRef.current.style.opacity = '1';
      if (subtitleRef.current) subtitleRef.current.style.opacity = '1';
      if (ctaRef.current) ctaRef.current.style.opacity = '1';
    }

    // Parallax effect on mouse move
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const xPercent = (e.clientX / window.innerWidth) * 10 - 5;
      gsap.to(containerRef.current, {
        rotationY: xPercent * 0.3,
        duration: 1,
        ease: 'power2.out'
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <main className="hero" ref={containerRef}>
      <div className="hero-content">
        <h1 ref={titleRef} className="hero-title">
          Transforming Data into Innovation
        </h1>
        
        <p ref={subtitleRef} className="hero-subtitle">
          Harnessing the power of artificial intelligence and technology to build a sustainable future for everyone.
        </p>

        <div ref={ctaRef} className="hero-cta">
          <Link to="/ai-initiatives" className="btn btn-primary">
            Explore Our AI Solutions
          </Link>
          <Link to="/contact" className="btn btn-secondary">
            Get In Touch
          </Link>
        </div>
      </div>

      {/* Background decoration elements */}
      <div className="hero-bg-decoration"></div>
    </main>
  );
}

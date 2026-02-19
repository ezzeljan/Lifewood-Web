import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './AboutUs.css';

export default function AboutUs() {
  const textRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!textRef.current) return;

    const text = textRef.current;
    const words = text.innerText.split(' ');
    
    // Clear and rebuild with spans
    text.innerHTML = words.map(word => `<span class="word">${word}</span>`).join(' ');
    
    const wordElements = text.querySelectorAll('.word');
    
    // Staggered word animation
    const tl = gsap.timeline();
    
    wordElements.forEach((word, index) => {
      tl.fromTo(
        word,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        index * 0.1
      );
    });

    // Fade out animation at the end
    tl.to(
      wordElements.slice(-3),
      { opacity: 0, duration: 1, ease: 'power2.in' },
      '-=0.5'
    );
  }, []);

  return (
    <section className="about-us" ref={containerRef}>
      <div className="about-us-container">
        <div className="about-us-content">
          <p ref={textRef} className="about-us-text">
            We empower our company and our clients to realize the transformative power of Al
          </p>
        </div>
      </div>
    </section>
  );
}

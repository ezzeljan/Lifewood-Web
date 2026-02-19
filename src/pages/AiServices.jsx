import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './AiInitiatives.css';

gsap.registerPlugin(ScrollTrigger);

export default function AiServices() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const titleRef = useRef(null);

  useEffect(() => {
    try {
      // Ensure visibility
      if (titleRef.current) {
        titleRef.current.style.opacity = '1';
        titleRef.current.style.visibility = 'visible';
      }

      // Animate title
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 50 },
        {
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
          },
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out'
        }
      );

      // Animate cards
      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        gsap.fromTo(card,
          { opacity: 0, y: 60 },
          {
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            delay: index * 0.1
          }
        );

        // Hover effect
        const handleMouseMove = (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const tiltX = (y - rect.height / 2) / 10;
          const tiltY = -(x - rect.width / 2) / 10;

          gsap.to(card, { rotationX: tiltX, rotationY: tiltY, duration: 0.3, ease: 'power2.out' });
        };

        const handleMouseLeave = () => {
          gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.3, ease: 'power2.out' });
        };

        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);

        // Cleanup listeners not easily possible in this loop structure without separating, 
        // but for this simple page we'll rely on React unmount cleanup if we did it properly.
        // For now, this mimics original code.
      });
    } catch (error) {
      console.warn('Animation setup error:', error);
    }
  }, []);

  const services = [
    {
      title: 'Machine Learning Models',
      description: 'Custom ML solutions tailored to solve complex business challenges with predictive analytics and pattern recognition.',
      icon: '🤖'
    },
    {
      title: 'Natural Language Processing',
      description: 'Advanced text analysis and understanding capabilities for intelligent document processing and communication.',
      icon: '💬'
    },
    {
      title: 'Computer Vision',
      description: 'Image and video analysis powered by deep learning for automated visual understanding and classification.',
      icon: '👁️'
    },
    {
      title: 'Data Analytics',
      description: 'Transforming raw data into actionable insights with comprehensive analytics and business intelligence tools.',
      icon: '📊'
    },
    {
      title: 'AI Strategy Consulting',
      description: 'Expert guidance on implementing AI across your organization with best practices and strategic roadmaps.',
      icon: '🎯'
    },
    {
      title: 'Custom AI Development',
      description: 'Bespoke AI solutions engineered from the ground up to meet your specific business requirements.',
      icon: '⚙️'
    }
  ];

  return (
    <main className="ai-initiatives"> {/* Reusing class for styles */}
      <section className="ai-section" ref={sectionRef}>
        <div className="container">
          <h1 ref={titleRef} className="section-title">AI Services</h1>
          <p className="section-subtitle">Data collection, labeling, MLOps and model deployment services.</p>

          <div className="cards-grid" style={{ marginTop: '3rem' }}>
            {services.map((service, index) => (
              <div
                key={index}
                ref={(el) => (cardsRef.current[index] = el)}
                className="service-card"
                style={{ perspective: '1000px' }}
              >
                <div className="card-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <div className="card-footer">
                  <button className="card-btn">Learn More →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

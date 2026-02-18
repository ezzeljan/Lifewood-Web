import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './AiInitiatives.css';

gsap.registerPlugin(ScrollTrigger);

export default function AiInitiatives() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const titleRef = useRef(null);

  useEffect(() => {
    try {
      // Ensure all cards are visible
      if (titleRef.current) {
        titleRef.current.style.opacity = '1';
        titleRef.current.style.visibility = 'visible';
      }
      cardsRef.current.forEach((card) => {
        if (card) {
          card.style.opacity = '1';
          card.style.visibility = 'visible';
        }
      });

      // Animate title on scroll
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

      // Animate cards with stagger effect
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
            delay: index * 0.2
          }
        );

      // Tilt effect on hover (using mouse move)
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const tiltX = (y - rect.height / 2) / 10;
          const tiltY = -(x - rect.width / 2) / 10;

          gsap.to(card, {
            rotationX: tiltX,
            rotationY: tiltY,
            duration: 0.3,
            ease: 'power2.out'
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            rotationX: 0,
            rotationY: 0,
            duration: 0.3,
            ease: 'power2.out'
          });
        });
      });
    } catch (error) {
      console.warn('Animation setup error:', error);
      // Ensure fallback visibility
      if (titleRef.current) titleRef.current.style.opacity = '1';
      cardsRef.current.forEach((card) => {
        if (card) card.style.opacity = '1';
      });
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

  const projects = [
    {
      title: 'Sustainable Forest Management',
      description: 'AI-powered monitoring system for real-time forest health analysis and conservation tracking.',
      status: 'Active'
    },
    {
      title: 'Climate Impact Prediction',
      description: 'Predictive models forecasting environmental changes to support climate action initiatives.',
      status: 'Active'
    },
    {
      title: 'Smart Resource Allocation',
      description: 'Intelligent system optimizing resource distribution for maximum environmental benefit.',
      status: 'Development'
    },
    {
      title: 'Community Health Analytics',
      description: 'Data-driven platform improving health outcomes through predictive healthcare insights.',
      status: 'Active'
    }
  ];

  return (
    <main className="ai-initiatives">
      <section className="ai-section" ref={sectionRef}>
        <div className="container">
          <h1 ref={titleRef} className="section-title">AI Initiatives</h1>
          <p className="section-subtitle">Pioneering AI solutions for a better tomorrow</p>

          {/* AI Services Section */}
          <div className="ai-subsection">
            <h2 className="subsection-title">Our AI Services</h2>
            <div className="cards-grid">
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

          {/* AI Projects Section */}
          <div className="ai-subsection">
            <h2 className="subsection-title">Featured Projects</h2>
            <div className="projects-grid">
              {projects.map((project, index) => (
                <div
                  key={index}
                  ref={(el) => (cardsRef.current[services.length + index] = el)}
                  className="project-card"
                >
                  <div className="project-header">
                    <h3>{project.title}</h3>
                    <span className={`status-badge ${project.status.toLowerCase().replace(' ', '-')}`}>
                      {project.status}
                    </span>
                  </div>
                  <p>{project.description}</p>
                  <div className="project-footer">
                    <a href="#" className="project-link">View Details →</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

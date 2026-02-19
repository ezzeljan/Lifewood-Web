import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './AiInitiatives.css';

gsap.registerPlugin(ScrollTrigger);

export default function AiProjects() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const titleRef = useRef(null);

  useEffect(() => {
    try {
      if (titleRef.current) {
        titleRef.current.style.opacity = '1';
        titleRef.current.style.visibility = 'visible';
      }

      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 50 },
        {
          scrollTrigger: { trigger: titleRef.current, start: 'top 80%' },
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out'
        }
      );

      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        gsap.fromTo(card,
          { opacity: 0, y: 60 },
          {
            scrollTrigger: { trigger: card, start: 'top 85%' },
            opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: index * 0.1
          }
        );
      });
    } catch (error) {
      console.warn('Animation setup error:', error);
    }
  }, []);

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
          <h1 ref={titleRef} className="section-title">AI Projects</h1>
          <p className="section-subtitle">Showcase of completed and ongoing AI projects across industries.</p>

          <div className="projects-grid" style={{ marginTop: '3rem' }}>
            {projects.map((project, index) => (
              <div
                key={index}
                ref={(el) => (cardsRef.current[index] = el)}
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
      </section>
    </main>
  );
}

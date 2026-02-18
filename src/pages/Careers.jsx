import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Careers.css';

gsap.registerPlugin(ScrollTrigger);

export default function Careers() {
  const titleRef = useRef(null);
  const jobCardsRef = useRef([]);
  const benefitsRef = useRef([]);

  useEffect(() => {
    try {
      // Ensure all elements are visible
      if (titleRef.current) {
        titleRef.current.style.opacity = '1';
        titleRef.current.style.visibility = 'visible';
      }
      jobCardsRef.current.forEach((card) => {
        if (card) {
          card.style.opacity = '1';
          card.style.visibility = 'visible';
        }
      });
      benefitsRef.current.forEach((benefit) => {
        if (benefit) {
          benefit.style.opacity = '1';
          benefit.style.visibility = 'visible';
        }
      });

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

      // Animate job cards with flip effect
      jobCardsRef.current.forEach((card, index) => {
        if (!card) return;
        gsap.fromTo(card,
          { opacity: 0, rotationY: 90 },
          {
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
            },
            opacity: 1,
            rotationY: 0,
            duration: 0.8,
            ease: 'back.out(1.7)',
            delay: index * 0.15
          }
        );

        // Add hover animation
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            y: -10,
            duration: 0.3,
            ease: 'power2.out'
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            y: 0,
            duration: 0.3,
            ease: 'power2.out'
          });
        });
      });

      // Animate benefits
      benefitsRef.current.forEach((benefit, index) => {
        if (!benefit) return;
        gsap.fromTo(benefit,
          { opacity: 0, x: index % 2 === 0 ? -50 : 50 },
          {
            scrollTrigger: {
              trigger: benefit,
              start: 'top 85%',
            },
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power3.out',
            delay: index * 0.1
          }
        );
      });
    } catch (error) {
      console.warn('Animation setup error:', error);
      // Ensure fallback visibility
      if (titleRef.current) titleRef.current.style.opacity = '1';
      jobCardsRef.current.forEach((card) => {
        if (card) card.style.opacity = '1';
      });
      benefitsRef.current.forEach((benefit) => {
        if (benefit) benefit.style.opacity = '1';
      });
    }
  }, []);

  const jobs = [
    {
      title: 'Senior AI Engineer',
      department: 'Engineering',
      location: 'San Francisco, USA',
      type: 'Full-time',
      experience: '5+ years',
      description: 'Lead the development of cutting-edge AI models and solutions.'
    },
    {
      title: 'Data Scientist',
      department: 'Research',
      location: 'London, UK',
      type: 'Full-time',
      experience: '3+ years',
      description: 'Develop advanced machine learning models for real-world applications.'
    },
    {
      title: 'Product Manager',
      department: 'Product',
      location: 'Singapore',
      type: 'Full-time',
      experience: '4+ years',
      description: 'Shape the future of our AI product offerings.'
    },
    {
      title: 'DevOps Engineer',
      department: 'Infrastructure',
      location: 'Berlin, Germany',
      type: 'Full-time',
      experience: '3+ years',
      description: 'Build robust infrastructure for our global operations.'
    },
    {
      title: 'UX/UI Designer',
      department: 'Design',
      location: 'Remote',
      type: 'Full-time',
      experience: '2+ years',
      description: 'Create intuitive interfaces for complex AI applications.'
    },
    {
      title: 'Business Development',
      department: 'Sales',
      location: 'Multiple',
      type: 'Full-time',
      experience: '5+ years',
      description: 'Drive growth through strategic partnerships.'
    }
  ];

  const benefits = [
    { icon: '💰', title: 'Competitive Salary', description: 'Industry-leading compensation packages' },
    { icon: '🏥', title: 'Health Insurance', description: 'Comprehensive coverage for you and family' },
    { icon: '🌍', title: 'Remote Work', description: 'Flexible work location options' },
    { icon: '📚', title: 'Learning Budget', description: '$2000 annual professional development' },
    { icon: '🏖️', title: 'Unlimited PTO', description: 'Work-life balance is important' },
    { icon: '🚀', title: 'Career Growth', description: 'Clear progression opportunities' },
    { icon: '🍽️', title: 'Wellness Programs', description: 'Gym membership and healthy snacks' },
    { icon: '🎉', title: 'Team Events', description: 'Regular team building activities' }
  ];

  return (
    <main className="careers">
      <section className="careers-section">
        <div className="container">
          <h1 ref={titleRef} className="section-title">Join Our Team</h1>
          <p className="section-subtitle">Build the future with us at Lifewood</p>

          {/* Open Positions */}
          <section className="jobs-section">
            <h2>Open Positions</h2>
            <div className="jobs-grid">
              {jobs.map((job, index) => (
                <div
                  key={index}
                  ref={(el) => (jobCardsRef.current[index] = el)}
                  className="job-card"
                  style={{ perspective: '1000px' }}
                >
                  <div className="job-header">
                    <h3>{job.title}</h3>
                    <span className="job-type">{job.type}</span>
                  </div>
                  <p className="job-department">{job.department}</p>
                  <p className="job-description">{job.description}</p>
                  <div className="job-meta">
                    <span className="meta-item">📍 {job.location}</span>
                    <span className="meta-item">💼 {job.experience}</span>
                  </div>
                  <button className="btn btn-primary">Apply Now</button>
                </div>
              ))}
            </div>
          </section>

          {/* Benefits Section */}
          <section className="benefits-section">
            <h2>Why Join Lifewood?</h2>
            <div className="benefits-grid">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  ref={(el) => (benefitsRef.current[index] = el)}
                  className="benefit-card"
                >
                  <div className="benefit-icon">{benefit.icon}</div>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="careers-cta">
            <h2>Don't see the right role?</h2>
            <p>Send us your resume and tell us what you're interested in.</p>
            <button className="btn btn-primary">Send Your Resume</button>
          </section>
        </div>
      </section>
    </main>
  );
}

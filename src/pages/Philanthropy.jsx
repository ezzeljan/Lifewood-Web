import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Philanthropy.css';

gsap.registerPlugin(ScrollTrigger);

export default function Philanthropy() {
  const titleRef = useRef(null);
  const impactItemsRef = useRef([]);
  const progressBarsRef = useRef([]);
  const initiativesRef = useRef([]);

  useEffect(() => {
    try {
      // Ensure all elements are visible
      if (titleRef.current) {
        titleRef.current.style.opacity = '1';
        titleRef.current.style.visibility = 'visible';
      }
      impactItemsRef.current.forEach((item) => {
        if (item) {
          item.style.opacity = '1';
          item.style.visibility = 'visible';
        }
      });
      progressBarsRef.current.forEach((bar) => {
        if (bar) {
          bar.style.opacity = '1';
          bar.style.visibility = 'visible';
        }
      });
      initiativesRef.current.forEach((initiative) => {
        if (initiative) {
          initiative.style.opacity = '1';
          initiative.style.visibility = 'visible';
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

      // Animate impact items with scale effect
      impactItemsRef.current.forEach((item, index) => {
        if (!item) return;
        gsap.fromTo(item,
          { opacity: 0, scale: 0.7 },
          {
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
            },
            opacity: 1,
            scale: 1,
            duration: 0.7,
            ease: 'back.out(1.7)',
            delay: index * 0.1
          }
        );
      });

      // Animate progress bars
      progressBarsRef.current.forEach((bar, index) => {
        if (!bar) return;
        const percentage = parseInt(bar.getAttribute('data-percentage'));
        
        gsap.fromTo(bar.querySelector('.progress-fill'),
          { width: '0%' },
          {
            scrollTrigger: {
              trigger: bar,
              start: 'top 85%',
            },
            width: percentage + '%',
            duration: 1.5,
            ease: 'power3.out',
            delay: index * 0.1
          }
        );

        // Animate percentage counter
        const percentageText = bar.querySelector('.percentage-text');
        gsap.from({ value: 0 }, {
          scrollTrigger: {
            trigger: bar,
            start: 'top 85%',
          },
          value: percentage,
          duration: 1.5,
          ease: 'power3.out',
          delay: index * 0.1,
          onUpdate: function() {
            percentageText.textContent = Math.round(this.targets()[0].value) + '%';
          }
        });
      });

      // Animate initiatives
      initiativesRef.current.forEach((initiative, index) => {
        if (!initiative) return;
        gsap.fromTo(initiative,
          { opacity: 0, x: index % 2 === 0 ? -50 : 50 },
          {
            scrollTrigger: {
              trigger: initiative,
              start: 'top 85%',
            },
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power3.out'
          }
        );
      });
    } catch (error) {
      console.warn('Animation setup error:', error);
      // Ensure fallback visibility
      if (titleRef.current) titleRef.current.style.opacity = '1';
      impactItemsRef.current.forEach((item) => {
        if (item) item.style.opacity = '1';
      });
      progressBarsRef.current.forEach((bar) => {
        if (bar) bar.style.opacity = '1';
      });
      initiativesRef.current.forEach((initiative) => {
        if (initiative) initiative.style.opacity = '1';
      });
    }
  }, []);

  const impactMetrics = [
    { icon: '🌍', value: '1.2M', label: 'Lives Impacted' },
    { icon: '♻️', value: '500K', label: 'Trees Planted' },
    { icon: '⚡', value: '250MW', label: 'Renewable Energy' },
    { icon: '💧', value: '100M', label: 'Liters Water Saved' }
  ];

  const sustainabilityProgress = [
    { label: 'Climate Action', percentage: 85 },
    { label: 'Renewable Energy', percentage: 72 },
    { label: 'Waste Reduction', percentage: 90 },
    { label: 'Community Development', percentage: 78 }
  ];

  const initiatives = [
    {
      title: 'Global Climate Initiative',
      description: 'Partnering with organizations worldwide to combat climate change through AI-powered climate prediction and mitigation strategies.',
      focus: ['Emissions Tracking', 'Climate Modeling', 'Sustainability Planning']
    },
    {
      title: 'Education for All',
      description: 'Providing free AI and technology training to underserved communities, empowering individuals with future-ready skills.',
      focus: ['STEM Education', 'Scholarships', 'Mentorship Programs']
    },
    {
      title: 'Health & Wellness',
      description: 'Leveraging AI to improve healthcare access and outcomes, particularly in developing regions with limited resources.',
      focus: ['Diagnostic AI', 'Telemedicine', 'Preventive Care']
    },
    {
      title: 'Social Equity Programs',
      description: 'Working to bridge the digital divide and ensure equitable access to technology and opportunities for all communities.',
      focus: ['Digital Inclusion', 'Job Training', 'Economic Empowerment']
    }
  ];

  return (
    <main className="philanthropy">
      <section className="philanthropy-section">
        <div className="container">
          <h1 ref={titleRef} className="section-title">Philanthropy & Impact</h1>
          <p className="section-subtitle">Creating lasting positive change through technology and innovation</p>

          {/* Impact Metrics */}
          <section className="impact-metrics">
            <div className="metrics-grid">
              {impactMetrics.map((metric, index) => (
                <div
                  key={index}
                  ref={(el) => (impactItemsRef.current[index] = el)}
                  className="metric-card"
                >
                  <div className="metric-icon">{metric.icon}</div>
                  <div className="metric-value">{metric.value}</div>
                  <div className="metric-label">{metric.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Sustainability Progress */}
          <section className="sustainability-section">
            <h2>Our Sustainability Goals</h2>
            <div className="progress-container">
              {sustainabilityProgress.map((goal, index) => (
                <div
                  key={index}
                  ref={(el) => (progressBarsRef.current[index] = el)}
                  className="progress-item"
                  data-percentage={goal.percentage}
                >
                  <div className="progress-header">
                    <span className="progress-label">{goal.label}</span>
                    <span className="percentage-text">0%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: 0 }}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Initiatives */}
          <section className="initiatives-section">
            <h2>Our Initiatives</h2>
            <div className="initiatives-grid">
              {initiatives.map((initiative, index) => (
                <div
                  key={index}
                  ref={(el) => (initiativesRef.current[index] = el)}
                  className="initiative-card"
                >
                  <h3>{initiative.title}</h3>
                  <p>{initiative.description}</p>
                  <div className="initiative-focus">
                    {initiative.focus.map((item, idx) => (
                      <span key={idx} className="focus-tag">{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './OurCompany.css';

gsap.registerPlugin(ScrollTrigger);

export default function OurCompany() {
  const titleRef = useRef(null);
  const aboutRef = useRef(null);
  const officesRef = useRef(null);
  const statsRef = useRef([]);

  useEffect(() => {
    try {
      // Ensure all elements are visible
      if (titleRef.current) {
        titleRef.current.style.opacity = '1';
        titleRef.current.style.visibility = 'visible';
      }
      if (aboutRef.current) {
        aboutRef.current.style.opacity = '1';
        aboutRef.current.style.visibility = 'visible';
      }
      if (officesRef.current) {
        officesRef.current.style.opacity = '1';
        officesRef.current.style.visibility = 'visible';
      }
      statsRef.current.forEach((stat) => {
        if (stat) {
          stat.style.opacity = '1';
          stat.style.visibility = 'visible';
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

      // Animate About section
      gsap.fromTo(aboutRef.current?.querySelector('h2'),
        { opacity: 0, x: -50 },
        {
          scrollTrigger: {
            trigger: aboutRef.current,
            start: 'top 80%',
          },
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out'
        }
      );

      gsap.fromTo(aboutRef.current?.querySelector('p'),
        { opacity: 0, x: 50 },
        {
          scrollTrigger: {
            trigger: aboutRef.current,
            start: 'top 80%',
          },
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          delay: 0.2
        }
      );

      // Animate stats with counting effect
      statsRef.current.forEach((stat, index) => {
        if (!stat) return;
        gsap.fromTo(stat,
          { opacity: 0, scale: 0.8 },
          {
            scrollTrigger: {
              trigger: stat,
              start: 'top 85%',
            },
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: 'back.out(1.7)',
            delay: index * 0.1
          }
        );

        // Animate number counting
        const numberElement = stat.querySelector('.stat-number');
        if (numberElement) {
          const finalValue = parseInt(numberElement.textContent.replace('+', '').replace('%', ''));
          gsap.from({ value: 0 }, {
            scrollTrigger: {
              trigger: stat,
              start: 'top 85%',
            },
            value: finalValue,
            duration: 2,
            ease: 'power2.out',
            onUpdate: function() {
              const formattedValue = Math.round(this.targets()[0].value);
              if (numberElement.textContent.includes('%')) {
                numberElement.textContent = formattedValue + '%';
              } else if (numberElement.textContent.includes('+')) {
                numberElement.textContent = formattedValue + '+';
              } else {
                numberElement.textContent = formattedValue;
              }
            }
          });
        }
      });

      // Animate Offices section
      gsap.fromTo(officesRef.current?.querySelector('h2'),
        { opacity: 0, y: 40 },
        {
          scrollTrigger: {
            trigger: officesRef.current,
            start: 'top 80%',
          },
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out'
        }
      );

      const officeCards = officesRef.current?.querySelectorAll('.office-card');
      officeCards?.forEach((card, index) => {
        card.style.opacity = '1';
        card.style.visibility = 'visible';
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
            delay: index * 0.15
          }
        );
      });
    } catch (error) {
      console.warn('Animation setup error:', error);
      // Ensure fallback visibility
      if (titleRef.current) titleRef.current.style.opacity = '1';
      if (aboutRef.current) aboutRef.current.style.opacity = '1';
      if (officesRef.current) officesRef.current.style.opacity = '1';
      statsRef.current.forEach((stat) => {
        if (stat) stat.style.opacity = '1';
      });
    }
  }, []);

  const stats = [
    { number: '150+', label: 'Team Members' },
    { number: '98%', label: 'Client Satisfaction' },
    { number: '50+', label: 'Projects Delivered' },
    { number: '12', label: 'Years in Business' }
  ];

  const offices = [
    {
      city: 'San Francisco',
      country: 'USA',
      address: '350 Fifth Avenue, San Francisco, CA 94107',
      phone: '+1 (415) 555-0100'
    },
    {
      city: 'London',
      country: 'UK',
      address: '30 St Mary Axe, London, EC3A 8BF',
      phone: '+44 (20) 7946 0958'
    },
    {
      city: 'Singapore',
      country: 'Singapore',
      address: '8 Marina Boulevard, Singapore, 018981',
      phone: '+65 6653 6100'
    },
    {
      city: 'Berlin',
      country: 'Germany',
      address: 'Unter den Linden 77, Berlin, 10117',
      phone: '+49 (30) 27901111'
    }
  ];

  return (
    <main className="our-company">
      <section className="company-section">
        <div className="container">
          <h1 ref={titleRef} className="section-title">Our Company</h1>
          <p className="section-subtitle">Building tomorrow's innovations today</p>

          {/* About Us Section */}
          <section className="about-section" ref={aboutRef}>
            <div className="about-content">
              <div className="about-text">
                <h2>About Lifewood Data Technology</h2>
                <p>
                  Founded with a mission to democratize artificial intelligence and data science, Lifewood Data Technology 
                  has grown into a global leader in AI innovation. We believe that technology should serve humanity and 
                  contribute to building a sustainable, equitable future.
                </p>
                <p>
                  Our team of world-class engineers, scientists, and visionaries work collaboratively to solve complex 
                  challenges across industries. We're committed to pushing the boundaries of what's possible while maintaining 
                  the highest standards of ethical AI development.
                </p>
              </div>
              <div className="about-stats">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    ref={(el) => (statsRef.current[index] = el)}
                    className="stat-item"
                  >
                    <div className="stat-number">{stat.number}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Offices Section */}
          <section className="offices-section" ref={officesRef}>
            <h2>Our Offices</h2>
            <div className="offices-grid">
              {offices.map((office, index) => (
                <div key={index} className="office-card">
                  <div className="office-icon">📍</div>
                  <h3>{office.city}</h3>
                  <p className="office-country">{office.country}</p>
                  <p className="office-address">{office.address}</p>
                  <p className="office-phone">
                    <a href={`tel:${office.phone}`}>{office.phone}</a>
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

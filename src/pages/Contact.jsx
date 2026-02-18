import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Contact.css';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const titleRef = useRef(null);
  const formRef = useRef(null);
  const contactInfoRef = useRef([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    try {
      // Ensure all elements are visible
      if (titleRef.current) {
        titleRef.current.style.opacity = '1';
        titleRef.current.style.visibility = 'visible';
      }
      if (formRef.current) {
        formRef.current.style.opacity = '1';
        formRef.current.style.visibility = 'visible';
      }
      contactInfoRef.current.forEach((item) => {
        if (item) {
          item.style.opacity = '1';
          item.style.visibility = 'visible';
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

      // Animate form
      gsap.fromTo(formRef.current,
        { opacity: 0, scale: 0.9 },
        {
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 80%',
          },
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out'
        }
      );

      // Animate contact info items
      contactInfoRef.current.forEach((item, index) => {
        if (!item) return;
        gsap.fromTo(item,
          { opacity: 0, x: -50 },
          {
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
            },
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power3.out',
            delay: index * 0.15
          }
        );
      });

      // Add focus animations to inputs
      const inputs = formRef.current?.querySelectorAll('input, textarea');
      inputs?.forEach((input) => {
        input.style.opacity = '1';
        input.style.visibility = 'visible';
        input.addEventListener('focus', () => {
          gsap.to(input, {
            scale: 1.02,
            duration: 0.3,
            ease: 'power2.out'
          });
        });

        input.addEventListener('blur', () => {
          gsap.to(input, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
          });
        });
      });
    } catch (error) {
      console.warn('Animation setup error:', error);
      // Ensure fallback visibility
      if (titleRef.current) titleRef.current.style.opacity = '1';
      if (formRef.current) formRef.current.style.opacity = '1';
      contactInfoRef.current.forEach((item) => {
        if (item) item.style.opacity = '1';
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Animate submit button
    const submitBtn = e.target.querySelector('button[type="submit"]');
    gsap.timeline()
      .to(submitBtn, {
        scale: 0.95,
        duration: 0.1
      })
      .to(submitBtn, {
        scale: 1,
        duration: 0.1
      });

    // Show success message
    setSubmitted(true);
    
    // Reset form after delay
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setSubmitted(false);
    }, 3000);
  };

  const contactInfo = [
    {
      icon: '📍',
      title: 'Address',
      details: 'Multiple global offices',
      description: 'San Francisco, London, Singapore, Berlin'
    },
    {
      icon: '📧',
      title: 'Email',
      details: 'contact@lifewood.tech',
      description: 'General inquiries'
    },
    {
      icon: '📞',
      title: 'Phone',
      details: '+1 (415) 555-0100',
      description: 'Monday - Friday, 9am - 6pm'
    },
    {
      icon: '💬',
      title: 'Social',
      details: '@LifewoodData',
      description: 'Follow us on social media'
    }
  ];

  return (
    <main className="contact">
      <section className="contact-section">
        <div className="container">
          <h1 ref={titleRef} className="section-title">Get In Touch</h1>
          <p className="section-subtitle">We'd love to hear from you. Let's start a conversation.</p>

          <div className="contact-content">
            {/* Contact Form */}
            <div className="form-container" ref={formRef}>
              <h2>Send Us a Message</h2>
              {submitted ? (
                <div className="success-message">
                  <div className="success-icon">✓</div>
                  <h3>Thank You!</h3>
                  <p>We've received your message and will get back to you soon.</p>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Your message here..."
                      rows="5"
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Contact Information */}
            <div className="contact-info-container">
              <h2>Contact Information</h2>
              <div className="contact-info-grid">
                {contactInfo.map((info, index) => (
                  <div
                    key={index}
                    ref={(el) => (contactInfoRef.current[index] = el)}
                    className="contact-info-card"
                  >
                    <div className="info-icon">{info.icon}</div>
                    <h3>{info.title}</h3>
                    <p className="info-details">{info.details}</p>
                    <p className="info-description">{info.description}</p>
                  </div>
                ))}
              </div>

              {/* Map Placeholder */}
              <div className="map-container">
                <div className="map-placeholder">
                  <div className="map-icon">🗺️</div>
                  <p>Visit us at any of our global locations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

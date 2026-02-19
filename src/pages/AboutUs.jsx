import { useEffect, useRef } from 'react';
import { Users, Target, Globe, Shield, Zap, Heart } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import './AboutUs.css';

gsap.registerPlugin(ScrollTrigger);

export default function AboutUs() {
  const pageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Animation
      gsap.from('.about-hero-title', { opacity: 0, y: 50, duration: 1, delay: 0.2 });
      gsap.from('.about-hero-subtitle', { opacity: 0, y: 30, duration: 1, delay: 0.4 });

      // Sections Fade Up
      gsap.utils.toArray('.fade-up').forEach(el => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
          },
          opacity: 0,
          y: 40,
          duration: 1,
          ease: 'power3.out'
        });
      });

      // Values Stagger
      gsap.from('.value-card', {
        scrollTrigger: {
          trigger: '.values-grid',
          start: 'top 80%',
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.1,
        ease: 'back.out(1.7)'
      });

    }, pageRef);

    return () => ctx.revert();
  }, []);

  const values = [
    { icon: <Globe size={32} />, title: "Diversity", desc: "We foster an inclusive environment that values diverse perspectives, ensuring our AI solutions truly represent the global community." },
    { icon: <Heart size={32} />, title: "Caring", desc: "We are deeply committed to the well-being of our team, our clients, and the communities we serve." },
    { icon: <Zap size={32} />, title: "Innovation", desc: "We are committed to fostering a culture of innovation, constantly evolving our technologies to solve real-world problems." },
    { icon: <Shield size={32} />, title: "Integrity", desc: "We uphold the highest ethical standards, ensuring trust, transparency, and accountability in every data solution we deliver." },
  ];

  const leadership = [
    { name: "John Doe", role: "CEO & Founder", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400" },
    { name: "Jane Smith", role: "Chief Technology Officer", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" },
    { name: "Robert Fox", role: "Head of Global Operations", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400" },
  ];

  return (
    <div ref={pageRef} className="about-page-wrapper">

      {/* 1. Hero Header */}
      <header className="about-hero">
        <img
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2000"
          alt="About Us Hero"
          className="about-hero-bg"
        />
        <div className="about-hero-content">
          <h1 className="about-hero-title">Pioneering Ethical<br />AI Data Solutions</h1>
          <p className="about-hero-subtitle">
            We are on a mission to democratize AI development by providing the high-quality, ethically sourced data that powers the world's most advanced models.
          </p>
        </div>
      </header>

      {/* 2. Mission & Vision */}
      <section className="mission-vision-section">
        <div className="mv-grid">
          <div className="mv-card fade-up">
            <h2 className="mv-title">Our Mission</h2>
            <p className="mv-text">
              To develop and deploy cutting edge Al technologies that solve real-world problems, empower communities, and advance sustainable practices. We are committed to fostering a culture of innovation, collaborating with stakeholders across sectors, and making a meaningful impact on society and the environment.
            </p>
          </div>
          <div className="mv-card fade-up">
            <h2 className="mv-title">Our Vision</h2>
            <p className="mv-text">
              To be the global champion in Al data solutions, igniting a culture of innovation and sustainability that enriches lives and transforms communities worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Global Scale (Dark) */}
      <section className="global-scale-section">
        <div className="container mx-auto px-4 relative z-10 fade-up">
          <span className="section-title-sm text-[#FFB347]">Global Impact</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Data Without Borders</h2>
          <p className="max-w-2xl mx-auto text-lg opacity-80">
            Our global network of data experts ensures cultural nuance and linguistic diversity in every dataset.
          </p>

          <div className="gs-grid">
            <div className="gs-item">
              <h3>50+</h3>
              <p>Countries Covered</p>
            </div>
            <div className="gs-item">
              <h3>50k+</h3>
              <p>Contributors</p>
            </div>
            <div className="gs-item">
              <h3>100M+</h3>
              <p>Data Points Annotated</p>
            </div>
          </div>
        </div>
        {/* Abstract BG lines could go here */}
      </section>

      {/* 3. Core Values */}
      <section className="values-section">
        <div className="section-header fade-up">
          <span className="section-title-sm">Our Culture</span>
          <h2 className="section-title-lg">Core Values</h2>
        </div>

        <div className="values-grid">
          {values.map((val, i) => (
            <div key={i} className="value-card">
              <div className="value-icon">{val.icon}</div>
              <h3 className="value-title">{val.title}</h3>
              <p className="value-desc">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Leadership */}
      <section className="team-section">
        <div className="section-header fade-up">
          <span className="section-title-sm">Leadership</span>
          <h2 className="section-title-lg">Meet the Team</h2>
        </div>

        <div className="team-grid">
          {leadership.map((member, i) => (
            <div key={i} className="team-card fade-up">
              <div className="team-img-wrapper">
                <img src={member.img} alt={member.name} className="team-img" />
              </div>
              <h3 className="team-name">{member.name}</h3>
              <p className="team-role">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CTA */}
      <section className="about-cta">
        <div className="max-w-3xl mx-auto px-4 fade-up">
          <h2 className="text-[#133020]">Ready to transform your data strategy?</h2>
          <Link to="/contact" className="inline-block bg-[#133020] text-white font-bold py-4 px-10 rounded-full hover:bg-black transition-colors transform hover:-translate-y-1 shadow-xl">
            Partner With Us
          </Link>
        </div>
      </section>

    </div>
  );
}

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mic, Video, Image, FileText } from 'lucide-react';
import BrandValuesSection from '../components/BrandValuesSection';
import SpotlightCard from '../components/SpotlightCard';
import lifewoodImg from '../assets/careers/lifewood.png';
import React from 'react';

const marqueeRows = {
  row1: ["United States", "Brazil", "United Kingdom", "Germany", "Finland"],
  row2: ["Africa", "South Africa", "Madagascar", "Middle East", "India", "Bangladesh", "China", "Thailand", "Malaysia", "Vietnam"],
  row3: ["Hongkong", "Philippines", "Indonesia", "Japan", "Australia"]
};

const marqueeImages = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80"
];

import './AiInitiatives.css';

gsap.registerPlugin(ScrollTrigger);

export default function AboutUs() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const titleRef = useRef(null);
  const missionRef = useRef(null);
  const visionRef = useRef(null);
  const bentoRef = useRef(null);

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

      // Animate Bento Gallery
      if (bentoRef.current) {
        gsap.fromTo(bentoRef.current.children,
          { opacity: 0, scale: 0.95, y: 30 },
          {
            scrollTrigger: {
              trigger: bentoRef.current,
              start: 'top 85%',
            },
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1,
            stagger: 0.1,
            ease: 'power3.out'
          }
        );
      }

      // Animate Mission & Vision
      [missionRef, visionRef].forEach((ref) => {
        if (!ref.current) return;
        gsap.fromTo(ref.current,
          { opacity: 0, x: ref === missionRef ? -100 : 100 },
          {
            scrollTrigger: {
              trigger: ref.current,
              start: 'top 80%',
            },
            opacity: 1,
            x: 0,
            duration: 1.2,
            ease: 'power4.out'
          }
        );
      });

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

  return (
    <main className="ai-initiatives"> {/* Reusing class for styles */}
      <section className="ai-section" ref={sectionRef} style={{
        paddingTop: '6rem',
        paddingBottom: '4rem',
        position: 'relative'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h1 ref={titleRef} className="section-title" style={{ textAlign: 'left', marginBottom: '0.5rem' }}>About our company</h1>
          <p className="section-subtitle text-gray-700" style={{ marginBottom: '1.5rem', textAlign: 'left', fontSize: '1.25rem', fontWeight: '400', maxWidth: '900px', lineHeight: '1.6' }}>
            While we are motivated by business and economic objectives, we remain committed to our core business beliefs that shape our corporate and individual behaviour around the world
          </p>
        </div>
      </section>
      <section className="bento-gallery-section pb-24 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[auto] md:h-[600px]" ref={bentoRef}>
            {/* Main Featured Video */}
            <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-[2rem] shadow-sm border border-gray-100 bg-black">
              <iframe
                className="w-full h-full object-cover"
                src="https://www.youtube.com/embed/tQrXXNm1p4I?si=8F1krdcE2A4bGU48&autoplay=1&mute=1&loop=1&playlist=tQrXXNm1p4I"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>

            {/* Top Middle Image */}
            <div className="md:col-span-1 md:row-span-1 relative group overflow-hidden rounded-[2rem] shadow-sm border border-gray-100">
              <img
                src={marqueeImages[1]}
                alt="Lifewood Office Workspace"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Right Long Image */}
            <div className="md:col-span-1 md:row-span-2 relative group overflow-hidden rounded-[2rem] shadow-sm border border-gray-100">
              <img
                src={lifewoodImg}
                alt="Lifewood HQ and Global Team"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Bottom Middle Image */}
            <div className="md:col-span-1 md:row-span-1 relative group overflow-hidden rounded-[2rem] shadow-sm border border-gray-100">
              <img
                src={marqueeImages[3]}
                alt="Innovation Hub"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>
        </div>
      </section>

      <section className="highlights-section py-20 bg-white">
        <div className="container">
          <div className="max-w-4xl mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#133020] mb-6">Core Values</h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              At Lifewood we empower our company and our clients to realise the transformative power of AI: Bringing big data to life, launching new ways of thinking, innovating, learning, and doing.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
            <SpotlightCard className="p-6 bg-white border border-gray-200 rounded-3xl flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-600">
                <Mic className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#133020] mb-2">Diversity</h3>
              <p className="text-sm text-gray-600">We celebrate differences in belief, philosophy and ways of life, because they bring unique perspectives and ideas that encourage everyone to move forward.</p>
            </SpotlightCard>

            <SpotlightCard className="p-6 bg-white border border-gray-200 rounded-3xl flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-600">
                <Video className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#133020] mb-2">Caring</h3>
              <p className="text-sm text-gray-600">We care for every person deeply and equally, because without care work becomes meaningless.</p>
            </SpotlightCard>

            <SpotlightCard className="p-6 bg-white border border-gray-200 rounded-3xl flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-600">
                <Image className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#133020] mb-2">Innovation</h3>
              <p className="text-sm text-gray-600">Innovation is at the heart of all we do, enriching our lives and challenging us to continually improve ourselves and our service.</p>
            </SpotlightCard>

            <SpotlightCard className="p-6 bg-white border border-gray-200 rounded-3xl flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-600">
                <FileText className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#133020] mb-2">Integrity</h3>
              <p className="text-sm text-gray-600">We are dedicated to act ethically and sustainably in everything we do. More than just the bare minimum. It is the basis of our existence as a company.</p>
            </SpotlightCard>
          </div>
        </div>
      </section>
      <section className="mission-vision-section py-24 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            <div className="mission-item border border-gray-200 rounded-[2.5rem] p-8 md:p-12 shadow-sm hover:shadow-lg transition-all duration-500 bg-white/50 backdrop-blur-sm" ref={missionRef}>
              <div className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-widest text-white bg-[#046241] rounded-full uppercase">
                Our Mission
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#133020] mb-8 leading-tight">
                Pioneering intelligence for a sustainable future.
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed">
                To develop and deploy cutting edge AI technologies that solve real-world problems, empower communities, and advance sustainable practices. We are committed to fostering a culture of innovation, collaborating with stakeholders across sectors, and making a meaningful impact on society and the environment.
              </p>
            </div>

            <div className="vision-item border border-gray-200 rounded-[2.5rem] p-8 md:p-12 shadow-sm hover:shadow-lg transition-all duration-500 bg-white/50 backdrop-blur-sm" ref={visionRef}>
              <div className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-widest text-[#133020] bg-[#FFB347] rounded-full uppercase">
                Our Vision
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#133020] mb-8 leading-tight">
                Empowering global communities through innovation.
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed">
                To be the global champion in AI data solutions, igniting a culture of innovation and sustainability that enriches lives and transforms communities worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Section - Full Width */}
      <div className="w-screen relative left-1/2 -translate-x-1/2 py-8 space-y-4 overflow-hidden bg-white">
        {/* Row 1 - Scroll Right */}
        <div className="flex overflow-hidden">
          <div className="flex animate-marquee-right whitespace-nowrap py-1 w-max">
            {[...marqueeRows.row1, ...marqueeRows.row1, ...marqueeRows.row1, ...marqueeRows.row1].map((item, index) => (
              <React.Fragment key={index}>
                <span className="inline-block px-8 py-4 rounded-xl bg-[#133020] text-white text-3xl md:text-5xl font-bold mx-2 align-middle">
                  {item}
                </span>
                <img
                  src={marqueeImages[index % marqueeImages.length]}
                  alt=""
                  className="inline-block h-20 w-32 object-cover rounded-xl mx-2 align-middle"
                />
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Row 2 - Scroll Left */}
        <div className="flex overflow-hidden">
          <div className="flex animate-marquee-left whitespace-nowrap py-1 w-max">
            {[...marqueeRows.row2, ...marqueeRows.row2, ...marqueeRows.row2, ...marqueeRows.row2].map((item, index) => (
              <React.Fragment key={index}>
                <span className="inline-block px-8 py-4 rounded-xl bg-[#046241] text-white text-3xl md:text-5xl font-bold mx-2 align-middle">
                  {item}
                </span>
                <img
                  src={marqueeImages[(index + 3) % marqueeImages.length]}
                  alt=""
                  className="inline-block h-20 w-32 object-cover rounded-xl mx-2 align-middle"
                />
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Row 3 - Scroll Right */}
        <div className="flex overflow-hidden">
          <div className="flex animate-marquee-right whitespace-nowrap py-1 w-max">
            {[...marqueeRows.row3, ...marqueeRows.row3, ...marqueeRows.row3, ...marqueeRows.row3].map((item, index) => (
              <React.Fragment key={index}>
                <span className="inline-block px-8 py-4 rounded-xl bg-[#FFB347] text-[#133020] text-3xl md:text-5xl font-bold mx-2 align-middle">
                  {item}
                </span>
                <img
                  src={marqueeImages[(index + 6) % marqueeImages.length]}
                  alt=""
                  className="inline-block h-20 w-32 object-cover rounded-xl mx-2 align-middle"
                />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

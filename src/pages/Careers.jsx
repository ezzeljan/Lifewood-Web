import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Swiper, SwiperSlide, useSwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import './Careers.css';

gsap.registerPlugin(ScrollTrigger);

const JobCard = ({ job, image, index }) => {
  const swiperSlide = useSwiperSlide();
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setIsFlipped(swiperSlide.isActive);
  }, [swiperSlide.isActive]);

  const brandColors = ['#FFB347', '#133020', '#046241', '#FFC370'];
  const backBackgroundColor = brandColors[index % brandColors.length];

  // Adjust text color based on background
  // Dark backgrounds (#133020, #046241) -> White text
  // Light backgrounds (#FFB347, #FFC370) -> Black text
  const isDarkBackground = ['#133020', '#046241'].includes(backBackgroundColor);
  const textColor = isDarkBackground ? 'white' : '#1a1a1a';
  const metaColor = isDarkBackground ? '#ccc' : '#333';
  const buttonBg = isDarkBackground ? '#4ade80' : '#133020';
  const buttonText = isDarkBackground ? '#1a1a1a' : 'white';
  const buttonHover = isDarkBackground ? '#22c55e' : '#1a402b';

  return (
    <div
      className={`flip-card ${isFlipped ? 'flipped' : ''}`}
      onClick={() => {
        if (swiperSlide.isActive) {
          setIsFlipped(!isFlipped);
        }
      }}
      title={swiperSlide.isActive ? (isFlipped ? "Click to see image" : "Click to see details") : ""}
    >
      <div className="flip-card-inner">
        {/* Front Side */}
        <div className="flip-card-front">
          <img src={image} alt={job.title} loading="lazy" />
          <div className="card-front-title">{job.title}</div>
        </div>

        {/* Back Side */}
        <div
          className="flip-card-back"
          style={{
            background: backBackgroundColor,
            color: textColor
          }}
        >
          <div>
            <h3 style={{ color: textColor }}>{job.title}</h3>
            <span className="job-type" style={{ color: isDarkBackground ? '#ccc' : '#333', borderColor: isDarkBackground ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }}>{job.type}</span>
            <p className="job-department" style={{ color: isDarkBackground ? '#4ade80' : '#046241' }}>{job.department}</p>
            <p className="job-description" style={{ color: textColor }}>{job.description}</p>
          </div>
          <div>

            <button
              className="btn btn-primary"
              style={{
                backgroundColor: buttonBg,
                color: buttonText,
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = buttonHover}
              onMouseOut={(e) => e.target.style.backgroundColor = buttonBg}
              onClick={(e) => {
                e.stopPropagation(); // Prevent flip when clicking button
                alert(`Applying for ${job.title}`);
              }}
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Careers() {
  const [introComplete, setIntroComplete] = useState(false);
  const introRef = useRef(null);
  const mainContentRef = useRef(null);

  useEffect(() => {
    // Initial Animation Sequence
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => setIntroComplete(true)
      });

      // Validating refs exist
      if (introRef.current && mainContentRef.current) {
        tl.to(introRef.current, {
          scale: 0.8,
          opacity: 0,
          duration: 1.5,
          ease: "power4.inOut",
          delay: 0.5
        })
          .fromTo(mainContentRef.current,
            { scale: 1.2, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1.2, ease: "power4.out" },
            "<0.2" // Overlap animations
          );
      }
    });

    return () => ctx.revert();
  }, []);

  const baseJobs = [
    {
      title: 'Senior AI Engineer',
      department: 'Engineering',
      location: 'San Francisco, USA',
      type: 'Full-time',
      experience: '5+ years',
      description: 'Lead the development of cutting-edge AI models and solutions.',
      image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=600'
    },
    {
      title: 'Data Scientist',
      department: 'Research',
      location: 'London, UK',
      type: 'Full-time',
      experience: '3+ years',
      description: 'Develop advanced machine learning models for real-world applications.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600'
    },
    {
      title: 'Product Manager',
      department: 'Product',
      location: 'Singapore',
      type: 'Full-time',
      experience: '4+ years',
      description: 'Shape the future of our AI product offerings.',
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=600'
    },
    {
      title: 'DevOps Engineer',
      department: 'Infrastructure',
      location: 'Berlin, Germany',
      type: 'Full-time',
      experience: '3+ years',
      description: 'Build robust infrastructure for our global operations.',
      image: 'https://images.unsplash.com/photo-1667372393119-c81c0cda0a63?auto=format&fit=crop&q=80&w=600'
    },
    {
      title: 'UX/UI Designer',
      department: 'Design',
      location: 'Remote',
      type: 'Full-time',
      experience: '2+ years',
      description: 'Create intuitive interfaces for complex AI applications.',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=600'
    },
    {
      title: 'Business Development',
      department: 'Sales',
      location: 'Multiple',
      type: 'Full-time',
      experience: '5+ years',
      description: 'Drive growth through strategic partnerships.',
      image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=600'
    }
  ];

  // duplicate to get 19 items
  const jobs = [];
  const titles = [
    'Machine Learning Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Engineer',
    'Marketing Specialist', 'HR Manager', 'Finance Analyst', 'Legal Counsel', 'Customer Success Manager',
    'Technical Writer', 'QA Engineer', 'Security Specialist', 'Cloud Architect'
  ];

  // Fill up to 19
  for (let i = 0; i < 19; i++) {
    const base = baseJobs[i % baseJobs.length];
    const jobTitle = titles[i % titles.length] || base.title;

    jobs.push({
      ...base,
      title: jobTitle, // Rotate titles for variety
      id: i
    });
  }

  // The initial active slide index
  const initialSlideIndex = 9;
  const initialImage = jobs[initialSlideIndex]?.image;

  return (
    <main className="careers relative overflow-hidden">
      {/* Intro Overlay */}
      {!introComplete && (
        <div
          ref={introRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white pointer-events-none"
        >
          <img
            src={initialImage}
            alt="Intro"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <section className="careers-section" ref={mainContentRef} style={{ opacity: 0 }}>
        <div className="container">
          {/* Open Positions Carousel */}
          <section className="jobs-section">
            <Swiper
              effect={'coverflow'}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={'auto'}
              initialSlide={initialSlideIndex}
              coverflowEffect={{
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
              }}
              pagination={{ clickable: true }}
              modules={[EffectCoverflow, Pagination, Navigation]}
              className="mySwiper"
              style={{ paddingBottom: '3rem' }}
            >
              {jobs.map((job, index) => (
                <SwiperSlide key={index}>
                  <JobCard job={job} image={job.image} index={index} />
                </SwiperSlide>
              ))}
            </Swiper>

            <p style={{ textAlign: 'center', marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>
              Swipe to explore
            </p>
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

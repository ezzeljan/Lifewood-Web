import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Swiper, SwiperSlide, useSwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import team1 from '../assets/careers/team_collaboration_1_1771797291139.png';
import office1 from '../assets/careers/office_workspace_1_1771797311397.png';
import event1 from '../assets/careers/company_event_1_1771797330736.png';
import meeting1 from '../assets/careers/team_meeting_1_1771797346663.png';
import culture1 from '../assets/careers/office_culture_1_1771797368830.png';
import tech1 from '../assets/careers/tech_collaboration_1_1771797385702.png';
import Masonry from '../components/Masonry';

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
          opacity: 0,
          duration: 1.2,
          ease: "power2.inOut",
          delay: 0.5
        })
          .fromTo(mainContentRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 1, ease: "power2.out" },
            "<0.2"
          );
      }
    });

    return () => ctx.revert();
  }, []);

  const jobs = [
    {
      title: 'Intern (Applicable to PH only)',
      location: 'Philippines',
      experience: 'Current Student',
      description: 'Kickstart your career with hands-on experience in global AI data operations.',
      image: culture1
    },
    {
      title: 'HR/Admin Assistant',
      location: 'Global Centers',
      experience: '2+ years',
      description: 'Support our global workforce through efficient administrative and HR operations.',
      image: office1
    },
    {
      title: 'Admin Accounting',
      location: 'Corporate HQ',
      experience: '3+ years',
      description: 'Maintain financial integrity and support cross-border administrative accounting.',
      image: meeting1
    },
    {
      title: 'Marketing & Sales Executive',
      location: 'San Francisco / Remote',
      experience: '4+ years',
      description: 'Drive global growth by connecting brands with world-class AI data solutions.',
      image: team1
    },
    {
      title: 'Data Curation (Genealogy Project)',
      location: 'Remote / Hybrid',
      experience: '2+ years',
      description: 'Work on specialized genealogy data curation using advanced AI-assisted tools.',
      image: tech1
    },
    {
      title: 'AI Video Creator/Editor',
      location: 'Remote',
      experience: '3+ years',
      description: 'Pioneer the future of visual storytelling using cutting-edge Generative AI video tools.',
      image: event1
    }
  ];

  // The initial active slide index
  const initialSlideIndex = 2;
  const initialImage = jobs[initialSlideIndex]?.image;

  const masonryItems = [
    { id: 1, img: team1, height: 600 },
    { id: 2, img: office1, height: 400 },
    { id: 3, img: event1, height: 500 },
    { id: 4, img: meeting1, height: 700 },
    { id: 5, img: culture1, height: 300 },
    { id: 6, img: tech1, height: 550 },
  ];

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
              slidesPerView={3}
              loop={true}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              initialSlide={initialSlideIndex}
              coverflowEffect={{
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: false,
              }}
              pagination={{ clickable: true }}
              modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
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

          {/* Motivation Section */}
          <section className="motivation-section py-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#133020] mb-6 text-left">
              It means motivating and growing teams
            </h2>
            <p className="text-lg md:text-xl text-[#555] leading-relaxed max-w-4xl text-left">
              Teams that can initiate and learn on the run in order to deliver evolving technologies and targets.
              It's a big challenge, but innovation, especially across borders, has never been the easy path.
            </p>
          </section>

          {/* Masonry Section */}
          <section className="careers-masonry py-12">
            <Masonry items={masonryItems} />
          </section>

          {/* New Chapter Section */}
          <section className="new-chapter-section py-12 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#133020] leading-relaxed max-w-5xl mx-auto">
              If you're looking to turn the page on a new chapter in your career make contact with us today. At Lifewood, the adventure is always before you, it's why we've been described as &ldquo;always on, never off.&rdquo;
            </h2>
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

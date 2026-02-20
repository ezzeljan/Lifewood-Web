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
          onUpdate: function () {
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

  const initiatives = [
    { title: 'Impact', id: 0 },
    { title: 'Partnership', id: 1 },
    { title: 'Application', id: 2 },
    { title: 'Expanding', id: 3 }
  ]; // Placeholder for animation refs if needed, but currently hardcoded in JSX


  return (
    <main className="philanthropy">
      <section className="philanthropy-section">
        <div className="container">
          <h1 ref={titleRef} className="section-title">Transforming Communities Worldwide</h1>
          <p className="section-subtitle max-w-4xl mx-auto text-lg leading-relaxed">
            Our vision is of a world where financial investment plays a central role in solving the social and environmental challenges facing the global community, specifically in Africa and the Indian sub-continent.
          </p>

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



          {/* Core Focus Section */}
          <section className="initiatives-section py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 initiatives-grid">
              {/* Impact Card */}
              <div ref={(el) => (initiativesRef.current[0] = el)} className="initiative-card group">
                <h3 className="text-2xl font-bold mb-4 text-[#046241]">Impact</h3>
                <p className="text-gray-700 leading-relaxed font-light">
                  Through purposeful partnerships and sustainable investment, we empower communities across Africa and the Indian sub-continent to create lasting economic and social transformation.
                </p>
              </div>

              {/* Partnership Card */}
              <div ref={(el) => (initiativesRef.current[1] = el)} className="initiative-card group col-span-1 md:col-span-2 bg-[#F9F7F7]">
                <h3 className="text-2xl font-bold mb-4 text-[#046241]">Partnership</h3>
                <p className="text-gray-700 leading-relaxed font-light mb-4 text-base">
                  In partnership with our philanthropic partners, Lifewood has expanded operations across:
                </p>
                <div className="flex flex-wrap gap-2 focus-tag-container">
                  {[
                    "South Africa", "Nigeria", "Republic of the Congo", "Democratic Republic of the Congo",
                    "Ghana", "Madagascar", "Benin", "Uganda", "Kenya", "Ivory Coast", "Egypt",
                    "Ethiopia", "Niger", "Tanzania", "Namibia", "Zambia", "Zimbabwe", "Liberia",
                    "Sierra Leone", "Bangladesh"
                  ].map((country, idx) => (
                    <span key={idx} className="focus-tag px-3 py-1 bg-white border border-[#046241]/20 rounded-full text-sm text-[#133020]">
                      {country}
                    </span>
                  ))}
                </div>
              </div>

              {/* Application Card */}
              <div ref={(el) => (initiativesRef.current[2] = el)} className="initiative-card group">
                <h3 className="text-2xl font-bold mb-4 text-[#046241]">Application</h3>
                <p className="text-gray-700 leading-relaxed font-light">
                  This requires the application of our methods and experience for the development of people in under resourced economies.
                </p>
              </div>

              {/* Expanding Card */}
              <div ref={(el) => (initiativesRef.current[3] = el)} className="initiative-card group">
                <h3 className="text-2xl font-bold mb-4 text-[#046241]">Expanding</h3>
                <p className="text-gray-700 leading-relaxed font-light">
                  We are expanding access to training, establishing equiatable wage structures and career and leadership progression to create sustainable change, by equipping individuals to take the lead and grow the business for themselves for the long term benefit of everyone.
                </p>
              </div>
            </div>
          </section>

          {/* Impact Map */}
          <section className="impact-map-section mt-16 pt-12 border-t border-gray-100">
            <h2 className="text-4xl font-bold mb-10 text-center text-[#046241]">Our Impact in Africa</h2>
            <div className="w-full h-[700px] rounded-[32px] overflow-hidden shadow-2xl">
              <iframe
                src="https://lifewoodafricamap.vercel.app/"
                title="Lifewood Africa Impact Map"
                className="w-full h-full border-none"
                allowFullScreen
              ></iframe>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

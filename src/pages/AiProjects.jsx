import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Brain, Cpu, Database, Eye, Globe, Layers, Zap, Car, MessageSquare, Mic, Scroll, ChevronLeft, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const aiServices = [
  {
    id: '01',
    category: 'Data Extraction',
    title: 'AI Data Extraction',
    description: 'Using AI, we optimize the acquisition of image and text from multiple sources. Techniques include onsite scanning, drone photography, negotiation with archives and the formation of alliances with corporations, religious organizations and governments.',
    icon: <Database className="w-6 h-6" />,
    color: 'from-purple-600 to-blue-600',
    backgroundColor: '#133020',
    textColor: 'text-white',
    image: 'url("https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop")'
  },
  {
    id: '02',
    category: 'ML Enablement',
    title: 'Machine Learning Enablement',
    description: 'From simple data to deep learning, our data solutions are highly flexible and can enable a wide variety of ML systems, no matter how complex the model.',
    icon: <Brain className="w-6 h-6" />,
    color: 'from-emerald-500 to-teal-900',
    backgroundColor: '#046241',
    textColor: 'text-white',
    // Tech/Code for ML
    image: 'url("https://images.unsplash.com/photo-1555255707-c07966088b7b?q=80&w=2032&auto=format&fit=crop")'
  },
  {
    id: '03',
    category: 'Autonomous',
    title: 'Autonomous Driving Technology',
    description: (
      <div className="space-y-4">
        <p>
          Our expertise in precision data labelling lays the groundwork for AI, so that it can process and adapt to the complexities of real-world conditions. We have implemented a diverse mapping methodology, that employs a wide range of data types, including 2D and 3D models, and combinations of both, to create a fully visualized cognitive driving system.
        </p>
        <p>
          Millions of images, videos and mapping data were annotated, effectively transitioning this technology from theoretical models to real-world applications - a significant leap forward for autonomous transport.
        </p>
        <p>
          Lifewood remains at the forefront of this technology, pioneering the evolution of safe, efficient autonomous driving solutions.
        </p>
      </div>
    ),
    icon: <Car className="w-6 h-6" />,
    color: 'from-orange-500 to-red-900',
    backgroundColor: '#133020',
    textColor: 'text-white',
    image: 'url("https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop")'
  },
  {
    id: '04',
    category: 'Customer Service',
    title: 'AI-Enabled Customer Service',
    description: 'Effective route for institutions to deliver personalized, proactive experiences that drive customer engagement. AI powered services can increase customer engagement, multiplying cross-sell and upsell opportunities. Guided by our experts AI customer service can transform customer relationships creating an improved cycle of service, satisfaction and increased customer engagement.',
    icon: <MessageSquare className="w-6 h-6" />,
    color: 'from-blue-500 to-indigo-900',
    backgroundColor: '#FFB347',
    textColor: 'text-white',
    image: 'url("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop")'
  },
  {
    id: '05',
    category: 'NLP & Speech',
    title: 'NLP and Speech Acquisition',
    description: 'We have partnered with some of the world\'s most advanced companies in NLP development. With a managed workforce that spans the globe, we offer solutions in over 50 language capabilities and can assess various dialects and accents for both text and audio data. We specialize in collecting and transcribing recordings from native speakers. This has involved tens of thousands of conversations, a scale made possible by our expertise in adapting industrial processes and our integration with AI.',
    icon: <Mic className="w-6 h-6" />,
    color: 'from-pink-600 to-rose-900',
    backgroundColor: '#046241',
    textColor: 'text-white',
    image: 'url("https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop")'
  },
  {
    id: '06',
    category: 'Computer Vision',
    title: 'Computer Vision (CV)',
    description: 'Training AI to see and understand the world requires a high volume of quality training data. Lifewood provides total data solutions for your CV development from collection to annotation to classification and more, for video and image datasets enabling machines to interpret visual information. We have experience in a wide variety of applications including autonomous vehicles, farm monitoring, face recognition and more.',
    icon: <Eye className="w-6 h-6" />,
    color: 'from-cyan-500 to-blue-900',
    backgroundColor: '#133020',
    textColor: 'text-white',
    image: 'url("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop")'
  },
  {
    id: '07',
    category: 'Genealogy',
    title: 'Genealogy',
    description: (
      <div className="space-y-4">
        <p>
          Powered by AI, Lifewood processes genealogical material at speed and scale, to conserve and illuminate family histories, national archives, corporate lists and records of all types. Lifewood has more than 18 years of experience capturing, scanning and processing genealogical data. In fact, Lifewood started with genealogy data as its core business, so that over the years we have accumulated vast knowledge in diverse types of genealogy indexing.
        </p>
        <p>
          We have worked with all the major genealogy companies and have extensive experience in transcribing and indexing genealogical content in a wide variety of formats, including tabular, pre-printed forms and paragraph-style records.
        </p>
        <p>
          Working across borders, with offices on every continent, our ability with multi-language projects has built an extensive capability spanning more than 50 languages and associated dialects. Now, powered by AI and the latest inter-office communication systems, we are transforming ever more efficient ways to service our clients, while keeping humanity at the centre of our activity.
        </p>
        <div>
          <p className="font-semibold mb-2">Genealogical material that we have experience with includes:</p>
          <ul className="list-disc pl-5 grid grid-cols-2 gap-x-4">
            <li>Census</li>
            <li>Vital - BMD</li>
            <li>Church and Parish Registers</li>
            <li>Passenger Lists</li>
            <li>Naturalisation</li>
            <li>Military Records</li>
            <li>Legal Records</li>
            <li>Yearbooks</li>
          </ul>
        </div>
      </div>
    ),
    icon: <Scroll className="w-6 h-6" />,
    color: 'from-slate-500 to-slate-800',
    backgroundColor: '#FFC370',
    textColor: 'text-white',
    image: 'url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop")'
  }
];

export default function AiProjects() {
  const [expandedId, setExpandedId] = useState(null);
  const containerRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    // Entry animation for the container
    gsap.fromTo(containerRef.current,
      { opacity: 0, y: 100 },
      {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        },
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power4.out'
      }
    );

    // Title animation
    gsap.fromTo(titleRef.current,
      { opacity: 0, y: 50 },
      {
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 85%',
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
      }
    );
  }, []);

  const scrollContainer = (direction) => {
    if (containerRef.current) {
      const scrollAmount = window.innerWidth > 768 ? 400 : 300;
      containerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-gradient-to-b from-white to-[#F9F7F7] text-[#133020] py-24 min-h-screen overflow-hidden">
      <div className="container mx-auto px-4 mb-2 text-center md:text-left">
        <div className="mb-16">
          <h1 ref={titleRef} className="text-5xl md:text-6xl font-bold text-[#133020] mb-6">
            AI Projects
          </h1>
          <p className="text-base text-[#133020]/70 font-light leading-relaxed max-w-4xl mx-auto md:mx-0">
            From building AI datasets in diverse languages and environments, to developing platforms that enhance productivity and open new opportunities in under-resourced economies, you’ll see how Lifewood is shaping the future with innovation, integrity and a focus on people.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-8 md:mb-12 gap-6">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <p className="inline-block text-sm font-bold tracking-wider text-[#133020] bg-black/5 rounded-full px-4 py-1.5 mb-4">
              Projects
            </p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#133020]">
              What we currently handle
            </h2>
          </div>

          {/* Navigation Arrows */}
          <div className="flex gap-4 items-center">
            <button
              onClick={() => scrollContainer('left')}
              className="w-12 h-12 bg-white text-[#133020] rounded-full flex items-center justify-center shadow-md hover:shadow-lg hover:-translate-y-1 hover:bg-[#CCFF00] transition-all duration-300 border border-gray-100"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => scrollContainer('right')}
              className="w-12 h-12 bg-white text-[#133020] rounded-full flex items-center justify-center shadow-md hover:shadow-lg hover:-translate-y-1 hover:bg-[#CCFF00] transition-all duration-300 border border-gray-100"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto relative mt-4 group/slider">
        <style dangerouslySetInnerHTML={{
          __html: `
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}} />

        <div
          ref={containerRef}
          className="flex overflow-x-auto pb-16 pt-4 px-4 gap-4 md:gap-5 snap-x snap-mandatory w-full hide-scrollbar scroll-smooth"
        >
          {aiServices.map((service, index) => {
            const isExpanded = expandedId === service.id;
            const isHighlighted = isExpanded;

            return (
              <div
                key={service.id}
                className={`
                  flex-shrink-0 flex flex-col h-[600px] rounded-[32px] hide-scrollbar
                  ${isExpanded ? 'w-[92vw] sm:w-[500px] lg:w-[calc(40vw-1.5rem)] min-w-[340px] max-w-[600px] shadow-2xl scale-[1.01] overflow-y-auto' : 'w-[85vw] sm:w-[360px] lg:w-[calc(25vw-1.5rem)] min-w-[320px] max-w-[420px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] overflow-hidden'}
                  ${isHighlighted ? 'bg-[#CCFF00]' : 'bg-white'} 
                  transition-all duration-700 relative group snap-center md:snap-start
                `}
              >
                {/* Content Area */}
                <div className={`p-6 md:p-8 flex-1 flex flex-col relative z-10 transition-all duration-700 ${isExpanded ? 'pb-2' : ''}`}>
                  {/* Pill Tag */}
                  <div className="flex items-start mb-6">
                    <div className={`inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase ${isHighlighted ? 'bg-[#133020]/10 text-[#133020]' : 'bg-[#F9F7F7] text-[#133020]'}`}>
                      <div className="[&>svg]:w-4 [&>svg]:h-4">
                        {service.icon}
                      </div>
                      <span>{service.category}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className={`text-2xl font-bold mb-3 leading-tight ${isHighlighted ? 'text-[#133020]' : 'text-[#133020]'}`}>
                    {service.title}
                  </h3>

                  {/* Description with fading effect */}
                  <div className={`relative transition-all duration-700 ${isExpanded ? 'h-auto pb-6' : 'h-[12rem] overflow-hidden mb-2 opacity-100'}`}>
                    <div className={`text-base leading-relaxed font-light ${isExpanded ? '' : 'line-clamp-[8]'} ${isHighlighted ? 'text-[#133020]/80' : 'text-[#133020]/70'}`}>
                      {service.description}
                    </div>
                    {!isExpanded && (
                      <div className={`absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t ${isHighlighted ? 'from-[#CCFF00]' : 'from-white'} via-${isHighlighted ? '[#CCFF00]/80' : 'white/80'} to-transparent`} />
                    )}
                  </div>
                </div>

                {/* Image Area */}
                <div className="relative h-[280px] w-full rounded-t-[32px] overflow-hidden mt-auto flex-shrink-0">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: service.image }}
                  />
                  <div className="absolute inset-0 bg-[#133020]/5 group-hover:bg-transparent transition-colors duration-300" />

                  {/* Circular Arrow Button */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : service.id)}
                    className={`absolute left-1/2 -translate-x-1/2 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-xl cursor-pointer z-10 ${isExpanded ? 'bg-[#CCFF00] text-[#133020] hover:bg-[#bbe600] bottom-6' : 'bg-white text-[#133020] hover:bg-gray-50 bottom-6'}`}
                    aria-label={isExpanded ? "Collapse details" : "Expand details"}
                  >
                    <ArrowRight className={`w-6 h-6 transition-transform duration-500 ${isExpanded ? 'rotate-180' : '-rotate-45 group-hover:rotate-0'}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

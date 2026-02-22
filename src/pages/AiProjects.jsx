import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Brain, Cpu, Database, Eye, Globe, Layers, Zap, Car, MessageSquare, Mic, Scroll } from 'lucide-react';

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
  const [activeId, setActiveId] = useState('03'); // Default active card
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

  return (
    <div className="bg-gradient-to-b from-white to-[#F9F7F7] text-[#133020] py-24 min-h-screen overflow-hidden">
      <div className="container mx-auto px-4 mb-16">
        <div className="mb-20 text-left">
          <h1 ref={titleRef} className="text-5xl md:text-6xl font-bold text-[#133020] mb-6">
            AI Projects
          </h1>
          <p className="text-base text-[#133020]/70 font-light leading-relaxed">
            From building AI datasets in diverse languages and environments, to developing platforms that enhance productivity and open new opportunities in under-resourced economies, you’ll see how Lifewood is shaping the future  with innovation, integrity and a focus on people.
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <p className="inline-block text-sm font-bold tracking-wider text-white bg-[#133020] rounded-full px-4 py-1.5 mb-4">
            Projects
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-[#046241]">
            What we currently handle
          </h2>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex flex-col md:flex-row h-[600px] w-full px-2 gap-2"
      >
        {aiServices.map((service) => {
          const isActive = activeId === service.id;

          return (
            <div
              key={service.id}
              onClick={() => setActiveId(service.id)}
              className={`
                relative h-[200px] md:h-full rounded-[24px] overflow-hidden cursor-pointer
                border border-[#133020]/20
                transition-[flex-grow,width,opacity,transform,background-color] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]
                ${isActive ? 'flex-[10] md:flex-[4] shadow-2xl scale-[1.01]' : 'flex-[2] md:flex-[0.5]'}
                group shadow-lg
              `}
              style={{
                background: service.image,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Overlay for depth (only on inactive images) */}
              {!isActive && (
                <div className={`absolute inset-0 bg-black/20 transition-colors duration-500 pointer-events-none`} />
              )}

              {/* Active State Gradient Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-0'}`}
              />

              {/* Number (Only visible when active) */}
              {isActive && (
                <div className="absolute bottom-8 left-8 z-20">
                  <span className={`text-xl font-mono ${service.textColor} opacity-50`}>
                    {service.id}
                  </span>
                </div>
              )}

              {/* Active Content */}
              <div
                className={`
                  absolute top-0 left-0 w-full p-8 md:p-12 z-20 flex flex-col justify-start
                  transition-all duration-700 delay-100
                  ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-12 pointer-events-none'}
                `}
              >
                {/* Icon & Category */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg bg-white/10`}>
                    {/* Clone element to force color inheritance if needed, or just standard text color */}
                    <div className={service.textColor}>{service.icon}</div>
                  </div>
                  <span className={`text-sm font-bold uppercase tracking-wider ${service.textColor} opacity-80`}>
                    {service.category}
                  </span>
                </div>

                {/* Headline */}
                <h2 className={`text-2xl md:text-4xl font-bold leading-tight mb-4 ${service.textColor}`}>
                  {service.title}
                </h2>

                {/* Description */}
                <div className={`text-base md:text-lg text-gray-300 max-w-3xl font-light leading-relaxed mb-6`}>
                  {service.description}
                </div>


              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


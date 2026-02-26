import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Mic, Video, Image, FileText } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ServicesSection() {
    const sectionRef = useRef(null);
    const rowsRef = useRef([]);

    const services = [
        {
            id: 1,
            title: "Audio",
            description: "Collection, labelling, voice categorization, music categorization, intelligent cs.",
            icon: <Mic className="w-6 h-6 sm:w-8 sm:h-8" />,
            gradient: "from-[#046241] to-[#022c1d]",
            image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800" // Placeholder
        },
        {
            id: 2,
            title: "Video",
            description: "Collection, labelling, audit, live broadcast, subtitle generation",
            icon: <Video className="w-6 h-6 sm:w-8 sm:h-8" />,
            gradient: "from-[#FFB347] to-[#FFC370]",
            image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800" // Placeholder
        },
        {
            id: 3,
            title: "Image",
            description: "Collection, labelling, classification, audit, object detection and tagging",
            icon: <Image className="w-6 h-6 sm:w-8 sm:h-8" />,
            gradient: "from-[#046241] to-[#022c1d]",
            image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800" // Placeholder
        },
        {
            id: 4,
            title: "Text",
            description: "Text, collection, labelling, transcriptions, utterance collection, sentiment analysis",
            icon: <FileText className="w-6 h-6 sm:w-8 sm:h-8" />,
            gradient: "from-[#FFC370] to-[#FFB347]",
            image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800" // Placeholder
        }
    ];

    useEffect(() => {
        const rows = rowsRef.current;

        gsap.fromTo(rows,
            { opacity: 0, x: -50 },
            {
                opacity: 1,
                x: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                }
            }
        );
    }, []);

    return (
        <section ref={sectionRef} className="w-full bg-white py-20">
            <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                    <h1 className="text-6xl font-light text-[#133020] mb-4">AI Data Services</h1>
                    <p className="text-[#046241] text-lg">
                        Lifewood offers AI and IT services that enhance decision-making, reduce costs, and improve productivity to optimize organizational performance.
                    </p>
                </div>

                <div className="flex flex-col w-full">
                    {services.map((service, index) => (
                        <div
                            key={service.id}
                            ref={el => rowsRef.current[index] = el}
                            className="group relative w-full overflow-hidden border-b border-gray-200 last:border-b-0 transition-all duration-500 ease-in-out hover:h-[400px] h-[100px] sm:h-[120px]"
                        >
                            {/* Background with Gradient Overlay - Visible on Hover */}
                            <div className={`absolute inset-0 bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0`}></div>

                            {/* Optional: Background Image Overlay for extra premium feel */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 z-0 mix-blend-overlay">
                                <img src={service.image} alt="" className="w-full h-full object-cover" />
                            </div>

                            <div className="relative z-10 w-full h-full flex items-center px-6 sm:px-12">
                                <div className="flex flex-col sm:flex-row items-center sm:items-start w-full gap-6 sm:gap-12">

                                    {/* Icon & Title Section */}
                                    <div className="flex items-center gap-6 min-w-[300px]">
                                        <span className="text-3xl font-bold text-gray-300 group-hover:text-white/40 transition-colors duration-500">
                                            0{service.id}
                                        </span>
                                        <div className={`p-3 rounded-full bg-gray-100 text-[#046241] group-hover:bg-white/20 group-hover:text-white transition-all duration-500`}>
                                            {service.icon}
                                        </div>
                                        <h3 className="text-2xl font-bold text-[#133020] group-hover:text-white transition-colors duration-500 whitespace-nowrap">
                                            {service.title}
                                        </h3>
                                    </div>

                                    {/* Description & Link - Hidden initially, reveals on hover */}
                                    <div className="flex-1 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100 flex flex-col justify-center h-full">
                                        <p className="text-white/90 text-lg max-w-2xl mb-6">
                                            {service.description}
                                        </p>
                                        <a href="/ai-services" className="inline-flex items-center text-white font-semibold hover:underline">
                                            Learn more <ArrowRight className="ml-2 w-5 h-5" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

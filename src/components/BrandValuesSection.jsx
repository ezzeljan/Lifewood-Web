import { useState, useRef, useEffect } from 'react';

import gsap from 'gsap';

export default function BrandValuesSection() {
    const [activeTab, setActiveTab] = useState(0);
    const [prevTab, setPrevTab] = useState(0);
    const imageContainerRef = useRef(null);

    const brandValues = [
        {
            id: 0,
            number: "01",
            title: "Data Validation",
            content: "The goal is to create data that is consistent, accurate and complete, preventing data loss or errors in transfer, code or configuration. We verify that data conforms to predefined standards, rules or constraints, ensuring the information is trustworthy and fit for its intended purpose.",
            cta: "View Audit Protocols",
            image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: 1,
            number: "02",
            title: "Data Collection",
            content: "Lifewood delivers multi-modal data collection across text, audio, image, and video, supported by advanced workflows for categorization, labeling, tagging, transcription, sentiment analysis, and subtitle generation.",
            cta: "Explore Methodologies",
            image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: 2,
            number: "03",
            title: "Data Acquisition",
            content: "We provide end-to-end data acquisition solutions—capturing, processing, and managing large-scale, diverse datasets.",
            cta: "Learn About Sourcing",
            image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: 3,
            number: "04",
            title: "Data Curation",
            content: "We sift, select and index data to ensure reliability, accessibility and ease of classification. Data can be curated to support business decisions, academic research, genealogies, scientific research and more.",
            cta: "See Curation Process",
            image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: 4,
            number: "05",
            title: "Data Annotation",
            content: "In the age of AI, data is the fuel for all analytic and machine learning. With our in-depth library of services, we’re here to be an integral part of your digital strategy, accelerating your organization’s cognitive systems development.",
            cta: "Start Your Project",
            image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800"
        }
    ];

    const handleTabClick = (index) => {
        if (index !== activeTab) {
            setPrevTab(activeTab);
            setActiveTab(index);
        }
    };

    return (
        <section className="w-full bg-white py-8 sm:py-12 overflow-hidden">
            <div className="w-full mx-auto px-6 sm:px-8 lg:px-12">
                <div className="flex flex-col lg:flex-row gap-2 lg:gap-3 items-stretch">

                    {/* Left Side - Image Showcase */}
                    <div className="w-full lg:w-1/2 relative min-h-[500px] lg:min-h-0 lg:h-auto rounded-[32px] overflow-hidden">
                        {brandValues.map((item, index) => (
                            <div
                                key={item.id}
                                className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out transform
                                    ${activeTab === index ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'}
                                `}
                            >
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/20" /> {/* Subtle overlay */}
                            </div>
                        ))}
                    </div>

                    {/* Right Side - Accordion Content */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center gap-6">


                        <div className="flex flex-col gap-4">
                            {brandValues.map((item, index) => {
                                const isActive = activeTab === index;
                                const isEven = index % 2 === 0;

                                // Dynamic styles based on index (even/odd) and active state
                                const getCardBg = () => {
                                    if (isActive) {
                                        return isEven ? 'bg-[#133020]' : 'bg-[#FFB347]';
                                    }
                                    return 'bg-white hover:bg-gray-50'; // Default state when collapsed
                                };

                                const getTextColor = (element) => {
                                    if (!isActive) return element === 'label' || element === 'number' ? 'text-gray-400' : 'text-[#133020]'; // Collapsed text colors

                                    // Active state text colors
                                    if (isEven) { // Dark Green Bg
                                        if (element === 'label') return 'text-[#FFB347]';
                                        if (element === 'number') return 'text-white/20';
                                        if (element === 'title') return 'text-white';
                                        if (element === 'content') return 'text-white/80';
                                        if (element === 'link') return 'text-white hover:text-[#FFB347]';
                                    } else { // Orange Bg
                                        if (element === 'label') return 'text-[#133020]';
                                        if (element === 'number') return 'text-[#133020]/20';
                                        if (element === 'title') return 'text-[#133020]';
                                        if (element === 'content') return 'text-[#133020]/80';
                                        if (element === 'link') return 'text-[#133020] hover:text-white';
                                    }
                                };

                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => handleTabClick(index)}
                                        className={`group relative rounded-[24px] cursor-pointer transition-all duration-500 ease-out border border-gray-100 overflow-hidden
                                            ${isActive ? 'py-8 px-8' : 'py-6 px-8'}
                                            ${getCardBg()}
                                        `}
                                    >
                                        <div className="flex justify-between items-center mb-2">

                                            <span className={`text-2xl font-light font-mono transition-colors duration-300
                                                ${getTextColor('number')}
                                            `}>
                                                {item.number}
                                            </span>
                                        </div>

                                        <h3 className={`text-2xl font-bold mb-2 transition-all duration-300
                                            ${getTextColor('title')}
                                            ${isActive ? 'opacity-100 translate-y-0' : 'opacity-80 group-hover:opacity-100'}
                                        `}>
                                            {item.title}
                                        </h3>

                                        <div className={`grid transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
                                            ${isActive ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}
                                        `}>
                                            <div className="overflow-hidden">
                                                <p className={`text-lg leading-relaxed mb-6 ${getTextColor('content')}`}>
                                                    {item.content}
                                                </p>

                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

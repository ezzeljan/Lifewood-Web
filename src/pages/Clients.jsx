import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import appleLogo from '../assets/clients/apple.png';
import googleLogo from '../assets/clients/google.png';
import microsoftLogo from '../assets/clients/microsoft.png';
import ancestryLogo from '../assets/clients/ancestry.png';
import byuLogo from '../assets/clients/byu.png';
import familySearchLogo from '../assets/clients/familysearch.png';
import mooreLogo from '../assets/clients/moore.png';
import './Clients.css';
const CLIENT_LOGOS = [
    { name: 'Google', imgUrl: googleLogo },
    { name: 'Apple', imgUrl: appleLogo },
    { name: 'Microsoft', imgUrl: microsoftLogo },
    { name: 'Ancestry', imgUrl: ancestryLogo },
    { name: 'BYU', imgUrl: byuLogo },
    { name: 'FamilySearch', imgUrl: familySearchLogo },
    { name: 'Moore', imgUrl: mooreLogo },
];

export default function Clients() {

    return (
        <section className="clients-page bg-transparent py-20 relative overflow-hidden">
            <div className="relative w-full max-w-[1440px] px-6 md:px-12 z-10 mx-auto flex flex-col items-center justify-center min-h-[80vh]">

                {/* Header Text Section */}
                <div className="hero-text-container z-0 relative pointer-events-none flex flex-col items-center text-center w-full max-w-4xl text-[#000000]">
                    <h1 className="mb-6 leading-tight w-full text-[#000000]" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 400, letterSpacing: '-0.02em' }}>
                        Clients and Partners
                    </h1>

                    <div className="pointer-events-auto px-4">
                        <p className="text-base font-medium mb-8 leading-relaxed opacity-90 max-w-2xl mx-auto text-[#666]">
                            We are proud to partner and work with leading organizations worldwide in transforming data into meaningful solutions. Lifewood’s commitment to innovation and excellence has earned the trust of global brands across industries. Here are some of the valued clients and partners we’ve collaborated with:
                        </p>
                    </div>
                </div>

                {/* Marquee Container */}
                <div className="clients-marquee-wrapper mt-16 w-full overflow-hidden">
                    <div className="clients-marquee">
                        {/* Duplicate logos to create seamless loop */}
                        {[...CLIENT_LOGOS, ...CLIENT_LOGOS].map((client, i) => (
                            <div key={`client-${i}`} className="client-logo-item">
                                <img
                                    src={client.imgUrl}
                                    alt={client.name}
                                    className="client-logo-img"
                                />
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}

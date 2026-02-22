import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import appleLogo from '../assets/apple.png';
import StickerPeel from '../components/StickerPeel';
import './Clients.css';

gsap.registerPlugin(ScrollTrigger);


const STICKER_LAYOUT = [
    { left: '12%', top: '25%', size: '12%', imgUrl: 'https://ui-avatars.com/api/?name=Google&background=random&color=fff&rounded=true&bold=true' }, // Top left
    { left: '72%', top: '20%', size: '11%', imgUrl: appleLogo }, // Top right
    { left: '8%', top: '65%', size: '13%' }, // Bottom left
    { left: '78%', top: '70%', size: '12%' }, // Bottom right
    { left: '28%', top: '80%', size: '10%' }, // Bottom middle-left
    { left: '82%', top: '45%', size: '9%' }, // Right middle
    { left: '48%', top: '82%', size: '11%' }, // Bottom middle
];

// Generate exactly 7 layered sticker definitions
const STICKERS = STICKER_LAYOUT.map((layout, i) => {
    return {
        id: `sticker-${i}`,
        left: layout.left,
        top: layout.top,
        width: layout.size,
        imgUrl: layout.imgUrl || `https://ui-avatars.com/api/?name=${i}&background=random&color=fff&rounded=true&bold=true`,
        rotation: (Math.random() - 0.5) * 60, // random rotation for layout
    };
});

export default function Clients() {
    const stickersRef = useRef([]);

    return (
        <section className="clients-page bg-transparent py-20 relative overflow-hidden">
            <div className="relative w-full max-w-[1440px] px-6 md:px-12 z-10 mx-auto flex flex-col items-center justify-center min-h-[80vh]">

                {/* Header Text Section */}
                <div className="hero-text-container z-0 relative pointer-events-none flex flex-col items-center text-center w-full max-w-4xl text-[#133020]">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl mb-6 font-bold leading-tight tracking-tighter w-full">
                        Clients and <br /> Partners
                    </h1>

                    <div className="pointer-events-auto px-4">
                        <p className="text-lg md:text-xl font-medium mb-8 leading-relaxed opacity-90 max-w-2xl mx-auto text-[#666]">
                            We are proud to partner and work with leading organizations worldwide in transforming data into meaningful solutions. Lifewood’s commitment to innovation and excellence has earned the trust of global brands across industries. Here are some of the valued clients and partners we’ve collaborated with:
                        </p>
                    </div>
                </div>

                {/* Sticker Collage Container */}
                <div className="sticker-collage-container absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 w-full h-full min-h-[600px]">
                    {STICKERS.map((sticker, i) => (
                        <div
                            key={sticker.id}
                            ref={el => stickersRef.current[i] = el}
                            className="sticker absolute"
                            style={{
                                left: sticker.left,
                                top: sticker.top,
                                width: sticker.width,
                                aspectRatio: '1/1',
                                transform: `rotate(${sticker.rotation}deg)`,
                                '--sticker-responsive-width': '120px'
                            }}
                        >


                            {/* Foreground Image layer */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-auto filter drop-shadow-xl">
                                <StickerPeel
                                    imageSrc={sticker.imgUrl}
                                    width="var(--sticker-responsive-width)"
                                    peelDirection={i % 2 === 0 ? 30 : -30}
                                    shadowIntensity={0.8}
                                    dragBounds={null}
                                />
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}

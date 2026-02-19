import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CurvedMarquee() {
    const textRef = useRef(null);

    useEffect(() => {
        // Animate the startOffset of the textPath to create scrolling effect
        gsap.to(textRef.current, {
            attr: { startOffset: '-100%' },
            duration: 20,
            ease: 'none',
            repeat: -1
        });
    }, []);

    return (
        <section className="w-full overflow-hidden bg-transparent py-0 relative pointer-events-none">
            <div className="w-full relative h-[200px] flex items-center justify-center">
                <svg
                    viewBox="0 0 1000 300"
                    width="100%"
                    height="100%"
                    preserveAspectRatio="none"
                    className="w-full h-full absolute top-0 left-0"
                >
                    <path
                        id="curve"
                        d="M 0 50 Q 500 250 1000 50"
                        fill="transparent"
                    />
                    <text width="100%">
                        <textPath
                            ref={textRef}
                            href="#curve"
                            startOffset="0%"
                            className="text-[4rem] font-black uppercase fill-[#133020]"
                            style={{
                                fontSize: '80px',
                                fontWeight: '900',
                                fill: '#133020',
                                letterSpacing: '10px'
                            }}
                        >
                            LIFEWOOD  LIFEWOOD  LIFEWOOD  LIFEWOOD  LIFEWOOD  LIFEWOOD
                        </textPath>
                    </text>
                </svg>
            </div>
        </section>
    );
}

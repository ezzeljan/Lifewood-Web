import React from 'react';

const row1 = ["United States", "Brazil", "United Kingdom", "Germany", "Finland"];
const row2 = ["Africa", "South Africa", "Madagascar", "Middle East", "India", "Bangladesh", "China", "Thailand", "Malaysia", "Vietnam"];
const row3 = ["Hongkong", "Philippines", "Indonesia", "Japan", "Australia"];

const images = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80"
];

export default function Offices() {
  return (
    <main className="page section">
      <div className="container mx-auto px-4 pt-12 pb-8">
        <h1 className="section-title text-4xl font-bold text-center mb-4 text-[#046241]">Largest Global Data Collection Resources Distribution</h1>
        <p className="section-subtitle text-center mb-8 text-[#133020]/70">Our global office locations.</p>
      </div>

      {/* Marquee Section - Full Width */}
      <div className="w-screen relative left-1/2 -translate-x-1/2 py-4 space-y-2 overflow-hidden bg-gray-50/50">
        {/* Row 1 - Scroll Right */}
        <div className="flex overflow-hidden">
          <div className="flex animate-marquee-right whitespace-nowrap py-1">
            {[...row1, ...row1, ...row1, ...row1].map((item, index) => (
              <React.Fragment key={index}>
                <span className="inline-block px-8 py-4 rounded-xl bg-[#133020] text-white text-3xl md:text-5xl font-bold mx-1 align-middle">
                  {item}
                </span>
                <img
                  src={images[index % images.length]}
                  alt=""
                  className="inline-block h-20 w-32 object-cover rounded-xl mx-1 align-middle"
                />
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Row 2 - Scroll Left */}
        <div className="flex overflow-hidden">
          <div className="flex animate-marquee-left whitespace-nowrap py-1">
            {[...row2, ...row2, ...row2].map((item, index) => (
              <React.Fragment key={index}>
                <span className="inline-block px-8 py-4 rounded-xl bg-[#046241] text-white text-3xl md:text-5xl font-bold mx-1 align-middle">
                  {item}
                </span>
                <img
                  src={images[(index + 3) % images.length]}
                  alt=""
                  className="inline-block h-20 w-32 object-cover rounded-xl mx-1 align-middle"
                />
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Row 3 - Scroll Right */}
        <div className="flex overflow-hidden">
          <div className="flex animate-marquee-right whitespace-nowrap py-1">
            {[...row3, ...row3, ...row3, ...row3].map((item, index) => (
              <React.Fragment key={index}>
                <span className="inline-block px-8 py-4 rounded-xl bg-[#FFB347] text-[#133020] text-3xl md:text-5xl font-bold mx-1 align-middle">
                  {item}
                </span>
                <img
                  src={images[(index + 6) % images.length]}
                  alt=""
                  className="inline-block h-20 w-32 object-cover rounded-xl mx-1 align-middle"
                />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="w-full h-screen rounded-3xl overflow-hidden shadow-2xl mt-8">
          <iframe
            src="https://lifewoodworldwidemap.vercel.app/"
            title="Lifewood Worldwide Map"
            className="w-full h-full border-none"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </main>
  );
}

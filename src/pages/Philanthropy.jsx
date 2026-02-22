import React from 'react';
import OrbitImages from '../components/OrbitImages';
import Grainient from '../components/Grainient';
import './Philanthropy.css';

export default function Philanthropy() {
  const orbitImageUrls = [
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=150&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=150&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=150&q=80&auto=format&fit=crop",
  ];

  return (
    <main className="page section flex flex-col items-center">
      <div className="w-full pt-0 pb-2">
        <h1 className="section-title text-5xl md:text-6xl font-bold text-left px-8 mb-4 text-[#046241]">Transforming Communities <br></br> Worldwide</h1>
      </div>

      <div className="w-full my-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Column: Orbit */}
          <section className="w-full relative flex flex-col items-center justify-center overflow-hidden h-[350px] md:h-[400px]">
            <OrbitImages
              images={orbitImageUrls}
              responsive={true}
              baseWidth={1000}
              radiusX={350}
              radiusY={120}
              showPath={true}
              pathColor="#046241"
              pathWidth={2}
              itemSize={160}
              duration={50}
            />
          </section>

          {/* Right Column: Text */}
          <div className="flex flex-col justify-center text-center lg:text-left px-4 lg:px-8">
            <p className="text-base leading-relaxed text-[#133020]/80 font-light">
              Our vision is of a world where financial investment plays a central role in solving the social and environmental challenges facing the global community, specifically in Africa and the Indian sub-continent.
            </p>
          </div>
        </div>
      </div>
      <div className="w-full pb-8">
        <div className="w-full h-[45vh] min-h-[350px] overflow-hidden shadow-xl mt-4">
          <iframe
            src="https://lifewoodafricamap.vercel.app/"
            title="Lifewood Africa Impact Map"
            className="w-full h-full border-none"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* 4 Rows of Full Width Grids with 2 Columns Each */}
      <div className="w-full py-8">
        {/* Row 1 */}
        <div className="relative group grid grid-cols-1 md:grid-cols-2 gap-12 py-10 border-b border-gray-200 overflow-hidden">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none -z-10">
            <Grainient
              color1="#046241"
              color2="#133020"
              color3="#0a4d33"
              grainAmount={0.05}
              timeSpeed={0.1}
            />
          </div>
          <div className="flex flex-col justify-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[#046241] group-hover:text-white transition-colors duration-300 mb-4">Impact</h2>
          </div>
          <div className="flex flex-col justify-center relative z-10">
            <p className="text-base text-[#133020]/80 group-hover:text-white/90 transition-colors duration-300 leading-relaxed">
              Through purposeful partnerships and sustainable investment, we empower communities across Africa and the Indian sub-continent to create lasting economic and social transformation.
            </p>
          </div>
        </div>

        {/* Row 2 */}
        <div className="relative group grid grid-cols-1 md:grid-cols-2 gap-12 py-10 border-b border-gray-200 overflow-hidden">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none -z-10">
            <Grainient
              color1="#046241"
              color2="#133020"
              color3="#0a4d33"
              grainAmount={0.05}
              timeSpeed={0.1}
            />
          </div>
          <div className="flex flex-col justify-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[#046241] group-hover:text-white transition-colors duration-300 mb-4">Partnership</h2>
          </div>
          <div className="flex flex-col justify-center relative z-10">
            <p className="text-base text-[#133020]/80 group-hover:text-white/90 transition-colors duration-300 leading-relaxed">
              In partnership with our philanthropic partners, Lifewood has expanded operations in South Africa, Nigeria, Republic of the Congo, Democratic Republic of the Congo, Ghana, Madagascar, Benin, Uganda, Kenya, Ivory Coast, Egypt, Ethiopia, Niger, Tanzania, Namibia, Zambia, Zimbabwe, Liberia, Sierra Leone, and Bangladesh.
            </p>
          </div>
        </div>

        {/* Row 3 */}
        <div className="relative group grid grid-cols-1 md:grid-cols-2 gap-12 py-10 border-b border-gray-200 overflow-hidden">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none -z-10">
            <Grainient
              color1="#046241"
              color2="#133020"
              color3="#0a4d33"
              grainAmount={0.05}
              timeSpeed={0.1}
            />
          </div>
          <div className="flex flex-col justify-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[#046241] group-hover:text-white transition-colors duration-300 mb-4">Application</h2>
          </div>
          <div className="flex flex-col justify-center relative z-10">
            <p className="text-base text-[#133020]/80 group-hover:text-white/90 transition-colors duration-300 leading-relaxed">
              This requires the application of our methods and experience for the development of people in under resourced economies.
            </p>
          </div>
        </div>

        {/* Row 4 */}
        <div className="relative group grid grid-cols-1 md:grid-cols-2 gap-12 py-10 overflow-hidden">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none -z-10">
            <Grainient
              color1="#046241"
              color2="#133020"
              color3="#0a4d33"
              grainAmount={0.05}
              timeSpeed={0.1}
            />
          </div>
          <div className="flex flex-col justify-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[#046241] group-hover:text-white transition-colors duration-300 mb-4">Expanding</h2>

          </div>
          <div className="flex flex-col justify-center relative z-10">
            <p className="text-base text-[#133020]/80 group-hover:text-white/90 transition-colors duration-300 leading-relaxed">

              We are expanding access to training, establishing equiatable wage structures and career and leadership progression to create sustainable change, by equipping individuals to take the lead and grow the business for themselves for the long term benefit of everyone.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

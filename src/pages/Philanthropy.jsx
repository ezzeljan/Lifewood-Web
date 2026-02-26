import React from 'react';
import Grainient from '../components/Grainient';
import './Philanthropy.css';

export default function Philanthropy() {

  return (
    <main className="page flex flex-col items-center pb-8">
      {/* Full Width Image with Overlay Text */}
      <div className="w-full relative h-[400px] md:h-[500px] lg:h-[600px] mb-8">
        <img
          src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600&q=80&auto=format&fit=crop"
          alt="Philanthropy and Community"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay to make text pop */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-4">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white text-center leading-tight drop-shadow-md">
            Transforming Communities <br /> Worldwide
          </h1>
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto mb-8 px-6">
        <p className="text-lg md:text-xl lg:text-2xl leading-relaxed text-[#133020]/90 font-light text-center">
          Our vision is of a world where financial investment plays a central role in solving the social and environmental challenges facing the global community, specifically in Africa and the Indian sub-continent.
        </p>
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

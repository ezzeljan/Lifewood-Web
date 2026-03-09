import React from 'react';
import { Link } from 'react-router-dom';
import Grainient from '../components/Grainient';
import impact1 from '../assets/philanthropy/impact1.png';
import impact2 from '../assets/philanthropy/impact2.png';
import impact3 from '../assets/philanthropy/impact3.png';
import './Philanthropy.css';

export default function Philanthropy() {

  return (
    <main className="page flex flex-col items-center pb-8">
      {/* Two-Column Header */}
      <div className="w-full max-w-7xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col justify-center items-start gap-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#133020] leading-tight">
            Transforming Communities <br /> Worldwide
          </h1>
          <p className="text-lg md:text-xl text-[#133020]/80 font-light leading-relaxed max-w-lg">
            We direct resources into education and developmental projects that create lasting change. Our approach goes beyond giving: it builds sustainable growth and empowers communities for the future.
          </p>
          <Link to="/contact" style={{ textDecoration: 'none' }}>
            <button className="bg-[#FFB347] text-[#133020] px-8 py-3 rounded-full font-semibold hover:bg-[#FFC370] transition-all duration-300 shadow-md hover:shadow-lg mt-2">
              Contact Us
            </button>
          </Link>
        </div>
        <div className="w-full relative h-[400px] md:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600&q=80&auto=format&fit=crop"
            alt="Philanthropy and Community"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto mb-12 px-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-8 lg:col-span-9">
          <p className="text-lg md:text-xl lg:text-2xl leading-relaxed text-[#133020]/90 font-light">
            Our vision is of a world where financial investment plays a central role in solving the social and environmental challenges facing the global community, specifically in Africa and the Indian sub-continent.
          </p>
        </div>
        <div className="flex md:justify-end justify-start md:col-span-4 lg:col-span-3">
          <Link to="/about" style={{ textDecoration: 'none' }}>
            <button className="bg-[#133020] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#0a1a11] transition-all duration-300 shadow-md hover:shadow-lg">
              Know Us Better
            </button>
          </Link>
        </div>
      </div>
      <div className="w-full pb-8 px-4 md:px-8 max-w-[1920px] mx-auto">
        <div className="w-full max-w-7xl mx-auto mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="hidden lg:flex flex-col justify-start gap-4 w-full h-full bg-transparent pt-0 p-6">
            <h2 className="text-3xl font-bold text-[#133020]">Impact</h2>
            <p className="text-[#133020]/80 leading-relaxed font-light text-base">
              Through purposeful partnerships and sustainable investment, we empower communities across Africa and the Indian sub-continent to create lasting economic and social transformation.
            </p>
          </div>
          <div className="lg:col-span-2 w-full h-[45vh] min-h-[350px] overflow-hidden shadow-xl rounded-2xl border border-[#133020]/10">
            <iframe
              src="https://lifewoodafricamap.vercel.app/"
              title="Lifewood Africa Impact Map"
              className="w-full h-full border-none"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>

      {/* 3 Column Image Cards Section */}
      <div className="w-full py-12 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Card 1: Partnership */}
          <div className="relative overflow-hidden rounded-3xl min-h-[450px] flex items-end group shadow-xl">
            <img
              src={impact1}
              alt="Partnership in action"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Dark gradient overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

            <div className="relative z-10 w-full transform transition-transform duration-500 md:translate-y-4 group-hover:translate-y-0 h-full flex flex-col justify-between p-3 md:p-4">
              <div className="flex justify-start">
                <div className="bg-white/10 backdrop-blur-md rounded-full py-2 px-6 shadow-md inline-block">
                  <h2 className="text-xl md:text-2xl font-bold text-white m-0">Partnership</h2>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-[2.5rem] p-3 md:p-4 shadow-2xl w-full">
                <p className="text-white/80 text-[11px] md:text-xs leading-relaxed font-extralight line-clamp-4">
                  In partnership with our philanthropic partners, Lifewood has expanded operations in South Africa, Nigeria, Republic of the Congo, Democratic Republic of the Congo, Ghana, Madagascar, Benin, Uganda, Kenya, Ivory Coast, Egypt, Ethiopia, Niger, Tanzania, Namibia, Zambia, Zimbabwe, Liberia, Sierra Leone, and Bangladesh.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Application */}
          <div className="relative overflow-hidden rounded-3xl min-h-[450px] flex items-end group shadow-xl bg-gray-100">
            <img
              src={impact3}
              alt="Application of methods"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

            <div className="relative z-10 w-full transform transition-transform duration-500 md:translate-y-4 group-hover:translate-y-0 h-full flex flex-col justify-between p-3 md:p-4">
              <div className="flex justify-start">
                <div className="bg-white/10 backdrop-blur-md rounded-full py-2 px-6 shadow-md inline-block">
                  <h2 className="text-xl md:text-2xl font-bold text-white m-0">Application</h2>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-[2.5rem] p-3 md:p-4 shadow-2xl w-full">
                <p className="text-white/80 text-[11px] md:text-xs leading-relaxed font-extralight">
                  This requires the application of our methods and experience for the development of people in under resourced economies.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Expanding */}
          <div className="relative overflow-hidden rounded-3xl min-h-[450px] flex items-end group shadow-xl">
            <img
              src={impact3}
              alt="Expanding the business"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

            <div className="relative z-10 w-full transform transition-transform duration-500 md:translate-y-4 group-hover:translate-y-0 h-full flex flex-col justify-between p-3 md:p-4">
              <div className="flex justify-start">
                <div className="bg-white/10 backdrop-blur-md rounded-full py-2 px-6 shadow-md inline-block">
                  <h2 className="text-xl md:text-2xl font-bold text-white m-0">Expanding</h2>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-[2.5rem] p-3 md:p-4 shadow-2xl w-full">
                <p className="text-white/80 text-[11px] md:text-xs leading-relaxed font-extralight line-clamp-4">
                  We are expanding access to training, establishing equiatable wage structures and career and leadership progression to create sustainable change, by equipping individuals to take the lead and grow the business for themselves for the long term benefit of everyone.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

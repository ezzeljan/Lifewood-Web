const fs = require('fs');
const file = 'd:\\Lifewood-web\\Lifewood-Web\\src\\pages\\AiProjects.jsx';
let data = fs.readFileSync(file, 'utf8');

// Replace imports
data = data.replace("import { useState, useRef, useEffect } from 'react';", "import { useRef, useEffect } from 'react';");

// Replace default function header
data = data.replace(/const \[activeId, setActiveId\] = useState\('03'\); \/\/ Default active card\n\s*/g, '');

// Find return block
const returnIndex = data.indexOf('  return (\n');
if (returnIndex === -1) throw new Error("Could not find return block");

const newContent = `  return (
    <div className="bg-gradient-to-b from-white to-[#F9F7F7] text-[#133020] py-24 min-h-screen overflow-hidden">
      <div className="container mx-auto px-4 mb-2">
        <div className="mb-16 text-left">
          <h1 ref={titleRef} className="text-5xl md:text-6xl font-bold text-[#133020] mb-6">
            AI Projects
          </h1>
          <p className="text-base text-[#133020]/70 font-light leading-relaxed max-w-4xl">
            From building AI datasets in diverse languages and environments, to developing platforms that enhance productivity and open new opportunities in under-resourced economies, you’ll see how Lifewood is shaping the future with innovation, integrity and a focus on people.
          </p>
        </div>

        <div className="flex flex-col items-start md:items-center md:text-center mb-12">
          <p className="inline-block text-sm font-bold tracking-wider text-white bg-[#133020] rounded-full px-4 py-1.5 mb-4">
            Projects
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-[#046241]">
            What we currently handle
          </h2>
        </div>
      </div>

      <div className="w-full relative">
        <style dangerouslySetInnerHTML={{__html: \\\`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        \\\`}} />
        <div
          ref={containerRef}
          className="flex overflow-x-auto pb-16 pt-4 px-4 md:px-8 gap-6 snap-x snap-mandatory w-full hide-scrollbar"
        >
          {aiServices.map((service, index) => {
            const isHighlighted = index === 0;

            return (
              <div
                key={service.id}
                className={\\\`
                  flex-shrink-0 flex flex-col w-[85vw] sm:w-[340px] lg:w-[calc(25vw-2rem)] min-w-[300px] xl:max-w-[400px] h-[550px] rounded-[24px] 
                  \\\${isHighlighted ? 'bg-[#DCFF50]' : 'bg-white'} 
                  shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] 
                  transition-all duration-300 relative group p-2 snap-center md:snap-start
                \\\`}
              >
                {/* Content Area */}
                <div className="p-6 md:p-8 flex-1 flex flex-col">
                  {/* Pill Tag */}
                  <div className="flex items-start mb-6">
                    <div className={\\\`inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase \\\${isHighlighted ? 'bg-black/10 text-[#133020]' : 'bg-[#F9F7F7] text-[#133020]'}\\\`}>
                      <div className="[&>svg]:w-4 [&>svg]:h-4">
                        {service.icon}
                      </div>
                      <span>{service.category}</span>
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className={\\\`text-2xl font-bold mb-3 leading-tight \\\${isHighlighted ? 'text-[#133020]' : 'text-[#133020]'}\\\`}>
                    {service.title}
                  </h3>
                  
                  {/* Description with fading effect */}
                  <div className="relative h-[4.5rem] overflow-hidden mb-2">
                    <div className={\\\`text-sm leading-relaxed font-light \\\${isHighlighted ? 'text-[#133020]/80' : 'text-[#133020]/70'}\\\`}>
                      {service.description}
                    </div>
                    <div className={\\\`absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t \\\${isHighlighted ? 'from-[#DCFF50]' : 'from-white'} to-transparent\\\`} />
                  </div>
                </div>

                {/* Image Area */}
                <div className="relative h-[260px] w-full rounded-[20px] overflow-hidden mt-auto">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: service.image }}
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
                  
                  {/* Circular Arrow Button */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-white text-[#133020] rounded-full flex items-center justify-center shadow-lg group-hover:bg-[#133020] group-hover:text-white transition-all duration-300 cursor-pointer overflow-hidden z-10">
                    <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}`;

data = data.substring(0, returnIndex) + newContent;
fs.writeFileSync(file, data);
console.log("Success");

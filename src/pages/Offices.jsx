import React from 'react';

export default function Offices() {
  return (
    <main className="page overflow-hidden" style={{ marginTop: 0 }}>
      <section style={{
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '0',
        paddingBottom: '0'
      }}>
        <div className="w-full relative z-10">
          <h1 className="section-title text-5xl md:text-6xl font-bold text-left mb-4 text-[#046241] px-8 leading-tight">
            Largest Global Data Collection<br />Resources Distribution
          </h1>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-12">
        <div className="w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl mt-8">
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

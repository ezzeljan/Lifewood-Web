import React from 'react';
import DomeGallery from '../components/DomeGallery';

// Import career images for gallery
import team1 from '../assets/careers/team_collaboration_1_1771797291139.png';
import office1 from '../assets/careers/office_workspace_1_1771797311397.png';
import event1 from '../assets/careers/company_event_1_1771797330736.png';
import meeting1 from '../assets/careers/team_meeting_1_1771797346663.png';
import culture1 from '../assets/careers/office_culture_1_1771797368830.png';
import tech1 from '../assets/careers/tech_collaboration_1_1771797385702.png';

export default function Offices() {
  const galleryImages = [
    { src: team1, alt: 'Team Collaboration' },
    { src: office1, alt: 'Office Workspace' },
    { src: event1, alt: 'Company Event' },
    { src: meeting1, alt: 'Team Meeting' },
    { src: culture1, alt: 'Office Culture' },
    { src: tech1, alt: 'Tech Collaboration' },
  ];

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
        {/* Background DomeGallery */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          opacity: 0.3,
          transform: 'scale(1.2)'
        }}>
          <DomeGallery
            images={galleryImages}
            autoSpin={true}
            autoSpinSpeed={0.03}
            grayscale={true}
            overlayBlurColor="#ffffff"
            fit={0.7}
          />
        </div>

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

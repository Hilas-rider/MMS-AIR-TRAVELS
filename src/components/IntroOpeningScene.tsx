import React, { useState, useEffect } from 'react';

interface IntroOpeningSceneProps {
  onComplete: (targetTab?: string) => void;
  onOpenWhatsApp?: () => void;
}

export const IntroOpeningScene: React.FC<IntroOpeningSceneProps> = ({
  onComplete,
  onOpenWhatsApp
}) => {
  const [isLeaving, setIsLeaving] = useState(false);

  const word = "MMS AIR TRAVELS";

  const handleExit = (targetTab?: string) => {
    setIsLeaving(true);
    setTimeout(() => {
      onComplete(targetTab);
    }, 500);
  };

  // Keyboard escape or space to skip
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        handleExit();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div 
      onClick={() => handleExit()}
      className={`fixed inset-0 z-[9999] overflow-hidden select-none transition-opacity duration-500 cursor-pointer ${
        isLeaving ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        background: 'radial-gradient(ellipse at 50% 18%, rgba(0,96,151,0.45) 0%, rgba(11,25,44,0) 65%), linear-gradient(180deg, #0b192c 0%, #12233c 55%, #1e3e62 100%)',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}
    >
      <style>{`
        @keyframes mmsGridFade {
          to { opacity: 1; }
        }
        @keyframes mmsRadarSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes mmsRiseIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes mmsBadgeIn {
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes mmsFlapDown {
          0% { transform: rotateX(0deg); opacity: 1; }
          80% { opacity: 1; }
          100% { transform: rotateX(-100deg); opacity: 0; }
        }
        @keyframes mmsDrawTrail {
          to { stroke-dashoffset: 0; }
        }
        @keyframes mmsFlyPlane {
          0% { offset-distance: 0%; -webkit-offset-distance: 0%; opacity: 0; }
          8% { opacity: 1; }
          100% { offset-distance: 100%; -webkit-offset-distance: 100%; opacity: 1; }
        }

        .mms-plane-track {
          -webkit-offset-path: path("M -60,600 C 300,520 560,500 800,440 C 1040,380 1300,300 1560,190");
          offset-path: path("M -60,600 C 300,520 560,500 800,440 C 1040,380 1300,300 1560,190");
          offset-rotate: auto;
          offset-distance: 0%;
          animation: mmsFlyPlane 2.6s cubic-bezier(.3,.6,.3,1) 0.8s forwards;
        }

        .mms-flight-trail {
          stroke-dasharray: 1300;
          stroke-dashoffset: 1300;
          animation: mmsDrawTrail 2.6s cubic-bezier(.3,.6,.3,1) 0.8s forwards;
        }

        .mms-tagline-anim {
          opacity: 0;
          animation: mmsRiseIn 0.8s ease-out 0.2s forwards;
        }
        .mms-badge-anim {
          opacity: 0;
          animation: mmsBadgeIn 0.8s cubic-bezier(.2,.8,.2,1) 0.3s forwards;
        }
        .mms-flighttag-anim {
          opacity: 0;
          animation: mmsRiseIn 0.8s ease-out 0.5s forwards;
        }
        .mms-headline-anim {
          opacity: 0;
          animation: mmsRiseIn 0.9s ease-out 1.1s forwards;
        }
        .mms-subtext-anim {
          opacity: 0;
          animation: mmsRiseIn 0.9s ease-out 1.4s forwards;
        }
        .mms-cta-anim {
          opacity: 0;
          animation: mmsRiseIn 0.9s ease-out 1.7s forwards;
        }
        .mms-branches-anim {
          opacity: 0;
          animation: mmsRiseIn 0.9s ease-out 1.9s forwards;
        }
        .mms-badge-from {
          opacity: 0;
          animation: mmsRiseIn 0.6s ease-out 0.9s forwards;
        }
        .mms-badge-to {
          opacity: 0;
          animation: mmsRiseIn 0.6s ease-out 1.3s forwards;
        }
      `}</style>

      {/* Airport operations grid overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '46px 46px',
          animation: 'mmsGridFade 1.2s ease-out 0.1s forwards'
        }}
      />

      {/* Radar sweep ambient circles */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-300/10 pointer-events-none opacity-0"
        style={{
          width: 'min(1100px, 150vw)',
          height: 'min(1100px, 150vw)',
          animation: 'mmsGridFade 1.2s ease-out 0.2s forwards'
        }}
      >
        <div className="absolute inset-[12%] rounded-full border border-sky-300/5" />
        <div className="absolute inset-[26%] rounded-full border border-sky-300/5" />
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, rgba(14,165,233,0.18), transparent 24%)',
            animation: 'mmsRadarSpin 7s linear infinite',
            mixBlendMode: 'screen'
          }}
        />
      </div>

      {/* Flight route trail SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path 
          className="mms-flight-trail"
          fill="none" 
          stroke="#96cbff" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeDasharray="4, 4"
          opacity="0.65"
          d="M -60,600 C 300,520 560,500 800,440 C 1040,380 1300,300 1560,190"
        />
      </svg>

      {/* Animated Airplane moving along path */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="mms-plane-track absolute">
          <svg 
            viewBox="0 0 24 24" 
            className="w-7 h-7 sm:w-8 sm:h-8 text-amber-300 drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]"
            style={{ transform: 'translate(-50%, -50%) rotate(90deg)' }}
          >
            <path fill="currentColor" d="M21.5 15.5l-6-1.7-4.3-7.7-1.7.5 2.2 7.7-5 1.4-2-1.6-1.3.4 1.4 3 .1 3.2 1.3-.4.6-2.5 5-1.4 3.6 7 1.7-.5-2.3-7.6 6-1.7z"/>
          </svg>
        </div>

        {/* Airport sector tags */}
        <div className="mms-badge-from absolute left-[4%] sm:left-[8%] top-[65%] font-mono text-[10px] sm:text-[11px] text-sky-200 bg-sky-950/80 border border-sky-400/30 px-2.5 py-1 rounded shadow-md">
          ADR · Adirampattinam HQ
        </div>
        <div className="mms-badge-to absolute right-[4%] sm:right-[8%] top-[18%] font-mono text-[10px] sm:text-[11px] text-sky-200 bg-sky-950/80 border border-sky-400/30 px-2.5 py-1 rounded shadow-md">
          MDK · Madukkur Branch
        </div>
      </div>

      {/* Subtle indicator that clicking anywhere enters */}
      <div className="absolute top-4 right-4 sm:top-5 sm:right-6 z-20 text-[11px] font-medium tracking-wide text-slate-300/80 bg-white/10 border border-white/15 px-3 py-1 rounded-full backdrop-blur-md pointer-events-none">
        Click anywhere to continue ➔
      </div>

      {/* Main Center Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 sm:px-6 py-8 max-w-4xl mx-auto">
        
        {/* Sacred Bismillah Tagline */}
        <div className="mms-tagline-anim text-xs sm:text-sm font-semibold tracking-[0.3em] text-amber-300 uppercase mb-2">
          IN THE NAME OF ALLAH
        </div>

        {/* Official MMS Logo Emblem */}
        <div className="mms-badge-anim w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-amber-400/50 shadow-[0_0_24px_rgba(245,158,11,0.3)] overflow-hidden bg-white p-1 my-2 flex items-center justify-center">
          <img 
            src="/mms_logo.svg" 
            alt="MMS Air Travels Logo" 
            className="w-full h-full object-contain rounded-full"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.includes('mms_logo.jpg')) {
                target.src = '/mms_logo.jpg';
              } else {
                target.style.display = 'none';
              }
            }}
          />
        </div>

        {/* Flight Tag */}
        <div className="mms-flighttag-anim font-mono text-xs sm:text-sm text-sky-200 mb-4 sm:mb-5 flex items-center justify-center gap-1.5 flex-wrap">
          <span>FLIGHT</span>
          <b className="text-amber-300 font-bold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">MMS-402</b>
          <span>· ADR ✈ MDK · ON TIME</span>
        </div>

        {/* Solari Split-Flap Destination Board */}
        <div className="board flex flex-wrap justify-center gap-1 sm:gap-2 mb-4 sm:mb-6" style={{ perspective: '800px' }}>
          {[...word].map((ch, idx) => {
            if (ch === ' ') {
              return <div key={idx} className="w-2.5 sm:w-4" />;
            }
            return (
              <div 
                key={idx}
                className="relative w-6 h-9 sm:w-10 sm:h-14 rounded bg-gradient-to-b from-[#006097] to-[#004a76] flex items-center justify-center shadow-lg border border-white/20 overflow-hidden"
              >
                {/* Center split groove */}
                <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-black/50 -translate-y-1/2 z-10" />
                <span className="font-mono font-black text-base sm:text-2xl text-white select-none z-0">
                  {ch}
                </span>
                {/* Flap animation */}
                <div 
                  className="absolute inset-0 rounded bg-gradient-to-b from-[#1a3857] to-[#0f2338] border border-white/10 origin-top"
                  style={{
                    backfaceVisibility: 'hidden',
                    animation: `mmsFlapDown 0.4s cubic-bezier(.5,0,.2,1) forwards`,
                    animationDelay: `${0.6 + idx * 0.035}s`
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Headline */}
        <h1 className="mms-headline-anim text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-2 sm:mb-3">
          Trusted journeys,<br />guided with <em className="not-italic text-amber-300">faith</em>.
        </h1>

        {/* Subtext */}
        <p className="mms-subtext-anim text-xs sm:text-sm md:text-base text-slate-300 max-w-lg leading-relaxed mb-6 sm:mb-8">
          Two branches, one promise — <strong>Adirampattinam HQ</strong> &amp; <strong>Madukkur</strong>, booking the world with personalized airline ticketing, Umrah &amp; global visas.
        </p>

        {/* CTA Buttons */}
        <div className="mms-cta-anim flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleExit('flight-ticket');
            }}
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 hover:from-blue-500 hover:to-sky-500 text-white font-bold text-xs sm:text-sm shadow-xl hover:shadow-amber-500/20 border border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Search Flights &amp; Fares</span>
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M13 6l6 6-6 6"/>
            </svg>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleExit('home');
            }}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all cursor-pointer backdrop-blur-sm"
          >
            Explore All Services
          </button>
        </div>
      </div>

      {/* Bottom Branch Chips & Direct WhatsApp */}
      <div className="mms-branches-anim absolute left-0 right-0 bottom-4 sm:bottom-5 flex flex-wrap items-center justify-center gap-2 px-4 z-20">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] text-slate-300 bg-white/10 border border-white/15 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          Adirampattinam HQ Desk
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] text-slate-300 bg-white/10 border border-white/15 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          Madukkur Branch Desk
        </span>
        <button 
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onOpenWhatsApp) {
              onOpenWhatsApp();
            } else {
              window.open('https://wa.me/919443152244?text=Hello%20MMS%20Air%20Travels,%20I%20am%20visiting%20your%20website%20and%20need%20assistance.', '_blank');
            }
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] text-emerald-200 bg-emerald-950/80 border border-emerald-500/40 hover:bg-emerald-900/80 transition-colors cursor-pointer backdrop-blur-md"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          Chat on WhatsApp: +91 94431 52244
        </button>
      </div>
    </div>
  );
};

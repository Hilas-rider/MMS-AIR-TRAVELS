import React from 'react';

interface MMSLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'emblem' | 'banner';
  className?: string;
  showTamil?: boolean;
}

export const MMSLogo: React.FC<MMSLogoProps> = ({
  size = 'md',
  variant = 'full',
  className = '',
  showTamil = false
}) => {
  const sizeMap = {
    sm: { emblem: 36, text: 'text-sm', sub: 'text-[9px]' },
    md: { emblem: 48, text: 'text-lg', sub: 'text-[10px]' },
    lg: { emblem: 64, text: 'text-2xl', sub: 'text-xs' },
    xl: { emblem: 88, text: 'text-3xl', sub: 'text-sm' }
  };

  const s = sizeMap[size];

  // Emblem Component (The Circular MMS Air Travels Globe & Plane Seal)
  const Emblem = () => (
    <div className="relative shrink-0 flex items-center justify-center">
      {/* Official circular vector logo */}
      <img
        src="/mms_logo.svg"
        alt="MMS Air Travels Official Logo"
        className="rounded-full object-contain shadow-sm"
        style={{ width: `${s.emblem}px`, height: `${s.emblem}px` }}
        onError={(e) => {
          // Fallback to JPG or SVG seal if needed
          const target = e.currentTarget;
          target.onerror = null;
          target.src = '/mms_logo.jpg';
        }}
      />
    </div>
  );

  if (variant === 'emblem') {
    return <Emblem />;
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Emblem />

      <div className="flex flex-col leading-tight">
        {/* Divine Invocation in English */}
        <span className="text-[10px] text-blue-900 font-bold tracking-tight">
          In The Name Of Allah, The Most Merciful
        </span>

        {/* MMS Brand Title: M (Blue) M (Red) S (Blue) */}
        <div className="flex items-baseline gap-1.5">
          <span className={`font-black tracking-tight ${s.text}`}>
            <span className="text-[#082c74]">M</span>
            <span className="text-[#d91a2a]">M</span>
            <span className="text-[#082c74]">S</span>
          </span>
          <span className={`font-black tracking-wider text-slate-900 uppercase ${s.text}`}>
            AIR TRAVELS
          </span>
        </div>

        {/* Tagline & Branch badge: Adirampattinam & Madukkur */}
        <div className="flex items-center gap-1.5">
          {showTamil ? (
            <span className="text-xs font-bold text-blue-900">
              ஏர் டிராவல்ஸ்
            </span>
          ) : (
            <span className={`font-extrabold text-blue-800 uppercase ${s.sub}`}>
              Cargo & Ticketing
            </span>
          )}
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider">
            Adirampattinam • Madukkur
          </span>
        </div>
      </div>
    </div>
  );
};

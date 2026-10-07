import React, { useState } from 'react';
import { 
  Globe, 
  MapPin, 
  Star, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Plane 
} from 'lucide-react';
import { INTERNATIONAL_TOURS } from '../data/toursData';
import { CurrencyCode, TourPackage } from '../types';
import { formatCurrency } from '../data/airports';

interface InternationalToursViewProps {
  currency: CurrencyCode;
  packages?: TourPackage[];
  selectedCountryFilter?: string;
  onSelectPackage: (pkg: TourPackage) => void;
  onOpenEnquiry: (serviceType: any, destPreset?: string) => void;
}

export const InternationalToursView: React.FC<InternationalToursViewProps> = ({
  currency,
  packages,
  selectedCountryFilter,
  onSelectPackage,
  onOpenEnquiry
}) => {
  const [activeCountry, setActiveCountry] = useState<string>(selectedCountryFilter || 'ALL');

  const allIntlTours = packages ? packages.filter(p => p.category === 'International') : INTERNATIONAL_TOURS;

  const countries = [
    'ALL',
    'Thailand',
    'Singapore',
    'United Arab Emirates',
    'Indonesia',
    'Azerbaijan',
    'Armenia',
    'Maldives',
    'Turkey'
  ];

  const filteredTours = activeCountry === 'ALL'
    ? allIntlTours
    : allIntlTours.filter(t => t.stateOrCountry.toLowerCase().includes(activeCountry.toLowerCase()));

  const getConvertedPrice = (priceINR: number, priceUSD: number) => {
    if (currency === 'INR') return `₹${priceINR.toLocaleString('en-IN')}`;
    return formatCurrency(priceUSD, currency);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg">
        <span className="text-amber-400 font-black text-xs uppercase tracking-widest block mb-1">
          WORLDWIDE HOLIDAYS & EXPERIENCES
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          International Tour Packages
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-2 leading-relaxed">
          Premium all-inclusive overseas tours with 4-star and 5-star hotel accommodations, flights, curated daily tours, Indian buffet meals, and guaranteed visa assistance.
        </p>

        {/* Country Filter Buttons matching screenshot 7 */}
        <div className="mt-6 flex flex-wrap gap-2">
          {countries.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCountry(c)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeCountry === c
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Tour Packages Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTours.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
          >
            <div className="relative aspect-16/10 overflow-hidden">
              <img
                src={pkg.imageUrl}
                alt={pkg.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                {pkg.duration}
              </div>
              <div className="absolute top-3 right-3 bg-amber-400 text-slate-950 text-[11px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                <Star className="w-3 h-3 fill-slate-950" /> {pkg.rating}
              </div>
            </div>

            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-xs text-blue-600 font-bold uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{pkg.destination}</span>
                </div>
                <h3 className="font-black text-base text-slate-900 mt-1 leading-snug">
                  {pkg.title}
                </h3>

                {/* Highlights */}
                <div className="mt-3 space-y-1.5">
                  {pkg.highlights.slice(0, 3).map((hl, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Starting Price</span>
                  <span className="text-lg font-black text-slate-900 font-mono">
                    {getConvertedPrice(pkg.priceINR, pkg.priceUSD)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectPackage(pkg)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                  >
                    View Plan
                  </button>
                  <button
                    onClick={() => onOpenEnquiry('Package', pkg.title)}
                    className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

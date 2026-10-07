import React from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  Star, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar,
  ArrowRight
} from 'lucide-react';
import { TourPackage, CurrencyCode } from '../types';
import { formatCurrency } from '../data/airports';

interface TourPackageModalProps {
  pkg: TourPackage | null;
  currency: CurrencyCode;
  onClose: () => void;
  onBookNow: (pkg: TourPackage) => void;
}

export const TourPackageModal: React.FC<TourPackageModalProps> = ({
  pkg,
  currency,
  onClose,
  onBookNow
}) => {
  if (!pkg) return null;

  const getConvertedPrice = () => {
    if (currency === 'INR') return `₹${pkg.priceINR.toLocaleString('en-IN')}`;
    return formatCurrency(pkg.priceUSD, currency);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-auto max-h-[90vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-white bg-black/50 hover:bg-black/75 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative h-60 sm:h-72 w-full shrink-0">
          <img
            src={pkg.imageUrl}
            alt={pkg.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent flex flex-col justify-end p-6 text-white">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <MapPin className="w-4 h-4" />
              <span>{pkg.destination}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {pkg.title}
            </h3>
            <div className="flex items-center gap-4 mt-2 text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-400" /> {pkg.duration}</span>
              <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {pkg.rating} (450+ Travelers)</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Highlights & Inclusions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-900">
                Key Highlights
              </h4>
              <ul className="space-y-1.5 text-slate-700">
                {pkg.highlights.map((hl, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 space-y-2">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-emerald-950">
                Package Inclusions
              </h4>
              <ul className="space-y-1.5 text-slate-700">
                {pkg.inclusions.map((inc, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Day by Day Itinerary */}
          <div className="space-y-3">
            <h4 className="font-black text-sm uppercase tracking-wider text-slate-900">
              Day-Wise Tour Itinerary
            </h4>

            <div className="space-y-3 pl-2">
              {pkg.itinerary.map((it) => (
                <div key={it.day} className="border-l-2 border-amber-500 pl-4 py-1 space-y-0.5">
                  <div className="font-black text-slate-900 text-xs">
                    Day {it.day}: {it.title}
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {it.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Package Price Per Adult</span>
            <span className="text-2xl font-black text-slate-900 font-mono">
              {getConvertedPrice()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBookNow(pkg);
              }}
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <span>Book This Package</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

import React from 'react';
import { 
  Plane, 
  Home, 
  Search, 
  Ticket, 
  FileCheck2, 
  Package, 
  Phone, 
  Compass, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { CONTACT_NUMBERS } from '../data/contactInfo';

interface NotFoundViewProps {
  onNavigate: (tab: string, subCategory?: string) => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({ onNavigate }) => {
  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-12 bg-slate-50">
      <div className="max-w-2xl w-full bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-xl text-center space-y-6 animate-fadeIn">
        
        {/* Radar Diverted Graphic */}
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-blue-100/60 animate-ping opacity-40" />
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#006097] to-[#008fe0] text-white flex items-center justify-center shadow-lg transform -rotate-12">
            <Plane className="w-10 h-10 transform -rotate-45" />
          </div>
        </div>

        {/* 404 Error Code & Headline */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-mono font-bold uppercase tracking-wider">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Navigation Waypoint 404 • Flight Diverted</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight font-display">
            Waypoint Not Found in Flight Plan
          </h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            The flight sector or service page you requested has been moved, archived, or does not exist in our global air traffic database.
          </p>
        </div>

        {/* Primary Clear CTA */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="px-5 py-3 rounded-xl bg-[#006097] hover:bg-[#007abd] text-white text-xs font-bold transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return to Agency Home</span>
          </button>
          <button
            onClick={() => onNavigate('flight-ticket')}
            className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <Ticket className="w-4 h-4" />
            <span>Search Active Flights</span>
          </button>
        </div>

        {/* Quick Route Recovery Grid */}
        <div className="pt-6 border-t border-slate-100 space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Popular Waypoint Destinations
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              onClick={() => onNavigate('other-services', 'passport')}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-[#006097] hover:bg-blue-50/50 text-xs font-semibold text-slate-700 flex flex-col items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4 text-amber-600" />
              <span>Passport Seva</span>
            </button>

            <button
              onClick={() => onNavigate('visa')}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-[#006097] hover:bg-blue-50/50 text-xs font-semibold text-slate-700 flex flex-col items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Compass className="w-4 h-4 text-blue-600" />
              <span>Global Visas</span>
            </button>

            <button
              onClick={() => onNavigate('cargo')}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-[#006097] hover:bg-blue-50/50 text-xs font-semibold text-slate-700 flex flex-col items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Package className="w-4 h-4 text-slate-700" />
              <span>Air Cargo AWB</span>
            </button>

            <button
              onClick={() => onNavigate('tracking')}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-[#006097] hover:bg-blue-50/50 text-xs font-semibold text-slate-700 flex flex-col items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4 text-emerald-600" />
              <span>Web Check-in</span>
            </button>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="text-xs text-slate-500 pt-2 flex items-center justify-center gap-2">
          <span>Need immediate assistance?</span>
          <a 
            href={CONTACT_NUMBERS.general.tel}
            className="font-bold text-[#006097] hover:underline inline-flex items-center gap-1"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call General Helpdesk (+91 {CONTACT_NUMBERS.general.formatted})</span>
          </a>
        </div>

      </div>
    </div>
  );
};

import React from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Plane, 
  FileText, 
  ShieldCheck, 
  Headphones, 
  Award,
  Users,
  CheckCircle2
} from 'lucide-react';
import { MMSLogo } from './MMSLogo';
import { CONTACT_NUMBERS, LOCATIONS } from '../data/contactInfo';

interface MMSShopBannerProps {
  onSelectTab?: (tab: string) => void;
  compact?: boolean;
}

export const MMSShopBanner: React.FC<MMSShopBannerProps> = ({ 
  onSelectTab,
  compact = false 
}) => {
  return (
    <div className="bg-[#0b192c] text-[#f1f5f9] border border-[#1e3e62] shadow-md">
      
      {/* Top Invocation & Branch Authentication Strip */}
      <div className="bg-[#07111e] border-b border-[#1e3e62] px-4 sm:px-6 py-2 flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-serif italic text-[#d4af37]">
            In The Name Of Allah, The Most Gracious, The Most Merciful
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono-data text-[11px]">
          <span className="px-2 py-0.5 bg-[#1e3e62] text-white font-medium">
            BRANCHES: ADIRAMPATTINAM & MADUKKUR
          </span>
          <span className="text-slate-400 hidden sm:inline">
            GOVT REGISTERED & VERIFIED TRAVEL AGENCY
          </span>
        </div>
      </div>

      {/* Main Agency Header & Reservation Desks */}
      <div className="p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left: Brand Identity & Location */}
        <div className="lg:col-span-7 flex items-center gap-4 sm:gap-6">
          <MMSLogo size="xl" variant="emblem" />

          <div className="space-y-1 text-left">
            <span className="text-[11px] font-mono-data text-[#d4af37] tracking-wider uppercase block">
              Passenger Flights & International Cargo
            </span>
            
            <h1 className="font-display text-3xl sm:text-5xl text-white tracking-tight leading-none">
              MMS Air Travels
            </h1>

            <p className="text-xs sm:text-sm font-medium text-slate-300">
              MMS Air Travels & Cargo Service • Adirampattinam & Madukkur
            </p>

            <p className="text-xs text-slate-400 max-w-xl leading-relaxed pt-1">
              Direct GDS Air Tickets • Wholesale Group Fare Departures • 24-Hour UAE & GCC Visas • Express Air Cargo Freight
            </p>
          </div>
        </div>

        {/* Right: Direct Hotlines & UAE Visa Authenticated Seal */}
        <div className="lg:col-span-5 flex flex-col sm:flex-row items-center justify-end gap-5">
          
          {/* Dubai 24h Visa Docket Seal */}
          <div className="shrink-0 w-32 h-32 bg-[#07111e] border border-[#d4af37] p-2 flex flex-col items-center justify-center text-center">
            <span className="text-[9px] font-mono-data text-[#d4af37] uppercase tracking-wider block">
              DUBAI VISIT VISA
            </span>
            <span className="font-display text-2xl text-white leading-none my-1">
              24 Hours
            </span>
            <span className="text-[10px] text-[#22c55e] font-mono-data uppercase font-bold">
              Guaranteed Approval
            </span>
            <span className="text-[8px] font-mono-data text-slate-400 uppercase mt-1">
              Official UAE Portal
            </span>
          </div>

          {/* Direct Hotlines */}
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-[10px] font-mono-data uppercase text-slate-400 block">
              Direct Reservation Hotlines
            </span>
            <div className="flex flex-col font-mono-data text-xs space-y-1">
              <a 
                href={CONTACT_NUMBERS.general.tel} 
                className="font-bold text-white hover:text-[#d4af37] transition-colors flex items-center justify-between gap-2"
              >
                <span className="text-slate-400">General:</span>
                <span>{CONTACT_NUMBERS.general.formatted}</span>
              </a>
              <a 
                href={CONTACT_NUMBERS.ticket.tel} 
                className="font-bold text-amber-300 hover:text-white transition-colors flex items-center justify-between gap-2"
              >
                <span className="text-slate-400">Tickets:</span>
                <span>{CONTACT_NUMBERS.ticket.formatted}</span>
              </a>
              <a 
                href={CONTACT_NUMBERS.visa.tel} 
                className="font-bold text-sky-300 hover:text-white transition-colors flex items-center justify-between gap-2"
              >
                <span className="text-slate-400">Visa:</span>
                <span>{CONTACT_NUMBERS.visa.formatted}</span>
              </a>
              <a 
                href={CONTACT_NUMBERS.services.tel} 
                className="font-bold text-emerald-400 hover:text-white transition-colors flex items-center justify-between gap-2"
              >
                <span className="text-slate-400">Other:</span>
                <span>{CONTACT_NUMBERS.services.formatted}</span>
              </a>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-400 justify-center sm:justify-start font-mono-data pt-1">
              <Mail className="w-3.5 h-3.5 text-[#d4af37]" />
              <a href="mailto:mmsairtravels@gmail.com" className="hover:text-white truncate max-w-[200px]">
                mmsairtravels@gmail.com
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Services Navigation Strip */}
      <div className="bg-[#07111e] border-t border-[#1e3e62] px-4 py-2.5">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center text-xs">
          
          <button 
            onClick={() => onSelectTab && onSelectTab('flight-ticket')}
            className="p-2 bg-[#0b192c] hover:bg-[#1e3e62] transition-colors cursor-pointer border border-[#1e3e62]/70 text-left"
          >
            <span className="text-[10px] font-mono-data text-slate-400 block">GDS Ticketing</span>
            <span className="font-medium text-white block">Flight Tickets</span>
          </button>

          <button 
            onClick={() => onSelectTab && onSelectTab('group-fares')}
            className="p-2 bg-[#0b192c] hover:bg-[#1e3e62] transition-colors cursor-pointer border border-[#1e3e62]/70 text-left"
          >
            <span className="text-[10px] font-mono-data text-[#e85c0d] block">Wholesale Blocks</span>
            <span className="font-medium text-white block">Group Fares</span>
          </button>

          <button 
            onClick={() => onSelectTab && onSelectTab('visa')}
            className="p-2 bg-[#0b192c] hover:bg-[#1e3e62] transition-colors cursor-pointer border border-[#1e3e62]/70 text-left"
          >
            <span className="text-[10px] font-mono-data text-slate-400 block">UAE & Worldwide</span>
            <span className="font-medium text-white block">Visa Consultation</span>
          </button>

          <button 
            onClick={() => onSelectTab && onSelectTab('other-services', 'cargo')}
            className="p-2 bg-[#0b192c] hover:bg-[#1e3e62] transition-colors cursor-pointer border border-[#1e3e62]/70 text-left"
          >
            <span className="text-[10px] font-mono-data text-slate-400 block">Air Freight</span>
            <span className="font-medium text-white block">Cargo & AWB</span>
          </button>

          <button 
            onClick={() => onSelectTab && onSelectTab('other-services', 'passport')}
            className="p-2 bg-[#0b192c] hover:bg-[#1e3e62] transition-colors cursor-pointer border border-[#1e3e62]/70 text-left"
          >
            <span className="text-[10px] font-mono-data text-slate-400 block">Documentation</span>
            <span className="font-medium text-white block">Passport & Attestation</span>
          </button>

          <button 
            onClick={() => onSelectTab && onSelectTab('contact-us')}
            className="p-2 bg-[#0b192c] hover:bg-[#1e3e62] transition-colors cursor-pointer border border-[#1e3e62]/70 text-left"
          >
            <span className="text-[10px] font-mono-data text-[#22c55e] block">Physical Desks</span>
            <span className="font-medium text-white block">Adirai & Madukkur</span>
          </button>

        </div>
      </div>

      {/* Address Bar */}
      <div className="bg-[#050c15] px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 border-t border-[#1e3e62]/60 font-mono-data">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-[#e85c0d]" />
          <span>
            Offices: {LOCATIONS.adirampattinam.address} | {LOCATIONS.madukkur.address}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white font-bold">General: 63690 12360</span>
          <span className="text-amber-300 font-bold">Tickets: 93845 67440</span>
        </div>
      </div>

    </div>
  );
};

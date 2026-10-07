import React from 'react';
import { 
  Phone, 
  MessageCircle, 
  Plane, 
  FileCheck2, 
  Share2 
} from 'lucide-react';
import { CONTACT_NUMBERS } from '../data/contactInfo';

interface MobileQuickBarProps {
  onNavigate: (tab: string, subCategory?: string) => void;
  onOpenShare: () => void;
}

export const MobileQuickBar: React.FC<MobileQuickBarProps> = ({
  onNavigate,
  onOpenShare
}) => {
  return (
    <div 
      role="navigation"
      aria-label="Mobile Quick Actions"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-3 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] shadow-[0_-4px_16px_rgba(0,0,0,0.08)] flex items-center justify-around"
    >
      {/* 1. Direct Call: General Inquiry */}
      <a
        href={CONTACT_NUMBERS.general.tel}
        className="flex flex-col items-center justify-center min-w-[54px] min-h-[44px] text-slate-700 hover:text-[#006097] active:scale-95 transition-all"
        aria-label="Call General Helpdesk"
        title={`Call General Helpdesk: ${CONTACT_NUMBERS.general.formatted}`}
      >
        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#006097]">
          <Phone className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-bold mt-0.5">Call</span>
      </a>

      {/* 2. WhatsApp Direct: Ticket & Visa Support */}
      <a
        href={CONTACT_NUMBERS.ticket.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center min-w-[54px] min-h-[44px] text-slate-700 hover:text-emerald-600 active:scale-95 transition-all"
        aria-label="Chat on WhatsApp"
        title={`WhatsApp Flight & Travel Desk: ${CONTACT_NUMBERS.ticket.formatted}`}
      >
        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
          <MessageCircle className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-bold mt-0.5">WhatsApp</span>
      </a>

      {/* 3. Center CTA: Flights Book (Prominent pill) */}
      <button
        onClick={() => onNavigate('flight-ticket')}
        className="flex flex-col items-center justify-center px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#006097] to-[#007abd] text-white shadow-md active:scale-95 transition-all min-h-[44px]"
        aria-label="Search and Book Flights"
      >
        <Plane className="w-4 h-4" />
        <span className="text-[10px] font-bold mt-0.5">Flights</span>
      </button>

      {/* 4. Passport Seva Direct */}
      <button
        onClick={() => onNavigate('other-services', 'passport')}
        className="flex flex-col items-center justify-center min-w-[54px] min-h-[44px] text-slate-700 hover:text-amber-700 active:scale-95 transition-all"
        aria-label="Passport Seva Facilitation"
      >
        <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-700">
          <FileCheck2 className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-bold mt-0.5">Passport</span>
      </button>

      {/* 5. Social Share */}
      <button
        onClick={onOpenShare}
        className="flex flex-col items-center justify-center min-w-[54px] min-h-[44px] text-slate-700 hover:text-[#006097] active:scale-95 transition-all"
        aria-label="Share Agency Link"
      >
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
          <Share2 className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-bold mt-0.5">Share</span>
      </button>

    </div>
  );
};

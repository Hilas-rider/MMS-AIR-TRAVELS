import React, { useState } from 'react';
import { 
  Users, 
  Plane, 
  Calendar, 
  Clock, 
  Luggage, 
  Utensils, 
  CheckCircle2, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  Tag, 
  Phone, 
  MessageSquare,
  ArrowRight,
  ChevronRight,
  Filter
} from 'lucide-react';
import { GroupFareItem, CurrencyCode } from '../types';
import { formatCurrency } from '../data/airports';
import { CONTACT_NUMBERS } from '../data/contactInfo';

interface OurGroupFaresViewProps {
  currency: CurrencyCode;
  groupFares: GroupFareItem[];
  onSelectGroupFare: (fare: GroupFareItem) => void;
  onOpenCustomGroupInquiry: (presetRoute?: string) => void;
}

export const OurGroupFaresView: React.FC<OurGroupFaresViewProps> = ({
  currency,
  groupFares,
  onSelectGroupFare,
  onOpenCustomGroupInquiry
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const categories = [
    'ALL',
    'Gulf / Dubai Bulk',
    'Hajj & Umrah Block',
    'Southeast Asia',
    'UK & Europe',
    'North America'
  ];

  const filteredFares = groupFares.filter(item => {
    if (!item.active) return false;
    if (activeCategory !== 'ALL' && item.category !== activeCategory) return false;
    return true;
  });

  const getConvertedPrice = (priceINR: number, priceUSD: number) => {
    if (currency === 'INR') return `₹${priceINR.toLocaleString('en-IN')}`;
    return formatCurrency(priceUSD, currency);
  };

  const calculateSavings = (regularINR: number, groupINR: number) => {
    const diffINR = Math.max(0, regularINR - groupINR);
    if (currency === 'INR') return `₹${diffINR.toLocaleString('en-IN')}`;
    const diffUSD = Math.round(diffINR / 83);
    return formatCurrency(diffUSD, currency);
  };

  return (
    <div className="space-y-8">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-indigo-900 to-blue-900 text-white p-6 sm:p-10 shadow-xl border border-blue-800/60">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600 text-white font-black text-xs uppercase tracking-wider mb-3 shadow-sm">
            <Users className="w-3.5 h-3.5" />
            <span>MMS Air Travels Wholesale Special</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Our Special Group Fares & Blocked PNR Seats
          </h2>

          <p className="mt-3 text-xs sm:text-sm text-blue-100/90 leading-relaxed">
            Exclusive fixed-departure flight blocks reserved in advance directly from airlines for family groups, Gulf workers, Umrah pilgrims, and corporate delegations. Enjoy massive discounts compared to airline counter rates, guaranteed heavy luggage allowances, and direct human desk assistance.
          </p>

          {/* Quick Perks Strip */}
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 text-amber-300 font-bold">
              <Luggage className="w-4 h-4 text-amber-400" /> Up to 46kg Baggage Free
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 text-emerald-300 font-bold">
              <Utensils className="w-4 h-4 text-emerald-400" /> Hot Meal Included
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 text-sky-200 font-bold">
              <ShieldCheck className="w-4 h-4 text-sky-300" /> Confirmed Blocked PNR
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 text-rose-200 font-bold">
              <Sparkles className="w-4 h-4 text-rose-300" /> Save up to ₹8,500/Pax
            </span>
          </div>
        </div>
      </div>

      {/* 2. Category Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-blue-900 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All Group Fares' : cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => onOpenCustomGroupInquiry()}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-sm transition-all cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Inquire Custom Group Route</span>
        </button>
      </div>

      {/* 3. Group Fares Grid */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
        <span>Showing <strong className="text-slate-900">{filteredFares.length}</strong> of 20 Live Blocked Group Departures</span>
        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Pre-purchased Airline Wholesale PNRs</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredFares.map((fare) => {
          const savingsFormatted = calculateSavings(fare.regularFareINR, fare.fareINR);

          return (
            <div
              key={fare.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              {/* Card Header with Badges */}
              <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${fare.airlineLogoColor} text-white flex items-center justify-center font-black text-sm shadow-sm`}>
                      {fare.airlineCode}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-base">{fare.airline}</span>
                        <span className="text-xs px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 font-mono font-bold">
                          {fare.flightNumber}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {fare.aircraft} • Group Code: <strong className="text-blue-900">{fare.groupCode}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Urgency Badge */}
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-red-100 text-red-800 text-[11px] font-black border border-red-200">
                      ⚡ {fare.availableSeats} Seats Left
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-1">
                      of {fare.totalSeats} blocked
                    </span>
                  </div>
                </div>

                {fare.featuredNote && (
                  <div className="mt-3 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-900 text-xs font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{fare.featuredNote}</span>
                  </div>
                )}
              </div>

              {/* Route & Timings Section */}
              <div className="p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  {/* Departure */}
                  <div className="text-left flex-1">
                    <span className="text-xl sm:text-2xl font-black text-slate-900">{fare.departureTime}</span>
                    <span className="block text-sm font-black text-blue-900">{fare.origin.code}</span>
                    <span className="block text-xs text-slate-500 font-medium truncate max-w-[120px]">{fare.origin.city}</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5 font-mono">{fare.departureDate}</span>
                  </div>

                  {/* Flight Route Line */}
                  <div className="flex flex-col items-center flex-1 px-2">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-md mb-1 border border-emerald-200">
                      {fare.stops === 0 ? 'Non-Stop Direct' : `${fare.stops} Stop`}
                    </span>
                    <div className="w-full relative flex items-center justify-center">
                      <div className="w-full h-0.5 bg-slate-300"></div>
                      <Plane className="w-4 h-4 text-blue-900 absolute transform rotate-90" />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 font-medium">Group Block</span>
                  </div>

                  {/* Arrival */}
                  <div className="text-right flex-1">
                    <span className="text-xl sm:text-2xl font-black text-slate-900">{fare.arrivalTime}</span>
                    <span className="block text-sm font-black text-blue-900">{fare.destination.code}</span>
                    <span className="block text-xs text-slate-500 font-medium truncate max-w-[120px]">{fare.destination.city}</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5 font-mono">{fare.arrivalDate}</span>
                  </div>
                </div>

                {/* Group Inclusions Pill Strip */}
                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                    <Luggage className="w-3.5 h-3.5 text-blue-700" />
                    <span>{fare.baggageAllowance}</span>
                  </div>

                  {fare.mealIncluded && (
                    <div className="flex items-center gap-1.5 font-semibold text-emerald-700">
                      <Utensils className="w-3.5 h-3.5" />
                      <span>Complimentary Meal</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1 text-[11px] font-bold text-blue-900 bg-blue-100/70 px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="w-3 h-3 text-blue-700" />
                    <span>Direct PNR</span>
                  </div>
                </div>
              </div>

              {/* Pricing & Send Inquiry Button */}
              <div className="p-5 sm:p-6 border-t border-slate-100 bg-gradient-to-b from-white to-slate-50/80 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-blue-950">
                      {getConvertedPrice(fare.fareINR, fare.fareUSD)}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      ₹{fare.regularFareINR.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      Save {savingsFormatted}/pax
                    </span>
                    <span className="text-[10px] text-slate-500">Per seat in blocked group</span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectGroupFare(fare)}
                  className="px-5 py-3 rounded-2xl bg-blue-900 hover:bg-blue-950 text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-amber-400" />
                  <span>Send Group Fare Inquiry</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Special Adirai Branch Hotline for Group Fares */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-6 sm:p-8 text-slate-950 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-xs font-black uppercase tracking-widest text-slate-950/80 bg-white/40 px-2.5 py-1 rounded-full">
            Direct Travel Desk Hotline
          </span>
          <h3 className="text-xl sm:text-2xl font-black">
            Need Bulk Seats or Custom Dates for Your Group?
          </h3>
          <p className="text-xs sm:text-sm text-slate-900/90 max-w-xl">
            We handle corporate groups, Umrah series, student batches, and family vacations (2 to 100+ passengers). Contact our Adirampattinam desk directly for instant offline group PNR rates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a
            href={CONTACT_NUMBERS.ticket.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp Tickets: {CONTACT_NUMBERS.ticket.formatted}</span>
          </a>

          <a
            href={CONTACT_NUMBERS.ticket.tel}
            className="px-4 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md transition-all"
          >
            <Phone className="w-4 h-4 text-blue-900" />
            <span>Call: {CONTACT_NUMBERS.ticket.formatted}</span>
          </a>
        </div>
      </div>
    </div>
  );
};

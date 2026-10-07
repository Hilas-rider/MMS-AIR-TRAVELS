import React from 'react';
import { 
  Award, 
  ShieldCheck, 
  Users, 
  Globe, 
  Plane, 
  Package, 
  Clock, 
  Star, 
  Phone,
  CheckCircle2,
  MapPin,
  MessageSquare,
  FileCheck2,
  Send,
  Building2,
  Compass
} from 'lucide-react';
import { CONTACT_NUMBERS, LOCATIONS } from '../data/contactInfo';

interface AboutUsViewProps {
  onNavigateTab: (tab: string) => void;
  onOpenEnquiry: (serviceType: any) => void;
}

export const AboutUsView: React.FC<AboutUsViewProps> = ({ onNavigateTab, onOpenEnquiry }) => {
  return (
    <div className="space-y-10 animate-fadeIn">
      
      {/* 1. Brand Hero Header with Official Emblem & Title */}
      <div className="bg-gradient-to-br from-[#082c74] via-[#0c3d9c] to-[#041a4a] text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-blue-900/50 relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-blue-500/10 pointer-events-none blur-2xl"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-5">
          
          <div className="flex items-center justify-center gap-3">
            <img 
              src="/mms_logo.svg" 
              alt="MMS Air Travels Official Logo" 
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white p-1 shadow-lg object-contain"
              onError={(e) => {
                const target = e.currentTarget;
                target.onerror = null;
                target.src = '/mms_logo.jpg';
              }}
            />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest bg-white/10 px-3.5 py-1 rounded-full border border-white/15">
              Your Trusted Travel Partner
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              About MMS AIR TRAVELS
            </h1>
            <p className="text-amber-400 font-bold text-sm sm:text-base tracking-wide">
              Madukkur – Since 2020 • Adirampattinam – Since 2026 • 49K+ Happy Customers ❤️
            </p>
          </div>

          <p className="text-sm sm:text-base text-blue-100 max-w-3xl mx-auto leading-relaxed">
            <strong>MMS AIR TRAVELS</strong> is a trusted travel service provider committed to making every journey simple, convenient, and comfortable. We have been serving customers in <strong>Madukkur since 2020</strong> and expanded our services to <strong>Adirampattinam in 2026</strong>. With <strong>49K+ happy customers</strong>, our goal is to provide reliable travel assistance and customer-friendly service for domestic and international travel requirements. From flight bookings and bus bookings to visa assistance and other travel services, our team is ready to support you throughout your journey.
          </p>

          {/* Master Prompt Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 text-center">
              <span className="text-2xl sm:text-3xl font-black text-amber-300 block">49K+</span>
              <span className="text-[11px] text-blue-100 font-semibold">Happy Customers ❤️</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 text-center">
              <span className="text-2xl sm:text-3xl font-black text-white block">2020</span>
              <span className="text-[11px] text-blue-100 font-semibold">Madukkur Since</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 text-center">
              <span className="text-2xl sm:text-3xl font-black text-white block">2026</span>
              <span className="text-[11px] text-blue-100 font-semibold">Adirampattinam Since</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 text-center">
              <span className="text-2xl sm:text-3xl font-black text-emerald-300 block">2</span>
              <span className="text-[11px] text-blue-100 font-semibold">Authorized Branches</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
            <span className="bg-white/10 text-white font-semibold px-3 py-1 rounded-full border border-white/20">
              ✈️ Flight Booking
            </span>
            <span className="bg-white/10 text-white font-semibold px-3 py-1 rounded-full border border-white/20">
              🚌 Bus Booking
            </span>
            <span className="bg-white/10 text-white font-semibold px-3 py-1 rounded-full border border-white/20">
              🌍 Visa Services
            </span>
            <span className="bg-white/10 text-white font-semibold px-3 py-1 rounded-full border border-white/20">
              🧳 Travel Services
            </span>
            <span className="bg-white/10 text-white font-semibold px-3 py-1 rounded-full border border-white/20">
              🎫 Ticket Enquiry
            </span>
          </div>
        </div>
      </div>

      {/* 2. DEDICATED DIRECT HOTLINES (Strictly the 3 requested numbers) */}
      <div className="bg-amber-50/70 border-2 border-amber-300/80 rounded-3xl p-6 sm:p-8 space-y-5">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <span className="text-xs font-black text-amber-800 uppercase tracking-widest">
            DIRECT HELPDESK HOTLINES
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">
            Dedicated Numbers For Your Needs
          </h3>
          <p className="text-xs text-slate-600">
            Reach our specialized executives directly for quick confirmations and personalized quotes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* 1. General Inquiry */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-blue-600 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                General Helpdesk
              </span>
              <h4 className="text-lg font-black text-slate-900 mt-1">General Inquiry</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Agency inquiries, working hours, tracking & customer support
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100">
              <a 
                href={CONTACT_NUMBERS.general.tel}
                className="text-xl font-black text-blue-900 font-mono tracking-wide hover:underline block"
              >
                {CONTACT_NUMBERS.general.formatted}
              </a>
              <div className="flex items-center gap-2 mt-3">
                <a
                  href={CONTACT_NUMBERS.general.tel}
                  className="flex-1 text-center py-2 px-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs transition-colors"
                >
                  Call Now
                </a>
                <a
                  href={CONTACT_NUMBERS.general.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                  title="WhatsApp General Inquiry"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* 2. Flight Ticket Booking */}
          <div className="bg-white rounded-2xl p-6 border-2 border-blue-900/30 shadow-md hover:border-blue-900 transition-all space-y-4 relative">
            <div className="absolute top-4 right-4">
              <span className="px-2 py-0.5 bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wider rounded-md">
                Fastest Response
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Plane className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                Air Ticketing Desk
              </span>
              <h4 className="text-lg font-black text-slate-900 mt-1">Flight Tickets</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Domestic & Gulf international flights, group fares & PNR confirm
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100">
              <a 
                href={CONTACT_NUMBERS.ticket.tel}
                className="text-xl font-black text-blue-900 font-mono tracking-wide hover:underline block"
              >
                {CONTACT_NUMBERS.ticket.formatted}
              </a>
              <div className="flex items-center gap-2 mt-3">
                <a
                  href={CONTACT_NUMBERS.ticket.tel}
                  className="flex-1 text-center py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition-colors"
                >
                  Call Ticketing
                </a>
                <a
                  href={CONTACT_NUMBERS.ticket.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                  title="WhatsApp Flight Ticket Desk"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* 3. Visa, Tour and Other Services */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-emerald-600 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Visas • Tours • Cargo
              </span>
              <h4 className="text-lg font-black text-slate-900 mt-1">Visas, Tours & Other</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Dubai/Schengen visas, holiday packages, passport seva & cargo
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100">
              <a 
                href={CONTACT_NUMBERS.services.tel}
                className="text-xl font-black text-emerald-800 font-mono tracking-wide hover:underline block"
              >
                {CONTACT_NUMBERS.services.formatted}
              </a>
              <div className="flex items-center gap-2 mt-3">
                <a
                  href={CONTACT_NUMBERS.services.tel}
                  className="flex-1 text-center py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors"
                >
                  Call Visa Desk
                </a>
                <a
                  href={CONTACT_NUMBERS.services.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                  title="WhatsApp Visa & Tour Services"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. OUR ONLY PHYSICAL LOCATIONS: ADIRAMPATTINAM & MADUKKUR */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-900" />
              <h2 className="text-2xl font-black text-slate-900">Our Physical Branches</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              MMS Air Travels operates exclusively out of two branch offices in Tamil Nadu: <strong>Adirampattinam</strong> and <strong>Madukkur</strong>.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Adirampattinam & Madukkur Only</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* BRANCH 1: ADIRAMPATTINAM (HEAD OFFICE) */}
          <div className="p-6 sm:p-7 rounded-2xl bg-slate-50 border-2 border-blue-900/20 hover:border-blue-900 shadow-sm transition-all space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-md bg-[#082c74] text-white font-black text-xs uppercase tracking-wider">
                  Head Office • Branch 1
                </span>
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Open 7 Days a Week
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900">Adirampattinam Branch</h3>
                <p className="text-xs text-slate-500 mt-0.5">International Ticketing • Gulf Passenger Desk • Express Cargo</p>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-slate-200">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>MMS Air Travels</strong><br />
                    <span>{LOCATIONS.adirampattinam.address}</span>
                    <a
                      href={LOCATIONS.adirampattinam.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-[11px] text-blue-800 hover:text-blue-900 font-semibold underline mt-0.5"
                    >
                      📍 Open in Google Maps ↗
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Working Hours: {LOCATIONS.adirampattinam.hours}</span>
                </div>

                <div className="pt-2 border-t border-slate-200 space-y-1.5 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-sans">General Inquiry:</span>
                    <a href={CONTACT_NUMBERS.general.tel} className="font-bold text-blue-900 hover:underline">
                      {CONTACT_NUMBERS.general.formatted}
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-sans">Flight Tickets:</span>
                    <a href={CONTACT_NUMBERS.ticket.tel} className="font-bold text-amber-700 hover:underline">
                      {CONTACT_NUMBERS.ticket.formatted}
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-sans">Visa & Services:</span>
                    <a href={CONTACT_NUMBERS.services.tel} className="font-bold text-emerald-800 hover:underline">
                      {CONTACT_NUMBERS.services.formatted}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center gap-2">
              <a
                href={CONTACT_NUMBERS.ticket.tel}
                className="flex-1 text-center py-2.5 px-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-black text-xs uppercase tracking-wide transition-colors"
              >
                Call Adirampattinam
              </a>
              <a
                href={LOCATIONS.adirampattinam.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 transition-colors flex items-center gap-1 text-xs font-bold"
                title="Open Adirampattinam Branch on Google Maps"
              >
                <MapPin className="w-4 h-4 text-rose-600" />
                <span className="hidden sm:inline">Map</span>
              </a>
              <a
                href={CONTACT_NUMBERS.general.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5 text-xs font-bold"
                title="WhatsApp Adirampattinam Branch"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            </div>
          </div>

          {/* BRANCH 2: MADUKKUR */}
          <div className="p-6 sm:p-7 rounded-2xl bg-slate-50 border-2 border-emerald-900/20 hover:border-emerald-700 shadow-sm transition-all space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-md bg-emerald-800 text-white font-black text-xs uppercase tracking-wider">
                  Branch 2
                </span>
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Open 7 Days a Week
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900">Madukkur Branch</h3>
                <p className="text-xs text-slate-500 mt-0.5">Air Ticket Booking • Holiday Tours • Visa Document Reception</p>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-slate-200">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>MMS Air Travels</strong><br />
                    <span>{LOCATIONS.madukkur.address}</span>
                    <a
                      href={LOCATIONS.madukkur.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-[11px] text-emerald-800 hover:text-emerald-900 font-semibold underline mt-0.5"
                    >
                      📍 Open in Google Maps ↗
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Working Hours: {LOCATIONS.madukkur.hours}</span>
                </div>

                <div className="pt-2 border-t border-slate-200 space-y-1.5 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-sans">General Inquiry:</span>
                    <a href={CONTACT_NUMBERS.general.tel} className="font-bold text-blue-900 hover:underline">
                      {CONTACT_NUMBERS.general.formatted}
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-sans">Flight Tickets:</span>
                    <a href={CONTACT_NUMBERS.ticket.tel} className="font-bold text-amber-700 hover:underline">
                      {CONTACT_NUMBERS.ticket.formatted}
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-sans">Visa & Services:</span>
                    <a href={CONTACT_NUMBERS.services.tel} className="font-bold text-emerald-800 hover:underline">
                      {CONTACT_NUMBERS.services.formatted}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center gap-2">
              <a
                href={CONTACT_NUMBERS.services.tel}
                className="flex-1 text-center py-2.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wide transition-colors"
              >
                Call Madukkur
              </a>
              <a
                href={LOCATIONS.madukkur.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors flex items-center gap-1 text-xs font-bold"
                title="Open Madukkur Branch on Google Maps"
              >
                <MapPin className="w-4 h-4 text-rose-600" />
                <span className="hidden sm:inline">Map</span>
              </a>
              <a
                href={CONTACT_NUMBERS.services.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5 text-xs font-bold"
                title="WhatsApp Madukkur Branch"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* 4. OUR COMMITMENT & SERVICES */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-6 space-y-4">
          <span className="text-xs font-black text-blue-600 uppercase tracking-widest">
            WHY BOOK WITH MMS AIR TRAVELS
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
            Your Dedicated Travel & Cargo Gateway
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            MMS Air Travels & Cargo Service provides complete travel solutions with authentic personal service. Whether you are traveling for work, family vacation, medical needs, or pilgrimages, our team delivers the best airfares with confirmed PNRs on international GDS systems.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="text-xs font-bold text-slate-800">Global Standard Ticketing</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="text-xs font-bold text-slate-800">Direct Amadeus & Sabre GDS</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="text-xs font-bold text-slate-800">Dubai & Gulf Visit Visas</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="text-xs font-bold text-slate-800">International Air Cargo</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="text-xs font-bold text-slate-800">Passport Seva & Tatkaal</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="text-xs font-bold text-slate-800">Zero Hidden Booking Fees</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-black">
                ✈️
              </div>
              <h4 className="font-black text-sm text-slate-900">Airline Ticketing</h4>
              <p className="text-xs text-slate-500">Instant e-tickets across Emirates, Air Arabia, Saudia, IndiGo, Air India, Oman Air, Qatar Airways and all global carriers.</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-black">
                🛂
              </div>
              <h4 className="font-black text-sm text-slate-900">Visa Approvals</h4>
              <p className="text-xs text-slate-500">Express 24-hour Dubai visit visas, Singapore/Malaysia e-visas, Saudi Umrah visas, and Schengen embassy document guidance.</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black">
                📦
              </div>
              <h4 className="font-black text-sm text-slate-900">Express Air Cargo</h4>
              <p className="text-xs text-slate-500">Door-to-door air cargo logistics for personal baggage, household goods, and commercial packages with live tracking.</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-black">
                🛡️
              </div>
              <h4 className="font-black text-sm text-slate-900">Passport & MEA</h4>
              <p className="text-xs text-slate-500">Passport Seva Kendra appointments, urgent Tatkaal applications, certificate HRD & MEA Apostille attestation.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. WHY CHOOSE MMS AIR TRAVELS (Section 24 of Master Prompt) */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black text-blue-600 uppercase tracking-widest">
            WHY CHOOSE US
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Why Choose MMS AIR TRAVELS
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Trusted by thousands across Tamil Nadu and global expatriates for dependable travel solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {/* Pillar 1 */}
          <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-3 flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-lg">
              ❤️
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-slate-900">49K+ Happy Customers</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Thousands of customers have trusted MMS AIR TRAVELS for their travel requirements.
              </p>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-3 flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
              📅
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-slate-900">Experienced Travel Service</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Serving customers in Madukkur with reliable travel services since 2020.
              </p>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-3 flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-lg">
              📍
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-slate-900">Growing Local Presence</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Expanding our dedicated travel services to Adirampattinam since 2026.
              </p>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-3 flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
              🤝
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-slate-900">Customer-Focused Service</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                We aim to make travel arrangements simple, transparent, and convenient for everyone.
              </p>
            </div>
          </div>

          {/* Pillar 5 */}
          <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-3 flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg">
              ✈️
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-slate-900">Travel Assistance</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Complete support for flight, bus, visa, ticket, baggage, and other travel enquiries.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. FINAL CALL TO ACTION (Section 27 of Master Prompt) */}
      <div className="bg-gradient-to-r from-[#082c74] via-[#006097] to-[#041a4a] text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl border border-blue-900/50">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold border border-white/15">
          <span>❤️ 49K+ Happy Customers</span>
          <span>•</span>
          <span>Madukkur – Since 2020 | Adirampattinam – Since 2026</span>
        </div>

        <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
          Ready to Start Your Journey? ✈️
        </h3>
        
        <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto leading-relaxed">
          Let <strong>MMS AIR TRAVELS</strong> help you plan your next trip.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => onNavigateTab('flight-ticket')}
            className="px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg transition-transform hover:scale-105 cursor-pointer"
          >
            ✈️ Book Your Trip
          </button>
          <a
            href={CONTACT_NUMBERS.general.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-transform hover:scale-105 cursor-pointer flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>💬 WhatsApp Us</span>
          </a>
          <button
            onClick={() => onNavigateTab('contact-us')}
            className="px-6 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs uppercase tracking-wider border border-white/20 transition-all cursor-pointer flex items-center gap-2"
          >
            <Phone className="w-4 h-4" />
            <span>📞 Contact Us</span>
          </button>
        </div>
      </div>

    </div>
  );
};

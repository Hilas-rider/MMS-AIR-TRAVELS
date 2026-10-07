import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageSquare, 
  CheckCircle2, 
  ShieldCheck,
  Send,
  Building,
  Building2,
  ExternalLink,
  Plane,
  Headphones,
  Copy,
  Check
} from 'lucide-react';
import { generateInquiryReference, copyTextToClipboard } from '../utils/referenceNumber';
import { FlightInquiry } from '../types';
import { CONTACT_NUMBERS, LOCATIONS } from '../data/contactInfo';

interface ContactUsViewProps {
  onInquiryCreated?: (inquiry: FlightInquiry) => void;
}

export const ContactUsView: React.FC<ContactUsViewProps> = ({ onInquiryCreated }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Flight Booking Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [generatedRef, setGeneratedRef] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const refCode = generateInquiryReference('Contact');
    setGeneratedRef(refCode);

    const newInquiry: FlightInquiry = {
      id: `inq-cnt-${Date.now()}`,
      token: refCode,
      referenceNumber: refCode,
      serviceType: 'Contact',
      serviceName: subject,
      routeSummary: `Direct Inquiry: ${subject}`,
      createdAt: new Date().toISOString(),
      leadPassenger: {
        title: 'Customer',
        fullName: name,
        phone: phone,
        whatsapp: phone,
        email: email
      },
      notes: message,
      status: 'NEW'
    };

    // Save locally
    try {
      const existing = localStorage.getItem('mms_flight_inquiries');
      const list: FlightInquiry[] = existing ? JSON.parse(existing) : [];
      localStorage.setItem('mms_flight_inquiries', JSON.stringify([newInquiry, ...list]));
    } catch {
      // ignore
    }

    // Attempt API save
    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInquiry)
      });
    } catch {
      // offline / client mode fallback
    }

    if (onInquiryCreated) {
      onInquiryCreated(newInquiry);
    }

    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setName('');
    setPhone('');
    setEmail('');
    setMessage('');
    setGeneratedRef('');
    setCopied(false);
  };

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-slate-800">
        <span className="text-amber-400 font-black text-xs uppercase tracking-widest block mb-1">
          24/7 GLOBAL CUSTOMER HELPDESK & PASSENGER ASSISTANCE
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          Contact MMS Air Travels & Cargo Service
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-2 leading-relaxed">
          Reach our dedicated travel executives, visa specialists, and air cargo tracking coordinators at any time. We are here to assist with bookings, date changes, emergency queries, and cargo logistics.
        </p>
      </div>

      {/* Primary Contact Cards Grid with the EXACT User-Provided Phone Numbers and Emails */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Official Call Hotlines */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 hover:border-blue-500 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-black text-base text-slate-900">Official Call Hotlines</h3>
            <p className="text-xs text-slate-500 mt-0.5">Direct lines for instant flight & tour inquiries</p>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <a 
              href={CONTACT_NUMBERS.general.tel}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-900 hover:text-blue-700 transition-colors font-mono font-black text-sm"
            >
              <span>{CONTACT_NUMBERS.general.formatted}</span>
              <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">General Inquiry</span>
            </a>

            <a 
              href={CONTACT_NUMBERS.ticket.tel}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50 text-slate-900 hover:text-amber-800 transition-colors font-mono font-black text-sm"
            >
              <span>{CONTACT_NUMBERS.ticket.formatted}</span>
              <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Ticket Booking</span>
            </a>

            <a 
              href={CONTACT_NUMBERS.services.tel}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-900 hover:text-emerald-800 transition-colors font-mono font-black text-sm"
            >
              <span>{CONTACT_NUMBERS.services.formatted}</span>
              <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Visa, Tour & Other</span>
            </a>
          </div>
        </div>

        {/* Card 2: Official Email Addresses */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 hover:border-amber-500 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-inner">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-black text-base text-slate-900">Email Desks</h3>
            <p className="text-xs text-slate-500 mt-0.5">Quick responses within 15 to 30 minutes</p>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <a 
              href="mailto:mmsairtravels@gmail.com" 
              className="block p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50 text-slate-800 hover:text-amber-800 transition-colors font-bold"
            >
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">General Desk</span>
              <span className="break-all font-mono">mmsairtravels@gmail.com</span>
            </a>

            <a 
              href="mailto:mmsairtravelsandcargoservice@gmail.com" 
              className="block p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50 text-slate-800 hover:text-amber-800 transition-colors font-bold"
            >
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Air Cargo Operations</span>
              <span className="break-all font-mono">mmsairtravelsandcargoservice@gmail.com</span>
            </a>

            <a 
              href="mailto:mmsairtravels.booking@gmail.com" 
              className="block p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50 text-slate-800 hover:text-amber-800 transition-colors font-bold"
            >
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Reservations & E-Tickets</span>
              <span className="break-all font-mono">mmsairtravels.booking@gmail.com</span>
            </a>
          </div>
        </div>

        {/* Card 3: Physical Headquarters & Branches */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 hover:border-emerald-500 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-black text-base text-slate-900">Branch Locations Only</h3>
            <p className="text-xs text-slate-500 mt-0.5">Physical walk-in branches in Adirampattinam & Madukkur</p>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
            <div>
              <strong className="text-slate-900 block font-bold">1. Adirampattinam Branch (HQ):</strong>
              <span className="text-slate-600">{LOCATIONS.adirampattinam.address}</span>
            </div>
            <div>
              <strong className="text-slate-900 block font-bold">2. Madukkur Branch:</strong>
              <span className="text-slate-600">{LOCATIONS.madukkur.address}</span>
            </div>
            <div>
              <strong className="text-slate-900 block font-bold">Working Hours:</strong>
              <span className="text-emerald-700 font-semibold">Open 7 Days a Week (9:00 AM - 10:00 PM)</span>
            </div>
          </div>
        </div>

      </div>

      {/* DEDICATED BRANCH OFFICES SHOWCASE: ADIRAMPATTINAM & MADUKKUR ONLY */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-900" />
              <h3 className="text-xl font-black text-slate-900">Our Physical Branches (Adirampattinam & Madukkur Only)</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Visit our authorized branch desks for flight bookings, visa stamping, holiday packages, and air cargo.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Adirampattinam & Madukkur Desks Open
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* BRANCH 1: ADIRAMPATTINAM */}
          <div className="bg-white rounded-2xl p-6 border-2 border-blue-900/20 hover:border-blue-900 shadow-sm transition-all space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md bg-blue-900 text-white font-black text-[10px] uppercase tracking-wider">
                  Head Office • Branch 1
                </span>
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Walk-ins Welcome
                </span>
              </div>

              <div>
                <h4 className="text-lg font-black text-slate-900">Adirampattinam Branch</h4>
                <p className="text-xs text-slate-500 mt-0.5">International Ticketing • Gulf Passenger Desk • Express Cargo</p>
              </div>

              <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-start gap-2">
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

                <div className="space-y-1 pt-1 font-mono">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-slate-500">General Inquiry:</span>
                    <a href={CONTACT_NUMBERS.general.tel} className="font-bold text-blue-900 hover:underline">
                      {CONTACT_NUMBERS.general.formatted}
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-slate-500">Flight Ticket:</span>
                    <a href={CONTACT_NUMBERS.ticket.tel} className="font-bold text-amber-700 hover:underline">
                      {CONTACT_NUMBERS.ticket.formatted}
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-slate-500">Visa & Tour:</span>
                    <a href={CONTACT_NUMBERS.services.tel} className="font-bold text-emerald-800 hover:underline">
                      {CONTACT_NUMBERS.services.formatted}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{LOCATIONS.adirampattinam.hours}</span>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-700 block mb-1.5">Specialized Services:</span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-800 text-[10px] font-bold rounded">Gulf Air Tickets</span>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-800 text-[10px] font-bold rounded">Dubai Visas</span>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-800 text-[10px] font-bold rounded">Umrah Assistance</span>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-800 text-[10px] font-bold rounded">Express Cargo</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
              <a
                href={CONTACT_NUMBERS.ticket.tel}
                className="flex-1 text-center py-2.5 px-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs transition-colors"
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
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                title="WhatsApp Adirampattinam Branch"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* BRANCH 2: MADUKKUR */}
          <div className="bg-white rounded-2xl p-6 border-2 border-emerald-900/20 hover:border-emerald-600 shadow-sm transition-all space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md bg-emerald-700 text-white font-black text-[10px] uppercase tracking-wider">
                  Branch 2
                </span>
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Walk-ins Welcome
                </span>
              </div>

              <div>
                <h4 className="text-lg font-black text-slate-900">Madukkur Branch</h4>
                <p className="text-xs text-slate-500 mt-0.5">Air Ticket Booking • Holiday Tours • Visa Document Reception</p>
              </div>

              <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-start gap-2">
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

                <div className="space-y-1 pt-1 font-mono">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-slate-500">General Inquiry:</span>
                    <a href={CONTACT_NUMBERS.general.tel} className="font-bold text-blue-900 hover:underline">
                      {CONTACT_NUMBERS.general.formatted}
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-slate-500">Flight Ticket:</span>
                    <a href={CONTACT_NUMBERS.ticket.tel} className="font-bold text-amber-700 hover:underline">
                      {CONTACT_NUMBERS.ticket.formatted}
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-slate-500">Visa & Tour:</span>
                    <a href={CONTACT_NUMBERS.services.tel} className="font-bold text-emerald-800 hover:underline">
                      {CONTACT_NUMBERS.services.formatted}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{LOCATIONS.madukkur.hours}</span>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-700 block mb-1.5">Specialized Services:</span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded">Worldwide Ticketing</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded">Group Fares</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded">Singapore/Malaysia</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded">Parcel Pickup</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
              <a
                href={CONTACT_NUMBERS.services.tel}
                className="flex-1 text-center py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors"
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
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                title="WhatsApp Madukkur Branch"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Contact Form Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-xl font-black text-slate-900">Send Us a Direct Message</h3>
            <p className="text-xs text-slate-500 mt-1">
              Fill in your inquiry details and our senior travel planner will reach out to you immediately.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-3xl text-center space-y-4 animate-fadeIn">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-900">Inquiry Received & Registered!</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                  Thank you, <strong className="text-slate-900">{name}</strong>. Your message regarding <strong className="text-slate-900">{subject}</strong> has been logged in our reservations system.
                </p>
              </div>

              {/* Official Reference Number Box */}
              {generatedRef && (
                <div className="max-w-md mx-auto p-4 bg-white rounded-2xl border-2 border-emerald-300 shadow-sm space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Your Official Inquiry Reference Number
                  </span>
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-mono font-black text-lg text-emerald-800 tracking-wide">
                      {generatedRef}
                    </span>
                    <button
                      onClick={async () => {
                        await copyTextToClipboard(generatedRef);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
                      title="Copy Reference Number"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Quote this reference number when contacting our helpdesk for instant status verification.
                  </p>
                </div>
              )}

              {/* Actions: WhatsApp or Submit another */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <a
                  href={`https://wa.me/91${CONTACT_NUMBERS.general.number}?text=${encodeURIComponent(`Hello MMS Air Travels, I have submitted an inquiry for ${subject}. My Reference Number is ${generatedRef}. Customer Name: ${name}, Phone: ${phone}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Travel Desk</span>
                </a>

                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-300 shadow-sm transition-all cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mohamed Riyaz"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl outline-none font-medium focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 6369012360"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl outline-none font-medium focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. yourname@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl outline-none font-medium focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject / Inquiry Type *</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl outline-none font-medium bg-white focus:border-blue-600"
                  >
                    <option value="Flight Booking Inquiry">Flight Booking Inquiry</option>
                    <option value="Visa Services Application">Visa Services Application</option>
                    <option value="India Tour Package">India Tour Package</option>
                    <option value="International Tour Package">International Tour Package</option>
                    <option value="Group Tours Reservation">Group Tours Reservation</option>
                    <option value="Air Cargo & Freight Shipment">Air Cargo & Freight Shipment</option>
                    <option value="Passport / Attestation Service">Passport / Attestation Service</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Message / Requirements *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your travel dates, passenger count, preferred destinations, or cargo weight..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-xl outline-none font-medium focus:border-blue-600"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Send Message</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* WhatsApp & Instant Callback Spotlight */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white rounded-3xl p-6 sm:p-7 shadow-lg space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-black">Chat on WhatsApp</h3>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Prefer instant messaging? Chat with our desks on WhatsApp for fast ticket quotes and visa document checks.
            </p>
            <div className="space-y-2">
              <a
                href={CONTACT_NUMBERS.general.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between w-full py-2.5 px-3.5 rounded-xl bg-white text-emerald-800 font-bold text-xs uppercase tracking-wider shadow-md hover:bg-emerald-50 transition-colors"
              >
                <span>General Helpdesk</span>
                <span className="font-mono">{CONTACT_NUMBERS.general.formatted}</span>
              </a>
              <a
                href={CONTACT_NUMBERS.ticket.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between w-full py-2.5 px-3.5 rounded-xl bg-emerald-900/40 text-white border border-white/20 font-bold text-xs uppercase tracking-wider hover:bg-emerald-900/60 transition-colors"
              >
                <span>Flight Tickets</span>
                <span className="font-mono">{CONTACT_NUMBERS.ticket.formatted}</span>
              </a>
              <a
                href={CONTACT_NUMBERS.services.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between w-full py-2.5 px-3.5 rounded-xl bg-emerald-900/40 text-white border border-white/20 font-bold text-xs uppercase tracking-wider hover:bg-emerald-900/60 transition-colors"
              >
                <span>Visa & Tour Services</span>
                <span className="font-mono">{CONTACT_NUMBERS.services.formatted}</span>
              </a>
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <ShieldCheck className="w-5 h-5" />
              <span>Verified Travel Agency Guarantee</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Every passenger ticket issued through MMS Air Travels is registered on airline Global Distribution Systems (Amadeus, Sabre, Galileo) with instant e-ticket confirmation.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};

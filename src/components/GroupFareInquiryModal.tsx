import React, { useState } from 'react';
import { 
  X, 
  Users, 
  Plane, 
  Calendar, 
  Luggage, 
  Utensils, 
  ShieldCheck, 
  Send, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Sparkles, 
  MessageSquare, 
  MapPin, 
  Clock,
  Copy,
  Check
} from 'lucide-react';
import { GroupFareItem, CurrencyCode, FlightInquiry } from '../types';
import { formatCurrency } from '../data/airports';
import { generateInquiryReference, copyTextToClipboard } from '../utils/referenceNumber';
import { CONTACT_NUMBERS } from '../data/contactInfo';

interface GroupFareInquiryModalProps {
  groupFare?: GroupFareItem | null;
  currency: CurrencyCode;
  onClose: () => void;
  onSubmitInquiry: (inquiry: FlightInquiry) => void;
}

export const GroupFareInquiryModal: React.FC<GroupFareInquiryModalProps> = ({
  groupFare,
  currency,
  onClose,
  onSubmitInquiry
}) => {
  // Form state
  const [passengerCount, setPassengerCount] = useState<number>(groupFare ? 4 : 5);
  const [groupType, setGroupType] = useState<string>(groupFare?.category || 'Gulf / Dubai Bulk');
  const [customOrigin, setCustomOrigin] = useState<string>(groupFare ? `${groupFare.origin.city} (${groupFare.origin.code})` : 'Chennai (MAA)');
  const [customDestination, setCustomDestination] = useState<string>(groupFare ? `${groupFare.destination.city} (${groupFare.destination.code})` : 'Dubai (DXB)');
  const [travelDate, setTravelDate] = useState<string>(groupFare?.departureDate || '2026-09-20');

  // Contact info
  const [title, setTitle] = useState('Mr');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Adirampattinam');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedToken, setGeneratedToken] = useState('');
  const [copiedRef, setCopiedRef] = useState(false);

  const handleCopyRef = async () => {
    if (!generatedToken) return;
    const ok = await copyTextToClipboard(generatedToken);
    if (ok) {
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2500);
    }
  };

  const perPaxINR = groupFare ? groupFare.fareINR : 16500;
  const perPaxUSD = groupFare ? groupFare.fareUSD : 198;
  const totalINR = perPaxINR * passengerCount;
  const totalUSD = perPaxUSD * passengerCount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;

    const token = generateInquiryReference('GroupFare');
    setGeneratedToken(token);

    const routeText = groupFare 
      ? `${groupFare.origin.code} ➔ ${groupFare.destination.code}` 
      : `${customOrigin} ➔ ${customDestination}`;

    // Create inquiry record
    const newInquiry: FlightInquiry = {
      id: `inq-grp-${Date.now()}`,
      token: token,
      referenceNumber: token,
      serviceType: 'GroupFare',
      serviceName: `${groupType} Bulk Block Allocation`,
      routeSummary: routeText,
      createdAt: new Date().toISOString(),
      tripType: 'one-way',
      flight: groupFare ? {
        id: groupFare.id,
        flightNumber: groupFare.flightNumber,
        airline: groupFare.airline,
        airlineCode: groupFare.airlineCode,
        airlineLogoColor: groupFare.airlineLogoColor,
        aircraft: groupFare.aircraft,
        origin: groupFare.origin,
        destination: groupFare.destination,
        departureDate: groupFare.departureDate,
        departureTime: groupFare.departureTime,
        arrivalDate: groupFare.arrivalDate,
        arrivalTime: groupFare.arrivalTime,
        durationMinutes: 240,
        stops: groupFare.stops,
        basePrice: groupFare.fareUSD,
        availableSeats: groupFare.availableSeats,
        cabinClass: 'economy',
        amenities: { wifi: true, meal: groupFare.mealIncluded, power: true, entertainment: true, seatPitch: '32"' },
        terminalDep: 'T3',
        terminalArr: 'T1',
        gate: 'G12',
        status: 'SCHEDULED'
      } : {
        id: `custom-grp-${Date.now()}`,
        flightNumber: 'GRP-CUSTOM',
        airline: 'Group Airline Block',
        airlineCode: 'GRP',
        airlineLogoColor: 'from-blue-900 to-indigo-900',
        aircraft: 'Commercial Jet',
        origin: { code: 'MAA', city: customOrigin, name: customOrigin, country: 'India' },
        destination: { code: 'DXB', city: customDestination, name: customDestination, country: 'UAE' },
        departureDate: travelDate,
        departureTime: '10:00',
        arrivalDate: travelDate,
        arrivalTime: '14:00',
        durationMinutes: 240,
        stops: 0,
        basePrice: perPaxUSD,
        availableSeats: 50,
        cabinClass: 'economy',
        amenities: { wifi: true, meal: true, power: true, entertainment: true, seatPitch: '32"' },
        terminalDep: 'T2',
        terminalArr: 'T1',
        gate: 'G08',
        status: 'SCHEDULED'
      },
      fareTier: 'standard',
      departureDate: groupFare ? groupFare.departureDate : travelDate,
      passengers: { adults: passengerCount, children: 0, infants: 0 },
      leadPassenger: {
        title,
        fullName,
        phone,
        whatsapp: whatsapp || phone,
        email,
        cityOfResidence: city
      },
      preferences: {
        meal: 'Complimentary Group Meal',
        extraBaggageKg: 30,
        visaAssistanceRequired: groupType.includes('Dubai') || groupType.includes('Gulf')
      },
      quotedPriceUSD: totalUSD,
      currency: currency,
      notes: `[GROUP FARE INQUIRY] Group Type: ${groupType}. Total Pax: ${passengerCount}. Custom Notes: ${notes}`,
      status: 'NEW',
      adminNotes: `Group Fare inquiry logged from website. Route: ${customOrigin} -> ${customDestination}. Pax: ${passengerCount}.`
    };

    onSubmitInquiry(newInquiry);
    setIsSubmitted(true);
  };

  const generateWhatsAppUrl = () => {
    const routeText = groupFare 
      ? `${groupFare.origin.city} (${groupFare.origin.code}) to ${groupFare.destination.city} (${groupFare.destination.code}) on ${groupFare.departureDate} [Flight: ${groupFare.flightNumber}]` 
      : `${customOrigin} to ${customDestination} on ${travelDate}`;
    
    const text = `Hello MMS Air Travels (Adirai Branch),
I want to inquire about Group Fare booking:
• Ref Token: ${generatedToken || 'GRP-INQUIRY'}
• Route: ${routeText}
• Group Type: ${groupType}
• Total Passengers: ${passengerCount}
• Lead Contact: ${title} ${fullName}
• Phone: ${phone}
• City: ${city}
Please share best group rate quote and blocked PNR availability. Thank you!`;

    return `https://wa.me/91${CONTACT_NUMBERS.ticket.number}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Modal Top Bar */}
        <div className="bg-gradient-to-r from-blue-950 via-indigo-900 to-blue-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-amber-300 font-bold uppercase tracking-wider block">
                MMS AIR TRAVELS • WHOLESALE DESK
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white">
                {groupFare ? `Group Fare Inquiry: ${groupFare.groupCode}` : 'Special Group Fare & Bulk Seat Inquiry'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-6">
            
            {/* Selected Group Fare Summary Card */}
            {groupFare ? (
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-blue-900 uppercase">{groupFare.airline}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-200 text-blue-900 font-mono font-bold">
                      {groupFare.flightNumber}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-bold">
                      {groupFare.category}
                    </span>
                  </div>
                  <div className="text-sm font-extrabold text-slate-900">
                    {groupFare.origin.city} ({groupFare.origin.code}) → {groupFare.destination.city} ({groupFare.destination.code})
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    Date: <strong className="text-slate-800">{groupFare.departureDate}</strong> • Timing: {groupFare.departureTime} - {groupFare.arrivalTime}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Blocked Rate:</span>
                  <span className="text-xl font-black text-blue-900">
                    {currency === 'INR' ? `₹${groupFare.fareINR.toLocaleString('en-IN')}` : formatCurrency(groupFare.fareUSD, currency)}
                  </span>
                  <span className="text-[10px] text-emerald-700 block font-bold">/ passenger</span>
                </div>
              </div>
            ) : (
              /* Custom Group Route fields */
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">From (Origin)</label>
                  <input
                    type="text"
                    value={customOrigin}
                    onChange={(e) => setCustomOrigin(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-hidden font-medium"
                    placeholder="e.g. Chennai (MAA)"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">To (Destination)</label>
                  <input
                    type="text"
                    value={customDestination}
                    onChange={(e) => setCustomDestination(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-hidden font-medium"
                    placeholder="e.g. Dubai (DXB)"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Preferred Date</label>
                  <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-hidden font-medium"
                    required
                  />
                </div>
              </div>
            )}

            {/* Passenger Count & Group Category Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center justify-between">
                  <span>Number of Passengers (Pax)</span>
                  <span className="text-blue-900 font-extrabold text-sm">{passengerCount} Passengers</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="2"
                    max="60"
                    value={passengerCount}
                    onChange={(e) => setPassengerCount(parseInt(e.target.value) || 2)}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-900"
                  />
                  <input
                    type="number"
                    min="2"
                    max="200"
                    value={passengerCount}
                    onChange={(e) => setPassengerCount(Math.max(2, parseInt(e.target.value) || 2))}
                    className="w-16 px-2 py-1 text-center text-xs font-bold border border-slate-300 rounded-xl"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Group fares start from 2+ passengers</span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Group Category / Purpose</label>
                <select
                  value={groupType}
                  onChange={(e) => setGroupType(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-blue-600 outline-hidden"
                >
                  <option value="Gulf / Dubai Bulk">Gulf / Dubai Worker or Family Group</option>
                  <option value="Umrah Group">Umrah Pilgrimage Group (Jeddah/Madinah)</option>
                  <option value="Southeast Asia">Southeast Asia Tour (Singapore / Malaysia / Thailand)</option>
                  <option value="Family Holiday">Family Holiday & Leisure Vacation</option>
                  <option value="Corporate / Business">Corporate Delegation / Business Group</option>
                  <option value="Students / Friends">Student Group / Friends Group</option>
                </select>
              </div>
            </div>

            {/* Lead Passenger & Contact Information */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-900" />
                <span>Lead Contact / Group Coordinator Details</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-1">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Title</label>
                  <select
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-blue-600 outline-hidden"
                  >
                    <option value="Mr">Mr.</option>
                    <option value="Mrs">Mrs.</option>
                    <option value="Ms">Ms.</option>
                    <option value="Haji">Haji</option>
                    <option value="Dr">Dr.</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Coordinator Full Name *</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-hidden font-medium"
                    placeholder="e.g. Mohamed Riyaz"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Phone *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-hidden font-medium"
                    placeholder="e.g. 6369012360"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">WhatsApp Number</label>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-hidden font-medium"
                    placeholder="Same as mobile or WhatsApp"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">City / Town</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-hidden font-medium"
                    placeholder="e.g. Adirampattinam / Madukkur"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-hidden font-medium"
                  placeholder="e.g. yourname@gmail.com"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Special Inquiries / Luggage Requirements</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-hidden font-medium"
                  placeholder="e.g. Need 40kg baggage allowance per person, vegetarian meals, wheelchair assistance, or return date options..."
                />
              </div>
            </div>

            {/* Estimated Total Calculation Strip */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs text-blue-200 block font-medium">Estimated Total for {passengerCount} Passengers:</span>
                <span className="text-2xl sm:text-3xl font-black text-amber-300">
                  {currency === 'INR' ? `₹${totalINR.toLocaleString('en-IN')}` : formatCurrency(totalUSD, currency)}
                </span>
                <span className="text-[10px] text-blue-200 block">Includes all taxes, baggage & group discount</span>
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send Group Fare Inquiry</span>
              </button>
            </div>
          </form>
        ) : (
          /* Confirmation State with Direct WhatsApp link to Adirampattinam office */
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-3">
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Inquiry Logged Successfully
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Group Fare Inquiry Received!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Thank you <strong>{title} {fullName}</strong>. Your official group inquiry reference is:
              </p>
              
              {/* High visibility Reference Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-900/30 rounded-2xl p-4 max-w-md mx-auto shadow-xs">
                <span className="text-[10px] uppercase font-black text-blue-900 tracking-wider block mb-1">
                  OFFICIAL GROUP INQUIRY REFERENCE NUMBER
                </span>
                <div className="flex items-center justify-center gap-3">
                  <span className="font-mono text-2xl font-black text-blue-950 tracking-wider">
                    {generatedToken}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyRef}
                    className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 inline-flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                    title="Copy Reference Number"
                  >
                    {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                    <span>{copiedRef ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-blue-900/80 mt-2 font-medium">
                  Quote this Reference Number for all correspondence with our Adirampattinam group desk.
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-left space-y-2 max-w-md mx-auto">
              <div className="flex items-center justify-between text-slate-700">
                <span className="font-semibold">Reference Number:</span>
                <span className="font-mono font-bold text-slate-900">{generatedToken}</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="font-semibold">Route:</span>
                <span className="font-bold">{groupFare ? `${groupFare.origin.code} → ${groupFare.destination.code}` : `${customOrigin} → ${customDestination}`}</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="font-semibold">Passengers:</span>
                <span className="font-bold text-blue-900">{passengerCount} Pax</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="font-semibold">Agency Desk:</span>
                <span className="font-bold text-slate-900">Adirampattinam Branch #1</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <a
                href={generateWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Chat Instantly on WhatsApp for Fast PNR</span>
              </a>

              <button
                onClick={onClose}
                className="w-full py-3 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

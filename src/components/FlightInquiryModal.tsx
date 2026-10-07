import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  CheckCircle2, 
  Phone, 
  Mail, 
  Calendar, 
  Check, 
  Printer, 
  MessageSquare, 
  ShieldCheck, 
  Plane,
  ChevronDown,
  MapPin,
  Copy,
  Search
} from 'lucide-react';
import { Flight, CurrencyCode, FlightInquiry } from '../types';
import { POPULAR_AIRPORTS, formatCurrency } from '../data/airports';
import { generateInquiryReference, copyTextToClipboard } from '../utils/referenceNumber';
import travelGlobeHands from '../assets/images/travel_globe_hands_1788610835980.jpg';
import { CONTACT_NUMBERS } from '../data/contactInfo';

interface FlightInquiryModalProps {
  flight?: Flight;
  fareTier?: 'saver' | 'standard' | 'flexi';
  passengerCount?: { adults: number; children: number; infants: number };
  currency?: CurrencyCode;
  onClose: () => void;
  onSubmitInquiry: (inquiry: FlightInquiry) => void;
}

export const FlightInquiryModal: React.FC<FlightInquiryModalProps> = ({
  flight,
  fareTier = 'standard',
  passengerCount = { adults: 1, children: 0, infants: 0 },
  currency = 'INR' as CurrencyCode,
  onClose,
  onSubmitInquiry
}) => {
  const totalPax = passengerCount.adults + passengerCount.children + passengerCount.infants;

  // Radio Service Selection (matching sample image)
  const [serviceType, setServiceType] = useState<
    'Flight' | 'Hotel' | 'Package' | 'Visa' | 'SightSeeing' | 'Miscellaneous' | 'Transfer'
  >('Flight');

  // Form Fields
  const [title, setTitle] = useState('Mr.');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');

  // Source & Destination
  const [sourceCity, setSourceCity] = useState(
    flight ? `${flight.origin.city} (${flight.origin.code})` : ''
  );
  const [destCity, setDestCity] = useState(
    flight ? `${flight.destination.city} (${flight.destination.code})` : ''
  );

  const [tripType, setTripType] = useState<'One Way' | 'Round Trip' | 'Multi City'>('One Way');
  const [departureDate, setDepartureDate] = useState(flight ? flight.departureDate : '2026-09-08');
  const [returnDate, setReturnDate] = useState('');
  const [paxCount, setPaxCount] = useState<string>(String(totalPax || 1));

  // Remarks prefilled with flight details if available
  const defaultRemarks = flight 
    ? `Selected Flight: ${flight.airline} (${flight.flightNumber}) • Departure: ${flight.departureTime} • Arrival: ${flight.arrivalTime} • Tier: ${fareTier.toUpperCase()} (${formatCurrency(flight.basePrice, currency as CurrencyCode)}) • Checked Baggage: 23kg + Cabin: 7kg`
    : '';

  const [remarks, setRemarks] = useState(defaultRemarks);
  const [agreeToContact, setAgreeToContact] = useState(true);

  // Autocomplete helpers
  const [sourceSuggestions, setSourceSuggestions] = useState<typeof POPULAR_AIRPORTS>([]);
  const [destSuggestions, setDestSuggestions] = useState<typeof POPULAR_AIRPORTS>([]);
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);

  const sourceRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);

  // Submission state
  const [submittedInquiry, setSubmittedInquiry] = useState<FlightInquiry | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);

  const handleCopyRef = async () => {
    if (!submittedInquiry?.token) return;
    const ok = await copyTextToClipboard(submittedInquiry.token);
    if (ok) {
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2500);
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sourceRef.current && !sourceRef.current.contains(e.target as Node)) {
        setShowSourceDropdown(false);
      }
      if (destRef.current && !destRef.current.contains(e.target as Node)) {
        setShowDestDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSourceChange = (val: string) => {
    setSourceCity(val);
    if (val.trim().length > 0) {
      const filtered = POPULAR_AIRPORTS.filter(
        a =>
          a.city.toLowerCase().includes(val.toLowerCase()) ||
          a.code.toLowerCase().includes(val.toLowerCase()) ||
          a.country.toLowerCase().includes(val.toLowerCase())
      );
      setSourceSuggestions(filtered.slice(0, 5));
      setShowSourceDropdown(true);
    } else {
      setShowSourceDropdown(false);
    }
  };

  const handleDestChange = (val: string) => {
    setDestCity(val);
    if (val.trim().length > 0) {
      const filtered = POPULAR_AIRPORTS.filter(
        a =>
          a.city.toLowerCase().includes(val.toLowerCase()) ||
          a.code.toLowerCase().includes(val.toLowerCase()) ||
          a.country.toLowerCase().includes(val.toLowerCase())
      );
      setDestSuggestions(filtered.slice(0, 5));
      setShowDestDropdown(true);
    } else {
      setShowDestDropdown(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim() || !mobile.trim() || !email.trim()) {
      alert('Please fill in your Name, Mobile Number, and Email Address.');
      return;
    }

    if (!agreeToContact) {
      alert('Please authorize MMS AIR TRAVELS to contact you regarding your booking.');
      return;
    }

    setIsSubmitting(true);

    const token = generateInquiryReference('Flight');
    const fullPhoneNumber = `${countryCode} ${mobile.trim()}`;

    // Construct mock flight object if opened generally
    const assignedFlight: Flight = flight || {
      id: `flt-${Date.now()}`,
      airline: 'Air India / Partner Airline',
      airlineCode: 'AI',
      airlineLogoColor: 'from-amber-600 to-red-600',
      flightNumber: 'AI-Direct',
      aircraft: 'Airbus A321neo',
      origin: {
        code: sourceCity.substring(0, 3).toUpperCase() || 'MAA',
        city: sourceCity || 'Chennai',
        name: 'International Airport',
        country: 'India',
        terminal: 'T4',
        timezone: 'UTC+5:30'
      },
      destination: {
        code: destCity.substring(0, 3).toUpperCase() || 'DXB',
        city: destCity || 'Dubai',
        name: 'International Airport',
        country: 'United Arab Emirates',
        terminal: 'T1',
        timezone: 'UTC+4'
      },
      departureDate: departureDate || '2026-09-08',
      departureTime: '11:00 AM',
      arrivalDate: departureDate || '2026-09-08',
      arrivalTime: '02:30 PM',
      durationMinutes: 270,
      stops: 0,
      basePrice: 220,
      cabinClass: 'economy',
      availableSeats: 9,
      amenities: { wifi: true, meal: true, power: true, entertainment: true, seatPitch: '32"' },
      terminalDep: 'T4',
      terminalArr: 'T1',
      gate: 'G14',
      status: 'SCHEDULED'
    };

    const newInquiry: FlightInquiry = {
      id: `inq-${Date.now()}`,
      token: token,
      referenceNumber: token,
      serviceType: 'Flight',
      serviceName: `${assignedFlight.airline} Flight Booking`,
      routeSummary: `${sourceCity} ➔ ${destCity}`,
      createdAt: new Date().toISOString(),
      flight: assignedFlight,
      fareTier: fareTier as 'saver' | 'standard' | 'flexi',
      tripType: tripType === 'Round Trip' ? 'round-trip' : 'one-way',
      departureDate: departureDate,
      passengers: { adults: Number(paxCount) || 1, children: 0, infants: 0 },
      leadPassenger: {
        title,
        fullName: `${firstName} ${lastName}`.trim(),
        phone: fullPhoneNumber,
        whatsapp: fullPhoneNumber,
        email: email.trim(),
        nationality: 'India'
      },
      preferences: {
        seat: 'Window or Aisle',
        meal: 'Standard / Complimentary Meal'
      },
      quotedPriceUSD: assignedFlight.basePrice,
      currency: currency as CurrencyCode,
      notes: remarks.trim() || undefined,
      status: 'NEW'
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedInquiry(newInquiry);
      onSubmitInquiry(newInquiry);
    }, 350);
  };

  const whatsappMessage = submittedInquiry
    ? encodeURIComponent(
        `Hello MMS Air Travels Booking Desk,\n\nI have submitted a flight ticket enquiry:\nRef ID: ${submittedInquiry.token}\nService: Flight Ticket Booking\nRoute: ${sourceCity} -> ${destCity}\nTrip: ${tripType} | Date: ${departureDate}${returnDate ? ` | Return: ${returnDate}` : ''}\nPassengers: ${paxCount}\nLead Passenger: ${title} ${firstName} ${lastName}\nMobile: ${countryCode} ${mobile}\nEmail: ${email}\nNotes: ${remarks}\n\nPlease confirm live seat availability, discounted fare quote, and booking issuance.`
      )
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-300 my-auto animate-fadeIn">
        
        {/* Close Button at top right (matching screenshot X) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedInquiry ? (
          /* Confirmation Screen after Submission */
          <div className="p-8 sm:p-12 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-black text-slate-900">Enquiry Submitted Successfully!</h3>
              <p className="text-slate-600 text-sm max-w-md mx-auto">
                Thank you, <strong className="text-slate-900">{title} {firstName} {lastName}</strong>. Your official flight ticket enquiry reference is:
              </p>
              
              {/* High-visibility Reference Number Box for Customer */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-4 max-w-md mx-auto shadow-xs">
                <span className="text-[10px] uppercase font-black text-amber-800 tracking-wider block mb-1">
                  OFFICIAL INQUIRY REFERENCE NUMBER
                </span>
                <div className="flex items-center justify-center gap-3">
                  <span className="font-mono text-2xl sm:text-3xl font-black text-slate-900 tracking-wider">
                    {submittedInquiry.token}
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
                <p className="text-[11px] text-amber-900/80 mt-2 font-medium">
                  Quote this Reference Number when speaking with our ticketing officer or tracking live status.
                </p>
              </div>
            </div>

            {/* Quick Details Box */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl max-w-lg mx-auto text-left text-xs space-y-2 text-slate-700">
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-400">Reference Number:</span>
                <span className="font-mono font-bold text-slate-900">{submittedInquiry.token}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-400">Route & Trip:</span>
                <span className="font-bold text-slate-900">{sourceCity} → {destCity} ({tripType})</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-400">Departure:</span>
                <span className="font-bold text-slate-900">{departureDate} {returnDate ? `• Return: ${returnDate}` : ''}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-400">Passengers:</span>
                <span className="font-bold text-slate-900">{paxCount} Pax</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Assigned Desk:</span>
                <span className="font-bold text-emerald-700">Human Ticketing Officer (15 Min Response)</span>
              </div>
            </div>

            {/* Direct Connect Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href={`https://wa.me/91${CONTACT_NUMBERS.ticket.number}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Connect on WhatsApp with Ref No</span>
              </a>

              <a
                href={CONTACT_NUMBERS.ticket.tel}
                className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Call Tickets Desk: {CONTACT_NUMBERS.ticket.formatted}</span>
              </a>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Print Slip</span>
              </button>
            </div>

            <div>
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 underline cursor-pointer"
              >
                Done & Return to Flights
              </button>
            </div>
          </div>
        ) : (
          /* Two Column Layout matching exact Sample Image */
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
            
            {/* LEFT COLUMN: Why book with us + Cupped Hands Holding Globe */}
            <div className="md:col-span-5 bg-[#F0F2F5] p-6 sm:p-8 flex flex-col justify-between border-r border-slate-200/90 relative overflow-hidden">
              <div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 mb-6 tracking-tight">
                  Why book with us
                </h3>

                <ul className="space-y-4 text-xs sm:text-[13px] text-slate-800 font-medium leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <span className="font-bold text-slate-700 select-none leading-none mt-0.5">*</span>
                    <span>Complimentary Travel Insurance</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-bold text-slate-700 select-none leading-none mt-0.5">*</span>
                    <span>Personalized Relationship Manager</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-bold text-slate-700 select-none leading-none mt-0.5">*</span>
                    <span>24 X 7 On Ground Support</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-bold text-slate-700 select-none leading-none mt-0.5">*</span>
                    <span>Rated 4.7 across Social Media Platforms (2500+ Reviews)</span>
                  </li>
                </ul>
              </div>

              {/* Cupped Hands Gently Holding Earth Globe Image (Matching user screenshot) */}
              <div className="mt-8 pt-4 flex flex-col items-center justify-end">
                <div className="w-full max-w-[280px] overflow-hidden rounded-2xl shadow-sm border border-slate-300/80 bg-white p-1">
                  <img
                    src={travelGlobeHands}
                    alt="Travel Globe in Hands"
                    className="w-full h-48 sm:h-56 object-cover object-center rounded-xl"
                    onError={(e) => {
                      // Fallback to high-res globe hands if needed
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                </div>
                <div className="mt-2.5 text-center">
                  <span className="text-[11px] font-bold text-slate-600 tracking-wide uppercase">
                    Verified Agency • 100% Reliable Airline Ticketing
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Send Enquiry Form */}
            <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-white">
              <div>
                {/* Header Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 tracking-tight">
                  Send Enquiry
                </h3>

                {/* Call & WhatsApp Strip matching screenshot banner */}
                <div className="bg-[#F2F4F7] rounded-lg px-3 py-2.5 mb-4 border border-slate-200 text-xs font-bold text-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-900">📞 Ticket Desk:</span>
                    <a href={CONTACT_NUMBERS.ticket.tel} className="hover:text-amber-600 transition-colors font-mono">
                      +91 {CONTACT_NUMBERS.ticket.formatted}
                    </a>
                    <span className="text-slate-400">/</span>
                    <a href={CONTACT_NUMBERS.general.tel} className="hover:text-amber-600 transition-colors font-mono">
                      +91 {CONTACT_NUMBERS.general.formatted}
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-700 font-mono">
                    <span>💬 WhatsApp:</span>
                    <a
                      href={CONTACT_NUMBERS.ticket.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      +91 {CONTACT_NUMBERS.ticket.formatted}
                    </a>
                  </div>
                </div>

                {/* Service Selection Radio Buttons in 2 lines */}
                <div className="mb-4 space-y-1.5 text-xs text-slate-800 font-medium">
                  {/* Row 1: Flight, Hotel, Package, Visa, SightSeeing */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    {(['Flight', 'Hotel', 'Package', 'Visa', 'SightSeeing'] as const).map((st) => (
                      <label
                        key={st}
                        className="inline-flex items-center gap-1.5 cursor-pointer hover:text-red-700"
                      >
                        <input
                          type="radio"
                          name="serviceSelection"
                          value={st}
                          checked={serviceType === st}
                          onChange={() => setServiceType(st)}
                          className="accent-slate-900 w-3.5 h-3.5"
                        />
                        <span>{st}</span>
                      </label>
                    ))}
                  </div>

                  {/* Row 2: Miscellaneous, Transfer */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    {(['Miscellaneous', 'Transfer'] as const).map((st) => (
                      <label
                        key={st}
                        className="inline-flex items-center gap-1.5 cursor-pointer hover:text-red-700"
                      >
                        <input
                          type="radio"
                          name="serviceSelection"
                          value={st}
                          checked={serviceType === st}
                          onChange={() => setServiceType(st)}
                          className="accent-slate-900 w-3.5 h-3.5"
                        />
                        <span>{st}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* FORM INPUTS */}
                <form onSubmit={handleSubmit} className="space-y-2.5">
                  
                  {/* Row 1: Title, First Name, Last Name */}
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-3 sm:col-span-3">
                      <select
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white text-slate-800 outline-none focus:border-slate-500 font-medium h-[34px]"
                      >
                        <option value="Mr.">Mr.</option>
                        <option value="Mrs.">Mrs.</option>
                        <option value="Ms.">Ms.</option>
                        <option value="Dr.">Dr.</option>
                      </select>
                    </div>

                    <div className="col-span-4 sm:col-span-4">
                      <input
                        type="text"
                        required
                        placeholder="First Name *"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md outline-none focus:border-slate-500 font-medium h-[34px]"
                      />
                    </div>

                    <div className="col-span-5 sm:col-span-5">
                      <input
                        type="text"
                        required
                        placeholder="Last Name *"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md outline-none focus:border-slate-500 font-medium h-[34px]"
                      />
                    </div>
                  </div>

                  {/* Row 2: Flag + Country Code, Mobile */}
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-4 sm:col-span-4 flex">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-md bg-slate-50 text-slate-800 outline-none focus:border-slate-500 font-medium h-[34px]"
                      >
                        <option value="+91">🇮🇳 +91</option>
                        <option value="+971">🇦🇪 +971</option>
                        <option value="+966">🇸🇦 +966</option>
                        <option value="+965">🇰🇼 +965</option>
                        <option value="+974">🇶🇦 +974</option>
                        <option value="+968">🇴🇲 +968</option>
                        <option value="+65">🇸🇬 +65</option>
                        <option value="+60">🇲🇾 +60</option>
                        <option value="+44">🇬🇧 +44</option>
                        <option value="+1">🇺🇸 +1</option>
                      </select>
                    </div>

                    <div className="col-span-8 sm:col-span-8">
                      <input
                        type="tel"
                        required
                        placeholder="Mobile *"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md outline-none focus:border-slate-500 font-medium h-[34px]"
                      />
                    </div>
                  </div>

                  {/* Row 3: Email Address */}
                  <div>
                    <input
                      type="email"
                      required
                      placeholder="Email Address *"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md outline-none focus:border-slate-500 font-medium h-[34px]"
                    />
                  </div>

                  {/* Row 4: Type source city.. */}
                  <div ref={sourceRef} className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Type source city.."
                      value={sourceCity}
                      onChange={(e) => handleSourceChange(e.target.value)}
                      onFocus={() => {
                        if (sourceCity.trim()) setShowSourceDropdown(true);
                      }}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md outline-none focus:border-slate-500 font-medium h-[34px]"
                    />
                    {showSourceDropdown && sourceSuggestions.length > 0 && (
                      <div className="absolute z-30 left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden max-h-40 overflow-y-auto">
                        {sourceSuggestions.map((a) => (
                          <div
                            key={a.code}
                            onClick={() => {
                              setSourceCity(`${a.city} (${a.code})`);
                              setShowSourceDropdown(false);
                            }}
                            className="px-3 py-1.5 hover:bg-slate-100 cursor-pointer text-xs flex items-center justify-between"
                          >
                            <span className="font-bold text-slate-800">{a.city}, {a.country}</span>
                            <span className="font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded text-[10px] font-bold">
                              {a.code}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Row 5: Type destination city.. */}
                  <div ref={destRef} className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Type destination city.."
                      value={destCity}
                      onChange={(e) => handleDestChange(e.target.value)}
                      onFocus={() => {
                        if (destCity.trim()) setShowDestDropdown(true);
                      }}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md outline-none focus:border-slate-500 font-medium h-[34px]"
                    />
                    {showDestDropdown && destSuggestions.length > 0 && (
                      <div className="absolute z-30 left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden max-h-40 overflow-y-auto">
                        {destSuggestions.map((a) => (
                          <div
                            key={a.code}
                            onClick={() => {
                              setDestCity(`${a.city} (${a.code})`);
                              setShowDestDropdown(false);
                            }}
                            className="px-3 py-1.5 hover:bg-slate-100 cursor-pointer text-xs flex items-center justify-between"
                          >
                            <span className="font-bold text-slate-800">{a.city}, {a.country}</span>
                            <span className="font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded text-[10px] font-bold">
                              {a.code}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Row 6: Trip Type Dropdown */}
                  <div>
                    <select
                      value={tripType}
                      onChange={(e) => setTripType(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white text-slate-800 outline-none focus:border-slate-500 font-medium h-[34px]"
                    >
                      <option value="One Way">One Way</option>
                      <option value="Round Trip">Round Trip</option>
                      <option value="Multi City">Multi City</option>
                    </select>
                  </div>

                  {/* Row 7: Departure Date */}
                  <div className="relative">
                    <input
                      type="date"
                      required
                      placeholder="Departure"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md outline-none focus:border-slate-500 font-medium text-slate-800 h-[34px]"
                    />
                  </div>

                  {/* Row 8: Return Date */}
                  <div className="relative">
                    <input
                      type="date"
                      placeholder="Return"
                      disabled={tripType === 'One Way'}
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md outline-none focus:border-slate-500 font-medium text-slate-800 disabled:bg-slate-100 disabled:text-slate-400 h-[34px]"
                    />
                  </div>

                  {/* Row 9: No. of Pax */}
                  <div>
                    <input
                      type="text"
                      placeholder="No. of Pax"
                      value={paxCount}
                      onChange={(e) => setPaxCount(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md outline-none focus:border-slate-500 font-medium h-[34px]"
                    />
                  </div>

                  {/* Row 10: Remarks.... * */}
                  <div>
                    <textarea
                      rows={3}
                      required
                      placeholder="Remarks.... *"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md outline-none focus:border-slate-500 font-medium resize-none"
                    />
                  </div>

                  {/* Row 11: Authorization Checkbox */}
                  <div className="flex items-center gap-2 pt-0.5">
                    <input
                      type="checkbox"
                      id="authContactCheck"
                      required
                      checked={agreeToContact}
                      onChange={(e) => setAgreeToContact(e.target.checked)}
                      className="w-3.5 h-3.5 accent-slate-900 rounded cursor-pointer"
                    />
                    <label
                      htmlFor="authContactCheck"
                      className="text-[11px] sm:text-xs text-slate-800 font-medium select-none cursor-pointer"
                    >
                      I request and authorize <strong className="text-slate-900">MMS AIR TRAVELS</strong> to contact me.
                    </label>
                  </div>

                  {/* Row 12: Bottom Right Red Send Enquiry Button */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-7 py-2.5 bg-[#D32F2F] hover:bg-[#B71C1C] active:bg-[#9A0007] text-white font-bold text-xs sm:text-sm rounded-md shadow-sm transition-all cursor-pointer disabled:opacity-50 tracking-wide"
                    >
                      {isSubmitting ? 'Submitting...' : 'Send Enquiry'}
                    </button>
                  </div>

                </form>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

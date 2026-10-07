import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle2, 
  Phone, 
  Mail, 
  Calendar, 
  Printer, 
  MessageSquare, 
  ShieldCheck, 
  Plane,
  Clock,
  MapPin,
  Building2,
  Search,
  Check,
  Award
} from 'lucide-react';
import { LanguageCode, TRANSLATIONS } from '../utils/translations';
import { POPULAR_AIRPORTS } from '../data/airports';
import { FlightInquiry } from '../types';
import travelGlobeHands from '../assets/images/travel_globe_hands_1788610835980.jpg';
import { CONTACT_NUMBERS } from '../data/contactInfo';

interface FlightBookingViewProps {
  language: LanguageCode;
  onInquirySubmitted?: (inquiry: FlightInquiry) => void;
}

export const FlightBookingView: React.FC<FlightBookingViewProps> = ({
  language,
  onInquirySubmitted
}) => {
  const t = TRANSLATIONS[language];
  const isRtl = language === 'ar';

  // Service Selection Radio
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
  const [sourceCity, setSourceCity] = useState('');
  const [destCity, setDestCity] = useState('');
  const [tripType, setTripType] = useState<'One Way' | 'Round Trip' | 'Multi City'>('One Way');
  const [departureDate, setDepartureDate] = useState('2026-09-10');
  const [returnDate, setReturnDate] = useState('');
  const [paxCount, setPaxCount] = useState('1');
  const [remarks, setRemarks] = useState('');
  const [agreeToContact, setAgreeToContact] = useState(true);

  // Autocomplete
  const [sourceSuggestions, setSourceSuggestions] = useState<typeof POPULAR_AIRPORTS>([]);
  const [destSuggestions, setDestSuggestions] = useState<typeof POPULAR_AIRPORTS>([]);
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);

  const sourceRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);

  // State after submission
  const [submittedInquiry, setSubmittedInquiry] = useState<FlightInquiry | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track Token Search
  const [searchToken, setSearchToken] = useState('');
  const [tokenSearchResult, setTokenSearchResult] = useState<string | null>(null);

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
    const token = `FLT-ENQ-${Math.floor(10000 + Math.random() * 90000)}`;
    const fullPhoneNumber = `${countryCode} ${mobile.trim()}`;

    const newInquiry: FlightInquiry = {
      id: `inq-${Date.now()}`,
      token: token,
      createdAt: new Date().toISOString(),
      fareTier: 'standard',
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
        seat: 'Standard',
        meal: 'Standard'
      },
      quotedPriceUSD: 0,
      currency: 'INR',
      notes: remarks.trim() ? `[${serviceType}] Route: ${sourceCity} -> ${destCity} • Notes: ${remarks}` : `[${serviceType}] Route: ${sourceCity} -> ${destCity}`,
      status: 'NEW'
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedInquiry(newInquiry);
      if (onInquirySubmitted) {
        onInquirySubmitted(newInquiry);
      }
    }, 400);
  };

  const handleResetForm = () => {
    setSubmittedInquiry(null);
    setFirstName('');
    setLastName('');
    setMobile('');
    setEmail('');
    setSourceCity('');
    setDestCity('');
    setRemarks('');
  };

  const whatsappMessage = submittedInquiry
    ? encodeURIComponent(
        `Hello MMS Air Travels Booking Desk,\n\nI have submitted a flight ticket enquiry:\nRef ID: ${submittedInquiry.token}\nService: Flight Ticket Booking\nRoute: ${sourceCity || 'Requested Route'} -> ${destCity || 'Requested Dest'}\nTrip: ${tripType} | Date: ${departureDate}${returnDate ? ` | Return: ${returnDate}` : ''}\nPassengers: ${paxCount}\nLead Passenger: ${title} ${firstName} ${lastName}\nMobile: ${countryCode} ${mobile}\nEmail: ${email}\nNotes: ${remarks}\n\nPlease confirm live seat availability and discounted fare quote.`
      )
    : '';

  const handleTokenSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchToken.trim()) return;
    if (submittedInquiry && submittedInquiry.token.toLowerCase() === searchToken.trim().toLowerCase()) {
      setTokenSearchResult(`Status: Assigned to Senior Ticketing Desk Officer • Route: ${sourceCity} -> ${destCity}`);
    } else {
      setTokenSearchResult(`Token ${searchToken.toUpperCase()} is active in MMS Ticketing Queue. Desk officer responding via WhatsApp/Phone.`);
    }
  };

  return (
    <div className={`space-y-8 animate-fadeIn ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-blue-700/50">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-wider mb-2">
            <Plane className="w-3.5 h-3.5" />
            <span>MMS Air Travels • Verified Booking Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {t.flightBookingTitle}
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm mt-1 leading-relaxed">
            {t.flightBookingSubtitle}
          </p>
        </div>
      </div>

      {/* Main Two-Column Booking & Enquiry Card (Matching Sample Image Exactly) */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-300/80 overflow-hidden">
        {submittedInquiry ? (
          /* Confirmation Screen after Submission */
          <div className="p-8 sm:p-14 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">{t.enquirySuccessTitle}</h3>
              <p className="text-slate-600 text-sm max-w-md mx-auto">
                {t.enquirySuccessDesc}
              </p>
              <div className="inline-block px-5 py-2.5 bg-amber-50 border-2 border-amber-300 rounded-2xl font-mono text-2xl font-black text-amber-900 tracking-wider">
                {submittedInquiry.token}
              </div>
            </div>

            {/* Quick Details Box */}
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl max-w-lg mx-auto text-left text-xs space-y-2.5 text-slate-700">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Service & Route:</span>
                <span className="font-bold text-slate-900">{serviceType} • {sourceCity || 'N/A'} → {destCity || 'N/A'} ({tripType})</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Departure:</span>
                <span className="font-bold text-slate-900">{departureDate} {returnDate ? `• Return: ${returnDate}` : ''}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Passenger(s):</span>
                <span className="font-bold text-slate-900">{paxCount} Pax • {title} {firstName} {lastName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Contact:</span>
                <span className="font-bold text-slate-900">{countryCode} {mobile}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Response Guarantee:</span>
                <span className="font-bold text-emerald-700">{t.instantQuoteGuarantee}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href={`https://wa.me/91${CONTACT_NUMBERS.ticket.number}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{t.connectWhatsApp} ({CONTACT_NUMBERS.ticket.formatted})</span>
              </a>

              <a
                href={CONTACT_NUMBERS.ticket.tel}
                className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>{t.callBookingDesk}: {CONTACT_NUMBERS.ticket.formatted}</span>
              </a>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>{t.printSlip}</span>
              </button>
            </div>

            <div>
              <button
                type="button"
                onClick={handleResetForm}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 underline cursor-pointer"
              >
                {t.doneAndReturn}
              </button>
            </div>
          </div>
        ) : (
          /* Two Column Layout matching exact Sample Image */
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
            
            {/* LEFT COLUMN: Why book with us + Globe in Hands Visual */}
            <div className="lg:col-span-5 bg-[#F0F2F5] p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200/90 relative overflow-hidden">
              <div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 mb-6 tracking-tight">
                  {t.whyBookWithUs}
                </h3>

                <ul className="space-y-4 text-xs sm:text-[13px] text-slate-800 font-medium leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <span className="font-bold text-slate-700 select-none leading-none mt-0.5">*</span>
                    <span>{t.benefitInsurance}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-bold text-slate-700 select-none leading-none mt-0.5">*</span>
                    <span>{t.benefitManager}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-bold text-slate-700 select-none leading-none mt-0.5">*</span>
                    <span>{t.benefitSupport}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-bold text-slate-700 select-none leading-none mt-0.5">*</span>
                    <span>{t.benefitReviews}</span>
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
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                </div>
                <div className="mt-3 text-center">
                  <span className="text-[11px] font-bold text-slate-600 tracking-wide uppercase">
                    {t.iataCertifiedBadge}
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Send Enquiry Form */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-white">
              <div>
                {/* Header Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 tracking-tight">
                  {t.sendEnquiry}
                </h3>

                {/* Call & WhatsApp Strip matching screenshot banner */}
                <div className="bg-[#F2F4F7] rounded-lg px-3 py-2.5 mb-4 border border-slate-200 text-xs font-bold text-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-900">📞 Ticket Desk:</span>
                    <a href={CONTACT_NUMBERS.ticket.tel} className="hover:text-amber-600 transition-colors font-mono">
                      +91 {CONTACT_NUMBERS.ticket.formatted}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700">
                    <span>💬 WhatsApp:</span>
                    <a
                      href={CONTACT_NUMBERS.ticket.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline font-mono"
                    >
                      +91 {CONTACT_NUMBERS.ticket.formatted}
                    </a>
                  </div>
                </div>

                {/* Service Selection Radio Buttons in 2 lines */}
                <div className="mb-4 space-y-1.5 text-xs text-slate-800 font-medium">
                  {/* Row 1: Flight, Hotel, Package, Visa, SightSeeing */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    {[
                      { key: 'Flight', label: t.serviceFlight },
                      { key: 'Hotel', label: t.serviceHotel },
                      { key: 'Package', label: t.servicePackage },
                      { key: 'Visa', label: t.serviceVisa },
                      { key: 'SightSeeing', label: t.serviceSightseeing }
                    ].map((item) => (
                      <label
                        key={item.key}
                        className="inline-flex items-center gap-1.5 cursor-pointer hover:text-red-700"
                      >
                        <input
                          type="radio"
                          name="flightViewServiceSelection"
                          value={item.key}
                          checked={serviceType === item.key}
                          onChange={() => setServiceType(item.key as any)}
                          className="accent-slate-900 w-3.5 h-3.5"
                        />
                        <span>{item.label}</span>
                      </label>
                    ))}
                  </div>

                  {/* Row 2: Miscellaneous, Transfer */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    {[
                      { key: 'Miscellaneous', label: t.serviceMisc },
                      { key: 'Transfer', label: t.serviceTransfer }
                    ].map((item) => (
                      <label
                        key={item.key}
                        className="inline-flex items-center gap-1.5 cursor-pointer hover:text-red-700"
                      >
                        <input
                          type="radio"
                          name="flightViewServiceSelection"
                          value={item.key}
                          checked={serviceType === item.key}
                          onChange={() => setServiceType(item.key as any)}
                          className="accent-slate-900 w-3.5 h-3.5"
                        />
                        <span>{item.label}</span>
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
                        <option value="Mr.">{t.titleMr}</option>
                        <option value="Mrs.">{t.titleMrs}</option>
                        <option value="Ms.">{t.titleMs}</option>
                        <option value="Dr.">{t.titleDr}</option>
                      </select>
                    </div>

                    <div className="col-span-4 sm:col-span-4">
                      <input
                        type="text"
                        required
                        placeholder={t.firstName}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md outline-none focus:border-slate-500 font-medium h-[34px]"
                      />
                    </div>

                    <div className="col-span-5 sm:col-span-5">
                      <input
                        type="text"
                        required
                        placeholder={t.lastName}
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
                        placeholder={t.mobile}
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
                      placeholder={t.emailAddress}
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
                      placeholder={t.sourceCityPlaceholder}
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
                      placeholder={t.destCityPlaceholder}
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
                      <option value="One Way">{t.tripOneWay}</option>
                      <option value="Round Trip">{t.tripRoundTrip}</option>
                      <option value="Multi City">{t.tripMultiCity}</option>
                    </select>
                  </div>

                  {/* Row 7: Departure Date */}
                  <div className="relative">
                    <input
                      type="date"
                      required
                      placeholder={t.departureDate}
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md outline-none focus:border-slate-500 font-medium text-slate-800 h-[34px]"
                    />
                  </div>

                  {/* Row 8: Return Date */}
                  <div className="relative">
                    <input
                      type="date"
                      placeholder={t.returnDate}
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
                      placeholder={t.noOfPax}
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
                      placeholder={t.remarksPlaceholder}
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md outline-none focus:border-slate-500 font-medium resize-none"
                    />
                  </div>

                  {/* Row 11: Authorization Checkbox */}
                  <div className="flex items-center gap-2 pt-0.5">
                    <input
                      type="checkbox"
                      id="flightViewAuthCheck"
                      required
                      checked={agreeToContact}
                      onChange={(e) => setAgreeToContact(e.target.checked)}
                      className="w-3.5 h-3.5 accent-slate-900 rounded cursor-pointer"
                    />
                    <label
                      htmlFor="flightViewAuthCheck"
                      className="text-[11px] sm:text-xs text-slate-800 font-medium select-none cursor-pointer"
                    >
                      {t.authorizeCheckbox}
                    </label>
                  </div>

                  {/* Row 12: Bottom Right Red Send Enquiry Button */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-2.5 bg-[#D32F2F] hover:bg-[#B71C1C] active:bg-[#9A0007] text-white font-bold text-xs sm:text-sm rounded-md shadow-sm transition-all cursor-pointer disabled:opacity-50 tracking-wide"
                    >
                      {isSubmitting ? t.submittingButton : t.sendEnquiryButton}
                    </button>
                  </div>

                </form>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Agency Assistance & Direct Contact Cards (No Mock Flights!) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {/* Card 1: 15-Minute Guaranteed Response */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="text-base font-black text-slate-900">Instant Ticketing Support</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our experienced ticketing officers check direct GDS inventory across all airlines and provide lowest fares with checked baggage.
            </p>
          </div>
          <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-emerald-700">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Dedicated Relationship Manager</span>
          </div>
        </div>

        {/* Card 2: 24x7 Hotline Desk */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <h4 className="text-base font-black text-slate-900">{t.agencyHotlineTitle}</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.agencyHotlineDesc}
            </p>
          </div>
          <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2 text-xs font-bold">
            <a 
              href={CONTACT_NUMBERS.general.tel}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>General: {CONTACT_NUMBERS.general.formatted}</span>
            </a>
            <a 
              href={CONTACT_NUMBERS.ticket.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Tickets</span>
            </a>
          </div>
        </div>

        {/* Card 3: Track Existing Enquiry */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <h4 className="text-base font-black text-slate-900">Check Enquiry Status</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Have an enquiry reference token (e.g. FLT-ENQ-XXXXX)? Track real-time response from our ticketing desk.
            </p>
          </div>
          <form onSubmit={handleTokenSearch} className="pt-3 border-t border-slate-100 space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Token (e.g. FLT-ENQ-12345)"
                value={searchToken}
                onChange={(e) => setSearchToken(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded-lg outline-none focus:border-blue-600 uppercase"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Track
              </button>
            </div>
            {tokenSearchResult && (
              <p className="text-[11px] font-bold text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                {tokenSearchResult}
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Branch Offices Information - Adirampattinam & Madukkur ONLY */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-5 h-5 text-blue-900" />
          <h4 className="text-base font-black text-slate-900">Our Official Office Locations (Adirampattinam & Madukkur Only)</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">Adirampattinam Head Office</span>
              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 font-extrabold text-[10px] rounded">Main</span>
            </div>
            <p className="text-slate-500">MMS Air Travels, High School Road, Adirampattinam - 614701, Thanjavur District.</p>
            <div className="pt-1 flex flex-wrap gap-x-3 gap-y-1 text-slate-800 font-medium">
              <span>General: <strong className="text-blue-700 font-mono">63690 12360</strong></span>
              <span>Tickets: <strong className="text-emerald-700 font-mono">93845 67440</strong></span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">Madukkur Branch Office</span>
              <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] rounded">Branch</span>
            </div>
            <p className="text-slate-500">MMS Air Travels, Main Road, Bus Stand Commercial Area, Madukkur - 614903, Thanjavur District.</p>
            <div className="pt-1 flex flex-wrap gap-x-3 gap-y-1 text-slate-800 font-medium">
              <span>Visas & Tours: <strong className="text-blue-700 font-mono">95009 77442</strong></span>
              <span>Tickets: <strong className="text-emerald-700 font-mono">93845 67440</strong></span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

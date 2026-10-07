import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  CheckCircle2, 
  Phone, 
  Check, 
  Printer, 
  MessageSquare, 
  Plane,
  FileText,
  Copy,
  Globe,
  Award,
  Package,
  Building,
  Luggage,
  Calendar,
  Users,
  MapPin,
  Sparkles
} from 'lucide-react';
import { EnquiryData, FlightInquiry } from '../types';
import { POPULAR_AIRPORTS } from '../data/airports';
import { generateInquiryReference, generate8DigitCaseId, copyTextToClipboard } from '../utils/referenceNumber';
import travelGlobeHands from '../assets/images/travel_globe_hands_1788610835980.jpg';
import { CONTACT_NUMBERS } from '../data/contactInfo';

export type ServiceCategory = 
  | 'Flight' 
  | 'Visa' 
  | 'Passport' 
  | 'Package' 
  | 'Hotel' 
  | 'Cargo' 
  | 'Miscellaneous';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: 'Flight' | 'Hotel' | 'Package' | 'Visa' | 'Passport' | 'SightSeeing' | 'Miscellaneous' | 'Transfer' | 'Cargo' | string;
  destinationPreset?: string;
  defaultDestination?: string;
  sourceCityPreset?: string;
  onSubmitEnquiry?: (data: EnquiryData) => void;
  onSubmitInquiryRecord?: (inquiry: FlightInquiry) => void;
}

// Normalized service helper
function normalizeService(raw?: string): ServiceCategory {
  if (!raw) return 'Flight';
  const l = raw.toLowerCase();
  if (l.includes('flight') || l.includes('ticket') || l.includes('groupfare')) return 'Flight';
  if (l.includes('visa')) return 'Visa';
  if (l.includes('passport')) return 'Passport';
  if (l.includes('package') || l.includes('tour') || l.includes('umrah') || l.includes('hajj')) return 'Package';
  if (l.includes('hotel') || l.includes('hospitality')) return 'Hotel';
  if (l.includes('cargo') || l.includes('freight')) return 'Cargo';
  return 'Miscellaneous';
}

const POPULAR_VISA_COUNTRIES = [
  'United Arab Emirates (UAE / Dubai)',
  'Saudi Arabia (Umrah / Tourist / Business)',
  'Qatar',
  'Oman',
  'Kuwait',
  'Singapore',
  'Malaysia',
  'Thailand',
  'United Kingdom (UK)',
  'Schengen / European Union',
  'United States (USA)',
  'Canada',
  'Australia',
  'Indonesia / Bali',
  'Egypt',
  'Other Country'
];

const POPULAR_TOUR_PACKAGES = [
  'Dubai 5 Days Luxury Holiday',
  'Umrah Classic Group Package (15 Days)',
  'Singapore & Malaysia (6 Days / 5 Nights)',
  'Thailand Explorer (Bangkok & Pattaya)',
  'Kashmir Valley Paradise (5 Days)',
  'Kerala God\'s Own Country (6 Days)',
  'Europe Highlights (10 Days)',
  'Bespoke / Custom Group Tour'
];

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  defaultService = 'Flight',
  destinationPreset = '',
  defaultDestination = '',
  sourceCityPreset = '',
  onSubmitEnquiry,
  onSubmitInquiryRecord
}) => {
  // Current active service tab
  const [serviceType, setServiceType] = useState<ServiceCategory>(() => normalizeService(defaultService));

  // --- COMMON BASIC DETAILS ---
  const [title, setTitle] = useState('Mr.');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [remarks, setRemarks] = useState('');
  const [agreeToContact, setAgreeToContact] = useState(true);

  // --- 1. FLIGHT FIELDS ---
  const [tripType, setTripType] = useState<'One Way' | 'Round Trip' | 'Multi City'>('One Way');
  const [sourceCity, setSourceCity] = useState(sourceCityPreset || 'Tiruchirappalli (TRZ)');
  const [destCity, setDestCity] = useState(destinationPreset || defaultDestination || 'Dubai (DXB)');
  const [flightDepDate, setFlightDepDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [flightRetDate, setFlightRetDate] = useState('');
  const [flightPax, setFlightPax] = useState('1');
  const [cabinClass, setCabinClass] = useState('Economy');

  // Flight Autocomplete
  const [sourceSuggestions, setSourceSuggestions] = useState<typeof POPULAR_AIRPORTS>([]);
  const [destSuggestions, setDestSuggestions] = useState<typeof POPULAR_AIRPORTS>([]);
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const sourceRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);

  // --- 2. VISA FIELDS ---
  const [visaCountry, setVisaCountry] = useState('United Arab Emirates (UAE / Dubai)');
  const [customVisaCountry, setCustomVisaCountry] = useState('');
  const [visaType, setVisaType] = useState('30-Days Tourist / Visit Visa');
  const [visaTravelDate, setVisaTravelDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [visaApplicants, setVisaApplicants] = useState('1');
  const [hasValidPassport, setHasValidPassport] = useState(true);

  // --- 3. PASSPORT FIELDS ---
  const [passportType, setPassportType] = useState('Fresh Passport (First-time Applicant)');
  const [passportPages, setPassportPages] = useState<'36 Pages (Standard)' | '60 Pages (Jumbo)'>('36 Pages (Standard)');
  const [preferredBranch, setPreferredBranch] = useState('Adirampattinam Branch (HQ)');
  const [applicantDob, setApplicantDob] = useState('');
  const [existingPassportNo, setExistingPassportNo] = useState('');

  // --- 4. PACKAGE / TOUR FIELDS ---
  const [packageName, setPackageName] = useState(destinationPreset || defaultDestination || 'Dubai 5 Days Luxury Holiday');
  const [departureCity, setDepartureCity] = useState('Trichy (TRZ)');
  const [packageDate, setPackageDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [packageDuration, setPackageDuration] = useState('4N/5D');
  const [packageAdults, setPackageAdults] = useState('2');
  const [packageChildren, setPackageChildren] = useState('0');
  const [hotelCategory, setHotelCategory] = useState('4-Star Premium Comfort');

  // --- 5. HOTEL FIELDS ---
  const [hotelCity, setHotelCity] = useState(destinationPreset || defaultDestination || 'Dubai, UAE');
  const [hotelCheckIn, setHotelCheckIn] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 10);
    return d.toISOString().split('T')[0];
  });
  const [hotelCheckOut, setHotelCheckOut] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [roomCount, setRoomCount] = useState('1');
  const [hotelGuests, setHotelGuests] = useState('2');
  const [hotelRating, setHotelRating] = useState('4-Star Premium');

  // --- 6. CARGO FIELDS ---
  const [cargoOrigin, setCargoOrigin] = useState('Adirampattinam / Trichy, India');
  const [cargoDestination, setCargoDestination] = useState(destinationPreset || 'Dubai (DXB), UAE');
  const [cargoType, setCargoType] = useState('Personal Excess Luggage');
  const [cargoWeight, setCargoWeight] = useState('25 kg');
  const [cargoMode, setCargoMode] = useState('Express Air Cargo (Fastest)');

  // --- 7. OTHER SERVICES (MISCELLANEOUS) ---
  const [miscService, setMiscService] = useState('Certificate Attestation (HRD/MEA/Apostille)');
  const [miscCountry, setMiscCountry] = useState(destinationPreset || 'United Arab Emirates');
  const [miscDate, setMiscDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });

  // State after submission
  const [submitted, setSubmitted] = useState(false);
  const [enquiryToken, setEnquiryToken] = useState('');
  const [enquiryCaseId, setEnquiryCaseId] = useState('');
  const [copiedRef, setCopiedRef] = useState(false);
  const [copiedCaseId, setCopiedCaseId] = useState(false);

  // Synchronize incoming props
  useEffect(() => {
    if (defaultService) {
      const norm = normalizeService(defaultService);
      setServiceType(norm);
    }
    if (destinationPreset || defaultDestination) {
      const dest = destinationPreset || defaultDestination || '';
      setDestCity(dest);
      setPackageName(dest);
      setHotelCity(dest);
      setCargoDestination(dest);
    }
    if (sourceCityPreset) {
      setSourceCity(sourceCityPreset);
    }
  }, [destinationPreset, defaultDestination, sourceCityPreset, defaultService]);

  // Handle Autocomplete Click Outside
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

  if (!isOpen) return null;

  const handleCopyRef = async () => {
    if (!enquiryToken) return;
    const ok = await copyTextToClipboard(enquiryToken);
    if (ok) {
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2500);
    }
  };

  const handleCopyCaseId = async () => {
    if (!enquiryCaseId) return;
    const ok = await copyTextToClipboard(enquiryCaseId);
    if (ok) {
      setCopiedCaseId(true);
      setTimeout(() => setCopiedCaseId(false), 2500);
    }
  };

  const handleSourceChange = (val: string) => {
    setSourceCity(val);
    if (val.trim().length > 0) {
      const filtered = POPULAR_AIRPORTS.filter(
        a =>
          a.city.toLowerCase().includes(val.toLowerCase()) ||
          a.code.toLowerCase().includes(val.toLowerCase())
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
          a.code.toLowerCase().includes(val.toLowerCase())
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
      alert('Please authorize MMS AIR TRAVELS to contact you.');
      return;
    }

    const token = generateInquiryReference(serviceType);
    const tokenParts = token.split('-');
    const caseId = (tokenParts.length >= 3 && tokenParts[2].length === 8) ? tokenParts[2] : generate8DigitCaseId();
    setEnquiryToken(token);
    setEnquiryCaseId(caseId);
    setSubmitted(true);

    const fullPhoneNumber = `${countryCode} ${mobile.trim()}`;
    
    // Compute service-specific summary & notes
    let routeSummary = '';
    let serviceSpecificNotes = '';
    let paxTotal = 1;
    let depDate = '';
    let retDate: string | undefined = undefined;

    if (serviceType === 'Flight') {
      routeSummary = `${sourceCity} ➔ ${destCity}`;
      depDate = flightDepDate;
      retDate = tripType === 'Round Trip' ? flightRetDate : undefined;
      paxTotal = Number(flightPax) || 1;
      serviceSpecificNotes = `[FLIGHT] Trip: ${tripType} | Route: ${routeSummary} | Dates: ${flightDepDate} ${retDate ? `to ${retDate}` : ''} | Pax: ${flightPax} | Class: ${cabinClass}`;
    } else if (serviceType === 'Visa') {
      const effectiveCountry = visaCountry === 'Other Country' ? customVisaCountry || 'Custom Destination' : visaCountry;
      routeSummary = `Visa: ${effectiveCountry}`;
      depDate = visaTravelDate;
      paxTotal = Number(visaApplicants) || 1;
      serviceSpecificNotes = `[VISA] Country: ${effectiveCountry} | Visa Type: ${visaType} | Travel Date: ${visaTravelDate} | Applicants: ${visaApplicants} | Valid Passport: ${hasValidPassport ? 'Yes (6+ mo)' : 'Needs Renewal'}`;
    } else if (serviceType === 'Passport') {
      routeSummary = `Passport: ${passportType}`;
      paxTotal = 1;
      serviceSpecificNotes = `[PASSPORT] Type: ${passportType} | Booklet: ${passportPages} | Branch: ${preferredBranch} | DOB: ${applicantDob || 'N/A'} | Existing Passport: ${existingPassportNo || 'None'}`;
    } else if (serviceType === 'Package') {
      routeSummary = `Tour: ${packageName} (Ex-${departureCity})`;
      depDate = packageDate;
      paxTotal = (Number(packageAdults) || 1) + (Number(packageChildren) || 0);
      serviceSpecificNotes = `[PACKAGE] Destination: ${packageName} | Ex-City: ${departureCity} | Date: ${packageDate} | Duration: ${packageDuration} | Adults: ${packageAdults}, Children: ${packageChildren} | Hotel: ${hotelCategory}`;
    } else if (serviceType === 'Hotel') {
      routeSummary = `Hotel: ${hotelCity}`;
      depDate = hotelCheckIn;
      retDate = hotelCheckOut;
      paxTotal = Number(hotelGuests) || 2;
      serviceSpecificNotes = `[HOTEL] City: ${hotelCity} | Check-in: ${hotelCheckIn} | Check-out: ${hotelCheckOut} | Rooms: ${roomCount} | Guests: ${hotelGuests} | Rating: ${hotelRating}`;
    } else if (serviceType === 'Cargo') {
      routeSummary = `Cargo: ${cargoOrigin} ➔ ${cargoDestination}`;
      paxTotal = 1;
      serviceSpecificNotes = `[CARGO] Route: ${cargoOrigin} to ${cargoDestination} | Goods: ${cargoType} | Weight: ${cargoWeight} | Mode: ${cargoMode}`;
    } else {
      routeSummary = `${miscService}: ${miscCountry}`;
      depDate = miscDate;
      paxTotal = 1;
      serviceSpecificNotes = `[SERVICES] Service: ${miscService} | Target: ${miscCountry} | Date: ${miscDate}`;
    }

    const fullNotes = `${serviceSpecificNotes} | Customer Remarks: ${remarks.trim() || 'Customer requested prompt quote.'}`;

    const enquiryRecord: FlightInquiry = {
      id: `inq-${Date.now()}`,
      token: token,
      referenceNumber: token,
      caseId: caseId,
      assignedStaffName: preferredBranch.includes('Madukkur') ? 'Madukkur Branch Desk' : 'Adirampattinam HQ Desk',
      assignedBranch: preferredBranch.includes('Madukkur') ? 'Madukkur Branch' : 'Adirampattinam HQ',
      serviceType: serviceType,
      serviceName: `MMS ${serviceType} Service Desk`,
      routeSummary: routeSummary,
      createdAt: new Date().toISOString(),
      tripType: tripType === 'Round Trip' ? 'round-trip' : 'one-way',
      departureDate: depDate,
      returnDate: retDate,
      passengers: { adults: paxTotal, children: 0, infants: 0 },
      leadPassenger: {
        title,
        fullName: `${firstName} ${lastName}`.trim(),
        phone: fullPhoneNumber,
        whatsapp: fullPhoneNumber,
        email: email.trim(),
        cityOfResidence: sourceCity || 'India'
      },
      notes: fullNotes,
      status: 'NEW',
      adminNotes: `Online enquiry via ${serviceType} modal. ${routeSummary}. Reference: ${token}`
    };

    if (onSubmitInquiryRecord) {
      onSubmitInquiryRecord(enquiryRecord);
    } else {
      try {
        const existing = localStorage.getItem('mms_flight_inquiries');
        const list: FlightInquiry[] = existing ? JSON.parse(existing) : [];
        list.unshift(enquiryRecord);
        localStorage.setItem('mms_flight_inquiries', JSON.stringify(list));
      } catch (err) {
        console.error('Failed to persist enquiry', err);
      }
    }

    if (onSubmitEnquiry) {
      onSubmitEnquiry({
        serviceType,
        title,
        firstName,
        lastName,
        countryCode,
        mobile,
        email,
        sourceCity,
        destCity,
        tripType,
        departureDate: depDate,
        returnDate: retDate,
        paxCount: paxTotal,
        remarks: fullNotes
      });
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  // Determine which desk receives the inquiry WhatsApp & Call
  const activeDesk = serviceType === 'Flight' 
    ? CONTACT_NUMBERS.ticket 
    : serviceType === 'Visa' 
      ? CONTACT_NUMBERS.visa 
      : CONTACT_NUMBERS.services;

  // Build tailor-made WhatsApp message with ONLY relevant fields
  const buildWhatsAppMessage = () => {
    let details = '';
    if (serviceType === 'Flight') {
      details = `Service: Flight Ticket\nRoute: ${sourceCity} -> ${destCity}\nTrip: ${tripType}\nDate: ${flightDepDate}${flightRetDate ? ` to ${flightRetDate}` : ''}\nPassengers: ${flightPax} (${cabinClass})`;
    } else if (serviceType === 'Visa') {
      const c = visaCountry === 'Other Country' ? customVisaCountry || 'International' : visaCountry;
      details = `Service: Visa Assistance\nCountry: ${c}\nVisa Type: ${visaType}\nTravel Date: ${visaTravelDate}\nApplicants: ${visaApplicants}\nValid Passport: ${hasValidPassport ? 'Yes' : 'Needs Renewal'}`;
    } else if (serviceType === 'Passport') {
      details = `Service: Passport Facilitation\nApplication: ${passportType}\nBooklet: ${passportPages}\nPreferred Branch: ${preferredBranch}\nDOB: ${applicantDob || 'N/A'}${existingPassportNo ? `\nOld Passport: ${existingPassportNo}` : ''}`;
    } else if (serviceType === 'Package') {
      details = `Service: Holiday / Umrah Tour\nPackage: ${packageName}\nEx-City: ${departureCity}\nDate: ${packageDate}\nDuration: ${packageDuration}\nTravelers: ${packageAdults} Adults, ${packageChildren} Children\nHotel: ${hotelCategory}`;
    } else if (serviceType === 'Hotel') {
      details = `Service: Hotel Booking\nCity/Hotel: ${hotelCity}\nCheck-in: ${hotelCheckIn}\nCheck-out: ${hotelCheckOut}\nRooms: ${roomCount} | Guests: ${hotelGuests}\nRating: ${hotelRating}`;
    } else if (serviceType === 'Cargo') {
      details = `Service: Cargo & Freight\nOrigin: ${cargoOrigin}\nDestination: ${cargoDestination}\nGoods: ${cargoType}\nWeight: ${cargoWeight}\nMode: ${cargoMode}`;
    } else {
      details = `Service: ${miscService}\nTarget Country/Route: ${miscCountry}\nDate Required: ${miscDate}`;
    }

    const caseIdDisplay = enquiryCaseId || (enquiryToken.split('-')[2] || '84920173');
    const text = `Hello MMS Air Travels ${activeDesk.label} Desk,\n\nI have submitted an official enquiry:\n*Ref No:* ${enquiryToken}\n*8-Digit Case ID:* #${caseIdDisplay}\n\n*Details:*\n${details}\n\n*Applicant:* ${title} ${firstName} ${lastName}\n*Contact:* ${countryCode} ${mobile}\n*Email:* ${email}\n${remarks ? `*Remarks:* ${remarks}\n` : ''}\nPlease provide live availability, discounted quote and next steps.`;
    return encodeURIComponent(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-300 my-auto animate-fadeIn max-h-[94vh] flex flex-col">
        
        {/* Close Button at top right */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-30 p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          /* ========================================================
             SUBMISSION CONFIRMATION SLIP (Tailored to Service)
             ======================================================== */
          <div className="p-6 sm:p-10 text-center space-y-5 overflow-y-auto">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900">Enquiry Submitted Successfully!</h3>
              <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto">
                Thank you, <strong className="text-slate-900">{title} {firstName} {lastName}</strong>. Your official enquiry reference number and 8-digit Case ID are:
              </p>
              
              {/* Prominent Reference & 8-Digit Case ID Box */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-4 max-w-md mx-auto shadow-xs space-y-3">
                
                {/* 8-Digit Case ID */}
                <div className="bg-white/80 border border-amber-300 rounded-xl p-2.5 flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-[10px] uppercase font-black text-amber-800 tracking-wider block">
                      8-Digit Case ID Number
                    </span>
                    <span className="font-mono text-xl sm:text-2xl font-black text-slate-900 tracking-widest">
                      #{enquiryCaseId || (enquiryToken.split('-')[2] || '84920173')}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyCaseId}
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1 shadow-xs cursor-pointer transition-colors"
                    title="Copy 8-Digit Case ID"
                  >
                    {copiedCaseId ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5 text-white" />}
                    <span>{copiedCaseId ? 'Copied' : 'Copy Case ID'}</span>
                  </button>
                </div>

                {/* Full Reference Code */}
                <div>
                  <span className="text-[10px] uppercase font-black text-amber-800 tracking-wider block mb-0.5">
                    Official Reference Code ({serviceType.toUpperCase()})
                  </span>
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-mono text-lg sm:text-xl font-bold text-slate-800 tracking-wider">
                      {enquiryToken}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyRef}
                      className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 inline-flex items-center gap-1 shadow-xs cursor-pointer transition-colors"
                      title="Copy Full Reference Code"
                    >
                      {copiedRef ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-500" />}
                      <span>{copiedRef ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-amber-900/80 font-medium">
                  Please quote this 8-digit Case ID or Reference Number when speaking with our staff at {preferredBranch}.
                </p>
              </div>
            </div>

            {/* DYNAMIC CONFIRMATION DETAILS BASED ON SERVICE */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl max-w-lg mx-auto text-left text-xs space-y-2 text-slate-700">
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Service Department:</span>
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  {serviceType === 'Flight' && <Plane className="w-3.5 h-3.5 text-blue-600" />}
                  {serviceType === 'Visa' && <Globe className="w-3.5 h-3.5 text-emerald-600" />}
                  {serviceType === 'Passport' && <Award className="w-3.5 h-3.5 text-purple-600" />}
                  {serviceType === 'Package' && <Package className="w-3.5 h-3.5 text-amber-600" />}
                  {serviceType === 'Hotel' && <Building className="w-3.5 h-3.5 text-indigo-600" />}
                  {serviceType === 'Cargo' && <Luggage className="w-3.5 h-3.5 text-orange-600" />}
                  {serviceType} Concierge Desk
                </span>
              </div>

              {/* Service-Specific Details in confirmation */}
              {serviceType === 'Flight' && (
                <>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Flight Route:</span>
                    <span className="font-bold text-slate-900">{sourceCity} ➔ {destCity} ({tripType})</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Dates & Passengers:</span>
                    <span className="font-bold text-slate-900">{flightDepDate} {flightRetDate ? `| Return: ${flightRetDate}` : ''} • {flightPax} Pax ({cabinClass})</span>
                  </div>
                </>
              )}

              {serviceType === 'Visa' && (
                <>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Destination Country:</span>
                    <span className="font-bold text-slate-900">{visaCountry === 'Other Country' ? customVisaCountry : visaCountry}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Visa Category:</span>
                    <span className="font-bold text-slate-900">{visaType}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Travel Date & Applicants:</span>
                    <span className="font-bold text-slate-900">{visaTravelDate} • {visaApplicants} Applicant(s)</span>
                  </div>
                </>
              )}

              {serviceType === 'Passport' && (
                <>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Application Type:</span>
                    <span className="font-bold text-purple-700">{passportType}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Booklet & Preferred Branch:</span>
                    <span className="font-bold text-slate-900">{passportPages} • {preferredBranch}</span>
                  </div>
                  {existingPassportNo && (
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-500">Previous Passport No:</span>
                      <span className="font-mono font-bold text-slate-900">{existingPassportNo}</span>
                    </div>
                  )}
                </>
              )}

              {serviceType === 'Package' && (
                <>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Package / Tour:</span>
                    <span className="font-bold text-slate-900">{packageName}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Departure & Duration:</span>
                    <span className="font-bold text-slate-900">Ex-{departureCity} • {packageDuration}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Travel Date & Group:</span>
                    <span className="font-bold text-slate-900">{packageDate} • {packageAdults} Adults, {packageChildren} Kids</span>
                  </div>
                </>
              )}

              {serviceType === 'Hotel' && (
                <>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">City / Hotel:</span>
                    <span className="font-bold text-slate-900">{hotelCity} ({hotelRating})</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Dates & Occupancy:</span>
                    <span className="font-bold text-slate-900">{hotelCheckIn} to {hotelCheckOut} • {roomCount} Room(s), {hotelGuests} Guests</span>
                  </div>
                </>
              )}

              {serviceType === 'Cargo' && (
                <>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Route & Cargo Type:</span>
                    <span className="font-bold text-slate-900">{cargoOrigin} ➔ {cargoDestination} ({cargoType})</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Weight & Mode:</span>
                    <span className="font-bold text-slate-900">{cargoWeight} • {cargoMode}</span>
                  </div>
                </>
              )}

              {serviceType === 'Miscellaneous' && (
                <>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Service Requested:</span>
                    <span className="font-bold text-slate-900">{miscService}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Target Country / Route:</span>
                    <span className="font-bold text-slate-900">{miscCountry} • Required by: {miscDate}</span>
                  </div>
                </>
              )}

              <div className="flex justify-between pt-0.5">
                <span className="text-slate-500">Desk Direct Hotline:</span>
                <span className="font-bold text-emerald-700">{activeDesk.formatted}</span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <a
                href={`https://wa.me/91${activeDesk.number}?text=${buildWhatsAppMessage()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Connect on WhatsApp with Ref No</span>
              </a>

              <a
                href={activeDesk.tel}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Call {activeDesk.label}: {activeDesk.formatted}</span>
              </a>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Print Slip</span>
              </button>
            </div>

            <div>
              <button
                onClick={handleReset}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 underline cursor-pointer"
              >
                Done & Return
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================
             TWO COLUMN INQUIRY MODAL WITH ADAPTIVE SERVICE FORM
             ======================================================== */
          <div className="grid grid-cols-1 md:grid-cols-12 overflow-y-auto">
            
            {/* LEFT COLUMN: Why book with us + Globe Visual */}
            <div className="md:col-span-5 bg-[#F0F2F5] p-5 sm:p-7 flex flex-col justify-between border-r border-slate-200 relative">
              <div>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-900 mb-4 tracking-tight">
                  Why book with us
                </h3>

                <ul className="space-y-3 text-xs sm:text-[13px] text-slate-800 font-medium leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <span className="font-bold text-red-600 select-none leading-none mt-0.5">*</span>
                    <span>Complimentary Travel Insurance on flight bookings</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-bold text-red-600 select-none leading-none mt-0.5">*</span>
                    <span>Personalized Relationship Manager assigned to every enquiry</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-bold text-red-600 select-none leading-none mt-0.5">*</span>
                    <span>24 X 7 On Ground & Emergency Transit Support</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-bold text-red-600 select-none leading-none mt-0.5">*</span>
                    <span>Rated 4.7 across Social Media Platforms (2,500+ Local Reviews)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-bold text-red-600 select-none leading-none mt-0.5">*</span>
                    <span>Dual Walk-in Branches: Adirampattinam & Madukkur</span>
                  </li>
                </ul>
              </div>

              {/* Cupped Hands Gently Holding Earth Globe Image */}
              <div className="mt-6 pt-2 flex flex-col items-center justify-end">
                <div className="w-full max-w-[240px] overflow-hidden rounded-2xl shadow-sm border border-slate-300 bg-white p-1">
                  <img
                    src={travelGlobeHands}
                    alt="MMS Travel Globe in Hands"
                    className="w-full h-40 sm:h-44 object-cover object-center rounded-xl"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                </div>
                <div className="mt-2 text-center">
                  <span className="text-[10px] font-bold text-slate-600 tracking-wider uppercase block">
                    Govt Registered • 100% Verified Desk
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Send Enquiry Form */}
            <div className="md:col-span-7 p-5 sm:p-7 flex flex-col justify-between bg-white">
              <div>
                
                {/* Header Title with Dynamic Badge */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Send Enquiry
                  </h3>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {serviceType === 'Flight' && '✈️ Flight Tickets'}
                    {serviceType === 'Visa' && '🛂 Visa Facilitation'}
                    {serviceType === 'Passport' && '📘 Passport Seva'}
                    {serviceType === 'Package' && '🎒 Tour Packages'}
                    {serviceType === 'Hotel' && '🏨 Hotel Bookings'}
                    {serviceType === 'Cargo' && '📦 Cargo Logistics'}
                    {serviceType === 'Miscellaneous' && '📑 Attestation & Services'}
                  </span>
                </div>

                {/* Call & WhatsApp Banner for specific desk */}
                <div className="bg-[#F2F4F7] rounded-lg px-3 py-2 mb-3 border border-slate-200 text-xs font-bold text-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-900">📞 Call:</span>
                    <a href={activeDesk.tel} className="hover:text-red-700 transition-colors font-mono">
                      {activeDesk.label}: {activeDesk.formatted}
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-700 font-mono">
                    <span>💬 WhatsApp:</span>
                    <a
                      href={activeDesk.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {activeDesk.formatted}
                    </a>
                  </div>
                </div>

                {/* SERVICE SELECTION TABS */}
                <div className="mb-3">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
                    Select Service Category:
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { id: 'Flight', label: '✈️ Flight' },
                      { id: 'Visa', label: '🛂 Visa' },
                      { id: 'Passport', label: '📘 Passport' },
                      { id: 'Package', label: '🎒 Package' },
                      { id: 'Hotel', label: '🏨 Hotel' },
                      { id: 'Cargo', label: '📦 Cargo' },
                      { id: 'Miscellaneous', label: '📑 Other' }
                    ].map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setServiceType(st.id as ServiceCategory)}
                        className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                          serviceType === st.id
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* FORM INPUTS */}
                <form onSubmit={handleSubmit} className="space-y-2.5">
                  
                  {/* BASIC CONTACT DETAILS (COMMON TO ALL SERVICES) */}
                  <div className="space-y-2">
                    {/* Row 1: Title, First Name, Last Name */}
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-3">
                        <select
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-md bg-white text-slate-800 outline-none focus:border-slate-500 font-medium h-[34px]"
                        >
                          <option value="Mr.">Mr.</option>
                          <option value="Mrs.">Mrs.</option>
                          <option value="Ms.">Ms.</option>
                          <option value="Dr.">Dr.</option>
                        </select>
                      </div>

                      <div className="col-span-4">
                        <input
                          type="text"
                          required
                          placeholder="First Name *"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md outline-none focus:border-slate-500 font-medium h-[34px]"
                        />
                      </div>

                      <div className="col-span-5">
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

                    {/* Row 2: Country Code, Mobile, Email */}
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-4 flex">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="w-full px-1.5 py-1.5 text-xs border border-slate-300 rounded-md bg-slate-50 text-slate-800 outline-none focus:border-slate-500 font-medium h-[34px]"
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

                      <div className="col-span-4">
                        <input
                          type="tel"
                          required
                          placeholder="Mobile *"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md outline-none focus:border-slate-500 font-medium h-[34px]"
                        />
                      </div>

                      <div className="col-span-4">
                        <input
                          type="email"
                          required
                          placeholder="Email *"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md outline-none focus:border-slate-500 font-medium h-[34px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ========================================================
                      DYNAMIC SECTION: SERVICE-SPECIFIC DETAILS ONLY
                      ======================================================== */}
                  <div className="pt-2 border-t border-slate-200">
                    
                    {/* --- 1. FLIGHT DETAILS --- */}
                    {serviceType === 'Flight' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wide flex items-center gap-1">
                            <Plane className="w-3.5 h-3.5 text-blue-600" /> Flight Route & Details
                          </span>
                          <div className="flex items-center gap-2">
                            {(['One Way', 'Round Trip', 'Multi City'] as const).map((t) => (
                              <label key={t} className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 cursor-pointer">
                                <input
                                  type="radio"
                                  name="flightTripType"
                                  value={t}
                                  checked={tripType === t}
                                  onChange={() => setTripType(t)}
                                  className="accent-slate-900 w-3 h-3"
                                />
                                <span>{t}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Origin and Destination with autocomplete */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div ref={sourceRef} className="relative">
                            <input
                              type="text"
                              required
                              placeholder="Departure city or airport *"
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
                                    <span className="font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                      {a.code}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div ref={destRef} className="relative">
                            <input
                              type="text"
                              required
                              placeholder="Destination city or airport *"
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
                                    <span className="font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                      {a.code}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Dates, Pax, Class */}
                        <div className="grid grid-cols-12 gap-2">
                          <div className="col-span-6 sm:col-span-3">
                            <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Departure *</label>
                            <input
                              type="date"
                              required
                              value={flightDepDate}
                              onChange={(e) => setFlightDepDate(e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-slate-300 rounded-md outline-none focus:border-slate-500 font-medium text-slate-800 h-[32px]"
                            />
                          </div>

                          <div className="col-span-6 sm:col-span-3">
                            <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Return</label>
                            <input
                              type="date"
                              disabled={tripType === 'One Way'}
                              value={flightRetDate}
                              onChange={(e) => setFlightRetDate(e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-slate-300 rounded-md outline-none focus:border-slate-500 font-medium text-slate-800 disabled:bg-slate-100 disabled:text-slate-400 h-[32px]"
                            />
                          </div>

                          <div className="col-span-6 sm:col-span-3">
                            <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Passengers</label>
                            <select
                              value={flightPax}
                              onChange={(e) => setFlightPax(e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-slate-300 rounded-md bg-white text-slate-800 outline-none focus:border-slate-500 font-medium h-[32px]"
                            >
                              <option value="1">1 Passenger</option>
                              <option value="2">2 Passengers</option>
                              <option value="3">3 Passengers</option>
                              <option value="4">4 Passengers</option>
                              <option value="5">5 Passengers</option>
                              <option value="6">6+ Group Booking</option>
                            </select>
                          </div>

                          <div className="col-span-6 sm:col-span-3">
                            <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Cabin Class</label>
                            <select
                              value={cabinClass}
                              onChange={(e) => setCabinClass(e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-slate-300 rounded-md bg-white text-slate-800 outline-none focus:border-slate-500 font-medium h-[32px]"
                            >
                              <option value="Economy">Economy</option>
                              <option value="Premium Economy">Premium Economy</option>
                              <option value="Business">Business Class</option>
                              <option value="First">First Class</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* --- 2. VISA DETAILS --- */}
                    {serviceType === 'Visa' && (
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wide flex items-center gap-1">
                          <Globe className="w-3.5 h-3.5 text-emerald-600" /> Visa Country & Travel Schedule
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Destination Country *</label>
                            <select
                              value={visaCountry}
                              onChange={(e) => setVisaCountry(e.target.value)}
                              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white text-slate-800 outline-none focus:border-slate-500 font-medium h-[34px]"
                            >
                              {POPULAR_VISA_COUNTRIES.map((c) => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                          </div>

                          {visaCountry === 'Other Country' ? (
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Specify Country *</label>
                              <input
                                type="text"
                                required
                                placeholder="Enter Country Name"
                                value={customVisaCountry}
                                onChange={(e) => setCustomVisaCountry(e.target.value)}
                                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md outline-none focus:border-slate-500 font-medium h-[34px]"
                              />
                            </div>
                          ) : (
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Visa Category *</label>
                              <select
                                value={visaType}
                                onChange={(e) => setVisaType(e.target.value)}
                                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white text-slate-800 outline-none focus:border-slate-500 font-medium h-[34px]"
                              >
                                <option value="30-Days Tourist / Visit Visa">30-Days Tourist / Visit Visa</option>
                                <option value="60-Days Tourist / Visit Visa">60-Days Tourist / Visit Visa</option>
                                <option value="90-Days Visit Visa">90-Days Visit Visa</option>
                                <option value="Business / Commercial Visa">Business / Commercial Visa</option>
                                <option value="Employment / Work Visa Assistance">Employment / Work Visa Assistance</option>
                                <option value="Umrah & Religious Visa">Umrah & Religious Visa</option>
                                <option value="Family Visit Visa">Family Visit Visa</option>
                                <option value="Transit Visa">Transit Visa</option>
                              </select>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-12 gap-2">
                          <div className="col-span-6">
                            <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Planned Travel / Visa Required Date *</label>
                            <input
                              type="date"
                              required
                              value={visaTravelDate}
                              onChange={(e) => setVisaTravelDate(e.target.value)}
                              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md outline-none focus:border-slate-500 font-medium text-slate-800 h-[34px]"
                            />
                          </div>

                          <div className="col-span-6">
                            <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Number of Applicants *</label>
                            <select
                              value={visaApplicants}
                              onChange={(e) => setVisaApplicants(e.target.value)}
                              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white text-slate-800 outline-none focus:border-slate-500 font-medium h-[34px]"
                            >
                              <option value="1">1 Applicant</option>
                              <option value="2">2 Applicants</option>
                              <option value="3">3 Applicants</option>
                              <option value="4">4 Applicants</option>
                              <option value="5">5+ Family / Group</option>
                            </select>
                          </div>
                        </div>

                        {/* Passport validity toggle */}
                        <div className="flex items-center gap-2 pt-0.5">
                          <input
                            type="checkbox"
                            id="visaValidPassport"
                            checked={hasValidPassport}
                            onChange={(e) => setHasValidPassport(e.target.checked)}
                            className="w-3.5 h-3.5 accent-emerald-600 rounded cursor-pointer"
                          />
                          <label htmlFor="visaValidPassport" className="text-[11px] text-slate-700 font-medium cursor-pointer">
                            Applicants currently hold valid Indian Passport with at least 6 months validity
                          </label>
                        </div>
                      </div>
                    )}

                    {/* --- 3. PASSPORT DETAILS --- */}
                    {serviceType === 'Passport' && (
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-purple-900 uppercase tracking-wide flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-purple-600" /> Passport Application & Support Details
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Application Category *</label>
                            <select
                              value={passportType}
                              onChange={(e) => setPassportType(e.target.value)}
                              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white text-slate-800 outline-none focus:border-slate-500 font-medium h-[34px]"
                            >
                              <option value="Fresh Passport (First-time Applicant)">Fresh Passport (First-time Applicant)</option>
                              <option value="Passport Renewal / Re-issue (Within 1 Year or Expired)">Passport Renewal / Re-issue</option>
                              <option value="Tatkaal Urgent Passport (1-3 Days Emergency)">Tatkaal Urgent (1-3 Days Fast-Track)</option>
                              <option value="Minor Passport (Children Under 18)">Minor Passport (Under 18)</option>
                              <option value="Damaged or Lost Booklet Re-issue">Damaged or Lost Booklet Re-issue</option>
                              <option value="Name / Address / Spouse Correction">Name / Address / Spouse Correction</option>
                              <option value="Police Clearance Certificate (PCC)">Police Clearance Certificate (PCC)</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Booklet Type</label>
                            <select
                              value={passportPages}
                              onChange={(e) => setPassportPages(e.target.value as any)}
                              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white text-slate-800 outline-none focus:border-slate-500 font-medium h-[34px]"
                            >
                              <option value="36 Pages (Standard)">36 Pages (Standard Booklet)</option>
                              <option value="60 Pages (Jumbo)">60 Pages (Jumbo Booklet)</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-12 gap-2">
                          <div className="col-span-6">
                            <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Preferred Branch Assistance *</label>
                            <select
                              value={preferredBranch}
                              onChange={(e) => setPreferredBranch(e.target.value)}
                              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white text-slate-800 outline-none focus:border-slate-500 font-medium h-[34px]"
                            >
                              <option value="Adirampattinam Branch (HQ)">Adirampattinam Branch (HQ)</option>
                              <option value="Madukkur Branch">Madukkur Branch</option>
                              <option value="Online / Doorstep Guidance">Online / Doorstep Guidance</option>
                            </select>
                          </div>

                          <div className="col-span-6">
                            <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Existing Passport No. (If Renewal / Tatkaal)</label>
                            <input
                              type="text"
                              placeholder="e.g., Z1234567 (Optional)"
                              value={existingPassportNo}
                              onChange={(e) => setExistingPassportNo(e.target.value.toUpperCase())}
                              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md outline-none focus:border-slate-500 font-medium font-mono h-[34px]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Applicant Date of Birth (Optional for slot checking)</label>
                          <input
                            type="date"
                            value={applicantDob}
                            onChange={(e) => setApplicantDob(e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md outline-none focus:border-slate-500 font-medium text-slate-800 h-[34px]"
                          />
                        </div>
                      </div>
                    )}

                    {/* --- 4. PACKAGE / TOUR DETAILS --- */}
                    {serviceType === 'Package' && (
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wide flex items-center gap-1">
                          <Package className="w-3.5 h-3.5 text-amber-600" /> Holiday & Umrah Tour Requirements
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Package / Destination Name *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Dubai 5D Luxury / Umrah / Singapore"
                              value={packageName}
                              onChange={(e) => setPackageName(e.target.value)}
                              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md outline-none focus:border-slate-500 font-medium h-[34px]"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Departure City *</label>
                            <select
                              value={departureCity}
                              onChange={(e) => setDepartureCity(e.target.value)}
                              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white text-slate-800 outline-none focus:border-slate-500 font-medium h-[34px]"
                            >
                              <option value="Trichy (TRZ)">Trichy (TRZ)</option>
                              <option value="Chennai (MAA)">Chennai (MAA)</option>
                              <option value="Madurai (IXM)">Madurai (IXM)</option>
                              <option value="Bangalore (BLR)">Bangalore (BLR)</option>
                              <option value="Kochi (COK)">Kochi (COK)</option>
                              <option value="Coimbatore (CJB)">Coimbatore (CJB)</option>
                              <option value="Other City">Other City</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-12 gap-2">
                          <div className="col-span-4">
                            <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Travel Date *</label>
                            <input
                              type="date"
                              required
                              value={packageDate}
                              onChange={(e) => setPackageDate(e.target.value)}
                              className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-md outline-none focus:border-slate-500 font-medium text-slate-800 h-[34px]"
                            />
                          </div>

                          <div className="col-span-4">
                            <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Duration</label>
                            <select
                              value={packageDuration}
                              onChange={(e) => setPackageDuration(e.target.value)}
                              className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-md bg-white text-slate-800 outline-none focus:border-slate-500 font-medium h-[34px]"
                            >
                              <option value="3N/4D">3N / 4D</option>
                              <option value="4N/5D">4N / 5D</option>
                              <option value="6N/7D">6N / 7D</option>
                              <option value="10N/11D">10N / 11D</option>
                              <option value="14 Days Umrah">14 Days Umrah</option>
                              <option value="Custom Duration">Custom</option>
                            </select>
                          </div>

                          <div className="col-span-4">
                            <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Hotel Category</label>
                            <select
                              value={hotelCategory}
                              onChange={(e) => setHotelCategory(e.target.value)}
                              className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-md bg-white text-slate-800 outline-none focus:border-slate-500 font-medium h-[34px]"
                            >
                              <option value="3-Star Standard">3-Star Standard</option>
                              <option value="4-Star Premium Comfort">4-Star Premium</option>
                              <option value="5-Star Luxury VIP">5-Star Luxury</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Adults (12+ yrs)</label>
                            <select
                              value={packageAdults}
                              onChange={(e) => setPackageAdults(e.target.value)}
                              className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded-md bg-white text-slate-800 outline-none focus:border-slate-500 font-medium h-[32px]"
                            >
                              <option value="1">1 Adult</option>
                              <option value="2">2 Adults</option>
                              <option value="3">3 Adults</option>
                              <option value="4">4 Adults</option>
                              <option value="5">5+ Adults</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Children (Below 12 yrs)</label>
                            <select
                              value={packageChildren}
                              onChange={(e) => setPackageChildren(e.target.value)}
                              className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded-md bg-white text-slate-800 outline-none focus:border-slate-500 font-medium h-[32px]"
                            >
                              <option value="0">0 Children</option>
                              <option value="1">1 Child</option>
                              <option value="2">2 Children</option>
                              <option value="3">3+ Children</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* --- 5. HOTEL DETAILS --- */}
                    {serviceType === 'Hotel' && (
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wide flex items-center gap-1">
                          <Building className="w-3.5 h-3.5 text-indigo-600" /> Worldwide Hotel Booking
                        </span>

                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-0.5">City / Hotel Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Dubai, Makkah, Madinah, Singapore, London"
                            value={hotelCity}
                            onChange={(e) => setHotelCity(e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md outline-none focus:border-slate-500 font-medium h-[34px]"
                          />
                        </div>

                        <div className="grid grid-cols-12 gap-2">
                          <div className="col-span-6">
                            <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Check-in Date *</label>
                            <input
                              type="date"
                              required
                              value={hotelCheckIn}
                              onChange={(e) => setHotelCheckIn(e.target.value)}
                              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md outline-none focus:border-slate-500 font-medium text-slate-800 h-[34px]"
                            />
                          </div>

                          <div className="col-span-6">
                            <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Check-out Date *</label>
                            <input
                              type="date"
                              required
                              value={hotelCheckOut}
                              onChange={(e) => setHotelCheckOut(e.target.value)}
                              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md outline-none focus:border-slate-500 font-medium text-slate-800 h-[34px]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Rooms</label>
                            <select
                              value={roomCount}
                              onChange={(e) => setRoomCount(e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-slate-300 rounded-md bg-white text-slate-800 outline-none focus:border-slate-500 font-medium h-[32px]"
                            >
                              <option value="1">1 Room</option>
                              <option value="2">2 Rooms</option>
                              <option value="3">3 Rooms</option>
                              <option value="4">4+ Rooms</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Guests</label>
                            <select
                              value={hotelGuests}
                              onChange={(e) => setHotelGuests(e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-slate-300 rounded-md bg-white text-slate-800 outline-none focus:border-slate-500 font-medium h-[32px]"
                            >
                              <option value="1">1 Guest</option>
                              <option value="2">2 Guests</option>
                              <option value="3">3 Guests</option>
                              <option value="4">4+ Guests</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Rating</label>
                            <select
                              value={hotelRating}
                              onChange={(e) => setHotelRating(e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-slate-300 rounded-md bg-white text-slate-800 outline-none focus:border-slate-500 font-medium h-[32px]"
                            >
                              <option value="3-Star Standard">3-Star</option>
                              <option value="4-Star Premium">4-Star</option>
                              <option value="5-Star Luxury">5-Star</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* --- 6. CARGO DETAILS --- */}
                    {serviceType === 'Cargo' && (
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-orange-900 uppercase tracking-wide flex items-center gap-1">
                          <Luggage className="w-3.5 h-3.5 text-orange-600" /> Air & Sea Cargo Forwarding
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Origin City / Port *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Adirampattinam / Trichy"
                              value={cargoOrigin}
                              onChange={(e) => setCargoOrigin(e.target.value)}
                              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md outline-none focus:border-slate-500 font-medium h-[34px]"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Destination Country / Airport *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Dubai (DXB), Saudi Arabia, Singapore"
                              value={cargoDestination}
                              onChange={(e) => setCargoDestination(e.target.value)}
                              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md outline-none focus:border-slate-500 font-medium h-[34px]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-12 gap-2">
                          <div className="col-span-5">
                            <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Goods Type *</label>
                            <select
                              value={cargoType}
                              onChange={(e) => setCargoType(e.target.value)}
                              className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-md bg-white text-slate-800 outline-none focus:border-slate-500 font-medium h-[34px]"
                            >
                              <option value="Personal Excess Luggage">Personal Excess Luggage</option>
                              <option value="Commercial Cargo">Commercial Cargo</option>
                              <option value="Foodstuffs & Spices">Foodstuffs & Spices</option>
                              <option value="Household & Electronics">Household & Electronics</option>
                              <option value="Urgent Documents">Urgent Documents</option>
                            </select>
                          </div>

                          <div className="col-span-3">
                            <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Est. Weight *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. 25 kg"
                              value={cargoWeight}
                              onChange={(e) => setCargoWeight(e.target.value)}
                              className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-md outline-none focus:border-slate-500 font-medium h-[34px]"
                            />
                          </div>

                          <div className="col-span-4">
                            <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Shipping Mode</label>
                            <select
                              value={cargoMode}
                              onChange={(e) => setCargoMode(e.target.value)}
                              className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-md bg-white text-slate-800 outline-none focus:border-slate-500 font-medium h-[34px]"
                            >
                              <option value="Express Air Cargo (Fastest)">Express Air Cargo</option>
                              <option value="Sea Freight (Bulk Economy)">Sea Freight (Bulk)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* --- 7. OTHER SERVICES (ATTESTATION, INSURANCE, FOREX, BUS) --- */}
                    {serviceType === 'Miscellaneous' && (
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-slate-600" /> Certificate Attestation & Value-Added Services
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Service Required *</label>
                            <select
                              value={miscService}
                              onChange={(e) => setMiscService(e.target.value)}
                              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white text-slate-800 outline-none focus:border-slate-500 font-medium h-[34px]"
                            >
                              <option value="Certificate Attestation (HRD/MEA/Apostille)">Certificate Attestation (HRD/MEA)</option>
                              <option value="Embassy Legalization (UAE/Saudi/Qatar)">Embassy Legalization (Gulf)</option>
                              <option value="Overseas Travel Medical Insurance">Overseas Travel Insurance</option>
                              <option value="Foreign Exchange (Forex Currency)">Foreign Exchange (Forex)</option>
                              <option value="Intercity Bus Ticket Booking">Intercity Bus Ticket Booking</option>
                              <option value="General Travel Assistance">General Travel Assistance</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Target Country or Route</label>
                            <input
                              type="text"
                              placeholder="e.g. UAE / Saudi / Chennai"
                              value={miscCountry}
                              onChange={(e) => setMiscCountry(e.target.value)}
                              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md outline-none focus:border-slate-500 font-medium h-[34px]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Required By Date</label>
                          <input
                            type="date"
                            value={miscDate}
                            onChange={(e) => setMiscDate(e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md outline-none focus:border-slate-500 font-medium text-slate-800 h-[34px]"
                          />
                        </div>
                      </div>
                    )}

                  </div>

                  {/* REMARKS (RELEVANT FOR SPECIAL NOTES) */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                      Remarks / Specific Requirements
                    </label>
                    <textarea
                      rows={2}
                      placeholder={
                        serviceType === 'Flight'
                          ? "e.g., Preferred airline, non-stop flight, extra baggage, wheelchair..."
                          : serviceType === 'Visa'
                            ? "e.g., Urgent fast-track processing, OK-to-Board, document verification..."
                            : serviceType === 'Passport'
                              ? "e.g., Urgent PSK slot required in Trichy/Chennai, emergency travel..."
                              : serviceType === 'Package'
                                ? "e.g., Halal food preference, private vehicle, specific attractions..."
                                : serviceType === 'Cargo'
                                  ? "e.g., Doorstep pickup address in Adirampattinam / Madukkur..."
                                  : "Describe your requirements or questions..."
                      }
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md outline-none focus:border-slate-500 font-medium resize-none"
                    />
                  </div>

                  {/* Authorization Checkbox */}
                  <div className="flex items-center gap-2 pt-0.5">
                    <input
                      type="checkbox"
                      id="enquiryAuthCheck"
                      required
                      checked={agreeToContact}
                      onChange={(e) => setAgreeToContact(e.target.checked)}
                      className="w-3.5 h-3.5 accent-slate-900 rounded cursor-pointer"
                    />
                    <label
                      htmlFor="enquiryAuthCheck"
                      className="text-[11px] text-slate-800 font-medium select-none cursor-pointer"
                    >
                      I request and authorize <strong className="text-slate-900">MMS AIR TRAVELS</strong> to contact me.
                    </label>
                  </div>

                  {/* Bottom Red Send Enquiry Button */}
                  <div className="pt-1 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#D32F2F] hover:bg-[#B71C1C] active:bg-[#9A0007] text-white font-bold text-xs sm:text-sm rounded-md shadow-sm transition-all cursor-pointer tracking-wide flex items-center gap-1.5"
                    >
                      <span>Send {serviceType} Enquiry</span>
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

import React, { useState } from 'react';
import { 
  Plane, 
  Calendar, 
  MapPin, 
  Luggage, 
  Clock, 
  ShieldCheck, 
  Phone, 
  Sparkles, 
  Star, 
  ArrowRight, 
  ArrowLeftRight, 
  Search, 
  Compass, 
  Wifi, 
  Headphones, 
  Tv, 
  Wine, 
  User, 
  Shield, 
  CheckCircle,
  CheckCircle2,
  ExternalLink,
  X,
  Bot,
  Loader2,
  Hotel,
  Award,
  Maximize2,
  Bus,
  MessageSquare,
  Ticket,
  Globe,
  ChevronDown,
  ChevronUp,
  Building2,
  Heart
} from 'lucide-react';
import { CurrencyCode, TourPackage } from '../types';
import { formatCurrency, POPULAR_AIRPORTS } from '../data/airports';
import { INITIAL_GROUP_FARES } from '../data/groupFaresData';
import { CONTACT_NUMBERS, LOCATIONS } from '../data/contactInfo';

interface HomeViewProps {
  currency: CurrencyCode;
  onNavigateTab: (tab: string, subCategory?: string) => void;
  onSelectPackage: (pkg: TourPackage) => void;
  onOpenEnquiry: (serviceType: any, destPreset?: string) => void;
  onOpenChat?: (intent?: string) => void;
  onOpenBusModal?: () => void;
}

interface CuratedRoute {
  id: string;
  category: 'north-america' | 'transatlantic' | 'asia-pacific' | 'gulf';
  fromCity: string;
  fromCode: string;
  toCity: string;
  toCode: string;
  aircraft: string;
  flightTime: string;
  tag: string;
  imageUrl: string;
  imageAlt: string;
  economyPriceUSD: number;
  premiumPriceUSD: number;
  premiumLabel: string;
}

export const HomeView: React.FC<HomeViewProps> = ({
  currency,
  onNavigateTab,
  onSelectPackage,
  onOpenEnquiry,
  onOpenChat,
  onOpenBusModal
}) => {
  // Flight Search Suite State
  const [tripType, setTripType] = useState<'roundtrip' | 'oneway' | 'multicity' | 'charter'>('roundtrip');
  const [originCode, setOriginCode] = useState('JFK');
  const [originName, setOriginName] = useState('New York, John F. Kennedy');
  const [destCode, setDestCode] = useState('DXB');
  const [destName, setDestName] = useState('Dubai International, UAE');
  const [datesText, setDatesText] = useState('Oct 24 - Nov 02, 2025');
  const [travelersText, setTravelersText] = useState('2 Adults • Business Class');
  const [cabinClass, setCabinClass] = useState<'economy' | 'business' | 'first'>('business');
  
  // Toggles
  const [directOnly, setDirectOnly] = useState(true);
  const [loungeAccess, setLoungeAccess] = useState(true);
  const [flexibleDates, setFlexibleDates] = useState(false);
  const [isSwapped, setIsSwapped] = useState(false);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);

  // Radar Ops State
  const [searchFlightNo, setSearchFlightNo] = useState('MMS-402');
  const [activeLeg, setActiveLeg] = useState({
    flightNo: 'MMS-402',
    sector: 'JFK → LHR',
    altitude: 'FL380',
    speed: '540 kts',
    status: 'On Schedule',
    gate: 'Gate B24',
    aircraft: 'Boeing 787-9 Dreamliner'
  });

  // Gemini AI Travel Copilot State
  const [copilotPrompt, setCopilotPrompt] = useState('Plan a 5-day luxury layover in Tokyo including Haneda VIP helicopter...');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedItinerary, setGeneratedItinerary] = useState<string | null>(null);
  const [itinerarySource, setItinerarySource] = useState<string>('');
  const [showItineraryModal, setShowItineraryModal] = useState(false);

  // Route Filters
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'north-america' | 'transatlantic' | 'asia-pacific'>('transatlantic');

  // Curated Routes Catalog
  const curatedRoutes: CuratedRoute[] = [
    {
      id: 'jfk-lhr',
      category: 'transatlantic',
      fromCity: 'New York',
      fromCode: 'JFK',
      toCity: 'London',
      toCode: 'LHR',
      aircraft: 'Boeing 787-9 Dreamliner',
      flightTime: '7h 10m',
      tag: 'Non-Stop Flagship',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBihlBJ1zFQUx1bE-GQ1oZaxZmklzDp1_6KqlNRCdp7ORC8VtAlWuGYKtrXcQwfTE6NmKJSY-dHKR8ROm-pK1GGNUC1RYeB4nDoIfxTkqmJoaxkNsFoB9D2m3mYXWnw8eIlcirHClsnS6g3Isq8z7J7McS27ciACmeoW3kLpfIanCGbjYXy3X_gLyfLOJYKK9LSob-ZDhfONIg8nI9ay8Ckaou2W7nrUtHCDxDlyvNV6HtJD99aUK7c9g',
      imageAlt: 'London skyline at twilight with the River Thames',
      economyPriceUSD: 620,
      premiumPriceUSD: 2450,
      premiumLabel: 'Business Suite'
    },
    {
      id: 'dxb-hnd',
      category: 'asia-pacific',
      fromCity: 'Dubai',
      fromCode: 'DXB',
      toCity: 'Tokyo',
      toCode: 'HND',
      aircraft: 'Airbus A350-1000',
      flightTime: '9h 40m',
      tag: 'Daily Non-Stop',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYda8x4GKUoNzUSwRdLlF_KAkE3FCRyDt5bxov_uwJnaOfmMpfpC4mUQTEzf_j-5Ego0ddvNYYX0B1Nk30KfuD6891bg60sDCgGdYQQeoXRBC_iXfyPSg_77Y6fCeqNm9h7uCMcy3qtd47PhGBcxMRtZJCrCgbaKCMCRvBNmpF7AV8pOcxj3ekFrP8j-x39gmbxEkwS3gBKs6tt-AkYaMkHKi8GJBTTLc8ok24WZEJTSZ67lWoimat_w',
      imageAlt: 'Tokyo Tower illuminated at dusk against Mount Fuji',
      economyPriceUSD: 780,
      premiumPriceUSD: 3200,
      premiumLabel: 'First Suite'
    },
    {
      id: 'sin-cdg',
      category: 'transatlantic',
      fromCity: 'Singapore',
      fromCode: 'SIN',
      toCity: 'Paris',
      toCode: 'CDG',
      aircraft: 'Boeing 777-300ER',
      flightTime: '13h 25m',
      tag: 'Overnight Express',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_qOdq305rWlaliCPuat9dFbkS9NLcfzKIGt4jJXMmhqBTnTA6pK3z1SQC_Pgnn51fuCWN6n4KVjA2m8yNF_duZ2L5Hlb2av2wjTnQFQ5Ap4MT42aT543OaRflDFod-xFC4pDPdM1Ela3ekVQ6PtEAz79UiBit_Iw55UfYV1m2_hVhyy27dpE7nChU9QrSb8fiALsMuR21XKoBIqwmulTw9Gw1wzxtCmcdcyxnMNf1-fQDH0Sz9HK9UA',
      imageAlt: 'Golden hour cityscape of Paris with the Eiffel Tower',
      economyPriceUSD: 890,
      premiumPriceUSD: 3850,
      premiumLabel: 'First Suite'
    },
    {
      id: 'lax-syd',
      category: 'north-america',
      fromCity: 'Los Angeles',
      fromCode: 'LAX',
      toCity: 'Sydney',
      toCode: 'SYD',
      aircraft: 'Airbus A350-900',
      flightTime: '14h 50m',
      tag: 'Direct Cross-Pacific',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA58ygeOlwGbdDvHWX1i2jVeVDd46gC10raHOIskM71YOFIynWLVa-E0g13TJdJBGLVXE1GIea66GQ7AgRqCYLRv-NXZXd8frkyDm1I2_PGgv7mK0jUYRVHRb9erb0VwQkHaYF0UC0UihIx21egGzZizMjFc2t4hQbQWo3A8Y6BdZZYB3KQyGTbux_AHlKuWAI_AKbALffCjMz5ctmyWWaidY2HddFaGWDkpJ-RmOhEzIml3_9RvpZvSA',
      imageAlt: 'Vibrant view of Sydney Harbour and Opera House',
      economyPriceUSD: 940,
      premiumPriceUSD: 4100,
      premiumLabel: 'Business Class'
    }
  ];

  const filteredRoutes = selectedRegion === 'all' 
    ? curatedRoutes 
    : curatedRoutes.filter(r => r.category === selectedRegion);

  const handleSwapRoute = () => {
    setIsSwapped(prev => !prev);
    const tempCode = originCode;
    const tempName = originName;
    setOriginCode(destCode);
    setOriginName(destName);
    setDestCode(tempCode);
    setDestName(tempName);
  };

  const handleTrackFlight = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchFlightNo.toUpperCase().trim();
    if (query.includes('819') || query.includes('DXB')) {
      setActiveLeg({
        flightNo: query || 'MMS-819',
        sector: 'DXB → TRZ',
        altitude: 'FL360',
        speed: '510 kts',
        status: 'Descending',
        gate: 'Gate 04',
        aircraft: 'Airbus A321neo'
      });
    } else if (query.includes('101') || query.includes('SIN')) {
      setActiveLeg({
        flightNo: query || 'MMS-101',
        sector: 'SIN → TRZ',
        altitude: 'FL390',
        speed: '530 kts',
        status: 'Cruising',
        gate: 'Gate T2-A',
        aircraft: 'Boeing 737 MAX 8'
      });
    } else {
      setActiveLeg({
        flightNo: query || 'MMS-402',
        sector: 'JFK → LHR',
        altitude: 'FL380',
        speed: '540 kts',
        status: 'On Schedule',
        gate: 'Gate B24',
        aircraft: 'Boeing 787-9 Dreamliner'
      });
    }
  };

  const handleGenerateItinerary = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/gemini/curate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: copilotPrompt })
      });
      const data = await res.json();
      if (data.success && data.itinerary) {
        setGeneratedItinerary(data.itinerary);
        setItinerarySource(data.source || 'gemini');
        setShowItineraryModal(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectCuratedRoute = (route: CuratedRoute) => {
    setOriginCode(route.fromCode);
    setOriginName(`${route.fromCity} (${route.fromCode})`);
    setDestCode(route.toCode);
    setDestName(`${route.toCity} (${route.toCode})`);
    // Scroll to flight suite
    const el = document.getElementById('flight-suite');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToFlightSuite = () => {
    const el = document.getElementById('flight-suite');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const FAQS = [
    {
      q: '1. What services does MMS AIR TRAVELS provide?',
      a: 'We provide flight ticket booking, bus ticket booking, visa assistance, and other travel-related services.'
    },
    {
      q: '2. Where is MMS AIR TRAVELS located?',
      a: 'We have physical branch offices in Madukkur and Adirampattinam.'
    },
    {
      q: '3. How many customers have you served?',
      a: 'We are proud to have served 49K+ happy customers across Tamil Nadu and international destinations.'
    },
    {
      q: '4. Can I book international flights?',
      a: 'Yes, we assist with both domestic and international flight bookings across all major airlines.'
    },
    {
      q: '5. Can I book bus tickets?',
      a: 'Yes, we assist with bus ticket bookings for various routes across Tamil Nadu and neighboring states.'
    },
    {
      q: '6. Do you provide visa services?',
      a: 'Yes, we assist with tourist, visit, and business visa applications for selected international destinations.'
    },
    {
      q: '7. Can you guarantee visa approval?',
      a: 'Visa approval is strictly decided by the respective embassy or immigration authorities. We provide complete documentation and application guidance to maximize approval chances.'
    },
    {
      q: '8. Why does the flight fare change?',
      a: 'Flight fares depend on airline seat availability, travel dates, booking timing, and fuel surcharges. Fares are dynamic until ticket issuance.'
    },
    {
      q: '9. Can I change my ticket date?',
      a: 'Date change depends on the airline’s ticket fare rules and seat availability. Applicable airline charges may apply. Contact our ticket desk (+91 95009 77442) for fast assistance.'
    },
    {
      q: '10. How can I contact MMS AIR TRAVELS?',
      a: 'You can contact us via WhatsApp, phone call, or visit our branches in Madukkur and Adirampattinam. For General Inquiry: +91 95005 67442 | Flight Tickets: +91 95009 77442 | Visa: +91 93845 67442 | Other Services: +91 63690 12360.'
    }
  ];

  return (
    <div className="flex flex-col w-full overflow-hidden bg-[#f7fafe]">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[600px] lg:min-h-[680px] bg-gradient-to-b from-[#181c1f] via-[#006097] to-[#f7fafe] flex flex-col justify-between overflow-hidden">
        
        {/* Atmospheric Ambient Glows & Aviation Graphic Backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#007abd]/30 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#cee5ff]/10 blur-3xl pointer-events-none" />
        
        {/* Subtle Aviation Flight Path Graphic (Clean 2D Vector) */}
        <div className="absolute right-0 top-1/4 w-full max-w-2xl h-80 opacity-15 pointer-events-none hidden lg:block">
          <svg viewBox="0 0 800 400" fill="none" className="w-full h-full text-white stroke-current">
            <path d="M50 350 C 250 300, 450 150, 750 80" strokeWidth="2" strokeDasharray="6 8" />
            <circle cx="750" cy="80" r="6" fill="white" />
            <path d="M120 380 C 320 280, 520 180, 720 120" strokeWidth="1.5" strokeDasharray="4 6" opacity="0.6" />
          </svg>
        </div>

        {/* Hero Content Overlay */}
        <div className="relative z-20 w-full px-6 lg:px-16 pt-12 lg:pt-16 pb-36 max-w-5xl">
          
          {/* Status Badges Carousel */}
          <div className="flex items-center flex-wrap gap-2 lg:gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-300 text-xs font-bold border border-white/15">
              <span>❤️</span>
              49K+ Happy Customers
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-medium border border-white/10">
              <Calendar className="w-3.5 h-3.5 text-blue-200" />
              Since 2020
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-200 text-xs font-medium border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              Your Trusted Travel Partner
            </span>
          </div>

          {/* Master Prompt Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight max-w-4xl drop-shadow-md leading-tight">
            Your Journey Starts With MMS AIR TRAVELS ✈️
          </h1>
          
          {/* Master Prompt Subheading */}
          <h2 className="text-xl sm:text-2xl text-amber-300 font-bold mt-3 tracking-wide">
            Reliable Travel Services for Every Journey
          </h2>

          {/* Master Prompt Description */}
          <p className="text-base sm:text-lg text-slate-100 max-w-2xl mt-3 leading-relaxed font-normal">
            With <strong>49K+ Happy Customers</strong>, MMS AIR TRAVELS has been delivering trusted flight bookings, bus reservations, visa assistance, and complete travel support <strong>since 2020</strong>.
          </p>

          {/* Master Prompt 6 Homepage Buttons */}
          <div className="flex items-center gap-3 mt-8 flex-wrap">
            {/* 1. Flight Booking */}
            <button 
              onClick={scrollToFlightSuite}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg transition-transform hover:scale-105 cursor-pointer"
            >
              <Plane className="w-4 h-4" />
              <span>✈️ Flight Booking</span>
            </button>

            {/* 2. Bus Booking */}
            <button 
              onClick={() => onOpenBusModal?.()}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs uppercase tracking-wider shadow-lg transition-transform hover:scale-105 cursor-pointer"
            >
              <Bus className="w-4 h-4 text-[#006097]" />
              <span>🚌 Bus Booking</span>
            </button>

            {/* 3. Visa Services */}
            <button 
              onClick={() => onNavigateTab('visa')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-transform hover:scale-105 cursor-pointer"
            >
              <Globe className="w-4 h-4" />
              <span>🌍 Visa Services</span>
            </button>

            {/* 4. Travel Services */}
            <button 
              onClick={() => onNavigateTab('other-services')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-bold text-xs uppercase tracking-wider border border-white/20 transition-all cursor-pointer"
            >
              <Luggage className="w-4 h-4" />
              <span>🧳 Travel Services</span>
            </button>

            {/* 5. Chat With Us */}
            <button 
              onClick={() => onOpenChat?.('general')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-transform hover:scale-105 cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>💬 Chat With Us</span>
            </button>

            {/* 6. WhatsApp Us */}
            <a 
              href={CONTACT_NUMBERS.general.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-transform hover:scale-105 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>📱 WhatsApp Us</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. FLOATING FLIGHT SEARCH & BOOKING SUITE */}
      <section className="relative z-30 w-full px-4 sm:px-6 lg:px-16 -mt-16 sm:-mt-24 lg:-mt-28 mb-10" id="flight-suite">
        <div className="w-full max-w-7xl mx-auto rounded-xl bg-white/95 backdrop-blur-2xl shadow-xl shadow-slate-900/5 p-4 sm:p-5 lg:p-7 border border-slate-200/80">
          
          {/* Tabs Switcher */}
          <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-1 bg-[#f1f4f8] p-1 rounded-lg overflow-x-auto max-w-full scrollbar-none" id="search-tabs">
              <button 
                onClick={() => setTripType('roundtrip')}
                className={`whitespace-nowrap px-3 sm:px-4 py-2 rounded-md text-xs font-semibold transition-all ${
                  tripType === 'roundtrip' 
                    ? 'bg-[#006097] text-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Round Trip
              </button>
              <button 
                onClick={() => setTripType('oneway')}
                className={`whitespace-nowrap px-3 sm:px-4 py-2 rounded-md text-xs font-semibold transition-all ${
                  tripType === 'oneway' 
                    ? 'bg-[#006097] text-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                One Way
              </button>
              <button 
                onClick={() => setTripType('multicity')}
                className={`whitespace-nowrap px-3 sm:px-4 py-2 rounded-md text-xs font-semibold transition-all ${
                  tripType === 'multicity' 
                    ? 'bg-[#006097] text-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Multi-City
              </button>
              <button 
                onClick={() => setTripType('charter')}
                className={`whitespace-nowrap px-3 sm:px-4 py-2 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                  tripType === 'charter' 
                    ? 'bg-[#735c00] text-white shadow-sm' 
                    : 'text-[#735c00] hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">stars</span>
                Private Charter
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-slate-600 text-xs font-medium">
              <span className="material-symbols-outlined text-[#006097] text-[18px]">shield</span>
              <span>Best Guaranteed Airfare & Flexible Reschedule</span>
            </div>
          </div>

          {/* Main Search Inputs Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 items-center mt-4">
            
            {/* Origin */}
            <div className="lg:col-span-3 relative bg-[#f1f4f8] hover:bg-[#ebeef2] transition-colors rounded-lg p-3 cursor-pointer">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Departure From
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="material-symbols-outlined text-[#006097] text-[20px]">flight_takeoff</span>
                <div className="min-w-0">
                  <span className="text-2xl font-extrabold text-[#181c1f] block leading-none tracking-wider">
                    {originCode}
                  </span>
                  <span className="text-xs text-slate-600 truncate block mt-0.5">
                    {originName}
                  </span>
                </div>
              </div>
            </div>

            {/* Swap Route Button */}
            <div className="flex lg:col-span-1 justify-center -my-1 lg:-my-0 lg:-mx-4 z-10">
              <button 
                onClick={handleSwapRoute}
                aria-label="Swap Origin and Destination" 
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[#006097] hover:bg-[#006097] hover:text-white transition-transform duration-300 ${
                  isSwapped ? 'rotate-180' : ''
                }`}
              >
                <span className="material-symbols-outlined text-[18px] sm:text-[20px] rotate-90 lg:rotate-0">sync_alt</span>
              </button>
            </div>

            {/* Destination */}
            <div className="lg:col-span-3 relative bg-[#f1f4f8] hover:bg-[#ebeef2] transition-colors rounded-lg p-3 cursor-pointer">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Destination To
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="material-symbols-outlined text-[#006097] text-[20px]">flight_land</span>
                <div className="min-w-0">
                  <span className="text-2xl font-extrabold text-[#181c1f] block leading-none tracking-wider">
                    {destCode}
                  </span>
                  <span className="text-xs text-slate-600 truncate block mt-0.5">
                    {destName}
                  </span>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="lg:col-span-3 relative bg-[#f1f4f8] hover:bg-[#ebeef2] transition-colors rounded-lg p-3 cursor-pointer">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Travel Dates
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="material-symbols-outlined text-[#006097] text-[20px]">calendar_month</span>
                <div className="min-w-0">
                  <span className="text-sm font-semibold text-[#181c1f] block truncate">
                    {datesText}
                  </span>
                  <span className="text-xs text-slate-600 truncate block">
                    {tripType === 'roundtrip' ? '10 Days • Round Trip' : 'Flexible Date Selected'}
                  </span>
                </div>
              </div>
            </div>

            {/* Travelers & Class */}
            <div className="lg:col-span-2 relative bg-[#f1f4f8] hover:bg-[#ebeef2] transition-colors rounded-lg p-3 cursor-pointer">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Travelers & Cabin
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="material-symbols-outlined text-[#006097] text-[20px]">airline_seat_recline_extra</span>
                <div className="min-w-0">
                  <span className="text-sm font-semibold text-[#181c1f] block truncate">
                    2 Adults
                  </span>
                  <span className="text-xs text-[#735c00] font-semibold truncate block">
                    Business Class
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Toggles & Action */}
          <div className="mt-4 pt-3 flex flex-col lg:flex-row items-center justify-between gap-4 border-t border-slate-100">
            <div className="flex items-center flex-wrap gap-4 text-slate-600 text-xs font-medium">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={directOnly}
                  onChange={(e) => setDirectOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-[#006097] accent-[#006097] cursor-pointer"
                />
                <span>Direct flights only</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={loungeAccess}
                  onChange={(e) => setLoungeAccess(e.target.checked)}
                  className="w-4 h-4 rounded text-[#006097] accent-[#006097] cursor-pointer"
                />
                <span>VIP Lounge Access</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={flexibleDates}
                  onChange={(e) => setFlexibleDates(e.target.checked)}
                  className="w-4 h-4 rounded text-[#006097] accent-[#006097] cursor-pointer"
                />
                <span>Flexible dates (±3 days)</span>
              </label>
            </div>

            <button 
              onClick={() => onNavigateTab('flight-ticket')}
              className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-[#006097] hover:bg-[#007abd] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all shrink-0 cursor-pointer"
            >
              <span>Search Luxury Flights</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2B. TRUST SECTION (Section 3 of Master Prompt) */}
      <section className="w-full px-6 lg:px-16 py-12 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold border border-rose-200">
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>49K+ Happy Customers ❤️</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900">
              Trusted by thousands of customers for their travel needs.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              MMS AIR TRAVELS has been delivering reliable, customer-friendly domestic & international travel assistance with dedicated branch offices in Tamil Nadu.
            </p>
          </div>

          {/* Our Journey & Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 rounded-2xl bg-[#f8fbff] border border-blue-100 text-center space-y-1">
              <span className="text-3xl lg:text-4xl font-black text-[#006097] block">
                49K+
              </span>
              <span className="text-xs font-bold text-slate-900 block">
                Happy Customers ❤️
              </span>
              <p className="text-[11px] text-slate-500">
                Trusted by thousands across Tamil Nadu & overseas
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#f8fbff] border border-blue-100 text-center space-y-1">
              <span className="text-3xl lg:text-4xl font-black text-[#006097] block">
                2020
              </span>
              <span className="text-xs font-bold text-slate-900 block">
                Since 2020
              </span>
              <p className="text-[11px] text-slate-500">
                Serving travelers with dependable travel services since 2020.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#f8fbff] border border-blue-100 text-center space-y-1">
              <span className="text-3xl lg:text-4xl font-black text-emerald-600 block">
                100%
              </span>
              <span className="text-xs font-bold text-slate-900 block">
                Verified Bookings
              </span>
              <p className="text-[11px] text-slate-500">
                Transparent fares, genuine guidance & verified ticket issuance
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#f8fbff] border border-blue-100 text-center space-y-1">
              <span className="text-3xl lg:text-4xl font-black text-[#006097] block">
                24/7
              </span>
              <span className="text-xs font-bold text-slate-900 block">
                Dedicated Support
              </span>
              <p className="text-[11px] text-slate-500">
                Direct WhatsApp & phone assistance for every journey
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 2C. ABOUT US SECTION (Section 4 of Master Prompt) */}
      <section className="w-full px-6 lg:px-16 py-14 bg-gradient-to-b from-[#f7fafe] to-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div>
                <span className="text-xs font-black text-[#006097] uppercase tracking-widest block mb-1">
                  ABOUT US
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  About MMS AIR TRAVELS
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Your Trusted Travel Partner • Travel Easy. Travel Confidently.
                </p>
              </div>

              <button
                onClick={() => onNavigateTab('about-us')}
                className="px-5 py-2.5 rounded-xl bg-[#006097] hover:bg-[#004f7c] text-white font-bold text-xs flex items-center gap-2 self-start md:self-auto cursor-pointer transition-colors shadow-sm"
              >
                <span>View Full About Us Page</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-4">
              <p>
                <strong>MMS AIR TRAVELS</strong> is a trusted travel service provider committed to making every journey simple, convenient, and comfortable.
              </p>
              <p>
                We have been serving customers with reliable travel assistance <strong>since 2020</strong>.
              </p>
              <p>
                With <strong>49K+ happy customers</strong>, our goal is to provide reliable travel assistance and customer-friendly service for domestic and international travel requirements.
              </p>
              <p>
                From flight bookings and bus bookings to visa assistance and other travel services, our team is ready to support you throughout your journey.
              </p>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs font-bold text-slate-900 block">49K+ Happy Customers ❤️</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs font-bold text-slate-900 block">Serving Since 2020</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs font-bold text-slate-900 block">Flight & Bus Booking</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs font-bold text-slate-900 block">Your Trusted Travel Partner</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2D. OUR LOCATIONS (Section 5 of Master Prompt) */}
      <section className="w-full px-6 lg:px-16 py-12 bg-white border-b border-slate-200/80" id="our-locations">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black text-[#006097] uppercase tracking-widest">
              PHYSICAL BRANCHES
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Visit MMS AIR TRAVELS
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Visit our travel offices in Madukkur and Adirampattinam for personalized consultation and direct bookings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Location 1: Madukkur */}
            <div className="p-6 rounded-3xl bg-[#f8fbff] border border-blue-200/80 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#006097] bg-blue-100 px-2.5 py-1 rounded-full">
                    Branch Office
                  </span>
                  <MapPin className="w-5 h-5 text-[#006097]" />
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  📍 Madukkur Branch
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {LOCATIONS.madukkur.address}
                </p>
                <div className="pt-2 text-xs space-y-1.5 text-slate-700">
                  <p><strong>Desk Timing:</strong> {LOCATIONS.madukkur.timings}</p>
                  <p><strong>General Inquiry:</strong> <a href="tel:9500567442" className="text-[#006097] hover:underline font-semibold">+91 95005 67442</a></p>
                  <p><strong>Ticket Booking:</strong> <a href="tel:9500977442" className="text-[#006097] hover:underline font-semibold">+91 95009 77442</a></p>
                  <p><strong>Other Services:</strong> <a href="tel:6369012360" className="text-[#006097] hover:underline font-semibold">+91 63690 12360</a></p>
                </div>
              </div>

              <div className="pt-3 border-t border-blue-100 flex flex-col sm:flex-row gap-2">
                <a
                  href={LOCATIONS.madukkur.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#006097] hover:bg-[#004f7c] text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 transition-colors shadow-sm active:scale-95"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>📍 Madukkur Location</span>
                </a>
                <a
                  href={LOCATIONS.madukkur.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 transition-colors active:scale-95"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Location 2: Adirampattinam */}
            <div className="p-6 rounded-3xl bg-[#f8fbff] border border-blue-200/80 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#006097] bg-blue-100 px-2.5 py-1 rounded-full">
                    Branch Office
                  </span>
                  <MapPin className="w-5 h-5 text-[#006097]" />
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  📍 Adirampattinam Branch
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {LOCATIONS.adirampattinam.address}
                </p>
                <div className="pt-2 text-xs space-y-1.5 text-slate-700">
                  <p><strong>Desk Timing:</strong> {LOCATIONS.adirampattinam.timings}</p>
                  <p><strong>General Inquiry:</strong> <a href="tel:9500567442" className="text-[#006097] hover:underline font-semibold">+91 95005 67442</a></p>
                  <p><strong>Visa & Booking:</strong> <a href="tel:9384567442" className="text-[#006097] hover:underline font-semibold">+91 93845 67442</a></p>
                  <p><strong>Other Services:</strong> <a href="tel:6369012360" className="text-[#006097] hover:underline font-semibold">+91 63690 12360</a></p>
                </div>
              </div>

              <div className="pt-3 border-t border-blue-100 flex flex-col sm:flex-row gap-2">
                <a
                  href={LOCATIONS.adirampattinam.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#006097] hover:bg-[#004f7c] text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 transition-colors shadow-sm active:scale-95"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>📍 Adirampattinam Location</span>
                </a>
                <a
                  href={LOCATIONS.adirampattinam.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 transition-colors active:scale-95"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2E. OUR SERVICES (Section 6 of Master Prompt) */}
      <section className="w-full px-6 lg:px-16 py-14 bg-[#f7fafe] border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black text-[#006097] uppercase tracking-widest">
              CORE OFFERINGS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Our Services
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Reliable, transparent travel assistance for all your journeys.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Service 1: Flight Booking */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#006097] flex items-center justify-center font-bold text-xl group-hover:bg-[#006097] group-hover:text-white transition-colors">
                  ✈️
                </div>
                <h3 className="font-bold text-base text-slate-900">
                  Flight Booking
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Domestic and international flight booking assistance.
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('flight-ticket')}
                className="w-full py-2.5 rounded-xl bg-[#006097] hover:bg-[#004f7c] text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Book Flight
              </button>
            </div>

            {/* Service 2: Bus Booking */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  🚌
                </div>
                <h3 className="font-bold text-base text-slate-900">
                  Bus Booking
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Bus ticket booking assistance for your travel requirements.
                </p>
              </div>
              <button
                onClick={() => onOpenBusModal?.()}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Book Bus
              </button>
            </div>

            {/* Service 3: Visa Services */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xl group-hover:bg-amber-500 group-hover:text-white transition-colors">
                  🌍
                </div>
                <h3 className="font-bold text-base text-slate-900">
                  Visa Services
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Visa assistance for selected destinations and travel purposes.
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('visa')}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Visa Enquiry
              </button>
            </div>

            {/* Service 4: Travel Services */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  🧳
                </div>
                <h3 className="font-bold text-base text-slate-900">
                  Travel Services
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Travel-related assistance to make your journey easier.
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('other-services')}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Enquire Now
              </button>
            </div>

            {/* Service 5: Ticket Enquiry */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-xl group-hover:bg-rose-600 group-hover:text-white transition-colors">
                  🎫
                </div>
                <h3 className="font-bold text-base text-slate-900">
                  Ticket Enquiry
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Get assistance with your existing or upcoming travel tickets.
                </p>
              </div>
              <button
                onClick={() => onOpenEnquiry('FLIGHT_TICKET', 'General Ticket Enquiry')}
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Ticket Enquiry
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. LIVE FLIGHT DISPATCH TRACKER & AI TRAVEL CONCIERGE */}
      <section className="w-full px-6 lg:px-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
          
          {/* Live Flight Tracker Widget (5 Cols) */}
          <div className="lg:col-span-5 rounded-xl bg-white p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[11px] uppercase tracking-widest text-slate-500 font-bold">
                    Live Radar Ops
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#ebeef2] text-slate-700 text-xs font-medium">
                  Active Airborne: 42
                </span>
              </div>
              <h2 className="text-xl font-bold text-[#181c1f] tracking-tight">
                Real-Time Flight Dispatch
              </h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Track altitude, estimated arrival time, and gate allocations for any active MMS scheduled leg.
              </p>

              <form onSubmit={handleTrackFlight} className="mt-4 flex items-center bg-[#f1f4f8] rounded-lg p-1.5 border border-slate-200">
                <span className="material-symbols-outlined text-slate-500 px-2 text-[20px]">search</span>
                <input 
                  type="text"
                  value={searchFlightNo}
                  onChange={(e) => setSearchFlightNo(e.target.value)}
                  placeholder="e.g. MMS-402, MMS-819"
                  className="bg-transparent w-full text-xs font-semibold text-slate-900 focus:outline-none uppercase tracking-wider"
                />
                <button 
                  type="submit"
                  className="px-4 py-2 rounded bg-[#006097] text-white text-xs font-semibold shrink-0 hover:bg-[#007abd] transition-colors cursor-pointer"
                >
                  Track Leg
                </button>
              </form>
            </div>

            {/* Active Flight Card */}
            <div className="mt-4 p-3.5 rounded-lg bg-[#f1f4f8] flex items-center justify-between border border-slate-200/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#cee5ff] flex items-center justify-center text-[#001d33]">
                  <span className="material-symbols-outlined text-[20px]">flight</span>
                </div>
                <div>
                  <span className="text-xs text-[#181c1f] block font-bold">
                    {activeLeg.flightNo} ({activeLeg.sector})
                  </span>
                  <span className="text-[11px] text-slate-600 font-mono-data">
                    {activeLeg.altitude} • {activeLeg.speed} • {activeLeg.status}
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#d6e3fe] text-[#0e1c2f] text-xs font-semibold">
                {activeLeg.gate}
              </span>
            </div>
          </div>

          {/* Gemini AI Travel Concierge Banner (7 Cols) */}
          <div className="lg:col-span-7 rounded-xl bg-gradient-to-br from-[#006097] via-[#004a76] to-[#181c1f] p-6 text-white shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 opacity-10 pointer-events-none">
              <span className="material-symbols-outlined text-[240px]">auto_awesome</span>
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[#ffe088] text-xs font-semibold mb-2 border border-white/15">
                <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
                <span>Gemini Intelligent Travel Copilot</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Curate Your Bespoke Global Itinerary
              </h2>
              <p className="text-sm text-slate-200 mt-2 max-w-xl leading-relaxed">
                "Ask Gemini: Plan your 7-day personalized itinerary with bespoke flight connections, five-star private hotel transfers, and Michelin-star dining allocations."
              </p>
            </div>

            <div className="relative z-10 mt-6">
              <div className="flex items-center bg-white/15 backdrop-blur-xl rounded-lg p-2 gap-2 border border-white/20">
                <span className="material-symbols-outlined text-slate-300 pl-2 text-[20px]">chat</span>
                <input 
                  type="text"
                  value={copilotPrompt}
                  onChange={(e) => setCopilotPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerateItinerary()}
                  placeholder="Plan a 5-day luxury layover in Tokyo including Haneda VIP helicopter..."
                  className="bg-transparent w-full text-xs text-white placeholder-slate-300 focus:outline-none"
                />
                <button 
                  onClick={handleGenerateItinerary}
                  disabled={isGenerating}
                  className="px-4 py-2 rounded-md bg-[#ffe088] text-[#241a00] text-xs font-bold hover:bg-[#e9c349] transition-colors shrink-0 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Curating...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. CURATED POPULAR ROUTES & REAL-TIME FARES */}
      <section className="w-full px-6 lg:px-16 pb-14">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-3">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#006097] font-bold block mb-1">
                Worldwide Networks
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#181c1f] tracking-tight">
                Curated Executive Flight Paths
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setSelectedRegion('north-america')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer ${
                  selectedRegion === 'north-america'
                    ? 'bg-[#006097] text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                North America
              </button>
              <button 
                onClick={() => setSelectedRegion('transatlantic')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer ${
                  selectedRegion === 'transatlantic'
                    ? 'bg-[#006097] text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Transatlantic
              </button>
              <button 
                onClick={() => setSelectedRegion('asia-pacific')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer ${
                  selectedRegion === 'asia-pacific'
                    ? 'bg-[#006097] text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Asia-Pacific
              </button>
              <button 
                onClick={() => setSelectedRegion('all')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer ${
                  selectedRegion === 'all'
                    ? 'bg-[#006097] text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                View All
              </button>
            </div>
          </div>

          {/* Route Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredRoutes.map((route) => (
              <div 
                key={route.id}
                className="rounded-xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col border border-slate-200/80"
              >
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <img 
                    src={route.imageUrl} 
                    alt={route.imageAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#006097] text-[11px] font-bold shadow-sm">
                    {route.tag}
                  </span>
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/75 backdrop-blur-sm text-white text-xs font-mono-data">
                    {route.flightTime}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[#181c1f]">
                      <span className="text-lg font-bold">{route.fromCity}</span>
                      <span className="material-symbols-outlined text-[#006097] text-[20px]">sync_alt</span>
                      <span className="text-lg font-bold">{route.toCity}</span>
                    </div>
                    <span className="text-xs text-slate-500 block mt-0.5 font-mono-data">
                      {route.fromCode} ⇄ {route.toCode} • {route.aircraft}
                    </span>
                  </div>

                  <div className="mt-4 pt-2 bg-[#f1f4f8] rounded-lg p-2.5 flex items-center justify-between border border-slate-200/60">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                        Economy from
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        {formatCurrency(route.economyPriceUSD, currency)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-semibold text-[#735c00] block">
                        {route.premiumLabel}
                      </span>
                      <span className="text-sm font-bold text-[#006097]">
                        {formatCurrency(route.premiumPriceUSD, currency)}
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleSelectCuratedRoute(route)}
                    className="mt-3 w-full py-2 rounded-lg bg-[#ebeef2] hover:bg-[#006097] hover:text-white text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
                  >
                    Select Itinerary
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. THE MMS LUXURY CABIN EXPERIENCE */}
      <section className="w-full px-6 lg:px-16 pb-16 bg-[#f1f4f8] py-16" id="cabin-suites">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-widest text-[#006097] font-bold block mb-1">
              Sanctuary In The Clouds
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#181c1f] tracking-tight">
              The MMS Luxury Cabin Experience
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Engineered for consummate serenity, acoustic tranquility, and personalized service at 40,000 feet.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* 1: First Class Private Suites */}
            <div className="rounded-xl bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col border border-slate-200/80">
              <div className="h-60 w-full relative">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaa3G92xDo3Cn7s_HecmT0fyiQpTuiOZx1funa2nz-yx5o74XBEXGzTzkmY9koiDqW751tYdnr_IDmR6BjWUhhcQocB-C4yCUDFgyNV7lV98GSQrigvGnTnPvlLJY9fY3yi9n5D42XF1YX62uKa9YmD1u-NOFakoL8MQDk1KeWsqVc6zzZbWKG2k7ItCjnZ5wzCEjfY4OYt9LUA96XuMK4RYQY3D17T5ieF4u3Ad625BUcnu_3GoMdVQ" 
                  alt="First class private enclosed suite"
                  className="w-full h-full object-cover" 
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#ffe088] text-[#241a00] text-xs font-bold flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-[14px]">hotel_class</span>
                  First Class Private Suites
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#181c1f]">
                    Uncompromised Seclusion
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Floor-to-ceiling privacy sliding doors, fully lie-flat 82-inch cashmere-dressed beds, and multi-zone ambient lighting.
                  </p>
                  <ul className="mt-4 flex flex-col gap-2.5 text-xs text-slate-800 font-medium">
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#735c00] text-[18px]">restaurant</span>
                      Michelin-inspired on-demand dining
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#735c00] text-[18px]">local_bar</span>
                      Chilled personal minibar & sommelier cellar
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#735c00] text-[18px]">shower</span>
                      A380 onboard luxury spa & shower suite
                    </li>
                  </ul>
                </div>
                <button 
                  onClick={() => onNavigateTab('flight-ticket')}
                  className="mt-6 w-full py-2.5 rounded-lg bg-[#ebeef2] hover:bg-[#ffe088] text-[#181c1f] text-xs font-bold transition-colors cursor-pointer"
                >
                  View Suite Specs & Virtual Tour
                </button>
              </div>
            </div>

            {/* 2: Executive Business Class */}
            <div className="rounded-xl bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col border border-slate-200/80">
              <div className="h-60 w-full relative">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCqTEZIWCMWhbXNhZOygU9ewukgFeVNalCAaoPyAiG0djBbaCiRSXCLIkkFAiv80BLNJAF9mcAg56iGiAcBi-_dB2Ch4RnjIeXQomAkphffr1vqBGvBumz1hl3tMqMBjTKLcDtd-FgM6WTS4ZHsDRRi4haxpkGTK51aHqeXrLHwHasCAdUAaFIO7hjkE8M9q0K3fUCCH2dCaKhy_aTlTV-LAfAEh9I21MvpZo_CCxXkeeoD6FXebnh-g" 
                  alt="Executive business class staggered cabin"
                  className="w-full h-full object-cover" 
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#006097] text-white text-xs font-bold flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-[14px]">business_center</span>
                  Executive Business Class
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#181c1f]">
                    Precision Airborne Productivity
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Every seat features direct aisle access, whisper-quiet acoustic separation, and 220V multi-regional power terminals.
                  </p>
                  <ul className="mt-4 flex flex-col gap-2.5 text-xs text-slate-800 font-medium">
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#006097] text-[18px]">wifi</span>
                      Complimentary ultra-fast Starlink Wi-Fi
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#006097] text-[18px]">headphones</span>
                      Custom Bang & Olufsen active noise-canceling
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#006097] text-[18px]">airline_seat_flat</span>
                      180° lie-flat bed with memory foam mattress
                    </li>
                  </ul>
                </div>
                <button 
                  onClick={() => onNavigateTab('flight-ticket')}
                  className="mt-6 w-full py-2.5 rounded-lg bg-[#ebeef2] hover:bg-[#006097] hover:text-white text-[#181c1f] text-xs font-bold transition-colors cursor-pointer"
                >
                  Explore Business Amenities
                </button>
              </div>
            </div>

            {/* 3: Premium Economy */}
            <div className="rounded-xl bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col border border-slate-200/80">
              <div className="h-60 w-full relative">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8xqqtCxLuuk2fS7341e1AD5JlDgbRNzKVF7XhByIZZRxjjwUP8o_0UXY3tFokKJ47_5jqdFgInVTZ8YnW-FQASyVMyrOMN2YCei0IrWPlbPBCnKrB13oialf90SNM-NKr2WbO7D-jdh5fA-UFpXAXNYIPnvcgeuIwlffgW5l0aRAD6oLcbuHcwoqbTspE3ooXer8fjtAj_a9BR7uVeoZSYaEaWcr9EOUCFSSbaXn9cF3r9nDDpRvMcw" 
                  alt="Premium economy cabin seats"
                  className="w-full h-full object-cover" 
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#525f75] text-white text-xs font-bold flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-[14px]">airline_seat_legroom_extra</span>
                  Premium Economy
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#181c1f]">
                    Superior Elevated Comfort
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Generous seat pitch, dedicated cabin section, priority boarding zones, and gourmet plated course menus.
                  </p>
                  <ul className="mt-4 flex flex-col gap-2.5 text-xs text-slate-800 font-medium">
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#525f75] text-[18px]">straighten</span>
                      Generous 38" pitch and 8" deep recline
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#525f75] text-[18px]">priority_high</span>
                      Priority security check-in & accelerated boarding
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#525f75] text-[18px]">tv</span>
                      13.3-inch 4K Ultra-HD personal touch monitor
                    </li>
                  </ul>
                </div>
                <button 
                  onClick={() => onNavigateTab('flight-ticket')}
                  className="mt-6 w-full py-2.5 rounded-lg bg-[#ebeef2] hover:bg-[#525f75] hover:text-white text-[#181c1f] text-xs font-bold transition-colors cursor-pointer"
                >
                  Compare Cabin Dimensions
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. TRUST, SAFETY & GLOBAL PARTNERS */}
      <section className="w-full px-6 lg:px-16 py-12 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center text-center">
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#cee5ff] flex items-center justify-center text-[#006097] mb-2">
                <span className="material-symbols-outlined text-[24px]">verified_user</span>
              </div>
              <span className="text-sm font-bold text-[#181c1f]">Verified Agency</span>
              <span className="text-xs text-slate-500">Authorized Travel Partner</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#d6e3fe] flex items-center justify-center text-[#525f75] mb-2">
                <span className="material-symbols-outlined text-[24px]">hub</span>
              </div>
              <span className="text-sm font-bold text-[#181c1f]">SkyTeam Alliance</span>
              <span className="text-xs text-slate-500">Reciprocal VIP Lounge Access</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#ffe088] flex items-center justify-center text-[#241a00] mb-2">
                <span className="material-symbols-outlined text-[24px]">workspace_premium</span>
              </div>
              <span className="text-sm font-bold text-[#181c1f]">ISO 9001:2020</span>
              <span className="text-xs text-slate-500">Aviation Quality Assurance</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#96cbff] flex items-center justify-center text-[#001d33] mb-2">
                <span className="material-symbols-outlined text-[24px]">headset_mic</span>
              </div>
              <span className="text-sm font-bold text-[#181c1f]">24/7 VIP Dispatch</span>
              <span className="text-xs text-slate-500">Dedicated Executive Travel Desk</span>
            </div>

          </div>
        </div>
      </section>

      {/* 6B. ESSENTIAL TRAVEL, PASSPORT & GOVERNMENT FACILITATION SERVICES */}
      <section className="w-full px-6 lg:px-16 py-14 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#006097] font-bold block mb-1">
                Comprehensive Travel Desk
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#181c1f] tracking-tight">
                Passport, Visas & Allied Travel Services
              </h2>
              <p className="text-xs text-slate-600 mt-1 max-w-xl">
                Authorized government portal assistance, consular apostille, worldwide visa filings, and door-to-door air cargo logistics.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('other-services')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-100 hover:bg-[#006097] hover:text-white text-slate-800 text-xs font-semibold transition-colors cursor-pointer shrink-0"
            >
              <span>Explore All Auxiliary Desks</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1: Passport Seva */}
            <div className="rounded-xl p-5 bg-[#fcfdfe] hover:bg-[#f5f8fc] border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[22px]">badge</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold uppercase tracking-wider">
                    Fast Track Seva
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#181c1f] group-hover:text-[#006097] transition-colors">
                  Passport Seva & Tatkaal Services
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Official PSK/POPSK online document filings, Tatkaal expedited appointment bookings, Police Clearance Certificate (PCC), Renewal, and ECNR stamping.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">100% Documentation Accuracy</span>
                <button
                  onClick={() => onNavigateTab('other-services', 'passport')}
                  className="text-xs font-bold text-[#006097] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Apply / Renew</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* Card 2: Visa Services */}
            <div className="rounded-xl p-5 bg-[#fcfdfe] hover:bg-[#f5f8fc] border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 text-[#006097] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[22px]">travel_explore</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#006097] border border-blue-200 text-[10px] font-bold uppercase tracking-wider">
                    99.2% Approval
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#181c1f] group-hover:text-[#006097] transition-colors">
                  Embassy & Tourist Visas
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Fast-track UAE (Dubai 30/60 days), Saudi Umrah e-visas, Schengen Business/Tourist, Singapore e-Visa, Malaysia, UK, and Thailand consular assistance.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">50+ Countries Supported</span>
                <button
                  onClick={() => onNavigateTab('visa')}
                  className="text-xs font-bold text-[#006097] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>View Visas</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* Card 3: Certificate Attestation */}
            <div className="rounded-xl p-5 bg-[#fcfdfe] hover:bg-[#f5f8fc] border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[22px]">verified</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                    MEA Apostille
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#181c1f] group-hover:text-[#006097] transition-colors">
                  Certificate & MEA Attestation
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  State HRD authentication, Ministry of External Affairs Apostille, and Gulf embassy legalizations (UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, Oman).
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">Degree, Birth & Commercial</span>
                <button
                  onClick={() => onNavigateTab('other-services', 'attestation')}
                  className="text-xs font-bold text-[#006097] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Get Stamping</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* Card 4: Air Freight & Cargo */}
            <div className="rounded-xl p-5 bg-[#fcfdfe] hover:bg-[#f5f8fc] border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-200 text-slate-800 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[22px]">package_2</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300 text-[10px] font-bold uppercase tracking-wider">
                    AWB Live Tracking
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#181c1f] group-hover:text-[#006097] transition-colors">
                  Air Cargo & Freight Logistics
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Direct airport-to-airport freight, unaccompanied excess baggage customs clearance, commercial parcels, and real-time live airway bill tracking.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">Daily Gulf & Global Flights</span>
                <button
                  onClick={() => onNavigateTab('cargo')}
                  className="text-xs font-bold text-[#006097] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Track / Book AWB</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* Card 5: Travel Medical Insurance */}
            <div className="rounded-xl p-5 bg-[#fcfdfe] hover:bg-[#f5f8fc] border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[22px]">health_and_safety</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200 text-[10px] font-bold uppercase tracking-wider">
                    Zero Deductible
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#181c1f] group-hover:text-[#006097] transition-colors">
                  Overseas Travel Medical Insurance
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Compliant Schengen €30,000 policies, emergency hospitalization, baggage loss, passport theft recovery, and flight cancellation reimbursements.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">Instant Policy Delivery</span>
                <button
                  onClick={() => onNavigateTab('other-services', 'insurance')}
                  className="text-xs font-bold text-[#006097] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Get Covered</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* Card 6: Forex & Hospitality */}
            <div className="rounded-xl p-5 bg-[#fcfdfe] hover:bg-[#f5f8fc] border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[22px]">currency_exchange</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-bold uppercase tracking-wider">
                    Best Bank Rates
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#181c1f] group-hover:text-[#006097] transition-colors">
                  Forex Exchange & VIP Hospitality
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Spot currency exchange (SAR, AED, USD, EUR), zero-markup multi-currency forex travel cards, plus VIP airport hotel bookings and executive transfers.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">Authorized RBI Network</span>
                <button
                  onClick={() => onNavigateTab('other-services', 'forex')}
                  className="text-xs font-bold text-[#006097] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Check Exchange Rates</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 7. WHOLESALE GROUP FARES DIRECT ACCESS */}
      <section className="w-full px-6 lg:px-16 py-12 bg-[#f7fafe]">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#006097] font-bold block">
                Consolidator Seat Allocations
              </span>
              <h3 className="text-2xl font-bold text-[#181c1f]">
                Wholesale Group Fares & Bulk PNRs
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('group-fares')}
              className="px-4 py-2 bg-[#006097] hover:bg-[#007abd] text-white text-xs font-semibold rounded transition-colors cursor-pointer"
            >
              View Full Group Inventory →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {INITIAL_GROUP_FARES.slice(0, 4).map((fare) => (
              <div 
                key={fare.id}
                className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow transition-shadow"
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1">
                  <span>{fare.airline}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-mono-data">
                    {fare.availableSeats} Seats Left
                  </span>
                </div>
                <div className="flex items-center gap-2 text-base font-bold text-slate-900 my-1">
                  <span>{fare.origin.code}</span>
                  <span className="text-[#006097]">→</span>
                  <span>{fare.destination.code}</span>
                </div>
                <div className="text-xs text-slate-500 font-mono-data mb-3">
                  Date: {fare.departureDate} • {fare.departureTime}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-base font-bold text-[#006097]">
                    ₹{fare.fareINR.toLocaleString('en-IN')}
                  </span>
                  <button
                    onClick={() => onOpenEnquiry('FLIGHT_TICKET', `${fare.origin.code} to ${fare.destination.code}`)}
                    className="px-3 py-1 bg-slate-100 hover:bg-[#006097] hover:text-white text-xs font-semibold rounded text-slate-700 transition-colors cursor-pointer"
                  >
                    Lock Seat
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 24: WHY CHOOSE MMS AIR TRAVELS */}
      <section className="w-full px-6 lg:px-16 py-14 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black text-[#006097] uppercase tracking-widest">
              OUR COMMITMENT
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Why Choose MMS AIR TRAVELS
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              5 pillars of excellence behind every booking and journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Pillar 1 */}
            <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 shadow-xs space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#006097] flex items-center justify-center font-black text-base">
                1
              </div>
              <h3 className="font-bold text-base text-slate-900">
                Trusted Travel Support
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Friendly and reliable guidance for every booking.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 shadow-xs space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#006097] flex items-center justify-center font-black text-base">
                2
              </div>
              <h3 className="font-bold text-base text-slate-900">
                Branch Accessibility
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Convenient physical branches for customers in Madukkur and Adirampattinam.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 shadow-xs space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#006097] flex items-center justify-center font-black text-base">
                3
              </div>
              <h3 className="font-bold text-base text-slate-900">
                Complete Travel Assistance
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Flight, bus, visa, and travel solutions under one roof.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 shadow-xs space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#006097] flex items-center justify-center font-black text-base">
                4
              </div>
              <h3 className="font-bold text-base text-slate-900">
                Customer-Focused Service
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clear information and personalized support.
              </p>
            </div>

            {/* Pillar 5 */}
            <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 shadow-xs space-y-2.5 md:col-span-2 lg:col-span-1">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-base">
                5
              </div>
              <h3 className="font-bold text-base text-slate-900">
                Proven Experience
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Serving customers since 2020 with 49K+ happy travelers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 18: FREQUENTLY ASKED QUESTIONS */}
      <section className="w-full px-6 lg:px-16 py-14 bg-[#f8fbff] border-t border-slate-200/80" id="faqs">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-black text-[#006097] uppercase tracking-widest">
              HELP & CLARIFICATIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Frequently Asked Questions (FAQ)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Clear answers to the most common questions from our travelers.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = expandedFaqIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs transition-all"
                >
                  <button
                    onClick={() => setExpandedFaqIndex(isOpen ? null : index)}
                    className="w-full p-5 text-left font-bold text-sm sm:text-base text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className="text-slate-400 shrink-0 text-xl font-bold">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 27: FINAL CALL TO ACTION */}
      <section className="w-full px-6 lg:px-16 py-16 bg-gradient-to-r from-[#082c74] via-[#006097] to-[#004f7c] text-white">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-amber-300 text-xs font-bold border border-white/20">
            <span>✈️</span>
            Your Trusted Travel Partner
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            Ready to Plan Your Next Journey?
          </h2>
          <p className="text-sm sm:text-base text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Let MMS AIR TRAVELS assist you with your flights, bus tickets, visa, and travel arrangements.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap pt-4">
            <button
              onClick={() => onOpenChat?.('general')}
              className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg transition-transform hover:scale-105 cursor-pointer flex items-center gap-2"
            >
              <Bot className="w-4 h-4" />
              <span>💬 Chat With Us</span>
            </button>
            <a
              href={CONTACT_NUMBERS.general.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-transform hover:scale-105 cursor-pointer flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>📱 WhatsApp Us</span>
            </a>
            <a
              href={`tel:${CONTACT_NUMBERS.general.number}`}
              className="px-6 py-3 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold text-xs uppercase tracking-wider border border-white/30 transition-all cursor-pointer flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>📞 Call Us: {CONTACT_NUMBERS.general.formatted}</span>
            </a>
            <a
              href="#our-locations"
              className="px-6 py-3 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs uppercase tracking-wider shadow-lg transition-transform hover:scale-105 cursor-pointer flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-[#006097]" />
              <span>📍 Visit Branch</span>
            </a>
          </div>
        </div>
      </section>

      {/* GEMINI AI ITINERARY RESULT MODAL */}
      {showItineraryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200 animate-fadeIn">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#006097] to-[#181c1f] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ffe088] text-[20px]">auto_awesome</span>
                <h3 className="text-lg font-bold">Curated Executive Itinerary</h3>
              </div>
              <button 
                onClick={() => setShowItineraryModal(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-slate-800 text-sm leading-relaxed">
              <div className="p-3 rounded-lg bg-[#cee5ff]/40 border border-[#96cbff] text-xs text-[#001d33] flex items-center justify-between">
                <span>Tailored for MMS VIP Executive Traveler</span>
                <span className="font-mono-data uppercase font-bold">{itinerarySource}</span>
              </div>

              <div className="prose prose-sm max-w-none whitespace-pre-wrap font-sans text-slate-700">
                {generatedItinerary}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-[#f1f4f8] px-6 py-3.5 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono-data">
                Ref: MMS-VIP-{Math.floor(100000 + Math.random() * 900000)}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowItineraryModal(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-xs font-semibold transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowItineraryModal(false);
                    onOpenEnquiry('FLIGHT_TICKET', 'Custom Bespoke Itinerary Request');
                  }}
                  className="px-5 py-2 bg-[#006097] hover:bg-[#007abd] text-white rounded text-xs font-bold transition-colors cursor-pointer shadow-sm"
                >
                  Book With Concierge Desk
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

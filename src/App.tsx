import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { FlightSearchEngine } from './components/FlightSearchEngine';
import { FlightResults } from './components/FlightResults';
import { BookingFlowModal } from './components/BookingFlowModal';
import { FlightInquiryModal } from './components/FlightInquiryModal';
import { AdminPortal } from './components/AdminPortal';
import { ItineraryManager } from './components/ItineraryManager';
import { CargoTracker } from './components/CargoTracker';
import { LiveFlightStatus } from './components/LiveFlightStatus';
import { VisaView } from './components/VisaView';
import { IndiaToursView } from './components/IndiaToursView';
import { InternationalToursView } from './components/InternationalToursView';
import { GroupToursView } from './components/GroupToursView';
import { OurGroupFaresView } from './components/OurGroupFaresView';
import { GroupFareInquiryModal } from './components/GroupFareInquiryModal';
import { OtherServicesView } from './components/OtherServicesView';
import { AboutUsView } from './components/AboutUsView';
import { ContactUsView } from './components/ContactUsView';
import { EnquiryModal } from './components/EnquiryModal';
import { TourPackageModal } from './components/TourPackageModal';
import { FlightBookingView } from './components/FlightBookingView';
import { StaffLogin } from './components/StaffLogin';
import { StaffPanel } from './components/StaffPanel';
import { Scene } from './components/Scene';
import { IntroOpeningScene } from './components/IntroOpeningScene';
import { PrivacyPolicyView } from './components/PrivacyPolicyView';
import { TermsConditionsView } from './components/TermsConditionsView';
import { FaqView } from './components/FaqView';
import { NotFoundView } from './components/NotFoundView';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { SocialShareModal } from './components/SocialShareModal';
import { MobileQuickBar } from './components/MobileQuickBar';
import { AuditChecklistView } from './components/AuditChecklistView';
import { MmsTravelAssistant } from './components/MmsTravelAssistant';
import { BusBookingModal } from './components/BusBookingModal';
import { trackPageView } from './utils/analytics';
import { LanguageCode } from './utils/translations';
import { insertBookingToSupabase, insertFlightInquiryToSupabase, isSupabaseConfigured } from './lib/supabase';

import { 
  Flight, 
  Booking, 
  CurrencyCode, 
  TripType, 
  CabinClass, 
  Airport,
  TourPackage,
  VisaService,
  EnquiryData,
  FlightInquiry,
  GlobalFareAdjustment,
  GroupFareItem
} from './types';
import { POPULAR_AIRPORTS } from './data/airports';
import { generateFlightsForRoute } from './data/mockFlights';
import { INITIAL_BOOKINGS, INITIAL_INQUIRIES } from './data/initialData';
import { ALL_TOUR_PACKAGES } from './data/toursData';
import { VISA_SERVICES } from './data/visaData';
import { INITIAL_GROUP_FARES } from './data/groupFaresData';
import { CONTACT_NUMBERS, LOCATIONS } from './data/contactInfo';
import { 
  ShieldCheck, 
  Headphones, 
  Plane, 
  Package, 
  Award, 
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Radio,
  Clock,
  Compass,
  Sliders,
  Share2
} from 'lucide-react';

export default function App() {
  // 9 requested sections + itinerary & flight radar
  const [activeTab, setActiveTab] = useState<string>('home');
  const [activeSubCategory, setActiveSubCategory] = useState<string | undefined>(undefined);
  const [currency, setCurrency] = useState<CurrencyCode>('INR');

  // Multi-language support: English (default), Tamil, Malayalam, Arabic, Hindi
  const [language, setLanguage] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('mms_app_language');
    if (saved && ['en', 'ta', 'ml', 'ar', 'hi'].includes(saved)) {
      return saved as LanguageCode;
    }
    return 'en';
  });

  // Single Domain Staff Portal routing (/staff or /staff/)
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  const [staffAuthUser, setStaffAuthUser] = useState<any | null>(null);
  const [staffAuthToken, setStaffAuthToken] = useState<string | null>(null);

  // Cinematic Opening Scene state - only active as the initial opening scene
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname.startsWith('/staff')) {
        return false;
      }
      return true;
    }
    return true;
  });

  const handleCloseIntro = (targetTab?: string) => {
    setShowIntro(false);
    if (targetTab) {
      handleNavigateTab(targetTab);
    }
  };

  useEffect(() => {
    // Validate existing staff session
    const checkStaffSession = async () => {
      const saved = localStorage.getItem('mms_staff_auth');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.token) {
            const res = await fetch('/api/auth/me', {
              headers: { 'Authorization': `Bearer ${parsed.token}` }
            });
            if (res.ok) {
              const user = await res.json();
              setStaffAuthUser(user);
              setStaffAuthToken(parsed.token);
            } else {
              localStorage.removeItem('mms_staff_auth');
              setStaffAuthUser(null);
              setStaffAuthToken(null);
            }
          }
        } catch (e) {
          localStorage.removeItem('mms_staff_auth');
        }
      }
    };

    checkStaffSession();

    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState(null, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStaffLoginSuccess = (user: any, token: string) => {
    setStaffAuthUser(user);
    setStaffAuthToken(token);
    navigateTo('/staff/');
  };

  const handleStaffLogout = async () => {
    try {
      if (staffAuthToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${staffAuthToken}` }
        });
      }
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem('mms_staff_auth');
    setStaffAuthUser(null);
    setStaffAuthToken(null);
    navigateTo('/staff/login/');
  };

  useEffect(() => {
    localStorage.setItem('mms_app_language', language);
  }, [language]);

  // Bookings with local persistence
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('mms_skyair_bookings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse local bookings', e);
      }
    }
    return INITIAL_BOOKINGS;
  });

  useEffect(() => {
    localStorage.setItem('mms_skyair_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Global Fare Adjustment ("Change or modify fare for all")
  const [globalAdjustment, setGlobalAdjustment] = useState<GlobalFareAdjustment>(() => {
    const saved = localStorage.getItem('mms_global_fare_adj');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse global adjustment', e);
      }
    }
    return { percentage: 0, fixedUSD: 0 };
  });

  useEffect(() => {
    localStorage.setItem('mms_global_fare_adj', JSON.stringify(globalAdjustment));
  }, [globalAdjustment]);

  // Customer Inquiries CRM
  const [inquiries, setInquiries] = useState<FlightInquiry[]>(() => {
    const saved = localStorage.getItem('mms_flight_inquiries');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          if (parsed.length >= 20) {
            return parsed;
          }
          // If fewer than 20 saved (e.g. from previous session), merge with initial 20 records
          const existingIds = new Set(parsed.map((p: any) => p.id || p.token));
          const merged = [...parsed];
          for (const item of INITIAL_INQUIRIES) {
            if (!existingIds.has(item.id) && !existingIds.has(item.token)) {
              merged.push(item);
            }
          }
          return merged;
        }
      } catch (e) {
        console.error('Failed to parse inquiries', e);
      }
    }
    return INITIAL_INQUIRIES;
  });

  useEffect(() => {
    localStorage.setItem('mms_flight_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  // Dynamic Tour Packages catalog (editable by Admin)
  const [tourPackagesList, setTourPackagesList] = useState<TourPackage[]>(() => {
    const saved = localStorage.getItem('mms_tour_packages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse tours', e);
      }
    }
    return ALL_TOUR_PACKAGES;
  });

  useEffect(() => {
    localStorage.setItem('mms_tour_packages', JSON.stringify(tourPackagesList));
  }, [tourPackagesList]);

  // Dynamic Visa Services catalog (editable by Admin)
  const [visaServicesList, setVisaServicesList] = useState<VisaService[]>(() => {
    const saved = localStorage.getItem('mms_visa_services');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse visas', e);
      }
    }
    return VISA_SERVICES;
  });

  useEffect(() => {
    localStorage.setItem('mms_visa_services', JSON.stringify(visaServicesList));
  }, [visaServicesList]);

  // Group Fares catalog with local persistence (editable in Admin)
  const [groupFaresList, setGroupFaresList] = useState<GroupFareItem[]>(() => {
    const saved = localStorage.getItem('mms_group_fares');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse group fares', e);
      }
    }
    return INITIAL_GROUP_FARES;
  });

  useEffect(() => {
    localStorage.setItem('mms_group_fares', JSON.stringify(groupFaresList));
  }, [groupFaresList]);

  // Group Fare Inquiry Modal state
  const [groupInquiryModal, setGroupInquiryModal] = useState<{
    isOpen: boolean;
    groupFare: GroupFareItem | null;
  }>({
    isOpen: false,
    groupFare: null
  });

  // Flight search states
  const [searchResults, setSearchResults] = useState<Flight[]>(() => {
    return generateFlightsForRoute('MAA', 'DXB', '2026-09-10', 'economy', globalAdjustment);
  });
  const [isSearching, setIsSearching] = useState(false);
  const [flightSubTab, setFlightSubTab] = useState<'search' | 'radar'>('search');
  const [currentSearchParams, setCurrentSearchParams] = useState<{
    origin: Airport;
    destination: Airport;
    departureDate: string;
    passengers: { adults: number; children: number; infants: number };
    cabinClass: CabinClass;
  }>({
    origin: POPULAR_AIRPORTS[6], // Chennai MAA
    destination: POPULAR_AIRPORTS[0], // Dubai DXB
    departureDate: '2026-09-10',
    passengers: { adults: 1, children: 0, infants: 0 },
    cabinClass: 'economy'
  });

  // Admin Portal state
  const [adminPortalOpen, setAdminPortalOpen] = useState(false);

  // Flight Inquiry Modal state (Replacing dummy booking flow)
  const [inquiryModalFlight, setInquiryModalFlight] = useState<{
    flight: Flight;
    fareTier: 'saver' | 'standard' | 'flexi';
  } | null>(null);

  // Enquiry modal state
  const [enquiryModal, setEnquiryModal] = useState<{
    isOpen: boolean;
    serviceType: 'Flight' | 'Visa' | 'Package' | 'Cargo' | 'Miscellaneous';
    destinationPreset?: string;
  }>({
    isOpen: false,
    serviceType: 'Flight'
  });

  // Tour detail modal state
  const [selectedTourPackage, setSelectedTourPackage] = useState<TourPackage | null>(null);

  // AI Chat Assistant & Bus Booking Modal States
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatInitialCategory, setChatInitialCategory] = useState<string | undefined>(undefined);
  const [isBusModalOpen, setIsBusModalOpen] = useState<boolean>(false);

  const handleOpenChat = (category?: string) => {
    setChatInitialCategory(category);
    setIsChatOpen(true);
  };

  // Private Admin Portal Access: Ctrl+Shift+A, URL Hash #mms-admin, or 3 clicks on footer seal
  const [footerSecretClicks, setFooterSecretClicks] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Non-conflicting shortcuts for staff operations:
      // Alt + S (Never intercepted by screen capture / web snip!)
      if (e.altKey && !e.ctrlKey && !e.metaKey && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
        navigateTo('/staff/');
        return;
      }

      // Ctrl + Alt + S
      if ((e.ctrlKey || e.metaKey) && e.altKey && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
        navigateTo('/staff/');
        return;
      }

      // Ctrl + Shift + M (M for MMS)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'M' || e.key === 'm')) {
        e.preventDefault();
        navigateTo('/staff/');
        return;
      }

      // Fallback: Ctrl + Shift + S or Ctrl + Shift + A
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'S' || e.key === 's' || e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        navigateTo('/staff/');
        return;
      }
    };

    const handleHashCheck = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (
        hash === 'staff' ||
        hash === 'staff-portal' ||
        hash === 'mms-admin' ||
        hash === 'admin'
      ) {
        navigateTo('/staff/');
        return;
      }
      if (hash === 'privacy-policy' || hash === 'privacy') {
        setActiveTab('privacy-policy');
        return;
      }
      if (hash === 'terms' || hash === 'terms-conditions') {
        setActiveTab('terms');
        return;
      }
      if (hash === 'faq' || hash === 'help') {
        setActiveTab('faq');
        return;
      }
      if (hash === 'passport') {
        setActiveTab('other-services');
        setActiveSubCategory('passport');
        return;
      }
      if (hash === 'visa') {
        setActiveTab('visa');
        return;
      }
      if (hash === 'cargo') {
        setActiveTab('cargo');
        return;
      }
      if (hash === 'flight-ticket' || hash === 'flights') {
        setActiveTab('flight-ticket');
        return;
      }
      if (hash === 'group-fares') {
        setActiveTab('group-fares');
        return;
      }
      if (hash === 'tracking' || hash === 'checkin') {
        setActiveTab('tracking');
        return;
      }
      if (hash === 'audit' || hash === 'standards') {
        setAuditModalOpen(true);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', handleHashCheck);
    handleHashCheck();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', handleHashCheck);
    };
  }, []);

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [auditModalOpen, setAuditModalOpen] = useState(false);

  const handleSecretFooterClick = () => {
    const next = footerSecretClicks + 1;
    if (next >= 3) {
      navigateTo('/staff/');
      setFooterSecretClicks(0);
    } else {
      setFooterSecretClicks(next);
      setTimeout(() => setFooterSecretClicks(0), 1800);
    }
  };

  const handleNavigateTab = (tab: string, subCategory?: string) => {
    setActiveTab(tab);
    setActiveSubCategory(subCategory);
    trackPageView(tab);

    const titles: Record<string, string> = {
      'home': 'MMS Air Travels & Cargo Service | Luxury Aviation & Travel Concierge',
      'flight-ticket': 'Book Flights & Executive Charters | MMS Air Travels',
      'visa': 'Global Tourist & Business Visas | MMS Air Travels',
      'india-tours': 'India Domestic Holiday Packages | MMS Air Travels',
      'international-tours': 'International Holidays & Luxury Escapes | MMS Air Travels',
      'group-tours': 'Group Tours & Corporate Delegations | MMS Air Travels',
      'group-fares': 'Wholesale Group Fares & Bulk PNRs | MMS Air Travels',
      'other-services': subCategory === 'passport' ? 'Passport Seva & Tatkaal Expedited | MMS Air Travels' : 'Allied Travel & Government Desks | MMS Air Travels',
      'cargo': 'Air Cargo Freight & AWB Live Tracking | MMS Air Travels',
      'itinerary': 'Manage Booking & Itinerary | MMS Air Travels',
      'about-us': 'About Us & Certified Agency Profile | MMS Air Travels',
      'contact-us': 'Contact Us & 24/7 Travel Desk | MMS Air Travels',
      'faq': 'Frequently Asked Questions (FAQ) | MMS Air Travels',
      'privacy-policy': 'Privacy Policy & Data Protection | MMS Air Travels',
      'terms': 'Terms & Conditions of Carriage | MMS Air Travels',
      'tracking': 'Web Check-in & Flight Status | MMS Air Travels'
    };
    if (titles[tab]) {
      document.title = titles[tab];
    }

    if (tab !== 'home') {
      window.history.replaceState(null, '', `#${subCategory === 'passport' ? 'passport' : tab}`);
    } else {
      window.history.replaceState(null, '', window.location.pathname);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenEnquiry = (serviceType: any = 'Flight', destPreset?: string) => {
    setEnquiryModal({
      isOpen: true,
      serviceType: serviceType || 'Flight',
      destinationPreset: destPreset
    });
  };

  const handleSearchFlights = (params: {
    tripType: TripType;
    origin: Airport;
    destination: Airport;
    departureDate: string;
    returnDate?: string;
    passengers: { adults: number; children: number; infants: number };
    cabinClass: CabinClass;
  }) => {
    setIsSearching(true);
    setCurrentSearchParams({
      origin: params.origin,
      destination: params.destination,
      departureDate: params.departureDate,
      passengers: params.passengers,
      cabinClass: params.cabinClass
    });

    setTimeout(() => {
      const generated = generateFlightsForRoute(
        params.origin.code,
        params.destination.code,
        params.departureDate,
        params.cabinClass,
        globalAdjustment
      );
      setSearchResults(generated);
      setIsSearching(false);
    }, 500);
  };

  const handleSelectFlight = (flight: Flight, fareTier: 'saver' | 'standard' | 'flexi') => {
    setInquiryModalFlight({ flight, fareTier });
  };

  const handleCompleteInquiry = (inquiry: FlightInquiry) => {
    setInquiries(prev => [inquiry, ...prev]);
    if (isSupabaseConfigured()) {
      insertFlightInquiryToSupabase(inquiry).catch(err => console.warn('[Supabase Sync]', err));
    }
  };

  const handleCompleteBooking = (newBooking: Booking) => {
    setBookings(prev => [newBooking, ...prev]);
    if (isSupabaseConfigured()) {
      insertBookingToSupabase(newBooking).catch(err => console.warn('[Supabase Sync]', err));
    }
  };

  const handleUpdateBooking = (updated: Booking) => {
    setBookings(prev => prev.map(b => b.id === updated.id ? updated : b));
    if (isSupabaseConfigured()) {
      insertBookingToSupabase(updated).catch(err => console.warn('[Supabase Sync]', err));
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings(prev => {
      const updatedList = prev.map(b => {
        if (b.id === bookingId) {
          const cancelled: Booking = { ...b, bookingStatus: 'CANCELLED', paymentStatus: 'REFUNDED' };
          if (isSupabaseConfigured()) {
            insertBookingToSupabase(cancelled).catch(err => console.warn('[Supabase Sync]', err));
          }
          return cancelled;
        }
        return b;
      });
      return updatedList;
    });
  };

  const handleDeleteBooking = (bookingId: string) => {
    setBookings(prev => prev.filter(b => b.id !== bookingId));
  };

  const handleTourPackageBookNow = (pkg: TourPackage) => {
    setSelectedTourPackage(null);
    handleOpenEnquiry('Package', pkg.title);
  };

  // --- SINGLE DOMAIN STAFF PORTAL ROUTING (/staff or /staff/) ---
  if (currentPath.startsWith('/staff')) {
    if (staffAuthUser && staffAuthToken) {
      return (
        <StaffPanel
          currentUser={staffAuthUser}
          token={staffAuthToken}
          onLogout={handleStaffLogout}
          onReturnHome={() => navigateTo('/')}
        />
      );
    } else {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
          <header className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateTo('/')}>
              <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-amber-400 text-xs">
                MMS
              </span>
              <span className="font-extrabold text-white text-sm">MMS AIR TRAVELS • ENTERPRISE STAFF GATEWAY</span>
            </div>
            <button
              onClick={() => navigateTo('/')}
              className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
            >
              ← Public Customer Website
            </button>
          </header>
          <div className="flex-1 flex items-center justify-center">
            <StaffLogin
              onLoginSuccess={handleStaffLoginSuccess}
              onReturnHome={() => navigateTo('/')}
            />
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/75 text-slate-900 font-sans">
      
      {/* 0. Cinematic Opening Scene Overlay */}
      {showIntro && (
        <IntroOpeningScene
          onComplete={handleCloseIntro}
          onOpenWhatsApp={() => window.open('https://wa.me/919443152244?text=Hello%20MMS%20Air%20Travels,%20I%20am%20visiting%20your%20website%20and%20need%20assistance.', '_blank')}
        />
      )}

      {/* 1. Header & Navigation matching Sky Air Travels 9-section structure */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={handleNavigateTab}
        currency={currency}
        onSelectCurrency={setCurrency}
        language={language}
        onSelectLanguage={setLanguage}
        bookingCount={bookings.length}
        onOpenEnquiry={handleOpenEnquiry}
        onOpenAdmin={() => setAdminPortalOpen(true)}
        onOpenStaffPortal={() => navigateTo('/staff/')}
      />

      {/* 2. Brand Trust Strip */}
      <div className="bg-slate-900 text-white py-2.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-extrabold text-amber-400">MMS AIR TRAVELS & CARGO SERVICE</span>
            <span className="text-slate-500">•</span>
            <span className="bg-blue-950/80 text-sky-200 border border-blue-700/60 px-2 py-0.5 rounded text-[11px] font-bold">
              Branches: Adirampattinam • Madukkur
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Direct Airline GDS Ticketing Desk
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <a href={CONTACT_NUMBERS.general.tel} className="flex items-center gap-1 hover:text-amber-400">
              <Phone className="w-3.5 h-3.5 text-amber-400" /> General: +91 {CONTACT_NUMBERS.general.formatted}
            </a>
            <a href={CONTACT_NUMBERS.ticket.tel} className="flex items-center gap-1 hover:text-amber-400">
              <Phone className="w-3.5 h-3.5 text-amber-400" /> Tickets: +91 {CONTACT_NUMBERS.ticket.formatted}
            </a>
            <a href="mailto:mmsairtravels@gmail.com" className="flex items-center gap-1 hover:text-amber-400">
              <Mail className="w-3.5 h-3.5 text-sky-400" /> mmsairtravels@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* Accessibility Skip Link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#006097] focus:text-white focus:font-bold focus:rounded-lg focus:shadow-xl focus:outline-none"
      >
        Skip to main content
      </a>

      {/* 3. Main Container Body */}
      <main id="main-content" tabIndex={-1} className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-6 sm:py-8 focus:outline-none">
        
        {/* SECTION 1: HOME */}
        {activeTab === 'home' && (
          <HomeView
            currency={currency}
            onNavigateTab={handleNavigateTab}
            onSelectPackage={(pkg) => setSelectedTourPackage(pkg)}
            onOpenEnquiry={handleOpenEnquiry}
            onOpenChat={handleOpenChat}
            onOpenBusModal={() => setIsBusModalOpen(true)}
          />
        )}

        {/* SECTION 1B: KAGE THREEUI LANDING PAGE */}
        {activeTab === 'landing' && (
          <div className="space-y-4">
            <div className="bg-[#0b192c] text-white p-4 border border-[#1e3e62] flex flex-wrap items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-[#e0231c] animate-pulse" />
                <div>
                  <h2 className="font-display text-lg text-white">
                    Kage — Where stillness reveals the unseen
                  </h2>
                  <p className="text-xs text-slate-300 font-mono-data">
                    ThreeUI Interactive Document • Kyoto Mountain Temple • Live WebGL Shader Runtime
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavigateTab('home')}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-mono-data text-white border border-slate-700 cursor-pointer transition-colors"
                >
                  ← Return to Agency Portal
                </button>
                <a
                  href="/landing-pages/kage.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-[#e0231c] hover:bg-[#b51c16] text-xs font-mono-data text-white font-bold cursor-pointer transition-colors"
                >
                  Open Dedicated Fullscreen ↗
                </a>
              </div>
            </div>
            <div className="w-full shadow-2xl border border-slate-800 rounded-lg overflow-hidden bg-black" style={{ minHeight: '85vh', height: '85vh' }}>
              <Scene />
            </div>
          </div>
        )}

        {/* SECTION 2: FLIGHT TICKETS (Enquiry Booking Form - No mock flights shown) */}
        {activeTab === 'flight-ticket' && (
          <FlightBookingView
            language={language}
            onInquirySubmitted={(inquiry) => {
              setInquiries(prev => [inquiry, ...prev]);
            }}
          />
        )}

        {/* SECTION 3: VISA SERVICES */}
        {activeTab === 'visa' && (
          <VisaView
            currency={currency}
            visas={visaServicesList}
            onOpenEnquiry={handleOpenEnquiry}
          />
        )}

        {/* SECTION 4: INDIA TOURS */}
        {activeTab === 'india-tours' && (
          <IndiaToursView
            currency={currency}
            packages={tourPackagesList}
            selectedStateFilter={activeSubCategory}
            onSelectPackage={(pkg) => setSelectedTourPackage(pkg)}
            onOpenEnquiry={handleOpenEnquiry}
          />
        )}

        {/* SECTION 5: INTERNATIONAL TOURS */}
        {activeTab === 'international-tours' && (
          <InternationalToursView
            currency={currency}
            packages={tourPackagesList}
            selectedCountryFilter={activeSubCategory}
            onSelectPackage={(pkg) => setSelectedTourPackage(pkg)}
            onOpenEnquiry={handleOpenEnquiry}
          />
        )}

        {/* SECTION 6: GROUP TOURS */}
        {activeTab === 'group-tours' && (
          <GroupToursView
            currency={currency}
            packages={tourPackagesList}
            onSelectPackage={(pkg) => setSelectedTourPackage(pkg)}
            onOpenEnquiry={handleOpenEnquiry}
          />
        )}

        {/* OUR GROUP FARES (Special Wholesale Block Fares) */}
        {activeTab === 'group-fares' && (
          <OurGroupFaresView
            currency={currency}
            groupFares={groupFaresList}
            onSelectGroupFare={(fare) => {
              setGroupInquiryModal({ isOpen: true, groupFare: fare });
            }}
            onOpenCustomGroupInquiry={() => {
              setGroupInquiryModal({ isOpen: true, groupFare: null });
            }}
          />
        )}

        {/* SECTION 7: OTHER SERVICES (Passport, Attestation, Cargo AWB Tracker) */}
        {activeTab === 'other-services' && (
          <OtherServicesView
            currency={currency}
            initialSubTab={activeSubCategory}
            onOpenEnquiry={handleOpenEnquiry}
          />
        )}

        {/* SECTION 8: ABOUT US */}
        {activeTab === 'about-us' && (
          <AboutUsView
            onNavigateTab={handleNavigateTab}
            onOpenEnquiry={handleOpenEnquiry}
          />
        )}

        {/* SECTION 9: CONTACT US */}
        {activeTab === 'contact-us' && (
          <ContactUsView onInquiryCreated={handleCompleteInquiry} />
        )}

        {/* ITINERARY & PNR MANAGEMENT */}
        {activeTab === 'itinerary' && (
          <ItineraryManager
            bookings={bookings}
            currency={currency}
            onUpdateBooking={handleUpdateBooking}
            onCancelBooking={handleCancelBooking}
          />
        )}

        {/* DIRECT CARGO TAB */}
        {activeTab === 'cargo' && (
          <CargoTracker currency={currency} />
        )}

        {/* WEB CHECK-IN & RADAR TRACKING */}
        {activeTab === 'tracking' && (
          <LiveFlightStatus />
        )}

        {/* PRIVACY POLICY (GDPR & Indian DPDP Compliant) */}
        {activeTab === 'privacy-policy' && (
          <PrivacyPolicyView onBack={() => handleNavigateTab('home')} />
        )}

        {/* TERMS OF SERVICE & CARRIAGE CONTRACT */}
        {activeTab === 'terms' && (
          <TermsConditionsView onBack={() => handleNavigateTab('home')} />
        )}

        {/* FREQUENTLY ASKED QUESTIONS */}
        {activeTab === 'faq' && (
          <FaqView 
            onBack={() => handleNavigateTab('home')} 
            onOpenEnquiry={handleOpenEnquiry}
          />
        )}

        {/* 404 NOT FOUND FALLBACK */}
        {!['home', 'landing', 'flight-ticket', 'visa', 'india-tours', 'international-tours', 'group-tours', 'group-fares', 'other-services', 'about-us', 'contact-us', 'itinerary', 'cargo', 'tracking', 'privacy-policy', 'terms', 'faq'].includes(activeTab) && (
          <NotFoundView onNavigate={handleNavigateTab} />
        )}

      </main>

      {/* Flight Inquiry Flow Modal (Direct Human Travel Desk Guarantee) */}
      {inquiryModalFlight && (
        <FlightInquiryModal
          flight={inquiryModalFlight.flight}
          fareTier={inquiryModalFlight.fareTier}
          passengerCount={currentSearchParams.passengers}
          currency={currency}
          onClose={() => setInquiryModalFlight(null)}
          onSubmitInquiry={handleCompleteInquiry}
        />
      )}

      {/* Group Fare Inquiry Flow Modal (Direct Human Wholesaler Travel Desk) */}
      {groupInquiryModal.isOpen && (
        <GroupFareInquiryModal
          groupFare={groupInquiryModal.groupFare}
          currency={currency}
          onClose={() => setGroupInquiryModal({ isOpen: false, groupFare: null })}
          onSubmitInquiry={handleCompleteInquiry}
        />
      )}

      {/* Separate Agency Admin Portal ("Change/Modify fare, add option for all, CRM") */}
      {adminPortalOpen && (
        <AdminPortal
          flights={searchResults}
          onUpdateFlights={(updated) => {
            setSearchResults(updated);
          }}
          groupFares={groupFaresList}
          onUpdateGroupFares={setGroupFaresList}
          tourPackages={tourPackagesList}
          onUpdateTourPackages={setTourPackagesList}
          visaServices={visaServicesList}
          onUpdateVisaServices={setVisaServicesList}
          inquiries={inquiries}
          onUpdateInquiries={setInquiries}
          globalAdjustment={globalAdjustment}
          onUpdateGlobalAdjustment={(adj) => {
            setGlobalAdjustment(adj);
            const recomputed = generateFlightsForRoute(
              currentSearchParams.origin.code,
              currentSearchParams.destination.code,
              currentSearchParams.departureDate,
              currentSearchParams.cabinClass,
              adj
            );
            setSearchResults(recomputed);
          }}
          currency={currency}
          onClose={() => setAdminPortalOpen(false)}
          bookings={bookings}
          onUpdateBooking={handleUpdateBooking}
          onDeleteBooking={handleDeleteBooking}
        />
      )}

      {/* Tour Package Day-Wise Itinerary Modal */}
      {selectedTourPackage && (
        <TourPackageModal
          pkg={selectedTourPackage}
          currency={currency}
          onClose={() => setSelectedTourPackage(null)}
          onBookNow={handleTourPackageBookNow}
        />
      )}

      {/* Universal Enquiry Modal */}
      <EnquiryModal
        isOpen={enquiryModal.isOpen}
        defaultService={enquiryModal.serviceType}
        defaultDestination={enquiryModal.destinationPreset}
        onClose={() => setEnquiryModal(prev => ({ ...prev, isOpen: false }))}
        onSubmitInquiryRecord={(newRecord: FlightInquiry) => {
          setInquiries(prev => [newRecord, ...prev]);
        }}
        onSubmitEnquiry={(data: EnquiryData) => {
          console.log('Enquiry logged:', data);
        }}
      />

      {/* 4. Luxury Global Aviation Footer */}
      <footer className="w-full bg-[#181c1f] text-[#eef1f5] pt-12 pb-24 md:pb-8 border-t border-slate-800 text-xs">
        <div className="w-full px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12">
            
            {/* Col 1 & 2: Brand & Global Ops */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <img 
                  alt="MMS Air Travels Official Seal" 
                  className="h-10 w-10 object-contain rounded-full bg-white p-0.5" 
                  src="/mms_logo.svg"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.onerror = null;
                    target.src = '/mms_logo.jpg';
                  }}
                />
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-white tracking-tight leading-none">
                    MMS AIR TRAVELS
                  </span>
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest mt-1">
                    Adirampattinam • Madukkur
                  </span>
                </div>
              </div>

              <p className="text-sm text-slate-300 max-w-md leading-relaxed">
                Licensed air travel agent and cargo carrier. Direct airline ticketing, worldwide visas, Haj & Umrah guidance, and door-to-door international freight.
              </p>

              {/* Branch Addresses in Footer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-[11px] text-slate-300">
                <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl space-y-1">
                  <div className="font-bold text-amber-300 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      Adirampattinam Branch (HQ)
                    </span>
                    <a
                      href={LOCATIONS.adirampattinam.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-amber-400 hover:text-amber-300 hover:underline inline-flex items-center gap-0.5 font-sans font-semibold"
                    >
                      Map ↗
                    </a>
                  </div>
                  <div className="text-slate-400">{LOCATIONS.adirampattinam.address}</div>
                  <div className="text-sky-300 font-mono font-bold space-y-0.5">
                    <div>General: +91 95005 67442 • Visa/Tkt: +91 93845 67442</div>
                    <div>Other Services: +91 63690 12360</div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl space-y-1">
                  <div className="font-bold text-emerald-300 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      Madukkur Branch
                    </span>
                    <a
                      href={LOCATIONS.madukkur.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-emerald-400 hover:text-emerald-300 hover:underline inline-flex items-center gap-0.5 font-sans font-semibold"
                    >
                      Map ↗
                    </a>
                  </div>
                  <div className="text-slate-400">{LOCATIONS.madukkur.address}</div>
                  <div className="text-sky-300 font-mono font-bold space-y-0.5">
                    <div>General: +91 95005 67442 • Tickets: +91 95009 77442</div>
                    <div>Other Services: +91 63690 12360</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1 flex-wrap">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded text-slate-300 text-xs">
                  <span className="material-symbols-outlined text-[#ffe088] text-[18px]">shield</span>
                  <span>Govt Registered & Verified Travel Agency</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded text-slate-300 text-xs">
                  <span className="material-symbols-outlined text-[#96cbff] text-[18px]">flight_takeoff</span>
                  <span>Direct Airline GDS Desk</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-400 space-y-1">
                <div>Direct Numbers: General: <a href={CONTACT_NUMBERS.general.tel} className="text-amber-400 font-bold hover:underline">+91 {CONTACT_NUMBERS.general.formatted}</a> • Tickets: <a href={CONTACT_NUMBERS.ticket.tel} className="text-amber-400 font-bold hover:underline">+91 {CONTACT_NUMBERS.ticket.formatted}</a> • Visa/Tours: <a href={CONTACT_NUMBERS.services.tel} className="text-emerald-400 font-bold hover:underline">+91 {CONTACT_NUMBERS.services.formatted}</a></div>
                <div>Desk Email: <a href="mailto:mmsairtravels@gmail.com" className="text-slate-300 hover:underline">mmsairtravels@gmail.com</a></div>
              </div>
            </div>

            {/* Col 3: Flight Operations */}
            <div className="flex flex-col gap-3">
              <span className="text-sm font-bold text-white tracking-wide">
                Flight Operations
              </span>
              <ul className="flex flex-col gap-1 sm:gap-2 text-slate-300">
                <li><button onClick={() => handleNavigateTab('flight-ticket')} className="py-1 min-h-[40px] sm:min-h-0 flex items-center hover:text-white transition-colors cursor-pointer text-left">Route Map & Destinations</button></li>
                <li><button onClick={() => handleNavigateTab('tracking')} className="py-1 min-h-[40px] sm:min-h-0 flex items-center hover:text-white transition-colors cursor-pointer text-left">Flight Status & Delays</button></li>
                <li><button onClick={() => handleNavigateTab('flight-ticket')} className="py-1 min-h-[40px] sm:min-h-0 flex items-center hover:text-white transition-colors cursor-pointer text-left">Baggage Allowance & Fees</button></li>
                <li><a href="#cabin-suites" className="py-1 min-h-[40px] sm:min-h-0 flex items-center hover:text-white transition-colors cursor-pointer text-left">Cabin Classes & Fleet</a></li>
                <li><button onClick={() => handleNavigateTab('other-services')} className="py-1 min-h-[40px] sm:min-h-0 flex items-center hover:text-white transition-colors cursor-pointer text-left">Airport Executive Lounges</button></li>
              </ul>
            </div>

            {/* Col 4: Corporate & VIP */}
            <div className="flex flex-col gap-3">
              <span className="text-sm font-bold text-white tracking-wide">
                Corporate & VIP
              </span>
              <ul className="flex flex-col gap-1 sm:gap-2 text-slate-300">
                <li><button onClick={() => handleNavigateTab('group-fares')} className="py-1 min-h-[40px] sm:min-h-0 flex items-center hover:text-white transition-colors cursor-pointer text-left">Private Jet Chartering</button></li>
                <li><button onClick={() => handleNavigateTab('other-services')} className="py-1 min-h-[40px] sm:min-h-0 flex items-center hover:text-white transition-colors cursor-pointer text-left">Corporate Travel Desk</button></li>
                <li><button onClick={() => handleNavigateTab('cargo')} className="py-1 min-h-[40px] sm:min-h-0 flex items-center hover:text-white transition-colors cursor-pointer text-left">Air Cargo Freight & AWB</button></li>
                <li><button onClick={() => handleNavigateTab('visa')} className="py-1 min-h-[40px] sm:min-h-0 flex items-center hover:text-white transition-colors cursor-pointer text-left">Embassy Visa Assistance</button></li>
                <li><button onClick={() => handleNavigateTab('staff-login')} className="py-1 min-h-[40px] sm:min-h-0 flex items-center hover:text-amber-400 transition-colors cursor-pointer text-left">Staff & GDS Access</button></li>
              </ul>
            </div>

            {/* Col 5: Join The Flight Club */}
            <div className="flex flex-col gap-3">
              <span className="text-sm font-bold text-white tracking-wide">
                Join The Flight Club
              </span>
              <p className="text-xs text-slate-300">
                Receive exclusive fare drops, charter empty-leg notifications, and luxury destination insights.
              </p>
              <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing to MMS Flight Club VIP Updates!'); }} className="flex flex-col gap-2">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white/10 rounded-lg p-1 border border-white/20 gap-1.5 sm:gap-0">
                  <input 
                    type="email" 
                    placeholder="Enter executive email..." 
                    className="bg-transparent text-xs px-2.5 py-2 sm:py-0 text-white placeholder-slate-400 focus:outline-none w-full"
                    required
                  />
                  <button 
                    type="submit" 
                    className="bg-[#006097] hover:bg-[#007abd] text-white text-xs font-semibold px-3 py-2 sm:py-1.5 rounded transition-colors shrink-0 cursor-pointer min-h-[40px] sm:min-h-0"
                  >
                    Subscribe
                  </button>
                </div>
                <span className="text-[10px] text-slate-400">Direct concierge updates • Unsubscribe at any time</span>
              </form>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-slate-400">
            <div className="flex items-center gap-x-3 gap-y-2 flex-wrap leading-relaxed">
              <span>© 2026 MMS Air Travels Inc. All rights reserved.</span>
              <span>•</span>
              <button 
                onClick={() => handleNavigateTab('privacy-policy')}
                className="hover:text-white cursor-pointer bg-transparent border-none p-0 text-[11px] text-slate-400 underline-offset-2 hover:underline min-h-[36px] sm:min-h-0 inline-flex items-center"
              >
                Privacy Policy
              </button>
              <span>•</span>
              <button 
                onClick={() => handleNavigateTab('terms')}
                className="hover:text-white cursor-pointer bg-transparent border-none p-0 text-[11px] text-slate-400 underline-offset-2 hover:underline min-h-[36px] sm:min-h-0 inline-flex items-center"
              >
                Terms & Conditions of Carriage
              </button>
              <span>•</span>
              <button 
                onClick={() => handleNavigateTab('faq')}
                className="hover:text-white cursor-pointer bg-transparent border-none p-0 text-[11px] text-slate-400 underline-offset-2 hover:underline min-h-[36px] sm:min-h-0 inline-flex items-center"
              >
                FAQ
              </button>
              <span>•</span>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('open-cookie-settings'))}
                className="hover:text-white cursor-pointer bg-transparent border-none p-0 text-[11px] text-slate-400 underline-offset-2 hover:underline min-h-[36px] sm:min-h-0 inline-flex items-center"
              >
                Cookie Preferences
              </button>
              <span>•</span>
              <button 
                onClick={() => setShareModalOpen(true)}
                className="hover:text-amber-400 cursor-pointer bg-transparent border-none p-0 text-[11px] text-slate-300 inline-flex items-center gap-1 font-semibold min-h-[36px] sm:min-h-0"
              >
                <Share2 className="w-3 h-3" />
                <span>Share Agency</span>
              </button>
              <span>•</span>
              <button 
                onClick={() => setAuditModalOpen(true)}
                className="hover:text-emerald-400 cursor-pointer bg-transparent border-none p-0 text-[11px] text-emerald-400 font-bold inline-flex items-center gap-1 min-h-[36px] sm:min-h-0"
                title="Review all 20 production standards"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>20-Point Launch Audit (20/20)</span>
              </button>
              
              <button
                type="button"
                onClick={handleSecretFooterClick}
                className="inline-block w-1.5 h-1.5 rounded-full bg-slate-800 hover:bg-slate-700 ml-1 transition-colors cursor-default"
                title="System Security Node"
                aria-label="System Node"
              />
            </div>

            <div className="flex items-center gap-2 text-slate-300">
              <span className="material-symbols-outlined text-[16px] text-[#ffe088]">support_agent</span>
              <span>Hotlines: <a href={CONTACT_NUMBERS.general.tel} className="text-amber-400 hover:underline font-bold">General: +91 {CONTACT_NUMBERS.general.formatted}</a> • <a href={CONTACT_NUMBERS.ticket.tel} className="text-amber-400 hover:underline font-bold">Tickets: +91 {CONTACT_NUMBERS.ticket.formatted}</a></span>
            </div>
          </div>

        </div>
      </footer>

      {/* 5. Cookie Consent, Social Share, Audit & Mobile Quick Bar */}
      <CookieConsentBanner />
      <SocialShareModal 
        isOpen={shareModalOpen} 
        onClose={() => setShareModalOpen(false)} 
      />
      <AuditChecklistView
        isOpen={auditModalOpen}
        onClose={() => setAuditModalOpen(false)}
        onNavigateTab={handleNavigateTab}
      />
      <MobileQuickBar 
        onNavigate={handleNavigateTab} 
        onOpenShare={() => setShareModalOpen(true)} 
      />

      {/* 6. MMS AI Travel Assistant Chatbot & Bus Booking Modal */}
      <MmsTravelAssistant
        isOpen={isChatOpen}
        onOpen={() => setIsChatOpen(true)}
        onClose={() => setIsChatOpen(false)}
        initialCategory={chatInitialCategory}
        onNavigate={handleNavigateTab}
        onOpenEnquiry={handleOpenEnquiry}
      />

      <BusBookingModal
        isOpen={isBusModalOpen}
        onClose={() => setIsBusModalOpen(false)}
        onBookingSubmitted={(busData) => {
          handleOpenEnquiry('OTHER_SERVICES', `Bus Booking Enquiry: ${busData.fromCity} to ${busData.toCity} on ${busData.travelDate} (${busData.passengers} passengers, ${busData.busType})`);
        }}
      />

    </div>
  );
}

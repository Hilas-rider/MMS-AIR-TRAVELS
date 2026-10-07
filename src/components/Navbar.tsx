import React, { useState, useRef, useEffect } from 'react';
import { 
  Plane, 
  Search, 
  Phone, 
  Mail, 
  ChevronDown, 
  Package, 
  Ticket, 
  FileText, 
  MapPin, 
  Globe, 
  Users, 
  Info, 
  Headphones,
  Menu,
  X,
  Sliders,
  Sparkles,
  Languages,
  Shield,
  Briefcase,
  FileCheck2,
  Banknote,
  Hotel,
  CheckCircle2,
  Award,
  HelpCircle,
  Building2
} from 'lucide-react';
import { CurrencyCode } from '../types';
import { LanguageCode, SUPPORTED_LANGUAGES, TRANSLATIONS } from '../utils/translations';
import { CONTACT_NUMBERS } from '../data/contactInfo';

interface NavbarProps {
  activeTab: string;
  onSelectTab: (tab: string, subCategory?: string) => void;
  currency: CurrencyCode;
  onSelectCurrency: (c: CurrencyCode) => void;
  language: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  bookingCount: number;
  onOpenEnquiry: (serviceType?: any, destPreset?: string) => void;
  onOpenAdmin: () => void;
  onOpenStaffPortal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  currency,
  onSelectCurrency,
  language,
  onSelectLanguage,
  bookingCount,
  onOpenEnquiry,
  onOpenAdmin,
  onOpenStaffPortal
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [otherServicesOpen, setOtherServicesOpen] = useState(false);
  const [toursOpen, setToursOpen] = useState(false);

  const currencies: CurrencyCode[] = ['INR', 'USD', 'AED', 'EUR', 'GBP', 'SAR'];

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  // Close dropdowns on outside click
  const navRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setCurrencyOpen(false);
        setLanguageOpen(false);
        setOtherServicesOpen(false);
        setToursOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header ref={navRef} className="sticky top-0 w-full z-50 shadow-[0_1px_8px_rgba(0,0,0,0.06)]">
      
      {/* 1. TOP BAR: DIVINE BLESSING, BRANCH HOTLINE, MULTI-LANGUAGE & CURRENCY */}
      <div className="w-full bg-[#181c1f] text-[#eef1f5] py-1.5 px-4 lg:px-12 border-b border-slate-800">
        <div className="w-full flex items-center justify-between text-xs flex-wrap gap-2">
          
          {/* Left: Divine Blessing & Branch Info */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[#ffe088] font-bold tracking-wide">
              {t.divineBlessing}
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="hidden md:inline-flex items-center gap-1 text-[#96cbff] font-semibold text-[11px]">
              <span className="material-symbols-outlined text-[13px]">location_on</span>
              {t.branchAdirampattinam}
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <div className="flex items-center gap-2 flex-wrap text-[11px]">
              <a 
                href={CONTACT_NUMBERS.general.tel} 
                className="text-amber-300 hover:text-white font-mono font-bold transition-colors"
                title="General Inquiry Desk"
              >
                General: {CONTACT_NUMBERS.general.raw}
              </a>
              <span className="text-slate-600 hidden lg:inline">|</span>
              <a 
                href={CONTACT_NUMBERS.ticket.tel} 
                className="text-amber-300 hover:text-white font-mono font-bold transition-colors hidden lg:inline"
                title="Flight Ticket Booking Desk"
              >
                Tickets: {CONTACT_NUMBERS.ticket.raw}
              </a>
              <span className="text-slate-600 hidden xl:inline">|</span>
              <a 
                href={CONTACT_NUMBERS.visa.tel} 
                className="text-amber-300 hover:text-white font-mono font-bold transition-colors hidden xl:inline"
                title="Visa Desk"
              >
                Visa: {CONTACT_NUMBERS.visa.raw}
              </a>
              <span className="text-slate-600 hidden 2xl:inline">|</span>
              <a 
                href={CONTACT_NUMBERS.services.tel} 
                className="text-amber-300 hover:text-white font-mono font-bold transition-colors hidden 2xl:inline"
                title="Other Services Desk"
              >
                Other: {CONTACT_NUMBERS.services.raw}
              </a>
            </div>
          </div>

          {/* Right: Language Selector + Currency Selector + Verified Agency badge (Staff login hidden) */}
          <div className="flex items-center gap-3 text-slate-300 ml-auto">
            
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setLanguageOpen(!languageOpen);
                  setCurrencyOpen(false);
                  setOtherServicesOpen(false);
                }}
                className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer text-xs font-semibold"
                title="Select Language"
              >
                <span>{currentLangObj.flag}</span>
                <span>{currentLangObj.nativeName}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {languageOpen && (
                <div className="absolute right-0 top-full mt-1.5 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 py-1.5 min-w-[170px] z-50 animate-fadeIn">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    Select Language / மொழி
                  </div>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onSelectLanguage(lang.code);
                        setLanguageOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-blue-50 flex items-center justify-between cursor-pointer transition-colors ${
                        language === lang.code ? 'font-bold text-[#006097] bg-blue-50/70' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{lang.flag}</span>
                        <div>
                          <div className="font-semibold leading-none">{lang.nativeName}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{lang.label}</div>
                        </div>
                      </div>
                      {language === lang.code && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#006097]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Currency Selector Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setCurrencyOpen(!currencyOpen);
                  setLanguageOpen(false);
                  setOtherServicesOpen(false);
                }}
                className="flex items-center gap-1 px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer text-xs font-semibold"
                title="Select Currency"
              >
                <span>{currency}</span>
                <span className="text-slate-400 font-mono-data text-[11px]">
                  ({currency === 'INR' ? '₹' : currency === 'AED' ? 'د.إ' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'SAR' ? '﷼' : '$'})
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {currencyOpen && (
                <div className="absolute right-0 top-full mt-1.5 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 py-1.5 min-w-[140px] z-50 animate-fadeIn">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    Currency
                  </div>
                  {currencies.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        onSelectCurrency(c);
                        setCurrencyOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-blue-50 flex items-center justify-between cursor-pointer transition-colors ${
                        currency === c ? 'font-bold text-[#006097] bg-blue-50/70' : 'text-slate-700'
                      }`}
                    >
                      <span>{c}</span>
                      <span className="text-slate-500 font-mono-data text-[11px]">
                        {c === 'INR' ? '₹' : c === 'AED' ? 'د.إ' : c === 'EUR' ? '€' : c === 'GBP' ? '£' : c === 'SAR' ? '﷼' : '$'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="w-px h-3 bg-slate-700 hidden sm:inline-block" />

            {/* Agency Verification Badge */}
            <div className="hidden sm:flex items-center gap-1 text-slate-300 text-xs">
              <span className="material-symbols-outlined text-[15px] text-[#96cbff]">verified</span>
              <span className="font-medium">100% Verified Agency</span>
            </div>

          </div>

        </div>
      </div>

      {/* 2. MAIN NAVIGATION HEADER */}
      <div className="w-full bg-white/95 backdrop-blur-xl border-b border-slate-200/80">
        <div className="h-16 sm:h-20 w-full px-3.5 sm:px-4 lg:px-12 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo & Brand Name */}
          <div 
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-2.5 sm:gap-3 shrink-0 cursor-pointer select-none"
          >
            <img 
              alt="MMS Air Travels Official Logo" 
              className="h-9 w-9 sm:h-10 sm:w-10 object-contain rounded-full bg-white p-0.5 shadow-xs border border-slate-200" 
              src="/mms_logo.svg"
              onError={(e) => {
                const target = e.currentTarget;
                target.onerror = null;
                target.src = '/mms_logo.jpg';
              }}
            />
            <div className="flex flex-col">
              <span className="text-base sm:text-xl font-black tracking-tight text-[#006097] leading-none">
                MMS AIR TRAVELS
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5 sm:mt-1">
                Adirampattinam • Madukkur
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-5 text-sm font-semibold">
            
            {/* Home */}
            <button 
              onClick={() => onSelectTab('home')}
              className={`py-1.5 transition-colors cursor-pointer ${
                activeTab === 'home' 
                  ? 'text-[#006097] border-b-2 border-[#006097]' 
                  : 'text-slate-700 hover:text-[#006097]'
              }`}
            >
              Home
            </button>

            {/* Flights */}
            <button 
              onClick={() => onSelectTab('flight-ticket')}
              className={`py-1.5 transition-colors cursor-pointer ${
                activeTab === 'flight-ticket' 
                  ? 'bg-[#007abd] text-white rounded-lg px-3' 
                  : 'text-slate-700 hover:text-[#006097]'
              }`}
            >
              Flights
            </button>

            {/* PASSPORT SEVA (Highlighted per user request) */}
            <button 
              onClick={() => onSelectTab('other-services', 'passport')}
              className={`py-1.5 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'other-services' 
                  ? 'bg-[#007abd] text-white rounded-lg px-3' 
                  : 'text-slate-700 hover:text-[#006097]'
              }`}
            >
              <FileCheck2 className="w-4 h-4 text-amber-500" />
              <span>Passport Seva</span>
            </button>

            {/* VISAS */}
            <button 
              onClick={() => onSelectTab('visa')}
              className={`py-1.5 transition-colors cursor-pointer ${
                activeTab === 'visa' 
                  ? 'bg-[#007abd] text-white rounded-lg px-3' 
                  : 'text-slate-700 hover:text-[#006097]'
              }`}
            >
              Visas
            </button>

            {/* Tours Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setToursOpen(!toursOpen);
                  setOtherServicesOpen(false);
                }}
                className={`py-1.5 transition-colors cursor-pointer flex items-center gap-1 ${
                  activeTab === 'india-tours' || activeTab === 'international-tours' || activeTab === 'group-tours'
                    ? 'text-[#006097] font-bold' 
                    : 'text-slate-700 hover:text-[#006097]'
                }`}
              >
                <span>Packages & Tours</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {toursOpen && (
                <div className="absolute left-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-slate-200 py-2 w-56 z-50 animate-fadeIn">
                  <button
                    onClick={() => {
                      onSelectTab('india-tours');
                      setToursOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-50 flex items-center justify-between text-slate-800"
                  >
                    <span>India Domestic Tours</span>
                    <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">All States</span>
                  </button>
                  <button
                    onClick={() => {
                      onSelectTab('international-tours');
                      setToursOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-50 flex items-center justify-between text-slate-800"
                  >
                    <span>International Holidays</span>
                    <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">Dubai/Europe</span>
                  </button>
                  <button
                    onClick={() => {
                      onSelectTab('group-tours');
                      setToursOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-50 flex items-center justify-between text-slate-800"
                  >
                    <span>Group & Umrah Tours</span>
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Delegations</span>
                  </button>
                </div>
              )}
            </div>

            {/* Wholesale Group Fares */}
            <button 
              onClick={() => onSelectTab('group-fares')}
              className={`py-1.5 transition-colors cursor-pointer ${
                activeTab === 'group-fares' 
                  ? 'bg-[#007abd] text-white rounded-lg px-3' 
                  : 'text-slate-700 hover:text-[#006097]'
              }`}
            >
              Group Fares
            </button>

            {/* Air Cargo */}
            <button 
              onClick={() => onSelectTab('cargo')}
              className={`py-1.5 transition-colors cursor-pointer ${
                activeTab === 'cargo' 
                  ? 'bg-[#007abd] text-white rounded-lg px-3' 
                  : 'text-slate-700 hover:text-[#006097]'
              }`}
            >
              Air Cargo
            </button>

            {/* OTHER SERVICES DROPDOWN (Restored with Passport, Attestation, Insurance, Forex) */}
            <div className="relative">
              <button 
                onClick={() => {
                  setOtherServicesOpen(!otherServicesOpen);
                  setToursOpen(false);
                }}
                className={`py-1.5 transition-colors cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 ${
                  activeTab === 'other-services'
                    ? 'bg-[#006097] text-white border-[#006097]'
                    : 'text-slate-700'
                }`}
              >
                <span>Other Services</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {otherServicesOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 p-2 w-72 z-50 animate-fadeIn">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                    Complete Travel Facilitation
                  </div>
                  
                  <button
                    onClick={() => {
                      onSelectTab('other-services', 'passport');
                      setOtherServicesOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-blue-50 flex items-start gap-3 transition-colors"
                  >
                    <FileCheck2 className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-800">Passport Seva & Tatkaal</div>
                      <div className="text-[11px] text-slate-500">Fresh, Renewal, Police Clearance & Expedited</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onSelectTab('other-services', 'attestation');
                      setOtherServicesOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-blue-50 flex items-start gap-3 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-800">Certificate & MEA Attestation</div>
                      <div className="text-[11px] text-slate-500">HRD, MEA Apostille & Gulf Embassy Stamping</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onSelectTab('visa');
                      setOtherServicesOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-blue-50 flex items-start gap-3 transition-colors"
                  >
                    <Globe className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-800">Embassy & Tourist Visas</div>
                      <div className="text-[11px] text-slate-500">Dubai, Schengen, Singapore, Malaysia, Saudi</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onSelectTab('other-services', 'insurance');
                      setOtherServicesOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-blue-50 flex items-start gap-3 transition-colors"
                  >
                    <Shield className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-800">Overseas Travel Insurance</div>
                      <div className="text-[11px] text-slate-500">Zero-deductible Schengen & worldwide medical cover</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onSelectTab('other-services', 'forex');
                      setOtherServicesOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-blue-50 flex items-start gap-3 transition-colors"
                  >
                    <Banknote className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-800">Forex & Currency Exchange</div>
                      <div className="text-[11px] text-slate-500">Best bank exchange rates, cash & travel cards</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onSelectTab('other-services', 'hospitality');
                      setOtherServicesOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-blue-50 flex items-start gap-3 transition-colors"
                  >
                    <Hotel className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-800">VIP Hotels & Airport Transfers</div>
                      <div className="text-[11px] text-slate-500">Worldwide 4★/5★ bookings & chauffeur meet-and-greet</div>
                    </div>
                  </button>

                </div>
              )}
            </div>

            {/* Tracker / Check-in */}
            <button 
              onClick={() => onSelectTab('tracking')}
              className={`py-1.5 transition-colors cursor-pointer ${
                activeTab === 'tracking' 
                  ? 'bg-[#007abd] text-white rounded-lg px-3' 
                  : 'text-slate-700 hover:text-[#006097]'
              }`}
            >
              Tracker
            </button>

            {/* FAQ */}
            <button 
              onClick={() => onSelectTab('faq')}
              className={`py-1.5 transition-colors cursor-pointer flex items-center gap-1 ${
                activeTab === 'faq' 
                  ? 'bg-[#007abd] text-white rounded-lg px-3' 
                  : 'text-slate-700 hover:text-[#006097]'
              }`}
            >
              <span>FAQ</span>
            </button>

            {/* About Us */}
            <button 
              onClick={() => onSelectTab('about-us')}
              className={`py-1.5 transition-colors cursor-pointer font-bold ${
                activeTab === 'about-us' 
                  ? 'bg-[#007abd] text-white rounded-lg px-3' 
                  : 'text-slate-700 hover:text-[#006097]'
              }`}
            >
              <span>About Us</span>
            </button>

            {/* Contact Us */}
            <button 
              onClick={() => onSelectTab('contact-us')}
              className={`py-1.5 transition-colors cursor-pointer font-bold ${
                activeTab === 'contact-us' 
                  ? 'bg-[#007abd] text-white rounded-lg px-3' 
                  : 'text-slate-700 hover:text-[#006097]'
              }`}
            >
              <span>Contact Us</span>
            </button>

          </nav>

          {/* Right Actions: Manage Booking & Club MMS ELITE */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button 
              onClick={() => onSelectTab('itinerary')}
              className={`inline-flex items-center justify-center text-xs font-bold px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg transition-colors border cursor-pointer shadow-2xs ${
                activeTab === 'itinerary'
                  ? 'bg-[#007abd] text-white border-[#007abd]'
                  : 'text-[#006097] hover:bg-slate-100 border-slate-200 bg-white'
              }`}
              title="View Bookings, Digital Boarding Pass with QR, and WhatsApp confirmations"
            >
              <Ticket className="w-3.5 h-3.5 mr-1 text-amber-500" />
              <span>My Bookings & QR Pass</span>
            </button>

            {/* Club MMS ELITE badge */}
            <div 
              onClick={() => onOpenEnquiry('FLIGHT_TICKET', 'Club MMS VIP Membership')}
              className="hidden sm:flex items-center gap-1.5 bg-[#f1f4f8] hover:bg-[#ebeef2] px-2.5 py-1 rounded-full cursor-pointer transition-colors border border-slate-200"
            >
              <div className="flex items-center gap-1 pl-1">
                <span className="text-[11px] text-slate-600 font-bold uppercase hidden md:inline">
                  Club MMS
                </span>
                <span className="px-1.5 py-0.2 rounded-full bg-[#ffe088] text-[#241a00] text-[10px] font-bold">
                  ELITE
                </span>
              </div>
              <div className="w-7 h-7 rounded-full bg-[#006097] flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[16px]">person</span>
              </div>
            </div>

            {/* Staff Portal Access Button */}
            {onOpenStaffPortal && (
              <button 
                onClick={onOpenStaffPortal}
                title="MMS Staff Portal (Ctrl+Shift+S / Alt+S)"
                className="hidden lg:inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-white hover:bg-slate-900 px-3 py-1.5 rounded-lg transition-all border border-slate-300 hover:border-slate-900 cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[15px] text-amber-500">lock</span>
                <span>Staff Login</span>
              </button>
            )}

            {/* Mobile Hamburger Button (44x44px touch target) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden w-11 h-11 flex items-center justify-center text-slate-700 hover:text-[#006097] rounded-lg border border-slate-200 bg-white active:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-1.5 max-h-[80vh] overflow-y-auto w-full shadow-lg">
            
            {/* Primary Mobile Tabs */}
            <button
              onClick={() => { onSelectTab('home'); setMobileMenuOpen(false); }}
              className="w-full text-left py-2.5 px-3 min-h-[44px] text-sm font-semibold rounded hover:bg-slate-50 flex items-center justify-between text-slate-800"
            >
              <span>Home</span>
              <span className="material-symbols-outlined text-[18px] text-[#006097]">home</span>
            </button>

            <button
              onClick={() => { onSelectTab('flight-ticket'); setMobileMenuOpen(false); }}
              className="w-full text-left py-2.5 px-3 min-h-[44px] text-sm font-semibold rounded hover:bg-slate-50 flex items-center justify-between text-slate-800"
            >
              <span>Flights & Ticketing</span>
              <Plane className="w-4 h-4 text-[#006097]" />
            </button>

            {/* Passport Seva Direct Button */}
            <button
              onClick={() => { onSelectTab('other-services', 'passport'); setMobileMenuOpen(false); }}
              className="w-full text-left py-2.5 px-3 min-h-[44px] text-sm font-semibold rounded bg-amber-50/70 border border-amber-200/80 flex items-center justify-between text-amber-950"
            >
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-amber-600" />
                <span>Passport Seva (Tatkaal / Renewal)</span>
              </div>
              <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded">Fast Track</span>
            </button>

            <button
              onClick={() => { onSelectTab('itinerary'); setMobileMenuOpen(false); }}
              className="w-full text-left py-2.5 px-3 min-h-[44px] text-sm font-bold rounded bg-amber-50/80 hover:bg-amber-100 flex items-center justify-between text-amber-950 border border-amber-200"
            >
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-amber-600" />
                <span>My Bookings & QR Pass</span>
              </div>
              <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">QR + WhatsApp</span>
            </button>

            <button
              onClick={() => { onSelectTab('visa'); setMobileMenuOpen(false); }}
              className="w-full text-left py-2.5 px-3 min-h-[44px] text-sm font-semibold rounded hover:bg-slate-50 flex items-center justify-between text-slate-800"
            >
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#006097]" />
                <span>Visa Services (B2B Rates)</span>
              </div>
              <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-bold">B2B Form</span>
            </button>

            <button
              onClick={() => { onSelectTab('india-tours'); setMobileMenuOpen(false); }}
              className="w-full text-left py-2.5 px-3 min-h-[44px] text-sm font-semibold rounded hover:bg-slate-50 flex items-center justify-between text-slate-800"
            >
              <span>India Tour Packages</span>
              <Package className="w-4 h-4 text-[#006097]" />
            </button>

            <button
              onClick={() => { onSelectTab('international-tours'); setMobileMenuOpen(false); }}
              className="w-full text-left py-2.5 px-3 min-h-[44px] text-sm font-semibold rounded hover:bg-slate-50 flex items-center justify-between text-slate-800"
            >
              <span>International Holidays</span>
              <Globe className="w-4 h-4 text-[#006097]" />
            </button>

            <button
              onClick={() => { onSelectTab('group-fares'); setMobileMenuOpen(false); }}
              className="w-full text-left py-2.5 px-3 min-h-[44px] text-sm font-semibold rounded hover:bg-slate-50 flex items-center justify-between text-slate-800"
            >
              <span>Wholesale Group Fares</span>
              <Briefcase className="w-4 h-4 text-[#006097]" />
            </button>

            <button
              onClick={() => { onSelectTab('cargo'); setMobileMenuOpen(false); }}
              className="w-full text-left py-2.5 px-3 min-h-[44px] text-sm font-semibold rounded hover:bg-slate-50 flex items-center justify-between text-slate-800"
            >
              <span>Air Cargo Logistics</span>
              <Package className="w-4 h-4 text-[#006097]" />
            </button>

            <button
              onClick={() => { onSelectTab('tracking'); setMobileMenuOpen(false); }}
              className="w-full text-left py-2.5 px-3 min-h-[44px] text-sm font-semibold rounded hover:bg-slate-50 flex items-center justify-between text-slate-800"
            >
              <span>Web Check-in & Flight Status</span>
              <Search className="w-4 h-4 text-[#006097]" />
            </button>

            <button
              onClick={() => { onSelectTab('faq'); setMobileMenuOpen(false); }}
              className="w-full text-left py-2.5 px-3 min-h-[44px] text-sm font-semibold rounded hover:bg-slate-50 flex items-center justify-between text-slate-800"
            >
              <span>Frequently Asked Questions (FAQ)</span>
              <HelpCircle className="w-4 h-4 text-[#006097]" />
            </button>

            {/* About Us */}
            <button
              onClick={() => { onSelectTab('about-us'); setMobileMenuOpen(false); }}
              className="w-full text-left py-2.5 px-3 min-h-[44px] text-sm font-bold rounded bg-blue-50/60 hover:bg-blue-100 flex items-center justify-between text-[#006097]"
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#006097]" />
                <span>About Us (Branches & Story)</span>
              </div>
              <span className="text-[10px] bg-[#006097] text-white px-2 py-0.5 rounded-full font-bold">Adirampattinam & Madukkur</span>
            </button>

            {/* Contact Us */}
            <button
              onClick={() => { onSelectTab('contact-us'); setMobileMenuOpen(false); }}
              className="w-full text-left py-2.5 px-3 min-h-[44px] text-sm font-bold rounded hover:bg-slate-50 flex items-center justify-between text-slate-800"
            >
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Contact Us & Branch Desks</span>
              </div>
            </button>

            {/* Other Services Sub-list */}
            <div className="pt-2 border-t border-slate-100">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">
                Other Services
              </div>
              <button
                onClick={() => { onSelectTab('other-services', 'attestation'); setMobileMenuOpen(false); }}
                className="w-full text-left py-1.5 px-3 text-xs font-semibold rounded hover:bg-slate-50 text-slate-700 flex items-center gap-2"
              >
                <FileText className="w-3.5 h-3.5 text-blue-500" />
                <span>Certificate & MEA Attestation</span>
              </button>
              <button
                onClick={() => { onSelectTab('other-services', 'insurance'); setMobileMenuOpen(false); }}
                className="w-full text-left py-1.5 px-3 text-xs font-semibold rounded hover:bg-slate-50 text-slate-700 flex items-center gap-2"
              >
                <Shield className="w-3.5 h-3.5 text-purple-500" />
                <span>Travel Medical Insurance</span>
              </button>
              <button
                onClick={() => { onSelectTab('other-services', 'forex'); setMobileMenuOpen(false); }}
                className="w-full text-left py-1.5 px-3 text-xs font-semibold rounded hover:bg-slate-50 text-slate-700 flex items-center gap-2"
              >
                <Banknote className="w-3.5 h-3.5 text-teal-500" />
                <span>Forex & Currency Exchange</span>
              </button>
              <button
                onClick={() => { onSelectTab('other-services', 'hospitality'); setMobileMenuOpen(false); }}
                className="w-full text-left py-1.5 px-3 text-xs font-semibold rounded hover:bg-slate-50 text-slate-700 flex items-center gap-2"
              >
                <Hotel className="w-3.5 h-3.5 text-orange-500" />
                <span>Hotel Bookings & Transfers</span>
              </button>
            </div>

            {/* Mobile Staff Portal Button */}
            {onOpenStaffPortal && (
              <div className="pt-2">
                <button
                  onClick={() => { onOpenStaffPortal(); setMobileMenuOpen(false); }}
                  className="w-full py-2 px-3 text-xs font-bold rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">lock</span>
                  <span>MMS Staff Portal Login</span>
                </button>
              </div>
            )}

            {/* Mobile Language Switcher */}
            <div className="pt-3 border-t border-slate-200">
              <span className="text-xs font-bold text-slate-500 block mb-1.5">Language / மொழி</span>
              <div className="grid grid-cols-2 gap-1.5">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { onSelectLanguage(lang.code); }}
                    className={`px-2.5 py-1.5 text-xs font-semibold rounded flex items-center gap-1.5 ${
                      language === lang.code ? 'bg-[#006097] text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.nativeName}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Currency Switcher */}
            <div className="pt-3 border-t border-slate-200">
              <span className="text-xs font-bold text-slate-500 block mb-1.5">Currency</span>
              <div className="flex flex-wrap gap-1">
                {currencies.map((c) => (
                  <button
                    key={c}
                    onClick={() => { onSelectCurrency(c); }}
                    className={`px-2.5 py-1 text-xs font-semibold rounded ${
                      currency === c ? 'bg-[#006097] text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </header>
  );
};

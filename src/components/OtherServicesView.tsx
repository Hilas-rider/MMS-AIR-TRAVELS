import React, { useState } from 'react';
import { 
  FileBadge, 
  FileCheck2, 
  Package, 
  ShieldCheck, 
  CheckCircle2, 
  FileText,
  Banknote,
  Hotel,
  Car,
  Plane,
  Phone,
  ArrowRight,
  Globe,
  Clock,
  Sparkles,
  QrCode
} from 'lucide-react';
import { CargoTracker } from './CargoTracker';
import { CurrencyCode } from '../types';
import { CONTACT_NUMBERS, LOCATIONS } from '../data/contactInfo';

interface OtherServicesViewProps {
  currency: CurrencyCode;
  initialSubTab?: string;
  onOpenEnquiry: (serviceType: any, destPreset?: string) => void;
}

export type SubTabKey = 'passport' | 'attestation' | 'visa' | 'cargo' | 'insurance' | 'forex' | 'hospitality';

interface BoardingPassServiceItem {
  code: string;
  gate: string;
  tier: string;
  title: string;
  route: string;
  description: string;
  specs: { label: string; value: string }[];
  enquiryServiceType: 'Miscellaneous' | 'Visa' | 'Passport' | 'Cargo' | 'Hotel' | 'Transfer' | 'Package';
  presetName: string;
  priorityAlert?: string;
}

export const OtherServicesView: React.FC<OtherServicesViewProps> = ({
  currency,
  initialSubTab = 'passport',
  onOpenEnquiry
}) => {
  const [subTab, setSubTab] = useState<SubTabKey>(() => {
    if (initialSubTab === 'cargo') return 'cargo';
    if (initialSubTab === 'attestation') return 'attestation';
    if (initialSubTab === 'visa') return 'visa';
    if (initialSubTab === 'insurance') return 'insurance';
    if (initialSubTab === 'forex') return 'forex';
    if (initialSubTab === 'hospitality') return 'hospitality';
    return 'passport';
  });

  // Dynamic Metadata for Persistent Call-to-Action Bar
  const serviceMetadata: Record<SubTabKey, {
    badge: string;
    shortName: string;
    subtitle: string;
    enquiryType: 'Miscellaneous' | 'Visa' | 'Passport' | 'Cargo' | 'Hotel' | 'Transfer' | 'Package';
    defaultPreset: string;
  }> = {
    passport: {
      badge: 'PASSPORT SEVA FACILITATION DESK',
      shortName: 'Passport',
      subtitle: 'Official PSK/POPSK online document filings, Tatkaal allocations & police clearances.',
      enquiryType: 'Passport',
      defaultPreset: 'General Passport Application Inquiry'
    },
    attestation: {
      badge: 'MEA & EMBASSY LEGALIZATION DESK',
      shortName: 'Attestation',
      subtitle: 'State HRD, Ministry of External Affairs Apostille & Gulf consulate MOFA stamping.',
      enquiryType: 'Attestation' as any,
      defaultPreset: 'Certificate & Embassy Attestation Inquiry'
    },
    visa: {
      badge: 'GLOBAL TOURIST & TRANSIT VISA COUNTER',
      shortName: 'Visa',
      subtitle: 'Fast-track UAE, Saudi Umrah, Schengen, UK, Singapore & Malaysia visa filings.',
      enquiryType: 'Visa',
      defaultPreset: 'Global Tourist & Business Visa Inquiry'
    },
    cargo: {
      badge: 'AIR FREIGHT & AWB LOGISTICS',
      shortName: 'Cargo',
      subtitle: 'Direct air cargo forwarding, excess luggage clearance, cold chain & scheduled freighters.',
      enquiryType: 'Cargo',
      defaultPreset: 'Air Cargo & Freight Forwarding Inquiry'
    },
    insurance: {
      badge: 'OVERSEAS TRAVEL MEDICAL COVER',
      shortName: 'Insurance',
      subtitle: 'Zero-deductible Schengen policies, student health covers & emergency hospitalizations.',
      enquiryType: 'Miscellaneous',
      defaultPreset: 'Overseas Travel Medical Insurance Inquiry'
    },
    forex: {
      badge: 'RBI COMPLIANT FOREX & REMITTANCE',
      shortName: 'Forex',
      subtitle: 'Zero markup multi-currency travel cards, cash banknotes & university tuition wire transfers.',
      enquiryType: 'Miscellaneous',
      defaultPreset: 'Foreign Exchange & Multi-Currency Card Inquiry'
    },
    hospitality: {
      badge: 'HOTEL, TRANSFERS & PILGRIMAGE DESK',
      shortName: 'Hospitality',
      subtitle: 'Airport chauffeur pickups, worldwide lodging & certified Umrah packages.',
      enquiryType: 'Hotel',
      defaultPreset: 'Worldwide Hotel & Ground Transfer Inquiry'
    }
  };

  const isSecondaryService = ['passport', 'attestation', 'visa', 'cargo', 'insurance', 'forex', 'hospitality'].includes(subTab);

  // Reusable Boarding Pass Ticket Layout
  const renderBoardingPass = (item: BoardingPassServiceItem) => {
    return (
      <div 
        key={item.code}
        className="bg-white border border-[#e2e8f0] relative overflow-hidden flex flex-col lg:flex-row hover:border-[#0ea5e9] transition-all shadow-xs hover:shadow-md"
      >
        {/* Main Boarding Coupon */}
        <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between space-y-4">
          
          {/* Boarding Pass Header Strip */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e2e8f0] pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#0ea5e9]" />
              <span className="text-[11px] font-mono-data font-bold text-[#0b192c] tracking-wider">
                {item.code}
              </span>
              <span className="text-[10px] font-mono-data px-2 py-0.5 bg-[#f8fafc] text-[#0b192c] border border-[#e2e8f0] font-semibold">
                {item.tier}
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-mono-data text-slate-500">
              <span>{item.gate}</span>
              {item.priorityAlert && (
                <span className="text-[10px] font-mono-data font-bold px-1.5 py-0.5 bg-[#f59e0b]/15 text-[#b45309] border border-[#f59e0b]/40">
                  {item.priorityAlert}
                </span>
              )}
            </div>
          </div>

          {/* Title & Process Route */}
          <div>
            <h4 className="font-display text-lg sm:text-xl text-[#0b192c] leading-snug">
              {item.title}
            </h4>
            <div className="mt-1 flex items-center gap-2 text-xs font-mono-data text-[#0ea5e9]">
              <Plane className="w-3.5 h-3.5 rotate-45 shrink-0" />
              <span>{item.route}</span>
            </div>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Aviation Spec Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-[#f8fafc] p-3 border border-[#e2e8f0] text-xs font-mono-data">
            {item.specs.map((spec, i) => (
              <div key={i} className="space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  {spec.label}
                </span>
                <span className="text-xs font-bold text-[#0b192c] block">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>

        </div>

        {/* Perforation Divider with Circular Notches */}
        <div className="relative flex lg:flex-col items-center justify-between">
          <div className="hidden lg:block w-px h-full ticket-edge-dashed relative">
            <div className="ticket-notch-top -left-[9px]" />
            <div className="ticket-notch-bottom -left-[9px]" />
          </div>
          <div className="lg:hidden w-full h-px border-t border-dashed border-[#e2e8f0] relative my-1">
            <div className="ticket-notch-top -top-[9px] left-4" />
            <div className="ticket-notch-top -top-[9px] right-4" />
          </div>
        </div>

        {/* Tear-Off Boarding Stub */}
        <div className="bg-[#f8fafc] p-5 flex flex-col justify-between items-center lg:w-64 shrink-0 border-t lg:border-t-0 border-[#e2e8f0] text-center space-y-4">
          
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono-data text-slate-400 uppercase border-b border-[#e2e8f0] pb-1.5">
              <span>BOARDING COUPON</span>
              <span>DESK STUB</span>
            </div>

            <div className="text-left space-y-1">
              <span className="text-[10px] font-mono-data text-slate-500 block">PASSENGER / APPLICANT</span>
              <span className="text-xs font-mono-data font-bold text-[#0b192c] block truncate">
                {item.title}
              </span>
              <span className="text-[10px] font-mono-data text-[#059669] font-bold block flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#059669]" /> Verified Consolidator Allocation
              </span>
            </div>

            {/* Simulated Aviation Barcode */}
            <div className="py-2 border-y border-[#e2e8f0] flex flex-col items-center justify-center opacity-80">
              <div className="text-[10px] font-mono-data tracking-[0.25em] text-[#0b192c] select-none">
                |||||| | || ||||| | |||| |||
              </div>
              <span className="text-[9px] font-mono-data text-slate-400 mt-0.5">
                {item.code} • ADK-TRZ-OFFICIAL
              </span>
            </div>
          </div>

          <button
            onClick={() => onOpenEnquiry(item.enquiryServiceType, item.presetName)}
            className="w-full py-2.5 px-4 bg-[#0b192c] hover:bg-[#0ea5e9] text-white text-xs font-mono-data font-bold transition-colors cursor-pointer text-center shadow-xs flex items-center justify-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span>Send Inquiry</span>
          </button>

        </div>

      </div>
    );
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* 1. Header Docket Bar */}
      <div className="bg-[#0b192c] text-[#f8fafc] border border-[#e2e8f0]/20 p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e2e8f0]/15 pb-3 mb-4">
          <div className="flex items-center gap-2 text-xs font-mono-data text-slate-300">
            <span className="w-2 h-2 bg-[#f59e0b]" />
            <span>MMS TRAVELS & CARGO SERVICE • CONSOLIDATOR AUXILIARY DESK</span>
          </div>
          <span className="text-xs font-mono-data text-[#f59e0b]">
            VERIFIED REGISTRATION: ADIKAL-01
          </span>
        </div>

        <div className="max-w-3xl">
          <h2 className="font-display text-2xl sm:text-3xl text-white leading-tight">
            Comprehensive Passport, Attestation, Cargo & Auxiliary Services
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Direct counters for government document filing, Ministry of External Affairs attestation, international air freight, overseas travel medical insurance, and multi-currency foreign exchange.
          </p>
        </div>

        {/* Sub-Category Navigation Bar */}
        <div className="mt-6 pt-4 border-t border-[#e2e8f0]/15 flex flex-wrap gap-2 text-xs font-mono-data">
          
          <button
            onClick={() => setSubTab('passport')}
            className={`px-3.5 py-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              subTab === 'passport'
                ? 'bg-[#f59e0b] text-[#0b192c] font-black'
                : 'bg-[#07111e] text-slate-300 hover:bg-[#0b192c] hover:text-white border border-[#e2e8f0]/20'
            }`}
          >
            <FileBadge className="w-3.5 h-3.5" />
            <span>01. Passport Services</span>
          </button>

          <button
            onClick={() => setSubTab('attestation')}
            className={`px-3.5 py-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              subTab === 'attestation'
                ? 'bg-[#f59e0b] text-[#0b192c] font-black'
                : 'bg-[#07111e] text-slate-300 hover:bg-[#0b192c] hover:text-white border border-[#e2e8f0]/20'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>02. Certificate Attestation</span>
          </button>

          <button
            onClick={() => setSubTab('visa')}
            className={`px-3.5 py-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              subTab === 'visa'
                ? 'bg-[#f59e0b] text-[#0b192c] font-black'
                : 'bg-[#07111e] text-slate-300 hover:bg-[#0b192c] hover:text-white border border-[#e2e8f0]/20'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>03. Tourist & Transit Visas</span>
          </button>

          <button
            onClick={() => setSubTab('cargo')}
            className={`px-3.5 py-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              subTab === 'cargo'
                ? 'bg-[#f59e0b] text-[#0b192c] font-black'
                : 'bg-[#07111e] text-slate-300 hover:bg-[#0b192c] hover:text-white border border-[#e2e8f0]/20'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>04. Air Cargo & AWB</span>
          </button>

          <button
            onClick={() => setSubTab('insurance')}
            className={`px-3.5 py-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              subTab === 'insurance'
                ? 'bg-[#f59e0b] text-[#0b192c] font-black'
                : 'bg-[#07111e] text-slate-300 hover:bg-[#0b192c] hover:text-white border border-[#e2e8f0]/20'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>05. Travel Insurance</span>
          </button>

          <button
            onClick={() => setSubTab('forex')}
            className={`px-3.5 py-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              subTab === 'forex'
                ? 'bg-[#f59e0b] text-[#0b192c] font-black'
                : 'bg-[#07111e] text-slate-300 hover:bg-[#0b192c] hover:text-white border border-[#e2e8f0]/20'
            }`}
          >
            <Banknote className="w-3.5 h-3.5" />
            <span>06. Forex & Currency</span>
          </button>

          <button
            onClick={() => setSubTab('hospitality')}
            className={`px-3.5 py-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              subTab === 'hospitality'
                ? 'bg-[#f59e0b] text-[#0b192c] font-black'
                : 'bg-[#07111e] text-slate-300 hover:bg-[#0b192c] hover:text-white border border-[#e2e8f0]/20'
            }`}
          >
            <Hotel className="w-3.5 h-3.5" />
            <span>07. Hotels, Transfers & Umrah</span>
          </button>

        </div>
      </div>

      {/* 2. SUB-TAB 1: PASSPORT SERVICES */}
      {subTab === 'passport' && (
        <div className="space-y-6">
          <div className="border-b border-[#e2e8f0] pb-2">
            <h3 className="font-display text-xl text-[#0b192c]">
              Indian Passport Facilitation & Police Clearance (PCC) Boarding Passes
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Authorized Passport Seva Kendra (PSK) online submission, appointment booking, and document scrutiny desk.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderBoardingPass({
              code: 'BOARDING PASS // PSP-01',
              gate: 'GATE: PSK-TRZ',
              tier: 'REGULAR APPLICATION',
              title: 'Fresh Passport Application / Re-issue',
              route: 'APPLICANT -> REGIONAL PASSPORT OFFICE (CHENNAI/TRICHY)',
              description: 'Official Passport Seva portal application filing, slot allocation at nearest PSK / POPSK, and preliminary document verification.',
              specs: [
                { label: 'TIMELINE', value: '15-20 Days' },
                { label: 'MANDATORY PROOFS', value: 'Aadhaar + DOB' },
                { label: 'STATUS', value: 'Direct Desk Filing' }
              ],
              enquiryServiceType: 'Passport',
              presetName: 'Fresh Passport Application'
            })}

            {renderBoardingPass({
              code: 'BOARDING PASS // PSP-02',
              gate: 'GATE: MEA-PRIORITY',
              tier: 'EMERGENCY FAST-TRACK',
              title: 'Tatkaal Urgent Passport (1-3 Days)',
              route: 'APPLICANT -> MEA TATKAAL PRIORITY DISPATCH',
              description: 'Next-day PSK appointment scheduling under Ministry of External Affairs Tatkaal guidelines for emergency overseas departure.',
              specs: [
                { label: 'TIMELINE', value: '24-72 Hours' },
                { label: 'ID REQUIREMENT', value: '3 Govt Photo IDs' },
                { label: 'VERIFICATION', value: 'Post-Dispatch Police' }
              ],
              enquiryServiceType: 'Passport',
              presetName: 'Tatkaal Urgent Passport',
              priorityAlert: 'FAST-TRACK DISPATCH'
            })}

            {renderBoardingPass({
              code: 'BOARDING PASS // PSP-03',
              gate: 'GATE: POLICE-DIV',
              tier: 'EMPLOYMENT & RESIDENCY',
              title: 'Police Clearance Certificate (PCC)',
              route: 'APPLICANT -> EMBASSY CLEARANCE & STATION RECORD',
              description: 'Mandatory criminal record verification for employment visas, long-term work permits, and residency in GCC, Europe, and Americas.',
              specs: [
                { label: 'TIMELINE', value: '5-10 Days' },
                { label: 'VALIDITY', value: '6 Months' },
                { label: 'DESTINATION', value: 'UAE, Saudi, Qatar, EU' }
              ],
              enquiryServiceType: 'Passport',
              presetName: 'Police Clearance Certificate (PCC)'
            })}

            {renderBoardingPass({
              code: 'BOARDING PASS // PSP-04',
              gate: 'GATE: EXPIRY-RENEW',
              tier: 'RENEWAL & CORRECTION',
              title: 'Passport Renewal & Damaged Re-issue',
              route: 'OLD BOOKLET -> EMBOSSED NEW 36/60 PAGE PASSPORT',
              description: 'Validity renewal within 1 year of expiry, exhausted visa pages replacement, damaged booklet restoration, and address correction.',
              specs: [
                { label: 'PAGES', value: '36 or 60 Jumbo' },
                { label: 'CORRECTION', value: 'Spouse/Address/Name' },
                { label: 'STATUS', value: 'Old Passport Returned' }
              ],
              enquiryServiceType: 'Passport',
              presetName: 'Passport Renewal & Damaged Booklet'
            })}
          </div>
        </div>
      )}

      {/* 3. SUB-TAB 2: ATTESTATION & APOSTILLE */}
      {subTab === 'attestation' && (
        <div className="space-y-6">
          <div className="border-b border-[#e2e8f0] pb-2">
            <h3 className="font-display text-xl text-[#0b192c]">
              MEA, State HRD & Foreign Embassy Attestation Boarding Passes
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Legalization for educational degrees, marriage stubs, commercial dockets, and Hague Apostille stickers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderBoardingPass({
              code: 'BOARDING PASS // ATT-01',
              gate: 'GATE: HRD-STATE',
              tier: 'ACADEMIC CREDENTIALS',
              title: 'Degree & Diploma Attestation (HRD + MEA)',
              route: 'UNIVERSITY AUTH -> STATE HRD -> MEA -> EMBASSY',
              description: 'Mandatory for engineering, medical, and technical employment visas in UAE, Saudi Arabia, Qatar, Kuwait, and Oman.',
              specs: [
                { label: 'DOCS COVERED', value: 'B.E, MBBS, Diplomas' },
                { label: 'TIMELINE', value: '5-8 Working Days' },
                { label: 'AUTHENTICATION', value: 'Government Verified' }
              ],
              enquiryServiceType: 'Attestation' as any,
              presetName: 'Degree & Diploma Attestation'
            })}

            {renderBoardingPass({
              code: 'BOARDING PASS // ATT-02',
              gate: 'GATE: SDM-HOME',
              tier: 'FAMILY SPONSORSHIP',
              title: 'Marriage & Birth Certificate Attestation',
              route: 'REGISTRAR STUB -> SDM / HOME -> MEA -> CONSULATE',
              description: 'Legal certificate verification required for spouse sponsorship, family residency visas, school admissions, and child passports abroad.',
              specs: [
                { label: 'DOCUMENTS', value: 'Marriage & Birth' },
                { label: 'TIMELINE', value: '3-5 Working Days' },
                { label: 'SEAL', value: 'Ministry of External Affairs' }
              ],
              enquiryServiceType: 'Attestation' as any,
              presetName: 'Marriage & Birth Certificate Attestation'
            })}

            {renderBoardingPass({
              code: 'BOARDING PASS // ATT-03',
              gate: 'GATE: HAGUE-CONV',
              tier: 'APOSTILLE STICKER',
              title: 'Hague Convention MEA Apostille Legalization',
              route: 'ORIGINAL CERTIFICATE -> MEA HIGH-SECURITY QR APOSTILLE',
              description: 'Recognized across 120+ Hague convention countries including USA, UK, Germany, France, Italy, Australia, and New Zealand without embassy visits.',
              specs: [
                { label: 'SECURITY', value: 'Digital QR Stamp' },
                { label: 'RECOGNITION', value: '120+ Countries' },
                { label: 'TIMELINE', value: '2-4 Working Days' }
              ],
              enquiryServiceType: 'Attestation' as any,
              presetName: 'Hague Convention MEA Apostille Legalization',
              priorityAlert: 'NO EMBASSY VISIT NEEDED'
            })}

            {renderBoardingPass({
              code: 'BOARDING PASS // ATT-04',
              gate: 'GATE: GULF-MOFA',
              tier: 'EMBASSY & MOFA',
              title: 'UAE, Saudi Arabia & Qatar Embassy Attestation',
              route: 'MEA DOCUMENT -> ROYAL EMBASSY -> DESTINATION MOFA',
              description: 'Direct submission to Gulf consulates in New Delhi and Mumbai for commercial contracts, power of attorney, and work agreements.',
              specs: [
                { label: 'EMBASSIES', value: 'UAE, Saudi, Qatar, Kuwait' },
                { label: 'TRACKING', value: 'Secure Insured Courier' },
                { label: 'GUARANTEE', value: '100% Genuine Stamping' }
              ],
              enquiryServiceType: 'Attestation' as any,
              presetName: 'Gulf Embassy & MOFA Attestation'
            })}
          </div>
        </div>
      )}

      {/* 4. SUB-TAB 3: TOURIST & TRANSIT VISAS */}
      {subTab === 'visa' && (
        <div className="space-y-6">
          <div className="border-b border-[#e2e8f0] pb-2">
            <h3 className="font-display text-xl text-[#0b192c]">
              Global Tourist, Business & Electronic Visas (E-Visa)
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Consolidator visa facilitation desk for Gulf e-visas, Schengen appointment slots, and Far East express approvals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderBoardingPass({
              code: 'BOARDING PASS // VIS-01',
              gate: 'GATE: DXB-GDRFA',
              tier: 'EXPRESS E-VISA',
              title: 'Dubai & UAE Tourist Visa (30 & 60 Days)',
              route: 'TAMIL NADU -> DUBAI GDRFA / ICP EMIRATES IMMIGRATION',
              description: 'Single and multiple entry UAE tourist visas with instant insurance. Direct online approval issued within 24 to 48 hours.',
              specs: [
                { label: 'PROCESSING', value: '24-48 Hours' },
                { label: 'VALIDITY', value: '30 / 60 Days' },
                { label: 'DOCS REQUIRED', value: 'Passport Front/Back + Photo' }
              ],
              enquiryServiceType: 'Visa',
              presetName: 'Dubai & UAE Tourist Visa',
              priorityAlert: 'INSTANT 24H FILING'
            })}

            {renderBoardingPass({
              code: 'BOARDING PASS // VIS-02',
              gate: 'GATE: KSA-MOFA',
              tier: 'ONE YEAR MULTIPLE',
              title: 'Saudi Arabia Tourist & Umrah E-Visa',
              route: 'INDIA -> KINGDOM OF SAUDI ARABIA (JEDDAH/MADINAH/RIYADH)',
              description: '1-Year multiple entry tourist and pilgrim electronic visa allowing up to 90 days stay per visit with full Umrah privileges.',
              specs: [
                { label: 'PROCESSING', value: 'Instant 24-Hour Approval' },
                { label: 'VALIDITY', value: '1 Year Multiple Entry' },
                { label: 'INCLUDES', value: 'Mandatory Council Health Cover' }
              ],
              enquiryServiceType: 'Visa',
              presetName: 'Saudi Arabia Tourist & Umrah E-Visa'
            })}

            {renderBoardingPass({
              code: 'BOARDING PASS // VIS-03',
              gate: 'GATE: SCHENGEN-VFS',
              tier: 'EUROPEAN UNION',
              title: 'Schengen European Tourist & Business Visa',
              route: 'INDIA -> 27 SCHENGEN NATIONS (FRANCE/SWISS/GERMANY)',
              description: 'Complete documentation file preparation, VFS / TLS appointment slot procurement, itinerary builder, and confirmed flight reservations.',
              specs: [
                { label: 'APPOINTMENT', value: 'VFS Priority Slotting' },
                { label: 'DOSSIER', value: 'Flight, Hotel & Cover Letter' },
                { label: 'INSURANCE', value: '€30,000 Schengen Compliant' }
              ],
              enquiryServiceType: 'Visa',
              presetName: 'Schengen European Visa'
            })}

            {renderBoardingPass({
              code: 'BOARDING PASS // VIS-04',
              gate: 'GATE: ASEAN-ICA',
              tier: 'FAR EAST EXPRESS',
              title: 'Singapore & Malaysia E-Visa Clearance',
              route: 'TRICHY / CHENNAI -> SINGAPORE ICA & MALAYSIA MDAC',
              description: 'Singapore authorized agent submission and Malaysia electronic travel pass. Seamless holiday and transit approvals.',
              specs: [
                { label: 'PROCESSING', value: '2-3 Working Days' },
                { label: 'DOCUMENTS', value: 'Tickets + Hotel Voucher' },
                { label: 'RATE', value: 'Consolidator Direct Fee' }
              ],
              enquiryServiceType: 'Visa',
              presetName: 'Singapore & Malaysia E-Visa'
            })}
          </div>
        </div>
      )}

      {/* 5. SUB-TAB 4: AIR CARGO & AWB */}
      {subTab === 'cargo' && (
        <div className="space-y-6">
          <div className="border-b border-[#e2e8f0] pb-2 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h3 className="font-display text-xl text-[#0b192c]">
                Air Cargo Freight & International Logistics Desk
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Worldwide air cargo consolidation, customs clearance, excess baggage, and live Air Waybill tracking.
              </p>
            </div>
            <button
              onClick={() => onOpenEnquiry('Cargo', 'Air Cargo Freight & AWB Booking')}
              className="px-4 py-2 bg-[#f59e0b] hover:bg-[#d97706] text-[#0b192c] text-xs font-mono-data font-black transition-colors cursor-pointer"
            >
              Send Cargo Inquiry
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderBoardingPass({
              code: 'CARGO DOCKET // CRG-01',
              gate: 'TERMINAL: AIR-CARGO-LOGISTICS',
              tier: 'COMMERCIAL CONSIGNMENT',
              title: 'Commercial Export Air Cargo (General Goods)',
              route: 'TRICHY / CHENNAI AIRPORT -> WORLDWIDE AIR FREIGHT HUBS',
              description: 'Bulk commercial consignments, garment shipments, industrial spares, and electronics via scheduled international cargo flights.',
              specs: [
                { label: 'TARIFF RATIO', value: '1 CBM = 167 KG (Standard)' },
                { label: 'CUSTOMS', value: 'Terminal Clearance Included' },
                { label: 'BILLING', value: 'Direct Master Air Waybill' }
              ],
              enquiryServiceType: 'Cargo',
              presetName: 'Commercial Export Air Cargo'
            })}

            {renderBoardingPass({
              code: 'CARGO DOCKET // CRG-02',
              gate: 'TERMINAL: PAX-EXCESS',
              tier: 'UNACCOMPANIED BAGGAGE',
              title: 'Passenger Excess Baggage by Air Cargo',
              route: 'ORIGIN AIRPORT -> DESTINATION TERMINAL CARGO HOLD',
              description: 'Save up to 70% compared to airline excess baggage fees. Ship 25 KG to 500 KG of personal effects safely ahead of your flight.',
              specs: [
                { label: 'WEIGHT TIER', value: '25 KG - 500 KG' },
                { label: 'COST REDUCTION', value: 'Save Up to 70%' },
                { label: 'DELIVERY', value: 'Airport Cargo Terminal' }
              ],
              enquiryServiceType: 'Cargo',
              presetName: 'Passenger Excess Baggage Cargo',
              priorityAlert: '70% CHEAPER THAN AIRLINES'
            })}
          </div>

          {/* Live AWB Tracker Tool */}
          <div className="pt-4 border-t border-[#e2e8f0]">
            <CargoTracker 
              currency={currency} 
              onOpenEnquiry={onOpenEnquiry}
            />
          </div>
        </div>
      )}

      {/* 6. SUB-TAB 5: TRAVEL INSURANCE */}
      {subTab === 'insurance' && (
        <div className="space-y-6">
          <div className="border-b border-[#e2e8f0] pb-2">
            <h3 className="font-display text-xl text-[#0b192c]">
              Overseas Travel Medical & Baggage Insurance Boarding Passes
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Comprehensive emergency medical cover, cashless hospitalizations, flight delays, and lost luggage compensation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderBoardingPass({
              code: 'BOARDING PASS // INS-01',
              gate: 'GATE: GLOBAL-MED',
              tier: 'WORLDWIDE COVERAGE',
              title: 'International Comprehensive Travel Insurance ($500,000)',
              route: 'INDIA -> WORLDWIDE CASHLESS MEDICAL NETWORK',
              description: 'Covers sudden medical illness, accidents, emergency dental, flight cancellations, lost passports, and baggage delays globally.',
              specs: [
                { label: 'SUM INSURED', value: 'Up to $500,000 USD' },
                { label: 'NETWORK', value: 'Worldwide Cashless' },
                { label: 'CLAIM DESK', value: '24/7 Multi-Lingual Help' }
              ],
              enquiryServiceType: 'Miscellaneous',
              presetName: 'International Comprehensive Travel Insurance'
            })}

            {renderBoardingPass({
              code: 'BOARDING PASS // INS-02',
              gate: 'GATE: EU-SCHENGEN',
              tier: 'EMBASSY APPROVED',
              title: 'Schengen Visa Mandatory Insurance (€30,000 Zero Deductible)',
              route: 'APPLICANT -> 100% COMPLIANT EMBASSY POLICY PDF',
              description: 'Guaranteed compliance with European consulate visa requirements. Repatriation of remains, emergency evacuation, and cashless hospital admission.',
              specs: [
                { label: 'COVERAGE', value: '€30,000 / $50,000' },
                { label: 'DEDUCTIBLE', value: 'Zero Deductible' },
                { label: 'DELIVERY', value: 'Instant Digital Policy' }
              ],
              enquiryServiceType: 'Miscellaneous',
              presetName: 'Schengen Visa Mandatory Insurance',
              priorityAlert: '100% EMBASSY ACCEPTANCE'
            })}
          </div>
        </div>
      )}

      {/* 7. SUB-TAB 6: FOREX & CURRENCY */}
      {subTab === 'forex' && (
        <div className="space-y-6">
          <div className="border-b border-[#e2e8f0] pb-2">
            <h3 className="font-display text-xl text-[#0b192c]">
              Foreign Exchange & Multi-Currency Travel Cards
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              RBI compliant foreign currency banknotes, contactless prepaid multi-currency cards, and outward educational remittances.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderBoardingPass({
              code: 'BOARDING PASS // FRX-01',
              gate: 'GATE: VISA-CHIP',
              tier: 'ZERO MARKUP CARD',
              title: 'Multi-Currency Contactless Forex Card',
              route: 'INDIA -> ATM WITHDRAWALS & POS TAP IN 16+ CURRENCIES',
              description: 'Lock in competitive foreign exchange rates for USD, AED, SAR, EUR, GBP, SGD, and MYR. Zero cross-currency conversion markups on tap.',
              specs: [
                { label: 'CURRENCIES', value: '16+ Global Currencies' },
                { label: 'RELOAD', value: 'Instant Mobile App Top-up' },
                { label: 'SECURITY', value: 'EMV Chip & PIN Protected' }
              ],
              enquiryServiceType: 'Miscellaneous',
              presetName: 'Multi-Currency Forex Card'
            })}

            {renderBoardingPass({
              code: 'BOARDING PASS // FRX-02',
              gate: 'GATE: CASH-COUNTER',
              tier: 'PHYSICAL BANKNOTES',
              title: 'Foreign Currency Cash Notes (USD, AED, SAR)',
              route: 'AUTHORIZED BRANCH -> CRISP UNTORN CURRENCY CASH',
              description: 'Genuine verified currency notes for immediate airport expenses, transit taxis, hotel deposits, and visa on arrival fees abroad.',
              specs: [
                { label: 'AVAILABLE', value: 'USD, AED, SAR, QAR, EUR' },
                { label: 'CONDITION', value: 'Crisp, Clean Serial Notes' },
                { label: 'PICKUP', value: 'Adirampattinam / Trichy' }
              ],
              enquiryServiceType: 'Miscellaneous',
              presetName: 'Foreign Currency Notes Exchange'
            })}
          </div>
        </div>
      )}

      {/* 8. SUB-TAB 7: HOTELS, TRANSFERS & UMRAH */}
      {subTab === 'hospitality' && (
        <div className="space-y-6">
          <div className="border-b border-[#e2e8f0] pb-2">
            <h3 className="font-display text-xl text-[#0b192c]">
              Hotel Reservations, Airport Transfers & Umrah Packages
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Direct hotel allocations in Dubai, Makkah, Madinah, Singapore, and certified airport cab transfers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderBoardingPass({
              code: 'BOARDING PASS // HSP-01',
              gate: 'GATE: HOTEL-RES',
              tier: 'GLOBAL ACCOMMODATION',
              title: 'Worldwide Hotel & Apartment Reservations',
              route: 'DIRECT INVENTORY -> DUBAI, MAKKAH, MADINAH, SINGAPORE',
              description: 'Curated 3-star, 4-star, and luxury 5-star hotel rooms near major international terminals, central business districts, and the holy harams.',
              specs: [
                { label: 'POPULAR HUBS', value: 'Dubai Deira, Makkah Towers' },
                { label: 'VOUCHER', value: 'Instant Confirmed Booking' },
                { label: 'SUPPORT', value: 'Early Check-in Requests' }
              ],
              enquiryServiceType: 'Hotel',
              presetName: 'Worldwide Hotel Reservation'
            })}

            {renderBoardingPass({
              code: 'BOARDING PASS // HSP-02',
              gate: 'GATE: CAB-TRANSFER',
              tier: 'CHAUFFEUR TRANSIT',
              title: 'Airport Taxi & Chauffeur Pickup Transfers',
              route: 'DOORSTEP (ADIRAMPATTINAM/PATTUKKOTTAI) -> TRICHY / CHENNAI',
              description: 'Punctual AC sedan, Innova, and Tempo Traveller transfers with flight delay monitoring, professional chauffeurs, and luggage assistance.',
              specs: [
                { label: 'FLEET', value: 'Dzire, Innova Crysta, Van' },
                { label: 'COVERAGE', value: 'TRZ, MAA, IXM Airports' },
                { label: 'MONITORING', value: 'Flight Delay Tracked' }
              ],
              enquiryServiceType: 'Transfer',
              presetName: 'Airport Taxi & Chauffeur Transfer'
            })}

            {renderBoardingPass({
              code: 'BOARDING PASS // HSP-03',
              gate: 'GATE: PILGRIMAGE-DESK',
              tier: 'DIRECT GROUP ALLOCATION',
              title: 'Umrah Pilgrimage Packages & Visa Guidance',
              route: 'TAMIL NADU -> JEDDAH / MADINAH WITH HARAMAIN STAY',
              description: 'Group and individual Umrah departures with direct Saudi flights, hotel stays in close walking proximity to Haram, daily meals, and guided ziyarat.',
              specs: [
                { label: 'INCLUSIONS', value: 'Flights, Visa, Hotel, Ziyarat' },
                { label: 'GUIDANCE', value: 'Experienced Tamil Scholar' },
                { label: 'STAY', value: 'Walking Distance to Haram' }
              ],
              enquiryServiceType: 'Package',
              presetName: 'Umrah Pilgrimage Package',
              priorityAlert: 'SEASONAL DEPARTURES'
            })}
          </div>
        </div>
      )}

      {/* 9. PERSISTENT SCROLLING 'SEND INQUIRY' CALL-TO-ACTION BAR */}
      {isSecondaryService && (
        <aside 
          aria-label="Persistent Service Inquiry Dock"
          className="fixed bottom-3 sm:bottom-4 left-3 right-3 sm:left-6 sm:right-6 max-w-5xl mx-auto z-40 bg-[#0b192c] text-[#f8fafc] border border-[#e2e8f0]/40 shadow-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 animate-fadeIn"
        >
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-[#f59e0b] rounded-full animate-ping shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono-data uppercase text-[#f59e0b] font-bold tracking-wider">
                  DIRECT DESK ASSISTANCE • {serviceMetadata[subTab].badge}
                </span>
              </div>
              <p className="text-xs text-slate-300 hidden sm:block">
                {serviceMetadata[subTab].subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={CONTACT_NUMBERS.services.tel}
              className="px-3 py-2 bg-[#f8fafc] text-[#0b192c] text-xs font-mono-data font-bold hover:bg-[#e2e8f0] transition-colors border border-[#e2e8f0] flex items-center gap-1 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-[#0ea5e9]" />
              <span className="hidden sm:inline">Services Desk:</span>
              <span>+91 {CONTACT_NUMBERS.services.formatted}</span>
            </a>

            <button
              onClick={() => onOpenEnquiry(serviceMetadata[subTab].enquiryType, serviceMetadata[subTab].defaultPreset)}
              className="px-4 sm:px-5 py-2 bg-[#f59e0b] hover:bg-[#d97706] text-[#0b192c] text-xs font-mono-data font-black transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <FileText className="w-3.5 h-3.5 text-[#0b192c]" />
              <span>Send {serviceMetadata[subTab].shortName} Inquiry</span>
            </button>
          </div>
        </aside>
      )}

      {/* 10. Bottom Physical Desk Footnote */}
      <div className="bg-[#f8fafc] border border-[#e2e8f0] p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-0.5">
          <span className="text-xs font-mono-data text-[#0b192c] font-bold block">
            DIRECT PHYSICAL SERVICE COUNTERS • ADIRAMPATTINAM & MADUKKUR ONLY
          </span>
          <p className="text-xs text-slate-600">
            Visit our authorized branch counters at {LOCATIONS.adirampattinam.address} or {LOCATIONS.madukkur.address} for in-person document filing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={CONTACT_NUMBERS.services.tel}
            className="px-4 py-2 bg-[#0b192c] hover:bg-[#0ea5e9] text-white text-xs font-mono-data font-semibold transition-colors cursor-pointer"
          >
            Direct Services Desk: +91 {CONTACT_NUMBERS.services.formatted}
          </a>
          <button
            onClick={() => onOpenEnquiry('Miscellaneous', 'General Service Inquiry')}
            className="px-4 py-2 bg-[#f59e0b] hover:bg-[#d97706] text-[#0b192c] text-xs font-mono-data font-bold transition-colors cursor-pointer"
          >
            Send General Inquiry
          </button>
        </div>
      </div>

    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Plane, 
  FileCheck2, 
  Globe, 
  Package, 
  CreditCard, 
  Users, 
  Phone, 
  Mail, 
  MessageCircle, 
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { CONTACT_NUMBERS } from '../data/contactInfo';

interface FaqViewProps {
  onBack: () => void;
  onOpenEnquiry?: (serviceType?: any, destPreset?: string) => void;
}

interface FaqItem {
  id: string;
  category: 'flights' | 'passport' | 'visas' | 'cargo' | 'group' | 'payments';
  question: string;
  answer: string;
}

export const FaqView: React.FC<FaqViewProps> = ({ onBack, onOpenEnquiry }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['faq-1', 'faq-4']));

  const faqItems: FaqItem[] = [
    {
      id: 'faq-1',
      category: 'flights',
      question: 'How do I complete web check-in and obtain my boarding pass?',
      answer: 'Airlines open web check-in 24 to 48 hours prior to scheduled departure. You can click "Web Check-in & Tracker" in our navigation bar, enter your 6-character Airline PNR and passenger surname, and directly choose your seats and download your PDF boarding pass with mobile QR code.'
    },
    {
      id: 'faq-2',
      category: 'flights',
      question: 'What is the difference between Hand Baggage and Checked Baggage?',
      answer: 'Hand baggage (cabin bag) is taken inside the aircraft cabin, normally limited to 7 kg (dimensions 55cm x 35cm x 25cm). Checked baggage is surrendered at the airport check-in counter and stowed in the aircraft cargo hold (standard international allowance is 20kg to 35kg depending on the airline and ticket tier).'
    },
    {
      id: 'faq-3',
      category: 'flights',
      question: 'Can I change my flight travel date after the ticket is issued?',
      answer: 'Yes. Most flight tickets permit date rescheduling subject to airline change penalties plus any applicable difference in fare. Simply contact our ticket desk at +91 9384567440 or general helpline at +91 6369012360 with your PNR, and our executive desk will calculate the exact reissue cost and assist immediately.'
    },
    {
      id: 'faq-4',
      category: 'passport',
      question: 'What documents are required for fresh or renewal Passport Seva?',
      answer: 'For a fresh passport: Aadhaar Card (with matching name and date of birth), Proof of Date of Birth (Birth Certificate or 10th Marksheet), and residential address proof. For renewal: Original existing passport, copies of first/last page and ECR/ECNR page, plus updated Aadhaar card. Our desk verifies all documents prior to your POPSK appointment.'
    },
    {
      id: 'faq-5',
      category: 'passport',
      question: 'How fast can I get an appointment under the Tatkaal scheme?',
      answer: 'Under the Tatkaal Passport scheme, appointment slots open daily on the Passport Seva Portal and are generally available within 1 to 3 working days. Once verified at the PSK/RPO, Tatkaal passports are printed and dispatched by India Post within 24 to 72 hours.'
    },
    {
      id: 'faq-6',
      category: 'visas',
      question: 'How long does a Dubai / UAE tourist visa take to process?',
      answer: 'Standard UAE 30-day and 60-day tourist visas are typically processed and issued by GDRFA/ICP immigration within 24 to 48 business hours. We provide express emergency filing options for urgent same-day departures.'
    },
    {
      id: 'faq-7',
      category: 'visas',
      question: 'What is the required passport validity for international travel?',
      answer: 'Almost all countries (including UAE, Saudi Arabia, Singapore, Malaysia, and Schengen states) strictly mandate that your passport must be valid for at least 6 months beyond your scheduled date of arrival. Travel will be denied at immigration if your passport has less than 6 months validity remaining.'
    },
    {
      id: 'faq-8',
      category: 'cargo',
      question: 'How do I track my Air Cargo shipment via Airway Bill (AWB)?',
      answer: 'Select the "Air Cargo" tab in our navigation bar and enter your 11-digit Airway Bill number (e.g., 098-12345678). You will see real-time milestone timestamps including cargo receipt, customs departure clearance, transit uplift, landing, and final delivery release.'
    },
    {
      id: 'faq-9',
      category: 'cargo',
      question: 'What items are strictly prohibited in air cargo shipments?',
      answer: 'Under international aviation dangerous goods regulations, prohibited cargo includes uncertified lithium batteries, flammable aerosols, compressed gases, corrosive acids, explosives, counterfeit merchandise, and undeclared currency. Contact our cargo team for specialized dangerous goods handling.'
    },
    {
      id: 'faq-10',
      category: 'group',
      question: 'What are Wholesale Group Fares and who can book them?',
      answer: 'Wholesale Group Fares are pre-purchased block allocations contracted directly with airlines at significant volume discounts (often 20% to 40% below retail dynamic pricing). They are ideal for families of 5+, corporate delegations, sports teams, wedding groups, and Umrah pilgrim groups.'
    },
    {
      id: 'faq-11',
      category: 'payments',
      question: 'Which payment currencies and methods do you accept?',
      answer: 'We accept Indian Rupees (INR), US Dollars (USD), UAE Dirhams (AED), Saudi Riyals (SAR), Euros (EUR), and British Pounds (GBP). Accepted payment channels include Direct Bank NEFT/RTGS/IMPS, UPI, Net Banking, International Wire Transfers, and authorized branch cash deposits.'
    },
    {
      id: 'faq-12',
      category: 'payments',
      question: 'How long does it take to receive a ticket refund after cancellation?',
      answer: 'Once an airline processes the credit note, our accounts desk reconciles the refund and disburses funds to your original payment account within 7 to 14 working days. We provide formal credit receipt documentation for your financial records.'
    },
    {
      id: 'faq-13',
      category: 'flights',
      question: 'Can I select my preferred seat and special meals in advance?',
      answer: 'Yes. During ticket booking or via our Web Check-in portal, you can select standard or extra legroom seats. You can also pre-book complimentary dietary meals including Muslim Halal Meal (MOML), Hindu Non-Vegetarian (HNML), Jain Vegetarian (VJML), and Diabetic or Child meals at least 24 hours before flight departure.'
    },
    {
      id: 'faq-14',
      category: 'flights',
      question: 'What happens if my connecting flight is delayed or missed on a single PNR?',
      answer: 'If your flights are booked under a single consolidated ticket/PNR with official minimum connect time (MCT), the operating carrier is legally obligated under Montreal Convention terms to re-accommodate you on the next available flight at no charge, along with transit hotel accommodation and meal vouchers if the delay exceeds 4 hours.'
    },
    {
      id: 'faq-15',
      category: 'passport',
      question: 'What is the difference between ECR (Emigration Check Required) and Non-ECR passports?',
      answer: 'An ECR passport is issued to applicants who have not passed Matriculation (10th standard). Citizens with ECR status require Emigration Clearance from the Protector of Emigrants (POE) to work in 18 designated ECR nations (including UAE, Saudi Arabia, Qatar, Oman). If you have educational certificates of 10th grade or above, or paid income tax for 1 year, you qualify for Non-ECR status with unrestricted travel.'
    },
    {
      id: 'faq-16',
      category: 'passport',
      question: 'How can I update my address or change my surname after marriage in my passport?',
      answer: 'To update your address or surname, a "Re-issue of Passport" application must be filed on the Passport Seva portal. For address updates, Aadhaar or bank passbook with photo is submitted. For surname change after marriage, joint marriage certificate or a self-declaration affidavit is required along with your existing passport.'
    },
    {
      id: 'faq-17',
      category: 'visas',
      question: 'Can Indian passport holders travel to Thailand and Malaysia Visa-Free?',
      answer: 'Thailand and Malaysia have ongoing bilateral visa-free entry exemptions for Indian tourists for stays up to 30 days. Travelers must hold a confirmed return flight ticket, proof of sufficient funds (e.g. $500 or equivalent currency), and hotel reservation vouchers for presentation at arrival immigration counters.'
    },
    {
      id: 'faq-18',
      category: 'visas',
      question: 'What is Certificate Attestation, HRD, and MEA Apostille?',
      answer: 'Educational, commercial, and personal certificates (such as degrees, birth, and marriage certificates) intended for legal use in overseas employment or migration must undergo state HRD authentication, Ministry of External Affairs (MEA) Apostille, and Embassy attestation in New Delhi. MMS provides complete end-to-end doorstep pickup, attestation, and courier delivery.'
    },
    {
      id: 'faq-19',
      category: 'cargo',
      question: 'Do you provide specialized cold-chain and temperature-controlled air cargo?',
      answer: 'Yes. MMS Air Cargo handles active Envirotainer refrigerated shipments (+2°C to +8°C, and -20°C deep freeze) for pharmaceuticals, diagnostics, fresh fruits, vegetables, and seafood with continuous data logger telemetry. We also arrange compassionate expedited transport of human remains with full embassy clearances.'
    },
    {
      id: 'faq-20',
      category: 'group',
      question: 'How far in advance can corporate, sports, or pilgrim group fares be blocked?',
      answer: 'Group fares for 10 or more passengers can be contracted and blocked up to 11 months in advance with a nominal initial deposit. Name lists can generally be submitted 14 to 21 days before departure, allowing corporate organizers and tour managers maximum passenger flexibility without dynamic fare hikes.'
    }
  ];

  const toggleAccordion = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const categories = [
    { key: 'all', label: 'All Questions', icon: <Sparkles className="w-4 h-4" /> },
    { key: 'flights', label: 'Flights & Check-in', icon: <Plane className="w-4 h-4" /> },
    { key: 'passport', label: 'Passport Seva', icon: <FileCheck2 className="w-4 h-4" /> },
    { key: 'visas', label: 'Visas & Immigration', icon: <Globe className="w-4 h-4" /> },
    { key: 'cargo', label: 'Air Cargo & AWB', icon: <Package className="w-4 h-4" /> },
    { key: 'group', label: 'Group Fares', icon: <Users className="w-4 h-4" /> },
    { key: 'payments', label: 'Payments & Refunds', icon: <CreditCard className="w-4 h-4" /> }
  ];

  const filteredFaqs = useMemo(() => {
    return faqItems.filter(item => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        item.question.toLowerCase().includes(q) || 
        item.answer.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [faqItems, activeCategory, searchQuery]);

  return (
    <div className="w-full min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-12">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#006097] hover:text-[#004870] transition-colors cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Agency Portal</span>
          </button>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <HelpCircle className="w-4 h-4 text-[#006097]" />
            <span>Help Desk Knowledge Base</span>
          </div>
        </div>

        {/* Hero & Search Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-5 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#006097] text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Customer Care & Travel Guidelines</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight font-display">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Find immediate answers regarding flight bookings, passport seva filings, consular visa stamping, air cargo shipments, and wholesale bulk seat allocations.
          </p>

          {/* Search Bar */}
          <div className="relative pt-2">
            <div className="absolute inset-y-0 left-0 pl-3.5 pt-2 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword (e.g. passport, tatkaal, baggage, refund, cargo)..."
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#006097] focus:bg-white transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-5 text-xs text-slate-400 hover:text-slate-700"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {categories.map(c => (
              <button
                key={c.key}
                onClick={() => setActiveCategory(c.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeCategory === c.key
                    ? 'bg-[#006097] text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {c.icon}
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1 pb-1">
            <span className="font-semibold text-slate-700">
              Showing {filteredFaqs.length} of 20 official travel questions
            </span>
            <span>Click any question to view official guidelines</span>
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 shadow-sm space-y-3">
              <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No matching questions found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                We couldn't find an answer matching "{searchQuery}". Our human travel desk is available 24/7 to assist you.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer transition-colors"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = expandedIds.has(faq.id);
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm font-bold text-slate-900 leading-snug">
                      {faq.question}
                    </span>
                    <span className="p-1 rounded-full bg-slate-100 text-slate-500 shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/30">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Clear CTA Footer: Still have questions? */}
        <div className="bg-gradient-to-r from-[#006097] to-[#002b49] rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-bold text-white">Still Have Questions?</h3>
            <p className="text-xs text-blue-100 max-w-md">
              Speak directly with a licensed ticketing officer or visa specialist at our Adirampattinam or Madukkur offices.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={CONTACT_NUMBERS.general.tel}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow"
            >
              <Phone className="w-4 h-4" />
              <span>Call +91 {CONTACT_NUMBERS.general.formatted}</span>
            </a>
            <a
              href={CONTACT_NUMBERS.ticket.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Tickets</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

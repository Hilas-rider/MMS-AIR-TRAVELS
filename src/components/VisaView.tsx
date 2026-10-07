import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Search, 
  Calendar, 
  Globe, 
  ArrowRight, 
  HelpCircle, 
  FileCheck,
  MessageSquare,
  Sparkles,
  ClipboardList
} from 'lucide-react';
import { VISA_SERVICES } from '../data/visaData';
import { VisaService, CurrencyCode, VisaEnquiryFormData } from '../types';
import { formatCurrency } from '../data/airports';
import { CONTACT_NUMBERS } from '../data/contactInfo';
import { VisaEnquiryForm } from './VisaEnquiryForm';

interface VisaViewProps {
  currency: CurrencyCode;
  visas?: VisaService[];
  onOpenEnquiry: (serviceType: any, destPreset?: string) => void;
}

export const VisaView: React.FC<VisaViewProps> = ({ currency, visas, onOpenEnquiry }) => {
  const [activeTab, setActiveTab] = useState<'form' | 'browse'>('form');
  const [searchQuery, setSearchQuery] = useState('');
  const allVisas = visas && visas.length > 0 ? visas : VISA_SERVICES;
  const [selectedVisa, setSelectedVisa] = useState<VisaService>(allVisas[0]);
  const [formCountryPreset, setFormCountryPreset] = useState<string>('');

  const filteredVisas = allVisas.filter(v => 
    v.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.visaType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getConvertedFee = (feeINR: number) => {
    if (currency === 'INR') return `₹${feeINR.toLocaleString('en-IN')}`;
    const usd = Math.round(feeINR / 83);
    return formatCurrency(usd, currency);
  };

  const handleSelectCountryForForm = (countryName: string) => {
    setFormCountryPreset(countryName);
    setActiveTab('form');
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-blue-900/60 relative overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-amber-400 font-black text-xs uppercase tracking-widest flex items-center gap-1.5">
              <FileCheck className="w-4 h-4" />
              GLOBAL EMBASSY ACCREDITED DESK • B2B EXPRESS VISA
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Worldwide Visa Assistance & B2B Rates Processing
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Hassle-free tourist, business, work, and Umrah visas with 99.8% approval rate. Instant automated WhatsApp confirmation sent directly to your registered phone number upon enquiry.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center sm:text-left shrink-0">
            <div className="text-2xl font-black text-amber-400 font-mono">100,000+</div>
            <div className="text-xs text-white font-semibold">Visas Processed Successfully</div>
            <div className="mt-2 text-[11px] text-emerald-400 font-bold flex items-center justify-center sm:justify-start gap-1">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp API Notifications</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-7 pt-5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 bg-slate-900/90 p-1 rounded-2xl border border-slate-700/80">
            <button
              type="button"
              onClick={() => setActiveTab('form')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'form'
                  ? 'bg-[#b91c1c] text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>VISA ENQUIRY FORM (B2B Rates)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('browse')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'browse'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Browse Countries & Embassy Checklists</span>
            </button>
          </div>

          {activeTab === 'browse' && (
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Search country (e.g. Dubai, UK, USA)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-semibold text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'form' ? (
        <div className="space-y-6">
          {/* Faithful reproduction of the uploaded image VISA ENQUIRY FORM with WhatsApp API helper */}
          <VisaEnquiryForm 
            initialCountry={formCountryPreset}
            onSubmitSuccess={(data) => {
              // optional callback
            }}
          />

          {/* Quick link to browse checklist */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">Need embassy document requirements & guidelines?</h4>
                <p className="text-xs text-slate-500">Check required photo specifications, visa validity, stay rules, and consular processing times.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('browse')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer shrink-0"
            >
              View Country Checklists
            </button>
          </div>
        </div>
      ) : (
        /* Browse Countries & Guidelines */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Visa Countries List */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600" />
                <span>Select Destination Country</span>
              </span>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                {filteredVisas.length} Countries
              </span>
            </h3>

            <div className="space-y-2.5 max-h-[680px] overflow-y-auto pr-1">
              {filteredVisas.map((visa) => {
                const isSelected = selectedVisa.id === visa.id;
                return (
                  <div
                    key={visa.id}
                    onClick={() => setSelectedVisa(visa)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-600 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{visa.flagEmoji}</span>
                      <div>
                        <h4 className="font-black text-sm text-slate-900">{visa.country}</h4>
                        <span className="text-[11px] text-slate-500 font-medium block">{visa.visaType}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-black text-xs text-blue-700 block font-mono">
                        {getConvertedFee(visa.feeINR)}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 justify-end">
                        <Clock className="w-3 h-3" /> {visa.processingTime}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Visa Details & Document Checklist */}
          <div className="lg:col-span-7 space-y-5">
            {selectedVisa && (
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
                
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{selectedVisa.flagEmoji}</span>
                    <div>
                      <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider block">
                        OFFICIAL EMBASSY PROGRAMME
                      </span>
                      <h3 className="text-xl font-black text-slate-900">{selectedVisa.country}</h3>
                      <p className="text-xs text-slate-500 font-semibold">{selectedVisa.visaType}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Consultation & Govt Fee</span>
                    <span className="text-2xl font-black text-slate-900 font-mono">
                      {getConvertedFee(selectedVisa.feeINR)}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {selectedVisa.description}
                </p>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Processing Time</span>
                    <span className="font-bold text-slate-800">{selectedVisa.processingTime}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Visa Validity</span>
                    <span className="font-bold text-slate-800">{selectedVisa.validity}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Stay Duration</span>
                    <span className="font-bold text-slate-800">{selectedVisa.stayPeriod}</span>
                  </div>
                </div>

                {/* Mandatory Documents Checklist */}
                <div className="space-y-3">
                  <h4 className="font-black text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    Mandatory Document Checklist
                  </h4>

                  <div className="space-y-2">
                    {selectedVisa.documents.map((doc, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="font-medium">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Call to action */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                  <div className="text-xs text-slate-500">
                    <span>Questions? Call Visa Desk: </span>
                    <a href={CONTACT_NUMBERS.services.tel} className="text-slate-900 font-bold hover:underline font-mono">
                      +91 {CONTACT_NUMBERS.services.formatted}
                    </a>
                  </div>

                  <button
                    onClick={() => handleSelectCountryForForm(selectedVisa.country)}
                    className="px-6 py-3 rounded-xl bg-[#b91c1c] hover:bg-[#991b1b] text-white font-black text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center gap-2"
                  >
                    <span>Fill Visa Enquiry Form for {selectedVisa.country}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

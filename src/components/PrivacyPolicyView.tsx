import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  FileText, 
  UserCheck, 
  Phone, 
  Mail, 
  MapPin, 
  ArrowLeft,
  Calendar
} from 'lucide-react';
import { CONTACT_NUMBERS } from '../data/contactInfo';

interface PrivacyPolicyViewProps {
  onBack: () => void;
}

export const PrivacyPolicyView: React.FC<PrivacyPolicyViewProps> = ({ onBack }) => {
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
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <Calendar className="w-3.5 h-3.5" />
            <span>Last Updated: September 14, 2026</span>
          </div>
        </div>

        {/* Header Hero */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#006097] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Global Aviation & Travel Privacy Standard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight font-display">
            Privacy Policy & Data Protection Charter
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
            MMS Air Travels & Cargo Service ("we", "our", or "us"), operating in Adirampattinam, Tamil Nadu, India, respects your privacy and is committed to protecting the personal, travel, passport, and cargo logistics data entrusted to us. This charter outlines our compliance with the Indian Digital Personal Data Protection (DPDP) Act 2023, the European General Data Protection Regulation (GDPR), and international Passenger Data Protection standards.
          </p>
        </div>

        {/* Core Policy Content */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-10 text-slate-700 text-sm leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#006097] text-white flex items-center justify-center text-xs">1</span>
              <span>Information We Collect</span>
            </h2>
            <p>
              To execute official airline ticketing, visa processing, passport seva appointments, and air cargo forwarding, we collect the following categories of data:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong>Passenger Identity Data:</strong> Full name as stated in government passport, title, date of birth, gender, nationality, and passport biographical page details (passport number, issue/expiry dates, issuing authority).</li>
              <li><strong>Contact & Communication Data:</strong> Mobile telephone number, WhatsApp contact, personal/corporate email address, residential address, and emergency overseas contact.</li>
              <li><strong>Travel Document Details:</strong> Visa copy, immigration clearance records (ECR/ECNR status), Seaman book (CDC) details for maritime travel, and vaccination/health certificates where mandated by destination countries.</li>
              <li><strong>Air Cargo Logistics Data:</strong> Consignor and consignee legal names, tax identification (GSTIN/IEC), commodity description, hazardous material declarations, and airway bill delivery addresses.</li>
              <li><strong>Payment & Transaction Information:</strong> Bank transfer references, UPI UTR numbers, and payment receipt confirmations. We <em>do not</em> store full credit card CVV numbers or banking PINs on our servers.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#006097] text-white flex items-center justify-center text-xs">2</span>
              <span>How We Use Your Data</span>
            </h2>
            <p>
              Your data is processed strictly for legitimate aviation and statutory travel facilitation:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Creating verified Passenger Name Records (PNR) directly in Global Distribution Systems (Amadeus, Sabre, Galileo) and airline reservation systems.</li>
              <li>Booking official appointments on the Ministry of External Affairs (MEA) Passport Seva Portal (PSK/POPSK) and submitting visa files to foreign embassies/consulates.</li>
              <li>Filing cargo electronic manifests with customs authorities and commercial cargo carriers.</li>
              <li>Sending live flight schedule updates, gate changes, AWB airway bill status notifications, and e-ticket PDFs via SMS, WhatsApp, or Email.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#006097] text-white flex items-center justify-center text-xs">3</span>
              <span>Third-Party Data Transfers</span>
            </h2>
            <p>
              By booking through our agency, you understand and acknowledge that travel inherently requires international transmission of passenger data to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Operating and codeshare airlines (e.g. Air India, Emirates, Saudia, Qatar Airways, Singapore Airlines, Indigo).</li>
              <li>Government immigration departments, border control authorities (APIS - Advance Passenger Information System), and destination consulates.</li>
              <li>Airport ground handling agents, accredited consolidators, and bonded air freight carriers.</li>
            </ul>
            <p className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600">
              <strong>Guaranteed Anti-Sale Covenant:</strong> We will never sell, lease, rent, or trade your personal information or contact details to third-party telemarketing firms or commercial data brokers under any circumstances.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#006097] text-white flex items-center justify-center text-xs">4</span>
              <span>Data Security & Encryption</span>
            </h2>
            <p>
              All communication between your browser and our servers is secured with Transport Layer Security (TLS 1.3 / 256-bit AES encryption). Stored client records are firewalled with strict role-based access control, ensuring that only authorized licensed ticketing agents can view passenger passport copies.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#006097] text-white flex items-center justify-center text-xs">5</span>
              <span>Your Statutory Rights</span>
            </h2>
            <p>
              Under applicable privacy legislation, you have the right to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Request a copy of the personal information we hold about you.</li>
              <li>Request correction of inaccurate or outdated passport/contact records before ticket issuance.</li>
              <li>Request deletion of non-statutory records once your travel and regulatory audit retention periods have elapsed.</li>
              <li>Withdraw consent for promotional flight deal alerts at any time.</li>
            </ul>
          </section>

          {/* Section 6: Grievance Officer */}
          <section className="bg-blue-50/60 rounded-xl p-5 sm:p-6 border border-blue-200/80 space-y-3">
            <h3 className="text-base font-bold text-[#006097] flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span>Grievance Officer & Data Protection Contact</span>
            </h3>
            <p className="text-xs text-slate-700">
              For questions, access requests, or privacy concerns, contact our designated Data Protection Officer:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-800 font-medium pt-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#006097] shrink-0" />
                <span>MMS Air Travels, Adirampattinam & Madukkur, TN, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#006097] shrink-0" />
                <a href={CONTACT_NUMBERS.general.tel} className="hover:underline">+91 {CONTACT_NUMBERS.general.formatted}</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#006097] shrink-0" />
                <a href="mailto:mmsairtravels@gmail.com" className="hover:underline">mmsairtravels@gmail.com</a>
              </div>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
};

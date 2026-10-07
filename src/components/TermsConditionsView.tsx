import React from 'react';
import { 
  FileText, 
  Scale, 
  Plane, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowLeft,
  Calendar,
  AlertTriangle
} from 'lucide-react';

interface TermsConditionsViewProps {
  onBack: () => void;
}

export const TermsConditionsView: React.FC<TermsConditionsViewProps> = ({ onBack }) => {
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
            <span>Effective Date: September 14, 2026</span>
          </div>
        </div>

        {/* Header Hero */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider">
            <Scale className="w-4 h-4" />
            <span>General Conditions of Travel & Cargo Carriage</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight font-display">
            Terms of Service & Passenger Contract
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
            Please read these Terms and Conditions carefully before reserving flight tickets, wholesale seat blocks, tour packages, passport filings, or air freight shipments with MMS Air Travels & Cargo Service. By booking with us, you agree to be bound by these provisions.
          </p>
        </div>

        {/* Core Terms Content */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-10 text-slate-700 text-sm leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#006097] text-white flex items-center justify-center text-xs">1</span>
              <span>Role as Travel Intermediary & Contract of Carriage</span>
            </h2>
            <p>
              MMS Air Travels acts solely as a licensed travel facilitator, ticketing consolidator, and forwarding agent between you (the passenger/consignor) and operating airlines, hotel properties, tour operators, and cargo carriers.
            </p>
            <p className="text-slate-600">
              When a flight booking is confirmed, the formal Contract of Carriage is directly between the passenger and the operating airline. The airline’s specific tariff rules, fare conditions, and baggage guidelines apply in full to your ticket.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#006097] text-white flex items-center justify-center text-xs">2</span>
              <span>Name Accuracy & Identity Matching Mandate</span>
            </h2>
            <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-xl flex items-start gap-3 text-xs text-amber-950">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Aviation Regulatory Warning:</strong> All passenger names on flight tickets must strictly match the machine-readable zone (MRZ) of the passenger’s physical passport. Airlines strictly prohibit ticket transfers to another individual and may deny boarding or levy full cancellation penalties for post-ticketing spelling corrections.
              </div>
            </div>
            <p>
              Passengers are solely responsible for reviewing the draft itinerary sent by our travel desk before approving final issuance.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#006097] text-white flex items-center justify-center text-xs">3</span>
              <span>Cancellations, Date Changes & Refund Timelines</span>
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li><strong>Airline Cancellation Penalties:</strong> Cancellation fees are dictated directly by the airline fare rules (Refundable vs. Non-Refundable Fare classes). In addition to airline fees, our standard agency administrative handling fee is INR 500 / USD 10 per sector.</li>
              <li><strong>Group Block Fares:</strong> Special wholesale group fares, charter block allocations, and Umrah seasonal seats are sold under fixed inventory allocations and are strictly non-refundable and non-reroutable once tickets are issued.</li>
              <li><strong>Refund Processing Time:</strong> Approved refunds are credited back to the original source account within 7 to 14 business days upon receipt of funds from the operating carrier.</li>
              <li><strong>No-Show Penalties:</strong> Failure to cancel or reschedule at least 4 hours prior to scheduled departure time constitutes a "No-Show", which usually results in forfeiture of the entire base fare per airline policy.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#006097] text-white flex items-center justify-center text-xs">4</span>
              <span>Visa & Passport Government Service Disclaimer</span>
            </h2>
            <p>
              MMS Air Travels assists clients in preparing documents, filling online applications, and scheduling appointments for Passport Seva and foreign embassy visas.
            </p>
            <p className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700">
              <strong>Statutory Sovereignty Notice:</strong> The granting, denial, delay, or validity period of any visa, transit permit, or passport clearance is the sole, exclusive prerogative of the respective sovereign government or embassy. MMS Air Travels does not guarantee visa issuance and cannot be held financially or legally liable for consular rejections or processing delays.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#006097] text-white flex items-center justify-center text-xs">5</span>
              <span>Air Cargo & Freight Forwarding Liability</span>
            </h2>
            <p>
              Air freight shipments handled under MMS Air Travels airway bills are subject to the liability rules established by the <strong>Warsaw Convention (1929)</strong> or <strong>Montreal Convention (1999)</strong>.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Our maximum liability for lost or damaged cargo is strictly capped at statutory airline limits (currently 22 Special Drawing Rights [SDR] per kilogram) unless a higher declared value is submitted and relevant insurance premiums are paid prior to departure.</li>
              <li>Consignors warrant that shipments contain no undeclared hazardous goods, lithium batteries, flammable liquids, contraband, or restricted currency.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#006097] text-white flex items-center justify-center text-xs">6</span>
              <span>Force Majeure, Weather Delays & Flight Schedule Changes</span>
            </h2>
            <p>
              Airlines reserve the right to reschedule, reroute, delay, or cancel flights due to meteorological conditions, air traffic control restrictions, technical safety requirements, or geopolitical events. MMS Air Travels will proactively assist passengers in obtaining alternative routing or airline waivers, but bears no liability for consequential losses such as hotel bookings or missed events.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3 border-t border-slate-200 pt-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#006097] text-white flex items-center justify-center text-xs">7</span>
              <span>Governing Law & Legal Jurisdiction</span>
            </h2>
            <p className="text-xs text-slate-600">
              These terms and all transactions undertaken through MMS Air Travels are governed by the laws of India. Any disputes arising out of bookings, services, or contracts of carriage shall be subject to the exclusive jurisdiction of the competent courts in Pattukkottai / Thanjavur District, Tamil Nadu, India.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
};

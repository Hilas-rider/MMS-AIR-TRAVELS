import React, { useState } from 'react';
import { 
  Bus, 
  X, 
  MapPin, 
  Calendar, 
  Users, 
  Phone, 
  CheckCircle2, 
  MessageSquare, 
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowRight
} from 'lucide-react';
import { CONTACT_NUMBERS, LOCATIONS } from '../data/contactInfo';

interface BusBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChatWithIntent?: (intent: string) => void;
}

export const BusBookingModal: React.FC<BusBookingModalProps> = ({
  isOpen,
  onClose,
  onOpenChatWithIntent
}) => {
  const [fromCity, setFromCity] = useState('Madukkur');
  const [toCity, setToCity] = useState('Chennai');
  const [travelDate, setTravelDate] = useState('');
  const [passengers, setPassengers] = useState('1');
  const [boardingPoint, setBoardingPoint] = useState('Madukkur Bus Stand Complex');
  const [busType, setBusType] = useState('AC Sleeper (2+1)');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const popularRoutes = [
    { from: 'Madukkur', to: 'Chennai' },
    { from: 'Adirampattinam', to: 'Chennai' },
    { from: 'Pattukkottai', to: 'Bangalore' },
    { from: 'Madukkur', to: 'Coimbatore' },
    { from: 'Adirampattinam', to: 'Tirupur' },
    { from: 'Thanjavur', to: 'Chennai' }
  ];

  const handleSelectRoute = (f: string, t: string) => {
    setFromCity(f);
    setToCity(t);
  };

  const generateWhatsAppUrl = () => {
    const text = encodeURIComponent(
      `Hello MMS AIR TRAVELS, I need assistance with bus ticket booking:\n` +
      `• From: ${fromCity}\n` +
      `• To: ${toCity}\n` +
      `• Travel Date: ${travelDate || 'Earliest available'}\n` +
      `• Passengers: ${passengers}\n` +
      `• Preferred Boarding: ${boardingPoint}\n` +
      `• Bus Type: ${busType}\n` +
      `• Customer Name: ${customerName || 'Customer'}\n` +
      `• Phone: ${phone || 'Please call me'}\n\n` +
      `Please check available bus operators and fares.`
    );
    return `https://wa.me/91${CONTACT_NUMBERS.services.number}?text=${text}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#006097] to-[#007abd] p-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center border border-white/20">
              <Bus className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-white/10 px-2 py-0.5 rounded">
                MMS AIR TRAVELS • BUS SERVICES
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                Bus Ticket Booking Assistance
              </h3>
              <p className="text-xs text-blue-100">
                Serving Madukkur (Since 2020) & Adirampattinam (Since 2026)
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-7 space-y-6">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-bold text-slate-900">
                  Enquiry Received! 🚌
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Thank you! We have received your bus booking enquiry for <strong>{fromCity} → {toCity}</strong>. Our travel desk will check the latest seat availability and connect with you shortly.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={generateWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Continue on WhatsApp for Instant Booking</span>
                </a>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    onClose();
                  }}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Quick Route Pills */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Popular Tamil Nadu & Interstate Routes
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {popularRoutes.map((r, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectRoute(r.from, r.to)}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                        fromCity === r.from && toCity === r.to
                          ? 'bg-[#006097] text-white border-[#006097]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {r.from} → {r.to}
                    </button>
                  ))}
                </div>
              </div>

              {/* From & To */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    From City / Town *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input 
                      type="text"
                      required
                      value={fromCity}
                      onChange={(e) => setFromCity(e.target.value)}
                      placeholder="e.g. Madukkur, Adirampattinam"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#006097]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    To Destination *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input 
                      type="text"
                      required
                      value={toCity}
                      onChange={(e) => setToCity(e.target.value)}
                      placeholder="e.g. Chennai (Koyambedu/Tambaram)"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#006097]"
                    />
                  </div>
                </div>
              </div>

              {/* Date & Passengers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Travel Date *
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input 
                      type="date"
                      required
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#006097]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Number of Passengers *
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <select
                      value={passengers}
                      onChange={(e) => setPassengers(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#006097]"
                    >
                      <option value="1">1 Passenger</option>
                      <option value="2">2 Passengers</option>
                      <option value="3">3 Passengers</option>
                      <option value="4">4 Passengers</option>
                      <option value="5+">5+ Group Booking</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Boarding Point & Bus Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Preferred Boarding Point
                  </label>
                  <input 
                    type="text"
                    value={boardingPoint}
                    onChange={(e) => setBoardingPoint(e.target.value)}
                    placeholder="e.g. Madukkur Bus Stand, Adiram ECR"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#006097]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Bus Category
                  </label>
                  <select
                    value={busType}
                    onChange={(e) => setBusType(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#006097]"
                  >
                    <option value="AC Sleeper (2+1)">AC Sleeper (2+1)</option>
                    <option value="Non-AC Sleeper">Non-AC Sleeper</option>
                    <option value="Multi-Axle Scania/Volvo">Multi-Axle Luxury Volvo</option>
                    <option value="Semi-Sleeper AC">Semi-Sleeper AC</option>
                    <option value="Any Available">Any Available (Lowest Fare)</option>
                  </select>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Your Full Name *
                  </label>
                  <input 
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Mohamed Rahman"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#006097]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input 
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9500977442"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#006097]"
                    />
                  </div>
                </div>
              </div>

              {/* Note */}
              <p className="text-[11px] text-slate-500 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                ⚠️ <strong>Live Verification Notice</strong>: Bus seat availability and boarding times are checked live against certified omni-bus operators. Our desk will confirm your seat number and boarding pass.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#006097] hover:bg-[#004f7c] text-white font-bold text-xs transition-colors shadow-md cursor-pointer"
                >
                  Send Bus Enquiry
                </button>

                <a
                  href={generateWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp MMS AIR TRAVELS</span>
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Plane, 
  User, 
  CreditCard, 
  ShieldCheck, 
  Luggage, 
  Utensils, 
  Coffee, 
  CheckCircle2, 
  Printer, 
  Download, 
  ArrowRight,
  Sparkles,
  Lock
} from 'lucide-react';
import { Flight, CurrencyCode, FareOption, PassengerInfo, Booking } from '../types';
import { FARE_OPTIONS } from '../data/mockFlights';
import { formatCurrency } from '../data/airports';
import { generate8DigitPnr } from '../utils/referenceNumber';

interface BookingFlowModalProps {
  flight: Flight;
  fareTier: 'saver' | 'standard' | 'flexi';
  passengerCount: { adults: number; children: number; infants: number };
  currency: CurrencyCode;
  onClose: () => void;
  onCompleteBooking: (newBooking: Booking) => void;
}

export const BookingFlowModal: React.FC<BookingFlowModalProps> = ({
  flight,
  fareTier,
  passengerCount,
  currency,
  onClose,
  onCompleteBooking
}) => {
  const [step, setStep] = useState<'review' | 'passengers' | 'seats' | 'addons' | 'payment' | 'confirmed'>('review');
  const selectedFare = FARE_OPTIONS.find(f => f.tier === fareTier) || FARE_OPTIONS[1];

  const totalPassengers = passengerCount.adults + passengerCount.children + passengerCount.infants;

  // Passenger form state
  const [passengers, setPassengers] = useState<PassengerInfo[]>(() => {
    const list: PassengerInfo[] = [];
    for (let i = 0; i < passengerCount.adults; i++) {
      list.push({
        id: `adult-${i + 1}`,
        type: 'adult',
        title: 'Mr',
        firstName: i === 0 ? 'Jeeva' : '',
        lastName: i === 0 ? 'Kumar' : '',
        dob: '1994-08-15',
        nationality: 'India',
        passportNumber: i === 0 ? 'V8931024' : '',
        passportExpiry: '2032-12-31',
        seatNumber: '14A',
        mealPreference: 'Regular Meal',
        specialAssistance: false,
        extraBaggageKg: 0
      });
    }
    for (let i = 0; i < passengerCount.children; i++) {
      list.push({
        id: `child-${i + 1}`,
        type: 'child',
        title: 'Master',
        firstName: '',
        lastName: '',
        dob: '2016-04-10',
        nationality: 'India',
        passportNumber: '',
        passportExpiry: '2029-01-01',
        seatNumber: '14B',
        mealPreference: "Child's Meal",
        specialAssistance: false,
        extraBaggageKg: 0
      });
    }
    return list;
  });

  const [activePaxIndex, setActivePaxIndex] = useState<number>(0);

  // Contact Info
  const [contactEmail, setContactEmail] = useState('jeevijeeva9997@gmail.com');
  const [contactPhone, setContactPhone] = useState('+971 50 882 1944');

  // Add-ons
  const [addOns, setAddOns] = useState({
    travelInsurance: true,
    priorityBoarding: false,
    loungeAccess: false,
    carbonOffset: true
  });

  // Payment form
  const [cardNumber, setCardNumber] = useState('4532 8901 2345 7890');
  const [cardHolder, setCardHolder] = useState('JEEVA KUMAR');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('883');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Confirmed booking state
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Price calculations
  const basePricePerPax = Math.round(flight.basePrice * selectedFare.priceMultiplier);
  const subtotalBase = basePricePerPax * totalPassengers;
  const taxesAndAirportFees = Math.round(subtotalBase * 0.14);
  const insurancePrice = addOns.travelInsurance ? 24 * totalPassengers : 0;
  const priorityPrice = addOns.priorityBoarding ? 15 * totalPassengers : 0;
  const loungePrice = addOns.loungeAccess ? 45 * totalPassengers : 0;
  const carbonPrice = addOns.carbonOffset ? 5 * totalPassengers : 0;
  
  const totalAmountUSD = subtotalBase + taxesAndAirportFees + insurancePrice + priorityPrice + loungePrice + carbonPrice;

  // Seat selection helper
  const seatRows = [12, 14, 15, 16, 17, 18, 19, 20, 21, 22];
  const seatCols = ['A', 'B', 'C', 'D', 'E', 'F'];
  const occupiedSeats = ['12B', '12C', '14E', '15A', '16D', '17B', '18C', '19F', '21A', '22E'];

  const handleSeatClick = (seat: string) => {
    if (occupiedSeats.includes(seat)) return;
    setPassengers(prev => {
      const updated = [...prev];
      updated[activePaxIndex] = {
        ...updated[activePaxIndex],
        seatNumber: seat
      };
      return updated;
    });
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);
      const randomPnr = generate8DigitPnr();
      const randomEticket = `088-${Math.floor(1000000000 + Math.random() * 9000000000)}`;

      const newBooking: Booking = {
        id: `bkg-${Date.now()}`,
        pnr: randomPnr,
        eticketNumber: randomEticket,
        createdAt: new Date().toISOString(),
        tripType: 'one-way',
        departureFlight: flight,
        cabinClass: flight.cabinClass,
        fareTier: fareTier,
        passengers: passengers,
        contactEmail,
        contactPhone,
        totalPriceUSD: totalAmountUSD,
        currency: currency,
        paidAmount: totalAmountUSD,
        paymentMethod: `Credit Card (•••• ${cardNumber.slice(-4)})`,
        paymentStatus: 'PAID',
        bookingStatus: 'CONFIRMED',
        addOns
      };

      setConfirmedBooking(newBooking);
      onCompleteBooking(newBooking);
      setStep('confirmed');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Plane className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg">
                  Instant Flight Booking Engine
                </h3>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded uppercase border border-amber-400/30">
                  {flight.airlineCode} • {selectedFare.name}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {flight.origin.city} ({flight.origin.code}) → {flight.destination.city} ({flight.destination.code}) • {flight.departureDate}
              </p>
            </div>
          </div>

          <button
            id="close-booking-modal-btn"
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Progress Tabs */}
        {step !== 'confirmed' && (
          <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 overflow-x-auto">
            <div className="flex items-center justify-between min-w-[500px] text-xs font-bold">
              {[
                { id: 'review', label: '1. Review Flight' },
                { id: 'passengers', label: '2. Passengers' },
                { id: 'seats', label: '3. Seat Selection' },
                { id: 'addons', label: '4. Add-ons' },
                { id: 'payment', label: '5. Instant Payment' }
              ].map((s, idx) => {
                const isCurrent = step === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      if (step === 'payment' || step === 'addons' || step === 'seats' || step === 'passengers') {
                        setStep(s.id as any);
                      }
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                      isCurrent
                        ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* STEP 1: REVIEW */}
          {step === 'review' && (
            <div className="space-y-5">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{flight.airline}</span>
                    <span className="text-xs font-mono bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-semibold">
                      {flight.flightNumber}
                    </span>
                    <span className="text-xs text-slate-500">• {flight.aircraft}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    Guaranteed Live Seat Availability
                  </span>
                </div>

                <div className="grid grid-cols-3 items-center gap-4 text-center sm:text-left">
                  <div>
                    <div className="text-2xl font-black text-slate-900">{flight.departureTime}</div>
                    <div className="font-bold text-slate-800 text-sm">{flight.origin.code} - {flight.origin.city}</div>
                    <div className="text-xs text-slate-400">{flight.terminalDep} • {flight.origin.name}</div>
                  </div>

                  <div className="text-center">
                    <div className="text-xs text-slate-400 font-bold mb-1">
                      {Math.floor(flight.durationMinutes / 60)}h {flight.durationMinutes % 60}m
                    </div>
                    <div className="h-0.5 bg-slate-300 w-full relative">
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-amber-500" />
                    </div>
                    <div className="text-[11px] font-bold text-slate-600 mt-1">
                      {flight.stops === 0 ? 'Non-Stop Direct' : `1 Stop (${flight.layoverAirport?.code})`}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-black text-slate-900">{flight.arrivalTime}</div>
                    <div className="font-bold text-slate-800 text-sm">{flight.destination.code} - {flight.destination.city}</div>
                    <div className="text-xs text-slate-400">{flight.terminalArr} • {flight.destination.name}</div>
                  </div>
                </div>
              </div>

              {/* Fare & Baggage Inclusion */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Included Baggage</h4>
                  <div className="flex items-center gap-2 text-sm text-slate-800">
                    <Luggage className="w-4 h-4 text-amber-500" />
                    <span className="font-semibold">{selectedFare.checkedBaggage} checked allowance</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-800">
                    <Luggage className="w-4 h-4 text-slate-400" />
                    <span>{selectedFare.cabinBaggage} cabin bag</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Policy & Flexibility</h4>
                  <div className="flex items-center gap-2 text-sm text-slate-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="font-semibold">{selectedFare.refundPolicy}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{selectedFare.changePolicy}</span>
                  </div>
                </div>
              </div>

              {/* Fare Breakdown */}
              <div className="bg-slate-900 text-white rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Base Airfare ({totalPassengers} × {formatCurrency(basePricePerPax, currency)}):</span>
                  <span className="font-mono">{formatCurrency(subtotalBase, currency)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Aviation Security, Passenger Service & Fuel Surcharge:</span>
                  <span className="font-mono">{formatCurrency(taxesAndAirportFees, currency)}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
                  <span className="font-bold text-sm text-amber-400">Grand Total:</span>
                  <span className="text-2xl font-black text-amber-400 font-mono">
                    {formatCurrency(totalAmountUSD, currency)}
                  </span>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep('passengers')}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <span>Continue to Passenger Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PASSENGER DETAILS */}
          {step === 'passengers' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h4 className="font-bold text-sm text-slate-900">
                  Passenger Information ({totalPassengers} Traveler{totalPassengers > 1 ? 's' : ''})
                </h4>
                <div className="flex gap-1.5">
                  {passengers.map((p, idx) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setActivePaxIndex(idx)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        activePaxIndex === idx ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      Passenger {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {passengers.map((pax, idx) => {
                if (idx !== activePaxIndex) return null;

                const updatePax = (fields: Partial<PassengerInfo>) => {
                  setPassengers(prev => {
                    const copy = [...prev];
                    copy[idx] = { ...copy[idx], ...fields };
                    return copy;
                  });
                };

                return (
                  <div key={pax.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                      <span>Editing Passenger {idx + 1} ({pax.type.toUpperCase()})</span>
                      <span className="text-amber-600">Passport must be valid for min 6 months</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Title</label>
                        <select
                          value={pax.title}
                          onChange={(e) => updatePax({ title: e.target.value })}
                          className="w-full p-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg outline-none"
                        >
                          <option value="Mr">Mr</option>
                          <option value="Mrs">Mrs</option>
                          <option value="Ms">Ms</option>
                          <option value="Dr">Dr</option>
                          <option value="Master">Master</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">First & Middle Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Jeeva"
                          value={pax.firstName}
                          onChange={(e) => updatePax({ firstName: e.target.value })}
                          className="w-full p-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Last / Surname *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Kumar"
                          value={pax.lastName}
                          onChange={(e) => updatePax({ lastName: e.target.value })}
                          className="w-full p-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Date of Birth</label>
                        <input
                          type="date"
                          value={pax.dob}
                          onChange={(e) => updatePax({ dob: e.target.value })}
                          className="w-full p-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Nationality</label>
                        <input
                          type="text"
                          value={pax.nationality}
                          onChange={(e) => updatePax({ nationality: e.target.value })}
                          placeholder="e.g. Indian / British / UAE"
                          className="w-full p-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Passport Number *</label>
                        <input
                          type="text"
                          required
                          value={pax.passportNumber}
                          onChange={(e) => updatePax({ passportNumber: e.target.value.toUpperCase() })}
                          placeholder="e.g. V8931024"
                          className="w-full p-2 text-xs font-mono font-bold uppercase bg-white border border-slate-300 rounded-lg outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Passport Expiry</label>
                        <input
                          type="date"
                          value={pax.passportExpiry}
                          onChange={(e) => updatePax({ passportExpiry: e.target.value })}
                          className="w-full p-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Dietary / Meal Preference</label>
                        <select
                          value={pax.mealPreference}
                          onChange={(e) => updatePax({ mealPreference: e.target.value })}
                          className="w-full p-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg outline-none"
                        >
                          <option value="Regular Meal">Standard In-Flight Meal</option>
                          <option value="Asian Vegetarian Meal (AVML)">Asian Vegetarian (AVML)</option>
                          <option value="Halal Meal (MOML)">Halal Certified (MOML)</option>
                          <option value="Diabetic Meal (DBML)">Diabetic (DBML)</option>
                          <option value="Gluten-Free Meal (GFML)">Gluten Intolerant (GFML)</option>
                          <option value="Child Meal (CHML)">Child Friendly Meal</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2 pt-5">
                        <input
                          type="checkbox"
                          id={`wheelchair-${pax.id}`}
                          checked={pax.specialAssistance}
                          onChange={(e) => updatePax({ specialAssistance: e.target.checked })}
                          className="w-4 h-4 text-amber-500 rounded border-slate-300"
                        />
                        <label htmlFor={`wheelchair-${pax.id}`} className="text-xs font-semibold text-slate-700">
                          Request Wheelchair / Special Airport Assistance
                        </label>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Primary Contact Details */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  E-Ticket & Booking Updates Delivery
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full p-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Mobile / WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full p-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep('review')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep('seats')}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <span>Select Seats</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SEAT SELECTION */}
          {step === 'seats' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    Interactive Aircraft Seat Map ({flight.aircraft})
                  </h4>
                  <p className="text-xs text-slate-500">
                    Click any available seat to assign to: <strong className="text-amber-600">{passengers[activePaxIndex].firstName || `Passenger ${activePaxIndex + 1}`}</strong>
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs font-medium">
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded bg-amber-400 border border-amber-500" />
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded bg-white border border-slate-300" />
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded bg-slate-300" />
                    <span>Occupied</span>
                  </div>
                </div>
              </div>

              {/* Fuselage Mock Graphic */}
              <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200 flex flex-col items-center">
                <div className="w-full max-w-md bg-white rounded-3xl p-4 border border-slate-300 shadow-inner">
                  {/* Cockpit nose indicator */}
                  <div className="text-center text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center justify-center gap-1">
                    <Plane className="w-3.5 h-3.5" /> FRONT OF AIRCRAFT
                  </div>

                  {/* Column headers */}
                  <div className="grid grid-cols-7 text-center font-bold text-xs text-slate-400 mb-2">
                    <span>A</span>
                    <span>B</span>
                    <span>C</span>
                    <span className="text-[10px] text-slate-300">AISLE</span>
                    <span>D</span>
                    <span>E</span>
                    <span>F</span>
                  </div>

                  {/* Seat Grid Rows */}
                  <div className="space-y-2">
                    {seatRows.map((row) => {
                      return (
                        <div key={row} className="grid grid-cols-7 items-center text-center gap-1">
                          {/* Seat A, B, C */}
                          {['A', 'B', 'C'].map((col) => {
                            const seatCode = `${row}${col}`;
                            const isOccupied = occupiedSeats.includes(seatCode);
                            const isSelectedByPax = passengers.some(p => p.seatNumber === seatCode);

                            return (
                              <button
                                key={seatCode}
                                type="button"
                                disabled={isOccupied}
                                onClick={() => handleSeatClick(seatCode)}
                                className={`h-8 rounded-md text-[10px] font-bold transition-all flex items-center justify-center ${
                                  isSelectedByPax
                                    ? 'bg-amber-400 text-slate-950 border border-amber-600 font-black shadow-xs scale-105'
                                    : isOccupied
                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    : 'bg-white border border-slate-300 hover:border-amber-500 hover:bg-amber-50 text-slate-800'
                                }`}
                              >
                                {seatCode}
                              </button>
                            );
                          })}

                          {/* Row Number in Aisle */}
                          <span className="text-[10px] font-mono font-bold text-slate-400">{row}</span>

                          {/* Seat D, E, F */}
                          {['D', 'E', 'F'].map((col) => {
                            const seatCode = `${row}${col}`;
                            const isOccupied = occupiedSeats.includes(seatCode);
                            const isSelectedByPax = passengers.some(p => p.seatNumber === seatCode);

                            return (
                              <button
                                key={seatCode}
                                type="button"
                                disabled={isOccupied}
                                onClick={() => handleSeatClick(seatCode)}
                                className={`h-8 rounded-md text-[10px] font-bold transition-all flex items-center justify-center ${
                                  isSelectedByPax
                                    ? 'bg-amber-400 text-slate-950 border border-amber-600 font-black shadow-xs scale-105'
                                    : isOccupied
                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    : 'bg-white border border-slate-300 hover:border-amber-500 hover:bg-amber-50 text-slate-800'
                                }`}
                              >
                                {seatCode}
                              </button>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Assigned seat summary */}
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-slate-700">
                  {passengers.map((p, idx) => (
                    <span key={p.id} className="bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
                      {p.firstName || `Passenger ${idx + 1}`}: <strong className="text-amber-600">{p.seatNumber || 'Not Selected'}</strong>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep('passengers')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep('addons')}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <span>Continue to Add-ons</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: ADD-ONS */}
          {step === 'addons' && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-slate-900">Custom Travel Add-ons & Protection</h4>

              <div className="space-y-3">
                {/* Travel Insurance */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:border-amber-400 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 mt-0.5">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">Comprehensive Flight & Medical Insurance</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">Recommended</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Covers up to $50,000 emergency medical, trip cancellation, and lost luggage reimbursement.
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-sm text-slate-900 block font-mono">
                      {formatCurrency(24 * totalPassengers, currency)}
                    </span>
                    <input
                      type="checkbox"
                      checked={addOns.travelInsurance}
                      onChange={(e) => setAddOns(prev => ({ ...prev, travelInsurance: e.target.checked }))}
                      className="w-4 h-4 text-amber-500 rounded mt-1"
                    />
                  </div>
                </div>

                {/* Priority Boarding */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:border-amber-400 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-amber-50 text-amber-600 mt-0.5">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-slate-900">Priority Baggage & Fast-Track Boarding</span>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Skip airport lines, board via dedicated priority lane, and first baggage off the carousel.
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-sm text-slate-900 block font-mono">
                      {formatCurrency(15 * totalPassengers, currency)}
                    </span>
                    <input
                      type="checkbox"
                      checked={addOns.priorityBoarding}
                      onChange={(e) => setAddOns(prev => ({ ...prev, priorityBoarding: e.target.checked }))}
                      className="w-4 h-4 text-amber-500 rounded mt-1"
                    />
                  </div>
                </div>

                {/* VIP Lounge Access */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:border-amber-400 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-sky-50 text-sky-600 mt-0.5">
                      <Coffee className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-slate-900">Airport VIP Lounge Pass</span>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Access premium Marhaba / Plaza Premium Lounge at {flight.origin.code} with buffet & showers.
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-sm text-slate-900 block font-mono">
                      {formatCurrency(45 * totalPassengers, currency)}
                    </span>
                    <input
                      type="checkbox"
                      checked={addOns.loungeAccess}
                      onChange={(e) => setAddOns(prev => ({ ...prev, loungeAccess: e.target.checked }))}
                      className="w-4 h-4 text-amber-500 rounded mt-1"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep('seats')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep('payment')}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <span>Proceed to Payment ({formatCurrency(totalAmountUSD, currency)})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: INSTANT PAYMENT */}
          {step === 'payment' && (
            <form onSubmit={handleProcessPayment} className="space-y-5">
              <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Total Due For Instant Issuance:</span>
                  <span className="text-2xl font-black text-amber-400 font-mono">
                    {formatCurrency(totalAmountUSD, currency)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-800">
                  <Lock className="w-3.5 h-3.5" />
                  <span>256-Bit SSL Encrypted</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Cardholder Name *</label>
                  <input
                    type="text"
                    required
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                    className="w-full p-2.5 text-xs font-bold uppercase bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Card Number *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4532 0000 0000 0000"
                      className="w-full p-2.5 text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <CreditCard className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Expiry Date *</label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full p-2.5 text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">CVV / CVC *</label>
                    <input
                      type="password"
                      maxLength={4}
                      required
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="•••"
                      className="w-full p-2.5 text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep('addons')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  Back
                </button>
                <button
                  id="confirm-pay-btn"
                  type="submit"
                  disabled={isProcessingPayment}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm flex items-center gap-2 shadow-lg shadow-amber-500/25 cursor-pointer disabled:opacity-60"
                >
                  {isProcessingPayment ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Confirming with Airline CRS...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-slate-950" />
                      <span>PAY & ISSUE E-TICKET</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 6: CONFIRMED & TICKET READY */}
          {step === 'confirmed' && confirmedBooking && (
            <div className="space-y-6 text-center py-2 animate-fadeIn">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Flight Booking Confirmed & E-Ticket Issued!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Electronic ticket receipt has been dispatched to <strong className="text-slate-800">{confirmedBooking.contactEmail}</strong>
                </p>
              </div>

              {/* Boarding Pass / Itinerary Summary Card */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 text-left border border-slate-800 shadow-xl max-w-xl mx-auto space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <div className="text-[10px] text-amber-400 uppercase font-black tracking-widest">
                      MMS AIR TRAVELS • E-TICKET
                    </div>
                    <div className="font-bold text-sm text-white">
                      {confirmedBooking.departureFlight.airline} ({confirmedBooking.departureFlight.flightNumber})
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">Booking Ref (PNR)</span>
                    <span className="font-mono text-base font-black text-amber-400">{confirmedBooking.pnr}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">PASSENGER</span>
                    <span className="font-bold text-white truncate block">
                      {confirmedBooking.passengers[0]?.firstName} {confirmedBooking.passengers[0]?.lastName}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">SEAT</span>
                    <span className="font-mono font-bold text-amber-400">
                      {confirmedBooking.passengers[0]?.seatNumber || 'Allocated at Gate'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">GATE / TERMINAL</span>
                    <span className="font-bold text-white">
                      {confirmedBooking.departureFlight.gate} ({confirmedBooking.departureFlight.terminalDep})
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">STATUS</span>
                    <span className="font-bold text-emerald-400">CONFIRMED</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl flex items-center justify-between border border-slate-800 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">E-Ticket Number</span>
                    <span className="font-mono font-bold text-slate-200">{confirmedBooking.eticketNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Date</span>
                    <span className="font-bold text-slate-200">{confirmedBooking.departureFlight.departureDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Paid</span>
                    <span className="font-bold text-amber-400">{formatCurrency(confirmedBooking.paidAmount, currency)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-2 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-amber-400" />
                  <span>Print Official Boarding Pass</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-600 transition-colors shadow-md cursor-pointer"
                >
                  Go to Manage Itineraries
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

import { Flight, CabinClass, FareOption, Airport } from '../types';
import { POPULAR_AIRPORTS } from './airports';

export const AIRLINE_INFO = [
  { name: 'Emirates', code: 'EK', color: 'from-red-600 to-red-700', hub: 'DXB' },
  { name: 'Qatar Airways', code: 'QR', color: 'from-amber-800 to-amber-900', hub: 'DOH' },
  { name: 'Singapore Airlines', code: 'SQ', color: 'from-blue-900 to-indigo-900', hub: 'SIN' },
  { name: 'Air India', code: 'AI', color: 'from-rose-600 to-orange-600', hub: 'DEL' },
  { name: 'British Airways', code: 'BA', color: 'from-blue-700 to-red-600', hub: 'LHR' },
  { name: 'Saudia', code: 'SV', color: 'from-emerald-700 to-green-800', hub: 'JED' },
  { name: 'Etihad Airways', code: 'EY', color: 'from-amber-600 to-yellow-700', hub: 'AUH' },
  { name: 'Lufthansa', code: 'LH', color: 'from-yellow-600 to-blue-900', hub: 'FRA' },
  { name: 'MMS Sky Express', code: 'MM', color: 'from-sky-600 to-blue-800', hub: 'DXB' },
  { name: 'Oman Air', code: 'WY', color: 'from-blue-800 to-teal-800', hub: 'MCT' },
  { name: 'Gulf Air', code: 'GF', color: 'from-amber-700 to-yellow-800', hub: 'BAH' },
  { name: 'IndiGo Airlines', code: '6E', color: 'from-blue-600 to-indigo-700', hub: 'MAA' },
  { name: 'Kuwait Airways', code: 'KU', color: 'from-cyan-700 to-blue-800', hub: 'KWI' },
  { name: 'SriLankan Airlines', code: 'UL', color: 'from-emerald-800 to-teal-900', hub: 'CMB' },
  { name: 'Malaysia Airlines', code: 'MH', color: 'from-red-700 to-blue-900', hub: 'KUL' }
];

export const AIRCRAFTS = [
  'Boeing 777-300ER',
  'Airbus A350-900',
  'Boeing 787-9 Dreamliner',
  'Airbus A380-800',
  'Airbus A321neo',
  'Boeing 737 MAX 9',
  'Airbus A330-300',
  'Boeing 787-10'
];

export const FARE_OPTIONS: FareOption[] = [
  {
    tier: 'saver',
    name: 'Economy Saver',
    priceMultiplier: 1.0,
    checkedBaggage: '1x 23 kg',
    cabinBaggage: '1x 7 kg',
    seatSelection: 'paid',
    cancellation: 'Fee applies ($120)',
    refundPolicy: 'Non-refundable (Credit voucher only)',
    changePolicy: '$75 change fee + fare diff',
    milesEarned: 500
  },
  {
    tier: 'standard',
    name: 'Economy Standard',
    priceMultiplier: 1.25,
    checkedBaggage: '2x 23 kg (Total 46 kg)',
    cabinBaggage: '1x 7 kg + personal item',
    seatSelection: 'standard-free',
    cancellation: 'Refundable with $50 fee',
    refundPolicy: 'Refund to original payment method',
    changePolicy: 'Free date change (fare diff applies)',
    milesEarned: 1200
  },
  {
    tier: 'flexi',
    name: 'Economy Flexi Plus',
    priceMultiplier: 1.6,
    checkedBaggage: '2x 32 kg Premium Allowance',
    cabinBaggage: '2x 7 kg cabin bags',
    seatSelection: 'any-free',
    cancellation: '100% Free Cancellation',
    refundPolicy: 'Full instant cash refund',
    changePolicy: 'Unlimited free changes',
    milesEarned: 2400
  }
];

export function generateFlightsForRoute(
  originCode: string,
  destCode: string,
  departureDate: string,
  cabinClass: CabinClass = 'economy',
  adjustment?: { percentage?: number; fixedUSD?: number }
): Flight[] {
  const origin = POPULAR_AIRPORTS.find(a => a.code === originCode) || {
    code: originCode,
    city: originCode,
    name: `${originCode} Airport`,
    country: 'International',
    terminal: 'T1'
  };
  
  const destination = POPULAR_AIRPORTS.find(a => a.code === destCode) || {
    code: destCode,
    city: destCode,
    name: `${destCode} Airport`,
    country: 'International',
    terminal: 'T2'
  };

  const cabinMultiplier = {
    'economy': 1.0,
    'premium-economy': 1.55,
    'business': 2.8,
    'first': 4.5
  }[cabinClass];

  // Generate 20 comprehensive realistic flight schedules across global carriers
  const scheduleSlots = [
    { dep: '01:15', arr: '06:45', stops: 0, dur: 330 },
    { dep: '02:40', arr: '09:25', stops: 1, dur: 405, layover: 'DOH', layoverMin: 75 },
    { dep: '04:10', arr: '09:40', stops: 0, dur: 330 },
    { dep: '05:30', arr: '13:45', stops: 1, dur: 495, layover: 'DXB', layoverMin: 90 },
    { dep: '06:45', arr: '12:15', stops: 0, dur: 330 },
    { dep: '08:00', arr: '15:30', stops: 1, dur: 450, layover: 'AUH', layoverMin: 80 },
    { dep: '09:20', arr: '14:50', stops: 0, dur: 330 },
    { dep: '10:35', arr: '18:55', stops: 1, dur: 500, layover: 'SIN', layoverMin: 85 },
    { dep: '11:50', arr: '17:20', stops: 0, dur: 330 },
    { dep: '13:15', arr: '21:10', stops: 1, dur: 475, layover: 'KUL', layoverMin: 95 },
    { dep: '14:30', arr: '20:00', stops: 0, dur: 330 },
    { dep: '15:45', arr: '23:35', stops: 1, dur: 470, layover: 'MCT', layoverMin: 70 },
    { dep: '17:00', arr: '22:30', stops: 0, dur: 330 },
    { dep: '18:15', arr: '02:40', stops: 1, dur: 505, layover: 'BAH', layoverMin: 85 },
    { dep: '19:30', arr: '01:00', stops: 0, dur: 330 },
    { dep: '20:45', arr: '05:15', stops: 1, dur: 510, layover: 'CMB', layoverMin: 90 },
    { dep: '21:50', arr: '03:20', stops: 0, dur: 330 },
    { dep: '22:30', arr: '07:15', stops: 1, dur: 525, layover: 'KWI', layoverMin: 105 },
    { dep: '23:15', arr: '04:45', stops: 0, dur: 330 },
    { dep: '23:55', arr: '09:20', stops: 1, dur: 565, layover: 'DXB', layoverMin: 120 }
  ];

  return scheduleSlots.map((slot, idx) => {
    const airline = AIRLINE_INFO[idx % AIRLINE_INFO.length];
    const flightNum = `${airline.code}-${100 + (idx * 37) % 899}`;
    const aircraft = AIRCRAFTS[idx % AIRCRAFTS.length];
    
    // Seed price calculation
    const baseRouteDistancePrice = Math.max(260, Math.abs(originCode.charCodeAt(0) - destCode.charCodeAt(0)) * 25 + 280);
    const nonStopPremium = slot.stops === 0 ? 55 : -25;
    const timeFactor = (idx === 1 || idx === 3) ? -35 : 20;
    let computedPrice = Math.round((baseRouteDistancePrice + nonStopPremium + timeFactor) * cabinMultiplier);
    if (adjustment) {
      if (adjustment.percentage) {
        computedPrice = Math.round(computedPrice * (1 + adjustment.percentage / 100));
      }
      if (adjustment.fixedUSD) {
        computedPrice = Math.round(computedPrice + adjustment.fixedUSD);
      }
    }
    computedPrice = Math.max(80, computedPrice);

    const layoverAirport = slot.layover ? POPULAR_AIRPORTS.find(a => a.code === slot.layover) : undefined;

    return {
      id: `flt-${originCode}-${destCode}-${flightNum}-${departureDate}`,
      flightNumber: flightNum,
      airline: airline.name,
      airlineCode: airline.code,
      airlineLogoColor: airline.color,
      aircraft: aircraft,
      origin: origin,
      destination: destination,
      departureDate: departureDate,
      departureTime: slot.dep,
      arrivalDate: departureDate,
      arrivalTime: slot.arr,
      durationMinutes: slot.dur,
      stops: slot.stops,
      layoverAirport: layoverAirport,
      layoverDurationMinutes: slot.layoverMin,
      basePrice: computedPrice,
      availableSeats: 4 + (idx * 3) % 19,
      cabinClass: cabinClass,
      amenities: {
        wifi: idx % 2 === 0,
        meal: true,
        power: true,
        entertainment: true,
        seatPitch: cabinClass === 'economy' ? '32-34"' : cabinClass === 'business' ? 'Lie-flat 78"' : 'Private Suite 82"'
      },
      terminalDep: origin.terminal || 'T1',
      terminalArr: destination.terminal || 'T3',
      gate: `G${12 + (idx * 4) % 36}`,
      status: idx === 0 ? 'BOARDING' : idx === 1 ? 'ON_TIME' : 'SCHEDULED'
    };
  });
}

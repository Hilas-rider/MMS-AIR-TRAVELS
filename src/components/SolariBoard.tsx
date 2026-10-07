import React, { useState, useEffect } from 'react';
import { Plane, Clock, RefreshCw, Luggage, CheckCircle2 } from 'lucide-react';
import { CurrencyCode } from '../types';
import { formatCurrency } from '../data/airports';
import { CONTACT_NUMBERS } from '../data/contactInfo';

interface FlightDeparture {
  id: string;
  flightCode: string;
  airline: string;
  originCode: string;
  originCity: string;
  destCode: string;
  destCity: string;
  scheduledTime: string;
  gate: string;
  status: 'ON TIME' | 'BOARDING' | 'SCHEDULED' | 'CONFIRMED' | 'AIRBORNE';
  baggage: string;
  fareINR: number;
  fareUSD: number;
  seatsLeft: number;
}

const LIVE_DEPARTURES: Record<string, FlightDeparture[]> = {
  gulf: [
    {
      id: 'G1',
      flightCode: '6E 1475',
      airline: 'IndiGo',
      originCode: 'TRZ',
      originCity: 'Trichy',
      destCode: 'DXB',
      destCity: 'Dubai',
      scheduledTime: '07:45',
      gate: 'G-02',
      status: 'BOARDING',
      baggage: '30 KG',
      fareINR: 17850,
      fareUSD: 215,
      seatsLeft: 7
    },
    {
      id: 'G2',
      flightCode: 'IX 611',
      airline: 'Air India Express',
      originCode: 'TRZ',
      originCity: 'Trichy',
      destCode: 'SHJ',
      destCity: 'Sharjah',
      scheduledTime: '11:20',
      gate: 'G-04',
      status: 'ON TIME',
      baggage: '30 KG',
      fareINR: 16400,
      fareUSD: 198,
      seatsLeft: 12
    },
    {
      id: 'G3',
      flightCode: 'QR 529',
      airline: 'Qatar Airways',
      originCode: 'MAA',
      originCity: 'Chennai',
      destCode: 'DOH',
      destCity: 'Doha',
      scheduledTime: '13:50',
      gate: 'T2-B12',
      status: 'ON TIME',
      baggage: '35 KG',
      fareINR: 23800,
      fareUSD: 286,
      seatsLeft: 4
    },
    {
      id: 'G4',
      flightCode: 'KU 344',
      airline: 'Kuwait Airways',
      originCode: 'MAA',
      originCity: 'Chennai',
      destCode: 'KWI',
      destCity: 'Kuwait',
      scheduledTime: '18:15',
      gate: 'T2-A08',
      status: 'SCHEDULED',
      baggage: '46 KG',
      fareINR: 26500,
      fareUSD: 319,
      seatsLeft: 9
    },
    {
      id: 'G5',
      flightCode: 'GF 269',
      airline: 'Gulf Air',
      originCode: 'TRZ',
      originCity: 'Trichy',
      destCode: 'BAH',
      destCity: 'Bahrain',
      scheduledTime: '21:30',
      gate: 'G-01',
      status: 'CONFIRMED',
      baggage: '30 KG',
      fareINR: 21200,
      fareUSD: 255,
      seatsLeft: 6
    }
  ],
  asean: [
    {
      id: 'A1',
      flightCode: 'TR 563',
      airline: 'Scoot',
      originCode: 'TRZ',
      originCity: 'Trichy',
      destCode: 'SIN',
      destCity: 'Singapore',
      scheduledTime: '01:25',
      gate: 'G-03',
      status: 'BOARDING',
      baggage: '25 KG',
      fareINR: 14200,
      fareUSD: 171,
      seatsLeft: 5
    },
    {
      id: 'A2',
      flightCode: 'UL 132',
      airline: 'SriLankan',
      originCode: 'TRZ',
      originCity: 'Trichy',
      destCode: 'CMB',
      destCity: 'Colombo',
      scheduledTime: '09:40',
      gate: 'G-01',
      status: 'ON TIME',
      baggage: '30 KG',
      fareINR: 9800,
      fareUSD: 118,
      seatsLeft: 14
    },
    {
      id: 'A3',
      flightCode: 'AK 24',
      airline: 'AirAsia',
      originCode: 'TRZ',
      originCity: 'Trichy',
      destCode: 'KUL',
      destCity: 'Kuala Lumpur',
      scheduledTime: '15:10',
      gate: 'G-05',
      status: 'ON TIME',
      baggage: '20 KG',
      fareINR: 11950,
      fareUSD: 144,
      seatsLeft: 8
    },
    {
      id: 'A4',
      flightCode: 'TG 338',
      airline: 'Thai Airways',
      originCode: 'MAA',
      originCity: 'Chennai',
      destCode: 'BKK',
      destCity: 'Bangkok',
      scheduledTime: '23:55',
      gate: 'T2-C14',
      status: 'SCHEDULED',
      baggage: '30 KG',
      fareINR: 16900,
      fareUSD: 203,
      seatsLeft: 11
    }
  ],
  wholesale: [
    {
      id: 'W1',
      flightCode: 'IX 613-BLK',
      airline: 'Air India Express',
      originCode: 'TRZ',
      originCity: 'Trichy',
      destCode: 'DXB',
      destCity: 'Dubai',
      scheduledTime: '06:10',
      gate: 'BLK-01',
      status: 'CONFIRMED',
      baggage: '40 KG (2 Pcs)',
      fareINR: 14800,
      fareUSD: 178,
      seatsLeft: 24
    },
    {
      id: 'W2',
      flightCode: '6E 1401-BLK',
      airline: 'IndiGo Bulk',
      originCode: 'TRZ',
      originCity: 'Trichy',
      destCode: 'SIN',
      destCity: 'Singapore',
      scheduledTime: '22:45',
      gate: 'BLK-03',
      status: 'CONFIRMED',
      baggage: '30 KG',
      fareINR: 12400,
      fareUSD: 149,
      seatsLeft: 38
    },
    {
      id: 'W3',
      flightCode: 'G9 472-BLK',
      airline: 'Air Arabia',
      originCode: 'MAA',
      originCity: 'Chennai',
      destCode: 'SHJ',
      destCity: 'Sharjah',
      scheduledTime: '04:30',
      gate: 'BLK-02',
      status: 'CONFIRMED',
      baggage: '35 KG',
      fareINR: 13900,
      fareUSD: 167,
      seatsLeft: 19
    }
  ]
};

// Single Split-Flap Character Unit
interface SplitFlapCharProps {
  char: string;
  isFlipping: boolean;
  delayMs?: number;
}

const SplitFlapChar: React.FC<SplitFlapCharProps> = ({ char, isFlipping, delayMs = 0 }) => {
  const [displayedChar, setDisplayedChar] = useState(char);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (isFlipping) {
      const timer = setTimeout(() => {
        setAnimating(true);
        // Mid-point of flip switch char
        setTimeout(() => {
          setDisplayedChar(char);
          setAnimating(false);
        }, 180);
      }, delayMs);
      return () => clearTimeout(timer);
    } else {
      setDisplayedChar(char);
    }
  }, [char, isFlipping, delayMs]);

  const upperChar = (displayedChar || ' ').toUpperCase();

  return (
    <span className="relative inline-block w-[15px] sm:w-[18px] h-[22px] sm:h-[26px] bg-[#0b192c] text-[#f1f5f9] font-mono-data text-xs sm:text-sm font-semibold rounded-[2px] overflow-hidden select-none border border-[#1e3e62]/70 shadow-xs">
      {/* Top half */}
      <span className="absolute inset-x-0 top-0 h-1/2 overflow-hidden flex items-start justify-center pt-0.5 bg-[#081321] border-b border-black/80">
        <span className="leading-none">{upperChar}</span>
      </span>
      {/* Bottom half */}
      <span className="absolute inset-x-0 bottom-0 h-1/2 overflow-hidden flex items-end justify-center pb-0.5 bg-[#0d1d33]">
        <span className="leading-none transform -translate-y-[50%]">{upperChar}</span>
      </span>
      {/* Mechanical Horizontal Center Crease */}
      <span className="absolute inset-x-0 top-1/2 h-[1px] bg-black/90 shadow-[0_1px_0_rgba(255,255,255,0.12)] pointer-events-none" />
      {/* Flip transition layer */}
      {animating && (
        <span className="absolute inset-x-0 top-0 h-1/2 bg-[#1e3e62] opacity-70 animate-pulse pointer-events-none" />
      )}
    </span>
  );
};

// Word flapper
interface SplitFlapWordProps {
  text: string;
  length?: number;
  isFlipping: boolean;
  baseDelay?: number;
}

const SplitFlapWord: React.FC<SplitFlapWordProps> = ({ text, length, isFlipping, baseDelay = 0 }) => {
  const targetLength = length || text.length;
  const padded = text.padEnd(targetLength, ' ').slice(0, targetLength);

  return (
    <span className="inline-flex gap-[1.5px] items-center">
      {padded.split('').map((ch, idx) => (
        <SplitFlapChar
          key={idx}
          char={ch}
          isFlipping={isFlipping}
          delayMs={baseDelay + idx * 25}
        />
      ))}
    </span>
  );
};

interface SolariBoardProps {
  currency: CurrencyCode;
  onSelectFlightForInquiry: (flight: FlightDeparture) => void;
}

export const SolariBoard: React.FC<SolariBoardProps> = ({
  currency,
  onSelectFlightForInquiry
}) => {
  const [activeCategory, setActiveCategory] = useState<'gulf' | 'asean' | 'wholesale'>('gulf');
  const [isFlipping, setIsFlipping] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('LIVE GDS FEED');

  const triggerFlipAnimation = () => {
    setIsFlipping(true);
    const now = new Date();
    setLastUpdated(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} IST`);
    setTimeout(() => {
      setIsFlipping(false);
    }, 800);
  };

  const handleSwitchCategory = (cat: 'gulf' | 'asean' | 'wholesale') => {
    if (cat === activeCategory) return;
    setActiveCategory(cat);
    triggerFlipAnimation();
  };

  const flights = LIVE_DEPARTURES[activeCategory] || LIVE_DEPARTURES.gulf;

  return (
    <div className="bg-[#0b192c] text-[#f1f5f9] rounded-none sm:rounded-md border border-[#1e3e62] shadow-xl overflow-hidden">
      {/* Board Header & Control Manifest */}
      <div className="bg-[#07111e] px-4 sm:px-6 py-3.5 border-b border-[#1e3e62] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-[#e85c0d] rounded-none shadow-[0_0_8px_#e85c0d]" />
          <div>
            <h3 className="font-display text-lg sm:text-xl text-white tracking-wide">
              Official Flight Manifest & Wholesale Departure Board
            </h3>
            <p className="text-[11px] text-slate-400 font-mono-data">
              Direct GDS Allocation Desk • Departures via Trichy (TRZ) & Chennai (MAA) Gateway Airports
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* Corridor Selectors */}
          <div className="flex flex-wrap sm:inline-flex bg-[#0b192c] p-1 border border-[#1e3e62] w-full sm:w-auto gap-1 sm:gap-0">
            <button
              onClick={() => handleSwitchCategory('gulf')}
              className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1.5 sm:py-1 text-[11px] sm:text-xs font-mono-data text-center transition-colors cursor-pointer ${
                activeCategory === 'gulf'
                  ? 'bg-[#1e3e62] text-[#f1f5f9] font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Gulf Sector
            </button>
            <button
              onClick={() => handleSwitchCategory('asean')}
              className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1.5 sm:py-1 text-[11px] sm:text-xs font-mono-data text-center transition-colors cursor-pointer ${
                activeCategory === 'asean'
                  ? 'bg-[#1e3e62] text-[#f1f5f9] font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ASEAN
            </button>
            <button
              onClick={() => handleSwitchCategory('wholesale')}
              className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1.5 sm:py-1 text-[11px] sm:text-xs font-mono-data text-center transition-colors cursor-pointer ${
                activeCategory === 'wholesale'
                  ? 'bg-[#e85c0d] text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Wholesale PNR
            </button>
          </div>

          <button
            onClick={triggerFlipAnimation}
            title="Refresh Solari Flap Board"
            className="p-2 sm:p-1.5 bg-[#0b192c] hover:bg-[#1e3e62] border border-[#1e3e62] text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFlipping ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Scroll Cue */}
      <div className="md:hidden px-3 py-1.5 bg-[#081321] text-[10px] text-amber-400/90 font-mono-data border-b border-[#1e3e62] flex items-center justify-between">
        <span>⇄ Swipe sideways for full gate & wholesale fare details</span>
        <span className="text-slate-400">{flights.length} flights</span>
      </div>

      {/* Mechanical Flap Table */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left border-collapse min-w-[720px]">
          <thead>
            <tr className="bg-[#081321] text-[10px] font-mono-data uppercase tracking-wider text-slate-400 border-b border-[#1e3e62]">
              <th className="py-2.5 px-4">Flight</th>
              <th className="py-2.5 px-3">Carrier</th>
              <th className="py-2.5 px-4">Sector (Origin → Dest)</th>
              <th className="py-2.5 px-3">Dep Time</th>
              <th className="py-2.5 px-3">Gate</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">Allowance</th>
              <th className="py-2.5 px-4 text-right">Wholesale Fare</th>
              <th className="py-2.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e3e62]/40 text-xs">
            {flights.map((f, rowIdx) => {
              const statusColor =
                f.status === 'BOARDING'
                  ? 'text-[#e85c0d]'
                  : f.status === 'ON TIME'
                  ? 'text-[#22c55e]'
                  : 'text-sky-400';

              const fareDisplay =
                currency === 'INR'
                  ? `₹${f.fareINR.toLocaleString('en-IN')}`
                  : formatCurrency(f.fareUSD, currency);

              return (
                <tr
                  key={f.id}
                  className="hover:bg-[#12233b] transition-colors group cursor-pointer"
                  onClick={() => onSelectFlightForInquiry(f)}
                >
                  {/* Flight Code in Mechanical Flaps */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <SplitFlapWord
                      text={f.flightCode}
                      length={9}
                      isFlipping={isFlipping}
                      baseDelay={rowIdx * 40}
                    />
                  </td>

                  {/* Carrier */}
                  <td className="py-3 px-3 text-slate-300 font-medium whitespace-nowrap">
                    {f.airline}
                  </td>

                  {/* Route with Airport Codes */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 font-mono-data text-white font-bold">
                      <span className="text-amber-400">{f.originCode}</span>
                      <Plane className="w-3 h-3 text-slate-500" />
                      <span className="text-emerald-400">{f.destCode}</span>
                      <span className="text-[11px] text-slate-400 font-normal font-sans ml-1">
                        ({f.originCity} to {f.destCity})
                      </span>
                    </div>
                  </td>

                  {/* Departure Time */}
                  <td className="py-3 px-3 font-mono-data text-white font-bold whitespace-nowrap">
                    {f.scheduledTime}
                  </td>

                  {/* Gate / Slot */}
                  <td className="py-3 px-3 font-mono-data text-slate-300 whitespace-nowrap">
                    {f.gate}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className={`font-mono-data font-bold ${statusColor} tracking-wide text-[11px]`}>
                      {f.status}
                    </span>
                  </td>

                  {/* Baggage */}
                  <td className="py-3 px-3 text-slate-300 whitespace-nowrap">
                    <div className="flex items-center gap-1 font-mono-data text-[11px]">
                      <Luggage className="w-3 h-3 text-slate-400" />
                      <span>{f.baggage}</span>
                    </div>
                  </td>

                  {/* Fare */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <span className="font-mono-data text-sm sm:text-base font-bold text-amber-400">
                      {fareDisplay}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectFlightForInquiry(f);
                      }}
                      className="px-3 py-1.5 bg-[#1e3e62] hover:bg-[#e85c0d] text-white font-medium text-xs rounded-none transition-colors cursor-pointer"
                    >
                      Book Departure
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Board Footer & Disclaimers */}
      <div className="bg-[#081321] px-4 sm:px-6 py-2 border-t border-[#1e3e62] flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 font-mono-data">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
          <span>STATUS FEED: {lastUpdated}</span>
          <span className="text-slate-600">|</span>
          <span>DIRECT AIRLINE GDS AUDITED INVENTORY</span>
        </div>
        <div>
          <span>TICKETS: +91 {CONTACT_NUMBERS.ticket.formatted} | GENERAL: +91 {CONTACT_NUMBERS.general.formatted}</span>
        </div>
      </div>
    </div>
  );
};

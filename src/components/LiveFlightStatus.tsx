import React, { useState } from 'react';
import { 
  Radio, 
  Search, 
  Plane, 
  Clock, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  Compass, 
  Wind,
  Shield
} from 'lucide-react';
import { POPULAR_AIRPORTS } from '../data/airports';

interface LiveFlightItem {
  flightNumber: string;
  airline: string;
  airlineCode: string;
  origin: string;
  dest: string;
  scheduledDep: string;
  estimatedDep: string;
  scheduledArr: string;
  estimatedArr: string;
  terminal: string;
  gate: string;
  baggageBelt: string;
  status: 'ON_TIME' | 'BOARDING' | 'AIRBORNE' | 'DELAYED' | 'LANDED';
  aircraft: string;
  altitudeFt: number;
  speedKts: number;
  progressPercent: number;
}

const SAMPLE_LIVE_FLIGHTS: LiveFlightItem[] = [
  {
    flightNumber: 'EK-001',
    airline: 'Emirates',
    airlineCode: 'EK',
    origin: 'Dubai (DXB)',
    dest: 'London Heathrow (LHR)',
    scheduledDep: '07:45',
    estimatedDep: '07:45',
    scheduledArr: '12:25',
    estimatedArr: '12:20',
    terminal: 'T3',
    gate: 'B18',
    baggageBelt: 'Belt 6',
    status: 'AIRBORNE',
    aircraft: 'Airbus A380-800',
    altitudeFt: 38000,
    speedKts: 510,
    progressPercent: 62
  },
  {
    flightNumber: 'SQ-317',
    airline: 'Singapore Airlines',
    airlineCode: 'SQ',
    origin: 'London Heathrow (LHR)',
    dest: 'Singapore (SIN)',
    scheduledDep: '10:55',
    estimatedDep: '10:55',
    scheduledArr: '07:15',
    estimatedArr: '07:10',
    terminal: 'T2',
    gate: 'B44',
    baggageBelt: 'Belt 12',
    status: 'BOARDING',
    aircraft: 'Boeing 777-300ER',
    altitudeFt: 0,
    speedKts: 0,
    progressPercent: 5
  },
  {
    flightNumber: 'AI-142',
    airline: 'Air India',
    airlineCode: 'AI',
    origin: 'Paris (CDG)',
    dest: 'New Delhi (DEL)',
    scheduledDep: '13:20',
    estimatedDep: '13:20',
    scheduledArr: '01:40',
    estimatedArr: '01:35',
    terminal: 'T2E',
    gate: 'K31',
    baggageBelt: 'Belt 9',
    status: 'AIRBORNE',
    aircraft: 'Boeing 787-9 Dreamliner',
    altitudeFt: 36000,
    speedKts: 495,
    progressPercent: 44
  },
  {
    flightNumber: 'QR-112',
    airline: 'Qatar Airways',
    airlineCode: 'QR',
    origin: 'Doha (DOH)',
    dest: 'Frankfurt (FRA)',
    scheduledDep: '08:15',
    estimatedDep: '08:15',
    scheduledArr: '13:50',
    estimatedArr: '13:45',
    terminal: 'T1',
    gate: 'C12',
    baggageBelt: 'Belt 4',
    status: 'LANDED',
    aircraft: 'Airbus A350-900',
    altitudeFt: 0,
    speedKts: 0,
    progressPercent: 100
  },
  {
    flightNumber: 'SV-741',
    airline: 'Saudia',
    airlineCode: 'SV',
    origin: 'Jeddah (JED)',
    dest: 'Mumbai (BOM)',
    scheduledDep: '16:00',
    estimatedDep: '16:25',
    scheduledArr: '23:15',
    estimatedArr: '23:40',
    terminal: 'Terminal 1',
    gate: 'Gate 8',
    baggageBelt: 'Belt 3',
    status: 'DELAYED',
    aircraft: 'Boeing 777-300ER',
    altitudeFt: 0,
    speedKts: 0,
    progressPercent: 0
  },
  {
    flightNumber: 'MM-902',
    airline: 'MMS Sky Express',
    airlineCode: 'MM',
    origin: 'Chennai (MAA)',
    dest: 'Dubai (DXB)',
    scheduledDep: '21:30',
    estimatedDep: '21:30',
    scheduledArr: '00:15',
    estimatedArr: '00:10',
    terminal: 'T4',
    gate: 'G22',
    baggageBelt: 'Belt 8',
    status: 'ON_TIME',
    aircraft: 'Airbus A321neo',
    altitudeFt: 0,
    speedKts: 0,
    progressPercent: 0
  }
];

export const LiveFlightStatus: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFlight, setSelectedFlight] = useState<LiveFlightItem>(SAMPLE_LIVE_FLIGHTS[0]);

  const filteredFlights = SAMPLE_LIVE_FLIGHTS.filter(f => 
    f.flightNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.airline.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.dest.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-amber-400 font-black text-xs uppercase tracking-widest flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              GLOBAL RADAR & SCHEDULE FEED
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              Live Flight Operations Tracker
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Live departure boards, gate assignments, radar altitude telemetry, and arrival baggage carousel data.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Flight # (e.g. EK-001) or City..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs font-semibold bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      {/* Selected Flight Radar Telemetry Spotlight */}
      {selectedFlight && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-black text-base shadow-sm">
                {selectedFlight.airlineCode}
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">
                  {selectedFlight.airline} • {selectedFlight.flightNumber}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  Aircraft: {selectedFlight.aircraft} • Gate: {selectedFlight.gate} ({selectedFlight.terminal})
                </p>
              </div>
            </div>

            <span className={`text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider ${
              selectedFlight.status === 'AIRBORNE'
                ? 'bg-sky-100 text-sky-800 border border-sky-300'
                : selectedFlight.status === 'BOARDING'
                ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                : selectedFlight.status === 'LANDED'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : selectedFlight.status === 'DELAYED'
                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                : 'bg-slate-100 text-slate-800'
            }`}>
              {selectedFlight.status}
            </span>
          </div>

          {/* Route & Progress Graphic */}
          <div className="space-y-3">
            <div className="flex justify-between items-baseline text-xs font-bold text-slate-700">
              <div>
                <span className="text-xl font-black text-slate-900 block font-mono">
                  {selectedFlight.origin.split(' ')[1] || selectedFlight.origin}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Dep: {selectedFlight.scheduledDep}</span>
              </div>

              <div className="text-center text-xs font-mono text-slate-500">
                <span>Flight Progress ({selectedFlight.progressPercent}%)</span>
              </div>

              <div className="text-right">
                <span className="text-xl font-black text-slate-900 block font-mono">
                  {selectedFlight.dest.split(' ')[1] || selectedFlight.dest}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Arr: {selectedFlight.scheduledArr}</span>
              </div>
            </div>

            {/* Flight bar with moving plane icon */}
            <div className="relative h-2.5 bg-slate-100 rounded-full overflow-visible">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all"
                style={{ width: `${selectedFlight.progressPercent}%` }}
              />
              <div 
                className="absolute -top-2 transform -translate-x-1/2 bg-slate-950 text-amber-400 p-1 rounded-full shadow-md transition-all"
                style={{ left: `${Math.max(4, Math.min(96, selectedFlight.progressPercent))}%` }}
              >
                <Plane className="w-3.5 h-3.5 rotate-90" />
              </div>
            </div>
          </div>

          {/* Telemetry Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Radar Altitude</span>
              <span className="font-mono font-black text-slate-800 text-sm">
                {selectedFlight.altitudeFt > 0 ? `${selectedFlight.altitudeFt.toLocaleString()} FT` : 'Ground (0 FT)'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Ground Speed</span>
              <span className="font-mono font-black text-slate-800 text-sm">
                {selectedFlight.speedKts > 0 ? `${selectedFlight.speedKts} KTS` : 'Parked'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Terminal & Gate</span>
              <span className="font-black text-slate-800 text-sm">
                {selectedFlight.terminal} • {selectedFlight.gate}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Baggage Carousel</span>
              <span className="font-black text-amber-600 text-sm">
                {selectedFlight.baggageBelt}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Flight Schedule Board List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
            Real-Time Departure & Arrival Operations Board
          </h4>
          <span className="text-xs text-slate-400 font-mono">Live updates every 30s</span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredFlights.map((f) => {
            const isSelected = selectedFlight?.flightNumber === f.flightNumber;
            return (
              <div
                key={f.flightNumber}
                onClick={() => setSelectedFlight(f)}
                className={`p-4 flex flex-wrap items-center justify-between gap-3 hover:bg-slate-50 cursor-pointer transition-colors ${
                  isSelected ? 'bg-amber-50/70' : ''
                }`}
              >
                <div className="flex items-center gap-3 min-w-[140px]">
                  <span className="font-mono font-bold text-xs text-slate-900 bg-slate-100 px-2 py-1 rounded">
                    {f.flightNumber}
                  </span>
                  <div>
                    <span className="font-bold text-xs text-slate-800 block">{f.airline}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{f.aircraft}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-700 font-semibold min-w-[180px]">
                  <span>{f.origin}</span>
                  <span className="mx-2 text-slate-400">→</span>
                  <span>{f.dest}</span>
                </div>

                <div className="text-xs font-mono font-bold text-slate-800">
                  <span>{f.scheduledDep}</span>
                  <span className="text-slate-400 font-normal"> / {f.scheduledArr}</span>
                </div>

                <div className="text-xs text-slate-600">
                  <span className="text-[10px] text-slate-400 block">Gate</span>
                  <span className="font-bold">{f.gate}</span>
                </div>

                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  f.status === 'AIRBORNE'
                    ? 'bg-sky-100 text-sky-800'
                    : f.status === 'BOARDING'
                    ? 'bg-amber-100 text-amber-900 font-extrabold'
                    : f.status === 'LANDED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : f.status === 'DELAYED'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {f.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

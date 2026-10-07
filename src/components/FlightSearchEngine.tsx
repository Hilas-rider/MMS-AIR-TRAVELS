import React, { useState, useRef, useEffect } from 'react';
import { 
  PlaneTakeoff, 
  PlaneLanding, 
  ArrowLeftRight, 
  Calendar, 
  Users, 
  Search, 
  Sparkles,
  MapPin,
  ChevronDown
} from 'lucide-react';
import { TripType, CabinClass, Airport } from '../types';
import { POPULAR_AIRPORTS } from '../data/airports';

interface FlightSearchEngineProps {
  onSearch: (params: {
    tripType: TripType;
    origin: Airport;
    destination: Airport;
    departureDate: string;
    returnDate?: string;
    passengers: { adults: number; children: number; infants: number };
    cabinClass: CabinClass;
  }) => void;
  isLoading: boolean;
}

export const FlightSearchEngine: React.FC<FlightSearchEngineProps> = ({ onSearch, isLoading }) => {
  const [tripType, setTripType] = useState<TripType>('one-way');
  const [origin, setOrigin] = useState<Airport>(POPULAR_AIRPORTS[0]); // DXB
  const [destination, setDestination] = useState<Airport>(POPULAR_AIRPORTS[1]); // LHR
  
  // Default dates
  const todayStr = '2026-09-08';
  const returnStr = '2026-09-18';
  const [departureDate, setDepartureDate] = useState(todayStr);
  const [returnDate, setReturnDate] = useState(returnStr);
  
  const [cabinClass, setCabinClass] = useState<CabinClass>('economy');
  const [passengers, setPassengers] = useState({ adults: 1, children: 0, infants: 0 });

  // Autocomplete search states
  const [originQuery, setOriginQuery] = useState('');
  const [destQuery, setDestQuery] = useState('');
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const [showPassengerPopover, setShowPassengerPopover] = useState(false);

  const originRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);
  const paxRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (originRef.current && !originRef.current.contains(e.target as Node)) {
        setShowOriginDropdown(false);
      }
      if (destRef.current && !destRef.current.contains(e.target as Node)) {
        setShowDestDropdown(false);
      }
      if (paxRef.current && !paxRef.current.contains(e.target as Node)) {
        setShowPassengerPopover(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOriginAirports = POPULAR_AIRPORTS.filter(a => 
    a.city.toLowerCase().includes(originQuery.toLowerCase()) ||
    a.code.toLowerCase().includes(originQuery.toLowerCase()) ||
    a.country.toLowerCase().includes(originQuery.toLowerCase()) ||
    a.name.toLowerCase().includes(originQuery.toLowerCase())
  );

  const filteredDestAirports = POPULAR_AIRPORTS.filter(a => 
    a.city.toLowerCase().includes(destQuery.toLowerCase()) ||
    a.code.toLowerCase().includes(destQuery.toLowerCase()) ||
    a.country.toLowerCase().includes(destQuery.toLowerCase()) ||
    a.name.toLowerCase().includes(destQuery.toLowerCase())
  );

  const handleSwapAirports = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      tripType,
      origin,
      destination,
      departureDate,
      returnDate: tripType === 'round-trip' ? returnDate : undefined,
      passengers,
      cabinClass
    });
  };

  const quickRoutes = [
    { from: 'DXB', to: 'LHR', label: 'Dubai ⇄ London' },
    { from: 'DEL', to: 'DXB', label: 'Delhi ⇄ Dubai' },
    { from: 'MAA', to: 'DXB', label: 'Chennai ⇄ Dubai' },
    { from: 'BOM', to: 'JED', label: 'Mumbai ⇄ Jeddah (Umrah)' },
    { from: 'SIN', to: 'LHR', label: 'Singapore ⇄ London' },
    { from: 'JFK', to: 'DXB', label: 'New York ⇄ Dubai' }
  ];

  const totalPassengers = passengers.adults + passengers.children + passengers.infants;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-5 sm:p-7 relative overflow-hidden">
      {/* Decorative gradient flare */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-br from-amber-200/40 to-sky-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* Header controls: Trip Types & Cabin selection */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100">
        {/* Trip type buttons */}
        <div className="inline-flex p-1 bg-slate-100 rounded-xl">
          {(['one-way', 'round-trip', 'multi-city'] as TripType[]).map((type) => (
            <button
              key={type}
              id={`trip-type-${type}`}
              type="button"
              onClick={() => setTripType(type)}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                tripType === type
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {type.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Cabin Class Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {(['economy', 'premium-economy', 'business', 'first'] as CabinClass[]).map((cls) => (
            <button
              key={cls}
              id={`cabin-class-${cls}`}
              type="button"
              onClick={() => setCabinClass(cls)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                cabinClass === cls
                  ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {cls.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Form Fields */}
      <form onSubmit={handleSearchSubmit} className="mt-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          
          {/* Origin Input */}
          <div className="md:col-span-3 relative" ref={originRef}>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Flying From
            </label>
            <div
              onClick={() => {
                setShowOriginDropdown(true);
                setShowDestDropdown(false);
              }}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-300 hover:border-amber-500 bg-slate-50/70 hover:bg-white transition-all cursor-pointer shadow-sm group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <PlaneTakeoff className="w-5 h-5 text-amber-600 shrink-0 group-hover:scale-110 transition-transform" />
                <div className="min-w-0">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-extrabold text-slate-900 text-base">{origin.code}</span>
                    <span className="text-xs font-semibold text-slate-700 truncate">{origin.city}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{origin.name}</p>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
            </div>

            {/* Origin Dropdown Autocomplete */}
            {showOriginDropdown && (
              <div className="absolute top-full left-0 mt-1 w-[calc(100vw-3rem)] sm:w-80 max-w-sm bg-white border border-slate-200 rounded-xl shadow-2xl z-50 p-2">
                <input
                  type="text"
                  placeholder="Search city, country or airport code..."
                  value={originQuery}
                  onChange={(e) => setOriginQuery(e.target.value)}
                  autoFocus
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 mb-2 font-medium"
                />
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {filteredOriginAirports.map((airport) => (
                    <div
                      key={airport.code}
                      onClick={() => {
                        setOrigin(airport);
                        setShowOriginDropdown(false);
                        setOriginQuery('');
                      }}
                      className="p-2 hover:bg-amber-50 rounded-lg cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <div>
                          <p className="text-xs font-bold text-slate-800">{airport.city}, {airport.country}</p>
                          <p className="text-[10px] text-slate-400">{airport.name}</p>
                        </div>
                      </div>
                      <span className="text-xs font-black bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono">
                        {airport.code}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Swap Button */}
          <div className="flex justify-center md:col-span-1 -my-1 md:my-0 z-10">
            <button
              id="swap-airports-btn"
              type="button"
              onClick={handleSwapAirports}
              title="Swap Departure & Destination"
              className="p-2.5 rounded-full bg-slate-100 hover:bg-amber-500 hover:text-slate-950 text-slate-600 transition-all border border-slate-200 shadow-sm hover:scale-105 active:scale-95"
            >
              <ArrowLeftRight className="w-4 h-4 rotate-90 md:rotate-0 transition-transform" />
            </button>
          </div>

          {/* Destination Input */}
          <div className="md:col-span-3 relative" ref={destRef}>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Flying To
            </label>
            <div
              onClick={() => {
                setShowDestDropdown(true);
                setShowOriginDropdown(false);
              }}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-300 hover:border-amber-500 bg-slate-50/70 hover:bg-white transition-all cursor-pointer shadow-sm group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <PlaneLanding className="w-5 h-5 text-sky-600 shrink-0 group-hover:scale-110 transition-transform" />
                <div className="min-w-0">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-extrabold text-slate-900 text-base">{destination.code}</span>
                    <span className="text-xs font-semibold text-slate-700 truncate">{destination.city}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{destination.name}</p>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
            </div>

            {/* Destination Dropdown Autocomplete */}
            {showDestDropdown && (
              <div className="absolute top-full left-0 mt-1 w-[calc(100vw-3rem)] sm:w-80 max-w-sm bg-white border border-slate-200 rounded-xl shadow-2xl z-50 p-2">
                <input
                  type="text"
                  placeholder="Search city, country or airport code..."
                  value={destQuery}
                  onChange={(e) => setDestQuery(e.target.value)}
                  autoFocus
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 mb-2 font-medium"
                />
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {filteredDestAirports.map((airport) => (
                    <div
                      key={airport.code}
                      onClick={() => {
                        setDestination(airport);
                        setShowDestDropdown(false);
                        setDestQuery('');
                      }}
                      className="p-2 hover:bg-amber-50 rounded-lg cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <div>
                          <p className="text-xs font-bold text-slate-800">{airport.city}, {airport.country}</p>
                          <p className="text-[10px] text-slate-400">{airport.name}</p>
                        </div>
                      </div>
                      <span className="text-xs font-black bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono">
                        {airport.code}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dates Selection */}
          <div className={`${tripType === 'round-trip' ? 'md:col-span-3' : 'md:col-span-2'}`}>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              {tripType === 'round-trip' ? 'Departure & Return' : 'Departure Date'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              <div className="relative">
                <input
                  id="departure-date-input"
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              {tripType === 'round-trip' && (
                <div className="relative">
                  <input
                    id="return-date-input"
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Passengers Selector */}
          <div className={`${tripType === 'round-trip' ? 'md:col-span-2' : 'md:col-span-3'} relative`} ref={paxRef}>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Passengers
            </label>
            <div
              onClick={() => setShowPassengerPopover(!showPassengerPopover)}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-300 hover:border-amber-500 bg-slate-50/70 hover:bg-white transition-all cursor-pointer shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold text-slate-800">
                  {totalPassengers} {totalPassengers === 1 ? 'Traveler' : 'Travelers'}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>

            {/* Passenger Popover */}
            {showPassengerPopover && (
              <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-1 w-[calc(100vw-3rem)] sm:w-64 max-w-xs bg-white border border-slate-200 rounded-xl shadow-2xl z-50 p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Adults</p>
                    <p className="text-[10px] text-slate-400">12+ years</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={passengers.adults <= 1}
                      onClick={() => setPassengers(p => ({ ...p, adults: Math.max(1, p.adults - 1) }))}
                      className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center font-bold text-xs disabled:opacity-30"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{passengers.adults}</span>
                    <button
                      type="button"
                      disabled={passengers.adults >= 9}
                      onClick={() => setPassengers(p => ({ ...p, adults: p.adults + 1 }))}
                      className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center font-bold text-xs hover:bg-slate-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Children</p>
                    <p className="text-[10px] text-slate-400">2-11 years</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={passengers.children <= 0}
                      onClick={() => setPassengers(p => ({ ...p, children: Math.max(0, p.children - 1) }))}
                      className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center font-bold text-xs disabled:opacity-30"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{passengers.children}</span>
                    <button
                      type="button"
                      disabled={passengers.children >= 8}
                      onClick={() => setPassengers(p => ({ ...p, children: p.children + 1 }))}
                      className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center font-bold text-xs hover:bg-slate-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Infants</p>
                    <p className="text-[10px] text-slate-400">&lt; 2 years (lap)</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={passengers.infants <= 0}
                      onClick={() => setPassengers(p => ({ ...p, infants: Math.max(0, p.infants - 1) }))}
                      className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center font-bold text-xs disabled:opacity-30"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{passengers.infants}</span>
                    <button
                      type="button"
                      disabled={passengers.infants >= passengers.adults}
                      onClick={() => setPassengers(p => ({ ...p, infants: p.infants + 1 }))}
                      className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center font-bold text-xs hover:bg-slate-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPassengerPopover(false)}
                  className="w-full mt-2 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Row: Quick routes & Search CTA */}
        <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Quick Route badges */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Popular Routes:
            </span>
            {quickRoutes.map((rt) => {
              const oAirport = POPULAR_AIRPORTS.find(a => a.code === rt.from);
              const dAirport = POPULAR_AIRPORTS.find(a => a.code === rt.to);
              return (
                <button
                  key={rt.label}
                  type="button"
                  onClick={() => {
                    if (oAirport && dAirport) {
                      setOrigin(oAirport);
                      setDestination(dAirport);
                    }
                  }}
                  className="text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-amber-100 hover:text-amber-900 px-2 py-0.5 rounded-md transition-colors"
                >
                  {rt.label}
                </button>
              );
            })}
          </div>

          {/* Search Button */}
          <button
            id="search-flights-submit-btn"
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Searching Live Flights...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                <span>SEARCH FLIGHTS</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

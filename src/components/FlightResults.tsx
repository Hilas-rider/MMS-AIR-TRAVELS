import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Clock, 
  Wifi, 
  Utensils, 
  Tv, 
  Zap, 
  Luggage, 
  ChevronRight, 
  SlidersHorizontal, 
  Check, 
  ShieldCheck, 
  AlertCircle,
  Info,
  ChevronDown,
  Plane
} from 'lucide-react';
import { Flight, CurrencyCode, FareOption } from '../types';
import { formatCurrency } from '../data/airports';
import { FARE_OPTIONS } from '../data/mockFlights';

/**
 * SplitFlapTile: Signature Solari board motion moment.
 * Only triggers the mechanical flip animation when value actually changes.
 */
interface SplitFlapTileProps {
  value: string;
  className?: string;
}

export const SplitFlapTile: React.FC<SplitFlapTileProps> = ({ value, className = '' }) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (prevValueRef.current !== value) {
      prevValueRef.current = value;
      setIsFlipping(true);
      const timer = setTimeout(() => {
        setIsFlipping(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [value]);

  return (
    <span className={`split-flap-tile ${isFlipping ? 'is-flipping' : ''} ${className}`}>
      {value}
    </span>
  );
};

interface FlightResultsProps {
  flights: Flight[];
  currency: CurrencyCode;
  onSelectFlight: (flight: Flight, fareTier: 'saver' | 'standard' | 'flexi') => void;
  isLoading: boolean;
}

export const FlightResults: React.FC<FlightResultsProps> = ({
  flights,
  currency,
  onSelectFlight,
  isLoading
}) => {
  const [selectedStops, setSelectedStops] = useState<'all' | '0' | '1'>('all');
  const [selectedAirline, setSelectedAirline] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'cheapest' | 'fastest' | 'earliest'>('cheapest');
  const [expandedFlightId, setExpandedFlightId] = useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Extract unique airlines for filter
  const airlines = useMemo(() => {
    const list = Array.from(new Set(flights.map(f => f.airline)));
    return ['all', ...list];
  }, [flights]);

  // Filter and sort flights
  const filteredFlights = useMemo(() => {
    return flights
      .filter(f => {
        if (selectedStops === '0' && f.stops !== 0) return false;
        if (selectedStops === '1' && f.stops !== 1) return false;
        if (selectedAirline !== 'all' && f.airline !== selectedAirline) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'cheapest') return a.basePrice - b.basePrice;
        if (sortBy === 'fastest') return a.durationMinutes - b.durationMinutes;
        if (sortBy === 'earliest') return a.departureTime.localeCompare(b.departureTime);
        return 0;
      });
  }, [flights, selectedStops, selectedAirline, sortBy]);

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m > 0 ? `${m}m` : ''}`;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center shadow-sm">
        <div className="w-12 h-12 mx-auto mb-4 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <h3 className="text-base font-bold text-slate-800">Searching Real-Time Flight Inventory</h3>
        <p className="text-xs text-slate-500 mt-1">
          Querying live Global Distribution Systems (GDS) and airline schedules...
        </p>
      </div>
    );
  }

  if (flights.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center shadow-sm">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
          <Plane className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">No Direct Flights Found for This Query</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          Please adjust your departure dates or select popular global hubs like DXB, LHR, DEL, or SIN.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile Collapsible Filter & Sort Trigger */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="w-full bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between text-xs font-bold text-slate-800 active:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-amber-500" />
            <span>Filter & Sort Flights</span>
            {(selectedStops !== 'all' || selectedAirline !== 'all' || sortBy !== 'cheapest') && (
              <span className="w-2 h-2 rounded-full bg-amber-500" />
            )}
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="text-[11px] font-semibold capitalize text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              {sortBy}
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {showMobileFilters && (
          <div className="mt-2 bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3.5">
            {/* Stops filter */}
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Stops
              </span>
              <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setSelectedStops('all')}
                  className={`py-1.5 rounded-md text-center transition-all ${
                    selectedStops === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
                  }`}
                >
                  All Stops
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedStops('0')}
                  className={`py-1.5 rounded-md text-center transition-all ${
                    selectedStops === '0' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
                  }`}
                >
                  Non-Stop
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedStops('1')}
                  className={`py-1.5 rounded-md text-center transition-all ${
                    selectedStops === '1' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
                  }`}
                >
                  1 Stop
                </button>
              </div>
            </div>

            {/* Airline filter */}
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Airline
              </span>
              <select
                value={selectedAirline}
                onChange={(e) => setSelectedAirline(e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-700 outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">All Airlines ({airlines.length - 1})</option>
                {airlines.filter(a => a !== 'all').map(airline => (
                  <option key={airline} value={airline}>{airline}</option>
                ))}
              </select>
            </div>

            {/* Sort by */}
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Sort By
              </span>
              <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
                {(['cheapest', 'fastest', 'earliest'] as const).map(option => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSortBy(option)}
                    className={`py-1.5 rounded-md capitalize text-center transition-all ${
                      sortBy === option ? 'bg-slate-900 text-white shadow-xs font-bold' : 'text-slate-600'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Filter & Sort Bar */}
      <div className="hidden md:flex bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
            <span>Filters:</span>
          </div>

          {/* Stops filter */}
          <div className="inline-flex p-0.5 bg-slate-100 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setSelectedStops('all')}
              className={`px-3 py-1 rounded-md transition-all ${
                selectedStops === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              All Stops
            </button>
            <button
              type="button"
              onClick={() => setSelectedStops('0')}
              className={`px-3 py-1 rounded-md transition-all ${
                selectedStops === '0' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              Non-Stop only
            </button>
            <button
              type="button"
              onClick={() => setSelectedStops('1')}
              className={`px-3 py-1 rounded-md transition-all ${
                selectedStops === '1' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              1 Stop
            </button>
          </div>

          {/* Airline filter */}
          <select
            value={selectedAirline}
            onChange={(e) => setSelectedAirline(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="all">All Airlines ({airlines.length - 1})</option>
            {airlines.filter(a => a !== 'all').map(airline => (
              <option key={airline} value={airline}>{airline}</option>
            ))}
          </select>
        </div>

        {/* Sort by */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Sort by:</span>
          <div className="inline-flex p-0.5 bg-slate-100 rounded-lg text-xs font-semibold">
            {(['cheapest', 'fastest', 'earliest'] as const).map(option => (
              <button
                key={option}
                type="button"
                onClick={() => setSortBy(option)}
                className={`px-2.5 py-1 rounded-md capitalize transition-all ${
                  sortBy === option ? 'bg-slate-900 text-white shadow-xs font-bold' : 'text-slate-600'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count Notification */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-medium">
        <span>Showing <strong className="text-slate-900">{filteredFlights.length}</strong> available flights</span>
        <span className="flex items-center gap-1 text-emerald-600 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Fares verified with airline CRS
        </span>
      </div>

      {/* Flight Cards List */}
      <div className="space-y-3.5">
        {filteredFlights.map((flight) => {
          const isExpanded = expandedFlightId === flight.id;

          return (
            <div
              key={flight.id}
              className="bg-white border border-[#e2e8f0] hover:border-[#f59e0b] transition-all shadow-xs hover:shadow-md overflow-hidden"
            >
              {/* Main Flight Overview Row */}
              <div className="p-4 sm:p-5">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                  
                  {/* Airline Info */}
                  <div className="lg:col-span-3 flex items-center gap-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${flight.airlineLogoColor} flex items-center justify-center text-white font-black text-sm shadow-xs`}>
                      <SplitFlapTile value={flight.airlineCode} className="font-mono-data" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0b192c] text-sm leading-tight">{flight.airline}</h4>
                      <p className="text-[11px] text-slate-500 font-mono-data mt-0.5 flex items-center gap-1">
                        <SplitFlapTile value={flight.flightNumber} />
                        <span>•</span>
                        <span>{flight.aircraft}</span>
                      </p>
                      {flight.availableSeats <= 5 && (
                        <span className="inline-block mt-1 text-[10px] font-mono-data font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 border border-rose-200">
                          Only {flight.availableSeats} seats left!
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Flight Times & Routing Bar */}
                  <div className="lg:col-span-6 flex items-center justify-between gap-1.5 sm:gap-6">
                    {/* Departure */}
                    <div className="text-left min-w-[60px] sm:min-w-[70px]">
                      <span className="text-lg sm:text-2xl font-black text-[#0b192c] tracking-tight font-mono-data">
                        {flight.departureTime}
                      </span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <SplitFlapTile value={flight.origin.code} className="font-mono-data font-bold text-xs text-[#0b192c] bg-[#f8fafc] px-1 border border-[#e2e8f0]" />
                        <span className="text-[10px] text-slate-500 font-semibold">{flight.terminalDep}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate max-w-[68px] sm:max-w-[85px]">{flight.origin.city}</p>
                    </div>

                    {/* Duration / Stops Graphical Bar */}
                    <div className="flex-1 text-center px-1 sm:px-2">
                      <div className="text-[10px] sm:text-[11px] font-mono-data font-bold text-slate-600 mb-1 flex items-center justify-center gap-1">
                        <Clock className="w-3 h-3 text-[#0ea5e9]" />
                        <span>{formatDuration(flight.durationMinutes)}</span>
                      </div>
                      <div className="relative flex items-center justify-center">
                        <div className="w-full h-0.5 bg-[#e2e8f0]"></div>
                        {flight.stops === 0 ? (
                          <div className="absolute top-1/2 -translate-y-1/2 px-1.5 sm:px-2 bg-white text-[9px] sm:text-[10px] font-mono-data font-bold text-[#059669] border border-[#059669]/30 whitespace-nowrap">
                            Non-Stop
                          </div>
                        ) : (
                          <div className="absolute top-1/2 -translate-y-1/2 px-1.5 sm:px-2 bg-white text-[9px] sm:text-[10px] font-mono-data font-bold text-[#f59e0b] border border-[#f59e0b]/40 flex items-center gap-0.5 sm:gap-1 whitespace-nowrap">
                            <span>1 Stop (<SplitFlapTile value={flight.layoverAirport?.code || 'VIA'} />)</span>
                          </div>
                        )}
                      </div>
                      {flight.layoverDurationMinutes && (
                        <p className="text-[9px] sm:text-[10px] text-slate-400 mt-1 font-mono-data">
                          Layover: {Math.floor(flight.layoverDurationMinutes / 60)}h {flight.layoverDurationMinutes % 60}m
                        </p>
                      )}
                    </div>

                    {/* Arrival */}
                    <div className="text-right min-w-[60px] sm:min-w-[70px]">
                      <span className="text-lg sm:text-2xl font-black text-[#0b192c] tracking-tight font-mono-data">
                        {flight.arrivalTime}
                      </span>
                      <div className="flex items-center justify-end gap-1 mt-0.5">
                        <span className="text-[10px] text-slate-500 font-semibold">{flight.terminalArr}</span>
                        <SplitFlapTile value={flight.destination.code} className="font-mono-data font-bold text-xs text-[#0b192c] bg-[#f8fafc] px-1 border border-[#e2e8f0]" />
                      </div>
                      <p className="text-[10px] text-slate-500 truncate max-w-[68px] sm:max-w-[85px] text-right">{flight.destination.city}</p>
                    </div>
                  </div>

                  {/* Price & Booking Call-to-Action */}
                  <div className="lg:col-span-3 flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 border-t lg:border-t-0 pt-3 lg:pt-0 border-[#e2e8f0]">
                    <div className="w-full sm:w-auto flex items-baseline justify-between sm:block text-left lg:text-right">
                      <div>
                        <div className="text-[10px] uppercase font-mono-data font-bold text-slate-500">Total Fare</div>
                        <div className="text-xl sm:text-2xl font-black text-[#0b192c] font-mono-data">
                          <SplitFlapTile value={formatCurrency(flight.basePrice, currency)} />
                        </div>
                      </div>
                      <div className="text-right sm:text-left lg:text-right">
                        <div className="text-[10px] text-[#059669] font-mono-data font-bold">Taxes & fees included</div>
                        <div className="text-[10px] text-slate-400 font-mono-data">Official Verified PNR Hold</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-1 sm:mt-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => setExpandedFlightId(isExpanded ? null : flight.id)}
                        className="flex-1 sm:flex-initial px-3 py-2.5 min-h-[44px] text-xs font-mono-data font-bold text-[#0b192c] bg-[#f8fafc] hover:bg-[#e2e8f0] border border-[#e2e8f0] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>Fare Tiers</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>

                      <button
                        id={`select-flight-${flight.flightNumber}-btn`}
                        type="button"
                        onClick={() => onSelectFlight(flight, 'standard')}
                        className="flex-1 sm:flex-initial px-4 py-2.5 min-h-[44px] text-xs font-mono-data font-bold text-white bg-[#0b192c] hover:bg-[#0ea5e9] border border-[#0b192c] shadow-xs hover:shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Book / Inquire</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Micro amenities row */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 font-medium">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-slate-600">
                      <Luggage className="w-3.5 h-3.5 text-slate-400" />
                      Checked: 1x 23kg + Cabin: 7kg
                    </span>
                    {flight.amenities.meal && (
                      <span className="flex items-center gap-1">
                        <Utensils className="w-3.5 h-3.5 text-emerald-500" /> Complimentary Hot Meal
                      </span>
                    )}
                    {flight.amenities.wifi && (
                      <span className="flex items-center gap-1">
                        <Wifi className="w-3.5 h-3.5 text-sky-500" /> Wi-Fi Onboard
                      </span>
                    )}
                    {flight.amenities.entertainment && (
                      <span className="hidden sm:flex items-center gap-1">
                        <Tv className="w-3.5 h-3.5 text-amber-500" /> In-Flight Screens
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] text-slate-400 font-mono">
                    Departure Date: {flight.departureDate}
                  </span>
                </div>
              </div>

              {/* Expandable Fare Comparison Tiers */}
              {isExpanded && (
                <div className="bg-slate-50 p-4 border-t border-slate-200 animate-fadeIn">
                  <div className="mb-2">
                    <p className="text-xs font-bold text-slate-800">
                      Select Fare Option for {flight.airline} {flight.flightNumber}:
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {FARE_OPTIONS.map((fare) => {
                      const tierPrice = Math.round(flight.basePrice * fare.priceMultiplier);
                      const isPopular = fare.tier === 'standard';

                      return (
                        <div
                          key={fare.tier}
                          className={`rounded-xl p-3.5 border transition-all relative flex flex-col justify-between ${
                            isPopular
                              ? 'bg-white border-amber-400 shadow-sm ring-1 ring-amber-400/40'
                              : 'bg-white/80 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {isPopular && (
                            <span className="absolute -top-2.5 right-3 bg-amber-500 text-slate-950 font-black text-[9px] uppercase px-2 py-0.5 rounded-full shadow-xs tracking-wider">
                              Most Popular
                            </span>
                          )}

                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <h5 className="font-bold text-slate-900 text-xs">{fare.name}</h5>
                              <span className="font-black text-sm text-slate-900">
                                {formatCurrency(tierPrice, currency)}
                              </span>
                            </div>

                            <ul className="space-y-1.5 my-3 text-[11px] text-slate-600">
                              <li className="flex items-center gap-1.5">
                                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                <span>{fare.checkedBaggage}</span>
                              </li>
                              <li className="flex items-center gap-1.5">
                                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                <span>Seat: {fare.seatSelection === 'paid' ? 'Paid Selection' : 'Free Selection'}</span>
                              </li>
                              <li className="flex items-center gap-1.5">
                                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                <span>{fare.changePolicy}</span>
                              </li>
                              <li className="flex items-center gap-1.5 text-slate-500">
                                <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                <span>{fare.refundPolicy}</span>
                              </li>
                            </ul>
                          </div>

                          <button
                            type="button"
                            onClick={() => onSelectFlight(flight, fare.tier)}
                            className={`w-full py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              isPopular
                                ? 'bg-red-600 hover:bg-red-700 text-white shadow-sm font-black'
                                : 'bg-slate-900 hover:bg-slate-800 text-white'
                            }`}
                          >
                            Book & Send Enquiry ({fare.name})
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

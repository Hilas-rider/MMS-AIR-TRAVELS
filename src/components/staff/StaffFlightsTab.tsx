import React, { useState } from 'react';
import { Plane, Search, Clock, Calendar, ShieldCheck, MapPin, Plus } from 'lucide-react';
import { FareRecord } from './types';

interface StaffFlightsTabProps {
  fares: FareRecord[];
  isDark: boolean;
  onOpenAddFare: () => void;
}

export const StaffFlightsTab: React.FC<StaffFlightsTabProps> = ({
  fares,
  isDark,
  onOpenAddFare
}) => {
  const [search, setSearch] = useState('');

  const flights = fares.filter((f) => 
    !search || 
    f.flightNumber.toLowerCase().includes(search.toLowerCase()) ||
    f.airline.toLowerCase().includes(search.toLowerCase()) ||
    f.originCode.toLowerCase().includes(search.toLowerCase()) ||
    f.destCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Plane className="w-5 h-5 text-sky-400" />
            Flight Operations Directory
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time schedule monitoring, carrier aircraft assignments, and sector timings.
          </p>
        </div>

        <button
          onClick={onOpenAddFare}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Schedule New Flight
        </button>
      </div>

      {/* Search */}
      <div className={`p-4 rounded-2xl border ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search flights by flight number, airline, or city code (e.g. 6E 1475, TRZ, DXB)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Flights Grid with Airline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {flights.map((f) => (
          <div
            key={f.id}
            className={`p-5 rounded-3xl border transition-all duration-300 hover:-translate-y-1 ${
              isDark 
                ? 'bg-slate-900/90 border-slate-800 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-950/20' 
                : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-lg'
            }`}
          >
            {/* Top Bar: Airline & Status */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-950/80 text-sky-400 border border-blue-800/60 flex items-center justify-center font-bold text-xs">
                  {f.airlineCode || f.airline.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white leading-tight">{f.airline}</h4>
                  <span className="font-mono text-[11px] text-amber-400 font-semibold">{f.flightNumber}</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                Scheduled
              </span>
            </div>

            {/* Visual Route Layout */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 mb-4">
              <div className="flex items-center justify-between text-center">
                <div>
                  <span className="font-mono text-base font-black text-white">{f.originCode}</span>
                  <span className="text-[10px] text-slate-400 block">{f.originCity}</span>
                  <span className="text-xs font-semibold text-sky-400 mt-1 block">{f.departureTime}</span>
                </div>

                <div className="flex-1 px-3 flex flex-col items-center">
                  <span className="text-[10px] text-slate-500 font-medium">Direct Non-stop</span>
                  <div className="w-full flex items-center gap-1 my-1">
                    <div className="h-0.5 flex-1 bg-slate-800" />
                    <Plane className="w-3.5 h-3.5 text-blue-400 rotate-90" />
                    <div className="h-0.5 flex-1 bg-slate-800" />
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono">GDS Active</span>
                </div>

                <div>
                  <span className="font-mono text-base font-black text-white">{f.destCode}</span>
                  <span className="text-[10px] text-slate-400 block">{f.destCity}</span>
                  <span className="text-xs font-semibold text-sky-400 mt-1 block">{f.arrivalTime}</span>
                </div>
              </div>
            </div>

            {/* Details Footer */}
            <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-800/60 text-slate-400">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{f.travelDate}</span>
              </div>
              <div className="font-black text-white text-sm num-tabular">
                ₹{f.totalFare.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

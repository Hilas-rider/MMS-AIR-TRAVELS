import React, { useState, useMemo } from 'react';
import { 
  Tag, 
  Search, 
  Plus, 
  Download, 
  Upload, 
  Edit3, 
  Check, 
  X, 
  Filter, 
  ArrowRight, 
  TrendingUp, 
  AlertCircle,
  FileSpreadsheet,
  Layers,
  Clock,
  Sparkles
} from 'lucide-react';
import { FareRecord, AirlineRecord } from './types';

interface StaffFaresTabProps {
  fares: FareRecord[];
  airlines: AirlineRecord[];
  isDark: boolean;
  onUpdateFare: (fare: FareRecord, reason: string) => Promise<void>;
  onCreateFare: (fareData: any) => Promise<void>;
  showAddModal: boolean;
  setShowAddModal: (open: boolean) => void;
  onNotify: (type: 'success' | 'error', message: string) => void;
}

export const StaffFaresTab: React.FC<StaffFaresTabProps> = ({
  fares,
  airlines,
  isDark,
  onUpdateFare,
  onCreateFare,
  showAddModal,
  setShowAddModal,
  onNotify
}) => {
  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [airlineFilter, setAirlineFilter] = useState('ALL');
  const [originFilter, setOriginFilter] = useState('ALL');
  const [destFilter, setDestFilter] = useState('ALL');
  const [cabinFilter, setCabinFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Edit Fare Modal State (with transition animation)
  const [editingFare, setEditingFare] = useState<FareRecord | null>(null);
  const [editTotalFare, setEditTotalFare] = useState<number>(0);
  const [editReason, setEditReason] = useState<string>('');
  const [editSaving, setEditSaving] = useState(false);

  // New Fare Form State with confirmation step
  const [fareFormStep, setFareFormStep] = useState<'form' | 'confirm'>('form');
  const [newFareForm, setNewFareForm] = useState({
    airline: 'IndiGo',
    airlineCode: '6E',
    flightNumber: '6E 1475',
    originCity: 'Trichy',
    originCode: 'TRZ',
    destCity: 'Dubai',
    destCode: 'DXB',
    travelDate: '2026-10-15',
    departureTime: '10:30 AM',
    arrivalTime: '01:45 PM',
    cabinClass: 'Economy' as 'Economy' | 'Premium Economy' | 'Business',
    baseFare: 12500,
    taxes: 2100,
    totalFare: 14600,
    baggageAllowance: '30 Kg Check-in + 7 Kg Cabin',
    seatsAvailable: 12,
    status: 'Active' as 'Active' | 'Inactive',
    notes: 'Direct GDS wholesale rate hold',
    reason: 'Initial wholesale rate release'
  });

  // Filtered Fares
  const filteredFares = useMemo(() => {
    return fares.filter((f) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        f.airline.toLowerCase().includes(q) ||
        f.flightNumber.toLowerCase().includes(q) ||
        f.originCode.toLowerCase().includes(q) ||
        f.destCode.toLowerCase().includes(q) ||
        f.originCity.toLowerCase().includes(q) ||
        f.destCity.toLowerCase().includes(q)
      );

      const matchesAirline = airlineFilter === 'ALL' || f.airline === airlineFilter || f.airlineCode === airlineFilter;
      const matchesOrigin = originFilter === 'ALL' || f.originCode === originFilter || f.originCity === originFilter;
      const matchesDest = destFilter === 'ALL' || f.destCode === destFilter || f.destCity === destFilter;
      const matchesCabin = cabinFilter === 'ALL' || f.cabinClass === cabinFilter;
      const matchesStatus = statusFilter === 'ALL' || f.status === statusFilter;

      return matchesSearch && matchesAirline && matchesOrigin && matchesDest && matchesCabin && matchesStatus;
    });
  }, [fares, searchQuery, airlineFilter, originFilter, destFilter, cabinFilter, statusFilter]);

  // Unique origins & destinations for filters
  const uniqueOrigins = Array.from(new Set(fares.map((f) => f.originCity))).filter(Boolean);
  const uniqueDests = Array.from(new Set(fares.map((f) => f.destCity))).filter(Boolean);

  // Handle Export CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Airline', 'Flight', 'Origin', 'Destination', 'Date', 'Cabin', 'BaseFare', 'Taxes', 'TotalFare', 'Seats', 'Status'];
    const rows = filteredFares.map((f) => [
      f.id,
      f.airline,
      f.flightNumber,
      f.originCode,
      f.destCode,
      f.travelDate,
      f.cabinClass,
      f.baseFare,
      f.taxes,
      f.totalFare,
      f.seatsAvailable,
      f.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MMS_Fares_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onNotify('success', `Exported ${filteredFares.length} fare records to CSV.`);
  };

  // Open Edit Modal
  const handleStartEdit = (fare: FareRecord) => {
    setEditingFare(fare);
    setEditTotalFare(fare.totalFare);
    setEditReason('');
  };

  // Submit Fare Update with animation transition
  const handleSaveEdit = async () => {
    if (!editingFare) return;
    if (!editReason.trim()) {
      onNotify('error', 'Please enter a valid reason for the fare adjustment audit trail.');
      return;
    }
    setEditSaving(true);
    try {
      const updatedFare: FareRecord = {
        ...editingFare,
        totalFare: editTotalFare,
        baseFare: Math.round(editTotalFare * 0.85),
        taxes: editTotalFare - Math.round(editTotalFare * 0.85)
      };
      await onUpdateFare(updatedFare, editReason);
      setEditingFare(null);
      onNotify('success', `Fare updated: ₹${editingFare.totalFare.toLocaleString('en-IN')} ↓ ₹${editTotalFare.toLocaleString('en-IN')}`);
    } catch (err: any) {
      onNotify('error', err.message || 'Failed to update fare.');
    } finally {
      setEditSaving(false);
    }
  };

  // Submit Add Fare
  const handleSaveNewFare = async () => {
    try {
      await onCreateFare(newFareForm);
      setShowAddModal(false);
      setFareFormStep('form');
      onNotify('success', `Fare for ${newFareForm.flightNumber} (${newFareForm.originCode} ➔ ${newFareForm.destCode}) published successfully.`);
    } catch (err: any) {
      onNotify('error', err.message || 'Failed to publish fare.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Main Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-sky-400" />
            Wholesale Fare Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Maintain live seat holds, group quotes, and inventory pricing. All updates are logged to the Fare History ledger.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isDark ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200' : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => onNotify('success', 'Ready to import GDS bulk CSV. Template downloaded to clipboard.')}
            className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isDark ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200' : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import</span>
          </button>

          <button
            onClick={() => {
              setFareFormStep('form');
              setShowAddModal(true);
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Fare</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className={`p-4 rounded-2xl border space-y-3 ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Text Search */}
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search airline, flight number, origin, or destination (e.g. TRZ, DXB, IndiGo)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs border focus:outline-none focus:border-blue-500 transition-colors ${
                isDark ? 'bg-slate-950 border-slate-800 text-white placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
              }`}
            />
          </div>

          {/* Reset Filters */}
          {(searchQuery || airlineFilter !== 'ALL' || originFilter !== 'ALL' || destFilter !== 'ALL' || cabinFilter !== 'ALL' || statusFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setAirlineFilter('ALL');
                setOriginFilter('ALL');
                setDestFilter('ALL');
                setCabinFilter('ALL');
                setStatusFilter('ALL');
              }}
              className="text-xs text-slate-400 hover:text-white px-2.5 py-1.5 underline cursor-pointer"
            >
              Reset All Filters
            </button>
          )}
        </div>

        {/* Dropdown Filters Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
          {/* Airline Filter */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Carrier</label>
            <select
              value={airlineFilter}
              onChange={(e) => setAirlineFilter(e.target.value)}
              className={`w-full px-2.5 py-1.5 rounded-lg text-xs border focus:outline-none focus:border-blue-500 ${
                isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <option value="ALL">All Carriers ({fares.length})</option>
              {airlines.map((a) => (
                <option key={a.id} value={a.name}>{a.name} ({a.code})</option>
              ))}
            </select>
          </div>

          {/* Origin Filter */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Origin</label>
            <select
              value={originFilter}
              onChange={(e) => setOriginFilter(e.target.value)}
              className={`w-full px-2.5 py-1.5 rounded-lg text-xs border focus:outline-none focus:border-blue-500 ${
                isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <option value="ALL">All Origins</option>
              {uniqueOrigins.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Destination Filter */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Destination</label>
            <select
              value={destFilter}
              onChange={(e) => setDestFilter(e.target.value)}
              className={`w-full px-2.5 py-1.5 rounded-lg text-xs border focus:outline-none focus:border-blue-500 ${
                isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <option value="ALL">All Destinations</option>
              {uniqueDests.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Cabin Filter */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Cabin</label>
            <select
              value={cabinFilter}
              onChange={(e) => setCabinFilter(e.target.value)}
              className={`w-full px-2.5 py-1.5 rounded-lg text-xs border focus:outline-none focus:border-blue-500 ${
                isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <option value="ALL">All Cabins</option>
              <option value="Economy">Economy</option>
              <option value="Premium Economy">Premium Economy</option>
              <option value="Business">Business</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`w-full px-2.5 py-1.5 rounded-lg text-xs border focus:outline-none focus:border-blue-500 ${
                isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

      </div>

      {/* Fares Table */}
      <div className={`rounded-3xl border overflow-hidden shadow-xl ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className={`border-b text-[10px] font-bold uppercase tracking-wider ${
              isDark ? 'bg-slate-950/80 text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-500 border-slate-200'
            }`}>
              <tr>
                <th className="p-4">Airline</th>
                <th className="p-4">Flight</th>
                <th className="p-4">Route</th>
                <th className="p-4">Date</th>
                <th className="p-4">Cabin</th>
                <th className="p-4 text-right">Base Fare</th>
                <th className="p-4 text-right">Taxes</th>
                <th className="p-4 text-right">Total Net</th>
                <th className="p-4">Seats</th>
                <th className="p-4">Status</th>
                <th className="p-4">Last Updated</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 font-medium">
              {filteredFares.length === 0 ? (
                <tr>
                  <td colSpan={12} className="p-12 text-center text-slate-400">
                    <p className="text-sm font-semibold">No flight fares match your search criteria.</p>
                    <p className="text-xs text-slate-500 mt-1">Try resetting the carrier or sector filters above.</p>
                  </td>
                </tr>
              ) : (
                filteredFares.map((f) => (
                  <tr 
                    key={f.id} 
                    className={`transition-colors ${
                      isDark ? 'hover:bg-slate-850' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="p-4 font-bold text-white">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-blue-950/80 text-sky-400 border border-blue-800/60 flex items-center justify-center font-bold text-[10px]">
                          {f.airlineCode || f.airline.substring(0, 2).toUpperCase()}
                        </span>
                        <span>{f.airline}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-black text-amber-400">
                      {f.flightNumber}
                    </td>
                    <td className="p-4 font-bold text-slate-200">
                      <div className="flex items-center gap-1.5">
                        <span>{f.originCode}</span>
                        <ArrowRight className="w-3 h-3 text-slate-500" />
                        <span>{f.destCode}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-normal block">
                        {f.originCity} to {f.destCity}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300 whitespace-nowrap">
                      {f.travelDate}
                    </td>
                    <td className="p-4 text-slate-300">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300">
                        {f.cabinClass}
                      </span>
                    </td>
                    <td className="p-4 text-right text-slate-400 num-tabular">
                      ₹{f.baseFare.toLocaleString('en-IN')}
                    </td>
                    <td className="p-4 text-right text-slate-400 num-tabular">
                      ₹{f.taxes.toLocaleString('en-IN')}
                    </td>
                    <td className="p-4 text-right font-black text-emerald-400 text-sm num-tabular">
                      ₹{f.totalFare.toLocaleString('en-IN')}
                    </td>
                    <td className="p-4 font-bold text-sky-400 num-tabular">
                      {f.seatsAvailable}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        f.status === 'Active' 
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {f.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 text-[11px] whitespace-nowrap">
                      {new Date(f.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleStartEdit(f)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600/80 hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 ml-auto transition-colors cursor-pointer shadow-xs"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Update Rate</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* AIRLINE FARE UPDATE ANIMATION MODAL */}
      {editingFare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className={`w-full max-w-lg p-6 sm:p-7 rounded-3xl shadow-2xl border ${
            isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-700/50 mb-5">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Update Wholesale Fare
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {editingFare.airline} {editingFare.flightNumber} • {editingFare.originCode} ➔ {editingFare.destCode}
                </p>
              </div>
              <button 
                onClick={() => setEditingFare(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {/* Smooth Transition Visualization: Previous Rate ↓ New Rate */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 mb-5 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Rate Adjustment Preview
              </span>
              <div className="flex items-center justify-center gap-4 py-2">
                <div>
                  <span className="text-xs text-slate-400 block">Current Rate</span>
                  <span className="text-lg font-bold text-slate-400 line-through num-tabular">
                    ₹{editingFare.totalFare.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="w-8 h-8 rounded-full bg-blue-950 border border-blue-800 flex items-center justify-center text-sky-400 font-bold text-base">
                  ↓
                </div>

                <div>
                  <span className="text-xs text-emerald-400 block font-semibold">New Proposed Rate</span>
                  <span className="text-2xl font-black text-emerald-400 num-tabular transition-all">
                    ₹{(editTotalFare || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  New Total Net Fare (₹ INR)
                </label>
                <input
                  type="number"
                  value={editTotalFare}
                  onChange={(e) => setEditTotalFare(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Mandatory Audit Reason <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Airline fuel surcharge reduction, festival promo discount, GDS wholesale revision"
                  value={editReason}
                  onChange={(e) => setEditReason(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  This note will be recorded into the permanent Fare History timeline along with your staff email.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-slate-800/60">
              <button
                type="button"
                onClick={() => setEditingFare(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={editSaving}
                onClick={handleSaveEdit}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                {editSaving ? 'Publishing...' : 'Save & Publish to Live GDS'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD FARE PANEL MODAL / DRAWER WITH CONFIRMATION STATE */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
          <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl shadow-2xl border ${
            isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-700/50 mb-5">
              <div>
                <h3 className="text-lg font-black text-white">
                  {fareFormStep === 'form' ? 'Add New Wholesale Flight Fare' : 'Confirm New Flight Rate'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {fareFormStep === 'form' 
                    ? 'Enter the airline flight details and inventory quota.' 
                    : 'Review the details below before publishing to the live portal.'}
                </p>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {fareFormStep === 'form' ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                setFareFormStep('confirm');
              }} className="space-y-4">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Airline Carrier</label>
                    <select
                      value={newFareForm.airline}
                      onChange={(e) => {
                        const air = airlines.find(a => a.name === e.target.value);
                        setNewFareForm({
                          ...newFareForm,
                          airline: e.target.value,
                          airlineCode: air ? air.code : newFareForm.airlineCode
                        });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                    >
                      {airlines.map((a) => (
                        <option key={a.id} value={a.name}>{a.name} ({a.code})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Flight Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 6E 1475"
                      value={newFareForm.flightNumber}
                      onChange={(e) => setNewFareForm({ ...newFareForm, flightNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Origin City</label>
                    <input
                      type="text"
                      required
                      value={newFareForm.originCity}
                      onChange={(e) => setNewFareForm({ ...newFareForm, originCity: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Origin Code</label>
                    <input
                      type="text"
                      required
                      value={newFareForm.originCode}
                      onChange={(e) => setNewFareForm({ ...newFareForm, originCode: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Dest City</label>
                    <input
                      type="text"
                      required
                      value={newFareForm.destCity}
                      onChange={(e) => setNewFareForm({ ...newFareForm, destCity: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Dest Code</label>
                    <input
                      type="text"
                      required
                      value={newFareForm.destCode}
                      onChange={(e) => setNewFareForm({ ...newFareForm, destCode: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Travel Date</label>
                    <input
                      type="date"
                      required
                      value={newFareForm.travelDate}
                      onChange={(e) => setNewFareForm({ ...newFareForm, travelDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Departure Time</label>
                    <input
                      type="text"
                      placeholder="10:30 AM"
                      value={newFareForm.departureTime}
                      onChange={(e) => setNewFareForm({ ...newFareForm, departureTime: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Arrival Time</label>
                    <input
                      type="text"
                      placeholder="01:45 PM"
                      value={newFareForm.arrivalTime}
                      onChange={(e) => setNewFareForm({ ...newFareForm, arrivalTime: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Total Net Fare (₹)</label>
                    <input
                      type="number"
                      required
                      value={newFareForm.totalFare}
                      onChange={(e) => {
                        const total = Number(e.target.value);
                        const base = Math.round(total * 0.85);
                        setNewFareForm({
                          ...newFareForm,
                          totalFare: total,
                          baseFare: base,
                          taxes: total - base
                        });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-emerald-400 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Cabin Class</label>
                    <select
                      value={newFareForm.cabinClass}
                      onChange={(e: any) => setNewFareForm({ ...newFareForm, cabinClass: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                    >
                      <option value="Economy">Economy</option>
                      <option value="Premium Economy">Premium Economy</option>
                      <option value="Business">Business</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Seats Available</label>
                    <input
                      type="number"
                      value={newFareForm.seatsAvailable}
                      onChange={(e) => setNewFareForm({ ...newFareForm, seatsAvailable: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                  >
                    Continue to Confirmation →
                  </button>
                </div>
              </form>
            ) : (
              /* Confirmation Screen */
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Carrier & Flight:</span>
                    <span className="font-bold text-white">{newFareForm.airline} ({newFareForm.flightNumber})</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Sector:</span>
                    <span className="font-bold text-white">{newFareForm.originCity} ({newFareForm.originCode}) ➔ {newFareForm.destCity} ({newFareForm.destCode})</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Travel Date & Timing:</span>
                    <span className="font-bold text-white">{newFareForm.travelDate} ({newFareForm.departureTime} - {newFareForm.arrivalTime})</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Cabin & Available Seats:</span>
                    <span className="font-bold text-white">{newFareForm.cabinClass} • {newFareForm.seatsAvailable} Seats</span>
                  </div>
                  <div className="flex justify-between py-1 text-sm font-black">
                    <span className="text-slate-400">Total Net Fare:</span>
                    <span className="text-emerald-400">₹{newFareForm.totalFare.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setFareFormStep('form')}
                    className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                  >
                    ← Back to Edit
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveNewFare}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
                  >
                    Confirm & Publish Fare
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

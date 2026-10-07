import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  MapPin, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Calculator, 
  ShieldCheck, 
  Boxes, 
  ArrowRight,
  Plane,
  AlertCircle,
  FileText
} from 'lucide-react';
import { CargoShipment, CurrencyCode } from '../types';
import { INITIAL_CARGO_SHIPMENTS } from '../data/initialData';
import { formatCurrency } from '../data/airports';

interface CargoTrackerProps {
  currency: CurrencyCode;
  onOpenEnquiry?: (serviceType: any, destPreset?: string) => void;
}

export const CargoTracker: React.FC<CargoTrackerProps> = ({ currency, onOpenEnquiry }) => {
  const [shipments, setShipments] = useState<CargoShipment[]>(INITIAL_CARGO_SHIPMENTS);
  const [searchAwb, setSearchAwb] = useState('');
  const [selectedAwb, setSelectedAwb] = useState<string>(INITIAL_CARGO_SHIPMENTS[0].awbNumber);
  const [activeTab, setActiveTab] = useState<'track' | 'quote'>('track');
  const [notification, setNotification] = useState<string | null>(null);

  // Rate calculator state
  const [originPort, setOriginPort] = useState('Dubai World Central (DWC)');
  const [destPort, setDestPort] = useState('London Heathrow (LHR)');
  const [weightKg, setWeightKg] = useState<number>(250);
  const [volumeCbm, setVolumeCbm] = useState<number>(1.2);
  const [cargoType, setCargoType] = useState<CargoShipment['cargoType']>('General Cargo');
  const [senderName, setSenderName] = useState('Emirates Export Trading');
  const [receiverName, setReceiverName] = useState('Apex Logistics Europe');

  const activeShipment = shipments.find(s => s.awbNumber === selectedAwb) || shipments[0];

  const handleSearchAwb = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchAwb.trim().toUpperCase();
    const found = shipments.find(s => s.awbNumber.toUpperCase() === query);
    if (found) {
      setSelectedAwb(found.awbNumber);
      setNotification(`AWB ${found.awbNumber} retrieved successfully.`);
    } else {
      setNotification(`AWB "${query}" not found. Try sample: MMS-7719-8821`);
    }
    setTimeout(() => setNotification(null), 3000);
  };

  // Instant Freight Rate Calculation
  const ratePerKg = {
    'General Cargo': 2.8,
    'Perishables': 3.6,
    'Pharma / Temperature Controlled': 4.5,
    'Express Courier': 5.2,
    'Dangerous Goods': 5.8,
    'Automotive / Heavy Equipment': 3.9
  }[cargoType];

  const chargeableWeight = Math.max(weightKg, volumeCbm * 167); // Standard volumetric ratio 1 CBM = 167 kg
  const baseFreight = Math.round(chargeableWeight * ratePerKg);
  const fuelSurcharge = Math.round(chargeableWeight * 0.45);
  const securityAndHandling = 65;
  const totalFreightCostUSD = baseFreight + fuelSurcharge + securityAndHandling;

  const handleCreateShipment = (e: React.FormEvent) => {
    e.preventDefault();
    const newAwbNumber = `MMS-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newShipment: CargoShipment = {
      awbNumber: newAwbNumber,
      origin: originPort,
      destination: destPort,
      senderName,
      receiverName,
      cargoType,
      weightKg,
      volumeCbm,
      pieces: Math.ceil(weightKg / 25),
      flightAssigned: `MMS-CARGO-${Math.floor(100 + Math.random() * 900)}`,
      bookingDate: new Date().toISOString().split('T')[0],
      estimatedDelivery: '2026-09-08 18:00 UTC',
      currentStatus: 'BOOKED',
      timeline: [
        {
          status: 'Air Waybill Generated & Booked',
          location: originPort,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          description: 'Cargo booking confirmed in MMS Global Freight System',
          completed: true
        },
        {
          status: 'Awaiting Terminal Gate-In',
          location: originPort,
          timestamp: 'Pending Delivery',
          description: 'Shipment scheduled for warehouse drop-off & security screening',
          completed: false
        }
      ]
    };

    setShipments(prev => [newShipment, ...prev]);
    setSelectedAwb(newAwbNumber);
    setActiveTab('track');
    setNotification(`New Cargo Shipment booked! AWB Number: ${newAwbNumber}`);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-amber-500/50 flex items-center gap-2 text-xs font-bold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-amber-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Hero Header & Mode Switcher */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-black text-xs uppercase tracking-widest">
                AIR FREIGHT & LOGISTICS DIVISION
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              MMS Air Travels & Cargo Service
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Worldwide air cargo forwarding, express courier, cold chain perishables, and live Air Waybill tracking.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('track')}
                className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                  activeTab === 'track' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Track Air Waybill (AWB)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('quote')}
                className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                  activeTab === 'quote' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Calculator className="w-4 h-4" />
                <span>Freight Rate Calculator</span>
              </button>
            </div>

            {onOpenEnquiry && (
              <button
                type="button"
                onClick={() => onOpenEnquiry('Cargo', `${originPort} to ${destPort} (${weightKg}kg ${cargoType})`)}
                className="px-4 py-2 bg-[#e85c0d] hover:bg-[#d04e05] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <FileText className="w-4 h-4" />
                <span>Send Cargo Inquiry</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Sample AWB Bar */}
        {activeTab === 'track' && (
          <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-bold">Sample AWBs:</span>
              {shipments.map((s) => (
                <button
                  key={s.awbNumber}
                  type="button"
                  onClick={() => setSelectedAwb(s.awbNumber)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                    selectedAwb === s.awbNumber
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {s.awbNumber}
                </button>
              ))}
            </div>

            <form onSubmit={handleSearchAwb} className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Enter AWB Number..."
                value={searchAwb}
                onChange={(e) => setSearchAwb(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors"
              >
                Track
              </button>
            </form>
          </div>
        )}
      </div>

      {/* TRACKING VIEW */}
      {activeTab === 'track' && activeShipment && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Shipment Overview & Milestone Timeline */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Summary card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">
                    AIR WAYBILL (AWB)
                  </span>
                  <span className="text-xl font-black font-mono text-slate-900">
                    {activeShipment.awbNumber}
                  </span>
                </div>
                <span className="text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                  {activeShipment.currentStatus.replace('_', ' ')}
                </span>
              </div>

              {/* Origin to Destination Route */}
              <div className="grid grid-cols-3 items-center text-center sm:text-left py-2">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">ORIGIN</span>
                  <span className="text-sm font-extrabold text-slate-900">{activeShipment.origin}</span>
                </div>
                <div className="text-center">
                  <div className="text-[10px] font-bold text-slate-400 mb-1">
                    Flight: {activeShipment.flightAssigned || 'TBA'}
                  </div>
                  <div className="flex items-center justify-center gap-1 text-amber-500">
                    <div className="h-0.5 bg-slate-200 w-12" />
                    <Plane className="w-4 h-4 rotate-90 text-slate-800" />
                    <div className="h-0.5 bg-slate-200 w-12" />
                  </div>
                  <span className="text-[10px] text-slate-500">Scheduled Air Transit</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">DESTINATION</span>
                  <span className="text-sm font-extrabold text-slate-900">{activeShipment.destination}</span>
                </div>
              </div>

              {/* Cargo Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Cargo Type</span>
                  <span className="font-bold text-slate-800">{activeShipment.cargoType}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Gross Weight</span>
                  <span className="font-bold text-slate-800 font-mono">{activeShipment.weightKg} KG</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Volume / Pieces</span>
                  <span className="font-bold text-slate-800">{activeShipment.volumeCbm} CBM • {activeShipment.pieces} Pcs</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Estimated Delivery</span>
                  <span className="font-bold text-emerald-600">{activeShipment.estimatedDelivery}</span>
                </div>
              </div>
            </div>

            {/* Shipment Milestones Timeline */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                Live Cargo Milestone Progression
              </h4>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {activeShipment.timeline.map((item, idx) => {
                  return (
                    <div key={idx} className="relative">
                      {/* Step Circle */}
                      <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        item.completed
                          ? 'bg-amber-500 border-amber-600 text-slate-950 shadow-2xs'
                          : 'bg-white border-slate-300 text-transparent'
                      }`}>
                        {item.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <h5 className="text-xs font-bold text-slate-900">{item.status}</h5>
                          <span className="text-[11px] font-mono text-slate-400">{item.timestamp}</span>
                        </div>
                        <p className="text-[11px] font-semibold text-slate-600 mt-0.5">{item.location}</p>
                        <p className="text-xs text-slate-500 mt-1">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Consignee & Carrier Details */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <h4 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">
                Consignor & Consignee
              </h4>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Shipper (Sender)</span>
                  <span className="font-bold text-slate-800">{activeShipment.senderName}</span>
                  <p className="text-[11px] text-slate-500">{activeShipment.origin}</p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Consignee (Receiver)</span>
                  <span className="font-bold text-slate-800">{activeShipment.receiverName}</span>
                  <p className="text-[11px] text-slate-500">{activeShipment.destination}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>MMS 24/7 Cargo Helpline</span>
              </div>
              <p className="text-xs text-slate-300">
                Need urgent customs clearance or temperature log verification? Connect with our dedicated air cargo operations hub.
              </p>
              <div className="pt-2 border-t border-slate-800 text-xs font-mono text-amber-400">
                cargo@skyairtravels.com • +971 4 228 8990
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RATE CALCULATOR & INSTANT BOOKING VIEW */}
      {activeTab === 'quote' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-amber-500" />
              Air Cargo Freight Rate Calculator & Booking
            </h3>

            <form onSubmit={handleCreateShipment} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Origin Cargo Port *</label>
                  <input
                    type="text"
                    required
                    value={originPort}
                    onChange={(e) => setOriginPort(e.target.value)}
                    className="w-full p-2.5 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Destination Cargo Port *</label>
                  <input
                    type="text"
                    required
                    value={destPort}
                    onChange={(e) => setDestPort(e.target.value)}
                    className="w-full p-2.5 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Gross Weight (KG) *</label>
                  <input
                    type="number"
                    min={1}
                    max={50000}
                    required
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full p-2.5 text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Volume (CBM) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min={0.1}
                    required
                    value={volumeCbm}
                    onChange={(e) => setVolumeCbm(Number(e.target.value))}
                    className="w-full p-2.5 text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Commodity Type</label>
                  <select
                    value={cargoType}
                    onChange={(e) => setCargoType(e.target.value as any)}
                    className="w-full p-2.5 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl outline-none"
                  >
                    <option value="General Cargo">General Cargo</option>
                    <option value="Perishables">Perishables (Cold Chain)</option>
                    <option value="Pharma / Temperature Controlled">Pharma (+2°C to +8°C)</option>
                    <option value="Express Courier">Express Air Courier</option>
                    <option value="Dangerous Goods">Dangerous Goods (DGR)</option>
                    <option value="Automotive / Heavy Equipment">Automotive & Heavy Machinery</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Shipper / Company Name *</label>
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full p-2.5 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Consignee Name *</label>
                  <input
                    type="text"
                    required
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                    className="w-full p-2.5 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer mt-4"
              >
                <span>BOOK AIR CARGO SHIPMENT & ISSUE AWB</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Rate Summary Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md space-y-4">
              <h4 className="font-black text-sm text-amber-400 uppercase tracking-wider">
                Real-Time Air Freight Rate Breakdown
              </h4>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Chargeable Weight:</span>
                  <span className="font-mono font-bold text-white">{Math.round(chargeableWeight)} KG</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Base Air Freight Rate (${ratePerKg}/kg):</span>
                  <span className="font-mono text-white">{formatCurrency(baseFreight, currency)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Air Fuel Surcharge (FSC):</span>
                  <span className="font-mono text-white">{formatCurrency(fuelSurcharge, currency)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Terminal Handling & Customs Security:</span>
                  <span className="font-mono text-white">{formatCurrency(securityAndHandling, currency)}</span>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                  <span className="font-bold text-sm text-amber-400">Estimated Total Rate:</span>
                  <span className="text-2xl font-black text-amber-400 font-mono">
                    {formatCurrency(totalFreightCostUSD, currency)}
                  </span>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <p className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Direct Carrier Space Allocation Guaranteed
                </p>
                <p>Transit time: 24 to 48 hours airport-to-airport across primary international hubs.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

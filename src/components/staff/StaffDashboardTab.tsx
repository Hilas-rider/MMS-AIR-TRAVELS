import React from 'react';
import { 
  Plane, 
  Tag, 
  Plus, 
  Clock, 
  ArrowRight, 
  FileText, 
  ExternalLink, 
  BookmarkCheck, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { StaffGlobe } from './StaffGlobe';
import { StaffStatsCards } from './StaffStatsCards';
import { StaffUser, BookingRecord, EnquiryRecord, FareRecord } from './types';
import { StaffTabId } from './StaffSidebar';

interface StaffDashboardTabProps {
  currentUser: StaffUser;
  isDark: boolean;
  onNavigateTab: (tab: StaffTabId) => void;
  onOpenAddFare: () => void;
  recentFares: FareRecord[];
  recentBookings: BookingRecord[];
  recentEnquiries: EnquiryRecord[];
  stats?: any;
}

export const StaffDashboardTab: React.FC<StaffDashboardTabProps> = ({
  currentUser,
  isDark,
  onNavigateTab,
  onOpenAddFare,
  recentFares,
  recentBookings,
  recentEnquiries,
  stats
}) => {
  // Determine greeting based on current local hour
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="space-y-6">
      
      {/* Hero Section with 3D Operations Globe */}
      <div className={`relative rounded-3xl border overflow-hidden p-6 sm:p-8 transition-all ${
        isDark 
          ? 'bg-radial-[at_top_left] from-slate-900 via-slate-950 to-slate-950 border-slate-800 shadow-2xl' 
          : 'bg-radial-[at_top_left] from-blue-50/80 via-white to-slate-50 border-slate-200 shadow-lg'
      }`}>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero Text & Quick Action Chips */}
          <div className="lg:col-span-7 space-y-4">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-950/60 border border-blue-800/80 text-sky-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>MMS Air Travels • International Wholesale Operations Desk</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              {greeting}, {currentUser.fullName.split(' ')[0]}
            </h1>

            <p className="text-sm sm:text-base text-slate-400 max-w-xl leading-relaxed">
              Manage your travel operations efficiently. Real-time monitoring across Trichy, Chennai, Madurai, Dubai, Singapore, and international corridors.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenAddFare}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all cursor-pointer hover:scale-102"
              >
                <Plus className="w-4 h-4" />
                Add New Airline Fare
              </button>

              <button
                onClick={() => onNavigateTab('enquiries')}
                className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  isDark 
                    ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200' 
                    : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800 shadow-xs'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-amber-400" />
                Customer Enquiries
              </button>

              <button
                onClick={() => onNavigateTab('reports')}
                className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  isDark 
                    ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200' 
                    : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800 shadow-xs'
                }`}
              >
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Analytics & Reports
              </button>
            </div>

            {/* Live Operations Indicator */}
            <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                GDS Real-time Feed Active
              </span>
              <span>•</span>
              <span>Session Role: <strong className="text-white uppercase">{currentUser.role}</strong></span>
              <span>•</span>
              <span className="font-mono">Single Domain /staff/</span>
            </div>

          </div>

          {/* Right: Subtle 3D Globe with Flight Routes */}
          <div className="lg:col-span-5 h-[230px] sm:h-[260px] w-full flex items-center justify-center relative">
            <div className="w-full h-full rounded-2xl overflow-hidden border border-slate-800/60 bg-slate-950/40 backdrop-blur-xs">
              <StaffGlobe isDark={isDark} />
            </div>
          </div>

        </div>

      </div>

      {/* 6 3D Statistics Cards */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Operations Snapshot</span>
          <span className="text-[11px] text-slate-500">Auto-synced every 30s</span>
        </div>
        <StaffStatsCards
          isDark={isDark}
          onNavigateTab={onNavigateTab}
          stats={stats}
        />
      </div>

      {/* Two-Column Grid: Recent Bookings & Priority Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Recent Confirmed Bookings (7 cols) */}
        <div className={`lg:col-span-7 p-5 sm:p-6 rounded-3xl border ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/40">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BookmarkCheck className="w-4 h-4 text-emerald-400" />
                Recent Confirmed Bookings
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Direct PNR allocations and ticketing status</p>
            </div>
            <button
              onClick={() => onNavigateTab('bookings')}
              className="text-xs text-blue-500 hover:text-blue-400 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>All Bookings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentBookings.slice(0, 4).map((b) => (
              <div 
                key={b.id}
                className={`p-3.5 rounded-2xl border transition-all flex flex-wrap items-center justify-between gap-3 ${
                  isDark ? 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-950/80 text-sky-400 border border-blue-800/50 flex items-center justify-center font-black text-xs">
                    {b.airline.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white">{b.customerName}</span>
                      <span className="font-mono text-[11px] text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded">
                        {b.pnr}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="font-semibold text-slate-300">{b.route}</span>
                      <span>•</span>
                      <span>{b.travelDate}</span>
                      <span>•</span>
                      <span>{b.airline} ({b.flightNumber})</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-emerald-400 text-xs block num-tabular">
                    ₹{b.amount.toLocaleString('en-IN')}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold mt-1 inline-block ${
                    b.bookingStatus === 'Ticketed' 
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {b.bookingStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Customer Enquiries (5 cols) */}
        <div className={`lg:col-span-5 p-5 sm:p-6 rounded-3xl border ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/40">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                Priority Enquiries
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Leads awaiting quotation review</p>
            </div>
            <button
              onClick={() => onNavigateTab('enquiries')}
              className="text-xs text-blue-500 hover:text-blue-400 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Inbox</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentEnquiries.slice(0, 4).map((e) => (
              <div 
                key={e.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isDark ? 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white">{e.customerName}</span>
                    <span className="text-[10px] text-slate-400">{e.passengers} Pax</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {e.origin} ➔ {e.destination} • {e.travelDate}
                  </p>
                  {e.budget && (
                    <span className="text-[10px] text-amber-300 font-mono">
                      Budget: ₹{e.budget.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    e.status === 'New' 
                      ? 'bg-blue-950 text-sky-300 border border-blue-800 animate-pulse'
                      : e.status === 'Quotation Sent'
                      ? 'bg-purple-950 text-purple-300 border border-purple-800'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {e.status}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    {e.createdAt.split(' ')[0]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Wholesale Live Fares Quick Strip */}
      <div className={`p-5 rounded-3xl border ${
        isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-sky-400" />
              Live Wholesale Carrier Fares
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Active rates published on customer search engines</p>
          </div>
          <button
            onClick={() => onNavigateTab('fares')}
            className="text-xs text-blue-500 hover:text-blue-400 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>Manage All Fares</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {recentFares.slice(0, 4).map((f) => (
            <div 
              key={f.id}
              onClick={() => onNavigateTab('fares')}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                isDark ? 'bg-slate-950/70 border-slate-800 hover:border-blue-500/50' : 'bg-slate-50 border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-white">{f.airline}</span>
                <span className="font-mono text-amber-400">{f.flightNumber}</span>
              </div>
              <div className="text-xs text-slate-300 font-semibold mb-2">
                {f.originCode} ➔ {f.destCode}
              </div>
              <div className="flex items-baseline justify-between text-xs pt-2 border-t border-slate-800/60">
                <span className="text-[11px] text-slate-400">{f.cabinClass}</span>
                <span className="font-black text-emerald-400 text-sm num-tabular">
                  ₹{f.totalFare.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

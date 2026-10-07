import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Plane, 
  Calendar,
  Download
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

interface StaffReportsTabProps {
  isDark: boolean;
  onNotify: (type: 'success' | 'error', message: string) => void;
}

export const StaffReportsTab: React.FC<StaffReportsTabProps> = ({ isDark, onNotify }) => {
  const [timeRange, setTimeRange] = useState('6M');

  const monthlyTrends = [
    { month: 'Apr', bookings: 78, enquiries: 110, revenue: 980000 },
    { month: 'May', bookings: 92, enquiries: 135, revenue: 1150000 },
    { month: 'Jun', bookings: 110, enquiries: 160, revenue: 1420000 },
    { month: 'Jul', bookings: 125, enquiries: 178, revenue: 1680000 },
    { month: 'Aug', bookings: 145, enquiries: 195, revenue: 1920000 },
    { month: 'Sep', bookings: 68, enquiries: 95, revenue: 890000 }
  ];

  const routeDistribution = [
    { route: 'TRZ → DXB', count: 48, revenue: 684000 },
    { route: 'MAA → SIN', count: 36, revenue: 468000 },
    { route: 'TRZ → SHJ', count: 32, revenue: 396800 },
    { route: 'MAA → DOH', count: 24, revenue: 523200 },
    { route: 'IXM → CMB', count: 18, revenue: 216000 }
  ];

  const airlineShares = [
    { name: 'IndiGo (6E)', value: 42, color: '#0284c7' },
    { name: 'Air India Express', value: 25, color: '#f59e0b' },
    { name: 'Qatar Airways', value: 16, color: '#881337' },
    { name: 'Scoot (TR)', value: 10, color: '#eab308' },
    { name: 'Others', value: 7, color: '#64748b' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-sky-400" />
            Operations Analytics & Revenue Reports
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            GDS booking volume, route profitability, enquiry conversion rates, and carrier market shares.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
            {['1M', '3M', '6M', '1Y'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                  timeRange === range ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <button
            onClick={() => onNotify('success', 'Monthly Revenue Report exported to PDF format.')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Gross GDS Turnover</span>
          <span className="text-2xl font-black text-white block num-tabular">₹80,40,000</span>
          <span className="text-xs font-semibold text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            +18.4% vs last period
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Passengers Ticketed</span>
          <span className="text-2xl font-black text-sky-400 block num-tabular">618 Pax</span>
          <span className="text-xs font-semibold text-sky-400 mt-1 flex items-center gap-1">
            <Plane className="w-3.5 h-3.5" />
            94% on-time departures
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Enquiry Conversion Rate</span>
          <span className="text-2xl font-black text-amber-400 block num-tabular">71.8%</span>
          <span className="text-xs font-semibold text-amber-400 mt-1">
            Industry avg: 45%
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Average Sector Yield</span>
          <span className="text-2xl font-black text-purple-400 block num-tabular">₹13,010</span>
          <span className="text-xs font-semibold text-purple-400 mt-1">
            Gulf & ASEAN combined
          </span>
        </div>
      </div>

      {/* Chart 1: Revenue & Enquiries Growth (Area Chart) */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Monthly Booking Volume & Turnovers</h3>
            <p className="text-xs text-slate-400">Total tickets issued vs client enquiries</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              Bookings
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              Enquiries
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorEnq" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
              />
              <Area type="monotone" dataKey="bookings" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorBookings)" />
              <Area type="monotone" dataKey="enquiries" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#colorEnq)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2 & 3: Top Routes Bar Chart & Carrier Share Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Top Routes Bar Chart (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900 border border-slate-800">
          <h3 className="text-sm font-bold text-white mb-1">Top Volume Flight Sectors</h3>
          <p className="text-xs text-slate-400 mb-4">Trichy & Chennai international hubs</p>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={routeDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="route" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
                <Bar dataKey="count" fill="#0284c7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Airline Market Share Pie (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Carrier Ticket Share</h3>
            <p className="text-xs text-slate-400 mb-3">Breakdown by partner airline</p>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={airlineShares}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={68}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {airlineShares.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-3 border-t border-slate-800">
            {airlineShares.map((a) => (
              <div key={a.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: a.color }} />
                <span className="truncate">{a.name} ({a.value}%)</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

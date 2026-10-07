import React from 'react';
import { 
  Plane, 
  Tag, 
  MessageSquare, 
  BookmarkCheck, 
  Clock, 
  RefreshCw, 
  TrendingUp, 
  ArrowUpRight 
} from 'lucide-react';
import { StaffTabId } from './StaffSidebar';

interface StaffStatsCardsProps {
  isDark: boolean;
  onNavigateTab: (tab: StaffTabId) => void;
  stats?: {
    activeFlights?: number;
    activeFares?: number;
    todaysEnquiries?: number;
    todaysBookings?: number;
    pendingQuotations?: number;
    fareUpdates?: number;
  };
}

export const StaffStatsCards: React.FC<StaffStatsCardsProps> = ({
  isDark,
  onNavigateTab,
  stats
}) => {
  const cards = [
    {
      id: 'flights' as StaffTabId,
      label: 'ACTIVE FLIGHTS',
      value: stats?.activeFlights ?? 24,
      trend: '+4 scheduled',
      trendPositive: true,
      icon: Plane,
      color: 'blue',
      description: 'Scheduled sectors today'
    },
    {
      id: 'fares' as StaffTabId,
      label: 'ACTIVE FARES',
      value: (stats?.activeFares ?? 1284).toLocaleString('en-IN'),
      trend: '+12 today',
      trendPositive: true,
      icon: Tag,
      color: 'sky',
      description: 'Wholesale airline rates'
    },
    {
      id: 'enquiries' as StaffTabId,
      label: "TODAY'S ENQUIRIES",
      value: stats?.todaysEnquiries ?? 12,
      trend: '+3 urgent',
      trendPositive: true,
      icon: MessageSquare,
      color: 'amber',
      description: 'Customer quote requests'
    },
    {
      id: 'bookings' as StaffTabId,
      label: "TODAY'S BOOKINGS",
      value: stats?.todaysBookings ?? 8,
      trend: '₹1,94,200 vol',
      trendPositive: true,
      icon: BookmarkCheck,
      color: 'emerald',
      description: 'Confirmed & ticketed'
    },
    {
      id: 'enquiries' as StaffTabId,
      label: 'PENDING QUOTATIONS',
      value: stats?.pendingQuotations ?? 4,
      trend: 'Avg response 18m',
      trendPositive: true,
      icon: Clock,
      color: 'purple',
      description: 'Awaiting desk review'
    },
    {
      id: 'history' as StaffTabId,
      label: 'FARE UPDATES',
      value: stats?.fareUpdates ?? 28,
      trend: 'Audit logged',
      trendPositive: true,
      icon: RefreshCw,
      color: 'rose',
      description: 'Rate revisions this week'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.label}
            onClick={() => onNavigateTab(card.id)}
            className={`group relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
              isDark 
                ? 'bg-slate-900/80 border-slate-800/90 hover:border-blue-500/50 hover:bg-slate-850 hover:shadow-xl hover:shadow-blue-950/40 hover:-translate-y-1' 
                : 'bg-white border-slate-200/90 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1'
            }`}
          >
            {/* Top Subtle Accent Bar */}
            <div className={`absolute top-0 left-0 right-0 h-0.5 transition-opacity opacity-0 group-hover:opacity-100 ${
              card.color === 'blue' ? 'bg-blue-500' :
              card.color === 'sky' ? 'bg-sky-400' :
              card.color === 'amber' ? 'bg-amber-400' :
              card.color === 'emerald' ? 'bg-emerald-400' :
              card.color === 'purple' ? 'bg-purple-400' : 'bg-rose-400'
            }`} />

            {/* Header: Label + Icon */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                {card.label}
              </span>
              <div className={`p-1.5 rounded-lg transition-transform duration-300 group-hover:scale-110 ${
                isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
              }`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Large Value */}
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-2xl font-black tracking-tight text-white dark:text-white num-tabular">
                {card.value}
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Trend Indicator & Mini description */}
            <div className="flex items-center justify-between text-[11px] mt-2 pt-2 border-t border-slate-800/40">
              <span className={`font-semibold flex items-center gap-1 ${
                card.color === 'emerald' ? 'text-emerald-400' :
                card.color === 'amber' ? 'text-amber-400' :
                card.color === 'rose' ? 'text-rose-400' : 'text-sky-400'
              }`}>
                <TrendingUp className="w-3 h-3" />
                <span>{card.trend}</span>
              </span>
              <span className="text-[10px] text-slate-400 hidden sm:inline">
                {card.description}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

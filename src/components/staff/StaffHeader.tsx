import React, { useState } from 'react';
import { 
  Bell, 
  HelpCircle, 
  Sun, 
  Moon, 
  Shield, 
  ShieldCheck, 
  LogOut, 
  ExternalLink, 
  Search, 
  Check, 
  Activity, 
  User, 
  Sparkles,
  Lock,
  Database
} from 'lucide-react';
import { MMSLogo } from '../MMSLogo';
import { StaffUser } from './types';
import { SupabaseStatusModal } from './SupabaseStatusModal';
import { isSupabaseConfigured } from '../../lib/supabase';

interface StaffHeaderProps {
  currentUser: StaffUser;
  isDark: boolean;
  onToggleTheme: () => void;
  onLogout: () => void;
  onReturnHome: () => void;
  onOpenTab: (tabId: string) => void;
  unreadNotificationsCount?: number;
}

export const StaffHeader: React.FC<StaffHeaderProps> = ({
  currentUser,
  isDark,
  onToggleTheme,
  onLogout,
  onReturnHome,
  onOpenTab,
  unreadNotificationsCount = 3
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [dbModalOpen, setDbModalOpen] = useState(false);

  const notifications = [
    { id: 1, text: 'Wholesale fare updated for 6E 1475 (TRZ → DXB)', time: '12m ago', unread: true },
    { id: 2, text: 'New customer enquiry received from Mohamed Riyaz', time: '45m ago', unread: true },
    { id: 3, text: 'Booking confirmed for PNR MMS-66520 (MAA → DOH)', time: '2h ago', unread: true },
    { id: 4, text: 'IndiGo seasonal airline promo rate published', time: '4h ago', unread: false }
  ];

  return (
    <header className={`sticky top-0 z-30 px-4 sm:px-6 py-2.5 transition-colors duration-200 border-b backdrop-blur-md ${
      isDark 
        ? 'bg-slate-900/90 border-slate-800 text-slate-100' 
        : 'bg-white/90 border-slate-200 text-slate-900 shadow-2xs'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Brand + Desk Identity */}
        <div className="flex items-center gap-3">
          <MMSLogo size="sm" variant="emblem" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold tracking-tight">
                MMS Travels
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                isDark 
                  ? 'bg-blue-950/80 text-sky-400 border border-blue-800/60' 
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                Staff Operations
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Operations Desk • Live GDS Feed</span>
            </div>
          </div>
        </div>

        {/* Center: Global Search Bar (Hidden on small mobile) */}
        <div className="hidden md:flex items-center flex-1 max-w-xs mx-4">
          <div className={`relative w-full rounded-xl border transition-all ${
            isDark 
              ? 'bg-slate-950/60 border-slate-800 text-slate-200 focus-within:border-blue-500' 
              : 'bg-slate-50 border-slate-200 text-slate-800 focus-within:border-blue-500'
          }`}>
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Quick search fares, PNR, flight... (/)"
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-transparent focus:outline-none placeholder:text-slate-400"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onOpenTab('fares');
                }
              }}
            />
          </div>
        </div>

        {/* Right Actions: Theme, Notifications, Help, Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5">

          {/* Supabase DB Status Badge */}
          <button
            onClick={() => setDbModalOpen(true)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
              isSupabaseConfigured()
                ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300 hover:bg-emerald-900/60'
                : 'bg-amber-950/60 border-amber-800 text-amber-300 hover:bg-amber-900/60'
            }`}
            title="Supabase PostgreSQL Database Status & Vercel Publishing Settings"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">
              {isSupabaseConfigured() ? 'Supabase: Active' : 'Supabase: Connect'}
            </span>
          </button>

          {/* Theme Toggle (Dark Mode / Light Mode) */}
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-xl transition-all border cursor-pointer ${
              isDark 
                ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-amber-300' 
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
            }`}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setProfileDropdownOpen(false);
              }}
              className={`relative p-2 rounded-xl transition-all border cursor-pointer ${
                isDark 
                  ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300' 
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
              }`}
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Notification Drawer Popover */}
            {notificationsOpen && (
              <div className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl shadow-2xl border p-4 z-50 animate-fadeIn ${
                isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
              }`}>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/20 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Notifications</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-500 text-white">3 New</span>
                  </div>
                  <button 
                    onClick={() => setNotificationsOpen(false)}
                    className="text-xs text-slate-400 hover:text-slate-200"
                  >
                    Close
                  </button>
                </div>

                <div className="space-y-2.5 max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div 
                      key={n.id}
                      className={`p-2.5 rounded-xl text-xs flex items-start justify-between gap-2 transition-colors ${
                        n.unread 
                          ? (isDark ? 'bg-slate-800/80 border border-slate-700/60' : 'bg-blue-50/70 border border-blue-100')
                          : (isDark ? 'bg-slate-950/40 text-slate-400' : 'bg-slate-50 text-slate-500')
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ${n.unread ? 'bg-blue-500' : 'bg-slate-400'}`} />
                        <div>
                          <p className="font-medium leading-snug">{n.text}</p>
                          <span className="text-[10px] text-slate-400 mt-0.5 block">{n.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 mt-3 border-t border-slate-800/20 text-center">
                  <button 
                    onClick={() => {
                      onOpenTab('history');
                      setNotificationsOpen(false);
                    }}
                    className="text-xs text-blue-500 hover:text-blue-400 font-semibold"
                  >
                    View All Audit & Activity Events →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Operations Help Button */}
          <button
            onClick={() => setHelpModalOpen(true)}
            className={`p-2 rounded-xl transition-all border cursor-pointer ${
              isDark 
                ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300' 
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
            }`}
            title="Desk Guide & Operations Help"
            aria-label="Help"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Staff User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setProfileDropdownOpen(!profileDropdownOpen);
                setNotificationsOpen(false);
              }}
              className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                isDark 
                  ? 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-100' 
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-900'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                {currentUser.fullName.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold leading-tight line-clamp-1 max-w-[120px]">
                  {currentUser.fullName}
                </p>
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">
                  {currentUser.role}
                </span>
              </div>
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div className={`absolute right-0 mt-2 w-64 rounded-2xl shadow-2xl border p-2 z-50 animate-fadeIn ${
                isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
              }`}>
                <div className="px-3 py-2 border-b border-slate-800/20 mb-1.5">
                  <p className="text-xs font-bold text-white leading-tight">{currentUser.fullName}</p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">{currentUser.email}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                      currentUser.role === 'OWNER'
                        ? 'bg-purple-950 text-purple-300 border border-purple-800'
                        : currentUser.role === 'MANAGER'
                        ? 'bg-blue-950 text-blue-300 border border-blue-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {currentUser.role}
                    </span>
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Active Session
                    </span>
                  </div>
                </div>

                <div className="space-y-0.5 text-xs">
                  <button
                    onClick={() => {
                      onOpenTab('security');
                      setProfileDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors ${
                      isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                      <span>Security & 2FA Status</span>
                    </span>
                    <span className="text-[10px] text-slate-400">PBKDF2</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenTab('logs');
                      setProfileDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors ${
                      isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 text-sky-400" />
                      <span>Access & Activity Log</span>
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      onReturnHome();
                      setProfileDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors ${
                      isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                    }`}
                  >
                    <span className="flex items-center gap-2 text-slate-300">
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Public Website</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">/</span>
                  </button>
                </div>

                <div className="pt-2 mt-1.5 border-t border-slate-800/20">
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-950/40 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out Console</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Help Modal */}
      {helpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`w-full max-w-md p-6 rounded-3xl shadow-2xl border ${
            isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/40 mb-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-500" />
                <h3 className="font-bold text-base">MMS Staff Operations Guide</h3>
              </div>
              <button 
                onClick={() => setHelpModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <p className="font-semibold text-white">Wholesale Rate Revisions</p>
                <p className="text-slate-400 mt-1">Any fare modifications require a mandatory audit reason and immediately reflect across customer portals and GDS feeds.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <p className="font-semibold text-white">Private Desk Access</p>
                <p className="text-slate-400 mt-1">Access the portal anytime via URL <code className="text-sky-300">/staff/</code> or shortcut <code className="text-amber-300">Alt + S</code>.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <p className="font-semibold text-white">Need Agency Support?</p>
                <p className="text-slate-400 mt-1">General: 6369012360 • Tickets: 9384567440 • Visas/Tours: 9500977442 (Offices: Adirampattinam & Madukkur Only).</p>
              </div>
            </div>
            <button
              onClick={() => setHelpModalOpen(false)}
              className="w-full mt-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {/* Supabase & Vercel Database Connection Modal */}
      <SupabaseStatusModal
        isOpen={dbModalOpen}
        onClose={() => setDbModalOpen(false)}
        isDark={isDark}
      />
    </header>
  );
};

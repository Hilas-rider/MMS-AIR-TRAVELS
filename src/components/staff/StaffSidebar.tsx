import React from 'react';
import { 
  LayoutDashboard, 
  Plane, 
  Building2, 
  Tag, 
  Users, 
  MessageSquare, 
  BookmarkCheck, 
  Sparkles, 
  BarChart3, 
  History, 
  ShieldAlert, 
  UserCog, 
  ChevronLeft, 
  ChevronRight,
  X
} from 'lucide-react';
import { StaffUser } from './types';

export type StaffTabId = 
  | 'dashboard' 
  | 'flights' 
  | 'airlines' 
  | 'fares' 
  | 'customers' 
  | 'enquiries' 
  | 'bookings' 
  | 'offers' 
  | 'reports' 
  | 'history' 
  | 'logs' 
  | 'users' 
  | 'security';

interface StaffSidebarProps {
  activeTab: StaffTabId;
  onSelectTab: (tab: StaffTabId) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  isDark: boolean;
  currentUser: StaffUser;
  badges?: {
    fares?: number;
    enquiries?: number;
    bookings?: number;
  };
}

export const StaffSidebar: React.FC<StaffSidebarProps> = ({
  activeTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  isDark,
  currentUser,
  badges
}) => {
  const isOwner = currentUser.role === 'OWNER';
  const isManager = currentUser.role === 'MANAGER' || isOwner;

  const navItems: { id: StaffTabId; label: string; icon: React.FC<{ className?: string }>; badge?: number; restricted?: boolean; allowedRoles?: string[] }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'flights', label: 'Flights', icon: Plane },
    { id: 'airlines', label: 'Airlines', icon: Building2 },
    { id: 'fares', label: 'Fares', icon: Tag, badge: badges?.fares },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'enquiries', label: 'Enquiries', icon: MessageSquare, badge: badges?.enquiries },
    { id: 'bookings', label: 'Bookings', icon: BookmarkCheck, badge: badges?.bookings },
    { id: 'offers', label: 'Offers', icon: Sparkles },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'history', label: 'Fare History', icon: History },
    { id: 'logs', label: 'Activity Logs', icon: ShieldAlert, restricted: !isManager, allowedRoles: ['OWNER', 'MANAGER'] },
    { id: 'users', label: 'Staff Management', icon: UserCog, restricted: !isManager, allowedRoles: ['OWNER', 'MANAGER'] }
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full select-none">
      
      {/* Mobile Top Close Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800/20 md:hidden">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Navigation Menu</span>
        <button
          onClick={onCloseMobile}
          className="p-1 rounded-lg hover:bg-slate-800/20 text-slate-400"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          if (item.restricted && !isManager) return null;

          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                onCloseMobile();
              }}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all relative group cursor-pointer ${
                isActive
                  ? isDark
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-blue-600 text-white shadow-md shadow-blue-600/15'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                isActive ? 'text-white' : isDark ? 'text-slate-400' : 'text-slate-500'
              }`} />

              {/* Label (Hidden if collapsed on desktop) */}
              {!isCollapsed && (
                <span className="truncate flex-1 text-left tracking-tight">
                  {item.label}
                </span>
              )}

              {/* Badge Counter */}
              {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isActive 
                    ? 'bg-white text-blue-700' 
                    : isDark 
                    ? 'bg-slate-800 text-sky-400 border border-slate-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {item.badge}
                </span>
              )}

              {/* Collapsed Tooltip for desktop */}
              {isCollapsed && (
                <div className="fixed left-16 ml-2 px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-xl border border-slate-700">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Collapse Toggle Footer (Desktop only) */}
      <div className="hidden md:flex items-center justify-between p-3 border-t border-slate-800/20">
        <button
          onClick={onToggleCollapse}
          className={`w-full flex items-center justify-center gap-2 p-2 rounded-xl text-xs transition-colors cursor-pointer ${
            isDark 
              ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200' 
              : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
          }`}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span className="text-[11px] font-medium text-slate-400">Collapse Panel</span>
            </>
          )}
        </button>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden md:block shrink-0 transition-all duration-300 border-r ${
          isCollapsed ? 'w-16' : 'w-60'
        } ${
          isDark 
            ? 'bg-slate-950/70 border-slate-800/80' 
            : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Slide-out Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
          />
          {/* Drawer container */}
          <div className={`relative w-72 max-w-[80vw] h-full shadow-2xl z-50 transition-transform ${
            isDark ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900'
          }`}>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

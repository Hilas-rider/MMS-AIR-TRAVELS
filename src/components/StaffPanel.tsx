import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Plane,
  Tag,
  Users,
  MessageSquare,
  BookmarkCheck,
  BarChart3,
  History,
  ShieldAlert,
  UserCog
} from 'lucide-react';
import { StaffHeader } from './staff/StaffHeader';
import { StaffSidebar, StaffTabId } from './staff/StaffSidebar';
import { StaffDashboardTab } from './staff/StaffDashboardTab';
import { StaffFaresTab } from './staff/StaffFaresTab';
import { StaffFlightsTab } from './staff/StaffFlightsTab';
import { StaffAirlinesTab } from './staff/StaffAirlinesTab';
import { StaffCustomersTab } from './staff/StaffCustomersTab';
import { StaffEnquiriesTab } from './staff/StaffEnquiriesTab';
import { StaffBookingsTab } from './staff/StaffBookingsTab';
import { StaffOffersTab } from './staff/StaffOffersTab';
import { StaffReportsTab } from './staff/StaffReportsTab';
import { StaffHistoryTab } from './staff/StaffHistoryTab';
import { StaffLogsTab } from './staff/StaffLogsTab';
import { StaffUsersTab } from './staff/StaffUsersTab';
import { 
  StaffUser, 
  FareRecord, 
  FareHistoryEntry, 
  AirlineRecord, 
  ActivityLogEntry,
  CustomerRecord,
  EnquiryRecord,
  BookingRecord,
  OfferRecord,
  SecuritySettings
} from './staff/types';

interface StaffPanelProps {
  currentUser: StaffUser;
  token: string;
  onLogout: () => void;
  onReturnHome: () => void;
}

export const StaffPanel: React.FC<StaffPanelProps> = ({
  currentUser,
  token,
  onLogout,
  onReturnHome
}) => {
  // Theme state: dark mode default with luxury navy
  const [isDark, setIsDark] = useState<boolean>(true);

  // Navigation and Layout state
  const [activeTab, setActiveTab] = useState<StaffTabId>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Global Toast Feedback
  const [toast, setToast] = useState<{ id: number; type: 'success' | 'error'; message: string } | null>(null);

  // Add Fare Modal Trigger
  const [showAddFareModal, setShowAddFareModal] = useState<boolean>(false);

  // Data Stores
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [fares, setFares] = useState<FareRecord[]>([]);
  const [fareHistory, setFareHistory] = useState<FareHistoryEntry[]>([]);
  const [airlines, setAirlines] = useState<AirlineRecord[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLogEntry[]>([]);
  const [staffUsersList, setStaffUsersList] = useState<StaffUser[]>([]);
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([]);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [offers, setOffers] = useState<OfferRecord[]>([]);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    require2FAAllStaff: false,
    maxLoginAttempts: 5,
    lockoutDurationMinutes: 15,
    sessionTimeoutHours: 8
  });

  const [loading, setLoading] = useState<boolean>(false);

  const isOwner = currentUser.role === 'OWNER';
  const isManager = currentUser.role === 'MANAGER' || isOwner;

  // Notification helper
  const notify = (type: 'success' | 'error', message: string) => {
    const id = Date.now();
    setToast({ id, type, message });
    setTimeout(() => {
      setToast((curr) => (curr?.id === id ? null : curr));
    }, 4500);
  };

  // Fetch all staff modules data
  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' 
      };

      const [
        dashRes, 
        faresRes, 
        histRes, 
        airRes, 
        custRes, 
        enqRes, 
        bkgRes, 
        offRes
      ] = await Promise.all([
        fetch('/api/staff/dashboard', { headers }),
        fetch('/api/staff/fares', { headers }),
        fetch('/api/staff/fares/history', { headers }),
        fetch('/api/staff/airlines', { headers }),
        fetch('/api/staff/customers', { headers }),
        fetch('/api/staff/enquiries', { headers }),
        fetch('/api/staff/bookings', { headers }),
        fetch('/api/staff/offers', { headers })
      ]);

      if (dashRes.ok) setDashboardData(await dashRes.json());
      if (faresRes.ok) setFares(await faresRes.json());
      if (histRes.ok) setFareHistory(await histRes.json());
      if (airRes.ok) setAirlines(await airRes.json());
      if (custRes.ok) setCustomers(await custRes.json());
      if (enqRes.ok) setEnquiries(await enqRes.json());
      if (bkgRes.ok) setBookings(await bkgRes.json());
      if (offRes.ok) setOffers(await offRes.json());

      if (isManager) {
        const logsRes = await fetch('/api/staff/logs', { headers });
        if (logsRes.ok) setActivityLogs(await logsRes.json());
      }

      if (isOwner) {
        const [usersRes, secRes] = await Promise.all([
          fetch('/api/staff/users', { headers }),
          fetch('/api/staff/security/settings', { headers })
        ]);
        if (usersRes.ok) setStaffUsersList(await usersRes.json());
        if (secRes.ok) setSecuritySettings(await secRes.json());
      }
    } catch (err) {
      console.error('Failed to load operations data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // Operations handlers
  const handleUpdateFare = async (updatedFare: FareRecord, reason: string) => {
    const res = await fetch(`/api/staff/fares/${updatedFare.id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...updatedFare,
        reason
      })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to update fare.');
    }
    await fetchData();
  };

  const handleCreateFare = async (fareData: any) => {
    const res = await fetch('/api/staff/fares', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(fareData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to publish fare.');
    }
    await fetchData();
  };

  const handleCreateAirline = async (airlineData: any) => {
    const res = await fetch('/api/staff/airlines', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(airlineData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to add airline.');
    }
    await fetchData();
  };

  const handleCreateCustomer = async (custData: any) => {
    const res = await fetch('/api/staff/customers', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(custData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to add customer.');
    }
    await fetchData();
  };

  const handleCreateEnquiry = async (enqData: any) => {
    const res = await fetch('/api/staff/enquiries', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(enqData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to log enquiry.');
    }
    await fetchData();
  };

  const handleUpdateEnquiryStatus = async (id: string, status: string, notes?: string) => {
    const res = await fetch(`/api/staff/enquiries/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to update enquiry.');
    }
    await fetchData();
  };

  const handleCreateBooking = async (bkgData: any) => {
    const res = await fetch('/api/staff/bookings', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(bkgData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to create booking.');
    }
    await fetchData();
  };

  const handleUpdateBooking = async (id: string, updatedData: any) => {
    const res = await fetch(`/api/staff/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to update booking.');
    }
    await fetchData();
  };

  const handleDeleteBooking = async (id: string) => {
    const res = await fetch(`/api/staff/bookings/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to delete booking.');
    }
    await fetchData();
  };

  const handleCreateOffer = async (offerData: any) => {
    const res = await fetch('/api/staff/offers', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(offerData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to publish offer.');
    }
    await fetchData();
  };

  const handleCreateStaff = async (userData: any) => {
    const res = await fetch('/api/staff/users', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to create staff account.');
    }
    await fetchData();
  };

  const handleUpdateSecurity = async (configData: Partial<SecuritySettings>) => {
    const res = await fetch('/api/staff/security/settings', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(configData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to update security settings.');
    }
    setSecuritySettings(prev => ({ ...prev, ...configData }));
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Toast Notification Alert Banner */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-bounce-in max-w-md">
          <div className={`p-4 rounded-2xl shadow-2xl border flex items-center gap-3 ${
            toast.type === 'success'
              ? 'bg-emerald-950/95 border-emerald-700 text-emerald-100'
              : 'bg-rose-950/95 border-rose-700 text-rose-100'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <p className="text-xs font-semibold leading-relaxed flex-1">
              {toast.message}
            </p>
            <button
              onClick={() => setToast(null)}
              className="p-1 rounded-lg hover:bg-black/20 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Primary Header */}
      <StaffHeader
        currentUser={currentUser}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onLogout={onLogout}
        onReturnHome={onReturnHome}
        onOpenTab={(tabId) => setActiveTab(tabId as StaffTabId)}
      />

      {/* Main Operations Workarea: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Responsive Collapsible Sidebar */}
        <StaffSidebar
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
          isDark={isDark}
          currentUser={currentUser}
          badges={{
            fares: fares.length,
            enquiries: enquiries.filter(e => e.status === 'New').length,
            bookings: bookings.length
          }}
        />

        {/* Scrollable Tab Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          
          {/* Mobile Menu Toggle Floating Bar */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/40 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className={`p-2 rounded-xl border flex items-center gap-2 text-xs font-bold ${
                isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800 shadow-xs'
              }`}
            >
              <Menu className="w-4 h-4 text-blue-500" />
              <span>Operations Menu</span>
            </button>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {activeTab}
            </span>
          </div>

          <div className="max-w-7xl mx-auto">
            
            {activeTab === 'dashboard' && (
              <StaffDashboardTab
                currentUser={currentUser}
                isDark={isDark}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onOpenAddFare={() => setShowAddFareModal(true)}
                recentFares={fares}
                recentBookings={bookings}
                recentEnquiries={enquiries}
                stats={{
                  activeFlights: fares.length > 0 ? fares.length : 24,
                  activeFares: fares.length > 0 ? fares.length : 1284,
                  todaysEnquiries: enquiries.length,
                  todaysBookings: bookings.length,
                  pendingQuotations: enquiries.filter(e => e.status === 'New').length,
                  fareUpdates: fareHistory.length
                }}
              />
            )}

            {activeTab === 'fares' && (
              <StaffFaresTab
                fares={fares}
                airlines={airlines}
                isDark={isDark}
                onUpdateFare={handleUpdateFare}
                onCreateFare={handleCreateFare}
                showAddModal={showAddFareModal}
                setShowAddModal={setShowAddFareModal}
                onNotify={notify}
              />
            )}

            {activeTab === 'flights' && (
              <StaffFlightsTab
                fares={fares}
                isDark={isDark}
                onOpenAddFare={() => setShowAddFareModal(true)}
              />
            )}

            {activeTab === 'airlines' && (
              <StaffAirlinesTab
                airlines={airlines}
                isDark={isDark}
                onCreateAirline={handleCreateAirline}
                onNotify={notify}
              />
            )}

            {activeTab === 'customers' && (
              <StaffCustomersTab
                customers={customers}
                isDark={isDark}
                onCreateCustomer={handleCreateCustomer}
                onNotify={notify}
              />
            )}

            {activeTab === 'enquiries' && (
              <StaffEnquiriesTab
                enquiries={enquiries}
                isDark={isDark}
                onUpdateStatus={handleUpdateEnquiryStatus}
                onCreateEnquiry={handleCreateEnquiry}
                onNotify={notify}
              />
            )}

            {activeTab === 'bookings' && (
              <StaffBookingsTab
                bookings={bookings}
                isDark={isDark}
                onUpdateBooking={handleUpdateBooking}
                onDeleteBooking={handleDeleteBooking}
                onCreateBooking={handleCreateBooking}
                onNotify={notify}
              />
            )}

            {activeTab === 'offers' && (
              <StaffOffersTab
                offers={offers}
                isDark={isDark}
                onCreateOffer={handleCreateOffer}
                onNotify={notify}
              />
            )}

            {activeTab === 'reports' && (
              <StaffReportsTab
                isDark={isDark}
                onNotify={notify}
              />
            )}

            {activeTab === 'history' && (
              <StaffHistoryTab
                history={fareHistory}
                isDark={isDark}
              />
            )}

            {activeTab === 'logs' && isManager && (
              <StaffLogsTab
                logs={activityLogs}
                isDark={isDark}
              />
            )}

            {activeTab === 'users' && isManager && (
              <StaffUsersTab
                users={staffUsersList}
                currentUser={currentUser}
                securityConfig={securitySettings}
                isDark={isDark}
                onCreateStaff={handleCreateStaff}
                onUpdateSecurity={handleUpdateSecurity}
                onNotify={notify}
              />
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
                  <h3 className="text-base font-bold text-white mb-2">Staff Security Overview</h3>
                  <p className="text-xs text-slate-400 mb-4">
                    Account authentication is protected by cryptographic PBKDF2 with salt and SHA-512.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block">Logged In As</span>
                      <span className="font-bold text-white text-sm mt-0.5 block">{currentUser.fullName}</span>
                      <span className="text-[10px] text-sky-400">{currentUser.email}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block">Assigned Role</span>
                      <span className="font-bold text-emerald-400 text-sm mt-0.5 block">{currentUser.role}</span>
                      <span className="text-[10px] text-slate-500">Access verified</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block">Console Shortcut</span>
                      <span className="font-mono text-amber-300 text-sm mt-0.5 block">Alt + S</span>
                      <span className="text-[10px] text-slate-500">Direct instant portal</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>

      </div>

    </div>
  );
};

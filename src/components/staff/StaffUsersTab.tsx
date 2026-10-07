import React, { useState } from 'react';
import { UserCog, Plus, ShieldCheck, Lock, Check, AlertCircle, KeyRound, Clock } from 'lucide-react';
import { StaffUser, SecuritySettings } from './types';

interface StaffUsersTabProps {
  users: StaffUser[];
  currentUser: StaffUser;
  securityConfig: SecuritySettings;
  isDark: boolean;
  onCreateStaff: (userData: any) => Promise<void>;
  onUpdateSecurity: (config: Partial<SecuritySettings>) => Promise<void>;
  onNotify: (type: 'success' | 'error', message: string) => void;
}

export const StaffUsersTab: React.FC<StaffUsersTabProps> = ({
  users,
  currentUser,
  securityConfig,
  isDark,
  onCreateStaff,
  onUpdateSecurity,
  onNotify
}) => {
  const isOwner = currentUser.role === 'OWNER';
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStaffForm, setNewStaffForm] = useState({
    username: '',
    email: '',
    fullName: '',
    role: 'STAFF' as 'OWNER' | 'MANAGER' | 'STAFF',
    password: ''
  });

  const [localSecurity, setLocalSecurity] = useState(securityConfig);
  const [savingSec, setSavingSec] = useState(false);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffForm.email || !newStaffForm.fullName || !newStaffForm.password) {
      onNotify('error', 'Please fill all required fields.');
      return;
    }
    try {
      await onCreateStaff(newStaffForm);
      setShowAddModal(false);
      setNewStaffForm({ username: '', email: '', fullName: '', role: 'STAFF', password: '' });
      onNotify('success', `Staff user account created for ${newStaffForm.fullName}`);
    } catch (err: any) {
      onNotify('error', err.message || 'Failed to create staff account.');
    }
  };

  const handleSaveSecurity = async () => {
    setSavingSec(true);
    try {
      await onUpdateSecurity(localSecurity);
      onNotify('success', 'Global authentication and lockout rules updated.');
    } catch (err: any) {
      onNotify('error', err.message || 'Failed to update security settings.');
    } finally {
      setSavingSec(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <UserCog className="w-5 h-5 text-sky-400" />
            Staff Authorization & Access Control
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage authenticated team accounts, role-based privileges, and company-wide security rules.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Staff Account
        </button>
      </div>

      {/* Staff User Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((u) => (
          <div
            key={u.id}
            className={`p-6 rounded-3xl border transition-all ${
              isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                {u.fullName.charAt(0)}
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                u.role === 'OWNER'
                  ? 'bg-purple-950 text-purple-300 border border-purple-800'
                  : u.role === 'MANAGER'
                  ? 'bg-blue-950 text-sky-300 border border-blue-800'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}>
                {u.role}
              </span>
            </div>

            <h3 className="font-bold text-sm text-white">{u.fullName}</h3>
            <p className="text-xs font-mono text-slate-400 mt-0.5">{u.email}</p>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                Active Account
              </span>
              <span>PBKDF2 Secured</span>
            </div>
          </div>
        ))}
      </div>

      {/* Global Security Settings (OWNER ONLY) */}
      {isOwner && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-purple-400" />
                System Security & Lockout Policy (Owner Only)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Enforce enterprise authentication hardening</p>
            </div>
            <button
              disabled={savingSec}
              onClick={handleSaveSecurity}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer"
            >
              {savingSec ? 'Saving...' : 'Save Security Rules'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <label className="font-bold text-slate-300 block mb-1">Max Consecutive Failed Logins</label>
              <input
                type="number"
                min={3}
                max={10}
                value={localSecurity.maxLoginAttempts}
                onChange={(e) => setLocalSecurity({ ...localSecurity, maxLoginAttempts: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono mt-1"
              />
              <span className="text-[10px] text-slate-500 block mt-1">Triggers automatic IP & account lockout.</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <label className="font-bold text-slate-300 block mb-1">Lockout Duration (Minutes)</label>
              <input
                type="number"
                min={5}
                max={120}
                value={localSecurity.lockoutDurationMinutes}
                onChange={(e) => setLocalSecurity({ ...localSecurity, lockoutDurationMinutes: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono mt-1"
              />
              <span className="text-[10px] text-slate-500 block mt-1">Temporary hold after failed attempts.</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <label className="font-bold text-slate-300 block mb-1">Session Inactivity Timeout (Hours)</label>
              <input
                type="number"
                min={1}
                max={24}
                value={localSecurity.sessionTimeoutHours}
                onChange={(e) => setLocalSecurity({ ...localSecurity, sessionTimeoutHours: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono mt-1"
              />
              <span className="text-[10px] text-slate-500 block mt-1">Automatic logout threshold.</span>
            </div>
          </div>
        </div>
      )}

      {/* Add Staff Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-700 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-base">Create Staff Account</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fathima Begum"
                  value={newStaffForm.fullName}
                  onChange={(e) => setNewStaffForm({ ...newStaffForm, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. staff@mmstravels.com"
                  value={newStaffForm.email}
                  onChange={(e) => setNewStaffForm({ ...newStaffForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Role Permission</label>
                <select
                  value={newStaffForm.role}
                  onChange={(e: any) => setNewStaffForm({ ...newStaffForm, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  <option value="STAFF">Staff (Daily Bookings & Fares)</option>
                  <option value="MANAGER">Manager (Full Fares & Activity Logs)</option>
                  {isOwner && <option value="OWNER">Owner (Full Privileges & Security)</option>}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Temporary Initial Password</label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 8 characters"
                  value={newStaffForm.password}
                  onChange={(e) => setNewStaffForm({ ...newStaffForm, password: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
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
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

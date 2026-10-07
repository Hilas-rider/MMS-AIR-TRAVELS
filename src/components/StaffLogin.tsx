import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  KeyRound, 
  AlertCircle, 
  ArrowRight, 
  CheckCircle2, 
  Eye, 
  EyeOff,
  Globe,
  Plane,
  Clock,
  Sparkles
} from 'lucide-react';
import { MMSLogo } from './MMSLogo';

interface StaffLoginProps {
  onLoginSuccess: (user: any, token: string) => void;
  onReturnHome: () => void;
}

export const StaffLogin: React.FC<StaffLoginProps> = ({
  onLoginSuccess,
  onReturnHome
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 2FA state
  const [require2FA, setRequire2FA] = useState(false);
  const [tempToken, setTempToken] = useState<string | null>(null);
  const [twoFactorCode, setTwoFactorCode] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const checkStaticFallback = () => {
      const idLower = identifier.trim().toLowerCase();
      if ((idLower === 'owner' || idLower === 'owner@mmstravels.com') && password === 'Owner@MMS2026!') {
        const fallbackUser = { id: 'usr_owner_1', username: 'owner', fullName: 'MMS Agency Director', role: 'OWNER', email: 'owner@mmstravels.com' };
        localStorage.setItem('mms_staff_auth', JSON.stringify({ token: 'demo-token-owner', user: fallbackUser }));
        onLoginSuccess(fallbackUser, 'demo-token-owner');
        return true;
      }
      if ((idLower === 'manager' || idLower === 'manager@mmstravels.com') && password === 'Manager@MMS2026!') {
        const fallbackUser = { id: 'usr_mgr_1', username: 'manager', fullName: 'Ticketing & Operations Manager', role: 'MANAGER', email: 'manager@mmstravels.com' };
        localStorage.setItem('mms_staff_auth', JSON.stringify({ token: 'demo-token-manager', user: fallbackUser }));
        onLoginSuccess(fallbackUser, 'demo-token-manager');
        return true;
      }
      if ((idLower === 'staff' || idLower === 'staff@mmstravels.com') && password === 'Staff@MMS2026!') {
        const fallbackUser = { id: 'usr_stf_1', username: 'staff', fullName: 'Adirampattinam HQ Desk Officer', role: 'STAFF', email: 'staff@mmstravels.com' };
        localStorage.setItem('mms_staff_auth', JSON.stringify({ token: 'demo-token-staff', user: fallbackUser }));
        onLoginSuccess(fallbackUser, 'demo-token-staff');
        return true;
      }
      if ((idLower === 'madukkur' || idLower === 'madukkur@mmstravels.com') && password === 'Staff@MMS2026!') {
        const fallbackUser = { id: 'usr_stf_2', username: 'madukkur', fullName: 'Madukkur Branch Officer', role: 'STAFF', email: 'madukkur@mmstravels.com' };
        localStorage.setItem('mms_staff_auth', JSON.stringify({ token: 'demo-token-madukkur', user: fallbackUser }));
        onLoginSuccess(fallbackUser, 'demo-token-madukkur');
        return true;
      }
      return false;
    };

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.require2FA) {
          setRequire2FA(true);
          setTempToken(data.tempToken);
          setLoading(false);
          return;
        }
        localStorage.setItem('mms_staff_auth', JSON.stringify({ token: data.token, user: data.user }));
        onLoginSuccess(data.user, data.token);
        return;
      }

      if (!res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        throw new Error(data.message || data.error || 'Authentication failed');
      }

      // If static host or 404 (e.g. Vercel SPA)
      if (checkStaticFallback()) {
        return;
      }

      throw new Error('Invalid credentials or authentication endpoint unavailable.');
    } catch (err: any) {
      if (checkStaticFallback()) {
        return;
      }
      setError(err.message || 'Login request failed. Check credentials or connection.');
    } finally {
      setLoading(false);
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/2fa-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tempToken, code: twoFactorCode })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Two-factor verification failed');
      }

      localStorage.setItem('mms_staff_auth', JSON.stringify({ token: data.token, user: data.user }));
      onLoginSuccess(data.user, data.token);
    } catch (err: any) {
      setError(err.message || 'Invalid two-factor code.');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickDemo = (userType: 'owner' | 'manager' | 'staff' | 'madukkur') => {
    if (userType === 'owner') {
      setIdentifier('owner@mmstravels.com');
      setPassword('Owner@MMS2026!');
    } else if (userType === 'manager') {
      setIdentifier('manager@mmstravels.com');
      setPassword('Manager@MMS2026!');
    } else if (userType === 'madukkur') {
      setIdentifier('madukkur@mmstravels.com');
      setPassword('Staff@MMS2026!');
    } else {
      setIdentifier('staff@mmstravels.com');
      setPassword('Staff@MMS2026!');
    }
    setError(null);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40">
      
      <div className="w-full max-w-md bg-slate-950 border-2 border-blue-600/50 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-md">
        
        {/* Top Security Banner */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-950 to-indigo-950 p-6 text-center border-b border-white/10 relative">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-800 border border-blue-400/50 flex items-center justify-center text-amber-400 mx-auto shadow-xl mb-3">
            <Lock className="w-7 h-7" />
          </div>

          <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-950/80 px-3 py-0.5 rounded-full border border-amber-500/30 inline-block mb-1">
            Single Domain Protected Gateway
          </span>
          <h2 className="text-xl font-black text-white tracking-wide">
            MMS Travels Staff Portal
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            https://www.mmstravels.com/staff/login/
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-5">
          
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500 text-red-200 text-xs flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {!require2FA ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              {/* Username or Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  Staff Username or Email
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. owner@mmstravels.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>

              {/* Password with Reveal */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    Security Password
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter staff password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm tracking-wide shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 active:scale-98"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verifying Authentication...
                  </span>
                ) : (
                  <>
                    <span>Authenticate & Access Staff Area</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* 2FA Challenge Form */
            <form onSubmit={handle2FASubmit} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/50 text-amber-200 text-xs">
                <p className="font-bold flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  Two-Factor Authentication Required
                </p>
                <p className="text-[11px] text-amber-300/90 leading-relaxed">
                  Enter your 6-digit verification code. (For sandbox testing, use default demo code: <strong className="text-white">123456</strong> or <strong className="text-white">7442</strong>)
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  placeholder="123456"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  className="w-full text-center tracking-widest text-xl font-mono py-2.5 rounded-xl bg-slate-900 border border-amber-500/60 text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm tracking-wide shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                {loading ? 'Verifying 2FA...' : 'Confirm 2FA & Enter Portal'}
              </button>

              <button
                type="button"
                onClick={() => setRequire2FA(false)}
                className="w-full text-xs text-slate-400 hover:text-white text-center underline cursor-pointer"
              >
                Back to Password Login
              </button>
            </form>
          )}

          {/* Authorized Personnel Quick Access (Discreet & Professional) */}
          <div className="pt-3 border-t border-slate-800/80">
            <details className="group">
              <summary className="text-[11px] font-semibold text-slate-400 hover:text-slate-300 flex items-center justify-between cursor-pointer select-none py-1">
                <span>Authorized Roles (Quick Fill)</span>
                <span className="text-[10px] text-sky-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="grid grid-cols-2 gap-1.5 mt-2 pt-1">
                <button
                  type="button"
                  onClick={() => fillQuickDemo('owner')}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[11px] text-slate-200 font-bold text-left cursor-pointer transition-all"
                >
                  <span className="block font-black text-purple-300">Owner</span>
                  <span className="text-[9px] text-slate-500 block">Full Privileges & Config</span>
                </button>

                <button
                  type="button"
                  onClick={() => fillQuickDemo('manager')}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[11px] text-slate-200 font-bold text-left cursor-pointer transition-all"
                >
                  <span className="block font-black text-sky-300">Manager</span>
                  <span className="text-[9px] text-slate-500 block">Fares, Staff & Reports</span>
                </button>

                <button
                  type="button"
                  onClick={() => fillQuickDemo('staff')}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[11px] text-slate-200 font-bold text-left cursor-pointer transition-all"
                >
                  <span className="block font-black text-emerald-300">Adiram HQ Staff</span>
                  <span className="text-[9px] text-slate-500 block">HQ Inquiries & Bookings</span>
                </button>

                <button
                  type="button"
                  onClick={() => fillQuickDemo('madukkur')}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[11px] text-slate-200 font-bold text-left cursor-pointer transition-all"
                >
                  <span className="block font-black text-amber-300">Madukkur Staff</span>
                  <span className="text-[9px] text-slate-500 block">Branch Inquiries Desk</span>
                </button>
              </div>
            </details>
          </div>

          {/* Return to Customer Portal */}
          <div className="pt-2 text-center">
            <button
              onClick={onReturnHome}
              className="text-xs text-slate-500 hover:text-slate-300 flex items-center justify-center gap-1 mx-auto cursor-pointer transition-colors"
            >
              <span>← Return to Public Website</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

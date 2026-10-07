import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, Settings, Check, X, Info } from 'lucide-react';

export interface CookiePreferences {
  essential: boolean; // Always true
  analytics: boolean;
  marketing: boolean;
  decidedAt: string;
}

const STORAGE_KEY = 'mms_cookie_consent';

export const CookieConsentBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [marketingEnabled, setMarketingEnabled] = useState(false);

  useEffect(() => {
    // Check if consent has already been given
    const existing = localStorage.getItem(STORAGE_KEY);
    if (!existing) {
      // Show after a brief non-intrusive delay for smooth page load
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  // Listen for custom trigger to reopen settings from footer
  useEffect(() => {
    const handleReopen = () => {
      const existing = localStorage.getItem(STORAGE_KEY);
      if (existing) {
        try {
          const parsed = JSON.parse(existing);
          setAnalyticsEnabled(parsed.analytics !== false);
          setMarketingEnabled(parsed.marketing === true);
        } catch {
          // fallback
        }
      }
      setShowPreferences(true);
      setIsVisible(true);
    };

    window.addEventListener('open-cookie-settings', handleReopen);
    return () => window.removeEventListener('open-cookie-settings', handleReopen);
  }, []);

  const savePreferences = (analytics: boolean, marketing: boolean) => {
    const prefs: CookiePreferences = {
      essential: true,
      analytics,
      marketing,
      decidedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    setIsVisible(false);
    setShowPreferences(false);
  };

  const handleAcceptAll = () => {
    savePreferences(true, true);
  };

  const handleEssentialOnly = () => {
    savePreferences(false, false);
  };

  const handleSaveCustom = () => {
    savePreferences(analyticsEnabled, marketingEnabled);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Cookie and Privacy Consent"
      className="fixed bottom-4 left-4 right-4 md:left-8 md:right-auto md:max-w-md z-50 animate-fadeIn"
    >
      <div className="bg-[#181c1f] text-slate-100 p-5 rounded-2xl shadow-2xl border border-slate-700/80 backdrop-blur-xl">
        
        {!showPreferences ? (
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#006097] text-white flex items-center justify-center shrink-0 mt-0.5">
                <Cookie className="w-5 h-5 text-[#ffe088]" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Privacy & Cookie Preferences</span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    GDPR / DPDP
                  </span>
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  We use cookies and telemetry to guarantee secure bookings, verify secure session tokens, and optimize our flight dispatch services.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={handleAcceptAll}
                className="flex-1 py-2 px-3 rounded-lg bg-[#007abd] hover:bg-[#006097] text-white text-xs font-bold transition-colors cursor-pointer text-center"
              >
                Accept All
              </button>
              <button
                type="button"
                onClick={handleEssentialOnly}
                className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                Essential Only
              </button>
              <button
                type="button"
                onClick={() => setShowPreferences(true)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Customize Cookie Settings"
                aria-label="Customize Cookie Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wide">
                  Configure Preferences
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowPreferences(false)}
                className="text-slate-400 hover:text-white p-1"
                aria-label="Close preferences"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {/* Essential */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
                <div>
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <span>Strictly Essential</span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1 rounded">
                      Required
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Required for flight booking forms, PNR sessions & security.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="w-4 h-4 text-[#007abd] rounded bg-slate-700 border-slate-600 cursor-not-allowed"
                />
              </div>

              {/* Analytics */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
                <div>
                  <div className="font-semibold text-white">Performance & Telemetry</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Helps us measure flight route speeds and error frequencies.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={analyticsEnabled}
                  onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                  className="w-4 h-4 text-[#007abd] rounded bg-slate-700 border-slate-600 cursor-pointer accent-[#007abd]"
                />
              </div>

              {/* Marketing */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
                <div>
                  <div className="font-semibold text-white">Promotions & Custom Fares</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Delivers relevant seasonal charter & holiday package offers.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={marketingEnabled}
                  onChange={(e) => setMarketingEnabled(e.target.checked)}
                  className="w-4 h-4 text-[#007abd] rounded bg-slate-700 border-slate-600 cursor-pointer accent-[#007abd]"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleSaveCustom}
                className="flex-1 py-2 px-3 rounded-lg bg-[#007abd] hover:bg-[#006097] text-white text-xs font-bold transition-colors cursor-pointer text-center"
              >
                Save Preferences
              </button>
              <button
                type="button"
                onClick={() => setShowPreferences(false)}
                className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>

          </div>
        )}

      </div>
    </aside>
  );
};

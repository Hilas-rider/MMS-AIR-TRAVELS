import React, { useState } from 'react';
import { Database, CheckCircle2, AlertCircle, Copy, Check, ExternalLink, RefreshCw, X, Shield, Terminal } from 'lucide-react';
import { isSupabaseConfigured, testSupabaseConnection, getSupabaseConfigStatus } from '../../lib/supabase';

interface SupabaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark?: boolean;
}

export const SupabaseStatusModal: React.FC<SupabaseStatusModalProps> = ({
  isOpen,
  onClose,
  isDark = true
}) => {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  const configStatus = getSupabaseConfigStatus();

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await testSupabaseConnection();
      setTestResult(res);
    } catch (e: any) {
      setTestResult({
        success: false,
        message: e.message || 'Connection test failed.'
      });
    } finally {
      setTesting(false);
    }
  };

  const sampleEnvText = `# Supabase Configuration for Vercel / GitHub
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className={`w-full max-w-xl rounded-3xl p-6 sm:p-7 shadow-2xl border flex flex-col max-h-[90vh] overflow-y-auto ${
        isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                DATABASE INFRASTRUCTURE
              </span>
              <h3 className="font-extrabold text-base">
                Supabase PostgreSQL & Vercel Publishing
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-5 py-4 text-xs">
          {/* Current Connection Status Box */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
            configStatus.isConfigured
              ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200'
              : 'bg-amber-950/40 border-amber-800/80 text-amber-200'
          }`}>
            <div className="flex items-center gap-3">
              {configStatus.isConfigured ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-6 h-6 text-amber-400 shrink-0" />
              )}
              <div>
                <span className="font-black text-xs block">
                  {configStatus.isConfigured ? 'Supabase Connected' : 'Supabase Credentials Not Yet Set'}
                </span>
                <span className="text-[11px] opacity-80 block font-mono">
                  {configStatus.isConfigured 
                    ? `Host: ${configStatus.projectUrl}` 
                    : 'App is running in Offline / Local Storage mode'}
                </span>
              </div>
            </div>

            <button
              onClick={handleTest}
              disabled={testing}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-[11px] flex items-center gap-1.5 transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${testing ? 'animate-spin' : ''}`} />
              <span>{testing ? 'Testing...' : 'Test Connection'}</span>
            </button>
          </div>

          {/* Test Result Message */}
          {testResult && (
            <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
              testResult.success
                ? 'bg-emerald-900/40 border-emerald-700 text-emerald-200'
                : 'bg-rose-900/40 border-rose-700 text-rose-200'
            }`}>
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          {/* Step by Step Guide for Vercel & Supabase */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-200 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-blue-400" />
              <span>Deployment & Database Setup Checklist:</span>
            </h4>

            <div className="space-y-2.5">
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <span className="text-blue-400 font-bold block text-[11px]">
                  Step 1. Create Free Database on Supabase
                </span>
                <p className="text-slate-400 text-[11px]">
                  Sign in to <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-emerald-400 underline font-semibold">supabase.com</a>, create a project, and navigate to <strong>SQL Editor</strong>.
                </p>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-blue-400 font-bold block text-[11px]">
                    Step 2. Execute Database Schema (`supabase-schema.sql`)
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('supabase-schema.sql');
                      setCopiedSql(true);
                      setTimeout(() => setCopiedSql(false), 2000);
                    }}
                    className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    {copiedSql ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSql ? 'Copied name!' : 'File: supabase-schema.sql'}</span>
                  </button>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Copy the full contents of <code>supabase-schema.sql</code> (provided in your repo root) and paste into the Supabase SQL editor to create all tables (bookings, visa enquiries, staff users, fares, activity logs) with RLS security policies.
                </p>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-blue-400 font-bold block text-[11px]">
                    Step 3. Configure Environment Variables in Vercel
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(sampleEnvText);
                      setCopiedEnv(true);
                      setTimeout(() => setCopiedEnv(false), 2000);
                    }}
                    className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    {copiedEnv ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedEnv ? 'Copied Env Template!' : 'Copy Env Template'}</span>
                  </button>
                </div>
                <p className="text-slate-400 text-[11px]">
                  In your Vercel Project Settings &rarr; <strong>Environment Variables</strong>, add:
                </p>
                <div className="bg-black/60 p-2.5 rounded-lg font-mono text-[10px] text-emerald-300 overflow-x-auto border border-slate-800">
                  <div>VITE_SUPABASE_URL = "https://your-project.supabase.co"</div>
                  <div>VITE_SUPABASE_ANON_KEY = "eyJhbGciOi..."</div>
                </div>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <span className="text-blue-400 font-bold block text-[11px]">
                  Step 4. Connect GitHub to Vercel
                </span>
                <p className="text-slate-400 text-[11px]">
                  Push this repository to GitHub, go to <a href="https://vercel.com/new" target="_blank" rel="noreferrer" className="text-emerald-400 underline font-semibold">vercel.com/new</a>, import the repo, and click <strong>Deploy</strong>. Vercel automatically builds Vite and provisions the serverless endpoints!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[10px] text-slate-500 font-mono">
            MMS Tours & Travels • Production Ready
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

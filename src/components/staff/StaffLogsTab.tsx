import React, { useState } from 'react';
import { ShieldAlert, Search, ShieldCheck, AlertTriangle, CheckCircle2, User, Clock } from 'lucide-react';
import { ActivityLogEntry } from './types';

interface StaffLogsTabProps {
  logs: ActivityLogEntry[];
  isDark: boolean;
}

export const StaffLogsTab: React.FC<StaffLogsTabProps> = ({ logs, isDark }) => {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const filtered = logs.filter((l) => {
    const matchesSearch = !search ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.staffEmail.toLowerCase().includes(search.toLowerCase()) ||
      l.staffName.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase());
    const matchesAction = actionFilter === 'ALL' || l.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-sky-400" />
            Security & Operations Activity Logs
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time audit trail capturing authentication events, rate adjustments, user role modifications, and IP origin.
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search activity logs by action, staff email, or details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-bold uppercase">Filter:</span>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
          >
            <option value="ALL">All Actions ({logs.length})</option>
            <option value="STAFF_LOGIN">Logins</option>
            <option value="FARE_UPDATED">Fare Updates</option>
            <option value="STAFF_CREATED">User Created</option>
            <option value="SECURITY_CONFIG_CHANGED">Security Config</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className={`rounded-3xl border overflow-hidden shadow-xl ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className={`border-b text-[10px] font-bold uppercase tracking-wider ${
              isDark ? 'bg-slate-950/80 text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-500 border-slate-200'
            }`}>
              <tr>
                <th className="p-4">Action</th>
                <th className="p-4">Staff User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Result</th>
                <th className="p-4">IP Address</th>
                <th className="p-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 font-medium">
              {filtered.map((log) => (
                <tr 
                  key={log.id} 
                  className={`transition-colors ${isDark ? 'hover:bg-slate-850' : 'hover:bg-slate-50'}`}
                >
                  <td className="p-4 font-mono font-bold text-sky-400 whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-white block">{log.staffName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{log.staffEmail}</span>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                      {log.role}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      log.result === 'Success'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}>
                      {log.result}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-slate-400 text-[11px]">
                    {log.ip}
                  </td>
                  <td className="p-4 text-slate-300 max-w-xs truncate">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

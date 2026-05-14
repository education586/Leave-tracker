import React from 'react';
import { UserSettings } from '../types';

interface SettingsFormProps {
  settings: UserSettings;
  onSave: (settings: UserSettings) => void;
}

export function SettingsForm({ settings, onSave }: SettingsFormProps) {
  const [formData, setFormData] = React.useState<UserSettings>(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      annualLeaveAllowance: Number(formData.annualLeaveAllowance),
      sickLeaveAllowance: Number(formData.sickLeaveAllowance),
      carriedOverAnnualLeave: Number(formData.carriedOverAnnualLeave),
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
      <h2 className="text-xl font-semibold mb-6 text-slate-900 border-b border-slate-100 pb-4">Leave Configuration</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">
              Annual Leave Allowance
            </label>
            <div className="relative">
              <input
                type="number"
                min={0}
                value={formData.annualLeaveAllowance}
                onChange={(e) => setFormData({ ...formData, annualLeaveAllowance: Number(e.target.value) })}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold bg-white px-1">DAYS</div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">
              Annual Override Balance
            </label>
            <div className="relative">
              <input
                type="number"
                min={0}
                step="0.01"
                value={formData.annualManualBalance || ''}
                onChange={(e) => setFormData({ ...formData, annualManualBalance: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                placeholder="Optional"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold bg-white px-1">DAYS</div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">
              Annual Balance As Of Date
            </label>
            <input
              type="date"
              value={formData.annualManualBalanceAsOf || ''}
              onChange={(e) => setFormData({ ...formData, annualManualBalanceAsOf: e.target.value || undefined })}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold text-slate-700"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">
              Sick Override Balance
            </label>
            <div className="relative">
              <input
                type="number"
                min={0}
                step="0.01"
                value={formData.sickManualBalance || ''}
                onChange={(e) => setFormData({ ...formData, sickManualBalance: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                placeholder="Optional"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold bg-white px-1">DAYS</div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">
               Sick Balance As Of Date
            </label>
            <input
              type="date"
              value={formData.sickManualBalanceAsOf || ''}
              onChange={(e) => setFormData({ ...formData, sickManualBalanceAsOf: e.target.value || undefined })}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold text-slate-700"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">
              Carried Over Annual Leave
            </label>
            <div className="relative">
              <input
                type="number"
                min={0}
                step="0.5"
                value={formData.carriedOverAnnualLeave}
                onChange={(e) => setFormData({ ...formData, carriedOverAnnualLeave: Number(e.target.value) })}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold bg-white px-1">DAYS</div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">
              Sick Leave Allowance
            </label>
             <div className="relative">
               <input
                 type="number"
                 min={0}
                 value={formData.sickLeaveAllowance}
                 onChange={(e) => setFormData({ ...formData, sickLeaveAllowance: Number(e.target.value) })}
                 className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
               />
               <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold bg-white px-1">DAYS</div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">
              Accrual Start Date
            </label>
            <input
              type="date"
              value={formData.accrualStartDate}
              onChange={(e) => setFormData({ ...formData, accrualStartDate: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold text-slate-700"
            />
            <p className="mt-2 text-[11px] text-slate-500 uppercase tracking-wide font-medium">
              Typically Jan 1st of current year.
            </p>
          </div>

          <div className="flex flex-col pt-2">
            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
              <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wide mb-1">Accrual Details</h4>
              <p className="text-sm text-indigo-700">
                Annual leave unlocks incrementally each month <strong className="font-bold">({(formData.annualLeaveAllowance / 12).toFixed(2)} days/mo)</strong>.
                <br/>
                Sick leave unlocks incrementally each month <strong className="font-bold">({(formData.sickLeaveAllowance / 12).toFixed(2)} days/mo)</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <input
              type="checkbox"
              id="isAdmin"
              checked={formData.isAdmin}
              onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
              className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer"
            />
            <label htmlFor="isAdmin" className="text-sm font-bold text-slate-700 uppercase tracking-wide cursor-pointer">
              Admin Mode <span className="font-medium text-slate-400 normal-case tracking-normal ml-1">(Enable to approve/reject leaves)</span>
            </label>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 space-y-6">
          <h3 className="text-lg font-semibold text-slate-900 pb-2 border-b border-slate-100">Google Calendar Integration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">
                Google Calendar ID
              </label>
              <input
                type="text"
                value={formData.googleCalendarId || ''}
                onChange={(e) => setFormData({ ...formData, googleCalendarId: e.target.value })}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold text-slate-700"
                placeholder="e.g. en.indian#holiday@group.v.calendar.google.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">
                Google API Key
              </label>
              <input
                type="password"
                value={formData.googleApiKey || ''}
                onChange={(e) => setFormData({ ...formData, googleApiKey: e.target.value })}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold text-slate-700"
                placeholder="API Key from Google Cloud Console"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100">
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-md hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 transition-colors"
          >
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}

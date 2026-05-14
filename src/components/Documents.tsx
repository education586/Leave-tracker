import React from 'react';
import { Info } from 'lucide-react';

export function Documents() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#1f4a7c] mb-6">Documents</h2>
      <div className="bg-[#f8fafc] border border-slate-200 rounded-xl p-5 sm:p-6">
        <h4 className="text-base font-bold text-[#1f4a7c] mb-4 flex items-center gap-2">
          <Info className="w-5 h-5" />
          Understanding Your Leave Balances
        </h4>
        <div className="space-y-5 text-[15px] leading-relaxed text-slate-700">
          <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
            <p className="font-bold text-slate-900 mb-2">Annual Leave</p>
            <p className="font-mono text-sm bg-slate-50 px-3 py-2 rounded text-slate-800 mb-3 border border-slate-100">
              Remaining Balance = (Last Year Increment + Year-to-Date Accrued) − Used Leave
            </p>
            <p className="text-sm text-slate-500">
              You start with <strong className="text-slate-700">7.5 days</strong> carried over from the previous year. Each month, you accrue additional annual leave (e.g., 1.25 days/month). Your current remaining balance is the sum of your carried-over leave and what you've accrued so far this year, minus any approved annual leave you have taken.
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
            <p className="font-bold text-slate-900 mb-2">Sick Leave</p>
            <p className="font-mono text-sm bg-slate-50 px-3 py-2 rounded text-slate-800 mb-3 border border-slate-100">
              Remaining Balance = Yearly Allowance − Used Leave
            </p>
            <p className="text-sm text-slate-500">
              Sick leave does not carry forward. You are provided a fixed yearly allowance at the start of the year. Your remaining balance is simply that allowance minus any approved sick leave taken to date.
            </p>
          </div>

          <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100">
            <p className="font-bold text-indigo-900 mb-3 uppercase tracking-wider text-xs">Step-by-Step Calculation (Example: 15 June)</p>
            <div className="space-y-4 text-sm text-indigo-800">
              <div>
                <p className="font-bold underline mb-1">1. Total Annual Accrued till 15 June:</p>
                <p>Monthly Accrual: <span className="font-mono">1.25 Days/Mo</span></p>
                <p>Months (Jan to mid-June): <span className="font-mono">5.5 Months</span></p>
                <p className="font-bold">Total Accrued: 5.5 × 1.25 = 6.875 Days</p>
              </div>
              
              <div>
                <p className="font-bold underline mb-1">2. Total Available till 15 June:</p>
                <p>Formula: <span className="font-mono">Last Year Increment + Accrued</span></p>
                <p>Calculation: <span className="font-mono">4.5 + 6.875 = 11.375 Days</span></p>
              </div>

              <div>
                <p className="font-bold underline mb-1">3. Balance as of 15 June:</p>
                <p>If Balance as of 15 June is <span className="font-mono text-base font-bold">3.88 Days</span>:</p>
                <p>Used = Total Available − Balance</p>
                <p className="font-bold">Calculated Used: 11.375 − 3.88 = 7.495 Days</p>
              </div>

              <div className="pt-2 border-t border-indigo-200 mt-2">
                <p className="italic text-xs font-bold mb-1 underline">4. Future Accrual:</p>
                <p className="text-xs">On the 15th of each following month, 1.25 days are automatically added to your balance. For example, on 15 July, the balance will become 3.88 + 1.25 = 5.13 days.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

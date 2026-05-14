import React, { useState, useEffect } from 'react';
import { UserSettings, LeaveRequest, LeaveType, Holiday } from '../types';
import { calculateWorkingDays } from '../lib/leaveMath';
import { v4 as uuidv4 } from 'uuid';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';

interface LeaveFormProps {
  onClose: () => void;
  onSubmit: (request: LeaveRequest) => void;
  holidays: Holiday[];
}

export function LeaveForm({ onClose, onSubmit, holidays }: LeaveFormProps) {
  const [type, setType] = useState<LeaveType>('annual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [workingDays, setWorkingDays] = useState(0);

  useEffect(() => {
    if (startDate && endDate) {
      setWorkingDays(calculateWorkingDays(startDate, endDate, holidays));
    } else {
      setWorkingDays(0);
    }
  }, [startDate, endDate, holidays]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || workingDays <= 0) return;

    const request: LeaveRequest = {
      id: uuidv4(),
      type,
      startDate,
      endDate,
      workingDays,
      reason,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    onSubmit(request);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        
        <h2 className="mb-6 text-xl font-bold text-slate-900">Request Leave</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Leave Type</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setType('annual')}
                className={cn(
                  "rounded-lg px-2 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-colors border-2",
                  type === 'annual' 
                    ? "bg-indigo-50 text-indigo-600 border-indigo-200" 
                    : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700"
                )}
              >
                Annual
              </button>
              <button
                type="button"
                onClick={() => setType('sick')}
                className={cn(
                  "rounded-lg px-2 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-colors border-2",
                  type === 'sick' 
                    ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                    : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700"
                )}
              >
                Sick
              </button>
              <button
                type="button"
                onClick={() => setType('unpaid')}
                className={cn(
                  "rounded-lg px-2 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-colors border-2",
                  type === 'unpaid' 
                    ? "bg-slate-900 text-white border-slate-900" 
                    : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700"
                )}
              >
                Unpaid
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Start Date</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">End Date</label>
              <input
                type="date"
                required
                min={startDate}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {startDate && endDate && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Working Days Total</span>
              <span className="font-black text-lg text-slate-900">{workingDays} <span className="text-sm font-medium text-slate-400">Days</span></span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Reason <span className="font-medium text-slate-400 normal-case tracking-normal">(Optional)</span></label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="e.g. Summer vacation, feeling unwell..."
            />
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={workingDays <= 0}
              className="w-full rounded-lg bg-indigo-600 px-4 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-md hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React from 'react';
import { LeaveRequest, UserSettings } from '../types';
import { CheckCircle, XCircle, Clock, Calendar, User, Info, History, Shield } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '../lib/utils';

interface AdminBoardProps {
  requests: LeaveRequest[];
  onUpdateRequest: (id: string, status: 'approved' | 'pending' | 'rejected') => void;
}

export function AdminBoard({ requests, onUpdateRequest }: AdminBoardProps) {
  const pendingRequests = requests.filter(r => r.status === 'pending');
  const processedRequests = requests.filter(r => r.status !== 'pending').sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-[#0e2a47]">Leave Management</h2>
        <p className="text-slate-500">Approve or reject leave requests from your team.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                Pending Requests
                <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">
                  {pendingRequests.length}
                </span>
              </h3>
            </div>

            {pendingRequests.length === 0 ? (
              <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-slate-300" />
                </div>
                <h4 className="text-slate-800 font-semibold mb-1">All caught up!</h4>
                <p className="text-slate-500 text-sm">No pending leave requests to process.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {pendingRequests.map((request) => (
                  <div 
                    key={request.id} 
                    className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-lg flex items-center justify-center shrink-0",
                          request.type === 'annual' ? "bg-blue-50 text-blue-600" : 
                          request.type === 'sick' ? "bg-red-50 text-red-600" : "bg-slate-50 text-slate-600"
                        )}>
                          <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-slate-900 capitalize">{request.type} Leave</span>
                            <span className="text-xs text-slate-400">•</span>
                            <span className="text-xs text-slate-500">Requested on {format(parseISO(request.createdAt), 'MMM d, yyyy')}</span>
                          </div>
                          <div className="text-sm font-semibold text-slate-700 mb-2">
                            {format(parseISO(request.startDate), 'MMM d')} - {format(parseISO(request.endDate), 'MMM d, yyyy')}
                            <span className="mx-2 text-slate-300">|</span>
                            <span className="text-indigo-600">{request.workingDays} working days</span>
                          </div>
                          {request.reason && (
                            <div className="flex items-start gap-2 text-sm text-slate-500 italic bg-slate-50 p-2 rounded-md">
                              <Info className="w-4 h-4 mt-0.5 shrink-0" />
                              "{request.reason}"
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                        <button 
                          onClick={() => onUpdateRequest(request.id, 'rejected')}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-red-200 text-red-600 font-bold text-sm hover:bg-red-50 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                        <button 
                          onClick={() => onUpdateRequest(request.id, 'approved')}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-600 text-white font-bold text-sm hover:bg-green-700 shadow-sm transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-slate-500" />
              Processing History
            </h3>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 font-bold text-slate-600">Type</th>
                      <th className="px-6 py-3 font-bold text-slate-600">Period</th>
                      <th className="px-6 py-3 font-bold text-slate-600">Days</th>
                      <th className="px-6 py-3 font-bold text-slate-600">Status</th>
                      <th className="px-6 py-3 font-bold text-slate-600 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {processedRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className={cn(
                            "inline-flex items-center px-2 py-1 rounded-md text-xs font-bold capitalize",
                            request.type === 'annual' ? "bg-blue-50 text-blue-700" : 
                            request.type === 'sick' ? "bg-red-50 text-red-700" : "bg-slate-50 text-slate-700"
                          )}>
                            {request.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-700">
                            {format(parseISO(request.startDate), 'MMM d')} - {format(parseISO(request.endDate), 'MMM d')}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {format(parseISO(request.startDate), 'yyyy')}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900">
                          {request.workingDays}
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "inline-flex items-center gap-1 text-xs font-bold",
                            request.status === 'approved' ? "text-green-600" : "text-red-500"
                          )}>
                            {request.status === 'approved' ? (
                              <><CheckCircle className="w-3.5 h-3.5" /> Approved</>
                            ) : (
                              <><XCircle className="w-3.5 h-3.5" /> Rejected</>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => onUpdateRequest(request.id, 'pending')}
                            className="text-xs font-bold text-indigo-600 hover:underline"
                          >
                            Reset to Pending
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {processedRequests.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                  No processed requests yet.
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Admin Insights</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-blue-600 font-bold uppercase tracking-wider">Total Approved</div>
                    <div className="text-xl font-black text-blue-800">
                      {requests.filter(r => r.status === 'approved').reduce((acc, curr) => acc + curr.workingDays, 0).toFixed(1)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-amber-600 shadow-sm">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-amber-600 font-bold uppercase tracking-wider">Awaiting Action</div>
                    <div className="text-xl font-black text-amber-800">{pendingRequests.length}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0e2a47] rounded-xl p-6 text-white overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-2">Policy Reminder</h3>
              <p className="text-blue-100 text-sm leading-relaxed mb-4">
                Leave requests should be processed within 48 hours. Ensure team coverage before approving extended absences.
              </p>
              <button className="text-xs font-bold py-2 px-4 bg-blue-500 hover:bg-blue-400 rounded-lg transition-colors">
                View Full Policy
              </button>
            </div>
            <div className="absolute -bottom-6 -right-6 opacity-10">
              <Shield className="w-32 h-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

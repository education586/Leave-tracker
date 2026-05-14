import React, { useState } from "react";
import { LeaveRequest, UserSettings, Holiday } from "../types";
import { calculateLeaveBalances } from "../lib/leaveMath";
import {
  Info,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import { cn } from "../lib/utils";
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  subMonths,
  addMonths,
  isSameMonth,
  isSameDay,
  startOfDay,
} from "date-fns";

interface DashboardProps {
  requests: LeaveRequest[];
  settings: UserSettings;
  holidays: Holiday[];
  onOpenForm: () => void;
  onDeleteRequest: (id: string) => void;
  onUpdateRequest?: (
    id: string,
    status: "approved" | "pending" | "rejected",
  ) => void;
}

export function Dashboard({
  requests,
  settings,
  holidays,
  onOpenForm,
  onDeleteRequest,
  onUpdateRequest,
}: DashboardProps) {
  const balances = calculateLeaveBalances(requests, settings);

  const sortedRequests = [...requests].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
  );

  const [calendarMonth, setCalendarMonth] = useState(startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const prevMonth = () => setCalendarMonth(subMonths(calendarMonth, 1));
  const nextMonth = () => setCalendarMonth(addMonths(calendarMonth, 1));

  const monthStart = startOfMonth(calendarMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = [];
  let day = startDate;
  while (day <= endDate) {
    calendarDays.push(day);
    day = addDays(day, 1);
  }

  const getRequestsForDate = (date: Date) => {
    return requests.filter((req) => {
      if (req.status !== "approved") return false;
      const rStart = startOfDay(parseISO(req.startDate));
      const rEnd = startOfDay(parseISO(req.endDate));
      const current = startOfDay(date);
      return current >= rStart && current <= rEnd;
    });
  };

  const selectedRequests = selectedDate ? getRequestsForDate(selectedDate) : [];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
      {/* Left Column (Main Data) */}
      <div className="space-y-6">
        {/* Balance Card */}
        <div className="bg-white rounded-[10px] shadow-sm border border-[#e2e8f0] p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h2 className="text-xl font-bold text-[#1f4a7c]">
              Balance at a Glance for Deepanshu Gupta
            </h2>
            <button
              onClick={onOpenForm}
              className="bg-[#244265] text-white px-5 py-2.5 rounded shadow-sm text-base font-semibold hover:bg-[#1a3048] transition-colors"
            >
              Apply Leave
            </button>
          </div>

          <div className="flex flex-col space-y-6">
            {/* Annual Leave Row */}
            <div className="grid grid-cols-1 sm:grid-cols-5 items-center gap-4 py-2">
              <div className="flex items-center gap-6 col-span-2 sm:col-span-1">
                <div className="w-8 h-8 rounded-full bg-[#f87171] shrink-0"></div>
                <span className="font-bold text-lg text-[#1f4a7c] whitespace-nowrap">
                  Annual
                </span>
              </div>
              <div className="flex flex-col sm:items-center text-left sm:text-center">
                <span className="text-base font-bold text-gray-900 leading-tight">
                  Last Year Increment
                </span>
                <span className="text-base text-gray-600 font-medium">
                  {settings.carriedOverAnnualLeave?.toFixed(2)} days
                </span>
              </div>
              <div className="flex flex-col sm:items-center text-left sm:text-center">
                <span className="text-base font-bold text-gray-900 leading-tight">
                  Balance
                </span>
                <span className="text-base text-gray-600 font-medium">
                  {balances.annual.remainingAccrued.toFixed(2)} days
                </span>
              </div>
              <div className="flex flex-col sm:items-center text-left sm:text-center w-full">
                <span className="text-base font-bold text-gray-900 leading-tight">
                  Used
                </span>
                <div className="flex items-center gap-1.5 text-base text-gray-600 font-medium">
                  {balances.annual.used.toFixed(2)}{" "}
                  <span className="text-sm text-gray-500">
                    / {settings.annualLeaveAllowance} days
                  </span>
                </div>
                <div className="mt-1.5 w-full sm:max-w-[120px] h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#f87171] rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, balances.annual.total > 0 ? (balances.annual.used / balances.annual.total) * 100 : 0)}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="hidden sm:flex justify-end pr-4">
                <Info className="w-5 h-5 text-gray-600" />
              </div>
            </div>

            {/* Sick Leave Row */}
            <div className="grid grid-cols-1 sm:grid-cols-5 items-center gap-4 py-2">
              <div className="flex items-center gap-6 col-span-2 sm:col-span-1">
                <div className="w-8 h-8 rounded-full bg-[#fcd34d] shrink-0"></div>
                <span className="font-bold text-lg text-[#1f4a7c] whitespace-nowrap">
                  Sick
                </span>
              </div>
              <div className="hidden sm:block"></div>
              <div className="flex flex-col sm:items-center text-left sm:text-center">
                <span className="text-base font-bold text-gray-900 leading-tight">
                  Balance
                </span>
                <span className="text-base text-gray-600 font-medium">
                  {balances.sick.remaining.toFixed(2)} days
                </span>
              </div>
              <div className="flex flex-col sm:items-center text-left sm:text-center w-full">
                <span className="text-base font-bold text-gray-900 leading-tight">
                  Used
                </span>
                <div className="flex items-center gap-1.5 text-base text-gray-600 font-medium">
                  {balances.sick.used.toFixed(2)}{" "}
                  <span className="text-sm text-gray-500">
                    / {balances.sick.total.toFixed(0)} days
                  </span>
                </div>
                <div className="mt-1.5 w-full sm:max-w-[120px] h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#fcd34d] rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, balances.sick.total > 0 ? (balances.sick.used / balances.sick.total) * 100 : 0)}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="hidden sm:flex justify-end pr-4">
                <Info className="w-5 h-5 text-gray-600" />
              </div>
            </div>

            {/* Leave Without Pay Row */}
            <div className="grid grid-cols-1 sm:grid-cols-5 items-center gap-4 py-2">
              <div className="flex items-center gap-6 col-span-2 sm:col-span-1">
                <div className="w-8 h-8 rounded-full bg-[#000000] shrink-0"></div>
                <span className="font-bold text-lg text-[#1f4a7c] whitespace-nowrap">
                  Leave without Pay
                </span>
              </div>
              <div className="hidden sm:block"></div>
              <div className="flex flex-col sm:items-center text-left sm:text-center">
                <span className="text-base font-bold text-gray-900 leading-tight">
                  Balance
                </span>
                <span className="text-base text-gray-600 font-medium">--</span>
              </div>
              <div className="flex flex-col sm:items-center text-left sm:text-center">
                <span className="text-base font-bold text-gray-900 leading-tight">
                  Used
                </span>
                <span className="text-base text-gray-600 font-medium">
                  {balances.unpaid.used.toFixed(2)} days
                </span>
              </div>
              <div className="hidden sm:flex justify-end pr-4">
                <Info className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Leave Information Table Card */}
        <div className="bg-white rounded-[10px] shadow-sm border border-[#e2e8f0] overflow-hidden">
          <div className="p-6 flex justify-between items-center bg-white">
            <h3 className="text-lg font-bold text-[#1f4a7c]">
              Leave Information
            </h3>
            <ChevronUp className="w-6 h-6 text-gray-400" />
          </div>

          <div className="px-6 pb-4">
            <button className="p-2 bg-[#f1f5f9] rounded text-gray-600 hover:bg-[#e2e8f0] transition-colors border border-gray-200">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#e4e4e4] border-b border-[#cbd5e1]">
                <tr>
                  <th className="px-5 py-4 text-[15px] font-bold text-[#333333]">
                    <div className="flex flex-col items-center justify-center gap-1">
                      Request Date{" "}
                      <div className="flex">
                        <ChevronUp className="w-3 h-3 -mr-1" />
                        <ChevronDown className="w-3 h-3" />
                      </div>
                    </div>
                  </th>
                  <th className="px-5 py-4 text-[15px] font-bold text-[#333333]">
                    <div className="flex flex-col items-center justify-center gap-1">
                      Leave (Start Date){" "}
                      <div className="flex">
                        <ChevronUp className="w-3 h-3 -mr-1" />
                        <ChevronDown className="w-3 h-3" />
                      </div>
                    </div>
                  </th>
                  <th className="px-5 py-4 text-[15px] font-bold text-[#333333]">
                    <div className="flex flex-col items-center justify-center gap-1">
                      Amount (Days){" "}
                      <div className="flex">
                        <ChevronUp className="w-3 h-3 -mr-1" />
                        <ChevronDown className="w-3 h-3" />
                      </div>
                    </div>
                  </th>
                  <th className="px-5 py-4 text-[15px] font-bold text-[#333333]">
                    <div className="flex flex-col items-center justify-center gap-1">
                      Leave Type{" "}
                      <div className="flex">
                        <ChevronUp className="w-3 h-3 -mr-1" />
                        <ChevronDown className="w-3 h-3" />
                      </div>
                    </div>
                  </th>
                  <th className="px-5 py-4 text-[15px] font-bold text-[#333333]">
                    <div className="flex flex-col items-center justify-center gap-1">
                      Status{" "}
                      <div className="flex">
                        <ChevronUp className="w-3 h-3 -mr-1" />
                        <ChevronDown className="w-3 h-3" />
                      </div>
                    </div>
                  </th>
                  <th className="px-5 py-4 text-[15px] font-bold text-[#333333] text-center">
                    Leave Details
                  </th>
                </tr>
                {/* Search inputs row */}
                <tr className="bg-[#f0f0f0] border-t border-gray-200 shadow-inner">
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-[#1f4a7c]"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-[#1f4a7c]"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-[#1f4a7c]"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-[#1f4a7c]"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-[#1f4a7c]"
                    />
                  </td>
                  <td className="px-3 py-2 text-center text-sm text-slate-400"></td>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {sortedRequests.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-8 text-center text-sm text-gray-500"
                    >
                      No leave requests found
                    </td>
                  </tr>
                ) : (
                  sortedRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4 text-[15px] font-normal text-gray-800 text-center">
                        {format(parseISO(req.createdAt), "dd MMM yyyy")}
                      </td>
                      <td className="px-5 py-4 text-[15px] font-normal text-gray-800 text-center">
                        {format(parseISO(req.startDate), "dd MMM yyyy")}
                      </td>
                      <td className="px-5 py-4 text-[15px] font-normal text-gray-800 text-center">
                        {req.workingDays}
                      </td>
                      <td className="px-5 py-4 text-[15px] font-normal text-gray-800 text-center capitalize">
                        {req.type}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <span
                            className={cn(
                              "inline-flex items-center justify-center font-bold text-xs px-3 py-1.5 rounded",
                              req.status === "approved"
                                ? "bg-[#e6f4ea] text-[#1e8e3e]"
                                : req.status === "rejected"
                                  ? "bg-red-50 text-red-600"
                                  : "bg-amber-50 text-amber-600",
                            )}
                          >
                            {req.status.toUpperCase()}
                          </span>

                          {settings.isAdmin &&
                            req.status === "pending" &&
                            onUpdateRequest && (
                              <div className="flex gap-1">
                                <button
                                  onClick={() =>
                                    onUpdateRequest(req.id, "approved")
                                  }
                                  className="px-2 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded hover:bg-emerald-700 transition-colors"
                                >
                                  APPROVE
                                </button>
                                <button
                                  onClick={() =>
                                    onUpdateRequest(req.id, "rejected")
                                  }
                                  className="px-2 py-1 bg-red-600 text-white text-[10px] font-bold rounded hover:bg-red-700 transition-colors"
                                >
                                  REJECT
                                </button>
                              </div>
                            )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => onDeleteRequest(req.id)}
                          className="bg-[#244265] text-white px-4 py-1.5 rounded shadow-sm text-sm font-semibold hover:bg-[#1a3048] transition-colors whitespace-nowrap"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Column (Widgets) */}
      <div className="space-y-6">
        {/* Public Holidays */}
        <div className="bg-white rounded-[10px] shadow-sm border border-[#e2e8f0] p-6 lg:p-8">
          <h3 className="text-lg font-bold text-[#1f4a7c] mb-4">
            Public Holidays
          </h3>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {holidays.filter((h) => {
              const hDate = parseISO(h.date);
              return (
                hDate >= startOfMonth(calendarMonth) &&
                hDate <= endOfMonth(calendarMonth)
              );
            }).length === 0 ? (
              <p className="text-sm text-gray-500 italic">
                No holidays this month
              </p>
            ) : (
              holidays.filter((h) => {
                const hDate = parseISO(h.date);
                return (
                  hDate >= startOfMonth(calendarMonth) &&
                  hDate <= endOfMonth(calendarMonth)
                );
              }).map((h) => (
                <div
                  key={h.date}
                  className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900">
                      {h.name}
                    </span>
                    <span className="text-xs text-slate-500">
                      {format(parseISO(h.date), "dd MMM yyyy")}
                    </span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                </div>
              ))
            )}
          </div>
          <p className="mt-4 text-[10px] text-gray-400 italic font-medium">
            Automatic weekend exclusion (Sat/Sun) + Public Holidays
          </p>
        </div>

        {/* Calendar Widget */}
        <div className="bg-white rounded-[10px] shadow-sm border border-[#e2e8f0] p-6">
          <div className="flex items-center justify-between mb-4 px-2">
            <button
              onClick={prevMonth}
              className="text-gray-500 hover:bg-slate-100 p-1 rounded-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h4 className="font-bold text-[#1f4a7c] text-base">
              {format(calendarMonth, "MMMM, yyyy")}
            </h4>
            <button
              onClick={nextMonth}
              className="text-gray-500 hover:bg-slate-100 p-1 rounded-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="font-bold text-gray-700 bg-gray-100 py-1.5 rounded-sm"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-sm">
            {calendarDays.map((date, i) => {
              const dayRequests = getRequestsForDate(date);
              const isSelected = selectedDate && isSameDay(date, selectedDate);
              const isCurrentMonth = isSameMonth(date, calendarMonth);
              const hasAnnual = dayRequests.some((r) => r.type === "annual");
              const hasSick = dayRequests.some((r) => r.type === "sick");
              const isCurrentDay = isSameDay(date, new Date());
              const holiday = holidays.find((h) =>
                isSameDay(parseISO(h.date), date),
              );
              const isHoliday = !!holiday;

              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(date)}
                  className={cn(
                    "relative flex flex-col items-center justify-center h-10 w-full rounded-sm transition-colors",
                    !isCurrentMonth && "text-gray-400 bg-gray-50/50",
                    isHoliday && "bg-red-50 text-red-600",
                    isCurrentMonth &&
                      "font-bold text-gray-800 hover:bg-slate-100",
                    isSelected && "ring-2 ring-[#1f4a7c] bg-blue-50 z-10",
                    isCurrentDay && !isSelected && "bg-blue-100 text-blue-900",
                  )}
                  title={isHoliday ? holiday.name : undefined}
                >
                  <span
                    className={cn(
                      isCurrentDay &&
                        "w-6 h-6 rounded-full bg-[#1f4a7c] text-white flex items-center justify-center",
                    )}
                  >
                    {format(date, "d")}
                  </span>

                  {/* Indicator Dots */}
                  <div className="absolute bottom-1 flex gap-0.5">
                    {dayRequests.length > 0 && !isCurrentDay && (
                      <>
                        {hasAnnual && (
                          <div className="w-1 h-1 rounded-full bg-[#f87171]" />
                        )}
                        {hasSick && (
                          <div className="w-1 h-1 rounded-full bg-[#fcd34d]" />
                        )}
                        {!hasAnnual && !hasSick && (
                          <div className="w-1 h-1 rounded-full bg-slate-900" />
                        )}
                      </>
                    )}
                    {isHoliday && (
                      <div className="w-1 h-1 rounded-full bg-red-400 animate-pulse" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Date Request Details */}
          {selectedDate && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <h5 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <CalendarIcon className="w-5 h-5" />
                {format(selectedDate, "MMM d, yyyy")}
              </h5>

              {selectedRequests.length === 0 ? (
                <p className="text-base text-slate-500 italic">
                  No approved leave on this date.
                </p>
              ) : (
                <div className="space-y-3">
                  {selectedRequests.map((req) => (
                    <div
                      key={req.id}
                      className={cn(
                        "p-3 rounded-lg border flex flex-col gap-1.5",
                        req.type === "annual"
                          ? "bg-red-50 border-red-100"
                          : req.type === "sick"
                            ? "bg-amber-50 border-amber-100"
                            : "bg-slate-50 border-slate-200",
                      )}
                    >
                      <div className="flex justify-between items-center">
                        <span
                          className={cn(
                            "text-sm font-bold uppercase tracking-wider",
                            req.type === "annual"
                              ? "text-red-700"
                              : req.type === "sick"
                                ? "text-amber-700"
                                : "text-slate-700",
                          )}
                        >
                          {req.type} Leave
                        </span>
                        <span className="text-sm font-semibold text-slate-500">
                          {req.workingDays} days total
                        </span>
                      </div>
                      {req.reason && (
                        <p className="text-base text-slate-700 font-medium">
                          "{req.reason}"
                        </p>
                      )}
                      <p className="text-xs text-slate-500">
                        From {format(parseISO(req.startDate), "MMM d")} to{" "}
                        {format(parseISO(req.endDate), "MMM d")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Team Availability */}
        <div className="bg-white rounded-[10px] shadow-sm border border-[#e2e8f0] p-6 lg:p-8">
          <h3 className="text-lg font-bold text-[#1f4a7c] mb-4">
            Team Availablility
          </h3>
          <p className="text-base font-bold text-gray-900">Tue, 12 May 2026</p>
        </div>
      </div>
    </div>
  );
}

import {
  differenceInMonths,
  parseISO,
  isBefore,
  isWeekend,
  eachDayOfInterval,
  startOfDay,
  format,
} from 'date-fns';
import { UserSettings, LeaveRequest, Holiday } from '../types';
import { PUBLIC_HOLIDAYS } from '../constants';

export function calculateWorkingDays(startDateStr: string, endDateStr: string, holidays: Holiday[] = PUBLIC_HOLIDAYS): number {
  if (!startDateStr || !endDateStr) return 0;
  
  const start = parseISO(startDateStr);
  const end = parseISO(endDateStr);
  
  if (isBefore(end, start)) return 0;

  const holidayDates = new Set(holidays.map(h => h.date));

  try {
    const days = eachDayOfInterval({ start, end });
    return days.filter(day => {
      const isWeekEnd = isWeekend(day);
      const isHoliday = holidayDates.has(format(day, 'yyyy-MM-dd'));
      return !isWeekEnd && !isHoliday;
    }).length;
  } catch (e) {
    return 0;
  }
}

export function calculateAccruedAnnualLeave(settings: UserSettings, asOf: Date = new Date()): number {
  if (!settings.accrualStartDate) return 0;
  
  const startDate = startOfDay(parseISO(settings.accrualStartDate));
  
  if (isBefore(asOf, startDate)) return 0;
  
  if (!settings.accruedMonthly) {
    return settings.annualLeaveAllowance;
  }

  // Monthly accrual: months passed + 1 (if you get it at the start of the month)
  // Let's do straight difference in months, assuming you accrue at the start or end.
  // Standard strict: current month is included, assuming prorated start of month.
  let monthsPassed = differenceInMonths(asOf, startDate) + 1;
  monthsPassed = Math.max(0, Math.min(monthsPassed, 12));
  
  const accrued = (settings.annualLeaveAllowance / 12) * monthsPassed;
  return Math.round(accrued * 100) / 100;
}

export function calculateLeaveBalances(requests: LeaveRequest[], settings: UserSettings) {
  const carriedOver = settings.carriedOverAnnualLeave || 0;
  const accruedAnnual = calculateAccruedAnnualLeave(settings) + carriedOver;
  const totalAnnual = settings.annualLeaveAllowance + carriedOver;
  const totalSick = settings.sickLeaveAllowance;

  let usedAnnual = 0;
  let usedSick = 0;
  let usedUnpaid = 0;

  requests.forEach(req => {
    // We deduct pending leaves as well from available balance so they don't over-request
    if (req.status === 'rejected') return;
    
    if (req.type === 'annual') {
      usedAnnual += req.workingDays;
    } else if (req.type === 'sick') {
      usedSick += req.workingDays;
    } else if (req.type === 'unpaid') {
      usedUnpaid += req.workingDays;
    }
  });

  let remainingAccruedAnnual = Math.max(0, accruedAnnual - usedAnnual);
  
  if (settings.annualManualBalance !== undefined) {
    remainingAccruedAnnual = settings.annualManualBalance;
    
    if (settings.annualManualBalanceAsOf) {
      const asOfDate = startOfDay(parseISO(settings.annualManualBalanceAsOf));
      let usedAfter = 0;
      requests.forEach(req => {
        if (req.status !== 'rejected' && req.type === 'annual') {
          if (!isBefore(parseISO(req.startDate), asOfDate)) {
            usedAfter += req.workingDays;
          }
        }
      });
      
      const monthlyRate = settings.annualLeaveAllowance / 12;
      const monthsPassed = Math.max(0, differenceInMonths(new Date(), asOfDate));
      const additionalAccrual = monthsPassed * monthlyRate;
      
      remainingAccruedAnnual = remainingAccruedAnnual + additionalAccrual - usedAfter;
    } else {
       remainingAccruedAnnual -= usedAnnual;
    }
  }

  let remainingSick = Math.max(0, totalSick - usedSick);
  let sickAccrual = totalSick;
  
  if (settings.sickManualBalance !== undefined) {
    remainingSick = settings.sickManualBalance;
    
    if (settings.sickManualBalanceAsOf) {
      const asOfDate = startOfDay(parseISO(settings.sickManualBalanceAsOf));
      let usedAfter = 0;
      requests.forEach(req => {
        if (req.status !== 'rejected' && req.type === 'sick') {
          if (!isBefore(parseISO(req.startDate), asOfDate)) {
            usedAfter += req.workingDays;
          }
        }
      });
      
      const monthlyRate = settings.sickLeaveAllowance / 12;
      const monthsPassed = Math.max(0, differenceInMonths(new Date(), asOfDate));
      const additionalAccrual = monthsPassed * monthlyRate;
      
      remainingSick = remainingSick + additionalAccrual - usedAfter;
    } else {
       remainingSick -= usedSick;
    }
  }

  return {
    annual: {
      total: totalAnnual,
      accrued: accruedAnnual,
      used: usedAnnual,
      remainingAccrued: remainingAccruedAnnual,
      remainingTotal: Math.max(0, totalAnnual - usedAnnual),
    },
    sick: {
      total: sickAccrual,
      used: usedSick,
      remaining: remainingSick,
    },
    unpaid: {
      used: usedUnpaid
    }
  };
}

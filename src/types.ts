export type LeaveType = 'annual' | 'sick' | 'unpaid';
export type LeaveStatus = 'approved' | 'pending' | 'rejected';

export interface Holiday {
  date: string;
  name: string;
}

export interface UserProfile {
  name: string;
  role: string;
  avatarUrl: string;
}

export interface LeaveRequest {
  id: string;
  type: LeaveType;
  startDate: string; // ISO yyyy-MM-dd
  endDate: string;
  workingDays: number;
  reason: string;
  status: LeaveStatus;
  createdAt: string;
}

export interface UserSettings {
  annualLeaveAllowance: number;
  sickLeaveAllowance: number;
  carriedOverAnnualLeave: number;
  accrualStartDate: string; // ISO yyyy-MM-dd (Usually Jan 1st of the current year)
  accruedMonthly: boolean; // If true, annual leave accrues monthly. If false, available upfront.
  annualManualBalance?: number;
  annualManualBalanceAsOf?: string;
  sickManualBalance?: number;
  sickManualBalanceAsOf?: string;
  isAdmin?: boolean;
  googleCalendarId?: string;
  googleApiKey?: string;
}

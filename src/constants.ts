export interface Holiday {
  date: string;
  name: string;
}

export const PUBLIC_HOLIDAYS: Holiday[] = [
  { date: '2026-01-01', name: 'New Year\'s Day' },
  { date: '2026-01-26', name: 'Republic Day' },
  { date: '2026-03-24', name: 'Holi' },
  { date: '2026-04-03', name: 'Good Friday' },
  { date: '2026-05-01', name: 'Labor Day' },
  { date: '2026-05-15', name: 'Official Holiday' }, // As per user request example
  { date: '2026-08-15', name: 'Independence Day' },
  { date: '2026-10-02', name: 'Gandhi Jayanti' },
  { date: '2026-10-21', name: 'Dussehra' },
  { date: '2026-11-01', name: 'Diwali' },
  { date: '2026-12-25', name: 'Christmas Day' },
];

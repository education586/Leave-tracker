import { Holiday } from '../types';
import { format } from 'date-fns';

const DEFAULT_API_KEY = import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY;
const DEFAULT_CALENDAR_ID = import.meta.env.VITE_GOOGLE_CALENDAR_ID || 'en.indian#holiday@group.v.calendar.google.com';

export async function fetchGoogleHolidays(
  year: number,
  apiKey: string = DEFAULT_API_KEY,
  calendarId: string = DEFAULT_CALENDAR_ID
): Promise<Holiday[]> {
  if (!apiKey) {
    console.warn('Google Calendar API Key is not set.');
    return [];
  }

  const timeMin = `${year}-01-01T00:00:00Z`;
  const timeMax = `${year}-12-31T23:59:59Z`;
  
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?key=${apiKey}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Google Calendar API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return data.items.map((item: any) => ({
      date: item.start.date || format(new Date(item.start.dateTime), 'yyyy-MM-dd'),
      name: item.summary,
    }));
  } catch (error) {
    console.error('Failed to fetch holidays from Google Calendar:', error);
    return [];
  }
}

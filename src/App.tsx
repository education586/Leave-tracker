import React, { useState, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { UserSettings, LeaveRequest, UserProfile, Holiday } from './types';
import { Dashboard } from './components/Dashboard';
import { SettingsForm } from './components/SettingsForm';
import { LeaveForm } from './components/LeaveForm';
import { ProfileForm } from './components/ProfileForm';
import { Login } from './components/Login';
import { Documents } from './components/Documents';
import { AdminBoard } from './components/AdminBoard';
import { fetchGoogleHolidays } from './services/holidayService';
import { PUBLIC_HOLIDAYS } from './constants';
import { CalendarRange, Settings as SettingsIcon, History, LayoutDashboard, Star, User, BookOpen, Megaphone, Archive, LogOut, FileText, ChevronLeft, ChevronDown, Clock, HelpCircle, AlignLeft, Shield } from 'lucide-react';
import { cn } from './lib/utils';

type Tab = 'dashboard' | 'settings' | 'profile' | 'documents' | 'admin';

const defaultProfile: UserProfile = {
  name: "Deepanshu Gupta",
  role: "Website Designer",
  avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026024d"
};

const defaultSettings: UserSettings = {
  annualLeaveAllowance: 15,
  sickLeaveAllowance: 12,
  carriedOverAnnualLeave: 4.5,
  accrualStartDate: `${new Date().getFullYear()}-01-01`,
  accruedMonthly: true,
  annualManualBalance: 3.88,
  annualManualBalanceAsOf: `2026-06-15`,
  sickManualBalance: 4,
  sickManualBalanceAsOf: `2026-06-01`,
  isAdmin: false,
  googleCalendarId: 'e4ec650a7f6eeb4fa676c227b501b0dbff47d84adac683b161f7ccb3aee5e78f@group.calendar.google.com',
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage('is_authenticated', false);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [holidays, setHolidays] = useState<Holiday[]>(PUBLIC_HOLIDAYS);

  const [profile, setProfile] = useLocalStorage<UserProfile>('user_profile_v1', defaultProfile);
  const [settings, setSettings] = useLocalStorage<UserSettings>('leave_settings_v9', defaultSettings);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadHolidays = async () => {
      const googleHolidays = await fetchGoogleHolidays(
        new Date().getFullYear(),
        settings.googleApiKey,
        settings.googleCalendarId
      );
      if (googleHolidays.length > 0) {
        setHolidays(googleHolidays);
      } else {
        setHolidays(PUBLIC_HOLIDAYS);
      }
    };
    loadHolidays();
  }, [settings.googleApiKey, settings.googleCalendarId]);
  const [requests, setRequests] = useLocalStorage<LeaveRequest[]>('leave_requests', [
    {
      id: 'historic-annual-1',
      type: 'annual',
      startDate: '2026-03-10',
      endDate: '2026-03-10',
      workingDays: 3,
      reason: 'Vacation',
      status: 'approved',
      createdAt: '2026-03-10T09:00:00Z'
    },
    {
      id: 'historic-annual-2',
      type: 'annual',
      startDate: '2026-05-20',
      endDate: '2026-05-20',
      workingDays: 3.87,
      reason: 'Personal time',
      status: 'approved',
      createdAt: '2026-05-20T09:00:00Z'
    },
    {
      id: 'initial-sick-leave',
      type: 'sick',
      startDate: '2026-01-15',
      endDate: '2026-01-15',
      workingDays: 1,
      reason: 'Personal illness',
      status: 'approved',
      createdAt: '2026-01-15T09:00:00Z'
    },
    {
      id: 'historic-unpaid-1',
      type: 'unpaid',
      startDate: '2026-04-01',
      endDate: '2026-04-05',
      workingDays: 5,
      reason: 'Personal matters',
      status: 'approved',
      createdAt: '2026-04-01T09:00:00Z'
    }
  ]);


  const handleAddRequest = (req: LeaveRequest) => {
    setRequests([...requests, req]);
  };

  const handleDeleteRequest = (id: string) => {
    setRequests(requests.filter(r => r.id !== id));
  };

  const handleUpdateRequest = (id: string, status: 'approved' | 'pending' | 'rejected') => {
    setRequests(requests.map(r => r.id === id ? { ...r, status } : r));
  };

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#f4f7f9] font-sans flex flex-col text-slate-900">
      {/* Top Navbar */}
      <header className="h-14 bg-white px-6 flex items-center justify-between shrink-0 shadow-sm z-20">
        <div className="flex items-center gap-2">
          { /* Logo mock */ }
          <div className="flex items-center gap-1 font-bold text-xl text-[#0e2a47]">
            <div className="relative flex items-center justify-center w-10 h-10">
              <div className="absolute inset-0 border-[3px] border-yellow-400 rounded-full border-l-transparent -rotate-45"></div>
              <div className="absolute inset-0 border-[3px] border-[#0e2a47] rounded-full border-r-transparent rotate-45 scale-75"></div>
            </div>
            <div className="flex flex-col ml-1">
              <span className="text-xs leading-tight font-black uppercase text-[#0e2a47]">Leave Balance</span>
              <span className="text-[10px] leading-tight font-medium uppercase text-gray-500 tracking-widest">Tracker</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm font-bold text-[#0e2a47]">
          <div className="flex items-center gap-1.5 text-slate-800 bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-200">
             <Clock className="w-4 h-4" />
             <span className="text-sm font-bold" suppressHydrationWarning>
               {currentTime.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour12: false })}{' '}
               IST
             </span>
          </div>
          <span className="px-2.5 py-1 text-sm bg-blue-50 text-blue-700 rounded-md font-bold">Staff</span>
          <span className="font-bold px-2 text-base">{profile.name}</span>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Expanded/Collapsed Sidebar */}
        <aside className={cn("shrink-0 bg-white border-r border-[#e2e8f0] flex flex-col py-6 z-10 hidden sm:flex transition-all duration-300", isSidebarOpen ? "w-64" : "w-[88px]")}>
          {/* Profile Section */}
          <div className={cn("flex flex-col items-center mb-8 px-6 text-center transition-all duration-300", isSidebarOpen ? "opacity-100" : "opacity-100 px-2")}>
            <div className="relative mb-3">
              <img src={profile.avatarUrl} alt="Profile" className={cn("rounded-full object-cover transition-all duration-300", isSidebarOpen ? "w-[88px] h-[88px]" : "w-12 h-12")} />
              <div className={cn("absolute bg-green-500 border-[3px] border-white rounded-full transition-all duration-300", isSidebarOpen ? "bottom-1 right-0 w-5 h-5" : "bottom-0 right-0 w-3.5 h-3.5 border-2")}></div>
            </div>
            {isSidebarOpen && (
              <div className="animate-in fade-in duration-300">
                <h3 className="font-bold text-[#0e4b85] text-lg mb-0.5 whitespace-nowrap">{profile.name}</h3>
                <p className="text-[#0e4b85] text-sm font-medium opacity-80">{profile.role}</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex flex-col w-full flex-1">
             <button
               title="Dashboard"
               onClick={() => setActiveTab('dashboard')} 
               className={cn("flex items-center w-full px-6 py-3 transition-colors", activeTab === 'dashboard' ? "bg-[#e5e7eb] text-[#0a386b]" : "text-[#0a386b] hover:bg-slate-50", !isSidebarOpen && "justify-center px-0")}
             >
               <Star className={cn("w-5 h-5 shrink-0 transition-all", isSidebarOpen ? "mr-3" : "mr-0")} strokeWidth={1.5} />
               {isSidebarOpen && <span className="text-base font-medium flex-1 text-left">Dashboard</span>}
               {isSidebarOpen && (activeTab === 'dashboard' ? <ChevronDown className="w-4 h-4 shrink-0" strokeWidth={1.5} /> : <ChevronLeft className="w-4 h-4 shrink-0" strokeWidth={1.5} />)}
             </button>
             <button 
               title="Profile" 
               onClick={() => setActiveTab('profile')}
               className={cn("flex items-center w-full px-6 py-3 transition-colors", activeTab === 'profile' ? "bg-[#e5e7eb] text-[#0a386b]" : "text-[#0a386b] hover:bg-slate-50", !isSidebarOpen && "justify-center px-0")}
             >
               <User className={cn("w-5 h-5 shrink-0 transition-all", isSidebarOpen ? "mr-3" : "mr-0")} strokeWidth={1.5} />
               {isSidebarOpen && <span className="text-base font-medium flex-1 text-left">Profile</span>}
               {isSidebarOpen && (activeTab === 'profile' ? <ChevronDown className="w-4 h-4 shrink-0" strokeWidth={1.5} /> : <ChevronLeft className="w-4 h-4 shrink-0" strokeWidth={1.5} />)}
             </button>
             <button 
               title="Leave"
               onClick={() => setActiveTab('settings')} 
               className={cn("flex items-center w-full px-6 py-3 transition-colors", activeTab === 'settings' ? "bg-[#e5e7eb] text-[#0a386b]" : "text-[#0a386b] hover:bg-slate-50", !isSidebarOpen && "justify-center px-0")}
             >
               <CalendarRange className={cn("w-5 h-5 shrink-0 transition-all", isSidebarOpen ? "mr-3" : "mr-0")} strokeWidth={1.5} />
               {isSidebarOpen && <span className="text-base font-medium flex-1 text-left">Leave</span>}
               {isSidebarOpen && (activeTab === 'settings' ? <ChevronDown className="w-4 h-4 shrink-0" strokeWidth={1.5} /> : <ChevronLeft className="w-4 h-4 shrink-0" strokeWidth={1.5} />)}
             </button>
             <button 
               title="Documents" 
               onClick={() => setActiveTab('documents')}
               className={cn("flex items-center w-full px-6 py-3 transition-colors", activeTab === 'documents' ? "bg-[#e5e7eb] text-[#0a386b]" : "text-[#0a386b] hover:bg-slate-50", !isSidebarOpen && "justify-center px-0")}
             >
               <FileText className={cn("w-5 h-5 shrink-0 transition-all", isSidebarOpen ? "mr-3" : "mr-0")} strokeWidth={1.5} />
               {isSidebarOpen && <span className="text-base font-medium flex-1 text-left">Documents</span>}
               {isSidebarOpen && (activeTab === 'documents' ? <ChevronDown className="w-4 h-4 shrink-0" strokeWidth={1.5} /> : <ChevronLeft className="w-4 h-4 shrink-0" strokeWidth={1.5} />)}
             </button>
             {settings.isAdmin && (
               <button 
                 title="Admin" 
                 onClick={() => setActiveTab('admin')}
                 className={cn("flex items-center w-full px-6 py-3 transition-colors", activeTab === 'admin' ? "bg-[#e5e7eb] text-[#0a386b]" : "text-[#0a386b] hover:bg-slate-50", !isSidebarOpen && "justify-center px-0")}
               >
                 <Shield className={cn("w-5 h-5 shrink-0 transition-all text-indigo-600", isSidebarOpen ? "mr-3" : "mr-0")} strokeWidth={1.5} />
                 {isSidebarOpen && <span className="text-base font-medium flex-1 text-left">Admin</span>}
                 {isSidebarOpen && (activeTab === 'admin' ? <ChevronDown className="w-4 h-4 shrink-0" strokeWidth={1.5} /> : <ChevronLeft className="w-4 h-4 shrink-0" strokeWidth={1.5} />)}
               </button>
             )}
             <button title="Announcement" className={cn("flex items-center w-full px-6 py-3 transition-colors text-[#0a386b] hover:bg-slate-50", !isSidebarOpen && "justify-center px-0")}>
               <Megaphone className={cn("w-5 h-5 shrink-0 transition-all", isSidebarOpen ? "mr-3" : "mr-0")} strokeWidth={1.5} />
               {isSidebarOpen && <span className="text-base font-medium flex-1 text-left">Announcement</span>}
               {isSidebarOpen && <ChevronLeft className="w-4 h-4 shrink-0" strokeWidth={1.5} />}
             </button>
          </nav>

          <div className="mt-auto border-t border-slate-100 pt-2 pb-6">
             <button 
               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
               title={isSidebarOpen ? "Collapse menu" : "Expand menu"}
               className={cn("flex items-center w-full px-6 py-3 transition-colors text-[#0a386b] hover:bg-slate-50", !isSidebarOpen && "justify-center px-0")}
             >
               <AlignLeft className={cn("w-5 h-5 shrink-0 transition-all text-[#0a386b]", isSidebarOpen ? "mr-3" : "mr-0")} strokeWidth={1.5} />
               {isSidebarOpen && <span className="text-base font-medium flex-1 text-left">Collapse menu</span>}
             </button>
             <button 
               onClick={() => setIsAuthenticated(false)}
               title="Logout"
               className={cn("flex items-center w-full px-6 py-3 transition-colors text-red-600 hover:bg-red-50 mt-1", !isSidebarOpen && "justify-center px-0")}
             >
               <LogOut className={cn("w-5 h-5 shrink-0 transition-all", isSidebarOpen ? "mr-3" : "mr-0")} strokeWidth={1.5} />
               {isSidebarOpen && <span className="text-base font-medium flex-1 text-left">Log out</span>}
             </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {activeTab === 'dashboard' && (
            <div className="animate-in fade-in duration-300">
              <Dashboard 
                requests={requests} 
                settings={settings} 
                holidays={holidays}
                onOpenForm={() => setIsFormOpen(true)}
                onDeleteRequest={handleDeleteRequest}
                onUpdateRequest={handleUpdateRequest}
              />
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-4xl animate-in fade-in duration-300">
              <ProfileForm profile={profile} onSave={setProfile} />
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-4xl animate-in fade-in duration-300">
              <SettingsForm settings={settings} onSave={setSettings} />
            </div>
          )}

          {activeTab === 'admin' && settings.isAdmin && (
            <div className="animate-in fade-in duration-300">
              <AdminBoard 
                requests={requests} 
                onUpdateRequest={handleUpdateRequest}
              />
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      {isFormOpen && (
        <LeaveForm
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleAddRequest}
          holidays={holidays}
        />
      )}
    </div>
  );
}


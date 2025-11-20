import React, { useState, useEffect } from 'react';
import { CalendarCheck, Sparkles, Download, Printer, Trash2 } from 'lucide-react';
import DataManagement from './components/DataManagement';
import RosterView from './components/RosterView';
import { generateRosterWithAI } from './services/geminiService';
import { Starter, Mentor, Module, ScheduleItem } from './types';

// Default Data for Demo Purposes
const INITIAL_STARTERS: Starter[] = [
  { id: '1', name: 'John Doe', role: 'Researcher' },
  { id: '2', name: 'Sarah Connor', role: 'Lab Tech' }
];

const INITIAL_MENTORS: Mentor[] = [
  { id: '1', name: 'Dr. Emily White', expertise: ['Safety', 'Chemistry'] },
  { id: '2', name: 'Prof. Alan Grant', expertise: ['Paleontology', 'Field Work'] },
  { id: '3', name: 'Tech Lead Mike', expertise: ['IT', 'Systems'] }
];

const INITIAL_MODULES: Module[] = [
  { id: '1', name: 'Lab Safety Induction', duration: '1 hour', requiredExpertise: 'Safety' },
  { id: '2', name: 'IT Systems Setup', duration: '2 hours', requiredExpertise: 'IT' },
  { id: '3', name: 'Research Ethics', duration: '1 hour' },
  { id: '4', name: 'Equipment Handling', duration: 'Half Day' }
];

// Hook for persistent state
function usePersistentState<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Error writing localStorage key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState];
}

function App() {
  const [starters, setStarters] = usePersistentState<Starter[]>('roster_starters', INITIAL_STARTERS);
  const [mentors, setMentors] = usePersistentState<Mentor[]>('roster_mentors', INITIAL_MENTORS);
  const [modules, setModules] = usePersistentState<Module[]>('roster_modules', INITIAL_MODULES);
  const [schedule, setSchedule] = usePersistentState<ScheduleItem[]>('roster_schedule', []);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const result = await generateRosterWithAI({
        starters,
        mentors,
        modules,
        startDate
      });
      setSchedule(result);
    } catch (err) {
      console.error(err);
      setError("Failed to generate roster. Please check API key and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Export simple CSV
  const handleExport = () => {
    if (schedule.length === 0) return;
    const headers = ["Day", "Time", "Trainee", "Mentor", "Module", "Location"];
    const rows = schedule.map(s => [
      s.day, s.time, s.starterName, s.mentorName, s.moduleName, s.location || ''
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "training_roster.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleResetData = () => {
    if(window.confirm("Are you sure you want to reset all data to defaults? This cannot be undone.")) {
      setStarters(INITIAL_STARTERS);
      setMentors(INITIAL_MENTORS);
      setModules(INITIAL_MODULES);
      setSchedule([]);
      localStorage.clear();
    }
  }

  const handleUpdateScheduleItem = (id: string, updatedFields: Partial<ScheduleItem>) => {
    setSchedule(prev => prev.map(item => item.id === id ? { ...item, ...updatedFields } : item));
  };

  const handleDeleteScheduleItem = (id: string) => {
    if(window.confirm("Remove this session from the schedule?")) {
      setSchedule(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans print-full-width">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <CalendarCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">GenAI Roster</h1>
              <p className="text-xs text-slate-500">Training Coordinator Assistant</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-slate-600">
               <span>Start Date:</span>
               <input 
                 type="date" 
                 className="border border-slate-300 rounded px-2 py-1 text-sm"
                 value={startDate}
                 onChange={(e) => setStartDate(e.target.value)}
               />
            </div>
            <button onClick={handleResetData} className="text-xs text-red-400 hover:text-red-600 hover:underline">
              Reset App
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print-full-width">
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm no-print">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-140px)] print-full-width">
          
          {/* Left Column: Inputs */}
          <div className="lg:col-span-5 h-full flex flex-col gap-4 no-print">
            <div className="bg-blue-600 text-white p-6 rounded-xl shadow-lg flex flex-col gap-4">
              <div>
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                  AI Scheduler
                </h2>
                <p className="text-blue-100 text-sm mt-1">
                  Configure your team and modules below, then let Gemini create the perfect schedule.
                </p>
              </div>
              <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className={`w-full py-3 px-4 rounded-lg font-semibold shadow-sm transition-all flex items-center justify-center gap-2
                  ${isGenerating 
                    ? 'bg-blue-700 text-blue-200 cursor-not-allowed' 
                    : 'bg-white text-blue-600 hover:bg-blue-50 hover:shadow-md'
                  }`}
              >
                {isGenerating ? (
                  <>Thinking...</>
                ) : (
                  <>Generate Roster</>
                )}
              </button>
            </div>

            <DataManagement 
              starters={starters} setStarters={setStarters}
              mentors={mentors} setMentors={setMentors}
              modules={modules} setModules={setModules}
            />
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-7 h-full flex flex-col print-full-width">
             <div className="flex justify-end mb-4 gap-2 no-print">
                <button 
                  onClick={handlePrint}
                  disabled={schedule.length === 0}
                  className="text-sm bg-white border border-slate-300 px-3 py-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center gap-2 disabled:opacity-50 shadow-sm transition-colors"
                >
                  <Printer className="w-4 h-4" /> Print
                </button>
                <button 
                  onClick={handleExport}
                  disabled={schedule.length === 0}
                  className="text-sm bg-white border border-slate-300 px-3 py-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center gap-2 disabled:opacity-50 shadow-sm transition-colors"
                >
                  <Download className="w-4 h-4" /> Export CSV
                </button>
             </div>
             <RosterView 
               schedule={schedule} 
               loading={isGenerating} 
               onUpdateItem={handleUpdateScheduleItem}
               onDeleteItem={handleDeleteScheduleItem}
             />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
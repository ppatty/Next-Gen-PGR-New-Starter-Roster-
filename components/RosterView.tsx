import React, { useState, useMemo } from 'react';
import { Calendar, Clock, MapPin, User, Users, Filter, X } from 'lucide-react';
import { ScheduleItem } from '../types';

interface RosterViewProps {
  schedule: ScheduleItem[];
  loading: boolean;
}

const RosterView: React.FC<RosterViewProps> = ({ schedule, loading }) => {
  const [filterType, setFilterType] = useState<'all' | 'starter' | 'mentor'>('all');
  const [filterValue, setFilterValue] = useState<string>('');

  // Extract unique values for filters
  const uniqueStarters = useMemo(() => Array.from(new Set(schedule.map(s => s.starterName))).sort(), [schedule]);
  const uniqueMentors = useMemo(() => Array.from(new Set(schedule.map(s => s.mentorName))).sort(), [schedule]);

  const filteredSchedule = useMemo(() => {
    if (filterType === 'all') return schedule;
    if (filterType === 'starter') return schedule.filter(s => s.starterName === filterValue);
    if (filterType === 'mentor') return schedule.filter(s => s.mentorName === filterValue);
    return schedule;
  }, [schedule, filterType, filterValue]);
  
  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 text-center">
        <div className="relative w-20 h-20 mb-6">
          <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          <SparklesIcon className="absolute inset-0 m-auto text-yellow-400 w-6 h-6 animate-pulse" />
        </div>
        <h3 className="text-xl font-semibold text-slate-800">Generating Optimal Roster...</h3>
        <p className="text-slate-500 mt-2 max-w-xs mx-auto">
          Analyzing constraints, checking mentor availability, and optimizing for efficiency.
        </p>
      </div>
    );
  }

  if (schedule.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
          <Calendar className="w-12 h-12 text-slate-300" />
        </div>
        <h3 className="text-lg font-medium text-slate-600">No Schedule Generated</h3>
        <p className="text-slate-400 mt-2 max-w-xs mx-auto">
          Add your team members and modules on the left, then click "Generate Roster" to start planning.
        </p>
      </div>
    );
  }

  // Group by day for better display
  // Explicitly type as string[] to avoid TS inference issues
  const days: string[] = Array.from(new Set(filteredSchedule.map(item => item.day)));
  
  // Sort days (naive sort for Monday-Friday)
  const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  days.sort((a, b) => {
    const indexA = dayOrder.indexOf(a);
    const indexB = dayOrder.indexOf(b);
    // If day not in list (e.g. typo), put at end
    return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
  });

  const resetFilter = () => {
    setFilterType('all');
    setFilterValue('');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full overflow-hidden flex flex-col">
      {/* Header & Filters */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="font-semibold text-slate-800 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          Schedule
          <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full ml-2">
            {filteredSchedule.length} Sessions
          </span>
        </h2>

        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
            <Filter className="w-4 h-4 text-slate-400 ml-2 mr-2" />
            <select 
              className="bg-transparent border-none outline-none text-slate-600 py-1 pr-2"
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value as any);
                setFilterValue(''); // Reset value when type changes
              }}
            >
              <option value="all">All View</option>
              <option value="starter">By Trainee</option>
              <option value="mentor">By Mentor</option>
            </select>
            
            {filterType !== 'all' && (
              <select 
                className="bg-slate-50 border-l border-slate-200 ml-2 py-1 px-2 outline-none text-slate-700 font-medium min-w-[120px]"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
              >
                <option value="">Select...</option>
                {filterType === 'starter' && uniqueStarters.map(s => <option key={s} value={s}>{s}</option>)}
                {filterType === 'mentor' && uniqueMentors.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            )}
          </div>
          
          {(filterType !== 'all' && filterValue) && (
             <button onClick={resetFilter} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
               <X className="w-4 h-4" />
             </button>
          )}
        </div>
      </div>
      
      <div className="overflow-y-auto p-4 space-y-8 bg-slate-50/30">
        {days.length === 0 && (
           <div className="text-center py-8 text-slate-400 italic">
             No sessions found for this filter.
           </div>
        )}

        {days.map(day => (
          <div key={day} className="relative">
            <div className="flex items-center mb-4 sticky top-0 bg-white/95 backdrop-blur-sm z-10 py-2 border-b border-slate-100">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                {day}
              </h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pl-5 border-l-2 border-slate-100">
              {filteredSchedule
                .filter(item => item.day === day)
                .sort((a, b) => a.time.localeCompare(b.time)) // Sort by time within day
                .map(item => (
                  <div key={item.id} className="group bg-white border border-slate-200 p-4 rounded-lg hover:shadow-md hover:border-blue-400 transition-all duration-200">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-600 mb-1">
                          <Clock className="w-3 h-3 mr-1.5" />
                          {item.time}
                        </span>
                        <h4 className="font-semibold text-slate-800 text-base leading-tight mt-1">{item.moduleName}</h4>
                      </div>
                      {item.location && (
                        <div className="flex items-center text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                           <MapPin className="w-3 h-3 mr-1" />
                           {item.location}
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-50 mt-2">
                      <div className="flex items-center gap-2 p-1.5 rounded-md bg-blue-50/50 border border-blue-50">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <User className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-[10px] uppercase tracking-wider text-blue-400 font-semibold">Trainee</p>
                          <p className="text-sm font-medium text-slate-700 truncate" title={item.starterName}>{item.starterName}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 p-1.5 rounded-md bg-purple-50/50 border border-purple-50">
                        <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <Users className="w-3.5 h-3.5 text-purple-600" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-[10px] uppercase tracking-wider text-purple-400 font-semibold">Mentor</p>
                          <p className="text-sm font-medium text-slate-700 truncate" title={item.mentorName}>{item.mentorName}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper icon for loading state
const SparklesIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5zM9 15a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0v-1.5h-1.5a.75.75 0 010-1.5h1.5v-1.5A.75.75 0 019 15z" clipRule="evenodd" />
  </svg>
);

export default RosterView;
import React from 'react';
import { Calendar, Clock, MapPin, User, Users } from 'lucide-react';
import { ScheduleItem } from '../types';

interface RosterViewProps {
  schedule: ScheduleItem[];
  loading: boolean;
}

const RosterView: React.FC<RosterViewProps> = ({ schedule, loading }) => {
  
  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 text-center">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <h3 className="text-xl font-semibold text-slate-800">Generating Roster...</h3>
        <p className="text-slate-500 mt-2">Consulting with Gemini 2.5 Flash to find the optimal schedule.</p>
        <div className="mt-8 max-w-md text-xs text-slate-400">
          <p>Optimizing for:</p>
          <ul className="list-disc list-inside mt-1">
            <li>Mentor expertise matching</li>
            <li>Conflict avoidance</li>
            <li>Workload balancing</li>
          </ul>
        </div>
      </div>
    );
  }

  if (schedule.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200 rounded-xl">
        <Calendar className="w-16 h-16 text-slate-200 mb-4" />
        <h3 className="text-lg font-medium text-slate-600">No Schedule Generated</h3>
        <p className="text-slate-400 mt-2">Add your starters, mentors, and modules, then click "Generate Roster".</p>
      </div>
    );
  }

  // Group by day for better display
  const days: string[] = Array.from(new Set(schedule.map(item => item.day)));
  
  // Sort days (naive sort for Monday-Friday, ideally use date objects)
  const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  days.sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full overflow-hidden flex flex-col">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
        <h2 className="font-semibold text-slate-800 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          Generated Schedule
        </h2>
        <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
          {schedule.length} Sessions
        </span>
      </div>
      
      <div className="overflow-y-auto p-4 space-y-6">
        {days.map(day => (
          <div key={day}>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 sticky top-0 bg-white z-10 py-2 border-b border-slate-100">
              {day}
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {schedule
                .filter(item => item.day === day)
                .map(item => (
                  <div key={item.id} className="group bg-white border border-slate-200 p-4 rounded-lg hover:shadow-md hover:border-blue-300 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-slate-800">{item.moduleName}</h4>
                      <div className="flex items-center text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        <Clock className="w-3 h-3 mr-1" />
                        {item.time}
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center text-slate-600">
                        <User className="w-4 h-4 mr-2 text-blue-500" />
                        <span className="font-medium mr-1">Trainee:</span> {item.starterName}
                      </div>
                      <div className="flex items-center text-slate-600">
                        <Users className="w-4 h-4 mr-2 text-purple-500" />
                        <span className="font-medium mr-1">Mentor:</span> {item.mentorName}
                      </div>
                      {item.location && (
                        <div className="flex items-center text-slate-500 text-xs mt-2 pt-2 border-t border-slate-100">
                          <MapPin className="w-3 h-3 mr-2" />
                          {item.location}
                        </div>
                      )}
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

export default RosterView;
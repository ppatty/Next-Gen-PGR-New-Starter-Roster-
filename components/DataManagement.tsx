import React, { useState } from 'react';
import { Plus, Trash2, User, GraduationCap, BookOpen, RotateCcw } from 'lucide-react';
import { Starter, Mentor, Module } from '../types';

interface DataManagementProps {
  starters: Starter[];
  setStarters: React.Dispatch<React.SetStateAction<Starter[]>>;
  mentors: Mentor[];
  setMentors: React.Dispatch<React.SetStateAction<Mentor[]>>;
  modules: Module[];
  setModules: React.Dispatch<React.SetStateAction<Module[]>>;
}

const DataManagement: React.FC<DataManagementProps> = ({
  starters, setStarters,
  mentors, setMentors,
  modules, setModules
}) => {
  const [activeTab, setActiveTab] = useState<'starters' | 'mentors' | 'modules'>('starters');
  
  // Temporary input states
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newExpertise, setNewExpertise] = useState('');
  const [newDuration, setNewDuration] = useState('1 hour');

  const addStarter = () => {
    if (!newName) return;
    setStarters([...starters, { id: crypto.randomUUID(), name: newName, role: newRole || 'Trainee' }]);
    setNewName('');
    setNewRole('');
  };

  const addMentor = () => {
    if (!newName) return;
    setMentors([...mentors, { 
      id: crypto.randomUUID(), 
      name: newName, 
      expertise: newExpertise ? newExpertise.split(',').map(s => s.trim()) : [] 
    }]);
    setNewName('');
    setNewExpertise('');
  };

  const addModule = () => {
    if (!newName) return;
    setModules([...modules, { 
      id: crypto.randomUUID(), 
      name: newName, 
      duration: newDuration,
      requiredExpertise: newExpertise 
    }]);
    setNewName('');
    setNewExpertise('');
  };

  const deleteItem = <T extends { id: string }>(id: string, list: T[], setList: React.Dispatch<React.SetStateAction<T[]>>) => {
    setList(list.filter(item => item.id !== id));
  };

  const clearAll = () => {
    if (activeTab === 'starters') setStarters([]);
    if (activeTab === 'mentors') setMentors([]);
    if (activeTab === 'modules') setModules([]);
  };

  const renderClearButton = (count: number) => (
    count > 0 && (
      <button 
        onClick={clearAll}
        className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50 transition-colors"
      >
        <RotateCcw className="w-3 h-3" /> Clear List
      </button>
    )
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
      <div className="flex border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('starters')}
          className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'starters' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <User className="w-4 h-4" /> Starters ({starters.length})
        </button>
        <button 
          onClick={() => setActiveTab('mentors')}
          className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'mentors' ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <GraduationCap className="w-4 h-4" /> Mentors ({mentors.length})
        </button>
        <button 
          onClick={() => setActiveTab('modules')}
          className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'modules' ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <BookOpen className="w-4 h-4" /> Modules ({modules.length})
        </button>
      </div>

      <div className="p-6 flex-1 overflow-y-auto bg-slate-50/30">
        {/* STARTERS INPUT */}
        {activeTab === 'starters' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Add New Trainee</div>
              <div className="flex flex-col gap-3">
                <input 
                  type="text" 
                  placeholder="Full Name (e.g. Alice Smith)" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Role (e.g. Lab Tech)" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addStarter()}
                  />
                  <button 
                    onClick={addStarter} 
                    disabled={!newName}
                    className="px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 mt-4">
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase">Current List</span>
                {renderClearButton(starters.length)}
              </div>
              {starters.map(s => (
                <div key={s.id} className="group flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 shadow-sm hover:border-blue-300 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 text-sm">{s.name}</p>
                      <p className="text-xs text-slate-500">{s.role}</p>
                    </div>
                  </div>
                  <button onClick={() => deleteItem(s.id, starters, setStarters)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {starters.length === 0 && (
                <div className="text-center text-slate-400 text-sm py-8 border-2 border-dashed border-slate-200 rounded-lg">
                  No trainees added yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* MENTORS INPUT */}
        {activeTab === 'mentors' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Add New Mentor</div>
              <div className="flex flex-col gap-3">
                <input 
                  type="text" 
                  placeholder="Name (e.g. Dr. Bob)" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Expertise (comma separated)" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                    value={newExpertise}
                    onChange={(e) => setNewExpertise(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addMentor()}
                  />
                  <button 
                    onClick={addMentor} 
                    disabled={!newName}
                    className="px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 mt-4">
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase">Current List</span>
                {renderClearButton(mentors.length)}
              </div>
              {mentors.map(m => (
                <div key={m.id} className="group flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 shadow-sm hover:border-purple-300 transition-all">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs">
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 text-sm">{m.name}</p>
                      <p className="text-xs text-slate-500">
                        {m.expertise.length > 0 ? (
                          <span className="bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wide">
                            {m.expertise[0]} {m.expertise.length > 1 && `+${m.expertise.length - 1}`}
                          </span>
                        ) : 'General'}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => deleteItem(m.id, mentors, setMentors)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {mentors.length === 0 && (
                <div className="text-center text-slate-400 text-sm py-8 border-2 border-dashed border-slate-200 rounded-lg">
                  No mentors added yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODULES INPUT */}
        {activeTab === 'modules' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
               <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Add New Module</div>
               <div className="flex flex-col gap-3">
                  <input 
                    type="text" 
                    placeholder="Module Name" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="text" 
                      placeholder="Req. Expertise" 
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                      value={newExpertise}
                      onChange={(e) => setNewExpertise(e.target.value)}
                    />
                     <select 
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-sm text-slate-600"
                      value={newDuration}
                      onChange={(e) => setNewDuration(e.target.value)}
                    >
                        <option value="1 hour">1 Hour</option>
                        <option value="2 hours">2 Hours</option>
                        <option value="Half Day">Half Day</option>
                        <option value="Full Day">Full Day</option>
                    </select>
                  </div>
                  <button onClick={addModule} disabled={!newName} className="w-full py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                    <Plus className="w-4 h-4" /> Add Module
                  </button>
               </div>
            </div>
            
            <div className="space-y-2 mt-4">
               <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase">Current List</span>
                {renderClearButton(modules.length)}
              </div>
              {modules.map(m => (
                <div key={m.id} className="group flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 shadow-sm hover:border-emerald-300 transition-all">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 text-sm">{m.name}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <span className="font-medium">{m.duration}</span>
                        {m.requiredExpertise && (
                           <>• <span className="text-emerald-600">{m.requiredExpertise}</span></>
                        )}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => deleteItem(m.id, modules, setModules)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {modules.length === 0 && (
                <div className="text-center text-slate-400 text-sm py-8 border-2 border-dashed border-slate-200 rounded-lg">
                  No training modules defined.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataManagement;
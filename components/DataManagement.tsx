import React, { useState } from 'react';
import { Plus, Trash2, User, GraduationCap, BookOpen } from 'lucide-react';
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
      <div className="flex border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('starters')}
          className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'starters' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <User className="w-4 h-4" /> Starters ({starters.length})
        </button>
        <button 
          onClick={() => setActiveTab('mentors')}
          className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'mentors' ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <GraduationCap className="w-4 h-4" /> Mentors ({mentors.length})
        </button>
        <button 
          onClick={() => setActiveTab('modules')}
          className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'modules' ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <BookOpen className="w-4 h-4" /> Modules ({modules.length})
        </button>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        {/* STARTERS INPUT */}
        {activeTab === 'starters' && (
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-5">
                <input 
                  type="text" 
                  placeholder="Name (e.g. Alice Smith)" 
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div className="col-span-5">
                <input 
                  type="text" 
                  placeholder="Role (e.g. Lab Tech)" 
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <button onClick={addStarter} className="w-full h-full flex items-center justify-center bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2 mt-4">
              {starters.map(s => (
                <div key={s.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div>
                    <p className="font-medium text-slate-900">{s.name}</p>
                    <p className="text-xs text-slate-500">{s.role}</p>
                  </div>
                  <button onClick={() => deleteItem(s.id, starters, setStarters)} className="text-slate-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {starters.length === 0 && <p className="text-center text-slate-400 text-sm py-4">No new starters added yet.</p>}
            </div>
          </div>
        )}

        {/* MENTORS INPUT */}
        {activeTab === 'mentors' && (
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-5">
                <input 
                  type="text" 
                  placeholder="Name (e.g. Dr. Bob)" 
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div className="col-span-5">
                <input 
                  type="text" 
                  placeholder="Expertise (comma sep)" 
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                  value={newExpertise}
                  onChange={(e) => setNewExpertise(e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <button onClick={addMentor} className="w-full h-full flex items-center justify-center bg-purple-600 text-white rounded-md hover:bg-purple-700">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2 mt-4">
              {mentors.map(m => (
                <div key={m.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div>
                    <p className="font-medium text-slate-900">{m.name}</p>
                    <p className="text-xs text-slate-500">{m.expertise.join(', ') || 'General'}</p>
                  </div>
                  <button onClick={() => deleteItem(m.id, mentors, setMentors)} className="text-slate-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {mentors.length === 0 && <p className="text-center text-slate-400 text-sm py-4">No mentors added yet.</p>}
            </div>
          </div>
        )}

        {/* MODULES INPUT */}
        {activeTab === 'modules' && (
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <input 
                  type="text" 
                  placeholder="Module Name" 
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div className="col-span-3">
                <input 
                  type="text" 
                  placeholder="Req. Expertise" 
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={newExpertise}
                  onChange={(e) => setNewExpertise(e.target.value)}
                />
              </div>
              <div className="col-span-3">
                <select 
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                >
                    <option value="1 hour">1 Hour</option>
                    <option value="2 hours">2 Hours</option>
                    <option value="Half Day">Half Day</option>
                    <option value="Full Day">Full Day</option>
                </select>
              </div>
              <div className="col-span-2">
                <button onClick={addModule} className="w-full h-full flex items-center justify-center bg-emerald-600 text-white rounded-md hover:bg-emerald-700">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2 mt-4">
              {modules.map(m => (
                <div key={m.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div>
                    <p className="font-medium text-slate-900">{m.name}</p>
                    <p className="text-xs text-slate-500">{m.duration} • {m.requiredExpertise || 'Any Mentor'}</p>
                  </div>
                  <button onClick={() => deleteItem(m.id, modules, setModules)} className="text-slate-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {modules.length === 0 && <p className="text-center text-slate-400 text-sm py-4">No training modules defined.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataManagement;

import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import MembersView from './components/MembersView';
import CameraSetupView from './components/CameraSetupView';
import ReportsView from './components/ReportsView';
import AlertSettingsView from './components/AlertSettingsView';
import PostureModal from './components/PostureModal';

import { 
  SYSTEM_MODES, 
  INITIAL_CAMERAS, 
  INITIAL_MEMBERS, 
  RECENT_ALERTS 
} from './data/mockData';

import { 
  LayoutDashboard, 
  Users, 
  Camera, 
  BarChart3, 
  BellRing,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  const [mode, setMode] = useState(SYSTEM_MODES.ENTERPRISE);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [cameras, setCameras] = useState(INITIAL_CAMERAS);
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [alerts, setAlerts] = useState(RECENT_ALERTS);
  const [selectedMember, setSelectedMember] = useState(null);
  const [buzzerToast, setBuzzerToast] = useState(null);

  const handleAddMember = (newMem) => {
    setMembers(prev => [newMem, ...prev]);
  };

  const handleSelectAlert = (alert) => {
    const mem = members.find(m => m.id === alert.memberId) || members[0];
    setSelectedMember(mem);
  };

  const handleSendBuzzer = (member) => {
    setBuzzerToast(`Đã kích hoạt chuông và thông báo công thái học tới máy bàn của ${member.name}!`);
    setTimeout(() => setBuzzerToast(null), 3500);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      
      {/* Top Header */}
      <Header
        mode={mode}
        setMode={setMode}
        alerts={alerts}
        onSelectAlert={handleSelectAlert}
        onOpenQuickCam={() => setCurrentTab('cameras')}
      />

      {/* Buzzer Toast Banner */}
      {buzzerToast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 bg-white border border-emerald-500 rounded-2xl shadow-xl text-xs text-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-150">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span className="font-semibold text-slate-900">{buzzerToast}</span>
        </div>
      )}

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Desktop Sidebar */}
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          mode={mode}
          memberCount={members.length}
          cameraCount={cameras.length}
          alertCount={alerts.filter(a => !a.resolved).length}
        />

        {/* Content View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-20 md:pb-8 bg-[#f8fafc]">
          {currentTab === 'dashboard' && (
            <DashboardView
              mode={mode}
              members={members}
              cameras={cameras}
              alerts={alerts}
              onSelectMember={(mem) => setSelectedMember(mem)}
              onNavigateTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'members' && (
            <MembersView
              mode={mode}
              members={members}
              onSelectMember={(mem) => setSelectedMember(mem)}
              onAddMember={handleAddMember}
            />
          )}

          {currentTab === 'cameras' && (
            <CameraSetupView
              cameras={cameras}
              members={members}
              onUpdateCameras={setCameras}
            />
          )}

          {currentTab === 'reports' && (
            <ReportsView
              mode={mode}
              members={members}
            />
          )}

          {currentTab === 'alerts' && (
            <AlertSettingsView />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around z-40 text-[10px] shadow-sm">
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-lg ${
            currentTab === 'dashboard' ? 'text-emerald-600 font-bold' : 'text-slate-500'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Tổng quan</span>
        </button>

        <button
          onClick={() => setCurrentTab('members')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-lg ${
            currentTab === 'members' ? 'text-emerald-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{mode === SYSTEM_MODES.EDUCATION ? 'Học sinh' : 'Nhân sự'}</span>
        </button>

        <button
          onClick={() => setCurrentTab('cameras')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-lg ${
            currentTab === 'cameras' ? 'text-emerald-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Camera</span>
        </button>

        <button
          onClick={() => setCurrentTab('reports')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-lg ${
            currentTab === 'reports' ? 'text-emerald-600 font-bold' : 'text-slate-500'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Báo cáo</span>
        </button>

        <button
          onClick={() => setCurrentTab('alerts')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-lg ${
            currentTab === 'alerts' ? 'text-emerald-600 font-bold' : 'text-slate-500'
          }`}
        >
          <BellRing className="w-4 h-4" />
          <span>Cảnh báo</span>
        </button>
      </nav>

      {/* Posture Detail Modal */}
      {selectedMember && (
        <PostureModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
          onSendBuzzer={handleSendBuzzer}
        />
      )}

    </div>
  );
}

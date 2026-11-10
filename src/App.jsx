import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import MembersView from './components/MembersView';
import CameraSetupView from './components/CameraSetupView';
import ReportsView from './components/ReportsView';
import MultiCameraView from './components/MultiCameraView';
import PostureModal from './components/PostureModal';
import PersonalView from './components/PersonalView';
import ScreenRecordingsView from './components/ScreenRecordingsView';
import EmployeeRankingView from './components/EmployeeRankingView';
import AuthView from './components/AuthView';

import { 
  SYSTEM_MODES, 
  INITIAL_CAMERAS, 
  INITIAL_MEMBERS, 
  RECENT_ALERTS 
} from './data/mockData';

import { 
  LayoutDashboard, 
  LayoutGrid, 
  Users, 
  Camera, 
  BarChart3, 
  Trophy, 
  Monitor, 
  CheckCircle2, 
  User, 
  KeyRound,
  Calendar,
  Brain,
  Globe,
  Film
} from 'lucide-react';

export default function App() {
  const [mode, setMode] = useState(SYSTEM_MODES.ENTERPRISE);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [cameras, setCameras] = useState(INITIAL_CAMERAS);
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [alerts, setAlerts] = useState(RECENT_ALERTS);
  const [selectedMember, setSelectedMember] = useState(null);
  const [buzzerToast, setBuzzerToast] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Auth portal state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    name: 'Admin Giám Sát',
    email: 'admin.enterprise@company.com',
    role: SYSTEM_MODES.ENTERPRISE
  });

  // Switch mode helper
  const handleSwitchMode = (newMode) => {
    setMode(newMode);
    if (newMode === SYSTEM_MODES.PERSONAL) {
      setCurrentTab('personal_desk');
    } else {
      setCurrentTab('dashboard');
    }
  };

  // Keyboard shortcut Ctrl+B or Cmd+B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsSidebarCollapsed(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAddMember = (newMem) => {
    setMembers(prev => [newMem, ...prev]);
  };

  const handleUpdateCameras = (newCameras) => {
    // If a camera was added
    if (newCameras.length > cameras.length) {
      const addedCam = newCameras.find(c => !cameras.some(old => old.id === c.id));
      if (addedCam) {
        const newMember = {
          id: `MEM-${addedCam.id}`,
          camId: addedCam.id,
          name: addedCam.assignedTo || `Nhân Viên (${addedCam.id})`,
          role: addedCam.role || 'Chuyên viên',
          department: addedCam.department || addedCam.location || 'Phòng R&D',
          currentPosture: addedCam.currentPosture || 'good',
          ergonomicsScore: 92,
          rank: members.length + 1,
          avatar: addedCam.webcamUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          email: `${addedCam.id.toLowerCase()}@company.ai`,
          workingHours: '8.0h',
          goodPostureTime: '7.2h'
        };
        setMembers(prev => [newMember, ...prev]);
      }
    } else if (newCameras.length < cameras.length) {
      // If a camera was removed
      const remainingIds = new Set(newCameras.map(c => c.id));
      setMembers(prev => prev.filter(m => remainingIds.has(m.camId)));
    }
    setCameras(newCameras);
  };

  const handleSelectAlert = (alert) => {
    const mem = members.find(m => m.id === alert.memberId) || members[0];
    setSelectedMember(mem);
  };

  const handleSendBuzzer = (member) => {
    setBuzzerToast(`Đã kích hoạt chuông và thông báo công thái học tới máy bàn của ${member.name}!`);
    setTimeout(() => setBuzzerToast(null), 3500);
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (user.role) {
      handleSwitchMode(user.role);
    }
    setShowAuthModal(false);
  };

  // If user opened the Auth page
  if (showAuthModal) {
    return (
      <AuthView
        initialRole={mode}
        onLoginSuccess={handleLoginSuccess}
        onGoHome={(role) => {
          if (role) {
            handleSwitchMode(role);
          }
          setShowAuthModal(false);
        }}
      />
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      
      {/* Top Header */}
      <Header
        mode={mode}
        setMode={handleSwitchMode}
        alerts={alerts}
        currentUser={currentUser}
        onSelectAlert={handleSelectAlert}
        onOpenQuickCam={() => {
          if (mode === SYSTEM_MODES.ENTERPRISE) {
            setCurrentTab('cameras');
          } else {
            setCurrentTab('personal_cameras');
          }
        }}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onLogout={() => {
          setShowAuthModal(true);
        }}
      />

      {/* Buzzer Toast Banner */}
      {buzzerToast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 bg-white border border-emerald-500 rounded-2xl shadow-xl text-xs text-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-150">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span className="font-semibold text-slate-900">{buzzerToast}</span>
        </div>
      )}

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        
        {/* Desktop Collapsible Sidebar */}
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          mode={mode}
          setMode={handleSwitchMode}
          memberCount={members.length}
          cameraCount={cameras.length}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
        />

        {/* Content View Container - the ONLY element that scrolls */}
        <main className="flex-1 h-full overflow-y-auto min-h-0 p-3 sm:p-4 lg:p-5 space-y-3 pb-20 md:pb-5 bg-[#f8fafc] transition-all duration-300">
          
          {/* GIAO DIỆN DÀNH CHO CÁ NHÂN (Hiển thị các tab tương ứng từ menu bên trái) */}
          {mode === SYSTEM_MODES.PERSONAL ? (
            <PersonalView 
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              onBackToRoleSelect={() => setShowAuthModal(true)} 
            />
          ) : (
            /* GIAO DIỆN DÀNH CHO DOANH NGHIỆP */
            <>
              {currentTab === 'dashboard' && (
                <DashboardView
                  members={members}
                  cameras={cameras}
                  alerts={alerts}
                  onSelectMember={(mem) => setSelectedMember(mem)}
                  onNavigateTab={(tab) => setCurrentTab(tab)}
                />
              )}

              {currentTab === 'multicam' && (
                <MultiCameraView
                  cameras={cameras}
                  members={members}
                  onSelectMember={(mem) => setSelectedMember(mem)}
                  onSendBuzzer={handleSendBuzzer}
                />
              )}

              {currentTab === 'members' && (
                <MembersView
                  members={members}
                  onSelectMember={(mem) => setSelectedMember(mem)}
                  onAddMember={handleAddMember}
                />
              )}

              {currentTab === 'rankings' && (
                <EmployeeRankingView
                  members={members}
                />
              )}

              {currentTab === 'recordings' && (
                <ScreenRecordingsView
                  cameras={cameras}
                  members={members}
                />
              )}

              {currentTab === 'reports' && (
                <ReportsView
                  members={members}
                />
              )}

              {currentTab === 'cameras' && (
                <CameraSetupView
                  cameras={cameras}
                  members={members}
                  onUpdateCameras={handleUpdateCameras}
                  mode="enterprise"
                />
              )}
            </>
          )}

        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 flex items-center justify-around z-40 text-[10px] shadow-sm">
        {mode === SYSTEM_MODES.ENTERPRISE ? (
          <>
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
              onClick={() => setCurrentTab('multicam')}
              className={`flex flex-col items-center gap-0.5 p-1 rounded-lg ${
                currentTab === 'multicam' ? 'text-emerald-600 font-bold' : 'text-slate-500'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Tất cả Cam</span>
            </button>

            <button
              onClick={() => setCurrentTab('members')}
              className={`flex flex-col items-center gap-0.5 p-1 rounded-lg ${
                currentTab === 'members' ? 'text-emerald-600 font-bold' : 'text-slate-500'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Nhân viên</span>
            </button>

            <button
              onClick={() => setCurrentTab('rankings')}
              className={`flex flex-col items-center gap-0.5 p-1 rounded-lg ${
                currentTab === 'rankings' ? 'text-emerald-600 font-bold' : 'text-slate-500'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Xếp hạng</span>
            </button>

            <button
              onClick={() => setCurrentTab('cameras')}
              className={`flex flex-col items-center gap-0.5 p-1 rounded-lg ${
                currentTab === 'cameras' ? 'text-emerald-600 font-bold' : 'text-slate-500'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Cài Đặt</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setCurrentTab('personal_desk')}
              className={`flex flex-col items-center gap-0.5 p-1 rounded-lg ${
                currentTab === 'personal_desk' ? 'text-emerald-600 font-bold' : 'text-slate-500'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Bàn Làm Việc</span>
            </button>

            <button
              onClick={() => setCurrentTab('personal_timetable')}
              className={`flex flex-col items-center gap-0.5 p-1 rounded-lg ${
                currentTab === 'personal_timetable' ? 'text-emerald-600 font-bold' : 'text-slate-500'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Thời Khóa Biểu</span>
            </button>

            <button
              onClick={() => setCurrentTab('personal_assistant')}
              className={`flex flex-col items-center gap-0.5 p-1 rounded-lg ${
                currentTab === 'personal_assistant' ? 'text-emerald-600 font-bold' : 'text-slate-500'
              }`}
            >
              <Brain className="w-4 h-4" />
              <span>Trợ Lý</span>
            </button>

            <button
              onClick={() => setCurrentTab('personal_rankings')}
              className={`flex flex-col items-center gap-0.5 p-1 rounded-lg ${
                currentTab === 'personal_rankings' ? 'text-emerald-600 font-bold' : 'text-slate-500'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Toàn Cầu</span>
            </button>

            <button
              onClick={() => setCurrentTab('personal_cameras')}
              className={`flex flex-col items-center gap-0.5 p-1 rounded-lg ${
                currentTab === 'personal_cameras' ? 'text-emerald-600 font-bold' : 'text-slate-500'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Cài Đặt</span>
            </button>
          </>
        )}
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

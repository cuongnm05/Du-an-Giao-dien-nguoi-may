import React, { useState } from 'react';
import { 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Flame, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  Award, 
  Camera, 
  ChevronRight, 
  Sparkles, 
  Zap, 
  ArrowUpRight, 
  Coffee, 
  RotateCcw,
  LayoutGrid,
  Search,
  Filter,
  Monitor, 
  UserCheck,
  Radio,
  Sliders,
  Laptop,
  Keyboard,
  MousePointer
} from 'lucide-react';
import AiVisionFeed from './AiVisionFeed';
import WorkstationTriMonitor from './WorkstationTriMonitor';

export default function DashboardView({ 
  members = [], 
  cameras = [], 
  alerts = [], 
  onSelectMember, 
  onNavigateTab 
}) {
  const [selectedCameraId, setSelectedCameraId] = useState(cameras[0]?.id || 'PC-01');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [liveAlerts, setLiveAlerts] = useState(alerts);
  const [notificationToast, setNotificationToast] = useState(null);

  // Selected camera & member
  const selectedCam = cameras.find(c => c.id === selectedCameraId) || cameras[0] || {};
  const assignedMember = members.find(m => m.camId === selectedCam.id || m.name === selectedCam.assignedTo) || members[0] || {};

  // Departments for filter
  const departments = ['ALL', ...new Set(cameras.map(c => c.department || c.room).filter(Boolean))];

  // Filter list of PCs
  const filteredCameras = cameras.filter(cam => {
    const matchesSearch = cam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cam.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cam.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'ALL' || cam.department === selectedDept || cam.room === selectedDept;
    
    let matchesStatus = true;
    if (selectedStatus === 'warning') matchesStatus = cam.status === 'warning' || cam.isProcessViolating;
    else if (selectedStatus === 'online') matchesStatus = cam.status === 'online';
    else if (selectedStatus === 'away') matchesStatus = cam.status === 'away';

    return matchesSearch && matchesDept && matchesStatus;
  });

  const triggerLiveAlert = (newAlert) => {
    const item = {
      id: `ALT-${Date.now()}`,
      time: new Date().toLocaleTimeString('vi-VN'),
      memberId: assignedMember.id,
      memberName: assignedMember.name,
      type: newAlert.type,
      severity: newAlert.type === 'slouching' ? 'high' : 'medium',
      title: newAlert.text,
      camId: selectedCam.id,
      resolved: false
    };
    setLiveAlerts(prev => [item, ...prev.slice(0, 5)]);
    setNotificationToast(item);
    setTimeout(() => setNotificationToast(null), 4000);
  };

  return (
    <div className="space-y-3">
      
      {/* Toast Notification Banner */}
      {notificationToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 p-4 bg-white border border-rose-400 rounded-xl shadow-2xl text-xs text-slate-800 animate-in slide-in-from-bottom-5 duration-200">
          <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
            <AlertTriangle className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <div className="font-bold text-rose-600">CẢNH BÁO AI REALTIME</div>
            <div className="text-slate-600">{notificationToast.title} ({notificationToast.memberName})</div>
          </div>
          <button 
            onClick={() => setNotificationToast(null)}
            className="text-slate-400 hover:text-slate-700 ml-2 text-sm font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Grid: Danh Sách List Máy Trạm (Cột trái) & Màn Hình Live Camera Máy Chọn (Cột phải) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* CỘT TRÁI (5 cols): Danh sách list máy tính theo dõi + Nút Xem Tất Cả Camera */}
        <div className="lg:col-span-5 space-y-2.5">
          
          {/* Nút Xem Tất Cả Camera, Cài Đặt Camera & Bộ Lọc Nhanh (Trực tiếp, không có ô chữ giải thích) */}
          <div className="p-3 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-xs text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigateTab('multicam')}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
              >
                <LayoutGrid className="w-4 h-4" />
                <span>Xem Tất Cả Camera ({cameras.length} Máy)</span>
              </button>
              <button
                onClick={() => onNavigateTab('cameras')}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition-all shrink-0"
              >
                <Camera className="w-4 h-4 text-emerald-600" />
                <span>Cài Đặt Camera</span>
              </button>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm mã máy, tên nhân viên..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-[11px]"
              >
                {departments.map(d => (
                  <option key={d} value={d}>{d === 'ALL' ? 'Tất cả phòng ban' : d}</option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-[11px]"
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="warning">Cảnh báo / Vi phạm</option>
                <option value="online">Đang trực tuyến</option>
                <option value="away">Vắng mặt tại bàn</option>
              </select>
            </div>
          </div>

          {/* List danh sách các máy tính cuộn mượt mà */}
          <div className="space-y-2 max-h-[660px] overflow-y-auto pr-1">
            {filteredCameras.map((cam) => {
              const isSelected = selectedCameraId === cam.id;
              const isViolating = cam.isProcessViolating;
              const isAway = cam.status === 'away';

              return (
                <div
                  key={cam.id}
                  onClick={() => setSelectedCameraId(cam.id)}
                  className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-emerald-50/90 border-emerald-500 shadow-sm ring-1 ring-emerald-400/30'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img 
                      src={cam.webcamUrl} 
                      alt={cam.name} 
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 shrink-0" 
                    />

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 truncate">{cam.assignedTo}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({cam.id})</span>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">{cam.location}</div>
                      <div className="text-[10px] font-mono text-slate-400 truncate">
                        App: <span className={isViolating ? 'text-rose-600 font-semibold' : 'text-slate-600'}>{cam.activeProcess}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5 truncate">
                        <span className="flex items-center gap-0.5 font-mono text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                          ⌨️ {cam.inputTelemetry?.wpm || 54} WPM
                        </span>
                        <span className="flex items-center gap-0.5 text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 font-mono">
                          🖱️ {cam.inputTelemetry?.mouseCpm || 22} CPM
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isViolating
                        ? 'bg-rose-100 text-rose-800 animate-pulse'
                        : isAway
                        ? 'bg-slate-100 text-slate-600'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {isViolating ? '⚠ Vi phạm' : isAway ? 'Rời bàn' : '● Chuẩn'}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">3 Luồng Stream</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* CỘT PHẢI (7 cols): Hệ Thống Giám Sát 3 Luồng Máy Trạm Được Chọn */}
        <div className="lg:col-span-7 space-y-3">
          
          <WorkstationTriMonitor
            cam={selectedCam}
            member={assignedMember}
            mode="enterprise"
            onAlertTrigger={triggerLiveAlert}
            showControls={true}
          />

          {/* Cảnh báo AI gần đây */}
          <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900">
              <span>Nhật Ký Cảnh Báo Gần Nhất</span>
              <span className="text-[10px] text-slate-400 font-mono font-normal">Real-time Stream</span>
            </div>

            <div className="space-y-1.5 max-h-32 overflow-y-auto text-xs">
              {liveAlerts.slice(0, 3).map(alt => (
                <div key={alt.id} className="p-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                    <span className="font-semibold text-slate-800">{alt.memberName} ({alt.camId}):</span>
                    <span className="text-slate-600">{alt.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{alt.time}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

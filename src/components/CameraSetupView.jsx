import React, { useState } from 'react';
import { 
  Camera, 
  Video, 
  Settings2, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Power, 
  RotateCcw, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  ShieldAlert, 
  Monitor, 
  MousePointer, 
  Keyboard, 
  Eye, 
  Play, 
  Pause,
  Save, 
  PlusCircle, 
  X,
  Search,
  Filter,
  Check,
  Ban,
  Calendar,
  Volume2,
  VolumeX,
  Wifi,
  Radio,
  Cpu,
  Layers,
  Activity,
  UserCheck,
  Laptop,
  Maximize2
} from 'lucide-react';
import AiVisionFeed from './AiVisionFeed';
import { INITIAL_PROCESS_RULES, INITIAL_CAMERAS, SCREEN_STREAM_IMAGES } from '../data/mockData';

// Danh sách thiết bị mặc định cho Chế độ Cá Nhân
const DEFAULT_PERSONAL_CAMERAS = [
  {
    id: 'MY-CAM-01',
    name: 'Webcam Bàn Làm Việc (Front POV)',
    ip: '127.0.0.1:554/webcam-pov',
    assignedTo: 'Bạn (Cá Nhân)',
    department: 'Góc Làm Việc Tại Nhà (Home Office)',
    location: 'Bàn Làm Việc Cá Nhân',
    status: 'online',
    currentPosture: 'good',
    webcamUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    type: 'Webcam AI Full HD & Pose Tracker',
    angle: 'front',
    fps: 30,
    resolution: '1080p @ 30fps'
  },
  {
    id: 'MY-SCREEN-01',
    name: 'Agent Giám Sát Màn Hình (Screen Stream)',
    ip: '127.0.0.1:554/screen-stream',
    assignedTo: 'Bạn (Cá Nhân)',
    department: 'Không Gian Học Tập & Làm Việc',
    location: 'Màn Hình Chính 27-inch 2K',
    status: 'online',
    currentPosture: 'good',
    webcamUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    type: 'Screen Capture Real-time Agent',
    angle: 'screen',
    fps: 60,
    resolution: '2560x1440 @ 60fps'
  },
  {
    id: 'MY-INPUT-01',
    name: 'Cảm Biến Bàn Phím & Chuột (Telemetry)',
    ip: '127.0.0.1:554/hid-telemetry',
    assignedTo: 'Bạn (Cá Nhân)',
    department: 'Góc Làm Việc Tại Nhà (Home Office)',
    location: 'Bàn Phím Cơ & Chuột Công Thái Học',
    status: 'online',
    currentPosture: 'good',
    webcamUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    type: 'HID Keystroke & Mouse Activity Sensor',
    angle: 'desk',
    fps: 120,
    resolution: 'HID Event Stream'
  }
];

export default function CameraSetupView({ 
  cameras = [], 
  members = [], 
  onUpdateCameras,
  mode = 'enterprise'
}) {
  const isPersonal = mode === 'personal';

  // Khởi tạo danh sách thiết bị thông minh: Nếu rỗng thì nạp bộ thiết bị phù hợp, tránh trang trắng hoặc khoảng trống
  const initialList = cameras.length > 0 
    ? cameras 
    : (isPersonal ? DEFAULT_PERSONAL_CAMERAS : INITIAL_CAMERAS);

  const [activeTab, setActiveTab] = useState('devices'); // 'devices' | 'ai_config' | 'processes' | 'automation' | 'alerts'
  const [cameraList, setCameraList] = useState(initialList);
  const [selectedCamId, setSelectedCamId] = useState(initialList[0]?.id || 'PC-01');
  const [searchQuery, setSearchQuery] = useState('');
  const [deviceFilter, setDeviceFilter] = useState('all'); // 'all' | 'online' | 'warning'

  // Selected camera
  const selectedCam = cameraList.find(c => c.id === selectedCamId) || cameraList[0] || {};

  // Global & Per-Cam Config States
  const [enableExternalCam, setEnableExternalCam] = useState(true);
  const [enablePostureTracking, setEnablePostureTracking] = useState(true);
  const [enableWorkDetection, setEnableWorkDetection] = useState(true);
  const [enableScreenProcessRecording, setEnableScreenProcessRecording] = useState(true);
  const [enableMouseKeyboardTracking, setEnableMouseKeyboardTracking] = useState(true);
  
  // Model AI Settings
  const [aiModelEngine, setAiModelEngine] = useState('mediapipe'); // 'mediapipe' | 'yolov8' | 'movenet'
  const [aiSensitivity, setAiSensitivity] = useState(88);
  const [neckAngleThreshold, setNeckAngleThreshold] = useState(25);
  const [slouchDurationSec, setSlouchDurationSec] = useState(60);
  const [showSkeletonOverlay, setShowSkeletonOverlay] = useState(true);
  const [trackSpineCurvature, setTrackSpineCurvature] = useState(true);

  // Blacklist & Whitelist process states
  const [processRules, setProcessRules] = useState(INITIAL_PROCESS_RULES);
  const [newProcessName, setNewProcessName] = useState('');
  const [newProcessType, setNewProcessType] = useState('blacklist');
  const [newProcessCategory, setNewProcessCategory] = useState('Mạng xã hội');

  // Automation / Scheduler states
  const [automationEnabled, setAutomationEnabled] = useState(true);
  const [morningStart, setMorningStart] = useState('08:00');
  const [morningEnd, setMorningEnd] = useState('12:00');
  const [afternoonStart, setAfternoonStart] = useState('13:30');
  const [afternoonEnd, setAfternoonEnd] = useState('17:30');
  const [autoKillBlacklist, setAutoKillBlacklist] = useState(true);
  const [autoPatrolInterval, setAutoPatrolInterval] = useState(30);

  // Alert buzzer configs
  const [buzzerVolume, setBuzzerVolume] = useState(75);
  const [soundType, setSoundType] = useState('gentle'); // 'gentle' | 'buzzer' | 'stretch'
  const [enableDeskFlash, setEnableDeskFlash] = useState(true);
  const [enableOsdToast, setEnableOsdToast] = useState(true);
  const [isPlayingTestSound, setIsPlayingTestSound] = useState(false);

  // Modal Add New Device / PC
  const [showAddPcModal, setShowAddPcModal] = useState(false);
  const [newPcData, setNewPcData] = useState({
    id: isPersonal ? `CAM-0${cameraList.length + 1}` : `PC-${String(cameraList.length + 1).padStart(2, '0')}`,
    name: isPersonal ? `Webcam Bổ Sung 0${cameraList.length + 1}` : `Máy Trạm ${String(cameraList.length + 1).padStart(2, '0')} - Nhân Viên Mới`,
    ip: `192.168.1.${100 + cameraList.length + 1}:554/rtsp`,
    assignedTo: isPersonal ? 'Bạn (Cá Nhân)' : 'Nhân Viên Mới',
    department: isPersonal ? 'Góc Làm Việc Cá Nhân' : 'Phòng Phát Triển Sản Phẩm (R&D)',
    location: isPersonal ? 'Bàn Làm Việc Tại Nhà' : `Tầng 3 - Bàn R&D-${cameraList.length + 1}`,
    status: 'online'
  });

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Add Device
  const handleAddPc = (e) => {
    e.preventDefault();
    const newPc = {
      ...newPcData,
      type: 'Webcam AI Full HD & Screen Agent',
      angle: 'front',
      room: newPcData.department,
      fps: 30,
      resolution: '1080p @ 30fps',
      role: 'Chuyên viên',
      currentPosture: 'good',
      webcamUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
      activeProcess: 'code.exe'
    };

    const updated = [newPc, ...cameraList];
    setCameraList(updated);
    if (onUpdateCameras) onUpdateCameras(updated);
    setSelectedCamId(newPc.id);
    setShowAddPcModal(false);
    showToast(`Đã thêm thiết bị mới: ${newPc.name} (${newPc.ip})!`);
  };

  // Delete Device
  const handleDeletePc = (id) => {
    const updated = cameraList.filter(c => c.id !== id);
    setCameraList(updated);
    if (onUpdateCameras) onUpdateCameras(updated);
    if (selectedCamId === id && updated.length > 0) {
      setSelectedCamId(updated[0].id);
    }
    showToast('Đã xóa thiết bị khỏi hệ thống!');
  };

  // Save All Configurations
  const handleSaveAllConfig = () => {
    showToast('✓ Toàn bộ cấu hình hệ thống Camera AI đã được đồng bộ & lưu thành công!');
  };

  // Add Process Rule
  const handleAddProcessRule = (e) => {
    e.preventDefault();
    if (!newProcessName.trim()) return;

    if (newProcessType === 'blacklist') {
      const newItem = {
        id: `BL-${Date.now()}`,
        name: newProcessName,
        processName: newProcessName.toLowerCase().replace(/\s+/g, '') + '.exe',
        category: newProcessCategory,
        action: 'Chặn & Đóng tức thì',
        enabled: true
      };
      setProcessRules(prev => ({
        ...prev,
        blacklist: [newItem, ...prev.blacklist]
      }));
      showToast(`Đã thêm "${newProcessName}" vào danh sách cấm!`);
    } else {
      const newItem = {
        id: `WL-${Date.now()}`,
        name: newProcessName,
        processName: newProcessName.toLowerCase().replace(/\s+/g, '') + '.exe',
        category: newProcessCategory,
        enabled: true
      };
      setProcessRules(prev => ({
        ...prev,
        whitelist: [newItem, ...prev.whitelist]
      }));
      showToast(`Đã thêm "${newProcessName}" vào danh sách cho phép!`);
    }
    setNewProcessName('');
  };

  // Load Rule Presets
  const handleLoadPreset = (presetName) => {
    if (presetName === 'office') {
      showToast('Đã nạp Bộ quy chuẩn Văn phòng IT (Chặn Game, Mạng xã hội; Cho phép VS Code, Figma, Slack, Jira)!');
    } else if (presetName === 'focus') {
      showToast('Đã nạp Bộ quy tắc Tập trung Cá nhân (Chặn Youtube, Facebook, TikTok, Steam)!');
    } else {
      showToast('Đã khôi phục bộ quy tắc mặc định!');
    }
  };

  // Play Test Sound
  const handleTestSound = () => {
    setIsPlayingTestSound(true);
    showToast(`Đang phát âm thanh mẫu "${soundType === 'gentle' ? 'Chuông êm dịu' : soundType === 'buzzer' ? 'Còi Buzzer' : 'Giai điệu thư giãn'}" ở mức ${buzzerVolume}%...`);
    setTimeout(() => {
      setIsPlayingTestSound(false);
    }, 2500);
  };

  // Filter cameras
  const filteredCams = cameraList.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (c.assignedTo && c.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()));
    let matchesStatus = true;
    if (deviceFilter === 'online') matchesStatus = c.status === 'online';
    if (deviceFilter === 'warning') matchesStatus = c.status === 'warning' || c.currentPosture !== 'good';
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-3.5 w-full">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-white border border-emerald-500 rounded-2xl shadow-2xl text-xs font-semibold text-slate-800 animate-in slide-in-from-bottom-3 duration-200">
          <div className="p-1 rounded-lg bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-slate-600 ml-1">✕</button>
        </div>
      )}

      {/* Navigation Sub-Tabs & Action Bar (Trực tiếp, cân đối toàn màn hình, không chứa ô giải thích chữ thừa) */}
      <div className="p-2.5 bg-white border border-slate-200 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-2.5 text-xs shadow-xs w-full">
        
        {/* 5 Sub-Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setActiveTab('devices')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all font-semibold shrink-0 ${
              activeTab === 'devices'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>1. Thiết Bị ({cameraList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_config')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all font-semibold shrink-0 ${
              activeTab === 'ai_config'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>2. Cấu Hình Model AI</span>
          </button>

          <button
            onClick={() => setActiveTab('processes')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all font-semibold shrink-0 ${
              activeTab === 'processes'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Ban className="w-4 h-4" />
            <span>3. Tiến Trình Cấm & Cho Phép</span>
          </button>

          <button
            onClick={() => setActiveTab('automation')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all font-semibold shrink-0 ${
              activeTab === 'automation'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>4. Lịch Trình & Tự Động Hóa</span>
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all font-semibold shrink-0 ${
              activeTab === 'alerts'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>5. Chuông Báo & Cảnh Báo</span>
          </button>
        </div>

        {/* Nút Lưu Cấu Hình Toàn Hệ Thống */}
        <button
          onClick={handleSaveAllConfig}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0 w-full md:w-auto justify-center"
        >
          <Save className="w-4 h-4" />
          <span>Lưu Toàn Bộ Cấu Hình</span>
        </button>
      </div>

      {/* ===================== TAB 1: QUẢN LÝ THIẾT BỊ (CÂN ĐỐI 5:7, ĐỦ 3 LUỒNG GIÁM SÁT) ===================== */}
      {activeTab === 'devices' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full items-start">
          
          {/* Cột trái (5 cols): Danh sách thiết bị / Máy trạm */}
          <div className="lg:col-span-5 space-y-3">
            
            {/* Thanh tìm kiếm & Lọc trạng thái */}
            <div className="p-3 bg-white border border-slate-200 rounded-2xl space-y-2.5 shadow-xs">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isPersonal ? "Tìm thiết bị cá nhân..." : "Tìm máy trạm, nhân viên, IP..."}
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 text-xs"
                  />
                </div>

                <button
                  onClick={() => setShowAddPcModal(true)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-xs shrink-0 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isPersonal ? 'Thêm Thiết Bị' : 'Thêm Máy'}</span>
                </button>
              </div>

              {/* Status Pills */}
              <div className="flex items-center gap-1.5 text-[11px]">
                <button
                  onClick={() => setDeviceFilter('all')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    deviceFilter === 'all' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Tất cả ({cameraList.length})
                </button>
                <button
                  onClick={() => setDeviceFilter('online')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    deviceFilter === 'online' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Đang Online ({cameraList.filter(c => c.status === 'online').length})
                </button>
                <button
                  onClick={() => setDeviceFilter('warning')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    deviceFilter === 'warning' ? 'bg-rose-600 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Cần Chú Ý ({cameraList.filter(c => c.currentPosture !== 'good').length})
                </button>
              </div>
            </div>

            {/* List thiết bị cuộn mượt mà */}
            <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
              {filteredCams.map(cam => {
                const isSelected = selectedCamId === cam.id;
                const isWarn = cam.currentPosture !== 'good' || cam.status === 'warning';

                return (
                  <div
                    key={cam.id}
                    onClick={() => setSelectedCamId(cam.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-emerald-50/90 border-emerald-500 shadow-sm ring-1 ring-emerald-500/30'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative shrink-0">
                        <img 
                          src={cam.webcamUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'} 
                          alt={cam.name} 
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200" 
                        />
                        <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                          isWarn ? 'bg-rose-500' : 'bg-emerald-500'
                        }`} />
                      </div>

                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">{cam.name}</div>
                        <div className="text-[10px] text-slate-500 truncate">{cam.location} • {cam.assignedTo}</div>
                        <div className="text-[10px] text-emerald-600 font-mono truncate">{cam.ip}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isWarn ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isWarn ? 'Cảnh báo' : 'Chuẩn'}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePc(cam.id);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Xóa thiết bị"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredCams.length === 0 && (
                <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl text-xs text-slate-400">
                  Không tìm thấy thiết bị nào phù hợp bộ lọc.
                </div>
              )}
            </div>
          </div>

          {/* Cột phải (7 cols): Hub Quản Trị Thiết Bị Đang Chọn & Xem Trực Tiếp 3 Luồng */}
          <div className="lg:col-span-7 space-y-3">
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
              
              {/* Header thiết bị đang chọn */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{selectedCam.name}</h4>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {selectedCam.location} • Quản lý: <strong className="text-slate-700">{selectedCam.assignedTo}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {selectedCam.ip}
                  </span>
                  <button
                    onClick={() => showToast(`Đã kiểm tra kết nối luồng RTSP của ${selectedCam.name}: Ổn định, độ trễ 12ms`)}
                    className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200"
                    title="Kiểm tra kết nối ping"
                  >
                    <Wifi className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Màn hình camera với Vị trí & Giờ thực OSD */}
              <AiVisionFeed
                camName={selectedCam.name}
                camId={selectedCam.id}
                memberName={selectedCam.assignedTo}
                location={selectedCam.location}
                webcamUrl={selectedCam.webcamUrl}
                initialPosture={selectedCam.currentPosture || 'good'}
                height="h-72"
                showHeader={true}
                showControls={true}
              />

              {/* 3 Thẻ Đo Lường Tương Tác: Cam Ngoài, Màn Hình Máy Tính, Phím Chuột */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between text-slate-500 text-[10px] font-medium">
                    <span className="flex items-center gap-1 text-emerald-600">
                      <Camera className="w-3 h-3" />
                      <span>Luồng 1: Cam Ngoài</span>
                    </span>
                    <span className="text-emerald-700 font-bold font-mono">1080p @ 30fps</span>
                  </div>
                  <div className="font-bold text-slate-800 text-[11px]">Webcam Front POV</div>
                  <div className="text-[10px] text-slate-500">Pose Estimation: Bật 33 điểm</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between text-slate-500 text-[10px] font-medium">
                    <span className="flex items-center gap-1 text-teal-600">
                      <Monitor className="w-3 h-3" />
                      <span>Luồng 2: Màn Hình</span>
                    </span>
                    <span className="text-teal-700 font-bold font-mono">Active (60fps)</span>
                  </div>
                  <div className="font-bold text-slate-800 text-[11px] truncate">App: {selectedCam.activeProcess || 'code.exe'}</div>
                  <div className="text-[10px] text-slate-500">Screen Capture Agent: Sẵn sàng</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between text-slate-500 text-[10px] font-medium">
                    <span className="flex items-center gap-1 text-purple-600">
                      <Keyboard className="w-3 h-3" />
                      <span>Luồng 3: Phím/Chuột</span>
                    </span>
                    <span className="text-purple-700 font-bold font-mono">58 WPM</span>
                  </div>
                  <div className="font-bold text-slate-800 text-[11px]">Telemetry HID Sensor</div>
                  <div className="text-[10px] text-slate-500">32 click/phút • Hoạt động</div>
                </div>
              </div>

              {/* Nút hành động nhanh */}
              <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => showToast(`Đã gửi lệnh hiệu chuẩn tư thế chuẩn cho ${selectedCam.name}!`)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors"
                >
                  Hiệu Chuẩn Tư Thế Chuẩn
                </button>
                <button
                  onClick={() => showToast(`Đã phát chuông buzzer thử nghiệm tại bàn của ${selectedCam.assignedTo}!`)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-xs transition-all"
                >
                  Phát Chuông Thử Nghiệm
                </button>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ===================== TAB 2: CẤU HÌNH MODEL AI (CÂN BẰNG 2 CỘT, LẤP ĐẦY KHÔNG GIAN) ===================== */}
      {activeTab === 'ai_config' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
          
          {/* Cột 1: Thông số kỹ thuật nhận diện tư thế */}
          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Bộ Tham Số Nhận Diện Cột Sống & Tư Thế AI
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Thời Gian Thực
                </span>
              </div>

              {/* Chọn Model AI Engine */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                <label className="font-semibold text-slate-700 block">Kiến trúc mô hình AI Vision:</label>
                <select
                  value={aiModelEngine}
                  onChange={(e) => {
                    setAiModelEngine(e.target.value);
                    showToast(`Đã chuyển đổi mô hình suy luận sang: ${e.target.value.toUpperCase()}`);
                  }}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-semibold focus:outline-none focus:border-emerald-500"
                >
                  <option value="mediapipe">MediaPipe BlazePose (33 Điểm Khớp Cột Sống - Khuyên Dùng)</option>
                  <option value="yolov8">YOLOv8-Pose (Tốc độ cao 60FPS cho phòng máy lớn)</option>
                  <option value="movenet">Google MoveNet Lightning (Tối ưu hóa phần cứng nhẹ)</option>
                </select>
              </div>

              {/* Slider 1: Độ nhạy */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>Độ nhạy nhận diện AI (Confidence):</span>
                  <span className="font-mono text-emerald-600 font-bold">{aiSensitivity}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="99"
                  value={aiSensitivity}
                  onChange={(e) => setAiSensitivity(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>50% (Dễ tính)</span>
                  <span>Khuyên nghị: 85% - 90%</span>
                  <span>99% (Nghiêm ngặt)</span>
                </div>
              </div>

              {/* Slider 2: Góc gập cổ */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>Ngưỡng góc cúi rướn cổ (Cervical Flexion):</span>
                  <span className="font-mono text-emerald-600 font-bold">{neckAngleThreshold}°</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="40"
                  value={neckAngleThreshold}
                  onChange={(e) => setNeckAngleThreshold(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="text-[10px] text-slate-400">
                  Khi đầu cúi về trước quá {neckAngleThreshold}°, hệ thống sẽ kích hoạt tính thời gian sai tư thế.
                </div>
              </div>

              {/* Slider 3: Thời gian gù */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>Thời gian giữ tư thế sai để báo động:</span>
                  <span className="font-mono text-emerald-600 font-bold">{slouchDurationSec} giây</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="180"
                  step="10"
                  value={slouchDurationSec}
                  onChange={(e) => setSlouchDurationSec(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="text-[10px] text-slate-400">
                  Tránh báo động nhầm khi nhân viên chỉ cúi xuống nhặt đồ hoặc với lấy tài liệu.
                </div>
              </div>

              {/* Toggles chi tiết */}
              <div className="space-y-2 pt-1 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-800 font-medium">Hiện khung xương 33 điểm OSD thời gian thực</span>
                  <input
                    type="checkbox"
                    checked={showSkeletonOverlay}
                    onChange={(e) => setShowSkeletonOverlay(e.target.checked)}
                    className="h-4 w-4 text-emerald-600 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-800 font-medium">Theo dõi độ cong & độ lệch vai đối xứng</span>
                  <input
                    type="checkbox"
                    checked={trackSpineCurvature}
                    onChange={(e) => setTrackSpineCurvature(e.target.checked)}
                    className="h-4 w-4 text-emerald-600 rounded"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveAllConfig}
              className="w-full py-2.5 mt-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20"
            >
              Lưu Tham Số Nhận Diện Tư Thế
            </button>
          </div>

          {/* Cột 2: Giám sát 3 luồng & Phát hiện làm việc riêng */}
          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-teal-50 text-teal-600">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Giám Sát 3 Luồng Toàn Diện & Chống Phân Tâm
                  </h4>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500">5 Tính Năng</span>
              </div>

              {/* 5 Toggle Features */}
              <div className="space-y-2.5 text-xs">
                
                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Quay Camera Ngoài (Webcam POV)</div>
                      <div className="text-slate-500 text-[11px]">Thu hình ảnh người ngồi và phân tích tư thế công thái học</div>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={enableExternalCam} 
                    onChange={(e) => setEnableExternalCam(e.target.checked)}
                    className="h-4 w-4 text-emerald-600 rounded" 
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-teal-100 text-teal-700">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">AI Pose Estimation Chống Gù Lưng</div>
                      <div className="text-slate-500 text-[11px]">Nhận diện gù lưng, lệch vai, rướn cổ, vẹo cột sống</div>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={enablePostureTracking} 
                    onChange={(e) => setEnablePostureTracking(e.target.checked)}
                    className="h-4 w-4 text-emerald-600 rounded" 
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                      <Eye className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Nhận Diện Mất Tập Trung & Làm Việc Riêng</div>
                      <div className="text-slate-500 text-[11px]">Phát hiện bấm điện thoại, ngủ gật, vắng mặt tại bàn</div>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={enableWorkDetection} 
                    onChange={(e) => setEnableWorkDetection(e.target.checked)}
                    className="h-4 w-4 text-emerald-600 rounded" 
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
                      <Monitor className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Ghi Video & Giám Sát Màn Hình (Screen Agent)</div>
                      <div className="text-slate-500 text-[11px]">Theo dõi cửa sổ ứng dụng đang mở và tiến trình làm việc</div>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={enableScreenProcessRecording} 
                    onChange={(e) => setEnableScreenProcessRecording(e.target.checked)}
                    className="h-4 w-4 text-emerald-600 rounded" 
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
                      <Keyboard className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Theo Dõi Nhịp Bàn Phím & Chuột (HID Telemetry)</div>
                      <div className="text-slate-500 text-[11px]">Đo tốc độ WPM & số click chuột để nhận biết trạng thái tích cực</div>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={enableMouseKeyboardTracking} 
                    onChange={(e) => setEnableMouseKeyboardTracking(e.target.checked)}
                    className="h-4 w-4 text-emerald-600 rounded" 
                  />
                </div>

              </div>

              {/* Ngưỡng phát hiện nhàn rỗi (Idle Timeout) */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-700">Thời gian không chạm phím/chuột coi là nhàn rỗi:</span>
                  <span className="font-bold text-emerald-600 font-mono">60 giây</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Khi vượt quá thời gian này mà camera không thấy người làm việc, trạng thái sẽ tự động đổi sang "Vắng mặt".
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveAllConfig}
              className="w-full py-2.5 mt-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20"
            >
              Lưu Cấu Hình 3 Luồng Giám Sát
            </button>
          </div>

        </div>
      )}

      {/* ===================== TAB 3: TIẾN TRÌNH CẤM & CHO PHÉP (ĐỐI XỨNG CÂN BẰNG, KHÔNG THỪA KHOẢNG TRẮNG) ===================== */}
      {activeTab === 'processes' && (
        <div className="space-y-3.5 w-full">
          
          {/* Thanh thêm tiến trình & Chọn mẫu nhanh */}
          <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
            <form onSubmit={handleAddProcessRule} className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
              <input
                type="text"
                required
                value={newProcessName}
                onChange={(e) => setNewProcessName(e.target.value)}
                placeholder="Nhập tên ứng dụng hoặc tiến trình (Ví dụ: Steam, League of Legends, Shopee, Telegram...)"
                className="sm:col-span-5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
              />

              <select
                value={newProcessType}
                onChange={(e) => setNewProcessType(e.target.value)}
                className="sm:col-span-3 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:border-emerald-500"
              >
                <option value="blacklist">⛔ Danh sách CẤM (Blacklist)</option>
                <option value="whitelist">✓ Danh sách CHO PHÉP (Whitelist)</option>
              </select>

              <select
                value={newProcessCategory}
                onChange={(e) => setNewProcessCategory(e.target.value)}
                className="sm:col-span-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-emerald-500"
              >
                <option>Mạng xã hội</option>
                <option>Game</option>
                <option>Mua sắm</option>
                <option>Phim ảnh</option>
                <option>Công việc</option>
              </select>

              <button
                type="submit"
                className="sm:col-span-2 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm Quy Tắc</span>
              </button>
            </form>

            {/* Mẫu quy chuẩn có sẵn */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-400 text-[11px] font-medium">Nạp nhanh mẫu quy tắc:</span>
              <button
                onClick={() => handleLoadPreset('office')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-medium transition-colors"
              >
                Bộ Quy Chuẩn Văn Phòng IT
              </button>
              <button
                onClick={() => handleLoadPreset('focus')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-medium transition-colors"
              >
                Bộ Quy Tắc Tập Trung Cá Nhân
              </button>
              <button
                onClick={() => handleLoadPreset('default')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-medium transition-colors"
              >
                Khôi Phục Mặc Định
              </button>
            </div>
          </div>

          {/* Grid 2 Cột Symmetrical: Blacklist & Whitelist trải đều 100% chiều ngang */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
            
            {/* Cột 1: Blacklist (Tiến trình cấm) */}
            <div className="p-4 bg-white border border-rose-200 rounded-2xl shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-rose-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900">
                    Tiến Trình Cấm Mở (Blacklist - {processRules.blacklist.length})
                  </h4>
                </div>
                <span className="text-[10px] font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  Tự động chặn & tắt
                </span>
              </div>

              <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                {processRules.blacklist.map(item => (
                  <div key={item.id} className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl flex items-center justify-between gap-2 text-xs hover:bg-rose-50 transition-colors">
                    <div>
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{item.processName} • {item.category}</div>
                      <div className="text-[10px] text-rose-700 font-semibold">{item.action}</div>
                    </div>

                    <button
                      onClick={() => {
                        setProcessRules(prev => ({
                          ...prev,
                          blacklist: prev.blacklist.filter(b => b.id !== item.id)
                        }));
                        showToast(`Đã gỡ "${item.name}" khỏi danh sách cấm!`);
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                      title="Gỡ bỏ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Cột 2: Whitelist (Tiến trình cho phép) */}
            <div className="p-4 bg-white border border-emerald-200 rounded-2xl shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                    Tiến Trình Cho Phép (Whitelist - {processRules.whitelist.length})
                  </h4>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Ưu tiên năng suất
                </span>
              </div>

              <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                {processRules.whitelist.map(item => (
                  <div key={item.id} className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between gap-2 text-xs hover:bg-emerald-50 transition-colors">
                    <div>
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{item.processName} • {item.category}</div>
                      <div className="text-[10px] text-emerald-700 font-semibold">Cho phép sử dụng trong giờ</div>
                    </div>

                    <button
                      onClick={() => {
                        setProcessRules(prev => ({
                          ...prev,
                          whitelist: prev.whitelist.filter(w => w.id !== item.id)
                        }));
                        showToast(`Đã gỡ "${item.name}" khỏi danh sách cho phép!`);
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Gỡ bỏ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Thanh thống kê chính sách */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
              <span className="text-slate-500">Tỷ Lệ Tuân Thủ Tiến Trình:</span>
              <span className="font-bold text-emerald-600 font-mono text-sm">98.4%</span>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
              <span className="text-slate-500">Số Lần Tự Động Chặn Hôm Nay:</span>
              <span className="font-bold text-rose-600 font-mono text-sm">3 Lần</span>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
              <span className="text-slate-500">Tiến Trình Đang Chạy An Toàn:</span>
              <span className="font-bold text-slate-800 font-mono text-sm">100% Hợp Lệ</span>
            </div>
          </div>

        </div>
      )}

      {/* ===================== TAB 4: LỊCH TRÌNH & TỰ ĐỘNG HÓA (ĐẦY ĐỦ TIMELINE, KHÔNG THỪA KHOẢNG TRẮNG) ===================== */}
      {activeTab === 'automation' && (
        <div className="space-y-3.5 w-full">
          
          {/* Timeline Visualizer */}
          <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Trục Thời Gian Lịch Trình Tự Động Trong Ngày (24h Timeline)</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Đang Kích Hoạt
              </span>
            </div>

            {/* Visual Bar */}
            <div className="w-full h-8 bg-slate-100 rounded-xl overflow-hidden flex text-[10px] font-bold text-white">
              <div style={{ width: '33%' }} className="bg-emerald-600 flex items-center justify-center">
                Ca Sáng ({morningStart} - {morningEnd})
              </div>
              <div style={{ width: '15%' }} className="bg-amber-400 text-slate-900 flex items-center justify-center">
                Nghỉ Trưa
              </div>
              <div style={{ width: '33%' }} className="bg-teal-600 flex items-center justify-center">
                Ca Chiều ({afternoonStart} - {afternoonEnd})
              </div>
              <div style={{ width: '19%' }} className="bg-slate-300 text-slate-600 flex items-center justify-center">
                Ngoài Giờ
              </div>
            </div>
          </div>

          {/* 2 Symmetrical Columns: Ca Sáng vs Ca Chiều */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
            
            {/* Cột trái: Ca sáng */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                      <Clock className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Khung Giờ Ca Sáng (Morning Shift)
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-600 font-bold">4.0 Giờ</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="text-[11px] text-slate-500 font-semibold block mb-1">Giờ bắt đầu:</label>
                    <input
                      type="time"
                      value={morningStart}
                      onChange={(e) => setMorningStart(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-xs font-bold text-slate-800"
                    />
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="text-[11px] text-slate-500 font-semibold block mb-1">Giờ kết thúc:</label>
                    <input
                      type="time"
                      value={morningEnd}
                      onChange={(e) => setMorningEnd(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-xs font-bold text-slate-800"
                    />
                  </div>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <div>
                      <div className="font-semibold text-slate-800">Tự động khởi động camera AI đúng 08:00</div>
                      <div className="text-[11px] text-slate-500">Tự bật luồng stream khi nhân sự vào chỗ ngồi</div>
                    </div>
                    <input type="checkbox" defaultChecked className="h-4 w-4 text-emerald-600 rounded" />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <div>
                      <div className="font-semibold text-slate-800">Kích hoạt chặn ứng dụng phân tâm</div>
                      <div className="text-[11px] text-slate-500">Tự động khóa game & mạng xã hội trong ca</div>
                    </div>
                    <input type="checkbox" defaultChecked className="h-4 w-4 text-emerald-600 rounded" />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <div>
                      <div className="font-semibold text-slate-800">Chuông nhắc giải lao giữa giờ (10:00)</div>
                      <div className="text-[11px] text-slate-500">Phát giai điệu vận động giãn cơ 5 phút</div>
                    </div>
                    <input type="checkbox" defaultChecked className="h-4 w-4 text-emerald-600 rounded" />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSaveAllConfig}
                className="w-full py-2.5 mt-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20"
              >
                Lưu Lịch Trình Ca Sáng
              </button>
            </div>

            {/* Cột phải: Ca chiều & Quy tắc cưỡng chế */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-teal-50 text-teal-600">
                      <Clock className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Khung Giờ Ca Chiều (Afternoon Shift)
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-teal-600 font-bold">4.0 Giờ</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="text-[11px] text-slate-500 font-semibold block mb-1">Giờ bắt đầu:</label>
                    <input
                      type="time"
                      value={afternoonStart}
                      onChange={(e) => setAfternoonStart(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-xs font-bold text-slate-800"
                    />
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="text-[11px] text-slate-500 font-semibold block mb-1">Giờ kết thúc:</label>
                    <input
                      type="time"
                      value={afternoonEnd}
                      onChange={(e) => setAfternoonEnd(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-xs font-bold text-slate-800"
                    />
                  </div>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <div>
                      <div className="font-semibold text-slate-800">Tự động đóng cưỡng chế (Auto-Kill) app vi phạm</div>
                      <div className="text-[11px] text-slate-500">Tắt tiến trình ngay khi mở trong giờ làm việc</div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={autoKillBlacklist}
                      onChange={(e) => setAutoKillBlacklist(e.target.checked)}
                      className="h-4 w-4 text-emerald-600 rounded" 
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <div>
                      <div className="font-semibold text-slate-800">Tuần tra đa camera xoay vòng tự động</div>
                      <div className="text-[11px] text-slate-500">Chuyển luồng tiêu điểm mỗi {autoPatrolInterval} giây</div>
                    </div>
                    <select
                      value={autoPatrolInterval}
                      onChange={(e) => setAutoPatrolInterval(Number(e.target.value))}
                      className="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-semibold"
                    >
                      <option value={15}>15 giây</option>
                      <option value={30}>30 giây</option>
                      <option value={60}>60 giây</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <div>
                      <div className="font-semibold text-slate-800">Tự động lưu & xuất báo cáo cuối ngày (17:30)</div>
                      <div className="text-[11px] text-slate-500">Tổng kết điểm tư thế & năng suất toàn diện</div>
                    </div>
                    <input type="checkbox" defaultChecked className="h-4 w-4 text-emerald-600 rounded" />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSaveAllConfig}
                className="w-full py-2.5 mt-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20"
              >
                Lưu Lịch Trình Ca Chiều & Tự Động Hóa
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ===================== TAB 5: CHUÔNG BÁO & CẢNH BÁO (BỐ CỤC ĐẦY ĐỦ, CÂN ĐỐI 2 CỘT) ===================== */}
      {activeTab === 'alerts' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
          
          {/* Cột 1: Cài đặt âm lượng & Kiểu chuông */}
          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Cài Đặt Âm Lượng & Còi Buzzer Công Thái Học
                  </h4>
                </div>
                <span className="font-mono text-emerald-600 font-bold text-xs">{buzzerVolume}% dB</span>
              </div>

              {/* Volume Slider with Live Soundwave animation */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between font-semibold text-slate-800">
                  <span>Mức âm lượng phát chuông tại bàn:</span>
                  <span className="font-mono text-emerald-600 font-bold">{buzzerVolume}% (~{Math.round(40 + buzzerVolume * 0.4)} dB)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={buzzerVolume}
                  onChange={(e) => setBuzzerVolume(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                
                {/* Sound wave visualizer preview */}
                <div className="flex items-center justify-center gap-1 py-2">
                  {[12, 24, 38, 18, 45, 60, 32, 20, 50, 28, 16, 40, 22].map((h, i) => (
                    <span 
                      key={i} 
                      style={{ height: `${isPlayingTestSound ? h : 8}px` }} 
                      className={`w-1 rounded-full transition-all duration-150 ${
                        isPlayingTestSound ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Kiểu âm thanh */}
              <div className="space-y-2 text-xs">
                <label className="font-semibold text-slate-700 block">Lựa chọn kiểu âm thanh nhắc nhở:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => { setSoundType('gentle'); showToast('Đã chọn: Chuông công thái học êm dịu'); }}
                    className={`p-2.5 rounded-xl border font-semibold text-left transition-all ${
                      soundType === 'gentle' ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-2xs' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-[11px] font-bold">1. Chuông Dịu Nhẹ</div>
                    <div className="text-[9px] text-slate-400 mt-0.5">Tiếng ping êm ái</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setSoundType('buzzer'); showToast('Đã chọn: Còi Buzzer cảnh báo bàn trạm'); }}
                    className={`p-2.5 rounded-xl border font-semibold text-left transition-all ${
                      soundType === 'buzzer' ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-2xs' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-[11px] font-bold">2. Còi Buzzer</div>
                    <div className="text-[9px] text-slate-400 mt-0.5">Tiếng bíp dứt khoát</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setSoundType('stretch'); showToast('Đã chọn: Giai điệu vươn vai thư giãn'); }}
                    className={`p-2.5 rounded-xl border font-semibold text-left transition-all ${
                      soundType === 'stretch' ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-2xs' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-[11px] font-bold">3. Giai Điệu Thư Giãn</div>
                    <div className="text-[9px] text-slate-400 mt-0.5">Giai điệu vươn vai</div>
                  </button>
                </div>
              </div>

              {/* Nút test phát âm thanh */}
              <button
                type="button"
                onClick={handleTestSound}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold border border-slate-200 text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Volume2 className="w-4 h-4 text-emerald-600" />
                <span>{isPlayingTestSound ? 'Đang Phát Âm Thanh...' : 'Phát Thử Âm Thanh Buzzer Tại Chỗ'}</span>
              </button>
            </div>

            <button
              onClick={handleSaveAllConfig}
              className="w-full py-2.5 mt-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20"
            >
              Lưu Cấu Hình Âm Thanh
            </button>
          </div>

          {/* Cột 2: Đèn LED & Quy tắc leo thang cảnh báo */}
          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-teal-50 text-teal-600">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Đèn LED Flash & Thông Báo Hiển Thị OSD
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-slate-500 font-bold">3 Mức Độ</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div>
                    <div className="font-bold text-slate-900">Bật đèn LED flash cảnh báo trên thiết bị AI</div>
                    <div className="text-slate-500 text-[11px]">Đèn nháy vàng dịu mắt nhắc nhở tư thế trước mặt</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableDeskFlash}
                    onChange={(e) => setEnableDeskFlash(e.target.checked)}
                    className="h-4 w-4 text-emerald-600 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div>
                    <div className="font-bold text-slate-900">Hiện cửa sổ nhắc nhở nổi OSD trên màn hình</div>
                    <div className="text-slate-500 text-[11px]">Thông báo popup góc phải màn hình máy tính nhân viên</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableOsdToast}
                    onChange={(e) => setEnableOsdToast(e.target.checked)}
                    className="h-4 w-4 text-emerald-600 rounded"
                  />
                </div>
              </div>

              {/* Quy tắc leo thang cảnh báo (Escalation) */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="font-bold text-slate-800">Quy Trình Leo Thang Cảnh Báo Tư Thế:</div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center gap-2 text-amber-700">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span><strong>Mức 1 (Sau 30s gù):</strong> Nháy đèn LED vàng & hiện OSD nhắc nhẹ</span>
                  </div>
                  <div className="flex items-center gap-2 text-orange-700">
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                    <span><strong>Mức 2 (Sau 60s gù):</strong> Rung chuông còi buzzer âm lượng 50%</span>
                  </div>
                  <div className="flex items-center gap-2 text-rose-700">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    <span><strong>Mức 3 (Sau 120s gù):</strong> Báo động đỏ & lưu vào lịch sử vi phạm cột sống</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveAllConfig}
              className="w-full py-2.5 mt-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20"
            >
              Lưu Cấu Hình Cảnh Báo & LED
            </button>
          </div>

        </div>
      )}

      {/* ===================== MODAL THÊM MÁY TRẠM / THIẾT BỊ MỚI ===================== */}
      {showAddPcModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-900">
                {isPersonal ? 'Thêm Thiết Bị Giám Sát Cá Nhân' : 'Thêm Máy Trạm Camera AI Mới'}
              </h4>
              <button onClick={() => setShowAddPcModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleAddPc} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mã thiết bị / PC ID:</label>
                <input
                  type="text"
                  required
                  value={newPcData.id}
                  onChange={(e) => setNewPcData({ ...newPcData, id: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tên thiết bị / Máy trạm:</label>
                <input
                  type="text"
                  required
                  value={newPcData.name}
                  onChange={(e) => setNewPcData({ ...newPcData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Địa chỉ Luồng RTSP / IP:</label>
                <input
                  type="text"
                  required
                  value={newPcData.ip}
                  onChange={(e) => setNewPcData({ ...newPcData, ip: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Gán cho người dùng:</label>
                <input
                  type="text"
                  required
                  value={newPcData.assignedTo}
                  onChange={(e) => setNewPcData({ ...newPcData, assignedTo: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Vị trí bàn làm việc:</label>
                <input
                  type="text"
                  required
                  value={newPcData.location}
                  onChange={(e) => setNewPcData({ ...newPcData, location: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddPcModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-md shadow-emerald-600/20"
                >
                  Xác Nhận Thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

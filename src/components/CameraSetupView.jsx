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
  Save, 
  PlusCircle, 
  X,
  Search,
  Filter,
  Check,
  Ban,
  Calendar
} from 'lucide-react';
import AiVisionFeed from './AiVisionFeed';
import { INITIAL_PROCESS_RULES } from '../data/mockData';

export default function CameraSetupView({ cameras = [], members = [], onUpdateCameras }) {
  const [activeTab, setActiveTab] = useState('devices'); // 'devices' | 'ai_config' | 'processes' | 'automation' | 'alerts'
  const [cameraList, setCameraList] = useState(cameras);
  const [selectedCamId, setSelectedCamId] = useState(cameras[0]?.id || 'PC-01');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected camera
  const selectedCam = cameraList.find(c => c.id === selectedCamId) || cameraList[0] || {};

  // Global & Per-Cam Config States
  const [enableExternalCam, setEnableExternalCam] = useState(true);
  const [enablePostureTracking, setEnablePostureTracking] = useState(true);
  const [enableWorkDetection, setEnableWorkDetection] = useState(true);
  const [enableScreenProcessRecording, setEnableScreenProcessRecording] = useState(true);
  const [enableMouseKeyboardTracking, setEnableMouseKeyboardTracking] = useState(true);
  const [aiSensitivity, setAiSensitivity] = useState(85);
  const [neckAngleThreshold, setNeckAngleThreshold] = useState(25);
  const [slouchDurationSec, setSlouchDurationSec] = useState(60);

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

  // Alert buzzer configs
  const [buzzerVolume, setBuzzerVolume] = useState(80);
  const [enableDeskFlash, setEnableDeskFlash] = useState(true);

  // Modal Add New PC
  const [showAddPcModal, setShowAddPcModal] = useState(false);
  const [newPcData, setNewPcData] = useState({
    id: `PC-${String(cameraList.length + 1).padStart(2, '0')}`,
    name: `Máy Trạm ${String(cameraList.length + 1).padStart(2, '0')} - Nhân Viên Mới`,
    ip: `192.168.1.${100 + cameraList.length + 1}:554/rtsp`,
    assignedTo: 'Nhân Viên Mới',
    department: 'Phòng Phát Triển Sản Phẩm (R&D)',
    location: 'Tầng 3 - Bàn R&D-Mới',
    status: 'online'
  });

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Add PC
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
      webcamUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
      lastCalibration: '2026-11-01 08:00',
      slouchThresholdSec: slouchDurationSec,
      sensitivity: aiSensitivity,
      distanceCm: 60,
      neckAngleLimit: neckAngleThreshold,
      activeProcess: 'VS Code',
      isProcessViolating: false,
      screenRecorded: true,
      mouseKeyboardActive: true,
      aiPostureCheck: true,
      aiWorkDetection: true,
    };

    const updated = [newPc, ...cameraList];
    setCameraList(updated);
    if (onUpdateCameras) onUpdateCameras(updated);
    setShowAddPcModal(false);
    showToast(`Đã thêm thành công máy trạm "${newPc.name}" vào hệ thống!`);
  };

  // Delete PC
  const handleDeletePc = (id) => {
    if (cameraList.length <= 1) {
      showToast('Phải giữ lại tối thiểu 1 máy trạm trong hệ thống!');
      return;
    }
    const updated = cameraList.filter(c => c.id !== id);
    setCameraList(updated);
    if (onUpdateCameras) onUpdateCameras(updated);
    if (selectedCamId === id) setSelectedCamId(updated[0]?.id || '');
    showToast(`Đã xóa máy trạm ${id} khỏi hệ thống.`);
  };

  // Save Config
  const handleSaveAllConfig = () => {
    showToast('Tất cả cấu hình Model AI, Camera, Tiến trình & Lịch trình tự động đã được lưu thành công!');
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

  const filteredCams = cameraList.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-3 w-full">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-xl text-xs font-semibold animate-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs & Nút Lưu Toàn Bộ Cấu Hình (Cân đối toàn màn hình, không có ô chữ giải thích thừa) */}
      <div className="p-3 bg-white border border-slate-200 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 text-xs shadow-xs w-full">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setActiveTab('devices')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all font-semibold shrink-0 ${
              activeTab === 'devices'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>1. Quản Lý Thiết Bị ({cameraList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_config')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all font-semibold shrink-0 ${
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
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all font-semibold shrink-0 ${
              activeTab === 'processes'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Ban className="w-4 h-4" />
            <span>3. Cấm & Cho Phép Tiến Trình</span>
          </button>

          <button
            onClick={() => setActiveTab('automation')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all font-semibold shrink-0 ${
              activeTab === 'automation'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>4. Tự Động Hóa & Lịch Trình</span>
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all font-semibold shrink-0 ${
              activeTab === 'alerts'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>5. Chuông Cảnh Báo</span>
          </button>
        </div>

        <button
          onClick={handleSaveAllConfig}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all shrink-0 w-full md:w-auto"
        >
          <Save className="w-4 h-4" />
          <span>Lưu Cấu Hình</span>
        </button>
      </div>

      {/* ===================== TAB 1: QUẢN LÝ MÁY & THÊM/XÓA MÁY TRẠM ===================== */}
      {activeTab === 'devices' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full">
          
          {/* Cột trái (5 cols): Danh sách máy tính */}
          <div className="lg:col-span-5 space-y-3">
            <div className="p-3 bg-white border border-slate-200 rounded-2xl flex items-center justify-between gap-2 text-xs shadow-xs">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm máy trạm, nhân viên..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                onClick={() => setShowAddPcModal(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-xs shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm Máy Mới</span>
              </button>
            </div>

            {/* List cuộn các máy trạm */}
            <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
              {filteredCams.map(cam => (
                <div
                  key={cam.id}
                  onClick={() => setSelectedCamId(cam.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    selectedCamId === cam.id
                      ? 'bg-emerald-50/80 border-emerald-500 shadow-sm ring-1 ring-emerald-400/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img src={cam.webcamUrl} alt={cam.name} className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">{cam.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">{cam.location}</div>
                      <div className="text-[10px] text-emerald-600 font-mono truncate">{cam.ip}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePc(cam.id);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Xóa máy"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cột phải (7 cols): Xem trực tiếp camera máy đang chọn & Cấu hình nhanh */}
          <div className="lg:col-span-7 space-y-3">
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{selectedCam.name}</h4>
                  <div className="text-xs text-slate-500">{selectedCam.location} • Gán cho: <strong>{selectedCam.assignedTo}</strong></div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {selectedCam.ip}
                </span>
              </div>

              {/* Màn hình camera với Vị trí & Giờ thực OSD */}
              <AiVisionFeed
                camName={selectedCam.name}
                camId={selectedCam.id}
                memberName={selectedCam.assignedTo}
                location={selectedCam.location}
                webcamUrl={selectedCam.webcamUrl}
                initialPosture={selectedCam.currentPosture || 'good'}
                height="h-80"
                showHeader={true}
                showControls={true}
              />

              {/* Thông tin phần cứng & Cấu hình máy */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <div className="text-slate-400 text-[10px]">Độ phân giải</div>
                  <div className="font-bold text-slate-800 font-mono">1080P @ 30FPS</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <div className="text-slate-400 text-[10px]">Theo dõi chuột & phím</div>
                  <div className="font-bold text-emerald-600">Đang bật</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <div className="text-slate-400 text-[10px]">Ghi nhận màn hình</div>
                  <div className="font-bold text-emerald-600">Bật (Screen Agent)</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <div className="text-slate-400 text-[10px]">Hiệu chuẩn AI</div>
                  <div className="font-bold text-slate-800 font-mono">2026-11-01</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ===================== TAB 2: CẤU HÌNH MODEL AI (CÂN BẰNG TOÀN CHIỀU RỘNG) ===================== */}
      {activeTab === 'ai_config' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 w-full">
          
          {/* Box 1: Bật/Tắt tính năng model */}
          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 pb-2 border-b border-slate-100">
              Các tính năng Model AI Giám Sát:
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Quay Camera Ngoài (Webcam POV)</div>
                    <div className="text-slate-500 text-[11px]">Thu hình ảnh người ngồi làm việc tại bàn</div>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={enableExternalCam} 
                  onChange={(e) => setEnableExternalCam(e.target.checked)}
                  className="h-4 w-4 text-emerald-600 rounded" 
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-teal-100 text-teal-700">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Theo Dõi & Điều Chỉnh Tư Thế (AI Pose Estimation)</div>
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

              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Xem Nhân Viên Có Đang Làm Việc Không</div>
                    <div className="text-slate-500 text-[11px]">Phát hiện rời khỏi vị trí, ngủ gật, bấm điện thoại</div>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={enableWorkDetection} 
                  onChange={(e) => setEnableWorkDetection(e.target.checked)}
                  className="h-4 w-4 text-emerald-600 rounded" 
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                    <Monitor className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Quay Tiến Trình Màn Hình Máy Tính</div>
                    <div className="text-slate-500 text-[11px]">Theo dõi và ghi video màn hình làm việc</div>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={enableScreenProcessRecording} 
                  onChange={(e) => setEnableScreenProcessRecording(e.target.checked)}
                  className="h-4 w-4 text-emerald-600 rounded" 
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                    <MousePointer className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Theo Dõi Chuột & Bàn Phím</div>
                    <div className="text-slate-500 text-[11px]">Ghi nhận nhịp thao tác để đánh giá sự tích cực</div>
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
          </div>

          {/* Box 2: Tinh chỉnh tham số Model AI */}
          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 pb-2 border-b border-slate-100 mb-3">
                Thông Số Kỹ Thuật Model AI:
              </h4>

              <div className="space-y-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>Độ nhạy AI nhận diện tư thế:</span>
                    <span className="font-mono text-emerald-600 font-bold">{aiSensitivity}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="99"
                    value={aiSensitivity}
                    onChange={(e) => setAiSensitivity(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                  <div className="text-[10px] text-slate-400 mt-1">Khuyến nghị: 80% - 90% cho môi trường văn phòng</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>Ngưỡng góc cúi rướn cổ:</span>
                    <span className="font-mono text-emerald-600 font-bold">{neckAngleThreshold}°</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="40"
                    value={neckAngleThreshold}
                    onChange={(e) => setNeckAngleThreshold(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                  <div className="text-[10px] text-slate-400 mt-1">Khi góc gập cổ vượt ngưỡng này, cảnh báo sẽ kích hoạt</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>Thời gian giữ tư thế sai để báo động:</span>
                    <span className="font-mono text-emerald-600 font-bold">{slouchDurationSec} giây</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="180"
                    step="10"
                    value={slouchDurationSec}
                    onChange={(e) => setSlouchDurationSec(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                  <div className="text-[10px] text-slate-400 mt-1">Tránh báo động giả khi nhân viên chỉ cúi người nhặt đồ</div>
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveAllConfig}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20"
            >
              Lưu Thiết Lập Model AI
            </button>
          </div>

        </div>
      )}

      {/* ===================== TAB 3: CẤM & CHO PHÉP TIẾN TRÌNH ===================== */}
      {activeTab === 'processes' && (
        <div className="space-y-4 w-full">
          
          {/* Thêm tiến trình */}
          <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
            <form onSubmit={handleAddProcessRule} className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
              <input
                type="text"
                required
                value={newProcessName}
                onChange={(e) => setNewProcessName(e.target.value)}
                placeholder="Nhập tên ứng dụng (Ví dụ: Steam, League of Legends, Shopee...)"
                className="sm:col-span-5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              />

              <select
                value={newProcessType}
                onChange={(e) => setNewProcessType(e.target.value)}
                className="sm:col-span-3 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold"
              >
                <option value="blacklist">⛔ Danh sách CẤM (Blacklist)</option>
                <option value="whitelist">✓ Danh sách CHO PHÉP (Whitelist)</option>
              </select>

              <select
                value={newProcessCategory}
                onChange={(e) => setNewProcessCategory(e.target.value)}
                className="sm:col-span-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
              >
                <option>Mạng xã hội</option>
                <option>Game</option>
                <option>Mua sắm</option>
                <option>Phim ảnh</option>
                <option>Công việc</option>
              </select>

              <button
                type="submit"
                className="sm:col-span-2 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-xs"
              >
                Thêm Vào Danh Sách
              </button>
            </form>
          </div>

          {/* Grid 2 Cột: Blacklist & Whitelist trải đều 100% chiều ngang */}
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
                <span className="text-[10px] font-mono font-bold text-rose-600">Tự động chặn & tắt</span>
              </div>

              <div className="space-y-2">
                {processRules.blacklist.map(item => (
                  <div key={item.id} className="p-3 bg-rose-50/60 border border-rose-200 rounded-xl flex items-center justify-between gap-2 text-xs">
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
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-100 rounded-lg"
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
                <span className="text-[10px] font-mono font-bold text-emerald-600">Ưu tiên năng suất</span>
              </div>

              <div className="space-y-2">
                {processRules.whitelist.map(item => (
                  <div key={item.id} className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl flex items-center justify-between gap-2 text-xs">
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
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg"
                      title="Gỡ bỏ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ===================== TAB 4: TỰ ĐỘNG HÓA & LỊCH TRÌNH ===================== */}
      {activeTab === 'automation' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
          
          {/* Cột trái: Kích hoạt & Ca sáng */}
          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
              <div>
                <div className="font-bold text-emerald-950 text-sm">Lịch Trình Tự Động Hóa Toàn Hệ Thống</div>
                <div className="text-emerald-800 text-[11px]">Tự động bật camera & tắt app vi phạm theo giờ</div>
              </div>
              <input
                type="checkbox"
                checked={automationEnabled}
                onChange={(e) => setAutomationEnabled(e.target.checked)}
                className="h-5 w-5 text-emerald-600 rounded"
              />
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs">
              <div className="font-bold text-slate-800 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Khung Giờ Ca Sáng:</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 font-medium">Bắt đầu:</label>
                  <input
                    type="time"
                    value={morningStart}
                    onChange={(e) => setMorningStart(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-medium">Kết thúc:</label>
                  <input
                    type="time"
                    value={morningEnd}
                    onChange={(e) => setMorningEnd(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Cột phải: Ca chiều & Tự động đóng */}
          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs">
                <div className="font-bold text-slate-800 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>Khung Giờ Ca Chiều:</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500 font-medium">Bắt đầu:</label>
                    <input
                      type="time"
                      value={afternoonStart}
                      onChange={(e) => setAfternoonStart(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-medium">Kết thúc:</label>
                    <input
                      type="time"
                      value={afternoonEnd}
                      onChange={(e) => setAfternoonEnd(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <div className="font-semibold text-slate-800">Tự động đóng cưỡng chế (Auto-Kill) tiến trình cấm khi đến giờ</div>
                  <div className="text-slate-500 text-[11px]">Đảm bảo 100% nhân viên không mở ứng dụng ngoài luồng</div>
                </div>
                <input
                  type="checkbox"
                  checked={autoKillBlacklist}
                  onChange={(e) => setAutoKillBlacklist(e.target.checked)}
                  className="h-4 w-4 text-emerald-600 rounded"
                />
              </div>
            </div>

            <button
              onClick={handleSaveAllConfig}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20"
            >
              Lưu Lịch Trình Tự Động Hóa
            </button>
          </div>

        </div>
      )}

      {/* ===================== TAB 5: CẢNH BÁO & CHUÔNG BÁO TƯ THẾ ===================== */}
      {activeTab === 'alerts' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 pb-2 border-b border-slate-100">
              Cài Đặt Âm Lượng & Còi Buzzer:
            </h4>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex justify-between font-semibold text-slate-800">
                  <span>Âm lượng còi Buzzer tại bàn:</span>
                  <span className="font-mono text-emerald-600 font-bold">{buzzerVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={buzzerVolume}
                  onChange={(e) => setBuzzerVolume(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <div>
                  <div className="font-bold text-slate-900">Bật đèn LED flash cảnh báo trên thiết bị AI</div>
                  <div className="text-slate-500 text-[11px]">Đèn nháy vàng cảnh báo nhẹ khi gù lưng</div>
                </div>
                <input
                  type="checkbox"
                  checked={enableDeskFlash}
                  onChange={(e) => setEnableDeskFlash(e.target.checked)}
                  className="h-4 w-4 text-emerald-600 rounded"
                />
              </div>
            </div>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 pb-2 border-b border-slate-100 mb-3">
                Thử Nghiệm Cảnh Báo:
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Kiểm tra loa buzzer và chuông cảnh báo công thái học tới toàn bộ máy bàn nhân viên để đảm bảo tín hiệu hoạt động chuẩn xác.
              </p>
              <button
                onClick={() => showToast('Đã phát âm thanh thử nghiệm buzzer tới tất cả máy bàn!')}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold border border-slate-200 text-xs transition-colors"
              >
                Phát Thử Chuông Báo Thử Nghiệm Toàn Phòng
              </button>
            </div>

            <button
              onClick={handleSaveAllConfig}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20"
            >
              Lưu Cấu Hình Cảnh Báo
            </button>
          </div>
        </div>
      )}

      {/* MODAL THÊM MÁY MỚI */}
      {showAddPcModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-900">Thêm Máy Tính Theo Dõi Mới</h4>
              <button onClick={() => setShowAddPcModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleAddPc} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mã Máy Tính / Trạm:</label>
                <input
                  type="text"
                  required
                  value={newPcData.id}
                  onChange={(e) => setNewPcData({ ...newPcData, id: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tên Máy / Vị trí:</label>
                <input
                  type="text"
                  required
                  value={newPcData.name}
                  onChange={(e) => setNewPcData({ ...newPcData, name: e.target.value })}
                  placeholder="Ví dụ: Máy Trạm 33 - Hoàng Văn Nam"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Địa chỉ IP RTSP / Agent:</label>
                <input
                  type="text"
                  required
                  value={newPcData.ip}
                  onChange={(e) => setNewPcData({ ...newPcData, ip: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Gán Nhân Viên:</label>
                <input
                  type="text"
                  required
                  value={newPcData.assignedTo}
                  onChange={(e) => setNewPcData({ ...newPcData, assignedTo: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phòng Ban:</label>
                <select
                  value={newPcData.department}
                  onChange={(e) => setNewPcData({ ...newPcData, department: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                >
                  <option>Phòng Phát Triển Sản Phẩm (R&D)</option>
                  <option>Phòng Marketing & Truyền Thông</option>
                  <option>Phòng Tài Chính Kế Toán</option>
                  <option>Phòng Thiết Kế UI/UX</option>
                  <option>Phòng Kinh Doanh & Bán Hàng</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPcModal(false)}
                  className="px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-xs"
                >
                  Thêm Máy Vào Hệ Thống
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

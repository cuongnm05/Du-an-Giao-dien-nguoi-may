import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Monitor, 
  Keyboard, 
  MousePointer, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Bell, 
  Maximize2, 
  Minimize2, 
  Volume2, 
  Play, 
  Pause, 
  Square, 
  ShieldAlert, 
  ShieldCheck, 
  Smartphone, 
  Moon, 
  Sparkles, 
  RefreshCw, 
  Download, 
  Sliders, 
  Clock, 
  Cpu, 
  Activity, 
  Flame, 
  Film, 
  Eye, 
  Check, 
  Ban,
  Radio,
  FileText
} from 'lucide-react';
import { SCREEN_STREAM_IMAGES } from '../data/mockData';

export default function WorkstationInspectorModal({ 
  cam, 
  member, 
  onClose, 
  onSendBuzzer 
}) {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'webcam' | 'screen' | 'input'
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [snapshotTaken, setSnapshotTaken] = useState(false);
  const [processKilled, setProcessKilled] = useState(false);
  const [modalToast, setModalToast] = useState(null);
  const [liveClock, setLiveClock] = useState(() => new Date().toLocaleTimeString('vi-VN'));
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Live timer tick
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveClock(new Date().toLocaleTimeString('vi-VN'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Recording counter
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordSeconds(s => s + 1);
      }, 1000);
    } else {
      setRecordSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const showToast = (msg) => {
    setModalToast(msg);
    setTimeout(() => setModalToast(null), 3500);
  };

  if (!cam) return null;

  const currentPosture = member?.currentPosture || cam.currentPosture || 'good';
  const isWarning = currentPosture === 'slouching' || currentPosture === 'phone' || currentPosture === 'sleeping' || cam.isProcessViolating;

  // Posture detailed analysis
  const postureDetails = {
    good: {
      label: 'TƯ THẾ CHUẨN CÔNG THÁI HỌC',
      color: 'emerald',
      spineAngle: 96,
      neckAngle: 12,
      distanceCm: 62,
      actionDesc: 'Đang làm việc tập trung, góc lưng 96°, khoảng cách mắt màn hình lý tưởng.',
      icon: ShieldCheck
    },
    slouching: {
      label: 'CẢNH BÁO: GÙ LƯNG / VẸO CỘT SỐNG',
      color: 'rose',
      spineAngle: 38,
      neckAngle: 42,
      distanceCm: 34,
      actionDesc: 'Lưng gập góc 38°, cúi sát màn hình 34cm gây áp lực đĩa đệm đốt sống cổ C4-C6.',
      icon: AlertTriangle
    },
    phone: {
      label: 'PHÁT HIỆN: SỬ DỤNG ĐIỆN THOẠI DI ĐỘNG',
      color: 'purple',
      spineAngle: 68,
      neckAngle: 54,
      distanceCm: 25,
      actionDesc: 'Tay cầm smartphone, mắt rời khỏi màn hình máy tính 12 phút trong giờ cao điểm.',
      icon: Smartphone
    },
    sleeping: {
      label: 'PHÁT HIỆN: NGỦ GẬT / MẤT TẬP TRUNG',
      color: 'rose',
      spineAngle: 25,
      neckAngle: 65,
      distanceCm: 18,
      actionDesc: 'Đầu gục xuống mặt bàn, không phát hiện chuyển động mắt hoặc thao tác bàn phím.',
      icon: Moon
    },
    away: {
      label: 'TRẠNG THÁI: RỜI KHỎI VỊ TRÍ',
      color: 'amber',
      spineAngle: 0,
      neckAngle: 0,
      distanceCm: 0,
      actionDesc: 'Vắng mặt tại bàn làm việc hơn 8 phút.',
      icon: Activity
    }
  }[currentPosture] || {
    label: 'TƯ THẾ BÌNH THƯỜNG',
    color: 'emerald',
    spineAngle: 92,
    neckAngle: 14,
    distanceCm: 58,
    actionDesc: 'Đang thực hiện công việc theo kế hoạch.',
    icon: ShieldCheck
  };

  const currentScreenImage = processKilled 
    ? SCREEN_STREAM_IMAGES.vscode 
    : (cam.screenStream?.screenUrl || SCREEN_STREAM_IMAGES.vscode);

  const currentActiveWindow = processKilled 
    ? 'Visual Studio Code - Production Codebase' 
    : (cam.screenStream?.activeWindow || `${cam.activeProcess || 'code.exe'} - Cửa sổ chính`);

  const currentProcessName = processKilled 
    ? 'code.exe' 
    : (cam.screenStream?.processName || cam.activeProcess || 'code.exe');

  const isCurrentViolation = !processKilled && (cam.isProcessViolating || currentPosture === 'phone');

  // Trigger buzzer
  const handleTriggerBuzzer = () => {
    if (onSendBuzzer) {
      onSendBuzzer(member || { name: cam.assignedTo });
    }
    showToast(`🔔 Đã kích hoạt chuông âm lượng cảnh báo đến máy ${cam.id} (${cam.assignedTo})!`);
  };

  // Send posture tip
  const handleSendPostureTip = () => {
    showToast(`🧘 Đã đẩy thông báo popup hướng dẫn "Bài tập giãn cơ vai gáy 2 phút" tới màn hình nhân viên!`);
  };

  // Take snapshot
  const handleTakeSnapshot = () => {
    setSnapshotTaken(true);
    const snapId = `SNAP-${Math.floor(1000 + Math.random() * 9000)}`;
    showToast(`📸 Đã chụp và lưu trữ ảnh snapshot bằng chứng #${snapId} vào hồ sơ giám sát!`);
    setTimeout(() => setSnapshotTaken(false), 2000);
  };

  // Toggle recording
  const handleToggleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      showToast(`💾 Đã kết thúc và tự động xuất bản ghi video clip (${recordSeconds}s) vào mục "Dữ Liệu & Bản Ghi"!`);
    } else {
      setIsRecording(true);
      showToast(`⏺️ Bắt đầu trích xuất clip camera HD & màn hình máy ${cam.id}...`);
    }
  };

  // Terminate app
  const handleKillApp = () => {
    setProcessKilled(true);
    showToast(`⛔ Đã gửi lệnh Taskkill buộc dừng tiến trình vi phạm "${currentProcessName}" trên máy trạm từ xa!`);
  };

  // Export Telemetry
  const handleExportLog = () => {
    showToast(`📄 Đã tải xuống báo cáo chi tiết vi phạm tư thế & tiến trình máy ${cam.id} định dạng .PDF!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Toast Inside Modal */}
      {modalToast && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-60 flex items-center gap-2.5 px-4 py-3 bg-emerald-600 text-white rounded-2xl shadow-2xl text-xs font-semibold animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{modalToast}</span>
        </div>
      )}

      {/* Main Modal Card */}
      <div className="relative w-full max-w-6xl max-h-[95vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-slate-800">
        
        {/* Top Header Bar */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-white">{cam.id}</span>
                <span className="text-slate-400">•</span>
                <span className="font-bold text-sm text-slate-100">{cam.name || cam.assignedTo}</span>
                <span className="text-slate-400">•</span>
                <span className="text-xs text-slate-300">{cam.location}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  LIVE 30 FPS
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5 font-mono">
                <span>IP: {cam.ip || '192.168.1.101'}</span>
                <span>•</span>
                <span>OS: Windows 11 Pro Enterprise</span>
                <span>•</span>
                <span className="text-amber-300">{liveClock}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View stream selector buttons */}
            <div className="hidden md:flex items-center bg-slate-800 p-1 rounded-xl text-xs font-semibold text-slate-300 border border-slate-700">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 rounded-lg transition-all ${activeTab === 'all' ? 'bg-emerald-600 text-white' : 'hover:text-white'}`}
              >
                3 Luồng Toàn Diện
              </button>
              <button
                onClick={() => setActiveTab('webcam')}
                className={`px-3 py-1 rounded-lg transition-all ${activeTab === 'webcam' ? 'bg-emerald-600 text-white' : 'hover:text-white'}`}
              >
                Cam Ngoài AI
              </button>
              <button
                onClick={() => setActiveTab('screen')}
                className={`px-3 py-1 rounded-lg transition-all ${activeTab === 'screen' ? 'bg-emerald-600 text-white' : 'hover:text-white'}`}
              >
                Màn Hình Desktop
              </button>
              <button
                onClick={() => setActiveTab('input')}
                className={`px-3 py-1 rounded-lg transition-all ${activeTab === 'input' ? 'bg-emerald-600 text-white' : 'hover:text-white'}`}
              >
                Phím & Chuột
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white transition-colors"
              title="Đóng cửa sổ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50">
          
          {/* Real-time Action Banner */}
          <div className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-3 ${
            isWarning 
              ? 'bg-rose-50 border-rose-200 text-rose-900' 
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`p-2.5 rounded-xl ${isWarning ? 'bg-rose-500 text-white' : 'bg-emerald-600 text-white'}`}>
                {isWarning ? <AlertTriangle className="w-6 h-6 animate-bounce" /> : <ShieldCheck className="w-6 h-6" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm tracking-wide uppercase">
                    {postureDetails.label}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-mono font-bold bg-white/80 shadow-2xs">
                    Điểm tư thế: {member?.ergonomicsScore || 92}/100
                  </span>
                </div>
                <p className="text-xs text-slate-700 mt-1 font-medium leading-relaxed">
                  {postureDetails.actionDesc}
                </p>
              </div>
            </div>

            {/* Quick Action Reminders in Banner */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleTriggerBuzzer}
                className="flex items-center gap-1.5 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95"
              >
                <Bell className="w-4 h-4" />
                <span>Rung Chuông Nhắc Nhở</span>
              </button>
              <button
                onClick={handleSendPostureTip}
                className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-semibold border border-slate-300 transition-all"
              >
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Gửi Bài Tập Giãn Cơ</span>
              </button>
            </div>
          </div>

          {/* Video Streams Container */}
          <div className={`grid gap-4 ${
            activeTab === 'all' 
              ? 'grid-cols-1 lg:grid-cols-12' 
              : 'grid-cols-1'
          }`}>
            
            {/* Stream 1: Cam Ngoài AI (Full HD Enlarged with Skeleton Simulation) */}
            {(activeTab === 'all' || activeTab === 'webcam') && (
              <div className={`bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-md flex flex-col ${
                activeTab === 'all' ? 'lg:col-span-7' : 'w-full'
              }`}>
                {/* Stream Subtitle Bar */}
                <div className="px-3 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                    <span className="font-bold text-white">LUỒNG 1: CAM NGOÀI GIÁM SÁT TƯ THẾ AI</span>
                  </div>
                  <div className="font-mono text-[11px] text-emerald-400">
                    AI Pose Estimation • 33 Landmarks
                  </div>
                </div>

                {/* Video / Webcam Display */}
                <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
                  <img
                    src={cam.webcamUrl}
                    alt={cam.name}
                    className={`w-full h-full object-cover filter contrast-[1.05] brightness-95 ${snapshotTaken ? 'brightness-150 transition-all duration-300' : ''}`}
                  />

                  {/* Simulated AI Skeleton Vector Overlay */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 640 360">
                    {/* Head to Neck */}
                    <circle cx="320" cy="110" r="14" fill="none" stroke={isWarning ? "#f43f5e" : "#10b981"} strokeWidth="2.5" />
                    {/* Spine line */}
                    <line x1="320" y1="124" x2="320" y2="210" stroke={isWarning ? "#f43f5e" : "#10b981"} strokeWidth="3" strokeDasharray={isWarning ? "4,4" : "none"} />
                    {/* Shoulders */}
                    <line x1="260" y1="150" x2="380" y2="150" stroke={isWarning ? "#f43f5e" : "#10b981"} strokeWidth="3" />
                    {/* Left Arm */}
                    <line x1="260" y1="150" x2="230" y2="210" stroke="#0ea5e9" strokeWidth="2.5" />
                    <line x1="230" y1="210" x2="270" y2="260" stroke="#0ea5e9" strokeWidth="2.5" />
                    {/* Right Arm */}
                    <line x1="380" y1="150" x2="410" y2="210" stroke="#0ea5e9" strokeWidth="2.5" />
                    <line x1="410" y1="210" x2="370" y2="260" stroke="#0ea5e9" strokeWidth="2.5" />
                    {/* Angle labels */}
                    <text x="330" y="180" fill={isWarning ? "#f43f5e" : "#10b981"} fontSize="13" fontWeight="bold" fontFamily="monospace">
                      {postureDetails.spineAngle}°
                    </text>
                  </svg>

                  {/* OSD Watermark */}
                  <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-mono text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                    <span>REC: {liveClock}</span>
                  </div>

                  {isRecording && (
                    <div className="absolute top-3 right-3 bg-rose-600/90 text-white px-3 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-white"></span>
                      <span>RECORDING {recordSeconds}s</span>
                    </div>
                  )}

                  {/* Bottom Metrics HUD */}
                  <div className="absolute bottom-3 left-3 right-3 bg-black/80 backdrop-blur-md p-2.5 rounded-xl border border-white/10 flex items-center justify-between text-xs text-white">
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Góc Cột Sống</span>
                        <span className={`font-mono font-bold ${isWarning ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {postureDetails.spineAngle}° {isWarning ? '(Gù)' : '(Chuẩn)'}
                        </span>
                      </div>
                      <div className="border-l border-white/10 pl-4">
                        <span className="text-[10px] text-slate-400 block">Nghiêng Cổ</span>
                        <span className="font-mono font-bold text-amber-300">{postureDetails.neckAngle}°</span>
                      </div>
                      <div className="border-l border-white/10 pl-4">
                        <span className="text-[10px] text-slate-400 block">Cự Ly Mắt - Màn</span>
                        <span className="font-mono font-bold text-teal-300">{postureDetails.distanceCm} cm</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Trạng Thái AI</span>
                      <span className="font-bold text-emerald-400">Phát hiện người: 100%</span>
                    </div>
                  </div>
                </div>

                {/* Webcam Controls */}
                <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleTakeSnapshot}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-all"
                    >
                      <Camera className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Chụp Snapshot Bằng Chứng</span>
                    </button>
                    <button
                      onClick={handleToggleRecord}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isRecording 
                          ? 'bg-rose-600 hover:bg-rose-700 text-white' 
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                      }`}
                    >
                      <Film className="w-3.5 h-3.5" />
                      <span>{isRecording ? 'Dừng Ghi Hình' : 'Ghi Clip 15 Phút'}</span>
                    </button>
                  </div>
                  <button
                    onClick={handleExportLog}
                    className="flex items-center gap-1 text-slate-400 hover:text-white text-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Xuất Log</span>
                  </button>
                </div>
              </div>
            )}

            {/* Stream 2 & 3: Màn hình Desktop & Nhập liệu phím chuột */}
            <div className={`space-y-4 ${activeTab === 'all' ? 'lg:col-span-5' : 'w-full'}`}>
              
              {/* Stream 2: Quay Màn Hình Máy Tính */}
              {(activeTab === 'all' || activeTab === 'screen') && (
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                  <div className="px-3.5 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-slate-900">LUỒNG 2: MÀN HÌNH MÁY TÍNH HIỆN TẠI</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      isCurrentViolation ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {isCurrentViolation ? '⚠ TIẾN TRÌNH VI PHẠM' : '✓ HỢP LỆ'}
                    </span>
                  </div>

                  {/* Screen preview */}
                  <div className="relative aspect-video bg-slate-950 overflow-hidden group">
                    <img
                      src={currentScreenImage}
                      alt="Screen Stream"
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute bottom-2 left-2 right-2 p-2 rounded-xl bg-black/80 backdrop-blur-md text-[11px] text-white flex items-center justify-between">
                      <div className="truncate pr-2">
                        <span className="text-slate-400 text-[10px] block">Cửa sổ đang làm việc:</span>
                        <span className="font-semibold truncate">{currentActiveWindow}</span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
                        {currentProcessName}
                      </span>
                    </div>
                  </div>

                  {/* Process Action Bar */}
                  <div className="p-2.5 bg-slate-50 flex items-center justify-between text-xs">
                    <div className="text-[11px] text-slate-500 font-mono">
                      CPU: 22% • RAM: 3.2 GB
                    </div>
                    {isCurrentViolation && (
                      <button
                        onClick={handleKillApp}
                        className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-2xs"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>Đóng Tiến Trình Vi Phạm</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Stream 3: Giám Sát Nhập Liệu Bàn Phím & Chuột */}
              {(activeTab === 'all' || activeTab === 'input') && (
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
                  <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <Keyboard className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-slate-900">LUỒNG 3: TELEMETRY BÀN PHÍM & CHUỘT</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                      ACTIVE (Hoạt động)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl">
                      <div className="flex items-center justify-between text-xs text-purple-700 mb-1">
                        <span className="font-semibold">Tốc Độ Gõ Phím</span>
                        <Keyboard className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-xl font-bold font-mono text-purple-900">
                        {cam.inputTelemetry?.wpm || 68} <span className="text-xs font-sans font-normal text-purple-700">WPM</span>
                      </div>
                      <div className="text-[10px] text-purple-600 mt-0.5">Khoảng 340 ký tự/phút</div>
                    </div>

                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                      <div className="flex items-center justify-between text-xs text-blue-700 mb-1">
                        <span className="font-semibold">Thao Tác Chuột</span>
                        <MousePointer className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-xl font-bold font-mono text-blue-900">
                        {cam.inputTelemetry?.mouseCpm || 38} <span className="text-xs font-sans font-normal text-blue-700">CPM</span>
                      </div>
                      <div className="text-[10px] text-blue-600 mt-0.5">Click & Cuộn trang liên tục</div>
                    </div>
                  </div>

                  {/* Input status bar */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                      <span>Trạng thái nhập liệu: <b>Liên tục, không gián đoạn</b></span>
                    </div>
                    <span className="text-emerald-700 font-bold">Độ tập trung: 94%</span>
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Employee & Workstation Details Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-xs">
              <span className="text-slate-400 text-[10px] block font-semibold uppercase">Nhân Sự Phụ Trách Máy</span>
              <div className="font-bold text-slate-900 text-sm mt-0.5">{member?.name || cam.assignedTo}</div>
              <div className="text-xs text-slate-500 mt-0.5">{member?.role || 'Chuyên viên'} • {cam.location}</div>
            </div>

            <div className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-xs">
              <span className="text-slate-400 text-[10px] block font-semibold uppercase">Thời Gian Bắt Đầu Phiên</span>
              <div className="font-bold text-slate-900 text-sm mt-0.5 font-mono">08:00 - Hiện tại (6h 25m)</div>
              <div className="text-xs text-emerald-600 mt-0.5 font-medium">Đã hoàn thành 80% chỉ tiêu</div>
            </div>

            <div className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-xs">
              <span className="text-slate-400 text-[10px] block font-semibold uppercase">Xếp Hạng & Điểm Tuần</span>
              <div className="font-bold text-slate-900 text-sm mt-0.5">
                Top {member?.rank || 3} • {member?.ergonomicsScore || 92} Điểm
              </div>
              <div className="text-xs text-amber-600 mt-0.5 font-semibold">★ Huy hiệu Ergonomics Vàng</div>
            </div>

            <div className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-xs flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-[10px] block font-semibold uppercase">Âm Thanh & Mic Cam</span>
                <div className="font-bold text-slate-900 text-sm mt-0.5">
                  {soundEnabled ? 'Đang Bật Mic' : 'Đã Tắt Mic'}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">Độ ồn môi trường: 42 dB</div>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-xl border ${soundEnabled ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-100 border-slate-200 text-slate-500'}`}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Modal Bottom Footer */}
        <div className="px-5 py-3.5 bg-white border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Hệ thống giám sát bảo mật SSL/TLS 256-bit • AI Edge Processing</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTriggerBuzzer}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <Bell className="w-4 h-4" />
              <span>Phát Chuông Cảnh Báo</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Đóng Cửa Sổ
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}


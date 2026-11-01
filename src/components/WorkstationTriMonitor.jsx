import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Monitor, 
  Keyboard, 
  MousePointer, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Zap, 
  Cpu, 
  Flame, 
  Layers, 
  Maximize2, 
  Sliders, 
  ShieldCheck, 
  ShieldAlert, 
  Eye, 
  Volume2, 
  Play, 
  Pause,
  ExternalLink,
  Laptop
} from 'lucide-react';
import AiVisionFeed from './AiVisionFeed';
import { SCREEN_STREAM_IMAGES } from '../data/mockData';

export default function WorkstationTriMonitor({
  cam = {},
  member = {},
  mode = 'enterprise',
  onAlertTrigger,
  showControls = true
}) {
  const isPersonal = mode === 'personal';

  // Chế độ xem: 'all' (3 luồng đồng thời) | 'webcam' (Cam ngoài) | 'screen' (Cam màn hình) | 'input' (Bàn phím & Chuột)
  const [viewStreamMode, setViewStreamMode] = useState('all');

  // Real-time clock for stream OSD
  const [streamClock, setStreamClock] = useState(() => new Date().toLocaleTimeString('vi-VN'));
  useEffect(() => {
    const timer = setInterval(() => {
      setStreamClock(new Date().toLocaleTimeString('vi-VN'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Screen Stream State
  const initialScreen = cam.screenStream || {
    screenUrl: SCREEN_STREAM_IMAGES.vscode,
    activeWindow: 'Visual Studio Code - Frontend Core [App.jsx]',
    processName: 'code.exe',
    category: 'Lập trình',
    isViolation: false,
    resolution: '1920x1080 @ 30fps',
    fps: 30,
    cpuUsage: '18%',
    ramUsage: '2.8 GB'
  };

  const [currentScreen, setCurrentScreen] = useState(initialScreen);

  // Keyboard & Mouse Telemetry State
  const initialInput = cam.inputTelemetry || {
    wpm: 54,
    kps: 3.6,
    totalKeystrokesToday: 12450,
    mouseCpm: 26,
    totalClicksToday: 2180,
    mouseMovementPercent: 72,
    idleDurationSec: 6,
    inputStatus: 'active_typing',
    recentKeys: ['A', 'Ctrl', 'Shift', 'Enter', 'C', 'V', 'Space', 'Tab', 'Esc'],
    lastInputTime: 'Vừa xong'
  };

  const [inputTelemetry, setInputTelemetry] = useState(initialInput);
  const [activeKeyHit, setActiveKeyHit] = useState('Ctrl');
  const [idleCounter, setIdleCounter] = useState(initialInput.idleDurationSec);
  const [recentKeyList, setRecentKeyList] = useState(['Ctrl', 'C', 'Enter', 'A', 'Space']);

  // Sync when prop cam changes
  useEffect(() => {
    if (cam.screenStream) setCurrentScreen(cam.screenStream);
    if (cam.inputTelemetry) {
      setInputTelemetry(cam.inputTelemetry);
      setIdleCounter(cam.inputTelemetry.idleDurationSec);
    }
  }, [cam]);

  // Live simulation of keystroke pulse
  useEffect(() => {
    const keySamples = ['W', 'E', 'B', 'C', 'A', 'M', 'Space', 'Enter', 'Shift', 'Ctrl', 'Alt', 'F'];
    const pulseTimer = setInterval(() => {
      if (inputTelemetry.inputStatus === 'idle') {
        setIdleCounter(prev => prev + 1);
      } else {
        setIdleCounter(prev => Math.max(0, prev <= 1 ? 0 : prev - 1));
        const randomKey = keySamples[Math.floor(Math.random() * keySamples.length)];
        setActiveKeyHit(randomKey);
        setRecentKeyList(prev => [randomKey, ...prev.slice(0, 4)]);
      }
    }, 1200);
    return () => clearInterval(pulseTimer);
  }, [inputTelemetry.inputStatus]);

  // Switch screen window simulation
  const handleSwitchScreenWindow = (type) => {
    if (type === 'vscode') {
      setCurrentScreen({
        screenUrl: SCREEN_STREAM_IMAGES.vscode,
        activeWindow: 'Visual Studio Code - Frontend Core [App.jsx]',
        processName: 'code.exe',
        category: 'Lập trình',
        isViolation: false,
        resolution: '1920x1080 @ 30fps',
        fps: 30,
        cpuUsage: '22%',
        ramUsage: '3.1 GB'
      });
      setInputTelemetry(prev => ({
        ...prev,
        wpm: 62,
        kps: 4.1,
        inputStatus: 'active_typing'
      }));
    } else if (type === 'figma') {
      setCurrentScreen({
        screenUrl: SCREEN_STREAM_IMAGES.figma,
        activeWindow: 'Figma Desktop - Design System v2.4',
        processName: 'figma.exe',
        category: 'Thiết kế UI/UX',
        isViolation: false,
        resolution: '1920x1080 @ 30fps',
        fps: 30,
        cpuUsage: '28%',
        ramUsage: '4.2 GB'
      });
      setInputTelemetry(prev => ({
        ...prev,
        wpm: 35,
        mouseCpm: 48,
        inputStatus: 'mouse_active'
      }));
    } else if (type === 'excel') {
      setCurrentScreen({
        screenUrl: SCREEN_STREAM_IMAGES.excel,
        activeWindow: 'Microsoft Excel - Bảng Cân Đối Thu Chi Q4',
        processName: 'excel.exe',
        category: 'Kế toán & Văn phòng',
        isViolation: false,
        resolution: '1920x1080 @ 30fps',
        fps: 30,
        cpuUsage: '14%',
        ramUsage: '1.9 GB'
      });
      setInputTelemetry(prev => ({
        ...prev,
        wpm: 44,
        kps: 2.8,
        inputStatus: 'active_typing'
      }));
    } else if (type === 'youtube') {
      setCurrentScreen({
        screenUrl: SCREEN_STREAM_IMAGES.youtube,
        activeWindow: 'Google Chrome - YouTube 4K: Nhạc Remix Giải Trí',
        processName: 'chrome.exe',
        category: 'Video giải trí',
        isViolation: true,
        resolution: '1920x1080 @ 30fps',
        fps: 30,
        cpuUsage: '35%',
        ramUsage: '3.8 GB'
      });
      setInputTelemetry(prev => ({
        ...prev,
        wpm: 6,
        kps: 0.4,
        inputStatus: 'low_activity'
      }));
      if (onAlertTrigger) {
        onAlertTrigger({
          type: 'process_violation',
          text: 'Cảnh báo: Phát hiện mở tab YouTube giải trí trong giờ làm việc!'
        });
      }
    } else if (type === 'social') {
      setCurrentScreen({
        screenUrl: SCREEN_STREAM_IMAGES.social,
        activeWindow: 'Google Chrome - Facebook: Bảng Tin Mạng Xã Hội',
        processName: 'chrome.exe',
        category: 'Mạng xã hội',
        isViolation: true,
        resolution: '1920x1080 @ 30fps',
        fps: 30,
        cpuUsage: '26%',
        ramUsage: '3.4 GB'
      });
      setInputTelemetry(prev => ({
        ...prev,
        wpm: 12,
        kps: 0.8,
        inputStatus: 'low_activity'
      }));
      if (onAlertTrigger) {
        onAlertTrigger({
          type: 'process_violation',
          text: 'Cảnh báo: Phát hiện mở Facebook lướt mạng xã hội!'
        });
      }
    }
  };

  // Toggle idle simulation
  const handleToggleIdle = () => {
    if (inputTelemetry.inputStatus === 'idle') {
      setInputTelemetry(prev => ({
        ...prev,
        inputStatus: 'active_typing',
        wpm: 58,
        kps: 3.8
      }));
      setIdleCounter(0);
    } else {
      setInputTelemetry(prev => ({
        ...prev,
        inputStatus: 'idle',
        wpm: 0,
        kps: 0.0,
        mouseCpm: 0
      }));
      setIdleCounter(185);
      if (onAlertTrigger) {
        onAlertTrigger({
          type: 'idle_afk',
          text: 'Cảnh báo: Máy trạm không có thao tác phím chuột trong hơn 3 phút!'
        });
      }
    }
  };

  return (
    <div className="space-y-3 w-full">
      
      {/* THANH ĐIỀU KHIỂN CHỌN CHẾ ĐỘ XEM 3 LUỒNG (TRỰC TIẾP, KHÔNG CÓ Ô CHỮ GIẢI THÍCH) */}
      <div className="p-2.5 bg-white border border-slate-200 rounded-2xl flex flex-wrap items-center justify-between gap-2.5 shadow-xs text-xs">
        
        {/* Left: Tên Máy & Trạng Thái 3 Luồng Giám Sát */}
        <div className="flex items-center gap-2">
          <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
            <Laptop className="w-4 h-4 text-emerald-600" />
            <span>{isPersonal ? 'Bàn Làm Việc & Trạm Máy Cá Nhân' : (cam.name || 'Máy Trạm 01')}</span>
          </div>
          
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-[10px] text-slate-600 font-mono">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>1. Cam Ngoài</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              <span>2. Cam Màn Hình</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${inputTelemetry.inputStatus === 'idle' ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
              <span>3. Phím & Chuột</span>
            </span>
          </div>
        </div>

        {/* Right: Bộ Chuyển Chế Độ Xem 3 Luồng */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-xl font-semibold text-[11px]">
          <button
            onClick={() => setViewStreamMode('all')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              viewStreamMode === 'all'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>3 Luồng Đồng Thời (Split)</span>
          </button>

          <button
            onClick={() => setViewStreamMode('webcam')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              viewStreamMode === 'webcam'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-emerald-600" />
            <span>1. Cam Ngoài</span>
          </button>

          <button
            onClick={() => setViewStreamMode('screen')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              viewStreamMode === 'screen'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Monitor className="w-3.5 h-3.5 text-blue-600" />
            <span>2. Cam Màn Hình</span>
          </button>

          <button
            onClick={() => setViewStreamMode('input')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              viewStreamMode === 'input'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5 text-purple-600" />
            <span>3. Bàn Phím & Chuột</span>
          </button>
        </div>
      </div>

      {/* ===================== KHUNG HIỂN THỊ CHÍNH ===================== */}
      
      {/* CHẾ ĐỘ 1: XEM 3 LUỒNG ĐỒNG THỜI (SPLIT-VIEW) */}
      {viewStreamMode === 'all' && (
        <div className="space-y-3">
          
          {/* Hàng 1: Hai màn hình song song (Cam Ngoài bên trái & Cam Màn Hình bên phải) */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            
            {/* LUỒNG 1: CAM NGOÀI (AI POSE ESTIMATION & GÓC NGỒI THỰC TẾ) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Camera className="w-4 h-4 text-emerald-600" />
                  <span>LUỒNG 1: CAM NGOÀI (TƯ THẾ & KHÔNG GIAN BÀN)</span>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  1080P @ 30FPS • AI ON
                </span>
              </div>

              <AiVisionFeed
                camName={cam.name || (isPersonal ? 'Webcam Cá Nhân' : 'Cam Ngoài Bàn Máy')}
                camId={cam.id || 'CAM-01'}
                memberName={member.name || (isPersonal ? 'Nguyễn Văn Cường' : 'Nhân sự')}
                location={cam.location || (isPersonal ? 'Home Office' : 'Văn phòng')}
                initialPosture={cam.currentPosture || 'good'}
                height="h-64 sm:h-72"
                showHeader={false}
                showControls={showControls}
              />
            </div>

            {/* LUỒNG 2: CAM QUAY MÀN HÌNH MÁY TÍNH (SCREEN CAPTURE STREAM) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Monitor className="w-4 h-4 text-blue-600" />
                  <span>LUỒNG 2: CAM QUAY MÀN HÌNH MÁY TÍNH</span>
                </div>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${
                  currentScreen.isViolation 
                    ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  {currentScreen.isViolation ? '⚠️ CẢNH BÁO VI PHẠM' : '✅ ỨNG DỤNG CÔNG VIỆC'}
                </span>
              </div>

              {/* Khung Màn Hình Máy Tính Desktop Mockup */}
              <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shadow-inner group">
                
                {/* Thanh Tiêu Đề Cửa Sổ Máy Tính (Window Titlebar) */}
                <div className="px-3 py-1.5 bg-slate-800 flex items-center justify-between text-[11px] text-slate-300 border-b border-slate-700 select-none">
                  <div className="flex items-center gap-2 truncate">
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    </div>
                    <span className="truncate font-mono font-medium">{currentScreen.activeWindow}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono shrink-0">
                    <span>CPU: {currentScreen.cpuUsage}</span>
                    <span>RAM: {currentScreen.ramUsage}</span>
                  </div>
                </div>

                {/* Hình Ảnh Live Màn Hình Máy Tính */}
                <div className="relative h-64 sm:h-72 w-full bg-slate-950 flex items-center justify-center overflow-hidden">
                  <img
                    src={currentScreen.screenUrl}
                    alt="Screen Live Stream"
                    className="w-full h-full object-cover object-center filter brightness-95"
                  />

                  {/* OSD Màn Hình Real-time */}
                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[10px] text-white font-mono flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                    <span>REC MÀN HÌNH</span>
                    <span>•</span>
                    <span>{streamClock}</span>
                  </div>

                  <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[10px] text-slate-300 font-mono">
                    {currentScreen.processName} • 1920x1080 @ 30FPS
                  </div>

                  {/* Banner Cảnh báo nổi nếu là màn hình vi phạm */}
                  {currentScreen.isViolation && (
                    <div className="absolute inset-x-3 bottom-10 bg-rose-900/90 border border-rose-500 text-white p-2 rounded-xl text-center text-xs font-bold animate-in fade-in duration-200 shadow-xl backdrop-blur-md">
                      ⚠️ PHÁT HIỆN TIẾN TRÌNH NGOÀI CÔNG VIỆC: {currentScreen.category.toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              {/* Nút bấm mô phỏng đổi tiến trình màn hình để test AI */}
              <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
                <div className="text-[11px] font-semibold text-slate-600 flex items-center justify-between">
                  <span>Mô phỏng đổi ứng dụng trên màn hình để kiểm tra AI:</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => handleSwitchScreenWindow('vscode')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                      currentScreen.processName === 'code.exe' ? 'bg-blue-600 text-white font-bold' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    💻 VS Code (Hợp lệ)
                  </button>

                  <button
                    onClick={() => handleSwitchScreenWindow('figma')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                      currentScreen.processName === 'figma.exe' ? 'bg-purple-600 text-white font-bold' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    🎨 Figma UI (Hợp lệ)
                  </button>

                  <button
                    onClick={() => handleSwitchScreenWindow('excel')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                      currentScreen.processName === 'excel.exe' ? 'bg-emerald-600 text-white font-bold' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    📊 Excel (Hợp lệ)
                  </button>

                  <button
                    onClick={() => handleSwitchScreenWindow('youtube')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                      currentScreen.category === 'Video giải trí' ? 'bg-rose-600 text-white font-bold' : 'bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100'
                    }`}
                  >
                    🎥 Xem YouTube (Vi phạm)
                  </button>

                  <button
                    onClick={() => handleSwitchScreenWindow('social')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                      currentScreen.category === 'Mạng xã hội' ? 'bg-rose-600 text-white font-bold' : 'bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100'
                    }`}
                  >
                    🌐 Facebook (Vi phạm)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Hàng 2: LUỒNG 3 - BẢNG THEO DÕI BÀN PHÍM VÀ CHUỘT (INPUT ACTIVITY TELEMETRY) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-50 text-purple-700">
                  <Keyboard className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">LUỒNG 3: THEO DÕI HOẠT ĐỘNG BÀN PHÍM & CHUỘT (INPUT TELEMETRY)</div>
                  <div className="text-[11px] text-slate-500">Giám sát nhịp gõ phím, tần suất click chuột, phát hiện treo máy (Idle/AFK)</div>
                </div>
              </div>

              {/* Trạng thái hoạt động phím chuột thời gian thực */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <span className={`px-2.5 py-1 rounded-xl font-bold flex items-center gap-1.5 text-xs ${
                  inputTelemetry.inputStatus === 'idle'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${inputTelemetry.inputStatus === 'idle' ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                  <span>
                    {inputTelemetry.inputStatus === 'idle' 
                      ? `🔴 TREO MÁY KHÔNG THAO TÁC (${idleCounter}s)` 
                      : '🟢 ĐANG THAO TÁC PHÍM CHUỘT TÍCH CỰC'}
                  </span>
                </span>

                <button
                  onClick={handleToggleIdle}
                  className={`px-3 py-1 rounded-xl font-semibold border transition-all text-[11px] ${
                    inputTelemetry.inputStatus === 'idle'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  {inputTelemetry.inputStatus === 'idle' ? 'Hủy Treo Máy (Làm Lại)' : 'Mô Phỏng Treo Máy (AFK)'}
                </button>
              </div>
            </div>

            {/* Grid 4 Chỉ số đo lường Bàn Phím & Chuột */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              
              {/* Thẻ 1: Tốc độ gõ phím WPM & KPS */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span className="flex items-center gap-1 font-medium">
                    <Keyboard className="w-3.5 h-3.5 text-purple-600" />
                    <span>Tốc Độ Gõ Phím</span>
                  </span>
                  <span className="font-mono text-purple-700 font-bold">{inputTelemetry.kps} KPS</span>
                </div>
                <div className="text-xl font-black text-slate-900 tracking-tight">
                  {inputTelemetry.inputStatus === 'idle' ? '0' : inputTelemetry.wpm} <span className="text-xs font-normal text-slate-500">từ/phút (WPM)</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-purple-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (inputTelemetry.wpm / 80) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Thẻ 2: Tổng số phím gõ hôm nay */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span className="flex items-center gap-1 font-medium">
                    <Activity className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Tổng Phím Hôm Nay</span>
                  </span>
                  <span className="font-mono text-emerald-700 font-bold">Keystrokes</span>
                </div>
                <div className="text-xl font-black text-slate-900 tracking-tight">
                  {inputTelemetry.totalKeystrokesToday.toLocaleString('vi-VN')} <span className="text-xs font-normal text-slate-500">phím</span>
                </div>
                <div className="text-[10px] text-slate-500">
                  Trung bình: ~1,550 phím/giờ làm
                </div>
              </div>

              {/* Thẻ 3: Tần suất click chuột CPM */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span className="flex items-center gap-1 font-medium">
                    <MousePointer className="w-3.5 h-3.5 text-blue-600" />
                    <span>Thao Tác Chuột</span>
                  </span>
                  <span className="font-mono text-blue-700 font-bold">Clicks</span>
                </div>
                <div className="text-xl font-black text-slate-900 tracking-tight">
                  {inputTelemetry.inputStatus === 'idle' ? '0' : inputTelemetry.mouseCpm} <span className="text-xs font-normal text-slate-500">click/phút</span>
                </div>
                <div className="text-[10px] text-slate-500">
                  Tổng hôm nay: {inputTelemetry.totalClicksToday.toLocaleString('vi-VN')} click
                </div>
              </div>

              {/* Thẻ 4: Tần suất di chuyển chuột & Idle Timer */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Thời Gian Không Chạm Máy</span>
                  </span>
                  <span className="font-mono text-amber-700 font-bold">Idle Watch</span>
                </div>
                <div className="text-xl font-black text-slate-900 tracking-tight">
                  {idleCounter < 60 ? `${idleCounter}s` : `${Math.floor(idleCounter / 60)}m ${idleCounter % 60}s`}
                </div>
                <div className="text-[10px] text-slate-500">
                  {idleCounter > 120 ? '⚠️ Quá ngưỡng 2 phút không gõ phím' : 'Đang trong giới hạn cho phép (< 2 phút)'}
                </div>
              </div>
            </div>

            {/* Mô phỏng phím đang gõ & Thanh nhịp độ thao tác (Key hit visualizer) */}
            <div className="p-3 bg-slate-900 rounded-xl text-white flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <span className="text-[11px] text-slate-400 font-mono">TÍN HIỆU PHÍM GÕ:</span>
                <div className="flex items-center gap-1.5 font-mono">
                  {recentKeyList.map((k, idx) => (
                    <span 
                      key={idx}
                      className={`px-2 py-1 rounded text-xs font-bold transition-all ${
                        idx === 0 
                          ? 'bg-emerald-500 text-slate-950 scale-105 shadow-md shadow-emerald-500/50' 
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-slate-300 w-full md:w-auto justify-end">
                <span>Cường độ chuột: <strong className="text-blue-400">{inputTelemetry.inputStatus === 'idle' ? '0%' : `${inputTelemetry.mouseMovementPercent}%`}</strong></span>
                <span>•</span>
                <span>Tương tác cuối: <strong className="text-emerald-400">{inputTelemetry.inputStatus === 'idle' ? `${idleCounter}s trước` : 'Đang gõ'}</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHẾ ĐỘ 2: CHỈ XEM CAM NGOÀI (WEBCAM GÓC RỘNG) */}
      {viewStreamMode === 'webcam' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
            <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-600" />
              <span>CHẾ ĐỘ TOÀN MÀN HÌNH: LUỒNG 1 - CAM NGOÀI BÀN LÀM VIỆC & AI TƯ THẾ</span>
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              AI SKELETON: HOẠT ĐỘNG
            </span>
          </div>

          <AiVisionFeed
            camName={cam.name || 'Webcam Ngoài'}
            camId={cam.id || 'CAM-01'}
            memberName={member.name || 'Nhân sự'}
            location={cam.location || 'Văn phòng'}
            initialPosture={cam.currentPosture || 'good'}
            height="h-96"
            showHeader={true}
            showControls={showControls}
          />
        </div>
      )}

      {/* CHẾ ĐỘ 3: CHỈ XEM CAM MÀN HÌNH (SCREEN CAPTURE STREAM) */}
      {viewStreamMode === 'screen' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
            <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Monitor className="w-4 h-4 text-blue-600" />
              <span>CHẾ ĐỘ TOÀN MÀN HÌNH: LUỒNG 2 - CAM QUAY MÀN HÌNH MÁY TÍNH</span>
            </span>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${
                currentScreen.isViolation ? 'bg-rose-50 text-rose-700 border-rose-300' : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                {currentScreen.isViolation ? '⚠️ Phát Hiện Vi Phạm' : '✅ Tiến Trình Chuẩn'}
              </span>
            </div>
          </div>

          {/* Full Screen Stream */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl">
            <div className="px-4 py-2 bg-slate-900 flex items-center justify-between text-xs text-slate-300 border-b border-slate-800">
              <span className="font-mono font-bold flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>{currentScreen.activeWindow}</span>
              </span>
              <span className="font-mono text-slate-400">1920x1080 @ 30FPS • {streamClock}</span>
            </div>

            <div className="relative h-96 w-full flex items-center justify-center">
              <img
                src={currentScreen.screenUrl}
                alt="Screen Full Stream"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      )}

      {/* CHẾ ĐỘ 4: CHỈ XEM BẢNG ĐO BÀN PHÍM & CHUỘT */}
      {viewStreamMode === 'input' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
            <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Keyboard className="w-4 h-4 text-purple-600" />
              <span>CHẾ ĐỘ CHI TIẾT: LUỒNG 3 - TELEMETRY BÀN PHÍM & CHUỘT THỜI GIAN THỰC</span>
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
              INPUT HOOK ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-2">
              <div className="text-slate-500 text-xs font-bold uppercase">Tốc Độ Gõ Hiện Tại</div>
              <div className="text-4xl font-black text-purple-700">{inputTelemetry.wpm}</div>
              <div className="text-xs text-slate-500">Từ trên phút (Words Per Minute)</div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-2">
              <div className="text-slate-500 text-xs font-bold uppercase">Tần Suất Nhấn Phím</div>
              <div className="text-4xl font-black text-emerald-700">{inputTelemetry.kps}</div>
              <div className="text-xs text-slate-500">Phím mỗi giây (Keys Per Second)</div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-2">
              <div className="text-slate-500 text-xs font-bold uppercase">Nhịp Click Chuột</div>
              <div className="text-4xl font-black text-blue-700">{inputTelemetry.mouseCpm}</div>
              <div className="text-xs text-slate-500">Lượt click mỗi phút (Clicks Per Minute)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


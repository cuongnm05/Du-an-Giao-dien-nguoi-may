import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Plus, 
  Trash2, 
  Play, 
  Pause, 
  RotateCcw, 
  Flame, 
  Bell, 
  BellOff,
  ShieldCheck, 
  Laptop, 
  Video, 
  Layers, 
  TrendingUp, 
  Check, 
  Sliders, 
  Camera, 
  Image as ImageIcon, 
  Activity,
  ArrowRight,
  Brain,
  Coffee,
  XCircle,
  Eye,
  Film,
  Trophy,
  Globe,
  SlidersHorizontal,
  ChevronRight,
  Download,
  ArrowUpDown,
  Search,
  Filter,
  Keyboard,
  MousePointer,
  Monitor
} from 'lucide-react';
import AiVisionFeed from './AiVisionFeed';
import WorkstationTriMonitor from './WorkstationTriMonitor';
import { 
  INITIAL_PERSONAL_TIMETABLE, 
  MOCK_VIDEO_RECORDINGS, 
  GLOBAL_PERSONAL_RANKINGS, 
  ANNUAL_REPORT_METRICS,
  SCREEN_STREAM_IMAGES
} from '../data/mockData';
import CameraSetupView from './CameraSetupView';

export default function PersonalView({ 
  currentTab = 'personal_desk',
  setCurrentTab,
  onBackToRoleSelect 
}) {
  const [timetable, setTimetable] = useState(INITIAL_PERSONAL_TIMETABLE);
  const [activeTask, setActiveTask] = useState(timetable[1]);
  
  // Real-time Anti-Procrastination Assistant State
  const [isAiAssistantActive, setIsAiAssistantActive] = useState(true);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true); // Tắt thông báo nhắc nhở nếu không thích
  const [currentDistractionAlert, setCurrentDistractionAlert] = useState(null);
  const [nextTaskReminder, setNextTaskReminder] = useState({
    title: 'Giãn Cơ Cột Sống & Vận Động Nhẹ',
    time: '11:30 - 12:00',
    app: 'Nhắc nhở công thái học'
  });

  // Report Period State (Ngày, Tuần, Tháng, Năm)
  const [reportPeriod, setReportPeriod] = useState('month');

  // Bảng xếp hạng Cá Nhân: Lọc Thế Giới, Quốc Gia, Tỉnh Thành & Sắp Xếp
  const [geoScope, setGeoScope] = useState('all'); // 'all' (Thế giới) | 'VN' | 'JP' | 'US' | 'KR' | 'UK' | 'DE' | 'SG'
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [personalSortBy, setPersonalSortBy] = useState('rank_asc');
  const [personalRankPeriod, setPersonalRankPeriod] = useState('week');
  const [rankSearchQuery, setRankSearchQuery] = useState('');

  // Dữ liệu 3 luồng giám sát Bàn Làm Việc Cá Nhân
  const personalWorkstationData = {
    id: 'MY-DESK-01',
    name: 'Bàn Làm Việc & Trạm Máy Cá Nhân',
    location: 'Góc Làm Việc Cá Nhân - Home Office',
    assignedTo: 'Nguyễn Văn Cường',
    webcamUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    currentPosture: 'good',
    screenStream: {
      screenUrl: SCREEN_STREAM_IMAGES.vscode,
      activeWindow: 'Visual Studio Code - Dự Án Core [React + Vite]',
      processName: 'code.exe',
      category: 'Lập trình',
      isViolation: false,
      resolution: '1920x1080 @ 30fps',
      fps: 30,
      cpuUsage: '16%',
      ramUsage: '2.5 GB'
    },
    inputTelemetry: {
      wpm: 68,
      kps: 4.5,
      totalKeystrokesToday: 15400,
      mouseCpm: 32,
      totalClicksToday: 2650,
      mouseMovementPercent: 78,
      idleDurationSec: 4,
      inputStatus: 'active_typing',
      recentKeys: ['Cmd', 'S', 'Tab', 'Enter', 'Const', 'Return'],
      lastInputTime: 'Vừa xong'
    }
  };

  // Modal thêm lịch trình
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [selectedPersonalVideo, setSelectedPersonalVideo] = useState(null);
  const [isPersonalVideoPlaying, setIsPersonalVideoPlaying] = useState(false);
  const [newTaskData, setNewTaskData] = useState({
    time: '14:00 - 15:30',
    title: '',
    category: 'deepwork',
    targetApp: 'VS Code',
    note: ''
  });

  // Pomodoro timer state
  const [pomodoroMinutes, setPomodoroMinutes] = useState(25);
  const [pomodoroSeconds, setPomodoroSeconds] = useState(0);
  const [isPomodoroRunning, setIsPomodoroRunning] = useState(false);

  // Toast feedback
  const [toast, setToast] = useState(null);

  const showToast = (text) => {
    setToast(text);
    setTimeout(() => setToast(null), 3500);
  };

  // Pomodoro countdown simulation
  useEffect(() => {
    let timer;
    if (isPomodoroRunning) {
      timer = setInterval(() => {
        setPomodoroSeconds((sec) => {
          if (sec > 0) return sec - 1;
          setPomodoroMinutes((min) => {
            if (min > 0) return min - 1;
            setIsPomodoroRunning(false);
            showToast('Hết hiệp Pomodoro 25 phút! Hãy đứng dậy giãn cơ 5 phút.');
            return 25;
          });
          return 59;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPomodoroRunning]);

  // Handle adding task to timetable
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskData.title.trim()) return;

    const newTask = {
      id: `TT-${Date.now()}`,
      ...newTaskData,
      status: 'upcoming'
    };

    setTimetable(prev => [...prev, newTask]);
    setShowAddTaskModal(false);
    setNewTaskData({
      time: '14:00 - 15:30',
      title: '',
      category: 'deepwork',
      targetApp: 'VS Code',
      note: ''
    });
    showToast('Đã thêm khung giờ mới vào thời khóa biểu!');
  };

  const handleSimulateDistraction = () => {
    if (!isNotificationsEnabled) {
      showToast('Thông báo đang được tắt (Chế độ Không làm phiền). Bật lại thông báo để nhận cảnh báo.');
      return;
    }
    setCurrentDistractionAlert({
      type: 'social_media',
      title: 'Phát Hiện Sao Nhãng: Bạn đang mở tab YouTube / Lướt Facebook!',
      action: 'Nhắc nhở: Hãy đóng tab giải trí và quay lại nhiệm vụ "Deep Work: Lập Trình".',
      detectedApp: 'Chrome: Video Giải Trí'
    });
  };

  return (
    <div className="space-y-3 w-full">
      
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-xl text-xs font-semibold animate-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{toast}</span>
        </div>
      )}

      {/* THÔNG BÁO NHẮC NHỞ REAL-TIME KHI SAO NHÃNG (Có nút tắt thông báo nếu không thích) */}
      {currentDistractionAlert && isNotificationsEnabled && (
        <div className="p-3.5 bg-rose-50 border-2 border-rose-400 rounded-2xl text-rose-900 shadow-md animate-in slide-in-from-top-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500 text-white shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <div className="font-bold text-sm text-rose-950">{currentDistractionAlert.title}</div>
              <div className="text-rose-800">{currentDistractionAlert.action}</div>
              <div className="text-[10px] font-mono text-rose-700 mt-0.5">Phát hiện: {currentDistractionAlert.detectedApp}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              onClick={() => {
                setCurrentDistractionAlert(null);
                showToast('Đã quay lại làm việc tập trung!');
              }}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-xs transition-colors"
            >
              Tôi Sẽ Quay Lại Làm Việc
            </button>

            {/* Nút Tắt Thông Báo Nhắc Nhở nếu không thích */}
            <button
              onClick={() => {
                setIsNotificationsEnabled(false);
                setCurrentDistractionAlert(null);
                showToast('Đã tắt thông báo nhắc nhở (Chế độ Không làm phiền).');
              }}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-medium transition-colors"
              title="Tắt thông báo nếu không muốn bị làm phiền"
            >
              <BellOff className="w-3.5 h-3.5" />
              <span>Tắt Thông Báo</span>
            </button>

            <button
              onClick={() => setCurrentDistractionAlert(null)}
              className="p-1 text-rose-500 hover:text-rose-700 font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ===================== TAB 1: BÀN LÀM VIỆC & TỔNG QUAN CÁ NHÂN (TINH GIẢN, GỌN GÀNG, CHUẨN HCI) ===================== */}
      {(currentTab === 'personal_desk' || currentTab === 'dashboard') && (
        <div className="space-y-4 max-w-7xl mx-auto">
          
          {/* Header Bar Khái Quát Cá Nhân */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-200/80">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Không Gian Làm Việc & Tổng Quan Cá Nhân</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Xin chào, <strong>Nguyễn Văn Cường</strong> 👋 • Mục tiêu ngày: <strong>5.5h / 8.0h</strong> • Streak: <strong>45 ngày</strong>
              </p>
            </div>

            {/* Nút bật/tắt thông báo tập trung */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsNotificationsEnabled(!isNotificationsEnabled);
                  showToast(!isNotificationsEnabled ? 'Đã bật thông báo nhắc nhở tập trung' : 'Đã tắt thông báo (Chế độ Không làm phiền)');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  isNotificationsEnabled 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {isNotificationsEnabled ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                <span>{isNotificationsEnabled ? 'Nhắc Nhở: Bật' : 'Không Làm Phiền: Bật'}</span>
              </button>

              <button
                onClick={() => setCurrentTab('personal_timetable')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Thời Khóa Biểu</span>
              </button>
            </div>
          </div>

          {/* 4 Thẻ KPI Tinh Giản Cá Nhân */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            
            {/* KPI 1: Điểm tư thế */}
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2 hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-500">Điểm Công Thái Học</span>
                <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 tracking-tight flex items-baseline gap-2">
                  <span>94 / 100</span>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                    Xuất sắc
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Lưng thẳng 98° • Khoảng cách mắt 65cm
                </div>
              </div>
            </div>

            {/* KPI 2: Giờ làm việc */}
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2 hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-500">Thời Gian Tập Trung</span>
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 tracking-tight flex items-baseline gap-2">
                  <span>5h 30m</span>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                    68.7%
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Mục tiêu hôm nay: 8 giờ làm việc
                </div>
              </div>
            </div>

            {/* KPI 3: Tốc độ gõ phím */}
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2 hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-500">Tốc Độ Gõ Phím</span>
                <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                  <Keyboard className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 tracking-tight flex items-baseline gap-1.5">
                  <span>68</span>
                  <span className="text-xs font-normal text-slate-500">WPM</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  15,400 Phím gõ • 32 Clicks/phút
                </div>
              </div>
            </div>

            {/* KPI 4: Streak ngày */}
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2 hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-500">Xếp Hạng & Chuỗi</span>
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                  <Trophy className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 tracking-tight flex items-baseline gap-2">
                  <span>Top 1</span>
                  <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md">
                    Kim Cương
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Duy trì 45 ngày ngồi chuẩn liên tiếp
                </div>
              </div>
            </div>

          </div>

          {/* Bố Cục 2 Cột: Camera Bàn Làm Việc Live & Nhịp Độ Pomodoro */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* Cột trái (7 cols): Camera Bàn Làm Việc Cá Nhân Tinh Giản */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3.5 flex flex-col justify-between">
              <div>
                {/* Header Camera */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-slate-900 text-sm">Camera Bàn Làm Việc AI Cá Nhân</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    LIVE FEED • AI ON
                  </span>
                </div>

                {/* Viewport Camera Live sắc nét */}
                <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video mt-3 group shadow-inner">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80"
                    alt="Personal Live Camera"
                    className="w-full h-full object-cover filter contrast-[1.05] brightness-[0.95]"
                  />

                  {/* OSD Header */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white font-mono text-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                    <span>1080P @ 30FPS</span>
                    <span>•</span>
                    <span>Home Office</span>
                  </div>

                  {/* OSD Posture Status */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] font-mono">
                    <span className="px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md text-emerald-300 font-bold">
                      ✓ Tư thế chuẩn (Lưng thẳng 98° • Cổ 14°)
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-slate-300">
                      Khoảng cách: 65cm
                    </span>
                  </div>
                </div>

                {/* Tóm tắt 3 Luồng Giám Sát Cá Nhân */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs pt-3">
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-[10px] text-slate-400 font-semibold">1. Cam Ngoài</div>
                    <div className="font-bold text-emerald-700 text-xs mt-0.5">
                      Ngồi Chuẩn (98°)
                    </div>
                  </div>

                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-[10px] text-slate-400 font-semibold">2. Cam Màn Hình</div>
                    <div className="font-bold text-blue-700 text-xs mt-0.5 font-mono truncate">
                      VS Code (Frontend)
                    </div>
                  </div>

                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-[10px] text-slate-400 font-semibold">3. Phím & Chuột</div>
                    <div className="font-bold text-purple-700 text-xs mt-0.5 font-mono">
                      68 WPM • Tích cực
                    </div>
                  </div>
                </div>
              </div>

              {/* Nút hành động nhanh */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={handleSimulateDistraction}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-xl text-xs transition-colors border border-amber-200"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Mô Phỏng Cảnh Báo Sao Nhãng</span>
                </button>

                <button
                  onClick={() => setCurrentTab('personal_cameras')}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  <Camera className="w-3.5 h-3.5 text-slate-600" />
                  <span>Cài Đặt Camera Cá Nhân</span>
                </button>
              </div>
            </div>

            {/* Cột phải (5 cols): Đồng Hồ Pomodoro & Kế Hoạch Hôm Nay */}
            <div className="lg:col-span-5 space-y-3.5 flex flex-col justify-between">
              
              {/* Box 1: Đồng Hồ Pomodoro Tinh Giản */}
              <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs text-center space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold text-slate-800">Đồng Hồ Pomodoro Tập Trung</span>
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold">Hiệp 2/4</span>
                </div>

                <div className="py-2">
                  <div className="text-5xl font-mono font-bold text-slate-900 tracking-tight">
                    {String(pomodoroMinutes).padStart(2, '0')}:{String(pomodoroSeconds).padStart(2, '0')}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Chu kỳ 25 phút tập trung sâu & 5 phút giãn cơ
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setIsPomodoroRunning(!isPomodoroRunning)}
                    className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                      isPomodoroRunning
                        ? 'bg-amber-500 text-white shadow-amber-500/20'
                        : 'bg-emerald-600 text-white shadow-emerald-600/20 hover:bg-emerald-500'
                    }`}
                  >
                    {isPomodoroRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isPomodoroRunning ? 'Tạm Dừng' : 'Bắt Đầu'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setPomodoroMinutes(25);
                      setPomodoroSeconds(0);
                      setIsPomodoroRunning(false);
                      showToast('Đã đặt lại đồng hồ Pomodoro 25 phút');
                    }}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600"
                    title="Đặt lại"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Box 2: Nhiệm Vụ Hôm Nay Tinh Gọn */}
              <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2.5 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-900 pb-1.5 border-b border-slate-100">
                  <span>Nhiệm Vụ Trong Lịch Trình</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800">
                    Active Task
                  </span>
                </div>

                {/* Nhiệm vụ đang làm */}
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                  <div className="font-mono text-emerald-700 font-bold text-[11px]">{activeTask.time}</div>
                  <div className="font-bold text-slate-900">{activeTask.title}</div>
                  <div className="text-slate-600 text-[11px]">Mục tiêu: {activeTask.targetApp} • {activeTask.note}</div>
                </div>

                {/* Nhiệm vụ tiếp theo */}
                <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-[11px]">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Kế tiếp: </span>
                    <span className="font-semibold text-slate-800">{nextTaskReminder.title}</span>
                  </div>
                  <span className="font-mono text-slate-500">{nextTaskReminder.time}</span>
                </div>

                <button
                  onClick={() => setCurrentTab('personal_timetable')}
                  className="w-full py-1.5 text-center font-bold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center justify-center gap-1"
                >
                  <span>Mở Toàn Bộ Thời Khóa Biểu</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>

          {/* HÀNG DƯỚI: 3 WIDGET TÓM TẮT TỔNG QUAN (XẾP HẠNG TOP 3, BẢN GHI GẦN ĐÂY, BÁO CÁO SỨC KHỎE) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* WIDGET 1: TÓM TẮT BẢNG XẾP HẠNG TOP 3 (Kèm nút Xem Tất Cả Bảng Xếp Hạng) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span>Top Xếp Hạng Cá Nhân</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Top 3 Toàn Cầu</span>
                </div>

                {/* List 3 người dẫn đầu */}
                <div className="space-y-2 pt-1 text-xs">
                  {GLOBAL_PERSONAL_RANKINGS.slice(0, 3).map((user, idx) => (
                    <div 
                      key={user.id} 
                      className={`p-2 rounded-xl flex items-center justify-between gap-2 border ${
                        idx === 0 
                          ? 'bg-emerald-50/70 border-emerald-200/80 ring-1 ring-emerald-400/20' 
                          : 'bg-slate-50 border-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`w-5 h-5 rounded-lg font-mono text-[10px] font-bold flex items-center justify-center shrink-0 ${
                          idx === 0 ? 'bg-amber-100 text-amber-800' :
                          idx === 1 ? 'bg-slate-200 text-slate-700' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          #{idx + 1}
                        </span>
                        <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-lg object-cover shrink-0" />
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 truncate text-[11px] flex items-center gap-1">
                            <span>{user.name}</span>
                            {idx === 0 && (
                              <span className="px-1.5 py-0.2 rounded text-[8px] font-bold bg-emerald-600 text-white">
                                BẠN
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">📍 {user.location}</div>
                        </div>
                      </div>

                      <span className="font-mono font-bold text-emerald-700 text-[11px] shrink-0">
                        {user.ergonomicsScore}đ
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nút Xem Tất Cả Bảng Xếp Hạng */}
              <div className="pt-2 border-t border-slate-100 text-right">
                <button
                  onClick={() => setCurrentTab('personal_rankings')}
                  className="w-full py-1.5 text-center font-bold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl transition-colors flex items-center justify-center gap-1 text-xs"
                >
                  <span>Xem Toàn Bộ Bảng Xếp Hạng (Thế Giới & Tỉnh/TP)</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* WIDGET 2: TÓM TẮT BẢN GHI VIDEO CÁ NHÂN (Kèm nút Xem Tất Cả Bản Ghi) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <Film className="w-4 h-4 text-teal-600" />
                    <span>Bản Ghi Video Cá Nhân</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">2 Clip Mới</span>
                </div>

                {/* 2 Video clips tóm tắt */}
                <div className="space-y-2 pt-1 text-xs">
                  {MOCK_VIDEO_RECORDINGS.slice(0, 2).map((rec) => (
                    <div key={rec.id} className="p-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2.5">
                      <div className="relative w-14 h-11 rounded-lg overflow-hidden shrink-0 bg-slate-900">
                        <img src={rec.thumbnail} alt={rec.title} className="w-full h-full object-cover" />
                        <span className="absolute bottom-0.5 right-0.5 bg-black/80 px-1 py-0.2 rounded text-[8px] text-white font-mono">
                          {rec.duration}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-slate-900 truncate text-[11px]">{rec.title}</div>
                        <div className="text-[10px] text-slate-500 truncate">{rec.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nút Xem Tất Cả Video Bản Ghi */}
              <div className="pt-2 border-t border-slate-100 text-right">
                <button
                  onClick={() => setCurrentTab('personal_recordings')}
                  className="w-full py-1.5 text-center font-bold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl transition-colors flex items-center justify-center gap-1 text-xs"
                >
                  <span>Xem Tất Cả Video Camera & Màn Hình</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* WIDGET 3: TÓM TẮT BÁO CÁO SỨC KHỎE & NHỊP ĐỘ (Kèm nút Xem Báo Cáo Chi Tiết) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    <span>Báo Cáo Sức Khỏe Tuần</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">7 Ngày Gần Nhất</span>
                </div>

                {/* 7 cột ngày trong tuần */}
                <div className="grid grid-cols-7 gap-1 pt-1 text-center">
                  {[
                    { day: 'T2', hours: 8.2 },
                    { day: 'T3', hours: 7.8 },
                    { day: 'T4', hours: 8.5 },
                    { day: 'T5', hours: 7.5 },
                    { day: 'T6', hours: 8.0 },
                    { day: 'T7', hours: 6.2 },
                    { day: 'CN', hours: 5.5 }
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="h-10 bg-slate-100 rounded-lg flex items-end p-0.5 overflow-hidden">
                        <div 
                          className={`w-full rounded-md transition-all ${
                            idx === 6 ? 'bg-emerald-600' : 'bg-emerald-400'
                          }`}
                          style={{ height: `${(item.hours / 9) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-[9px] font-bold text-slate-700">{item.day}</div>
                    </div>
                  ))}
                </div>

                <div className="text-[11px] text-slate-600 pt-1 leading-tight">
                  💡 <strong>Gợi ý AI:</strong> Bạn duy trì tư thế rất tốt (94đ). Giữ vững thói quen giãn cơ sau mỗi 25 phút Pomodoro!
                </div>
              </div>

              {/* Nút Xem Báo Cáo Sức Khỏe Chi Tiết */}
              <div className="pt-2 border-t border-slate-100 text-right">
                <button
                  onClick={() => setCurrentTab('personal_reports')}
                  className="w-full py-1.5 text-center font-bold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl transition-colors flex items-center justify-center gap-1 text-xs"
                >
                  <span>Xem Báo Cáo Sức Khỏe Toàn Diện</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ===================== TAB 2: THỜI KHÓA BIỂU & LỊCH TRÌNH ===================== */}
      {currentTab === 'personal_timetable' && (
        <div className="space-y-3.5">
          {/* Header Toolbar */}
          <div className="p-3 bg-white border border-slate-200 rounded-2xl flex items-center justify-between text-xs shadow-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold text-slate-800 text-sm">Thời Khóa Biểu & Kế Hoạch Tập Trung Trong Ngày</span>
            </div>
            <button
              onClick={() => setShowAddTaskModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Khung Giờ Mới</span>
            </button>
          </div>

          {/* 12-Col Symmetrical Layout: Danh sách (8 cols) + Tổng quan tiến độ & Pomodoro (4 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            
            {/* Cột trái (8 cols): Danh sách các khung giờ */}
            <div className="lg:col-span-8 space-y-2.5">
              {timetable.map((task) => {
                const isCurrent = task.status === 'in_progress';
                const isDone = task.status === 'completed';

                return (
                  <div
                    key={task.id}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                      isCurrent
                        ? 'bg-emerald-50/80 border-emerald-500 shadow-sm ring-1 ring-emerald-500/30'
                        : isDone
                        ? 'bg-slate-50 border-slate-200 opacity-80'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                        isCurrent ? 'bg-emerald-600 text-white shadow-xs' : isDone ? 'bg-slate-200 text-slate-600' : 'bg-slate-100 text-slate-500'
                      }`}>
                        <Clock className="w-4 h-4" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-700">{task.time}</span>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white animate-pulse">
                              ĐANG THỰC HIỆN
                            </span>
                          )}
                          {isDone && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                              ĐÃ HOÀN THÀNH
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-slate-900 mt-0.5 text-xs">{task.title}</h4>
                        <p className="text-slate-500 mt-0.5 text-[11px]">{task.note}</p>
                        <div className="mt-1 text-[11px] text-slate-600">
                          Ứng dụng cho phép: <span className="font-semibold text-emerald-700 font-mono">{task.targetApp}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => {
                          setTimetable(prev => prev.map(t => t.id === task.id ? { ...t, status: t.status === 'completed' ? 'upcoming' : 'completed' } : t));
                          showToast(`Đã cập nhật trạng thái: "${task.title}"`);
                        }}
                        className={`px-3 py-1.5 rounded-xl font-semibold border transition-all text-xs ${
                          isDone
                            ? 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                            : 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-500'
                        }`}
                      >
                        {isDone ? 'Đánh dấu chưa xong' : 'Xong việc ✓'}
                      </button>

                      <button
                        onClick={() => {
                          setTimetable(prev => prev.filter(t => t.id !== task.id));
                          showToast('Đã xóa khung giờ khỏi thời khóa biểu');
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cột phải (4 cols): Bảng điều khiển tiến độ & Pomodoro */}
            <div className="lg:col-span-4 space-y-3">
              {/* Thẻ Thống kê tiến độ ngày */}
              <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3 text-xs">
                <div className="font-bold text-slate-900 flex items-center justify-between pb-2 border-b border-slate-100">
                  <span>Tiến Độ Kế Hoạch Hôm Nay</span>
                  <span className="font-mono text-emerald-600 font-bold">
                    {Math.round((timetable.filter(t => t.status === 'completed').length / (timetable.length || 1)) * 100)}%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <div className="text-[10px] text-slate-400 font-medium">Đã Xong</div>
                    <div className="text-base font-bold text-emerald-600 font-mono mt-0.5">
                      {timetable.filter(t => t.status === 'completed').length} / {timetable.length}
                    </div>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <div className="text-[10px] text-slate-400 font-medium">Tổng Thời Lượng</div>
                    <div className="text-base font-bold text-slate-800 font-mono mt-0.5">
                      7.5 Giờ
                    </div>
                  </div>
                </div>

                {/* Pomodoro Focus Mini Launcher */}
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-950">Đồng Hồ Pomodoro Tập Trung</span>
                    <span className="font-mono text-emerald-700 font-bold">
                      {String(pomodoroMinutes).padStart(2, '0')}:{String(pomodoroSeconds).padStart(2, '0')}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsPomodoroRunning(!isPomodoroRunning)}
                    className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    {isPomodoroRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPomodoroRunning ? 'Tạm Dừng Hiệp' : 'Bắt Đầu Hiệp 25 Phút'}</span>
                  </button>
                </div>

                {/* Khung giải lao kế tiếp */}
                <div className="p-2.5 bg-amber-50/60 border border-amber-200 rounded-xl text-amber-900 text-[11px] space-y-0.5">
                  <div className="font-bold">⏰ Nghỉ ngơi kế tiếp: 11:30 - 12:00</div>
                  <div className="text-amber-800">Dành 5-10 phút đứng dậy giãn cơ vai, gáy và cột sống.</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ===================== TAB 3: TRỢ LÝ CHỐNG TRÌ HOÃN & NHẮC VIỆC (CÂN BẰNG 2 CỘT) ===================== */}
      {currentTab === 'personal_assistant' && (
        <div className="space-y-3.5">
          {/* Action Toolbar */}
          <div className="p-3 bg-white border border-slate-200 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold text-slate-900">Trợ Lý AI Nhắc Nhở & Chống Trì Hoãn Real-Time</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSimulateDistraction}
                className="px-3.5 py-1.5 rounded-xl font-semibold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors"
              >
                Mô Phỏng: Làm Việc Riêng
              </button>

              <button
                onClick={() => {
                  setIsNotificationsEnabled(!isNotificationsEnabled);
                  showToast(!isNotificationsEnabled ? 'Đã bật thông báo nhắc nhở' : 'Đã tắt thông báo nhắc nhở');
                }}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-white transition-all ${
                  isNotificationsEnabled ? 'bg-emerald-600 hover:bg-emerald-500 shadow-xs' : 'bg-slate-600 hover:bg-slate-700'
                }`}
              >
                {isNotificationsEnabled ? 'Thông Báo: Đang Bật' : 'Thông Báo: Đang Tắt'}
              </button>
            </div>
          </div>

          {/* 12-Col Symmetrical Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            
            {/* Cột trái (7 cols): Nhắc nhở task tiếp theo & Lịch sử nhận diện */}
            <div className="lg:col-span-7 space-y-3">
              {/* Nhắc nhở sẽ làm gì tiếp theo real-time */}
              <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-white border border-emerald-200 rounded-2xl shadow-xs space-y-3 text-xs">
                <div className="flex items-center justify-between text-emerald-800 font-bold uppercase tracking-wider text-[11px] pb-1 border-b border-emerald-100">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Nhắc Nhở Real-Time: Việc Cần Làm Tiếp Theo</span>
                  </span>
                  <span className="font-mono text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                    Tự động kích hoạt
                  </span>
                </div>

                <div className="p-3.5 bg-white/95 rounded-xl border border-emerald-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-emerald-700 text-xs">{nextTaskReminder.time}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Sắp diễn ra
                    </span>
                  </div>
                  <div className="font-bold text-slate-900 text-sm">{nextTaskReminder.title}</div>
                  <p className="text-slate-600 text-[11px]">
                    Đã hoàn thành 85% task hiện tại. Khi hết giờ, hãy mở ngay ứng dụng <strong className="text-emerald-700 font-mono">{nextTaskReminder.app}</strong> để tiếp tục chuỗi tập trung!
                  </p>

                  <button
                    onClick={() => {
                      showToast(`Đã chuyển trạng thái sang nhiệm vụ: "${nextTaskReminder.title}"`);
                      setActiveTask({
                        id: 'TT-NEXT',
                        time: nextTaskReminder.time,
                        title: nextTaskReminder.title,
                        targetApp: nextTaskReminder.app,
                        note: 'Bắt đầu theo lịch nhắc nhở AI',
                        status: 'in_progress'
                      });
                    }}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all mt-1"
                  >
                    <span>Bắt Đầu Nhiệm Vụ Này Ngay</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Lịch sử nhận diện hành vi gần đây */}
              <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2.5 text-xs">
                <div className="font-bold text-slate-900 pb-1.5 border-b border-slate-100 flex items-center justify-between">
                  <span>Nhật Ký Nhận Diện Tập Trung Hôm Nay</span>
                  <span className="text-[10px] text-slate-400 font-normal">Cập nhật 1 phút trước</span>
                </div>

                <div className="space-y-2 text-[11px]">
                  <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span className="font-bold text-slate-800">10:45: Đang tập trung cao độ (VS Code)</span>
                    </div>
                    <span className="font-mono text-emerald-700 font-bold">68 WPM</span>
                  </div>

                  <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      <span className="font-bold text-slate-800">10:15: Cúi gập cổ 30° quá 60s</span>
                    </div>
                    <span className="text-amber-800">Đã tự sửa tư thế</span>
                  </div>

                  <div className="p-2.5 bg-teal-50/70 border border-teal-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                      <span className="font-bold text-slate-800">09:30: Hoàn thành 1 hiệp Pomodoro 25 phút</span>
                    </div>
                    <span className="font-bold text-teal-700">Điểm: 96/100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cột phải (5 cols): Anti-Distraction Cockpit & Streak */}
            <div className="lg:col-span-5 space-y-3">
              <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3 text-xs">
                <div className="font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <span>Trạng Thái Bộ Giám Sát AI</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Online 30 FPS
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-slate-600">Tỷ Lệ Giữ Tập Trung Hôm Nay:</span>
                    <span className="font-bold text-emerald-600 font-mono text-sm">94.2%</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-slate-600">Số Lần Nhắc Nhở Đã Kích Hoạt:</span>
                    <span className="font-bold text-slate-800 font-mono text-sm">2 Lần</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-slate-600">Chuỗi Ngày Tập Trung (Streak):</span>
                    <span className="font-bold text-amber-600 font-mono text-sm">🔥 4 Ngày</span>
                  </div>
                </div>

                {/* Ergonomic & Focus Tip */}
                <div className="p-3 bg-teal-50/60 border border-teal-200 rounded-xl space-y-1">
                  <div className="font-bold text-teal-950 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-teal-600" />
                    <span>Mẹo Công Thái Học Từ AI:</span>
                  </div>
                  <p className="text-teal-900 text-[11px] leading-relaxed">
                    Giữ mắt cách màn hình 50-60cm, nâng ghế sao cho góc gập khuỷu tay và đầu gối đạt xấp xỉ 90° để giảm 70% tải trọng lên thắt lưng.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ===================== TAB 4: XẾP HẠNG TOÀN CẦU & ĐỊA PHƯƠNG (CÓ BỘ LỌC PHẠM VI, TỈNH THÀNH & SẮP XẾP) ===================== */}
      {currentTab === 'personal_rankings' && (() => {
        // Lọc theo phạm vi địa lý (Quốc gia & Thành phố)
        const filteredRankings = GLOBAL_PERSONAL_RANKINGS.filter(user => {
          const matchesCountry = geoScope === 'all' ||
            (geoScope === 'VN' && user.country === 'Việt Nam') ||
            (geoScope === 'JP' && user.country === 'Nhật Bản') ||
            (geoScope === 'US' && user.country === 'Mỹ') ||
            (geoScope === 'KR' && user.country === 'Hàn Quốc') ||
            (geoScope === 'UK' && user.country === 'Anh Quốc') ||
            (geoScope === 'DE' && user.country === 'Đức') ||
            (geoScope === 'SG' && user.country === 'Singapore');

          const matchesCity = selectedCity === 'ALL' || user.city === selectedCity;

          const matchesSearch = user.name.toLowerCase().includes(rankSearchQuery.toLowerCase()) ||
                                user.location.toLowerCase().includes(rankSearchQuery.toLowerCase()) ||
                                (user.badge && user.badge.toLowerCase().includes(rankSearchQuery.toLowerCase()));

          return matchesCountry && matchesCity && matchesSearch;
        });

        // Sắp xếp danh sách theo tiêu chí
        const sortedRankings = [...filteredRankings].sort((a, b) => {
          if (personalSortBy === 'rank_asc') return a.rank - b.rank;
          if (personalSortBy === 'rank_desc') return b.rank - a.rank;
          if (personalSortBy === 'ergo_desc') return b.ergonomicsScore - a.ergonomicsScore;
          if (personalSortBy === 'hours_desc') {
            const hA = a.workHours?.[personalRankPeriod] || a.workHours?.week || 0;
            const hB = b.workHours?.[personalRankPeriod] || b.workHours?.week || 0;
            return hB - hA;
          }
          if (personalSortBy === 'wpm_desc') return (b.wpm || 50) - (a.wpm || 50);
          if (personalSortBy === 'streak_desc') return b.streakDays - a.streakDays;
          return 0;
        });

        const citiesInScope = ['ALL', ...new Set(
          GLOBAL_PERSONAL_RANKINGS
            .filter(u => geoScope === 'all' || 
              (geoScope === 'VN' && u.country === 'Việt Nam') ||
              (geoScope === 'JP' && u.country === 'Nhật Bản') ||
              (geoScope === 'US' && u.country === 'Mỹ') ||
              (geoScope === 'KR' && u.country === 'Hàn Quốc') ||
              (geoScope === 'UK' && u.country === 'Anh Quốc') ||
              (geoScope === 'DE' && u.country === 'Đức') ||
              (geoScope === 'SG' && u.country === 'Singapore')
            )
            .map(u => u.city)
            .filter(Boolean)
        )];

        return (
          <div className="space-y-3">
            
            {/* Thanh chọn mốc thời gian & Chế độ xếp hạng AI */}
            <div className="p-3 bg-white border border-slate-200 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 text-xs shadow-xs">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-slate-900 text-sm">Bảng Xếp Hạng Người Dùng Toàn Cầu & Địa Phương</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  AI Live Leaderboard ({sortedRankings.length} Người Dùng)
                </span>
              </div>

              {/* Mốc thời gian */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-xl font-medium">
                <button
                  onClick={() => setPersonalRankPeriod('day')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${personalRankPeriod === 'day' ? 'bg-white font-bold text-slate-900 shadow-2xs' : 'text-slate-600'}`}
                >
                  Hôm Nay
                </button>
                <button
                  onClick={() => setPersonalRankPeriod('week')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${personalRankPeriod === 'week' ? 'bg-white font-bold text-slate-900 shadow-2xs' : 'text-slate-600'}`}
                >
                  Tuần Này
                </button>
                <button
                  onClick={() => setPersonalRankPeriod('month')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${personalRankPeriod === 'month' ? 'bg-white font-bold text-slate-900 shadow-2xs' : 'text-slate-600'}`}
                >
                  Tháng Này
                </button>
                <button
                  onClick={() => setPersonalRankPeriod('year')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${personalRankPeriod === 'year' ? 'bg-white font-bold text-slate-900 shadow-2xs' : 'text-slate-600'}`}
                >
                  Cả Năm
                </button>
              </div>
            </div>

            {/* BỘ LỌC PHẠM VI ĐỊA LÝ: THẾ GIỚI, QUỐC GIA & TỈNH THÀNH */}
            <div className="p-3 bg-white border border-slate-200 rounded-2xl space-y-2.5 text-xs shadow-xs">
              
              {/* Tabs chọn Quốc Gia / Thế Giới */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <span className="text-slate-400 font-semibold text-[11px] shrink-0 mr-1">Phạm vi:</span>
                
                <button
                  onClick={() => { setGeoScope('all'); setSelectedCity('ALL'); }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                    geoScope === 'all' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>🌍 Toàn Thế Giới</span>
                </button>

                <button
                  onClick={() => { setGeoScope('VN'); setSelectedCity('ALL'); }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                    geoScope === 'VN' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>🇻🇳 Việt Nam</span>
                </button>

                <button
                  onClick={() => { setGeoScope('JP'); setSelectedCity('ALL'); }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                    geoScope === 'JP' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>🇯🇵 Nhật Bản</span>
                </button>

                <button
                  onClick={() => { setGeoScope('US'); setSelectedCity('ALL'); }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                    geoScope === 'US' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>🇺🇸 Hoa Kỳ</span>
                </button>

                <button
                  onClick={() => { setGeoScope('KR'); setSelectedCity('ALL'); }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                    geoScope === 'KR' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>🇰🇷 Hàn Quốc</span>
                </button>

                <button
                  onClick={() => { setGeoScope('UK'); setSelectedCity('ALL'); }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                    geoScope === 'UK' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>🇬🇧 Anh Quốc</span>
                </button>

                <button
                  onClick={() => { setGeoScope('DE'); setSelectedCity('ALL'); }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                    geoScope === 'DE' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>🇩🇪 Đức</span>
                </button>

                <button
                  onClick={() => { setGeoScope('SG'); setSelectedCity('ALL'); }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                    geoScope === 'SG' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>🇸🇬 Singapore</span>
                </button>
              </div>

              {/* Hàng 2: Tìm kiếm, Lọc Thành Phố & Bộ Lọc Sắp Xếp */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-2.5 pt-1 border-t border-slate-100">
                <div className="relative w-full md:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={rankSearchQuery}
                    onChange={(e) => setRankSearchQuery(e.target.value)}
                    placeholder="Tìm tên người dùng, tỉnh thành..."
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
                  {/* Lọc Tỉnh / Thành Phố */}
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 text-[11px]">Tỉnh/TP:</span>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
                    >
                      {citiesInScope.map(c => (
                        <option key={c} value={c}>
                          {c === 'ALL' ? 'Tất cả Tỉnh/Thành phố' : c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Bộ lọc sắp xếp danh sách */}
                  <div className="flex items-center gap-1">
                    <ArrowUpDown className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-slate-400 text-[11px]">Sắp xếp:</span>
                    <select
                      value={personalSortBy}
                      onChange={(e) => setPersonalSortBy(e.target.value)}
                      className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
                    >
                      <option value="rank_asc">🏆 Thứ hạng (Cao nhất ➔ Thấp nhất)</option>
                      <option value="rank_desc">🔻 Thứ hạng (Thấp nhất ➔ Cao nhất)</option>
                      <option value="ergo_desc">🧘 Điểm công thái học (Cao ➔ Thấp)</option>
                      <option value="hours_desc">⏱️ Giờ tập trung (Nhiều nhất ➔ Ít nhất)</option>
                      <option value="wpm_desc">⌨️ Tốc độ gõ WPM (Nhanh nhất)</option>
                      <option value="streak_desc">🔥 Chuỗi ngày liên tục (Dài nhất)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* DANH SÁCH BẢNG XẾP HẠNG NGƯỜI DÙNG (24+ NGƯỜI DÙNG ĐA DẠNG) */}
            <div className="space-y-2">
              {sortedRankings.map((user, index) => {
                const isSelf = user.id === 'USR-GLOBAL-01';
                const displayRank = personalSortBy === 'rank_asc' ? user.rank : index + 1;

                return (
                  <div
                    key={user.id}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 text-xs ${
                      isSelf
                        ? 'bg-emerald-50/90 border-emerald-500 shadow-sm ring-1 ring-emerald-400/30'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`w-7 h-7 rounded-xl font-mono text-xs font-bold flex items-center justify-center shrink-0 ${
                        displayRank === 1 ? 'bg-amber-100 text-amber-800' :
                        displayRank === 2 ? 'bg-slate-200 text-slate-800' :
                        displayRank === 3 ? 'bg-orange-100 text-orange-800' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        #{displayRank}
                      </span>

                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />

                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5 truncate">
                          <span>{user.name}</span>
                          {isSelf && (
                            <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-emerald-600 text-white">
                              BẠN
                            </span>
                          )}
                          {user.badge && (
                            <span className="hidden sm:inline-block px-2 py-0.2 rounded-md text-[9px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                              {user.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">📍 {user.location}</div>
                        <div className="text-[10px] font-mono text-emerald-700 flex items-center gap-2 truncate mt-0.5">
                          <span>Thời gian: {user.workHours?.[personalRankPeriod] || user.workHours?.week}h</span>
                          <span>•</span>
                          <span className="text-purple-700 font-bold">⌨️ {user.wpm || 55} WPM</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-right shrink-0">
                      <div>
                        <div className="font-mono font-bold text-slate-900 text-xs">
                          {user.ergonomicsScore}đ <span className="text-[10px] text-slate-500 font-normal">tư thế</span>
                        </div>
                        <div className="text-[10px] font-bold text-emerald-700">
                          🔥 {user.streakDays} ngày streak
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        {user.tier}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* ===================== TAB 5: VIDEO BẢN GHI CAMERA & MÀN HÌNH ===================== */}
      {currentTab === 'personal_recordings' && (
        <div className="space-y-3.5">
          <div className="p-3 bg-white border border-slate-200 rounded-2xl flex items-center justify-between text-xs shadow-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold text-slate-900 text-sm">Kho Video Camera Bàn & Video Quay Màn Hình Cá Nhân</span>
            </div>
            <button 
              onClick={() => showToast('Đang trích xuất clip video 15 phút vừa qua của bạn... Đã lưu vào kho bản ghi!')}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-xs transition-all flex items-center gap-1.5"
            >
              <Film className="w-3.5 h-3.5" />
              <span>Ghi Clip Video Mới</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOCK_VIDEO_RECORDINGS.slice(0, 3).map(rec => (
              <div 
                key={rec.id} 
                onClick={() => {
                  setSelectedPersonalVideo(rec);
                  setIsPersonalVideoPlaying(true);
                }}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all text-xs cursor-pointer group flex flex-col justify-between"
              >
                <div className="relative h-48 bg-slate-950 overflow-hidden">
                  <img 
                    src={rec.thumbnail} 
                    alt={rec.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-all">
                    <div className="w-11 h-11 rounded-full bg-white/90 text-slate-900 group-hover:bg-emerald-500 group-hover:text-white transition-all flex items-center justify-center shadow-xl">
                      <Play className="w-5 h-5 ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/75 text-amber-300 font-mono text-[10px] font-bold">
                    {rec.duration}
                  </span>
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/75 text-emerald-300 font-mono text-[9px] font-bold">
                    {rec.resolution || '1080p @ 30fps'}
                  </span>
                </div>
                <div className="p-3.5 space-y-1">
                  <div className="font-bold text-slate-900 text-xs line-clamp-1 group-hover:text-emerald-600 transition-colors">
                    {rec.title}
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{rec.description}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                    <span>{rec.recordedAt || 'Hôm nay, 10:30'}</span>
                    <span className="text-emerald-600 font-semibold">Bấm để phát video &rarr;</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================== TAB 6: BÁO CÁO CÁ NHÂN (NGÀY, TUẦN, THÁNG, NĂM) ===================== */}
      {currentTab === 'personal_reports' && (
        <div className="space-y-3.5">
          <div className="p-3 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs shadow-xs">
            <span className="font-bold text-slate-900 text-sm">Báo Cáo Sức Khỏe Tư Thế & Năng Suất Làm Việc Cá Nhân</span>

            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl font-medium">
              <button
                onClick={() => setReportPeriod('day')}
                className={`px-3 py-1.5 rounded-lg transition-all ${reportPeriod === 'day' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600'}`}
              >
                Hôm Nay
              </button>
              <button
                onClick={() => setReportPeriod('week')}
                className={`px-3 py-1.5 rounded-lg transition-all ${reportPeriod === 'week' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600'}`}
              >
                Tuần Này
              </button>
              <button
                onClick={() => setReportPeriod('month')}
                className={`px-3 py-1.5 rounded-lg transition-all ${reportPeriod === 'month' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600'}`}
              >
                Tháng Này
              </button>
              <button
                onClick={() => setReportPeriod('year')}
                className={`px-3 py-1.5 rounded-lg transition-all ${reportPeriod === 'year' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600'}`}
              >
                Cả Năm
              </button>
            </div>
          </div>

          {/* 4 Thẻ KPI Cá Nhân */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
              <div className="text-slate-500 text-[11px] font-medium">Điểm Tư Thế TB</div>
              <div className="text-2xl font-bold text-emerald-600 font-mono mt-1">94 / 100</div>
              <div className="text-[10px] text-emerald-600 mt-0.5">✓ Đạt chuẩn công thái học ISO</div>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
              <div className="text-slate-500 text-[11px] font-medium">Tổng Giờ Học/Làm</div>
              <div className="text-2xl font-bold text-slate-900 font-mono mt-1">
                {reportPeriod === 'day' ? '8.5 Giờ' : reportPeriod === 'week' ? '43.5 Giờ' : reportPeriod === 'month' ? '178 Giờ' : '2,140 Giờ'}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Ghi nhận liên tục qua AI</div>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
              <div className="text-slate-500 text-[11px] font-medium">Cảnh Báo Gù Lưng</div>
              <div className="text-2xl font-bold text-teal-600 font-mono mt-1">
                {reportPeriod === 'day' ? '2 Lần' : reportPeriod === 'week' ? '9 Lần' : reportPeriod === 'month' ? '32 Lần' : '380 Lần'}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Đã tự sửa sau tiếng chuông</div>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
              <div className="text-slate-500 text-[11px] font-medium">Hạng Bảng Toàn Cầu</div>
              <div className="text-2xl font-bold text-amber-600 font-mono mt-1">Top #1</div>
              <div className="text-[10px] text-amber-700 mt-0.5">Tier Kim Cương • Streak 4 ngày</div>
            </div>
          </div>

          {/* Biểu đồ so sánh 7 ngày và Lời khuyên công thái học */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start text-xs">
            <div className="lg:col-span-8 p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
              <div className="font-bold text-slate-900 flex items-center justify-between pb-2 border-b border-slate-100">
                <span>Diễn Biến Điểm Số Tư Thế & Giờ Tập Trung 7 Ngày Qua</span>
                <span className="font-mono text-emerald-600 font-bold">TB: 92.4 Điểm</span>
              </div>

              {/* 7-Day Bar Chart */}
              <div className="grid grid-cols-7 gap-2 h-36 items-end pt-2 px-1">
                {[
                  { day: 'T2', score: 88, hours: '7.8h' },
                  { day: 'T3', score: 91, hours: '8.2h' },
                  { day: 'T4', score: 86, hours: '8.0h' },
                  { day: 'T5', score: 94, hours: '8.5h' },
                  { day: 'T6', score: 92, hours: '8.1h' },
                  { day: 'T7', score: 96, hours: '6.5h' },
                  { day: 'CN', score: 98, hours: '5.2h' }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] font-mono text-emerald-700 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.score}đ
                    </span>
                    <div 
                      style={{ height: `${(item.score / 100) * 100}%` }} 
                      className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 rounded-lg group-hover:from-emerald-500 group-hover:to-teal-300 transition-all shadow-xs"
                    />
                    <div className="text-[11px] font-bold text-slate-700">{item.day}</div>
                    <div className="text-[9px] text-slate-400 font-mono">{item.hours}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
              <div className="font-bold text-slate-900 pb-2 border-b border-slate-100">
                Đánh Giá Cột Sống AI
              </div>
              <div className="space-y-2 text-[11px] leading-relaxed text-slate-600">
                <p>
                  ✓ Cột sống thắt lưng được giữ thẳng 98% thời gian làm việc.
                </p>
                <p>
                  ✓ Góc nhìn cổ duy trì trong khoảng 15-22° (rất an toàn cho đốt sống cổ C1-C7).
                </p>
                <p className="text-emerald-700 font-semibold">
                  Khuyến nghị: Tiếp tục duy trì thói quen nghỉ ngơi 5 phút sau mỗi 50 phút tập trung!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 7: CÀI ĐẶT CAMERA CÁ NHÂN (CHẾ ĐỘ CÁ NHÂN ĐẦY ĐỦ) ===================== */}
      {currentTab === 'personal_cameras' && (
        <CameraSetupView mode="personal" />
      )}

      {/* Video Modal Player Cá Nhân */}
      {selectedPersonalVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl space-y-3 p-4 animate-in zoom-in-95 text-white">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <h4 className="font-bold text-sm text-white">{selectedPersonalVideo.title}</h4>
                <div className="text-xs text-slate-400">{selectedPersonalVideo.duration} • Bản ghi cá nhân</div>
              </div>
              <button 
                onClick={() => setSelectedPersonalVideo(null)}
                className="text-slate-400 hover:text-white text-base font-bold p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center">
              <img 
                src={selectedPersonalVideo.thumbnail} 
                alt={selectedPersonalVideo.title} 
                className="w-full h-full object-cover filter brightness-90" 
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <button
                  onClick={() => setIsPersonalVideoPlaying(!isPersonalVideoPlaying)}
                  className="w-16 h-16 rounded-full bg-emerald-600/90 text-white flex items-center justify-center hover:scale-110 transition-all shadow-xl"
                >
                  {isPersonalVideoPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
                </button>
              </div>
              <div className="absolute bottom-3 left-3 bg-black/75 px-3 py-1 rounded-lg text-xs font-mono text-emerald-400">
                ● LIVE REPLAY: {selectedPersonalVideo.duration}
              </div>
            </div>

            <p className="text-xs text-slate-300 px-1">{selectedPersonalVideo.description}</p>
          </div>
        </div>
      )}

      {/* MODAL THÊM KHUNG GIỜ THỜI KHÓA BIỂU */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-900">Thêm Khung Giờ Công Việc Mới</h4>
              <button onClick={() => setShowAddTaskModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Khung giờ:</label>
                <input
                  type="text"
                  required
                  value={newTaskData.time}
                  onChange={(e) => setNewTaskData({ ...newTaskData, time: e.target.value })}
                  placeholder="Ví dụ: 14:00 - 15:30"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tên công việc / mục tiêu:</label>
                <input
                  type="text"
                  required
                  value={newTaskData.title}
                  onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
                  placeholder="Ví dụ: Lập trình frontend"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ứng dụng cho phép:</label>
                <input
                  type="text"
                  value={newTaskData.targetApp}
                  onChange={(e) => setNewTaskData({ ...newTaskData, targetApp: e.target.value })}
                  placeholder="Ví dụ: VS Code, Figma"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ghi chú:</label>
                <input
                  type="text"
                  value={newTaskData.note}
                  onChange={(e) => setNewTaskData({ ...newTaskData, note: e.target.value })}
                  placeholder="Ghi chú nhắc nhở"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-xs"
                >
                  Lưu Khung Giờ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

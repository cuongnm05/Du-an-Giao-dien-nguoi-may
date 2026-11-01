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

      {/* ===================== TAB 1: BÀN LÀM VIỆC & CAMERA AI ===================== */}
      {(currentTab === 'personal_desk' || currentTab === 'dashboard') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Cột trái (8 cols): Hệ Thống Giám Sát 3 Luồng Cá Nhân (Cam Ngoài + Cam Màn Hình + Bàn Phím Chuột) */}
          <div className="lg:col-span-8 space-y-3">
            <WorkstationTriMonitor
              cam={personalWorkstationData}
              member={{ name: 'Nguyễn Văn Cường' }}
              mode="personal"
              showControls={true}
            />

            {/* Toggles cài đặt nhanh */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">Theo Dõi Cột Sống</div>
                  <div className="text-[10px] text-slate-500">Cảnh báo gù lưng/rướn cổ</div>
                </div>
                <input type="checkbox" defaultChecked className="rounded text-emerald-600 h-4 w-4" />
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">Âm Báo Chuông</div>
                  <div className="text-[10px] text-slate-500">Phát âm thanh nhẹ khi ngồi sai</div>
                </div>
                <input type="checkbox" defaultChecked className="rounded text-emerald-600 h-4 w-4" />
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">Nhắc Nhở Tập Trung</div>
                  <div className="text-[10px] text-slate-500">{isNotificationsEnabled ? 'Đang bật nhắc việc' : 'Đang tắt thông báo'}</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={isNotificationsEnabled} 
                  onChange={(e) => {
                    setIsNotificationsEnabled(e.target.checked);
                    showToast(e.target.checked ? 'Đã bật thông báo nhắc nhở tập trung' : 'Đã tắt thông báo nhắc nhở');
                  }}
                  className="rounded text-emerald-600 h-4 w-4" 
                />
              </div>
            </div>
          </div>

          {/* Cột phải (4 cols): Đồng hồ Pomodoro & Lịch trình đang diễn ra */}
          <div className="lg:col-span-4 space-y-3">
            
            {/* Box Pomodoro Focus */}
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs text-center space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold text-slate-800">Đồng Hồ Pomodoro Tập Trung</span>
                <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold">Hiệp 2/4</span>
              </div>

              <div className="py-1">
                <div className="text-5xl font-mono font-bold text-slate-900 tracking-tight">
                  {String(pomodoroMinutes).padStart(2, '0')}:{String(pomodoroSeconds).padStart(2, '0')}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Đang tập trung cho nhiệm vụ hiện tại
                </div>
              </div>

              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setIsPomodoroRunning(!isPomodoroRunning)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
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

            {/* Nhiệm vụ đang diễn ra & Nhiệm vụ tiếp theo */}
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>Nhiệm Vụ Đang Thực Hiện</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800">
                  Active
                </span>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                <div className="font-mono text-emerald-700 font-bold text-[11px]">{activeTask.time}</div>
                <div className="font-bold text-slate-900">{activeTask.title}</div>
                <div className="text-slate-600 text-[11px]">{activeTask.note}</div>
                <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Ứng dụng: <strong className="text-slate-800">{activeTask.targetApp}</strong></span>
                  <button 
                    onClick={() => showToast('Đã đánh dấu hoàn thành nhiệm vụ này!')}
                    className="text-emerald-700 font-bold hover:underline"
                  >
                    Xong việc ✓
                  </button>
                </div>
              </div>

              {/* Nhiệm vụ tiếp theo */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Việc tiếp theo (Sau 15 phút):</span>
                  <span className="font-mono text-slate-500 text-[10px]">{nextTaskReminder.time}</span>
                </div>
                <div className="font-semibold text-slate-800">{nextTaskReminder.title}</div>
                <div className="text-slate-500 text-[11px]">Ứng dụng: {nextTaskReminder.app}</div>
              </div>

              <button
                onClick={() => setCurrentTab('personal_timetable')}
                className="w-full py-2 text-center font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                Xem Toàn Bộ Thời Khóa Biểu &rarr;
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ===================== TAB 2: THỜI KHÓA BIỂU & LỊCH TRÌNH ===================== */}
      {currentTab === 'personal_timetable' && (
        <div className="space-y-3">
          <div className="p-3 bg-white border border-slate-200 rounded-2xl flex items-center justify-between text-xs shadow-xs">
            <span className="font-bold text-slate-800 text-sm">Thời Khóa Biểu Công Việc & Học Tập Trong Ngày</span>
            <button
              onClick={() => setShowAddTaskModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Khung Giờ Mới</span>
            </button>
          </div>

          <div className="space-y-2">
            {timetable.map((task) => {
              const isCurrent = task.status === 'in_progress';
              const isDone = task.status === 'completed';

              return (
                <div
                  key={task.id}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                    isCurrent
                      ? 'bg-emerald-50/70 border-emerald-400 shadow-sm ring-1 ring-emerald-400/30'
                      : isDone
                      ? 'bg-slate-50 border-slate-200 opacity-80'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                      isCurrent ? 'bg-emerald-600 text-white' : isDone ? 'bg-slate-200 text-slate-600' : 'bg-slate-100 text-slate-500'
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

                      <h4 className="font-bold text-slate-900 mt-0.5">{task.title}</h4>
                      <p className="text-slate-500 mt-0.5 text-[11px]">{task.note}</p>
                      <div className="mt-1 text-[11px] text-slate-600">
                        Ứng dụng cho phép: <span className="font-semibold text-emerald-700">{task.targetApp}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => {
                        setTimetable(prev => prev.map(t => t.id === task.id ? { ...t, status: t.status === 'completed' ? 'upcoming' : 'completed' } : t));
                        showToast(`Đã cập nhật trạng thái: "${task.title}"`);
                      }}
                      className={`px-3 py-1.5 rounded-xl font-semibold border transition-all ${
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
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================== TAB 3: TRỢ LÝ CHỐNG TRÌ HOÃN & NHẮC VIỆC ===================== */}
      {currentTab === 'personal_assistant' && (
        <div className="space-y-3">
          <div className="p-3 bg-white border border-slate-200 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold text-slate-900">Trợ Lý AI Nhắc Nhở & Chống Trì Hoãn Real-Time</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSimulateDistraction}
                className="px-3.5 py-1.5 rounded-xl font-semibold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
              >
                Mô Phỏng: Làm Việc Riêng
              </button>

              <button
                onClick={() => {
                  setIsNotificationsEnabled(!isNotificationsEnabled);
                  showToast(!isNotificationsEnabled ? 'Đã bật thông báo nhắc nhở' : 'Đã tắt thông báo nhắc nhở');
                }}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-white transition-all ${
                  isNotificationsEnabled ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-slate-600 hover:bg-slate-700'
                }`}
              >
                {isNotificationsEnabled ? 'Thông Báo: Đang Bật' : 'Thông Báo: Đang Tắt'}
              </button>
            </div>
          </div>

          {/* Nhắc nhở sẽ làm gì tiếp theo real-time */}
          <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-white border border-emerald-200 rounded-2xl shadow-xs space-y-2 text-xs">
            <div className="flex items-center justify-between text-emerald-800 font-bold uppercase tracking-wider text-[11px]">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Nhắc Nhở Real-Time: Việc Cần Làm Tiếp Theo</span>
              </span>
              <span className="font-mono text-emerald-700">Tự động kích hoạt</span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-white/90 rounded-xl border border-emerald-100">
              <div>
                <div className="font-mono font-bold text-emerald-700 text-xs">{nextTaskReminder.time}</div>
                <div className="font-bold text-slate-900 text-sm mt-0.5">{nextTaskReminder.title}</div>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Đã hoàn thành 85% task hiện tại. Khi hết giờ, hãy mở ngay ứng dụng <strong>{nextTaskReminder.app}</strong> để tiếp tục chuỗi tập trung!
                </p>
              </div>

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
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-xs shrink-0 flex items-center gap-1.5"
              >
                <span>Bắt Đầu Việc Này</span>
                <ArrowRight className="w-4 h-4" />
              </button>
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
        <div className="space-y-3">
          <div className="p-3 bg-white border border-slate-200 rounded-2xl flex items-center justify-between text-xs shadow-xs">
            <span className="font-bold text-slate-900 text-sm">Video Bản Ghi Camera Bàn & Video Màn Hình Cá Nhân</span>
            <button 
              onClick={() => showToast('Đang trích xuất clip video 15 phút vừa qua của bạn... Đã lưu!')}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-xs"
            >
              Ghi Clip Video Mới
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {MOCK_VIDEO_RECORDINGS.slice(0, 3).map(rec => (
              <div key={rec.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all text-xs">
                <div className="relative h-44 bg-slate-950">
                  <img src={rec.thumbnail} alt={rec.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center">
                      <Play className="w-4 h-4 ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/75 text-amber-300 font-mono text-[10px] font-bold">
                    {rec.duration}
                  </span>
                </div>
                <div className="p-3 space-y-1">
                  <div className="font-bold text-slate-900 line-clamp-1">{rec.title}</div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{rec.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================== TAB 6: BÁO CÁO CÁ NHÂN (NGÀY, TUẦN, THÁNG, NĂM) ===================== */}
      {currentTab === 'personal_reports' && (
        <div className="space-y-3">
          <div className="p-3 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-2 text-xs shadow-xs">
            <span className="font-bold text-slate-900 text-sm">Báo Cáo Sức Khỏe Tư Thế & Giờ Làm Việc Cá Nhân</span>

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

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <div className="text-slate-500 text-[11px]">Điểm Tư Thế TB</div>
              <div className="text-lg font-bold text-emerald-600 font-mono mt-0.5">94 / 100</div>
              <div className="text-[10px] text-emerald-600">Đạt chuẩn ISO</div>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <div className="text-slate-500 text-[11px]">Tổng Giờ Học/Làm</div>
              <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                {reportPeriod === 'day' ? '8.5 Giờ' : reportPeriod === 'week' ? '43.5 Giờ' : reportPeriod === 'month' ? '178 Giờ' : '2,140 Giờ'}
              </div>
              <div className="text-[10px] text-slate-500">Ghi nhận liên tục</div>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <div className="text-slate-500 text-[11px]">Số Lần Cảnh Báo Gù Lưng</div>
              <div className="text-lg font-bold text-teal-600 font-mono mt-0.5">
                {reportPeriod === 'day' ? '2 Lần' : reportPeriod === 'week' ? '9 Lần' : reportPeriod === 'month' ? '32 Lần' : '380 Lần'}
              </div>
              <div className="text-[10px] text-slate-500">Đã điều chỉnh ngay</div>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <div className="text-slate-500 text-[11px]">Xếp Hạng Toàn Cầu</div>
              <div className="text-lg font-bold text-amber-600 font-mono mt-0.5">Top #1 (Kim Cương)</div>
              <div className="text-[10px] text-slate-500">Dẫn đầu bảng thành tích</div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 7: CÀI ĐẶT CAMERA CÁ NHÂN (GIỐNG HỆ THỐNG DOANH NGHIỆP) ===================== */}
      {currentTab === 'personal_cameras' && (
        <CameraSetupView />
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

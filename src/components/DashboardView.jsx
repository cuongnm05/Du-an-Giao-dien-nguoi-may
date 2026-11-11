import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Keyboard, 
  MousePointer, 
  Camera, 
  ChevronRight, 
  ArrowUpRight, 
  Bell, 
  Activity, 
  ShieldCheck, 
  Flame, 
  TrendingUp, 
  UserCheck, 
  Sliders,
  Laptop,
  Trophy,
  Film,
  Users,
  Play,
  Pause,
  ExternalLink,
  Maximize2
} from 'lucide-react';
import { MOCK_VIDEO_RECORDINGS } from '../data/mockData';
import WorkstationInspectorModal from './WorkstationInspectorModal';

export default function DashboardView({ 
  members = [], 
  cameras = [], 
  alerts = [], 
  onSelectMember, 
  onNavigateTab 
}) {
  const [liveClock, setLiveClock] = useState(() => new Date().toLocaleTimeString('vi-VN'));
  const [notificationToast, setNotificationToast] = useState(null);
  const [inspectorCam, setInspectorCam] = useState(null);

  // Auto patrol state
  const [isPatrolling, setIsPatrolling] = useState(false);
  const [patrolIndex, setPatrolIndex] = useState(0);

  // Clock tick
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveClock(new Date().toLocaleTimeString('vi-VN'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Patrol cycling every 4 seconds
  useEffect(() => {
    let interval;
    if (isPatrolling && cameras.length > 0) {
      interval = setInterval(() => {
        setPatrolIndex(prev => (prev + 1) % cameras.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isPatrolling, cameras]);

  // Featured spotlight camera (dynamic or cycling with patrol)
  const defaultSpotlightCam = cameras.find(c => c.status === 'warning' || c.isProcessViolating) || cameras[0] || {};
  const spotlightCam = isPatrolling && cameras.length > 0 
    ? cameras[patrolIndex % cameras.length] 
    : defaultSpotlightCam;
  const spotlightMember = members.find(m => m.camId === spotlightCam.id || m.name === spotlightCam.assignedTo) || members[0] || {};

  // Top 4 ranked employees for summary leaderboard snippet
  const topRankedEmployees = [...members]
    .sort((a, b) => (a.rank || 99) - (b.rank || 99))
    .slice(0, 4);

  // 2 recent video recordings for video snippet
  const recentRecordings = MOCK_VIDEO_RECORDINGS.slice(0, 2);

  // 3 recent alerts for alert snippet
  const recentAlerts = alerts.slice(0, 3);

  // Department health summary
  const departments = [
    { name: 'R&D', total: 6, good: 5, score: 94 },
    { name: 'UI/UX', total: 5, good: 5, score: 96 },
    { name: 'Kế Toán', total: 5, good: 4, score: 88 },
    { name: 'Marketing', total: 6, good: 5, score: 90 },
    { name: 'Sales', total: 5, good: 4, score: 86 },
    { name: 'DevOps', total: 5, good: 5, score: 95 }
  ];

  // Send quick buzzer reminder
  const handleQuickBuzzer = () => {
    setNotificationToast({
      title: 'Đã gửi chuông công thái học',
      desc: `Phát chuông nhắc nhở nhân sự ${spotlightMember.name} (${spotlightCam.id}) ngồi thẳng lưng!`
    });
    setTimeout(() => setNotificationToast(null), 3500);
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      
      {/* Toast Notification */}
      {notificationToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 p-4 bg-white border border-emerald-500 rounded-2xl shadow-2xl text-xs text-slate-800 animate-in slide-in-from-bottom-5 duration-200">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-900">{notificationToast.title}</div>
            <div className="text-slate-600">{notificationToast.desc}</div>
          </div>
          <button 
            onClick={() => setNotificationToast(null)}
            className="text-slate-400 hover:text-slate-700 ml-2 text-sm font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* ===================== HEADER TỔNG QUAN HỆ THỐNG ===================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-200/80">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Bảng Điều Hành Tổng Quan</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tóm tắt chỉ số sức khỏe tư thế & năng suất toàn doanh nghiệp • Ca làm việc: 08:00 - 17:30
          </p>
        </div>

        {/* Nút Giám Sát Tự Động */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const next = !isPatrolling;
              setIsPatrolling(next);
              setNotificationToast(next ? 'Đã bật chế độ giám sát tự động qua các máy trạm!' : 'Đã dừng giám sát tự động.');
              setTimeout(() => setNotificationToast(null), 3500);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98] ${
              isPatrolling
                ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-500 shadow-amber-500/25 animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-600 shadow-emerald-600/25'
            }`}
            title="Tự động đảo góc nhìn qua từng máy trạm mỗi 4 giây"
          >
            {isPatrolling ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4 fill-current" />
            )}
            <span>{isPatrolling ? 'Dừng Giám Sát' : 'Giám Sát Tự Động'}</span>
          </button>
        </div>
      </div>

      {/* ===================== 4 THẺ KPI CHỈ SỐ CỐT LÕI ===================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* KPI 1: Quy mô máy giám sát */}
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-500">Quy Mô Giám Sát</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Monitor className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {cameras.length} / {cameras.length} Máy
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>100% Hoạt động • 6 Phòng ban</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Tỷ lệ ngồi chuẩn AI */}
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-500">Tỷ Lệ Ngồi Chuẩn AI</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight flex items-baseline gap-2">
              <span>87.5%</span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                +4.2% tuần này
              </span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {Math.max(1, Math.round(members.length * 0.875))}/{members.length} nhân sự ngồi chuẩn cột sống
            </div>
          </div>
        </div>

        {/* KPI 3: Tốc độ phím chuột TB */}
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-500">Năng Suất Phím & Chuột</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Keyboard className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight flex items-baseline gap-1.5">
              <span>56</span>
              <span className="text-xs font-normal text-slate-500">WPM TB</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Nhịp gõ tích cực • ~24 click chuột/phút
            </div>
          </div>
        </div>

        {/* KPI 4: Cảnh báo cần chú ý */}
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-500">Cảnh Báo Cần Chú Ý</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight flex items-baseline gap-2">
              <span className="text-amber-600">4 Trường Hợp</span>
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md">
                Cần nhắc
              </span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              2 Gù lưng, 1 Dùng phone, 1 Treo máy
            </div>
          </div>
        </div>

      </div>

      {/* ===================== HÀNG CHÍNH 1: TIÊU ĐIỂM CAMERA LIVE & SỨC KHỎE THEO PHÒNG BAN ===================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* WIDGET 1 (7 cols): TIÊU ĐIỂM CAMERA TRỰC TIẾP (Chỉ 1 máy tiêu biểu, có nút Xem Tất Cả Camera) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-slate-900 text-sm">Tiêu Điểm Camera Trực Tiếp</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-bold">
                  {spotlightCam.id}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                LIVE SPOTLIGHT • 30 FPS
              </span>
            </div>

            {/* Màn hình camera thật sắc nét với OSD tối giản - Bấm để xem chi tiết máy */}
            <div 
              onClick={() => setInspectorCam(spotlightCam)}
              className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video mt-3 group shadow-inner cursor-pointer"
            >
              <img 
                src={spotlightCam.webcamUrl} 
                alt={spotlightCam.name} 
                className="w-full h-full object-cover filter contrast-[1.05] brightness-[0.95] group-hover:scale-105 transition-transform duration-300" 
              />

              {/* OSD Header */}
              <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white font-mono text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                <span>{spotlightCam.name}</span>
                <span>•</span>
                <span>{liveClock}</span>
              </div>

              {/* OSD Posture Status */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] font-mono">
                <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-emerald-300 font-bold">
                  {spotlightCam.currentPosture === 'good' ? '✓ Tư thế chuẩn (Lưng 98°)' : '⚠ Cần chú ý tư thế'}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-slate-300">
                  {spotlightCam.location}
                </span>
              </div>

              {/* Hover overlay button */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="px-3.5 py-1.5 rounded-xl bg-white/90 text-slate-900 font-bold text-xs shadow-md flex items-center gap-1.5">
                  <Maximize2 className="w-4 h-4 text-emerald-600" />
                  <span>Xem Chi Tiết Máy Phóng To</span>
                </span>
              </div>
            </div>

            {/* Tóm tắt 3 Luồng Giám Sát */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-3">
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] text-slate-400 font-semibold">1. Cam Ngoài</div>
                <div className="font-bold text-slate-800 text-xs mt-0.5 truncate">
                  {spotlightCam.currentPosture === 'good' ? 'Ngồi Chuẩn' : 'Cần Nhắc'}
                </div>
              </div>

              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] text-slate-400 font-semibold">2. Màn Hình</div>
                <div className="font-bold text-blue-700 text-xs mt-0.5 truncate font-mono">
                  {spotlightCam.activeProcess || 'code.exe'}
                </div>
              </div>

              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] text-slate-400 font-semibold">3. Phím & Chuột</div>
                <div className="font-bold text-purple-700 text-xs mt-0.5 font-mono">
                  {spotlightCam.inputTelemetry?.wpm || 58} WPM
                </div>
              </div>
            </div>
          </div>

          {/* Footer nút hành động: Nhắc nhở, Xem chi tiết & NÚT XEM TẤT CẢ CAMERA */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={handleQuickBuzzer}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl transition-colors border border-rose-200"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Gửi Chuông Nhắc Nhở</span>
              </button>
              
              <button
                onClick={() => setInspectorCam(spotlightCam)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors border border-slate-200"
              >
                <Maximize2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Xem Chi Tiết Máy</span>
              </button>
            </div>

            {/* Nút Xem Tất Cả Camera theo đúng tư duy Dashboard */}
            <button
              onClick={() => onNavigateTab('multicam')}
              className="flex items-center gap-1 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-xs transition-all"
            >
              <span>Xem Tất Cả {cameras.length} Camera</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* WIDGET 2 (5 cols): TỔNG QUAN CÔNG THÁI HỌC THEO PHÒNG BAN (Có nút Xem Danh Sách Nhân Viên) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-slate-900 text-sm">Sức Khỏe Tư Thế 6 Phòng Ban</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Hôm Nay</span>
            </div>

            {/* Danh sách 6 phòng ban tóm tắt thanh tiến độ */}
            <div className="space-y-2.5 pt-2 text-xs">
              {departments.map((dept, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-800">{dept.name} ({dept.total} máy)</span>
                    <span className="font-mono text-emerald-700 font-bold">{dept.good}/{dept.total} Chuẩn • {dept.score}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${dept.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer nút Xem Tất Cả Danh Sách Nhân Viên */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 text-[11px]">Tổng cộng {members.length} nhân sự</span>
            <button
              onClick={() => onNavigateTab('members')}
              className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
            >
              <span>Xem Danh Sách Nhân Viên</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* ===================== HÀNG CHÍNH 2: TÓM TẮT XẾP HẠNG, BẢN GHI VIDEO & CẢNH BÁO (3 CỘT GỌN GÀNG) ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* WIDGET 3: TÓM TẮT BẢNG XẾP HẠNG NHÂN VIÊN (Top 4 người + Nút Xem Toàn Bộ Xếp Hạng) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Top Thi Đua Công Thái Học</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Top 4</span>
            </div>

            {/* List 4 nhân viên dẫn đầu */}
            <div className="space-y-2 pt-1 text-xs">
              {topRankedEmployees.map((emp, index) => (
                <div key={emp.id} className="p-2 bg-slate-50 rounded-xl flex items-center justify-between gap-2 border border-slate-100">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-5 h-5 rounded-lg font-mono text-[10px] font-bold flex items-center justify-center shrink-0 ${
                      index === 0 ? 'bg-amber-100 text-amber-800' :
                      index === 1 ? 'bg-slate-200 text-slate-700' :
                      index === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      #{index + 1}
                    </span>
                    <img src={emp.avatar} alt={emp.name} className="w-7 h-7 rounded-lg object-cover shrink-0" />
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 truncate text-[11px]">{emp.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{emp.department.replace('Phòng ', '')}</div>
                    </div>
                  </div>

                  <span className="font-mono font-bold text-emerald-700 text-[11px] shrink-0">
                    {emp.ergonomicsScore}đ
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Nút Xem Tất Cả Bảng Xếp Hạng */}
          <div className="pt-2 border-t border-slate-100 text-right">
            <button
              onClick={() => onNavigateTab('rankings')}
              className="w-full py-1.5 text-center font-bold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl transition-colors flex items-center justify-center gap-1 text-xs"
            >
              <span>Xem Tất Cả {members.length} Nhân Viên (Xếp Hạng & Thưởng)</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* WIDGET 4: TÓM TẮT BẢN GHI VIDEO MỚI NHẤT (Chỉ 2 video + Nút Xem Tất Cả Bản Ghi) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <Film className="w-4 h-4 text-teal-600" />
                <span>Bản Ghi Video Mới Nhất</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">2 Clip Mới</span>
            </div>

            {/* 2 Video clips tóm tắt */}
            <div className="space-y-2 pt-1 text-xs">
              {recentRecordings.map((rec) => (
                <div key={rec.id} className="p-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2.5">
                  <div className="relative w-14 h-11 rounded-lg overflow-hidden shrink-0 bg-slate-900">
                    <img src={rec.thumbnail} alt={rec.title} className="w-full h-full object-cover" />
                    <span className="absolute bottom-0.5 right-0.5 bg-black/80 px-1 py-0.2 rounded text-[8px] text-white font-mono">
                      {rec.duration}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-slate-900 truncate text-[11px]">{rec.title}</div>
                    <div className="text-[10px] text-slate-500 truncate">{rec.memberName} • {rec.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nút Xem Tất Cả Video Bản Ghi */}
          <div className="pt-2 border-t border-slate-100 text-right">
            <button
              onClick={() => onNavigateTab('recordings')}
              className="w-full py-1.5 text-center font-bold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl transition-colors flex items-center justify-center gap-1 text-xs"
            >
              <span>Xem Tất Cả Video Camera & Màn Hình</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* WIDGET 5: TÓM TẮT CẢNH BÁO AI GẦN NHẤT (Chỉ 3 cảnh báo + Nút Xem Báo Cáo Phân Tích) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>Cảnh Báo AI Gần Nhất</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Real-time</span>
            </div>

            {/* 3 cảnh báo mới nhất */}
            <div className="space-y-2 pt-1 text-xs">
              {recentAlerts.map((alt, index) => (
                <div key={alt.id || index} className="p-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                    <div className="min-w-0">
                      <span className="font-semibold text-slate-900 text-[11px] truncate block">{alt.memberName} ({alt.camId})</span>
                      <span className="text-slate-500 text-[10px] truncate block">{alt.title}</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 shrink-0">{alt.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Nút Xem Báo Cáo Phân Tích Chi Tiết */}
          <div className="pt-2 border-t border-slate-100 text-right">
            <button
              onClick={() => onNavigateTab('reports')}
              className="w-full py-1.5 text-center font-bold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl transition-colors flex items-center justify-center gap-1 text-xs"
            >
              <span>Xem Báo Cáo & Thống Kê Toàn Bộ</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Enlarged Workstation Inspector Modal */}
      {inspectorCam && (
        <WorkstationInspectorModal
          cam={inspectorCam}
          member={members.find(m => m.camId === inspectorCam.id || m.name === inspectorCam.assignedTo) || spotlightMember}
          onClose={() => setInspectorCam(null)}
          onSendBuzzer={() => {
            handleQuickBuzzer();
          }}
        />
      )}

    </div>
  );
}

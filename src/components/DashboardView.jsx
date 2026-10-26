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
  LayoutGrid
} from 'lucide-react';
import AiVisionFeed from './AiVisionFeed';
import { HOURLY_METRICS, SYSTEM_MODES } from '../data/mockData';

export default function DashboardView({ 
  mode, 
  members, 
  cameras, 
  alerts, 
  onSelectMember, 
  onNavigateTab 
}) {
  const isEdu = mode === SYSTEM_MODES.EDUCATION;
  const [selectedCameraId, setSelectedCameraId] = useState('CAM-01');
  const [liveAlerts, setLiveAlerts] = useState(alerts);
  const [notificationToast, setNotificationToast] = useState(null);

  const selectedCam = cameras.find(c => c.id === selectedCameraId) || cameras[0];
  const assignedMember = members.find(m => m.camId === selectedCam.id) || members[0];

  const triggerLiveAlert = (newAlert) => {
    const item = {
      id: `ALT-${Date.now()}`,
      time: new Date().toLocaleTimeString('vi-VN'),
      memberId: assignedMember.id,
      memberName: assignedMember.name,
      type: newAlert.type,
      severity: newAlert.type === 'slouching' ? 'high' : 'medium',
      title: newAlert.text,
      description: 'Phát hiện sự thay đổi độ cong cột sống qua AI Camera.',
      camId: selectedCam.id,
      resolved: false
    };
    setLiveAlerts(prev => [item, ...prev.slice(0, 5)]);
    setNotificationToast(item);
    setTimeout(() => setNotificationToast(null), 4000);
  };

  const markResolved = (id) => {
    setLiveAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
  };

  return (
    <div className="space-y-6">
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

      {/* Top Banner & Quick Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {isEdu ? 'Giám Sát Giảng Đường & Lớp Học' : 'Giám Sát Văn Phòng & Nơi Làm Việc'}
            </span>
            <span className="text-slate-500 text-xs">• Ca làm việc: 08:00 - 17:30</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Bảng Điều Hành Năng Suất & Sức Khỏe Tư Thế AI
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Giao diện nền trắng sáng dịu mắt, các nút bấm và chỉ số nhận diện nổi bật với sắc xanh lá tươi sáng.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => onNavigateTab('multicam')}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all"
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Giám Sát Đa Camera</span>
          </button>
          <button
            onClick={() => onNavigateTab('cameras')}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition-all"
          >
            <Camera className="w-4 h-4 text-emerald-600" />
            <span>Cài Đặt Camera</span>
          </button>
        </div>
      </div>

      {/* KPI 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Điểm Công Thái Học TB */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs relative overflow-hidden group hover:border-emerald-500/50 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium">Điểm Công Thái Học (TB)</span>
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">87.5</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +3.8%
            </span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Tiêu chuẩn: &gt; 80 Điểm</span>
            <span className="text-emerald-600 font-semibold">Mức Rất Tốt</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '87.5%' }}></div>
          </div>
        </div>

        {/* Card 2: Tỷ Lệ Ngồi Chuẩn */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs relative overflow-hidden group hover:border-emerald-500/50 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium">Tỷ Lệ Ngồi Chuẩn (90°-105°)</span>
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Activity className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">78.4%</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +2.1%
            </span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Gù lưng / Vẹo: 21.6%</span>
            <span className="text-emerald-600 font-semibold">Cải thiện</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '78.4%' }}></div>
          </div>
        </div>

        {/* Card 3: Thời Gian Tập Trung */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs relative overflow-hidden group hover:border-emerald-500/50 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium">Thời Lượng Tập Trung Sâu</span>
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Flame className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">5.2h</span>
            <span className="text-xs text-slate-500">/ người / ngày</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Hiệu suất làm việc: 91%</span>
            <span className="text-emerald-600 font-semibold">Đạt mục tiêu</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '91%' }}></div>
          </div>
        </div>

        {/* Card 4: Cảnh Báo Gù Lưng */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs relative overflow-hidden group hover:border-amber-500/50 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium">Cảnh Báo Tư Thế Hôm Nay</span>
            <span className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">16</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
              <TrendingDown className="w-3.5 h-3.5" /> -4 so với hôm qua
            </span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Đã tự chấn chỉnh: 13</span>
            <span className="text-amber-600 font-semibold">3 cần nhắc nhở</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '81%' }}></div>
          </div>
        </div>
      </div>

      {/* Main Grid: Live AI Camera Feed + Real-time Alert Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Live Camera Stream with Skeleton Vision */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Khung Hình Giám Sát Camera AI Trực Tiếp (Live Stream)
              </h3>
            </div>
            
            {/* Quick Camera Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {cameras.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCameraId(c.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                    selectedCameraId === c.id
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {c.id}
                </button>
              ))}

              <button
                onClick={() => onNavigateTab('multicam')}
                className="ml-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 flex items-center gap-1 transition-colors whitespace-nowrap"
                title="Mở ma trận quan sát nhiều camera đồng thời"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-emerald-600" />
                <span>Xem Ma Trận {cameras.length} Cam</span>
              </button>
            </div>
          </div>

          {/* Interactive AI Feed Component */}
          <AiVisionFeed 
            camName={selectedCam.name}
            memberName={assignedMember.name}
            initialPosture={assignedMember.currentPosture}
            showControls={true}
            height="h-80"
            onAlertTrigger={triggerLiveAlert}
          />

          {/* Camera Info Metadata Bar */}
          <div className="p-3.5 bg-white border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
            <div className="flex items-center gap-3">
              <span className="text-slate-500">Vị trí:</span>
              <span className="font-semibold text-slate-800">{selectedCam.location}</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500">Góc quay:</span>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono font-medium border border-emerald-100">
                {selectedCam.angle === 'side' ? 'Góc nhìn ngang (90°)' : selectedCam.angle === 'front' ? 'Góc trực diện (0°)' : 'Góc xiên (45°)'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Ngưỡng gù:</span>
              <span className="font-mono text-amber-600 font-bold">{selectedCam.slouchThresholdSec}s</span>
              <button
                onClick={() => onNavigateTab('cameras')}
                className="text-emerald-600 hover:text-emerald-700 font-semibold underline ml-2"
              >
                Căn chỉnh lại &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Live Alert Stream & Posture Log */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Nhật Ký Cảnh Báo Tư Thế Realtime
              </h3>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">{liveAlerts.length} sự kiện</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-3.5 space-y-2.5 max-h-[460px] overflow-y-auto shadow-xs">
            {liveAlerts.map(alert => (
              <div 
                key={alert.id}
                className={`p-3 rounded-xl border transition-all ${
                  alert.resolved 
                    ? 'bg-slate-50 border-slate-200 text-slate-500'
                    : alert.severity === 'high'
                    ? 'bg-rose-50/70 border-rose-200 text-rose-900 shadow-xs'
                    : 'bg-amber-50/70 border-amber-200 text-amber-900'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-900">{alert.memberName}</span>
                  <span className="text-[10px] font-mono text-slate-500">{alert.time}</span>
                </div>
                <div className="text-xs font-semibold mb-1 text-slate-800">{alert.title}</div>
                <p className="text-[11px] text-slate-600 mb-2 leading-relaxed">{alert.description}</p>
                <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-200/60">
                  <span className="font-mono text-slate-500">{alert.camId}</span>
                  {alert.resolved ? (
                    <span className="text-emerald-600 flex items-center gap-1 font-semibold text-[10px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Đã chấn chỉnh
                    </span>
                  ) : (
                    <button
                      onClick={() => markResolved(alert.id)}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-[10px] font-semibold transition-colors shadow-xs"
                    >
                      Bấm gửi chuông nhắc nhở
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Ergonomic Break Advice Card */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
              <Coffee className="w-4 h-4 text-emerald-600" />
              <span>GỢI Ý VẬN ĐỘNG CỔ VAI GÁY</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Nhân viên tại bàn 102 đang có dấu hiệu mỏi cơ cổ. Khuyến nghị gửi thông báo thực hiện bài tập xoay cổ 30 độ và vươn vai 3 lần.
            </p>
          </div>
        </div>

      </div>

      {/* Hourly Trend Chart & Member Posture Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Hourly Productivity & Posture Curve */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                Biểu Đồ Năng Suất & Tỷ Lệ Tư Thế Chuẩn Theo Khung Giờ (Hôm nay)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Theo dõi sự suy giảm công thái học và độ mệt mỏi theo các mốc thời gian trong ngày
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span> Ngồi chuẩn
              </span>
              <span className="flex items-center gap-1.5 text-rose-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-400"></span> Gù lưng/Mỏi
              </span>
            </div>
          </div>

          {/* Bar Chart Representation */}
          <div className="h-56 flex items-end justify-between gap-2 pt-6 pb-2 border-b border-slate-100">
            {HOURLY_METRICS.map((m, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                {/* Tooltip on Hover */}
                <div className="absolute -top-12 hidden group-hover:flex flex-col items-center bg-slate-900 border border-slate-700 px-2.5 py-1 rounded shadow-xl text-[10px] z-20 pointer-events-none whitespace-nowrap text-white">
                  <span className="font-bold">{m.hour}</span>
                  <span className="text-emerald-400">Chuẩn: {m.goodPosture}%</span>
                  <span className="text-rose-400">Gù: {m.slouching}%</span>
                </div>

                {/* Stacked Bar */}
                <div className="w-full max-w-[28px] h-40 flex flex-col justify-end rounded-t overflow-hidden bg-slate-100">
                  <div 
                    className="w-full bg-rose-400 transition-all duration-300 group-hover:brightness-110"
                    style={{ height: `${m.slouching * 1.5}%` }}
                  />
                  <div 
                    className="w-full bg-emerald-500 transition-all duration-300 group-hover:brightness-110"
                    style={{ height: `${m.goodPosture * 0.9}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-slate-500 mt-1">{m.hour}</span>
              </div>
            ))}
          </div>

          {/* Insight alert callout */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Nhận định AI:</strong> Khung giờ 15:30 chiều ghi nhận tỷ lệ gù lưng cao nhất (22%), phản ánh sự mỏi mệt tích tụ. Nên thiết lập báo thức Pomodoro giải lao.
              </span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Top Ergonomics & Focus Leaderboard */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              {isEdu ? 'Bảng Xếp Hạng Học Sinh' : 'Bảng Xếp Hạng Nhân Viên'}
            </h3>
            <button 
              onClick={() => onNavigateTab('members')}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
            >
              Xem tất cả &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {members.slice(0, 4).map((member, idx) => (
              <div
                key={member.id}
                onClick={() => onSelectMember(member)}
                className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/40 border border-slate-200/80 hover:border-emerald-300 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={member.avatar} 
                      alt={member.name} 
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-200 group-hover:ring-emerald-400"
                    />
                    <span className="absolute -top-1 -left-1 flex items-center justify-center w-4 h-4 rounded-full bg-emerald-600 text-[10px] font-bold text-white shadow-xs">
                      {idx + 1}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {member.name}
                    </div>
                    <div className="text-[10px] text-slate-500">{member.department}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-xs text-emerald-600">
                    {member.ergonomicsScore} pts
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Tập trung: {member.focusTime}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-center">
            <span className="text-[11px] text-slate-400">
              Đánh giá theo thời gian duy trì lưng thẳng 90°-105° và cổ thẳng &lt; 20°
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

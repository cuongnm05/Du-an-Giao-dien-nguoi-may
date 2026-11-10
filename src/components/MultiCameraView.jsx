import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  LayoutGrid, 
  Grid3X3, 
  Maximize2, 
  Volume2, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Filter, 
  Play, 
  Pause, 
  Eye, 
  Bell, 
  Sparkles, 
  Radio,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Moon,
  VideoOff,
  Monitor,
  Keyboard,
  MousePointer
} from 'lucide-react';
import AiVisionFeed from './AiVisionFeed';
import WorkstationTriMonitor from './WorkstationTriMonitor';
import WorkstationInspectorModal from './WorkstationInspectorModal';

export default function MultiCameraView({ 
  cameras = [], 
  members = [], 
  onSelectMember, 
  onSendBuzzer 
}) {
  const [layoutMode, setLayoutMode] = useState('grid12'); // 'grid6' | 'grid12' | 'gridAll' | 'focus'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'warning' | 'good' | 'online'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [focusedCamId, setFocusedCamId] = useState(cameras[0]?.id || 'PC-01');
  const [currentPage, setCurrentPage] = useState(1);
  const [inspectorCam, setInspectorCam] = useState(null);
  const pageSize = layoutMode === 'grid6' ? 6 : layoutMode === 'grid12' ? 12 : 999;

  // Real-time clock for all cameras
  const [liveClock, setLiveClock] = useState(() => new Date().toLocaleTimeString('vi-VN'));

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveClock(new Date().toLocaleTimeString('vi-VN'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto patrol state
  const [isPatrolling, setIsPatrolling] = useState(false);
  const [broadcastNotice, setBroadcastNotice] = useState(null);

  // Auto patrol interval
  useEffect(() => {
    let interval;
    if (isPatrolling) {
      interval = setInterval(() => {
        setFocusedCamId(prev => {
          const currentIndex = cameras.findIndex(c => c.id === prev);
          const nextIndex = (currentIndex + 1) % cameras.length;
          return cameras[nextIndex].id;
        });
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPatrolling, cameras]);

  // Map cameras with their members
  const cameraFeeds = cameras.map(cam => {
    const member = members.find(m => m.camId === cam.id || m.name === cam.assignedTo) || {
      name: cam.assignedTo,
      role: 'Chuyên viên',
      department: cam.department || cam.location,
      currentPosture: cam.currentPosture || 'good',
      ergonomicsScore: 92
    };
    return { ...cam, member };
  });

  // Filter cameras
  const filteredFeeds = cameraFeeds.filter(feed => {
    const matchesSearch = feed.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          feed.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          feed.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'all' || feed.location.includes(selectedDept) || (feed.department && feed.department.includes(selectedDept));
    
    let matchesStatus = true;
    if (filterStatus === 'warning') {
      matchesStatus = feed.member.currentPosture === 'slouching' || feed.member.currentPosture === 'phone' || feed.member.currentPosture === 'sleeping' || feed.isProcessViolating;
    } else if (filterStatus === 'good') {
      matchesStatus = feed.member.currentPosture === 'good' && !feed.isProcessViolating;
    } else if (filterStatus === 'online') {
      matchesStatus = feed.status === 'online';
    }

    return matchesSearch && matchesDept && matchesStatus;
  });

  const totalPages = Math.ceil(filteredFeeds.length / pageSize) || 1;
  const paginatedFeeds = filteredFeeds.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleBroadcastBreak = () => {
    setBroadcastNotice('Đã gửi thông báo giải lao & chuông vận động đến tất cả các máy trạm!');
    setTimeout(() => setBroadcastNotice(null), 3500);
  };

  const focusedFeed = cameraFeeds.find(c => c.id === focusedCamId) || cameraFeeds[0];

  return (
    <div className="space-y-3">
      {/* Broadcast Alert Toast */}
      {broadcastNotice && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 p-4 bg-emerald-600 text-white rounded-2xl shadow-2xl text-xs font-semibold animate-in slide-in-from-top-4 duration-200">
          <Bell className="w-5 h-5 text-white animate-bounce" />
          <span>{broadcastNotice}</span>
        </div>
      )}

      {/* Control Filter & Toolbar (Vào thẳng nội dung, không có ô chữ giải thích) */}
      <div className="p-3 bg-white border border-slate-200 rounded-2xl flex flex-col lg:flex-row items-center justify-between gap-3 text-xs shadow-xs">
        
        {/* Search */}
        <div className="relative w-full lg:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm máy trạm, tên nhân viên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Filters & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
              filterStatus === 'all' ? 'bg-emerald-600 text-white font-semibold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất cả
          </button>

          <button
            onClick={() => setFilterStatus('warning')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
              filterStatus === 'warning' ? 'bg-rose-600 text-white font-semibold' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            Cần chú ý
          </button>

          <button
            onClick={() => setFilterStatus('good')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
              filterStatus === 'good' ? 'bg-emerald-600 text-white font-semibold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Ngồi chuẩn
          </button>

          {/* Chế độ hiển thị lưới */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl">
            <button
              onClick={() => { setLayoutMode('grid6'); setCurrentPage(1); }}
              className={`px-2.5 py-1 rounded-lg font-semibold ${layoutMode === 'grid6' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'}`}
              title="6 Camera"
            >
              6 Cam
            </button>
            <button
              onClick={() => { setLayoutMode('grid12'); setCurrentPage(1); }}
              className={`px-2.5 py-1 rounded-lg font-semibold ${layoutMode === 'grid12' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'}`}
              title="12 Camera"
            >
              12 Cam
            </button>
            <button
              onClick={() => { setLayoutMode('gridAll'); setCurrentPage(1); }}
              className={`px-2.5 py-1 rounded-lg font-semibold ${layoutMode === 'gridAll' || layoutMode === 'grid32' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'}`}
              title="Xem tất cả Camera không phân trang"
            >
              Xem Tất Cả Cam
            </button>
            <button
              onClick={() => setLayoutMode('focus')}
              className={`px-2.5 py-1 rounded-lg font-semibold ${layoutMode === 'focus' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'}`}
              title="Tiêu điểm 1 Cam"
            >
              Tiêu Điểm
            </button>
          </div>

          {/* Nút Tuần Tra Tự Động & Nhắc Toàn Phòng */}
          <button
            onClick={() => setIsPatrolling(!isPatrolling)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all border ${
              isPatrolling
                ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            {isPatrolling ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-600" />}
            <span>{isPatrolling ? 'Dừng Tuần Tra' : 'Tuần Tra'}</span>
          </button>

          <button
            onClick={handleBroadcastBreak}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow-xs transition-all"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Nhắc Toàn Phòng</span>
          </button>
        </div>
      </div>

      {/* Focus Mode (Hệ Thống Giám Sát 3 Luồng Toàn Diện + Danh Sách Thu Nhỏ) */}
      {layoutMode === 'focus' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 space-y-3">
            <WorkstationTriMonitor
              cam={focusedFeed}
              member={focusedFeed.member}
              mode="enterprise"
              showControls={true}
            />
          </div>

          <div className="lg:col-span-4 space-y-2 max-h-[520px] overflow-y-auto pr-1">
            <div className="text-xs font-bold text-slate-600 mb-1">Chọn máy tính xem tiêu điểm:</div>
            {filteredFeeds.map(feed => (
              <div
                key={feed.id}
                onClick={() => setFocusedCamId(feed.id)}
                className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between gap-2 ${
                  focusedCamId === feed.id ? 'bg-emerald-50 border-emerald-500 font-bold' : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <img src={feed.webcamUrl} alt={feed.name} className="w-8 h-8 rounded-lg object-cover" />
                  <div>
                    <div className="text-slate-900">{feed.name}</div>
                    <div className="text-[10px] text-slate-500">{feed.location}</div>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] shrink-0 ${feed.member.currentPosture === 'good' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                  {feed.member.currentPosture === 'good' ? 'Chuẩn' : 'Cảnh báo'}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Grid Layout: 6, 12, hoặc Toàn bộ Cam hiển thị hình ảnh chuẩn xác */
        <div className="space-y-4">
          <div className={`grid gap-3 ${
            layoutMode === 'gridAll' || layoutMode === 'grid32'
              ? 'grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8'
              : layoutMode === 'grid12'
              ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}>
            {paginatedFeeds.map(cam => {
              const posture = cam.member.currentPosture;
              const isWarning = posture === 'slouching' || posture === 'phone' || posture === 'sleeping' || cam.isProcessViolating;

              return (
                <div
                  key={cam.id}
                  onClick={() => {
                    setInspectorCam(cam);
                  }}
                  className={`bg-slate-950 border rounded-2xl overflow-hidden shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between group cursor-pointer ${
                    isWarning ? 'border-rose-400 ring-1 ring-rose-400/50' : 'border-slate-800'
                  }`}
                >
                  {/* Viewport Camera Feed với hình ảnh thật & OSD Vị trí + Thời gian thực */}
                  <div className={`relative w-full ${layoutMode === 'gridAll' || layoutMode === 'grid32' ? 'h-28' : 'h-44 sm:h-48'} bg-slate-900 overflow-hidden`}>
                    
                    {posture === 'away' ? (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 font-mono text-[10px] gap-1 bg-slate-950">
                        <span>○ VẮNG MẶT TẠI BÀN</span>
                      </div>
                    ) : (
                      <img 
                        src={cam.webcamUrl} 
                        alt={cam.name} 
                        className="w-full h-full object-cover filter contrast-[1.05] brightness-[0.95] group-hover:scale-105 transition-transform duration-300" 
                        loading="lazy"
                      />
                    )}

                    {/* CCTV OSD Overlay */}
                    <div className="absolute top-2 left-2 flex flex-col gap-0.5 pointer-events-none">
                      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-md text-white font-mono text-[9px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                        <span>{cam.id}</span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-md text-emerald-300 font-mono text-[8px] truncate max-w-[130px]">
                        📍 {cam.location}
                      </span>
                    </div>

                    {/* Clock & Status OSD Right */}
                    <div className="absolute top-2 right-2 flex flex-col items-end gap-1 pointer-events-none">
                      <span className="px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-md text-amber-300 font-mono text-[9px]">
                        {liveClock}
                      </span>
                      
                      <span className={`px-1.5 py-0.5 rounded font-mono text-[8px] font-bold backdrop-blur-md ${
                        posture === 'good'
                          ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-400/30'
                          : posture === 'phone'
                          ? 'bg-purple-950/90 text-purple-300 border border-purple-400/30 animate-pulse'
                          : posture === 'sleeping'
                          ? 'bg-rose-950/90 text-rose-300 border border-rose-400/30 animate-pulse'
                          : 'bg-rose-950/90 text-rose-300 border border-rose-400/30'
                      }`}>
                        {posture === 'good' && '✓ LƯNG THẲNG'}
                        {posture === 'phone' && '📱 DÙNG PHONE'}
                        {posture === 'sleeping' && '💤 NGỦ GẬT'}
                        {posture === 'slouching' && '⚠ GÙ LƯNG'}
                        {posture === 'leaning' && '⚠ LỆCH VAI'}
                        {posture === 'away' && '○ RỜI BÀN'}
                      </span>
                    </div>

                    {/* Hover focus button */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-3 py-1 rounded-xl bg-white/90 text-slate-900 font-bold text-xs shadow-md flex items-center gap-1">
                        <Maximize2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Xem Chi Tiết Máy</span>
                      </span>
                    </div>
                  </div>

                  {/* Bottom bar: Hiển thị trạng thái cả 3 luồng: Cam ngoài, Cam màn hình, Bàn phím & Chuột */}
                  <div className="p-2 bg-white flex items-center justify-between text-xs">
                    <div className="min-w-0 flex-1 pr-2">
                      <div className="font-bold text-slate-900 truncate">{cam.assignedTo}</div>
                      <div className="text-[10px] text-slate-500 font-mono truncate">
                        🖥️ {cam.activeProcess}
                      </div>
                      <div className="text-[9px] text-slate-500 flex items-center gap-1.5 mt-0.5 truncate">
                        <span className="text-purple-700 bg-purple-50 font-bold px-1 rounded font-mono">
                          ⌨️ {cam.inputTelemetry?.wpm || 52} WPM
                        </span>
                        <span className="text-blue-700 bg-blue-50 px-1 rounded font-mono">
                          🖱️ {cam.inputTelemetry?.mouseCpm || 24} CPM
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSendBuzzer(cam.member);
                      }}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-600 shrink-0"
                      title="Nhắc nhở máy này"
                    >
                      <Bell className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Phân trang khi ở chế độ 6 hoặc 12 cam */}
          {layoutMode !== 'grid32' && layoutMode !== 'gridAll' && totalPages > 1 && (
            <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-2xl text-xs">
              <span className="text-slate-500">
                Trang <strong>{currentPage}</strong> / <strong>{totalPages}</strong> ({filteredFeeds.length} Máy theo dõi)
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-7 h-7 rounded-lg font-mono font-bold ${
                      currentPage === page ? 'bg-emerald-600 text-white' : 'hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Enlarged Workstation Inspector Modal */}
      {inspectorCam && (
        <WorkstationInspectorModal
          cam={inspectorCam}
          member={inspectorCam.member}
          onClose={() => setInspectorCam(null)}
          onSendBuzzer={onSendBuzzer}
        />
      )}

    </div>
  );
}

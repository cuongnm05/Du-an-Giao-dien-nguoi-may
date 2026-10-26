import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  LayoutGrid, 
  Grid3X3, 
  Maximize2, 
  Minimize2, 
  Volume2, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Filter, 
  Play, 
  Pause, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Radio, 
  Bell, 
  Sparkles, 
  Sliders, 
  UserCheck, 
  UserX,
  Send,
  Download,
  Share2
} from 'lucide-react';
import AiVisionFeed from './AiVisionFeed';

export default function MultiCameraView({ 
  cameras, 
  members, 
  onSelectMember, 
  onSendBuzzer 
}) {
  const [layoutMode, setLayoutMode] = useState('2x2'); // '2x2' | '3x2' | 'focus'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'warning' | 'good' | 'online'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [showSkeletonOverlay, setShowSkeletonOverlay] = useState(true);
  const [focusedCamId, setFocusedCamId] = useState(cameras[0]?.id || 'CAM-01');
  const [fullscreenCam, setFullscreenCam] = useState(null);
  
  // Auto Patrol State (Tự động chuyển camera tiêu điểm)
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
      }, 7000);
    }
    return () => clearInterval(interval);
  }, [isPatrolling, cameras]);

  // Map cameras with their assigned members
  const cameraFeeds = cameras.map(cam => {
    const member = members.find(m => m.name === cam.assignedTo || m.camId === cam.id) || {
      name: cam.assignedTo || 'Chưa gán',
      role: 'Nhân sự',
      department: cam.location,
      currentPosture: cam.id === 'CAM-02' ? 'slouching' : cam.id === 'CAM-03' ? 'leaning' : 'good',
      ergonomicsScore: cam.id === 'CAM-02' ? 71 : cam.id === 'CAM-03' ? 79 : 94,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };
    return { ...cam, member };
  });

  // Filter cameras
  const filteredFeeds = cameraFeeds.filter(feed => {
    const matchesSearch = feed.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          feed.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          feed.member.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'all' || feed.location.includes(selectedDept) || feed.member.department.includes(selectedDept);
    
    let matchesStatus = true;
    if (filterStatus === 'warning') {
      matchesStatus = feed.member.currentPosture === 'slouching' || feed.member.currentPosture === 'leaning';
    } else if (filterStatus === 'good') {
      matchesStatus = feed.member.currentPosture === 'good';
    } else if (filterStatus === 'online') {
      matchesStatus = feed.status === 'online';
    }

    return matchesSearch && matchesDept && matchesStatus;
  });

  // Broadcast break alarm
  const handleBroadcastBreak = () => {
    setBroadcastNotice('Đã gửi thông báo giải lao 5 phút & chuông vận động đến tất cả các bàn giám sát!');
    setTimeout(() => setBroadcastNotice(null), 4000);
  };

  const focusedFeed = cameraFeeds.find(c => c.id === focusedCamId) || cameraFeeds[0];

  return (
    <div className="space-y-6">
      {/* Broadcast Alert Toast */}
      {broadcastNotice && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 p-4 bg-emerald-600 text-white rounded-2xl shadow-2xl text-xs font-semibold animate-in slide-in-from-top-4 duration-200">
          <Bell className="w-5 h-5 text-white animate-bounce" />
          <span>{broadcastNotice}</span>
        </div>
      )}

      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              Trung Tâm Giám Sát Đa Luồng Camera AI (Live Video Wall)
            </span>
            <span className="text-slate-500 text-xs">• 30 FPS • Hỗ trợ AI Pose Estimation song song</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Ma Trận Giám Sát Tư Thế & Năng Suất Nhân Viên Qua Nhiều Camera
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Quan sát đồng thời nhiều vị trí làm việc, nhận diện gù lưng/vẹo cột sống tức thì và kích hoạt nhắc nhở từ xa.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => setIsPatrolling(!isPatrolling)}
            className={`flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
              isPatrolling
                ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            {isPatrolling ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-600" />}
            <span>{isPatrolling ? 'Dừng Tuần Tra' : 'Tuần Tra Tự Động'}</span>
          </button>

          <button
            onClick={handleBroadcastBreak}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all"
          >
            <Bell className="w-4 h-4" />
            <span>Nhắc Nhở Toàn Phòng</span>
          </button>
        </div>
      </div>

      {/* KPI Stream Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Camera Đang Stream</div>
            <div className="text-xl font-bold text-slate-900 font-mono mt-0.5">
              {cameras.filter(c => c.status === 'online').length} / {cameras.length}
            </div>
          </div>
          <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <Radio className="w-5 h-5 animate-pulse" />
          </span>
        </div>

        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Nhân Sự Ngồi Chuẩn</div>
            <div className="text-xl font-bold text-emerald-700 font-mono mt-0.5">
              4 Người (67%)
            </div>
          </div>
          <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <UserCheck className="w-5 h-5" />
          </span>
        </div>

        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Cảnh Báo Cần Chú Ý</div>
            <div className="text-xl font-bold text-rose-600 font-mono mt-0.5">
              2 Người (Gù/Vẹo)
            </div>
          </div>
          <span className="p-2 bg-rose-50 text-rose-600 rounded-lg">
            <AlertTriangle className="w-5 h-5" />
          </span>
        </div>

        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Băng Thông Luồng</div>
            <div className="text-xl font-bold text-slate-900 font-mono mt-0.5">
              18.4 Mbps
            </div>
          </div>
          <span className="p-2 bg-slate-100 text-slate-700 rounded-lg font-mono text-xs font-bold">
            1080P
          </span>
        </div>
      </div>

      {/* Control Toolbar: Layout modes, Filters, Search */}
      <div className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
        
        {/* Left: Layout Switches */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-semibold hidden sm:inline">Chế độ hiển thị:</span>
          
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setLayoutMode('2x2')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                layoutMode === '2x2'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Lưới 4 Camera (2x2)"
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Lưới 2x2</span>
            </button>

            <button
              onClick={() => setLayoutMode('3x2')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                layoutMode === '3x2'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Lưới 6 Camera (3x2)"
            >
              <Grid3X3 className="w-4 h-4" />
              <span>Lưới 6 Cam</span>
            </button>

            <button
              onClick={() => setLayoutMode('focus')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                layoutMode === 'focus'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Chế độ 1 Cam lớn + 5 Cam nhỏ"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Tiêu Điểm 1+5</span>
            </button>
          </div>

          <button
            onClick={() => setShowSkeletonOverlay(!showSkeletonOverlay)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold border transition-all ${
              showSkeletonOverlay
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
            title="Bật/Tắt hiển thị khung xương Pose AI"
          >
            {showSkeletonOverlay ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4" />}
            <span>{showSkeletonOverlay ? 'Hiện AI Skeleton' : 'Ẩn AI Skeleton'}</span>
          </button>
        </div>

        {/* Right: Filters & Search */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Pills */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-[11px]">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                filterStatus === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả ({cameraFeeds.length})
            </button>
            <button
              onClick={() => setFilterStatus('warning')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                filterStatus === 'warning' ? 'bg-rose-500 text-white shadow-2xs' : 'text-rose-600 hover:text-rose-700'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              Cảnh báo ({cameraFeeds.filter(c => c.member.currentPosture !== 'good').length})
            </button>
            <button
              onClick={() => setFilterStatus('good')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                filterStatus === 'good' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-emerald-700 hover:text-emerald-800'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              Ngồi chuẩn ({cameraFeeds.filter(c => c.member.currentPosture === 'good').length})
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Tìm camera, tên nhân viên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500 w-44 sm:w-56"
            />
          </div>
        </div>

      </div>

      {/* Grid Content Display */}
      {layoutMode === 'focus' ? (
        /* Focus Layout: 1 Big Cam Left, 5 Smaller Cams Right */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main Focused Camera Stream */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-slate-900 text-sm">{focusedFeed.name}</span>
                <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                  {focusedFeed.id}
                </span>
                <span className="text-slate-500">| {focusedFeed.member.name} ({focusedFeed.member.department})</span>
              </div>
              <button
                onClick={() => setFullscreenCam(focusedFeed)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                title="Phóng to toàn màn hình"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            <AiVisionFeed 
              camName={focusedFeed.name}
              memberName={focusedFeed.member.name}
              initialPosture={focusedFeed.member.currentPosture}
              showControls={true}
              height="h-[440px]"
            />
          </div>

          {/* Right 4 Cols: Smaller Feeds */}
          <div className="lg:col-span-4 space-y-3 max-h-[640px] overflow-y-auto pr-1">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Danh sách camera khác (Bấm để đổi tiêu điểm):
            </div>
            {filteredFeeds.map(feed => (
              <div
                key={feed.id}
                onClick={() => setFocusedCamId(feed.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  focusedCamId === feed.id
                    ? 'bg-emerald-50/60 border-emerald-500 shadow-xs ring-1 ring-emerald-500'
                    : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900">{feed.id}</span>
                    <span className="text-xs text-slate-600 font-medium truncate max-w-[130px]">{feed.member.name}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    feed.member.currentPosture === 'good'
                      ? 'bg-emerald-100 text-emerald-800'
                      : feed.member.currentPosture === 'slouching'
                      ? 'bg-rose-100 text-rose-800 animate-pulse'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {feed.member.currentPosture === 'good' ? 'Chuẩn' : feed.member.currentPosture === 'slouching' ? 'Gù lưng' : 'Lệch vai'}
                  </span>
                </div>
                <div className="rounded-xl overflow-hidden pointer-events-none">
                  <AiVisionFeed 
                    camName={feed.name}
                    memberName={feed.member.name}
                    initialPosture={feed.member.currentPosture}
                    showControls={false}
                    height="h-28"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Regular Grid Mode: 2x2 or 3x2 */
        <div className={`grid gap-5 ${
          layoutMode === '2x2' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
        }`}>
          {filteredFeeds.map(feed => {
            const isSlouching = feed.member.currentPosture === 'slouching';
            const isLeaning = feed.member.currentPosture === 'leaning';
            const isGood = feed.member.currentPosture === 'good';

            return (
              <div 
                key={feed.id} 
                className={`bg-white border rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                  isSlouching
                    ? 'border-rose-400 ring-2 ring-rose-400/20'
                    : isLeaning
                    ? 'border-amber-400'
                    : 'border-slate-200 hover:border-emerald-400'
                }`}
              >
                {/* Tile Header */}
                <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      isSlouching ? 'bg-rose-500 animate-ping' : isLeaning ? 'bg-amber-500' : 'bg-emerald-500'
                    }`} />
                    <span className="font-mono font-bold text-slate-900">{feed.id}</span>
                    <span className="text-slate-400">•</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[140px]">
                      {feed.member.name}
                    </span>
                  </div>

                  {/* Top Right Badges */}
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isGood 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : isSlouching
                        ? 'bg-rose-50 text-rose-700 border-rose-200 font-mono font-bold'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {isGood && '✓ Chuẩn (98°)'}
                      {isSlouching && '⚠ Gù lưng (32°)'}
                      {isLeaning && '⚠ Vẹo vai'}
                    </span>
                    <button
                      onClick={() => setFullscreenCam(feed)}
                      className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                      title="Phóng to luồng camera này"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Video / AI Skeleton Canvas Stream */}
                <div className="relative">
                  <AiVisionFeed 
                    camName={feed.name}
                    memberName={feed.member.name}
                    initialPosture={feed.member.currentPosture}
                    showControls={false}
                    height="h-56"
                  />

                  {/* Metadata Overlay Badge */}
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] font-mono text-white flex items-center gap-1.5 pointer-events-none">
                    <span>{feed.location}</span>
                    <span>•</span>
                    <span className="text-emerald-400">{feed.fps} FPS</span>
                  </div>
                </div>

                {/* Footer Controls & Quick Actions */}
                <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between text-xs gap-2">
                  <div className="text-[11px] text-slate-500">
                    Điểm công thái: <strong className="text-emerald-700 font-mono">{feed.member.ergonomicsScore} pts</strong>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Send buzzer button */}
                    <button
                      onClick={() => onSendBuzzer(feed.member)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-lg text-[11px] font-semibold border border-slate-200 transition-colors"
                      title="Phát chuông rung nhắc nhở tư thế cho bàn này"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Rung bàn</span>
                    </button>

                    {/* View profile button */}
                    <button
                      onClick={() => onSelectMember(feed.member)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-semibold transition-all shadow-2xs"
                      title="Xem hồ sơ chi tiết và phân tích cột sống"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Chi tiết</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Fullscreen Theater Modal */}
      {fullscreenCam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-5xl p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-base font-bold text-slate-900">
                  {fullscreenCam.name} ({fullscreenCam.id}) - {fullscreenCam.member.name}
                </h3>
                <span className="font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded font-semibold border border-emerald-200">
                  ĐỘ TRỄ: 12ms | 30 FPS
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSendBuzzer(fullscreenCam.member)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Rung Bàn Nhắc Nhở</span>
                </button>
                <button
                  onClick={() => setFullscreenCam(null)}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-base transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <AiVisionFeed 
              camName={fullscreenCam.name}
              memberName={fullscreenCam.member.name}
              initialPosture={fullscreenCam.member.currentPosture}
              showControls={true}
              height="h-[480px]"
            />
          </div>
        </div>
      )}

    </div>
  );
}

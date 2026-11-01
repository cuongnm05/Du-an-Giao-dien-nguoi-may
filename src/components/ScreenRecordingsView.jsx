import React, { useState } from 'react';
import { 
  Camera, 
  Monitor, 
  Search, 
  Filter, 
  Play, 
  Pause, 
  Maximize2, 
  Download, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Video, 
  Film,
  RotateCcw,
  Volume2,
  X
} from 'lucide-react';
import { MOCK_VIDEO_RECORDINGS } from '../data/mockData';

export default function ScreenRecordingsView({ cameras = [], members = [] }) {
  const [recordings, setRecordings] = useState(MOCK_VIDEO_RECORDINGS);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'camera_video' | 'screen_video' | 'violation'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredVideos = recordings.filter(rec => {
    const matchesSearch = rec.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          rec.camId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          rec.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesType = true;
    if (filterType === 'camera_video') matchesType = rec.type === 'camera_video';
    else if (filterType === 'screen_video') matchesType = rec.type === 'screen_video';
    else if (filterType === 'violation') matchesType = rec.status === 'violation' || rec.status === 'warning';

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-3">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-xl text-xs font-semibold animate-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Toolbar Trực Tiếp (Không có ô văn bản giải thích thừa thãi) */}
      <div className="p-3 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-xs">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo nhân viên, máy trạm, sự kiện..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Filter Pills & Nút Ghi Video Mới */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
              filterType === 'all' ? 'bg-emerald-600 text-white font-semibold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất cả ({recordings.length})
          </button>

          <button
            onClick={() => setFilterType('camera_video')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors flex items-center gap-1 ${
              filterType === 'camera_video' ? 'bg-emerald-600 text-white font-semibold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Video Camera Bàn Làm Việc</span>
          </button>

          <button
            onClick={() => setFilterType('screen_video')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors flex items-center gap-1 ${
              filterType === 'screen_video' ? 'bg-emerald-600 text-white font-semibold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Video Màn Hình Máy Tính</span>
          </button>

          <button
            onClick={() => setFilterType('violation')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors flex items-center gap-1 ${
              filterType === 'violation' ? 'bg-rose-600 text-white font-semibold' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Phát hiện vi phạm</span>
          </button>

          <button
            onClick={() => showToast('Đang kích hoạt lệnh ghi hình video clip 15 phút trên tất cả máy trạm...')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow-xs transition-all ml-auto sm:ml-0"
          >
            <Film className="w-3.5 h-3.5" />
            <span>Ghi Video Đồng Loạt</span>
          </button>
        </div>
      </div>

      {/* Grid Danh Sách Video Bản Ghi Camera & Video Màn Hình */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVideos.map(rec => (
          <div
            key={rec.id}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div className="relative h-48 bg-slate-950 overflow-hidden cursor-pointer" onClick={() => { setSelectedVideo(rec); setIsVideoPlaying(true); }}>
              <img 
                src={rec.thumbnail} 
                alt={rec.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 filter brightness-90"
              />
              
              {/* Overlay Video Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-600 transition-all shadow-xl">
                  <Play className="w-5 h-5 ml-0.5" />
                </div>
              </div>

              {/* Badges on video thumbnail */}
              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-white font-mono text-[10px]">
                  {rec.camId}
                </span>
                <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-slate-200 font-mono text-[10px]">
                  {rec.time}
                </span>
              </div>

              <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-amber-300 font-mono text-[10px] flex items-center gap-1 font-bold">
                  <Clock className="w-3 h-3" />
                  <span>{rec.duration}</span>
                </span>
                <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold backdrop-blur-md ${
                  rec.type === 'camera_video' ? 'bg-purple-900/90 text-purple-200' : 'bg-teal-900/90 text-teal-200'
                }`}>
                  {rec.type === 'camera_video' ? '📹 Video Camera' : '🖥 Video Màn Hình'}
                </span>
              </div>

              <span className={`absolute top-2 right-2 px-2 py-0.5 rounded font-mono text-[10px] font-bold backdrop-blur-md ${
                rec.status === 'compliant'
                  ? 'bg-emerald-900/90 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-900/90 text-rose-300 border border-rose-500/30 animate-pulse'
              }`}>
                {rec.postureAtCapture}
              </span>
            </div>

            <div className="p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{rec.memberName}</span>
                <span className="text-[11px] font-semibold text-emerald-700">
                  {rec.type === 'camera_video' ? 'Quay người làm việc' : 'Quay tiến trình desktop'}
                </span>
              </div>

              <div className="text-xs font-semibold text-slate-800 line-clamp-1">{rec.title}</div>
              <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{rec.description}</p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => { setSelectedVideo(rec); setIsVideoPlaying(true); }}
                  className="text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Phát Video Ngay</span>
                </button>
                <button
                  onClick={() => showToast(`Đang tải video clip MP4 của ${rec.memberName}...`)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 flex items-center gap-1 text-[11px]"
                  title="Tải video MP4"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải MP4</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Trình Phát Video Tương Tác */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-5 shadow-2xl border border-slate-200 space-y-3 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Film className="w-4 h-4 text-emerald-600" />
                  <span>{selectedVideo.title}</span>
                </h4>
                <div className="text-xs text-slate-500 mt-0.5">
                  {selectedVideo.memberName} • {selectedVideo.camId} • Thời lượng: {selectedVideo.duration}
                </div>
              </div>
              <button 
                onClick={() => setSelectedVideo(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-base p-1"
              >
                ✕
              </button>
            </div>

            {/* Khung phát video mô phỏng chân thực */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video flex items-center justify-center group">
              <img 
                src={selectedVideo.thumbnail} 
                alt={selectedVideo.title} 
                className="w-full h-full object-cover filter contrast-[1.05]" 
              />
              
              {/* OSD Video Play Controls */}
              <div className="absolute inset-0 bg-black/30 flex flex-col justify-between p-4">
                <div className="flex items-center justify-between text-[11px] font-mono text-white">
                  <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md">
                    ● PLAYBACK REC STREAM • 1080P
                  </span>
                  <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-amber-300">
                    {selectedVideo.time}
                  </span>
                </div>

                {/* Big Center Play/Pause button */}
                <button
                  onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                  className="self-center w-16 h-16 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white flex items-center justify-center shadow-2xl transition-all transform hover:scale-110"
                >
                  {isVideoPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
                </button>

                {/* Timeline Bar */}
                <div className="space-y-1">
                  <div className="w-full bg-white/30 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-2/5 animate-pulse"></div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-white/90">
                    <span>04:15 / {selectedVideo.duration}</span>
                    <span>Tốc độ: 1.0x</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
              <div className="font-semibold text-slate-800">Nội dung ghi nhận trong video:</div>
              <div className="text-slate-600">{selectedVideo.description}</div>
              <div className="text-slate-500 font-mono pt-0.5">Trạng thái phát hiện: <strong>{selectedVideo.postureAtCapture}</strong></div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setSelectedVideo(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Đóng Trình Phát
              </button>
              <button
                onClick={() => {
                  showToast('Đang tải file video MP4 độ nét cao...');
                  setSelectedVideo(null);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Tải Toàn Bộ Video MP4 Về Máy</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

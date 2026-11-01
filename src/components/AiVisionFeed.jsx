import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Maximize2, 
  RefreshCw, 
  Volume2, 
  Eye, 
  EyeOff,
  Sliders, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  Pause,
  Video,
  VideoOff,
  Sparkles,
  Smartphone,
  Moon,
  Film,
  MonitorOff,
  PowerOff
} from 'lucide-react';
import { BEHAVIOR_IMAGES } from '../data/mockData';

export default function AiVisionFeed({ 
  camName = 'Webcam Bàn 101 - Nguyễn Văn Cường', 
  camId = 'PC-01',
  memberName = 'Nguyễn Văn Cường', 
  location = 'Tầng 3 - Bàn R&D-01',
  initialPosture = 'good',
  showControls = true,
  showHeader = true,
  className = '',
  height = 'h-72',
  onAlertTrigger,
  webcamUrl = null
}) {
  const [posture, setPosture] = useState(initialPosture);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isRealWebcamActive, setIsRealWebcamActive] = useState(false);
  const [fps, setFps] = useState(30);
  const [neckAngle, setNeckAngle] = useState(14);
  const [backAngle, setBackAngle] = useState(98);
  const [distanceCm, setDistanceCm] = useState(65);
  const [shoulderTilt, setShoulderTilt] = useState(1.2);
  const [currentTimeStr, setCurrentTimeStr] = useState(() => {
    const d = new Date();
    return `${d.toLocaleTimeString('vi-VN')} ${d.toLocaleDateString('vi-VN')}`;
  });
  
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const webcamStreamRef = useRef(null);

  // Live clock inside camera
  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setCurrentTimeStr(`${d.toLocaleTimeString('vi-VN')} ${d.toLocaleDateString('vi-VN')}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync initial posture when changed by parent
  useEffect(() => {
    setPosture(initialPosture);
  }, [initialPosture]);

  // Adjust posture angles & trigger alerts
  useEffect(() => {
    if (posture === 'good') {
      setNeckAngle(14);
      setBackAngle(98);
      setDistanceCm(65);
      setShoulderTilt(1.2);
    } else if (posture === 'slouching') {
      setNeckAngle(32);
      setBackAngle(138);
      setDistanceCm(38);
      setShoulderTilt(2.4);
      if (onAlertTrigger) {
        onAlertTrigger({
          type: 'slouching',
          text: 'Cảnh báo: Phát hiện gù lưng & rướn cổ sát webcam (32°)'
        });
      }
    } else if (posture === 'leaning') {
      setNeckAngle(22);
      setBackAngle(110);
      setDistanceCm(58);
      setShoulderTilt(16.5);
      if (onAlertTrigger) {
        onAlertTrigger({
          type: 'leaning',
          text: 'Cảnh báo: Phát hiện lệch vai 16.5° & vẹo cột sống'
        });
      }
    } else if (posture === 'phone') {
      setNeckAngle(45);
      setBackAngle(130);
      setDistanceCm(28);
      setShoulderTilt(4.0);
      if (onAlertTrigger) {
        onAlertTrigger({
          type: 'phone',
          text: 'Cảnh báo: Nhân viên đang cúi đầu bấm điện thoại riêng'
        });
      }
    } else if (posture === 'sleeping') {
      setNeckAngle(65);
      setBackAngle(155);
      setDistanceCm(20);
      setShoulderTilt(8.0);
      if (onAlertTrigger) {
        onAlertTrigger({
          type: 'sleeping',
          text: 'Cảnh báo: Phát hiện nhân viên ngủ gật tại bàn làm việc'
        });
      }
    } else if (posture === 'movie' || posture === 'distracted') {
      setNeckAngle(18);
      setBackAngle(105);
      setDistanceCm(60);
      setShoulderTilt(3.0);
      if (onAlertTrigger) {
        onAlertTrigger({
          type: 'distracted',
          text: 'Cảnh báo: Phát hiện mở phim / YouTube giải trí trong giờ'
        });
      }
    } else if (posture === 'away' || posture === 'cam_off' || posture === 'pc_off') {
      setNeckAngle(0);
      setBackAngle(0);
      setDistanceCm(0);
      setShoulderTilt(0);
    }
  }, [posture]);

  // Real browser webcam toggle
  const toggleRealWebcam = async () => {
    if (isRealWebcamActive) {
      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach(track => track.stop());
        webcamStreamRef.current = null;
      }
      setIsRealWebcamActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 1280, height: 720 } 
        });
        webcamStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsRealWebcamActive(true);
      } catch (err) {
        console.warn('Cannot open user webcam:', err);
        alert('Không thể mở webcam máy tính của bạn (vui lòng kiểm tra quyền truy cập webcam trên trình duyệt).');
      }
    }
  };

  // Clean up webcam stream on unmount
  useEffect(() => {
    return () => {
      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Determine current simulated webcam person image
  const getWebcamImage = () => {
    if (posture === 'away' || posture === 'cam_off' || posture === 'pc_off') return null;
    
    // Explicit behavioral simulation images
    if (posture === 'phone') return BEHAVIOR_IMAGES.phone;
    if (posture === 'sleeping') return BEHAVIOR_IMAGES.sleeping;
    if (posture === 'movie') return BEHAVIOR_IMAGES.movie;
    if (posture === 'distracted') return BEHAVIOR_IMAGES.distracted;
    if (posture === 'slouching') return BEHAVIOR_IMAGES.slouching;
    if (posture === 'leaning') return BEHAVIOR_IMAGES.leaning;

    // Default good posture: use passed webcamUrl or default
    if (webcamUrl) return webcamUrl;
    return BEHAVIOR_IMAGES.good;
  };

  const currentWebcamImg = getWebcamImage();

  // Canvas drawing loop for front-webcam AI Pose & Face tracking
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let tick = 0;

    const render = () => {
      tick++;
      const jitter = isPlaying ? Math.sin(tick * 0.08) * 1.5 : 0;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!showSkeleton) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      if (posture === 'away' || posture === 'cam_off' || posture === 'pc_off') {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // Draw Keypoints
      const isWarn = posture === 'slouching' || posture === 'leaning' || posture === 'phone' || posture === 'sleeping';
      const themeColor = isWarn ? '#f43f5e' : '#10b981';
      const glowColor = isWarn ? 'rgba(244, 63, 94, 0.4)' : 'rgba(16, 185, 129, 0.4)';

      let headX = 320 + jitter;
      let headY = 95;
      let chinX = 320 + jitter;
      let chinY = 125;
      let neckX = 320 + jitter;
      let neckY = 150;
      let shoulderLeftX = 220 + jitter;
      let shoulderLeftY = 185;
      let shoulderRightX = 420 + jitter;
      let shoulderRightY = 185;
      let spineMidX = 320 + jitter;
      let spineMidY = 270;
      let handLeftX = 250;
      let handLeftY = 320;
      let handRightX = 390;
      let handRightY = 320;

      if (posture === 'slouching') {
        headY += 35;
        chinY += 38;
        neckY += 30;
        shoulderLeftY += 15;
        shoulderRightY += 15;
      } else if (posture === 'leaning') {
        headX += 25;
        chinX += 25;
        neckX += 20;
        shoulderLeftY -= 15;
        shoulderRightY += 20;
      } else if (posture === 'phone') {
        headY += 45;
        chinY += 50;
        neckY += 35;
        handLeftX = 300;
        handLeftY = 270;
        handRightX = 340;
        handRightY = 270;
      } else if (posture === 'sleeping') {
        headY += 80;
        chinY += 85;
        neckY += 75;
        shoulderLeftY += 40;
        shoulderRightY += 40;
      }

      ctx.lineWidth = 3;
      ctx.shadowBlur = 8;
      ctx.shadowColor = glowColor;

      const drawBone = (x1, y1, x2, y2) => {
        ctx.beginPath();
        ctx.strokeStyle = themeColor;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      };

      // Head oval
      ctx.beginPath();
      ctx.strokeStyle = themeColor;
      ctx.ellipse(headX, headY + 5, 24, 30, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Bones
      drawBone(chinX, chinY, neckX, neckY);
      drawBone(neckX, neckY, shoulderLeftX, shoulderLeftY);
      drawBone(neckX, neckY, shoulderRightX, shoulderRightY);
      drawBone(neckX, neckY, spineMidX, spineMidY);
      drawBone(shoulderLeftX, shoulderLeftY, handLeftX, handLeftY);
      drawBone(shoulderRightX, shoulderRightY, handRightX, handRightY);

      // Keypoints joints
      const joints = [
        { x: headX, y: headY },
        { x: neckX, y: neckY },
        { x: shoulderLeftX, y: shoulderLeftY },
        { x: shoulderRightX, y: shoulderRightY },
        { x: spineMidX, y: spineMidY },
        { x: handLeftX, y: handLeftY },
        { x: handRightX, y: handRightY }
      ];

      joints.forEach((j) => {
        ctx.beginPath();
        ctx.arc(j.x, j.y, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = themeColor;
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [posture, isPlaying, showSkeleton]);

  return (
    <div className={`flex flex-col bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-lg ${className}`}>
      
      {/* Live Viewport */}
      <div className={`relative w-full ${height} bg-slate-950 overflow-hidden`}>
        
        {/* Case A: Real Browser Webcam Video */}
        {isRealWebcamActive ? (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]"
          />
        ) : (
          /* Case B: Realistic Simulated Photo/Video */
          currentWebcamImg ? (
            <img 
              src={currentWebcamImg} 
              alt={camName}
              className="absolute inset-0 w-full h-full object-cover filter contrast-[1.04] brightness-[0.98] select-none pointer-events-none transition-all duration-300"
            />
          ) : (
            <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center gap-2 text-slate-500 font-mono text-xs">
              {posture === 'away' && (
                <>
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                    ○
                  </div>
                  <span>BÀN LÀM VIỆC TRỐNG / VẮNG MẶT</span>
                </>
              )}
              {posture === 'cam_off' && (
                <>
                  <VideoOff className="w-8 h-8 text-rose-500" />
                  <span className="text-rose-400 font-bold">WEBCAM ĐÃ TẮT HOẶC MẤT KẾT NỐI</span>
                </>
              )}
              {posture === 'pc_off' && (
                <>
                  <PowerOff className="w-8 h-8 text-slate-600" />
                  <span>MÁY TRẠM CHƯA BẬT NGUỒN / NGHỈ PHÉP</span>
                </>
              )}
            </div>
          )
        )}

        {/* Realistic CCTV/Webcam HUD OSD Header with Location & Real-Time */}
        <div className="absolute top-2.5 left-2.5 z-20 flex flex-wrap items-center gap-1.5 pointer-events-none max-w-[85%]">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-white/10 text-white font-mono text-[10px]">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span className="font-bold">REC ● {isRealWebcamActive ? 'WEBCAM THẬT' : 'AI POV'}</span>
          </div>

          {/* Vị trí máy / bàn làm việc */}
          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-white/10 text-emerald-300 font-mono text-[10px]">
            <span>📍 {location}</span>
          </div>

          {/* Thời gian thực chạy theo giây */}
          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-white/10 text-amber-300 font-mono text-[10px]">
            <span>⏱ {currentTimeStr}</span>
          </div>

          <span className="hidden sm:inline px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-emerald-400 font-mono text-[10px]">
            30 FPS • 1080P
          </span>
        </div>

        {/* Live Status Badge in Top-Right */}
        <div className="absolute top-2.5 right-2.5 z-20 flex flex-col gap-1 items-end pointer-events-none">
          <span className={`px-2.5 py-0.5 rounded font-mono text-[10px] font-bold border backdrop-blur-md shadow-lg ${
            posture === 'good' 
              ? 'bg-emerald-950/90 border-emerald-400 text-emerald-300'
              : posture === 'slouching'
              ? 'bg-rose-950/90 border-rose-500 text-rose-300 animate-pulse'
              : posture === 'leaning'
              ? 'bg-amber-950/90 border-amber-500 text-amber-300'
              : posture === 'phone'
              ? 'bg-purple-950/90 border-purple-400 text-purple-300 animate-pulse'
              : posture === 'sleeping'
              ? 'bg-rose-950/90 border-rose-500 text-rose-300 animate-pulse'
              : posture === 'movie' || posture === 'distracted'
              ? 'bg-blue-950/90 border-blue-400 text-blue-300'
              : 'bg-slate-900/90 border-slate-700 text-slate-400'
          }`}>
            {posture === 'good' && '✓ LƯNG THẲNG ĐẠT CHUẨN'}
            {posture === 'slouching' && '⚠ CẢNH BÁO: GÙ LƯNG / RƯỚN CỔ'}
            {posture === 'leaning' && '⚠ CẢNH BÁO: LỆCH VAI / VẸO CỘT SỐNG'}
            {posture === 'phone' && '⚠ PHÁT HIỆN: ĐANG DÙNG ĐIỆN THOẠI'}
            {posture === 'sleeping' && '⚠ PHÁT HIỆN: NGỦ GẬT TẠI BÀN'}
            {posture === 'movie' && '⚠ MỞ PHIM / YOUTUBE GIẢI TRÍ'}
            {posture === 'distracted' && '⚠ LÀM VIỆC RIÊNG NGOÀI LUỒNG'}
            {posture === 'away' && '○ RỜI BÀN / VẮNG MẶT'}
            {posture === 'cam_off' && '✕ CAMERA ĐÃ TẮT'}
            {posture === 'pc_off' && '✕ MÁY TRẠM TẮT NGUỒN'}
          </span>
        </div>

        {/* AI Canvas Overlay */}
        <canvas 
          ref={canvasRef} 
          width={640} 
          height={360} 
          className="absolute inset-0 w-full h-full z-10 pointer-events-none"
        />

        {/* Scan line effect */}
        {isPlaying && (
          <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent animate-scan-line pointer-events-none z-10" />
        )}

        {/* Bottom Metadata Bar */}
        <div className="absolute bottom-2 left-2 z-20 flex flex-wrap items-center gap-1.5 pointer-events-none text-[10px] font-mono text-white/90">
          <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md">
            Góc cổ: <strong className={posture === 'slouching' || posture === 'phone' ? 'text-rose-400' : 'text-emerald-400'}>{neckAngle}°</strong>
          </span>
          <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md hidden sm:inline">
            Lệch vai: <strong className={posture === 'leaning' ? 'text-amber-400' : 'text-emerald-400'}>{shoulderTilt}°</strong>
          </span>
          <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md hidden sm:inline">
            Khoảng cách mắt: <strong className="text-emerald-400">{distanceCm} cm</strong>
          </span>
        </div>

        {/* Action Toggle Camera Button on overlay */}
        <div className="absolute bottom-2 right-2 z-20 flex items-center gap-1.5">
          <button
            onClick={toggleRealWebcam}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border backdrop-blur-md transition-all shadow-md flex items-center gap-1 ${
              isRealWebcamActive 
                ? 'bg-rose-600 text-white border-rose-500' 
                : 'bg-black/70 text-slate-200 border-white/20 hover:bg-black/90'
            }`}
          >
            <Camera className="w-3 h-3" />
            <span>{isRealWebcamActive ? 'Tắt Webcam Thật' : 'Bật Webcam Thật'}</span>
          </button>
        </div>

      </div>

      {/* ĐA DẠNG 10 TÌNH HUỐNG MÔ PHỎNG HÀNH VI ĐỂ TEST AI */}
      {showControls && (
        <div className="p-2.5 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Mô phỏng góc nhìn & tình huống:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1">
            <button
              onClick={() => setPosture('good')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                posture === 'good' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              ✓ Ngồi Chuẩn
            </button>

            <button
              onClick={() => setPosture('slouching')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                posture === 'slouching' ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              ⚠ Gù Lưng
            </button>

            <button
              onClick={() => setPosture('leaning')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                posture === 'leaning' ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              ⚠ Lệch Vai
            </button>

            <button
              onClick={() => setPosture('phone')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                posture === 'phone' ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-800 text-purple-300 hover:bg-slate-700'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              <span>Chơi Điện Thoại</span>
            </button>

            <button
              onClick={() => setPosture('sleeping')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                posture === 'sleeping' ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-800 text-rose-300 hover:bg-slate-700'
              }`}
            >
              <Moon className="w-3 h-3" />
              <span>Ngủ Gật</span>
            </button>

            <button
              onClick={() => setPosture('movie')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                posture === 'movie' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-800 text-blue-300 hover:bg-slate-700'
              }`}
            >
              <Film className="w-3 h-3" />
              <span>Xem Phim / YouTube</span>
            </button>

            <button
              onClick={() => setPosture('distracted')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                posture === 'distracted' ? 'bg-teal-600 text-white shadow-xs' : 'bg-slate-800 text-teal-300 hover:bg-slate-700'
              }`}
            >
              Việc Riêng
            </button>

            <button
              onClick={() => setPosture('away')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                posture === 'away' ? 'bg-slate-600 text-white shadow-xs' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              Rời Bàn
            </button>

            <button
              onClick={() => setPosture('cam_off')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                posture === 'cam_off' ? 'bg-red-900 text-white shadow-xs' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              Tắt Cam
            </button>

            <button
              onClick={() => setPosture('pc_off')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                posture === 'pc_off' ? 'bg-slate-700 text-white shadow-xs' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              Nghỉ / Tắt Máy
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

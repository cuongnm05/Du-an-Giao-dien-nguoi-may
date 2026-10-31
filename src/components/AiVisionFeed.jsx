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
  Sparkles
} from 'lucide-react';

export default function AiVisionFeed({ 
  camName = 'Webcam Bàn 101 - Nguyễn Văn Cường', 
  camId = 'CAM-01',
  memberName = 'Nguyễn Văn Cường', 
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
  
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const webcamStreamRef = useRef(null);

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
    } else if (posture === 'away') {
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
    if (posture === 'away') return null;
    
    // Priority 1: User explicitly tested posture with simulation buttons
    if (posture === 'slouching') return '/webcam/cam02.jpg';
    if (posture === 'leaning') return '/webcam/cam03.jpg';

    // Priority 2: Use specific cam image
    if (webcamUrl) return webcamUrl;
    if (camId === 'CAM-01') return '/webcam/cam01.jpg';
    if (camId === 'CAM-02') return '/webcam/cam02.jpg';
    if (camId === 'CAM-03') return '/webcam/cam03.jpg';
    if (camId === 'CAM-04') return '/webcam/cam04.jpg';
    if (camId === 'CAM-05') return '/webcam/cam05.jpg';
    if (camId === 'CAM-06') return '/webcam/cam06.jpg';

    return '/webcam/cam01.jpg';
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

      // Transparent clear - the real person photo/video is visible beneath
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!showSkeleton) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      if (posture === 'away') {
        // No person detected overlay
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 6]);
        ctx.strokeRect(canvas.width * 0.25, canvas.height * 0.2, canvas.width * 0.5, canvas.height * 0.6);
        ctx.setLineDash([]);

        ctx.fillStyle = '#f87171';
        ctx.font = 'bold 13px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('○ KHÔNG PHÁT HIỆN NGƯỜI TRƯỚC WEBCAM', canvas.width / 2, canvas.height / 2 - 8);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px monospace';
        ctx.fillText('VỊ TRÍ BÀN LÀM VIỆC ĐANG TRỐNG (ROI EMPTY)', canvas.width / 2, canvas.height / 2 + 16);

        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // Front-facing webcam coordinates according to posture
      let headX = canvas.width * 0.50;
      let headY = canvas.height * 0.32 + jitter;
      let chinX = canvas.width * 0.50;
      let chinY = canvas.height * 0.42 + jitter;
      let neckX = canvas.width * 0.50;
      let neckY = canvas.height * 0.46 + jitter;

      let shoulderLeftX = canvas.width * 0.35;
      let shoulderLeftY = canvas.height * 0.54 + jitter;
      let shoulderRightX = canvas.width * 0.65;
      let shoulderRightY = canvas.height * 0.54 + jitter;

      let spineMidX = canvas.width * 0.50;
      let spineMidY = canvas.height * 0.72 + jitter;

      let handLeftX = canvas.width * 0.38;
      let handLeftY = canvas.height * 0.88 + jitter;
      let handRightX = canvas.width * 0.68;
      let handRightY = canvas.height * 0.88 + jitter;

      let themeColor = '#10b981'; // Emerald Green
      let glowColor = 'rgba(16, 185, 129, 0.5)';
      let statusLabel = 'TƯ THẾ CHUẨN (CỔ 14° | VAI CÂN ĐỐI)';

      if (posture === 'slouching') {
        // Female QA slouching forward towards webcam
        headX = canvas.width * 0.58;
        headY = canvas.height * 0.38 + jitter;
        chinX = canvas.width * 0.58;
        chinY = canvas.height * 0.48 + jitter;
        neckX = canvas.width * 0.54;
        neckY = canvas.height * 0.52 + jitter;
        shoulderLeftX = canvas.width * 0.42;
        shoulderLeftY = canvas.height * 0.58 + jitter;
        shoulderRightX = canvas.width * 0.68;
        shoulderRightY = canvas.height * 0.56 + jitter;
        spineMidX = canvas.width * 0.44;
        spineMidY = canvas.height * 0.74 + jitter;

        themeColor = '#f43f5e'; // Rose Red
        glowColor = 'rgba(244, 63, 94, 0.6)';
        statusLabel = 'CẢNH BÁO: GÙ LƯNG & RƯỚN CỔ SÁT MÀN HÌNH (32°)';
      } else if (posture === 'leaning') {
        // Person leaning head on hand, tilted shoulder
        headX = canvas.width * 0.66;
        headY = canvas.height * 0.38 + jitter;
        chinX = canvas.width * 0.68;
        chinY = canvas.height * 0.48 + jitter;
        neckX = canvas.width * 0.64;
        neckY = canvas.height * 0.52 + jitter;
        shoulderLeftX = canvas.width * 0.52;
        shoulderLeftY = canvas.height * 0.54 + jitter;
        shoulderRightX = canvas.width * 0.78;
        shoulderRightY = canvas.height * 0.66 + jitter;
        spineMidX = canvas.width * 0.60;
        spineMidY = canvas.height * 0.78 + jitter;

        themeColor = '#f59e0b'; // Amber
        glowColor = 'rgba(245, 158, 11, 0.6)';
        statusLabel = 'CẢNH BÁO: LỆCH VAI 16.5° & VẸO CỘT SỐNG';
      }

      // 1. Draw Target Person Bounding Box
      const bboxX = Math.min(shoulderLeftX - 35, headX - 60);
      const bboxY = headY - 45;
      const bboxW = (shoulderRightX - bboxX) + 40;
      const bboxH = canvas.height * 0.88 - bboxY;

      ctx.strokeStyle = themeColor;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(bboxX, bboxY, bboxW, bboxH);
      ctx.setLineDash([]);

      // Corner brackets on Bounding Box
      const bLen = 14;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      // Top-left
      ctx.moveTo(bboxX, bboxY + bLen); ctx.lineTo(bboxX, bboxY); ctx.lineTo(bboxX + bLen, bboxY);
      // Top-right
      ctx.moveTo(bboxX + bboxW - bLen, bboxY); ctx.lineTo(bboxX + bboxW, bboxY); ctx.lineTo(bboxX + bboxW, bboxY + bLen);
      // Bottom-left
      ctx.moveTo(bboxX, bboxY + bboxH - bLen); ctx.lineTo(bboxX, bboxY + bboxH); ctx.lineTo(bboxX + bLen, bboxY + bboxH);
      // Bottom-right
      ctx.moveTo(bboxX + bboxW - bLen, bboxY + bboxH); ctx.lineTo(bboxX + bboxW, bboxY + bboxH); ctx.lineTo(bboxX + bboxW, bboxY + bboxH - bLen);
      ctx.stroke();

      // Bounding Box Header Pill
      ctx.fillStyle = themeColor;
      ctx.fillRect(bboxX, bboxY - 20, Math.min(220, bboxW), 20);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`AI WEBCAM: ${memberName.toUpperCase()} (99.2%)`, bboxX + 6, bboxY - 6);

      // 2. Draw Shoulder Alignment Horizon Line
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = posture === 'leaning' ? 'rgba(245, 158, 11, 0.8)' : 'rgba(16, 185, 129, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(shoulderLeftX - 25, shoulderLeftY);
      ctx.lineTo(shoulderRightX + 25, shoulderRightY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Shoulder tilt angle label
      ctx.fillStyle = posture === 'leaning' ? '#fbbf24' : '#6ee7b7';
      ctx.font = 'bold 9px monospace';
      ctx.fillText(`GÓC NGHIÊNG VAI: ${shoulderTilt}°`, shoulderRightX - 15, shoulderRightY - 10);

      // 3. Draw AI Skeleton Bones
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
      ctx.ellipse(headX, headY + 5, 26, 32, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Face mesh crosshair
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1;
      ctx.moveTo(headX - 15, headY + 5);
      ctx.lineTo(headX + 15, headY + 5);
      ctx.moveTo(headX, headY - 15);
      ctx.lineTo(headX, headY + 22);
      ctx.stroke();

      // Neck, Shoulders, Spine
      ctx.lineWidth = 3;
      drawBone(chinX, chinY, neckX, neckY);
      drawBone(neckX, neckY, shoulderLeftX, shoulderLeftY);
      drawBone(neckX, neckY, shoulderRightX, shoulderRightY);
      drawBone(neckX, neckY, spineMidX, spineMidY);
      drawBone(shoulderLeftX, shoulderLeftY, handLeftX, handLeftY);
      drawBone(shoulderRightX, shoulderRightY, handRightX, handRightY);

      // 4. Draw Joint Keypoints
      const joints = [
        { x: headX, y: headY, r: 4.5 },
        { x: chinX, y: chinY, r: 4 },
        { x: neckX, y: neckY, r: 5 },
        { x: shoulderLeftX, y: shoulderLeftY, r: 6 },
        { x: shoulderRightX, y: shoulderRightY, r: 6 },
        { x: spineMidX, y: spineMidY, r: 5.5 },
        { x: handLeftX, y: handLeftY, r: 4.5 },
        { x: handRightX, y: handRightY, r: 4.5 }
      ];

      joints.forEach((j) => {
        ctx.beginPath();
        ctx.arc(j.x, j.y, j.r, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = themeColor;
        ctx.stroke();
      });

      // 5. Neck Flexion Angle Arc
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(neckX + 10, neckY - 14, 85, 20);
      ctx.fillStyle = themeColor;
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`CỔ: ${neckAngle}°`, neckX + 15, neckY);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [posture, isPlaying, showSkeleton, neckAngle, backAngle, distanceCm, shoulderTilt, memberName]);

  return (
    <div className={showHeader 
      ? `bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex flex-col ${className}`
      : `relative w-full flex flex-col overflow-hidden ${className}`
    }>
      
      {/* Feed Header */}
      {showHeader && (
        <div className="px-3 sm:px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 truncate">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                posture === 'slouching' ? 'bg-rose-400' : posture === 'leaning' ? 'bg-amber-400' : 'bg-emerald-400'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                posture === 'slouching' ? 'bg-rose-500' : posture === 'leaning' ? 'bg-amber-500' : 'bg-emerald-500'
              }`}></span>
            </span>
            <span className="font-bold text-slate-900 tracking-wide truncate">{camName}</span>
            <span className="text-slate-500 font-mono text-[11px] hidden sm:inline">| {memberName}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle Live Browser Webcam */}
            <button
              onClick={toggleRealWebcam}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border ${
                isRealWebcamActive
                  ? 'bg-rose-600 text-white border-rose-600 shadow-xs animate-pulse'
                  : 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border-slate-200'
              }`}
              title={isRealWebcamActive ? 'Tắt webcam máy tính' : 'Bật webcam thật của máy bạn để thử nghiệm'}
            >
              {isRealWebcamActive ? <VideoOff className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5 text-emerald-600" />}
              <span className="hidden md:inline">{isRealWebcamActive ? 'Tắt Webcam' : 'Webcam Thật'}</span>
            </button>

            {/* Toggle AI Skeleton */}
            <button 
              onClick={() => setShowSkeleton(!showSkeleton)}
              className={`p-1.5 rounded-lg border transition-colors ${
                showSkeleton ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white text-slate-400 border-slate-200'
              }`}
              title={showSkeleton ? 'Ẩn khung xương AI' : 'Hiện khung xương AI'}
            >
              {showSkeleton ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>

            {/* Pause / Play */}
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
              title={isPlaying ? 'Tạm dừng feed' : 'Tiếp tục feed'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-600" />}
            </button>
          </div>
        </div>
      )}

      {/* Live Webcam Viewport: Real Person Background + AI Transparent Canvas Layer */}
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
          /* Case B: Realistic Front Webcam Video/Photo of Employee/Student */
          currentWebcamImg ? (
            <img 
              src={currentWebcamImg} 
              alt={camName}
              className="absolute inset-0 w-full h-full object-cover filter contrast-[1.04] brightness-[0.98] select-none pointer-events-none"
            />
          ) : (
            <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
              <span className="text-slate-500 text-xs font-mono">BÀN LÀM VIỆC TRỐNG</span>
            </div>
          )
        )}

        {/* Realistic CCTV/Webcam HUD OSD Header */}
        <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-2 pointer-events-none">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-white font-mono text-[10px]">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span className="font-bold">REC ● WEBCAM {isRealWebcamActive ? 'LIVE' : 'POV'}</span>
          </div>
          <span className="hidden sm:inline px-2 py-0.5 rounded bg-black/50 backdrop-blur-md text-emerald-400 font-mono text-[10px]">
            30 FPS • 1080P
          </span>
        </div>

        {/* Live Status Badge in Top-Right */}
        <div className="absolute top-2.5 right-2.5 z-20 flex flex-col gap-1 items-end pointer-events-none">
          <span className={`px-2.5 py-0.5 rounded font-mono text-[10px] font-bold border backdrop-blur-md shadow-lg ${
            posture === 'good' 
              ? 'bg-emerald-950/85 border-emerald-400 text-emerald-300'
              : posture === 'slouching'
              ? 'bg-rose-950/85 border-rose-500 text-rose-300 animate-pulse'
              : posture === 'leaning'
              ? 'bg-amber-950/85 border-amber-500 text-amber-300'
              : 'bg-slate-900/85 border-slate-700 text-slate-400'
          }`}>
            {posture === 'good' && '✓ LƯNG THẲNG ĐẠT CHUẨN'}
            {posture === 'slouching' && '⚠ CẢNH BÁO: GÙ LƯNG / RƯỚN CỔ'}
            {posture === 'leaning' && '⚠ CẢNH BÁO: LỆCH VAI / CHỐNG MÁ'}
            {posture === 'away' && '○ RỜI KHỎI BÀN'}
          </span>
        </div>

        {/* AI Transparent Canvas Overlay */}
        <canvas 
          ref={canvasRef} 
          width={640} 
          height={360} 
          className="absolute inset-0 w-full h-full z-10 pointer-events-none"
        />

        {/* Subtle Scan-line Effect */}
        {isPlaying && (
          <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent animate-scan-line pointer-events-none z-10" />
        )}

        {/* Bottom Metadata Bar */}
        <div className="absolute bottom-2 left-2 z-20 flex items-center gap-2 pointer-events-none text-[10px] font-mono text-white/90">
          <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md">
            Góc cổ: <strong className={posture === 'slouching' ? 'text-rose-400' : 'text-emerald-400'}>{neckAngle}°</strong>
          </span>
          <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md hidden sm:inline">
            Lệch vai: <strong className={posture === 'leaning' ? 'text-amber-400' : 'text-emerald-400'}>{shoulderTilt}°</strong>
          </span>
          <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md hidden sm:inline">
            Khoảng cách mắt: <strong className="text-emerald-400">{distanceCm} cm</strong>
          </span>
        </div>

        {/* Floating Quick Action Controls on Video (when showHeader is false) */}
        {!showHeader && (
          <div className="absolute bottom-2 right-2 z-20 flex items-center gap-1.5">
            <button
              onClick={toggleRealWebcam}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-all border backdrop-blur-md ${
                isRealWebcamActive
                  ? 'bg-rose-600/90 text-white border-rose-500 shadow-xs animate-pulse'
                  : 'bg-black/60 hover:bg-black/80 text-white/90 hover:text-emerald-300 border-white/20'
              }`}
              title={isRealWebcamActive ? 'Tắt webcam máy tính' : 'Bật webcam thật của máy bạn để thử nghiệm'}
            >
              {isRealWebcamActive ? <VideoOff className="w-3 h-3" /> : <Video className="w-3 h-3 text-emerald-400" />}
              <span className="hidden md:inline">{isRealWebcamActive ? 'Tắt Cam' : 'Webcam Thật'}</span>
            </button>

            <button 
              onClick={() => setShowSkeleton(!showSkeleton)}
              className={`p-1 rounded-lg border backdrop-blur-md transition-colors ${
                showSkeleton 
                  ? 'bg-emerald-600/80 text-white border-emerald-400' 
                  : 'bg-black/60 hover:bg-black/80 text-white/70 border-white/20'
              }`}
              title={showSkeleton ? 'Ẩn khung xương AI' : 'Hiện khung xương AI'}
            >
              {showSkeleton ? <Eye className="w-3 h-3 text-emerald-300" /> : <EyeOff className="w-3 h-3" />}
            </button>

            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1 rounded-lg bg-black/60 hover:bg-black/80 text-white/90 hover:text-emerald-300 border border-white/20 backdrop-blur-md transition-colors"
              title={isPlaying ? 'Tạm dừng feed' : 'Tiếp tục feed'}
            >
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 text-emerald-400" />}
            </button>
          </div>
        )}
      </div>

      {/* Interactive Simulation Controls */}
      {showControls && (
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-emerald-600" />
              Mô phỏng tư thế người ngồi trước Webcam để kiểm tra AI:
            </span>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded font-medium">
              Webcam AI Engine
            </span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => setPosture('good')}
              className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all ${
                posture === 'good'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              1. Ngồi chuẩn (Thẳng lưng)
            </button>
            <button
              onClick={() => setPosture('slouching')}
              className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all ${
                posture === 'slouching'
                  ? 'bg-rose-600 text-white shadow-xs font-bold'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              2. Gù lưng (Cúi sát laptop)
            </button>
            <button
              onClick={() => setPosture('leaning')}
              className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all ${
                posture === 'leaning'
                  ? 'bg-amber-600 text-white shadow-xs font-bold'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              3. Vẹo cổ / Chống má
            </button>
            <button
              onClick={() => setPosture('away')}
              className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all ${
                posture === 'away'
                  ? 'bg-slate-600 text-white shadow-xs font-bold'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              4. Rời khỏi bàn
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

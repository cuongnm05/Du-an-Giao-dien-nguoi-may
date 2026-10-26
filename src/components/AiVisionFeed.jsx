import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Maximize2, 
  RefreshCw, 
  Volume2, 
  Eye, 
  Sliders, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  Pause 
} from 'lucide-react';

export default function AiVisionFeed({ 
  camName = 'Camera Bàn 101 - R&D', 
  memberName = 'Nguyễn Văn Cường', 
  initialPosture = 'good',
  showControls = true,
  height = 'h-72',
  onAlertTrigger
}) {
  const [posture, setPosture] = useState(initialPosture);
  const [isPlaying, setIsPlaying] = useState(true);
  const [fps, setFps] = useState(29);
  const [neckAngle, setNeckAngle] = useState(14);
  const [backAngle, setBackAngle] = useState(98);
  const [distanceCm, setDistanceCm] = useState(65);
  const canvasRef = useRef(null);

  useEffect(() => {
    setPosture(initialPosture);
  }, [initialPosture]);

  useEffect(() => {
    if (posture === 'good') {
      setNeckAngle(14);
      setBackAngle(98);
      setDistanceCm(65);
    } else if (posture === 'slouching') {
      setNeckAngle(32);
      setBackAngle(138);
      setDistanceCm(38);
      if (onAlertTrigger) {
        onAlertTrigger({
          type: 'slouching',
          text: 'Phát hiện gù lưng & rướn cổ quá 30°'
        });
      }
    } else if (posture === 'leaning') {
      setNeckAngle(22);
      setBackAngle(110);
      setDistanceCm(58);
      if (onAlertTrigger) {
        onAlertTrigger({
          type: 'leaning',
          text: 'Phát hiện vẹo cột sống lệch vai'
        });
      }
    } else if (posture === 'away') {
      setNeckAngle(0);
      setBackAngle(0);
      setDistanceCm(0);
    }
  }, [posture]);

  // Canvas drawing loop for AI Skeleton overlay
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

      // Dedicated dark AI camera viewport for optimal contrast with emerald laser keypoints
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#091510');
      grad.addColorStop(1, '#050c09');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid overlay
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.12)';
      ctx.lineWidth = 1;
      const gridSize = 30;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Office desk & chair wireframe silhouette
      ctx.strokeStyle = '#1b382b';
      ctx.lineWidth = 3;
      // Desk
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.45, canvas.height * 0.72);
      ctx.lineTo(canvas.width * 0.95, canvas.height * 0.72);
      ctx.stroke();
      // Monitor
      ctx.fillStyle = '#162e24';
      ctx.fillRect(canvas.width * 0.75, canvas.height * 0.35, canvas.width * 0.16, canvas.height * 0.28);
      ctx.strokeStyle = '#275240';
      ctx.strokeRect(canvas.width * 0.75, canvas.height * 0.35, canvas.width * 0.16, canvas.height * 0.28);
      // Screen glow
      ctx.fillStyle = 'rgba(52, 211, 153, 0.08)';
      ctx.fillRect(canvas.width * 0.76, canvas.height * 0.36, canvas.width * 0.14, canvas.height * 0.26);

      if (posture === 'away') {
        ctx.fillStyle = '#64748b';
        ctx.font = '13px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('NO SUBJECT DETECTED IN ROI', canvas.width / 2, canvas.height / 2);
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // Coordinates
      let headX = canvas.width * 0.40;
      let headY = canvas.height * 0.30 + jitter;
      let neckX = canvas.width * 0.40;
      let neckY = canvas.height * 0.40 + jitter;
      let shoulderLeftX = canvas.width * 0.36;
      let shoulderRightX = canvas.width * 0.44;
      let shoulderY = canvas.height * 0.43 + jitter;
      let spineMidX = canvas.width * 0.40;
      let spineMidY = canvas.height * 0.56 + jitter;
      let hipX = canvas.width * 0.39;
      let hipY = canvas.height * 0.73 + jitter;
      let kneeX = canvas.width * 0.52;
      let kneeY = canvas.height * 0.78 + jitter;
      let handX = canvas.width * 0.65;
      let handY = canvas.height * 0.70 + jitter;

      let themeColor = '#10b981'; // Green (Emerald)
      let glowColor = 'rgba(16, 185, 129, 0.4)';
      let statusLabel = 'TƯ THẾ CHUẨN (ERGONOMICS OK)';

      if (posture === 'slouching') {
        headX = canvas.width * 0.52;
        headY = canvas.height * 0.39 + jitter;
        neckX = canvas.width * 0.48;
        neckY = canvas.height * 0.45 + jitter;
        spineMidX = canvas.width * 0.36;
        spineMidY = canvas.height * 0.57 + jitter;
        shoulderY = canvas.height * 0.48 + jitter;
        themeColor = '#f43f5e';
        glowColor = 'rgba(244, 63, 94, 0.5)';
        statusLabel = 'CẢNH BÁO: GÙ LƯNG & CỔ RƯỚN TRƯỚC';
      } else if (posture === 'leaning') {
        headX = canvas.width * 0.34;
        headY = canvas.height * 0.34 + jitter;
        neckX = canvas.width * 0.36;
        shoulderLeftX = canvas.width * 0.30;
        shoulderRightX = canvas.width * 0.45;
        spineMidX = canvas.width * 0.35;
        themeColor = '#f59e0b';
        glowColor = 'rgba(245, 158, 11, 0.5)';
        statusLabel = 'CẢNH BÁO: VẸO CỘT SỐNG & LỆCH VAI';
      }

      // ROI Bounding Box
      ctx.strokeStyle = themeColor;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 4]);
      const bboxX = canvas.width * 0.22;
      const bboxY = canvas.height * 0.18;
      const bboxW = canvas.width * 0.44;
      const bboxH = canvas.height * 0.76;
      ctx.strokeRect(bboxX, bboxY, bboxW, bboxH);
      ctx.setLineDash([]);

      // Corner brackets
      const bracketLen = 12;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(bboxX, bboxY + bracketLen); ctx.lineTo(bboxX, bboxY); ctx.lineTo(bboxX + bracketLen, bboxY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(bboxX + bboxW - bracketLen, bboxY); ctx.lineTo(bboxX + bboxW, bboxY); ctx.lineTo(bboxX + bboxW, bboxY + bracketLen);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(bboxX, bboxY + bboxH - bracketLen); ctx.lineTo(bboxX, bboxY + bboxH); ctx.lineTo(bboxX + bracketLen, bboxY + bboxH);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(bboxX + bboxW - bracketLen, bboxY + bboxH); ctx.lineTo(bboxX + bboxW, bboxY + bboxH); ctx.lineTo(bboxX + bboxW, bboxY + bboxH - bracketLen);
      ctx.stroke();

      // Bones
      ctx.lineWidth = 3;
      ctx.shadowBlur = 10;
      ctx.shadowColor = glowColor;

      const drawBone = (x1, y1, x2, y2) => {
        ctx.beginPath();
        ctx.strokeStyle = themeColor;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      };

      drawBone(headX, headY, neckX, neckY);
      drawBone(neckX, neckY, shoulderLeftX, shoulderY);
      drawBone(neckX, neckY, shoulderRightX, shoulderY);
      drawBone(neckX, neckY, spineMidX, spineMidY);
      drawBone(spineMidX, spineMidY, hipX, hipY);
      drawBone(hipX, hipY, kneeX, kneeY);
      drawBone(shoulderRightX, shoulderY, handX, handY);

      // Vision ray
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(headX + 8, headY);
      ctx.lineTo(canvas.width * 0.75, canvas.height * 0.45);
      ctx.stroke();
      ctx.setLineDash([]);

      // Joints
      const joints = [
        { x: headX, y: headY, r: 7 },
        { x: neckX, y: neckY, r: 5 },
        { x: shoulderLeftX, y: shoulderY, r: 4.5 },
        { x: shoulderRightX, y: shoulderY, r: 4.5 },
        { x: spineMidX, y: spineMidY, r: 5 },
        { x: hipX, y: hipY, r: 5.5 },
        { x: kneeX, y: kneeY, r: 4.5 },
        { x: handX, y: handY, r: 4 }
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

      // HUD text
      ctx.shadowBlur = 0;
      ctx.font = 'bold 11px monospace';
      ctx.fillStyle = themeColor;
      ctx.textAlign = 'left';
      ctx.fillText(`POSTURE: ${statusLabel}`, bboxX, bboxY - 8);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.font = '10px monospace';
      ctx.fillText(`NECK ANGLE: ${neckAngle}°`, 14, canvas.height - 38);
      ctx.fillText(`SPINE CURVE: ${backAngle}°`, 14, canvas.height - 24);
      ctx.fillText(`EYE-SCREEN DIST: ${distanceCm}cm`, 14, canvas.height - 10);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [posture, isPlaying, neckAngle, backAngle, distanceCm]);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex flex-col">
      {/* Feed Header */}
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              posture === 'slouching' ? 'bg-rose-400' : posture === 'leaning' ? 'bg-amber-400' : 'bg-emerald-400'
            }`}></span>
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
              posture === 'slouching' ? 'bg-rose-500' : posture === 'leaning' ? 'bg-amber-500' : 'bg-emerald-500'
            }`}></span>
          </span>
          <span className="font-bold text-slate-900 tracking-wide">{camName}</span>
          <span className="text-slate-500 font-mono text-[11px]">| {memberName}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 font-medium">
            <Eye className="w-3 h-3" />
            <span>AI SKELETON POSE-3D</span>
          </div>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-slate-500 hover:text-slate-900 transition-colors"
            title={isPlaying ? 'Tạm dừng feed' : 'Tiếp tục feed'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Live AI Canvas */}
      <div className={`relative w-full ${height} bg-[#08110d] overflow-hidden`}>
        <canvas 
          ref={canvasRef} 
          width={480} 
          height={280} 
          className="w-full h-full object-cover"
        />

        {/* Scan line effect */}
        {isPlaying && <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent animate-scan-line pointer-events-none" />}

        {/* Live HUD Badges on Canvas */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 items-end pointer-events-none">
          <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm border border-slate-700/60 font-mono text-[10px] text-slate-300">
            FPS: {fps} | RES: 1080P
          </span>
          <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold border backdrop-blur-sm ${
            posture === 'good' 
              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
              : posture === 'slouching'
              ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse'
              : posture === 'leaning'
              ? 'bg-amber-950/80 border-amber-500 text-amber-300'
              : 'bg-slate-900/80 border-slate-700 text-slate-400'
          }`}>
            {posture === 'good' && '✓ LƯNG THẲNG ĐẠT CHUẨN'}
            {posture === 'slouching' && '⚠ CẢNH BÁO: GÙ LƯNG'}
            {posture === 'leaning' && '⚠ VẸO CỘT SỐNG (LEANING)'}
            {posture === 'away' && '○ RỜI KHỎI BÀN'}
          </span>
        </div>
      </div>

      {/* Interactive Simulation Controls */}
      {showControls && (
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-emerald-600" />
              Mô phỏng tư thế để kiểm tra AI Engine:
            </span>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded font-medium">Live Calibration Mode</span>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => setPosture('good')}
              className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all ${
                posture === 'good'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              1. Ngồi chuẩn
            </button>
            <button
              onClick={() => setPosture('slouching')}
              className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all ${
                posture === 'slouching'
                  ? 'bg-rose-600 text-white shadow-xs font-bold'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              2. Gù lưng
            </button>
            <button
              onClick={() => setPosture('leaning')}
              className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all ${
                posture === 'leaning'
                  ? 'bg-amber-600 text-white shadow-xs font-bold'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              3. Vẹo cột sống
            </button>
            <button
              onClick={() => setPosture('away')}
              className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all ${
                posture === 'away'
                  ? 'bg-slate-600 text-white shadow-xs font-bold'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              4. Rời bàn
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

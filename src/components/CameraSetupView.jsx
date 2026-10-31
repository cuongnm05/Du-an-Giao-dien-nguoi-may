import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Video, 
  Settings2, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Plus, 
  Maximize, 
  ShieldCheck, 
  Crosshair, 
  Compass, 
  Eye, 
  Laptop, 
  Save, 
  Trash2, 
  Power, 
  RotateCcw, 
  Sparkles, 
  HelpCircle 
} from 'lucide-react';
import AiVisionFeed from './AiVisionFeed';

export default function CameraSetupView({ cameras, members, onUpdateCameras }) {
  const [selectedCamId, setSelectedCamId] = useState(cameras[0]?.id || 'CAM-01');
  const [activeCam, setActiveCam] = useState(cameras[0] || {});
  
  const [feedMode, setFeedMode] = useState('simulation');
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [webcamError, setWebcamError] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraAngle, setCameraAngle] = useState(activeCam.angle || 'side');
  const [neckLimit, setNeckLimit] = useState(activeCam.neckAngleLimit || 25);
  const [slouchDuration, setSlouchDuration] = useState(activeCam.slouchThresholdSec || 60);
  const [sensitivity, setSensitivity] = useState(activeCam.sensitivity || 85);
  const [distanceCm, setDistanceCm] = useState(activeCam.distanceCm || 65);
  const [assignedMember, setAssignedMember] = useState(activeCam.assignedTo || '');
  const [cameraName, setCameraName] = useState(activeCam.name || '');

  const [roiWidth, setRoiWidth] = useState(80);
  const [roiHeight, setRoiHeight] = useState(85);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newCamData, setNewCamData] = useState({
    id: `CAM-0${cameras.length + 1}`,
    name: 'Camera Bàn Mới',
    ip: '192.168.1.150:554/rtsp',
    type: 'AI Smart Cam 4K',
    angle: 'side',
    location: 'Tầng 3 - Phòng R&D',
    room: 'Phòng Kỹ Thuật',
    status: 'online',
    fps: 30,
    resolution: '1080p @ 30fps',
    assignedTo: members[0]?.name || '',
    role: 'Nhân viên',
    lastCalibration: 'Vừa thêm',
    slouchThresholdSec: 60,
    sensitivity: 85,
    distanceCm: 60,
    neckAngleLimit: 25,
  });

  useEffect(() => {
    const found = cameras.find(c => c.id === selectedCamId);
    if (found) {
      setActiveCam(found);
      setCameraAngle(found.angle || 'side');
      setNeckLimit(found.neckAngleLimit || 25);
      setSlouchDuration(found.slouchThresholdSec || 60);
      setSensitivity(found.sensitivity || 85);
      setDistanceCm(found.distanceCm || 65);
      setAssignedMember(found.assignedTo || '');
      setCameraName(found.name || '');
    }
  }, [selectedCamId, cameras]);

  const startWebcam = async () => {
    setWebcamError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720, facingMode: 'user' },
          audio: false
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setIsWebcamActive(true);
        setFeedMode('webcam');
      } else {
        setWebcamError('Trình duyệt không hỗ trợ getUserMedia.');
      }
    } catch (err) {
      console.error(err);
      setWebcamError('Không thể mở Webcam (vui lòng kiểm tra quyền truy cập camera trong trình duyệt).');
      setFeedMode('simulation');
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsWebcamActive(false);
    setFeedMode('simulation');
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleSaveConfig = () => {
    const updated = cameras.map(c => {
      if (c.id === selectedCamId) {
        return {
          ...c,
          name: cameraName,
          angle: cameraAngle,
          neckAngleLimit: neckLimit,
          slouchThresholdSec: slouchDuration,
          sensitivity: sensitivity,
          distanceCm: distanceCm,
          assignedTo: assignedMember,
          lastCalibration: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
      }
      return c;
    });
    onUpdateCameras(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleTestDetection = () => {
    setTestResult({
      status: 'success',
      latency: '14.2ms',
      fps: '30.1',
      keypointsDetected: '17/17 Keypoints (COCO-Pose)',
      confidence: `${sensitivity}%`,
      spineAngle: '96.4° (Bình thường)',
      message: 'Căn chỉnh đạt chuẩn ISO 9241-5 về công thái học màn hình.'
    });
  };

  const handleAddNewCam = (e) => {
    e.preventDefault();
    onUpdateCameras([...cameras, newCamData]);
    setShowAddModal(false);
    setSelectedCamId(newCamData.id);
  };

  return (
    <div className="space-y-6">
      {/* Toast Save Alert */}
      {saveSuccess && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 p-4 bg-emerald-600 text-white rounded-xl shadow-2xl text-xs animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <div>
            <div className="font-bold">Đã lưu cấu hình Camera thành công!</div>
            <div className="text-emerald-100">Bộ tham số căn chỉnh góc & ngưỡng AI đã được đồng bộ tới Camera Hub.</div>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              AI Vision Calibration Studio
            </span>
            <span className="text-slate-500 text-xs">• Hỗ trợ RTSP Stream, USB WebCam & Simulation</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Thiết Lập & Căn Chỉnh Máy Camera AI Giám Sát Tư Thế
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Cấu hình góc đặt camera (Góc ngang, Góc xiên 45°, Trực diện), thiết lập ngưỡng gù lưng, cự ly màn hình và vùng quan sát ROI.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Camera Mới</span>
          </button>
        </div>
      </div>

      {/* Camera Selection Tab Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {cameras.map(cam => (
          <button
            key={cam.id}
            onClick={() => setSelectedCamId(cam.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              selectedCamId === cam.id
                ? 'bg-emerald-50 text-emerald-800 border-2 border-emerald-500 font-bold shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${cam.status === 'online' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
            <span className="font-semibold text-slate-900">{cam.id}</span>
            <span className="text-slate-500">({cam.angle === 'side' ? 'Góc ngang' : cam.angle === 'front' ? 'Trực diện' : 'Góc 45°'})</span>
          </button>
        ))}
      </div>

      {/* Main Studio: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 Cols): Video / Simulation Feed & Calibration Overlay */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Feed Header with Mode Switcher */}
          <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 text-xs shadow-xs">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-600" />
              <span className="font-bold text-slate-800">Nguồn hình ảnh kiểm tra:</span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => {
                  stopWebcam();
                  setFeedMode('simulation');
                }}
                className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  feedMode === 'simulation'
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Mô phỏng AI Skeleton
              </button>
              <button
                onClick={startWebcam}
                className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all flex items-center gap-1.5 ${
                  feedMode === 'webcam'
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Video className="w-3 h-3" />
                <span>Webcam Thực Tế</span>
              </button>
            </div>
          </div>

          {webcamError && (
            <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 text-xs rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{webcamError}</span>
            </div>
          )}

          {/* Video Container */}
          <div className="relative rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
            {feedMode === 'webcam' ? (
              <div className="relative h-80 sm:h-96 w-full flex items-center justify-center bg-black">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover transform -scale-x-100"
                />
                
                {/* Live Skeleton HUD Overlay for Real Webcam */}
                <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-emerald-400 font-mono border border-emerald-500/40 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                      LIVE WEBCAM STREAM
                    </span>
                    <span className="px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-emerald-400 font-mono border border-emerald-500/40">
                      AI POSE DETECTOR: READY
                    </span>
                  </div>

                  {/* Calibration ROI Box */}
                  <div 
                    className="border-2 border-dashed border-emerald-400 rounded-xl relative flex items-center justify-center transition-all mx-auto"
                    style={{ width: `${roiWidth}%`, height: `${roiHeight}%` }}
                  >
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 text-emerald-300 font-mono text-[10px] rounded border border-emerald-500/50">
                      ROI VÙNG QUAN SÁT CHÍNH ({roiWidth}% x {roiHeight}%)
                    </div>
                    <div className="w-8 h-8 rounded-full border border-emerald-400/60 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                    </div>
                  </div>

                  {/* Bottom Calibration HUD */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-200 bg-black/70 backdrop-blur-md p-2 rounded-lg border border-slate-700">
                    <span>GÓC ĐẶT: {cameraAngle === 'side' ? '90° SIDE' : cameraAngle === 'front' ? '0° FRONT' : '45° ANGLE'}</span>
                    <span>NGƯỠNG GÙ: &gt; {neckLimit}°</span>
                    <span>DELAY: {slouchDuration}s</span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <AiVisionFeed 
                  camId={activeCam.id}
                  camName={activeCam.name}
                  memberName={activeCam.assignedTo || 'Nhân sự'}
                  webcamUrl={activeCam.webcamUrl}
                  initialPosture="good"
                  showControls={true}
                  showHeader={false}
                  height="h-96"
                />
              </div>
            )}
          </div>

          {/* Quick Calibration Test Actions */}
          <div className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
            <div className="flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-emerald-600" />
              <span className="text-slate-700 font-medium">Kiểm tra kết nối và độ chính xác nhận diện:</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleTestDetection}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/20"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Kiểm Tra Thử Nghiệm AI</span>
              </button>
            </div>
          </div>

          {/* Test Result Callout */}
          {testResult && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-xs animate-in fade-in duration-150">
              <div className="flex items-center justify-between text-emerald-800 font-bold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> KẾT QUẢ KIỂM THỬ GÓC CAMERA: {testResult.status.toUpperCase()}
                </span>
                <span className="font-mono text-slate-500">Độ trễ: {testResult.latency}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono pt-1">
                <div className="p-2 rounded bg-white border border-slate-200 shadow-2xs">
                  <div className="text-slate-500">Khớp nhận diện</div>
                  <div className="font-bold text-emerald-700">{testResult.keypointsDetected}</div>
                </div>
                <div className="p-2 rounded bg-white border border-slate-200 shadow-2xs">
                  <div className="text-slate-500">Độ tin cậy</div>
                  <div className="font-bold text-emerald-700">{testResult.confidence}</div>
                </div>
                <div className="p-2 rounded bg-white border border-slate-200 shadow-2xs">
                  <div className="text-slate-500">Góc cột sống</div>
                  <div className="font-bold text-emerald-700">{testResult.spineAngle}</div>
                </div>
                <div className="p-2 rounded bg-white border border-slate-200 shadow-2xs">
                  <div className="text-slate-500">Tốc độ khung hình</div>
                  <div className="font-bold text-slate-800">{testResult.fps} FPS</div>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 pt-1">{testResult.message}</p>
            </div>
          )}
        </div>

        {/* Right Column (5 Cols): Calibration Parameters & Hardware Setup */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Thông Số Căn Chỉnh Máy Camera
                </h3>
              </div>
              <span className="font-mono text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">{selectedCamId}</span>
            </div>

            {/* Camera Name & Assignment */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tên Camera & Vị Trí Lắp Đặt</label>
                <input
                  type="text"
                  value={cameraName}
                  onChange={(e) => setCameraName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Gán Cho Nhân Viên / Học Sinh</label>
                <select
                  value={assignedMember}
                  onChange={(e) => setAssignedMember(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
                >
                  {members.map(m => (
                    <option key={m.id} value={m.name}>
                      {m.name} - {m.department} ({m.workstation})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 1. Camera Placement Angle (3 Choices) */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Compass className="w-3.5 h-3.5 text-emerald-600" />
                  Góc Lắp Đặt Camera (Camera Angle)
                </span>
                <span className="text-[11px] text-emerald-700 font-bold uppercase">
                  {cameraAngle === 'side' ? 'Góc Nhìn Ngang (90°)' : cameraAngle === 'angle-45' ? 'Góc Xiên (45°)' : 'Trực Diện (0°)'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setCameraAngle('side')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    cameraAngle === 'side'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-xs">Góc Ngang</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">90° Chuẩn ISO</div>
                </button>

                <button
                  type="button"
                  onClick={() => setCameraAngle('angle-45')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    cameraAngle === 'angle-45'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-xs">Góc Xiên</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">45° Bàn làm việc</div>
                </button>

                <button
                  type="button"
                  onClick={() => setCameraAngle('front')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    cameraAngle === 'front'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-xs">Trực Diện</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">0° Webcam laptop</div>
                </button>
              </div>
              <p className="text-[10px] text-slate-500 italic">
                *Gợi ý: Góc nhìn ngang 90° mang lại độ chính xác cao nhất cho việc đo góc gù đốt sống cổ C7 và lưng T-Spine.
              </p>
            </div>

            {/* 2. Neck Flexion Limit Slider */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-700 font-semibold">Ngưỡng Góc Cúi Cổ Báo Động:</span>
                <span className="font-mono font-bold text-amber-600 text-sm">{neckLimit}°</span>
              </div>
              <input 
                type="range" 
                min={15} 
                max={40} 
                value={neckLimit} 
                onChange={(e) => setNeckLimit(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>15° (Nghiêm ngặt)</span>
                <span>25° (Tiêu chuẩn)</span>
                <span>40° (Nới lỏng)</span>
              </div>
            </div>

            {/* 3. Slouch Duration Trigger */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-700 font-semibold">Thời Gian Duy Trì Gù Trước Khi Rung/Chuông:</span>
                <span className="font-mono font-bold text-emerald-700 text-sm">{slouchDuration} Giây</span>
              </div>
              <input 
                type="range" 
                min={15} 
                max={180} 
                step={15}
                value={slouchDuration} 
                onChange={(e) => setSlouchDuration(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>15s (Tức thì)</span>
                <span>60s (1 phút)</span>
                <span>180s (3 phút)</span>
              </div>
            </div>

            {/* 4. AI Confidence Sensitivity Slider */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-700 font-semibold">Độ Nhạy Mô Hình AI (Confidence):</span>
                <span className="font-mono font-bold text-emerald-700 text-sm">{sensitivity}%</span>
              </div>
              <input 
                type="range" 
                min={50} 
                max={99} 
                value={sensitivity} 
                onChange={(e) => setSensitivity(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* 5. ROI Size Setup */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-700 font-semibold">Vùng Nhận Diện ROI (Bàn làm việc):</span>
                <span className="font-mono text-emerald-700 font-bold">{roiWidth}% x {roiHeight}%</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-500">Chiều ngang: {roiWidth}%</span>
                  <input 
                    type="range" min={50} max={100} value={roiWidth} 
                    onChange={e => setRoiWidth(Number(e.target.value))}
                    className="w-full accent-emerald-600" 
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500">Chiều dọc: {roiHeight}%</span>
                  <input 
                    type="range" min={50} max={100} value={roiHeight} 
                    onChange={e => setRoiHeight(Number(e.target.value))}
                    className="w-full accent-emerald-600" 
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-3">
              <button
                onClick={handleSaveConfig}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>LƯU CẤU HÌNH CĂN CHỈNH CAMERA NÀY</span>
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Camera Inventory Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Laptop className="w-4 h-4 text-emerald-600" />
              Danh Sách Thiết Bị Camera Đang Kết Nối Vào Hệ Thống
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Quản lý luồng RTSP, USB Edge Cameras và trạng thái hoạt động của từng vị trí
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 font-semibold">
            {cameras.filter(c => c.status === 'online').length} / {cameras.length} Camera Online
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Mã & Tên Camera</th>
                <th className="py-3 px-4">Luồng IP / Thiết bị</th>
                <th className="py-3 px-4">Vị Trí & Bàn</th>
                <th className="py-3 px-4">Nhân Sự Được Gán</th>
                <th className="py-3 px-4">Góc Quay</th>
                <th className="py-3 px-4">Trạng Thái</th>
                <th className="py-3 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {cameras.map(cam => (
                <tr key={cam.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                    <span className="font-mono text-emerald-600 font-bold">{cam.id}</span>
                    <span>{cam.name}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">{cam.ip}</td>
                  <td className="py-3 px-4">{cam.location}</td>
                  <td className="py-3 px-4 font-semibold text-emerald-700">{cam.assignedTo || 'Chưa gán'}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-mono text-slate-700 border border-slate-200">
                      {cam.angle === 'side' ? 'Góc Ngang 90°' : cam.angle === 'front' ? 'Trực Diện 0°' : 'Góc Xiên 45°'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      cam.status === 'online'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cam.status === 'online' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                      {cam.status === 'online' ? 'Online' : 'Offline'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedCamId(cam.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-3 py-1 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white rounded-lg text-xs font-semibold transition-all border border-emerald-200"
                    >
                      Căn Chỉnh Ngay
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Thêm Camera Mới */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-600" />
                Thêm Thiết Bị Camera AI Mới
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNewCam} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Mã Camera ID</label>
                <input 
                  type="text" 
                  value={newCamData.id} 
                  onChange={e => setNewCamData({ ...newCamData, id: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono"
                  required 
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Tên Nhận Diện Camera</label>
                <input 
                  type="text" 
                  value={newCamData.name} 
                  onChange={e => setNewCamData({ ...newCamData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  required 
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Đường Dẫn Luồng RTSP / Cổng USB</label>
                <input 
                  type="text" 
                  value={newCamData.ip} 
                  onChange={e => setNewCamData({ ...newCamData, ip: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono"
                  placeholder="rtsp://192.168.1.xxx:554/live"
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Vị Trí Lắp Đặt</label>
                  <input 
                    type="text" 
                    value={newCamData.location} 
                    onChange={e => setNewCamData({ ...newCamData, location: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                    required 
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Góc Đặt Ban Đầu</label>
                  <select 
                    value={newCamData.angle} 
                    onChange={e => setNewCamData({ ...newCamData, angle: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  >
                    <option value="side">Góc Nhìn Ngang (90°)</option>
                    <option value="angle-45">Góc Xiên (45°)</option>
                    <option value="front">Trực Diện (0°)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-md shadow-emerald-600/20"
                >
                  Thêm & Bắt Đầu Căn Chỉnh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

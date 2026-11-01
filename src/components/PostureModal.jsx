import React, { useState } from 'react';
import { 
  X, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Flame, 
  Sparkles, 
  Share2, 
  Download, 
  ShieldCheck, 
  Send, 
  Sliders, 
  ChevronRight, 
  TrendingUp 
} from 'lucide-react';
import AiVisionFeed from './AiVisionFeed';

export default function PostureModal({ member, onClose, onSendBuzzer }) {
  if (!member) return null;

  const [sentAlert, setSentAlert] = useState(false);

  const handleSendReminder = () => {
    setSentAlert(true);
    if (onSendBuzzer) onSendBuzzer(member);
    setTimeout(() => setSentAlert(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl p-6 sm:p-8 space-y-6 shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <img 
              src={member.avatar} 
              alt={member.name} 
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/30 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900">{member.name}</h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {member.code}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {member.spineHealthStatus}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {member.role} • {member.department} • Vị trí: <strong className="text-emerald-700">{member.workstation}</strong>
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2 Column Details */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left Column: AI Camera Visual & Skeleton Angles */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-600" />
                Mô Hình AI Pose Estimation Cột Sống
              </span>
              <span className="font-mono text-emerald-700 font-semibold text-[11px]">Cam ID: {member.camId || 'CAM-01'}</span>
            </div>

            <AiVisionFeed 
              camId={member.camId || 'CAM-01'}
              camName={`Webcam ${member.workstation}`}
              memberName={member.name}
              webcamUrl={member.webcamUrl}
              initialPosture={member.currentPosture}
              showControls={false}
              showHeader={false}
              height="h-56"
            />

            {/* Spine Angle Diagnostic Table */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
              <div className="font-semibold text-slate-700 text-[11px] uppercase tracking-wider">
                Chỉ số góc sinh trắc học hiện tại:
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <div className="text-slate-500">Góc đốt sống cổ C7:</div>
                  <div className="font-bold text-emerald-700 text-sm">{member.avgNeckAngle} (Chuẩn &lt; 20°)</div>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <div className="text-slate-500">Góc ngả lưng T-Spine:</div>
                  <div className="font-bold text-emerald-700 text-sm">98° (Chuẩn 95°-105°)</div>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <div className="text-slate-500">Độ cân bằng hai vai:</div>
                  <div className="font-bold text-emerald-700 text-sm">Lệch 0.4cm (Tốt)</div>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <div className="text-slate-500">Cự ly mắt - Màn hình:</div>
                  <div className="font-bold text-amber-600 text-sm">62cm (Chuẩn 50-70cm)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Performance Stats & Recommendations */}
          <div className="md:col-span-6 space-y-4">
            
            {/* KPI Summary */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-[10px] text-slate-500 font-medium">Công Thái Học</div>
                <div className="text-xl font-extrabold text-emerald-600 font-mono mt-0.5">
                  {member.ergonomicsScore}
                </div>
                <div className="text-[9px] text-emerald-700 font-semibold">Mức Rất Tốt</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-[10px] text-slate-500 font-medium">Tập Trung Sâu</div>
                <div className="text-base font-bold text-slate-800 font-mono mt-1">
                  {member.focusTime}
                </div>
                <div className="text-[9px] text-slate-500">Đạt 91% ca</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-[10px] text-slate-500 font-medium">Cảnh Báo Gù</div>
                <div className="text-xl font-extrabold text-rose-600 font-mono mt-0.5">
                  {member.warningsToday}
                </div>
                <div className="text-[9px] text-rose-600 font-semibold">Lần / Hôm nay</div>
              </div>
            </div>

            {/* Posture Distribution Breakdown */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">Phân Bố Tư Thế Trong Ngày:</span>
                <span className="font-mono text-emerald-700 font-bold">{member.postureBreakdown?.good || 78}% Ngồi chuẩn</span>
              </div>

              {/* Progress bar */}
              <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden flex">
                <div 
                  className="bg-emerald-500 h-full" 
                  style={{ width: `${member.postureBreakdown?.good || 78}%` }} 
                  title="Ngồi chuẩn"
                />
                <div 
                  className="bg-rose-500 h-full" 
                  style={{ width: `${member.postureBreakdown?.slouching || 12}%` }} 
                  title="Gù lưng"
                />
                <div 
                  className="bg-amber-500 h-full" 
                  style={{ width: `${member.postureBreakdown?.leaning || 6}%` }} 
                  title="Vẹo cột sống"
                />
                <div 
                  className="bg-slate-400 h-full" 
                  style={{ width: `${member.postureBreakdown?.away || 4}%` }} 
                  title="Rời bàn"
                />
              </div>

              <div className="grid grid-cols-4 gap-1 text-[10px] text-center pt-1 font-mono font-medium">
                <div className="text-emerald-700">● Chuẩn ({member.postureBreakdown?.good}%)</div>
                <div className="text-rose-600">● Gù ({member.postureBreakdown?.slouching}%)</div>
                <div className="text-amber-600">● Lệch ({member.postureBreakdown?.leaning}%)</div>
                <div className="text-slate-500">● Vắng ({member.postureBreakdown?.away}%)</div>
              </div>
            </div>

            {/* Personalized Ergonomics Advice */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Khuyến Nghị Cải Thiện Công Thái Học Cá Nhân Hóa:</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {member.advice}
              </p>
              <div className="text-[11px] text-slate-500 pt-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Độ cao mặt bàn hiện tại 74cm phù hợp với vóc dáng của bạn.</span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={handleSendReminder}
                disabled={sentAlert}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
              >
                {sentAlert ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Đã gửi nhắc nhở tới bàn!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Gửi Nhắc Nhở Trực Tiếp Đến Màn Hình Bàn</span>
                  </>
                )}
              </button>

              <button
                onClick={() => alert(`Đang chuẩn bị file PDF phân tích tư thế của ${member.name}...`)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200"
                title="Tải báo cáo PDF"
              >
                <Download className="w-4 h-4" />
                <span>Tải Báo Cáo</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

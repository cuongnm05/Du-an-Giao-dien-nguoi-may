import React, { useState } from 'react';
import { 
  BellRing, 
  Volume2, 
  Sliders, 
  ShieldAlert, 
  Save, 
  CheckCircle2, 
  Monitor, 
  Mail, 
  Zap, 
  Clock, 
  Sparkles, 
  Smartphone 
} from 'lucide-react';
import { DEFAULT_ALERT_RULES } from '../data/mockData';

export default function AlertSettingsView() {
  const [rules, setRules] = useState(DEFAULT_ALERT_RULES);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testNotification, setTestNotification] = useState(false);

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleTestAlert = () => {
    setTestNotification(true);
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
      console.log('AudioContext not allowed');
    }
    setTimeout(() => setTestNotification(false), 3500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Toast Save Alert */}
      {saveSuccess && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 p-4 bg-emerald-600 text-white rounded-xl shadow-2xl text-xs animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <div>
            <div className="font-bold">Đã lưu quy tắc cảnh báo!</div>
            <div className="text-emerald-100">Các ngưỡng cảnh báo AI đã được kích hoạt trên toàn hệ thống camera.</div>
          </div>
        </div>
      )}

      {/* Simulated Live Desktop Popup Toast */}
      {testNotification && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 p-4 bg-white border-2 border-emerald-500 rounded-2xl shadow-2xl text-xs text-slate-800 animate-in zoom-in-95 duration-150">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 animate-pulse">
            <BellRing className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-sm text-emerald-700 flex items-center gap-1.5">
              <span>🔔 NHẮC NHỞ CÔNG THÁI HỌC (DEMO)</span>
            </div>
            <div className="text-slate-600 mt-0.5">
              Bạn đang gù lưng & rướn cổ quá 25°. Hãy ngồi thẳng lưng và tựa sát vào đệm ghế nhé!
            </div>
          </div>
        </div>
      )}

      {/* Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Quy Tắc Tự Động Hóa
            </span>
            <span className="text-slate-500 text-xs">• Cấu hình ngưỡng cảnh báo & Kênh thông báo</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Cấu Hình Quy Tắc Cảnh Báo Tư Thế & Nghỉ Giải Lao
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Thiết lập thời gian trễ trước khi phát chuông nhắc nhở và phương thức thông báo (Popup, âm thanh, email).
          </p>
        </div>

        <button
          onClick={handleTestAlert}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold shadow-xs transition-all"
        >
          <Volume2 className="w-4 h-4 text-emerald-600" />
          <span>Thử Chuông Cảnh Báo</span>
        </button>
      </div>

      {/* Settings Form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        
        {/* Section 1: Posture Triggers */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
            <Sliders className="w-4 h-4 text-emerald-600" />
            1. Ngưỡng Kích Hoạt Cảnh Báo Sinh Trắc Học (Pose Thresholds)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Slouch duration */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-semibold">Thời gian gù lưng liên tục:</span>
                <span className="font-mono font-bold text-amber-600 text-sm">
                  {rules.slouchThresholdSeconds} Giây ({Math.round(rules.slouchThresholdSeconds / 60)} phút)
                </span>
              </div>
              <input
                type="range"
                min={30}
                max={300}
                step={30}
                value={rules.slouchThresholdSeconds}
                onChange={e => setRules({ ...rules, slouchThresholdSeconds: Number(e.target.value) })}
                className="w-full accent-emerald-600"
              />
              <p className="text-[10px] text-slate-500">
                Nếu camera AI phát hiện lưng cong hoặc cổ cúi quá giới hạn liên tục qua thời gian này, hệ thống sẽ gửi nhắc nhở.
              </p>
            </div>

            {/* Neck angle warning */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-semibold">Góc gập đốt sống cổ tối đa:</span>
                <span className="font-mono font-bold text-emerald-700 text-sm">{rules.neckAngleWarningDegrees}°</span>
              </div>
              <input
                type="range"
                min={15}
                max={35}
                value={rules.neckAngleWarningDegrees}
                onChange={e => setRules({ ...rules, neckAngleWarningDegrees: Number(e.target.value) })}
                className="w-full accent-emerald-600"
              />
              <p className="text-[10px] text-slate-500">
                Góc cổ tiêu chuẩn khi ngồi làm việc là &lt; 20°. Góc &gt; 30° làm tăng áp lực lên đĩa đệm cổ gấp 3 lần.
              </p>
            </div>

            {/* Screen Distance */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-semibold">Khoảng cách mắt - màn hình tối thiểu:</span>
                <span className="font-mono font-bold text-teal-700 text-sm">{rules.minScreenDistanceCm} cm</span>
              </div>
              <input
                type="range"
                min={30}
                max={60}
                value={rules.minScreenDistanceCm}
                onChange={e => setRules({ ...rules, minScreenDistanceCm: Number(e.target.value) })}
                className="w-full accent-emerald-600"
              />
              <p className="text-[10px] text-slate-500">
                Cảnh báo khi người dùng cúi sát mặt vào màn hình dưới cự ly an toàn để bảo vệ thị lực.
              </p>
            </div>

            {/* Continuous sitting */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-semibold">Giới hạn thời gian ngồi liên tục:</span>
                <span className="font-mono font-bold text-emerald-700 text-sm">{rules.maxContinuousSittingMin} Phút</span>
              </div>
              <input
                type="range"
                min={30}
                max={120}
                step={15}
                value={rules.maxContinuousSittingMin}
                onChange={e => setRules({ ...rules, maxContinuousSittingMin: Number(e.target.value) })}
                className="w-full accent-emerald-600"
              />
              <p className="text-[10px] text-slate-500">
                Tự động nhắc đứng dậy đi lại và uống nước sau mỗi phiên ngồi làm việc liên tục.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Notification Channels */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
            <BellRing className="w-4 h-4 text-emerald-600" />
            2. Kênh Thông Báo Cảnh Báo (Notification Channels)
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100/70">
              <div className="flex items-center gap-3">
                <Monitor className="w-5 h-5 text-emerald-600" />
                <div>
                  <div className="font-semibold text-slate-900">Popup Nhắc Nhở Trực Tiếp Trên Màn Hình Máy Trạm</div>
                  <div className="text-[11px] text-slate-500">Hiển thị thông báo góc màn hình với hình ảnh hướng dẫn tư thế đúng</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={rules.enableDesktopPopup}
                onChange={e => setRules({ ...rules, enableDesktopPopup: e.target.checked })}
                className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100/70">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-teal-600" />
                <div>
                  <div className="font-semibold text-slate-900">Âm Thanh Bíp Nhắc Nhở Dịu Tai</div>
                  <div className="text-[11px] text-slate-500">Phát âm báo tần số 587Hz không gây giật mình qua loa máy tính</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={rules.enableSoundAlert}
                onChange={e => setRules({ ...rules, enableSoundAlert: e.target.checked })}
                className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100/70">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-600" />
                <div>
                  <div className="font-semibold text-slate-900">Gửi Báo Cáo Tổng Hợp Hàng Ngày Qua Email</div>
                  <div className="text-[11px] text-slate-500">Gửi thống kê tư thế và năng suất cho Quản lý / Giáo viên chủ nhiệm lúc 17:30</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={rules.sendDailyEmailReport}
                onChange={e => setRules({ ...rules, sendDailyEmailReport: e.target.checked })}
                className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>LƯU CẤU HÌNH QUY TẮC CẢNH BÁO</span>
          </button>
        </div>

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { 
  X, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Flame, 
  Sparkles, 
  Download, 
  ShieldCheck, 
  Send, 
  HeartPulse, 
  TrendingUp, 
  Award, 
  Briefcase, 
  FileText,
  UserCheck,
  UserX
} from 'lucide-react';

export default function PostureModal({ member, onClose, onSendBuzzer }) {
  if (!member) return null;

  const [sentAlert, setSentAlert] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleSendReminder = () => {
    setSentAlert(true);
    if (onSendBuzzer) onSendBuzzer(member);
    showToast(`Đã gửi cảnh báo rung chuông & gợi ý tư thế tới bàn của ${member.name}!`);
    setTimeout(() => setSentAlert(false), 3000);
  };

  const isAbsent = member.currentPosture === 'away' || member.status === 'offline';

  const postureHistory = member.postureHistory || [
    { time: '08:00', score: 92 },
    { time: '11:00', score: 88 },
    { time: '14:00', score: 85 },
    { time: '16:00', score: 90 }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      {/* Toast Notice inside Modal */}
      {toastMsg && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-60 flex items-center gap-2.5 px-4 py-3 bg-emerald-600 text-white rounded-2xl shadow-2xl text-xs font-semibold animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl p-5 sm:p-7 space-y-5 shadow-2xl my-6 animate-in fade-in zoom-in-95 duration-200 relative">
        
        {/* Modal Header: Thông tin lý lịch nhân sự & Sức khỏe cột sống (Không có camera) */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                src={member.avatar} 
                alt={member.name} 
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/30 shadow-md"
              />
              <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                isAbsent ? 'bg-slate-400' : 'bg-emerald-500'
              }`} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                  {member.code}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {member.spineHealthStatus}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-amber-50 text-amber-800 border border-amber-200 font-mono">
                  {member.salaryBonusGrade || 'Hạng A+ (Xuất sắc)'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                <span className="font-semibold text-slate-700">{member.role}</span>
                <span>•</span>
                <span>{member.department}</span>
                <span>•</span>
                <span>Vị trí: <strong className="text-emerald-700">{member.workstation}</strong></span>
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

        {/* 2 Column Details: Tập trung 100% vào Hồ Sơ Sức Khỏe & Công Thái Học */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          
          {/* CỘT TRÁI: HỒ SƠ SINH TRẮC HỌC CỘT SỐNG & LỊCH SỬ TƯ THẾ (KHÔNG CÓ CAMERA) */}
          <div className="md:col-span-6 space-y-3.5">
            {/* Header cột trái: Trạng thái đi làm hôm nay */}
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4 text-emerald-600" />
                <span>Hồ Sơ Y Sinh Cột Sống & Điểm Danh</span>
              </span>

              {/* Trạng thái có mặt / vắng mặt giải quyết triệt để vấn đề nhân viên nghỉ làm */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border bg-slate-50">
                {isAbsent ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                    <span className="text-slate-600 font-medium">Hôm nay: Vắng mặt tại bàn</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-emerald-700 font-bold">Đang có mặt làm việc</span>
                  </>
                )}
              </div>
            </div>

            {/* Khối mô phỏng 3 vùng giải phẫu cột sống */}
            <div className="p-3.5 bg-gradient-to-br from-emerald-50/60 via-teal-50/40 to-white border border-emerald-200/80 rounded-2xl space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-[11px] font-bold text-emerald-950 uppercase tracking-wide">
                <span>Đánh Giá Y Sinh 3 Vùng Đốt Sống</span>
                <span className="font-mono text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                  Chuẩn ISO 9241
                </span>
              </div>

              <div className="space-y-2">
                {/* Vùng Cổ C1-C7 */}
                <div className="p-2.5 bg-white rounded-xl border border-emerald-100 shadow-2xs flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">Đốt Sống Cổ (C1 - C7)</div>
                      <div className="text-[10px] text-slate-500">Góc gập cổ tích lũy: {member.avgNeckAngle || '14°'}</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Chuẩn An Toàn (&lt; 20°)
                  </span>
                </div>

                {/* Vùng Lưng Ngực T1-T12 */}
                <div className="p-2.5 bg-white rounded-xl border border-emerald-100 shadow-2xs flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">Cột Sống Lưng Ngực (T-Spine)</div>
                      <div className="text-[10px] text-slate-500">Góc ngả tựa lưng: 98°</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Đạt Chuẩn (95°-105°)
                  </span>
                </div>

                {/* Vùng Thắt Lưng L1-L5 */}
                <div className="p-2.5 bg-white rounded-xl border border-emerald-100 shadow-2xs flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-500 shrink-0"></span>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">Khung Thắt Lưng (L1 - L5)</div>
                      <div className="text-[10px] text-slate-500">Tải trọng đĩa đệm phân bổ đều</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                    Giảm Tải 65%
                  </span>
                </div>
              </div>
            </div>

            {/* Biểu đồ diễn biến tư thế theo các mốc giờ làm việc */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-800 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Diễn Biến Điểm Tư Thế Theo Ca Làm Việc:</span>
                </span>
                <span className="text-slate-400 font-mono text-[10px]">Lịch sử ca gần nhất</span>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-1">
                {postureHistory.map((item, idx) => (
                  <div key={idx} className="p-2 bg-white border border-slate-200 rounded-xl text-center space-y-0.5 shadow-2xs">
                    <div className="text-[10px] text-slate-500 font-mono">{item.time}</div>
                    <div className="text-sm font-bold font-mono text-emerald-700">{item.score}đ</div>
                    <div className="text-[9px] text-emerald-600 font-medium">Tốt</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bảng 4 chỉ số góc sinh trắc học chuẩn */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 shadow-2xs">
                <div className="text-slate-500 text-[10px]">Góc đốt sống cổ C7:</div>
                <div className="font-bold text-emerald-700 text-sm">{member.avgNeckAngle || '14°'} <span className="text-[10px] text-slate-400 font-normal">(&lt; 20°)</span></div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 shadow-2xs">
                <div className="text-slate-500 text-[10px]">Góc ngả lưng T-Spine:</div>
                <div className="font-bold text-emerald-700 text-sm">98° <span className="text-[10px] text-slate-400 font-normal">(95°-105°)</span></div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 shadow-2xs">
                <div className="text-slate-500 text-[10px]">Cân bằng hai vai:</div>
                <div className="font-bold text-emerald-700 text-sm">Lệch 0.4cm <span className="text-[10px] text-slate-400 font-normal">(Tốt)</span></div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 shadow-2xs">
                <div className="text-slate-500 text-[10px]">Cự ly mắt - Màn hình:</div>
                <div className="font-bold text-amber-600 text-sm">62cm <span className="text-[10px] text-slate-400 font-normal">(50-70cm)</span></div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: HIỆU SUẤT LÀM VIỆC, PHÂN BỐ TƯ THẾ & KHUYẾN NGHỊ AI */}
          <div className="md:col-span-6 space-y-4">
            
            {/* KPI Summary: Công Thái Học, Giờ Làm Việc, Cảnh Báo Gù */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-[10px] text-slate-500 font-medium">Công Thái Học</div>
                <div className="text-xl font-extrabold text-emerald-600 font-mono mt-0.5">
                  {member.ergonomicsScore}/100
                </div>
                <div className="text-[9px] text-emerald-700 font-semibold">Mức Rất Tốt</div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-[10px] text-slate-500 font-medium">Giờ Làm Việc</div>
                <div className="text-base font-bold text-slate-800 font-mono mt-1">
                  {member.workHours?.day ? `${member.workHours.day.toFixed(1)} giờ` : member.focusTime}
                </div>
                <div className="text-[9px] text-slate-500">Ca: 8.0h</div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-[10px] text-slate-500 font-medium">Cảnh Báo Gù</div>
                <div className="text-xl font-extrabold text-rose-600 font-mono mt-0.5">
                  {member.warningsToday}
                </div>
                <div className="text-[9px] text-rose-600 font-semibold">Lần / Hôm nay</div>
              </div>
            </div>

            {/* Phân Bố Tư Thế Trong Ngày */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">Phân Bố Tư Thế Trong Ngày:</span>
                <span className="font-mono text-emerald-700 font-bold">{member.postureBreakdown?.good || 82}% Ngồi chuẩn</span>
              </div>

              {/* Progress bar */}
              <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden flex">
                <div 
                  className="bg-emerald-500 h-full" 
                  style={{ width: `${member.postureBreakdown?.good || 82}%` }} 
                  title="Ngồi chuẩn"
                />
                <div 
                  className="bg-rose-500 h-full" 
                  style={{ width: `${member.postureBreakdown?.slouching || 10}%` }} 
                  title="Gù lưng"
                />
                <div 
                  className="bg-amber-500 h-full" 
                  style={{ width: `${member.postureBreakdown?.leaning || 5}%` }} 
                  title="Vẹo cột sống"
                />
                <div 
                  className="bg-slate-400 h-full" 
                  style={{ width: `${member.postureBreakdown?.away || 8}%` }} 
                  title="Rời bàn"
                />
              </div>

              <div className="grid grid-cols-4 gap-1 text-[10px] text-center pt-1 font-mono font-medium">
                <div className="text-emerald-700">● Chuẩn ({member.postureBreakdown?.good || 82}%)</div>
                <div className="text-rose-600">● Gù ({member.postureBreakdown?.slouching || 10}%)</div>
                <div className="text-amber-600">● Lệch ({member.postureBreakdown?.leaning || 5}%)</div>
                <div className="text-slate-500">● Vắng ({member.postureBreakdown?.away || 8}%)</div>
              </div>
            </div>

            {/* Khuyến Nghị Cải Thiện Công Thái Học Cá Nhân Hóa */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-emerald-900 font-bold text-xs">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Khuyến Nghị Cải Thiện Công Thái Học Cá Nhân Hóa:</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                  Thưởng: {member.estimatedBonus || '5.000.000 đ'}
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {member.advice}
              </p>
              <div className="text-[11px] text-slate-500 pt-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Độ cao mặt bàn hiện tại 74cm phù hợp với vóc dáng của bạn.</span>
              </div>
            </div>

            {/* Nút Hành Động: Gửi Nhắc Nhở & Xuất Báo Cáo */}
            <div className="pt-1 flex items-center gap-3">
              <button
                onClick={handleSendReminder}
                disabled={sentAlert || isAbsent}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
              >
                {sentAlert ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Đã gửi nhắc nhở tới bàn!</span>
                  </>
                ) : isAbsent ? (
                  <>
                    <UserX className="w-4 h-4 text-slate-500" />
                    <span>Nhân Viên Đang Vắng Mặt Tại Bàn</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Gửi Nhắc Nhở Trực Tiếp Đến Màn Hình Bàn</span>
                  </>
                )}
              </button>

              <button
                onClick={() => showToast(`📄 Đang xuất & tải báo cáo phân tích tư thế cột sống của ${member.name} định dạng PDF!`)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200"
                title="Tải báo cáo PDF"
              >
                <Download className="w-4 h-4" />
                <span>Tải Báo Cáo PDF</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

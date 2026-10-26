import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Share2, 
  Sparkles, 
  Activity, 
  Layers, 
  ArrowUpRight, 
  Filter 
} from 'lucide-react';
import { SYSTEM_MODES } from '../data/mockData';

export default function ReportsView({ mode, members }) {
  const isEdu = mode === SYSTEM_MODES.EDUCATION;
  const [dateRange, setDateRange] = useState('7d');
  const [isExporting, setIsExporting] = useState(false);
  const [exportNotice, setExportNotice] = useState(false);

  const handleExport = (format) => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportNotice(true);
      setTimeout(() => setExportNotice(false), 3000);
    }, 1200);
  };

  const daysOfWeek = [
    { day: 'Thứ Hai', postureRate: 88, focusHours: 5.8, warnings: 12 },
    { day: 'Thứ Ba', postureRate: 85, focusHours: 5.5, warnings: 15 },
    { day: 'Thứ Tư', postureRate: 82, focusHours: 5.2, warnings: 18 },
    { day: 'Thứ Năm', postureRate: 79, focusHours: 4.9, warnings: 22 },
    { day: 'Thứ Sáu', postureRate: 74, focusHours: 4.6, warnings: 28 },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notice */}
      {exportNotice && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 p-4 bg-emerald-600 text-white rounded-xl shadow-2xl text-xs animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <div>
            <div className="font-bold">Xuất báo cáo thành công!</div>
            <div className="text-emerald-100">File báo cáo đã được kết xuất và sẵn sàng tải về.</div>
          </div>
        </div>
      )}

      {/* Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Phân Tích Dữ Liệu Năng Suất & Sức Khỏe AI
            </span>
            <span className="text-slate-500 text-xs">• Chuẩn Công Thái Học ISO 9241</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Báo Cáo Toàn Diện Về Tư Thế Ngồi & Hiệu Suất Tập Trung
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Phân tích tương quan giữa việc duy trì tư thế đúng và sự tăng trưởng chỉ số năng suất cá nhân & tập thể.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => handleExport('PDF')}
            disabled={isExporting}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Đang Tạo Báo Cáo...' : 'Tải Báo Cáo PDF'}</span>
          </button>
        </div>
      </div>

      {/* Date Filter Pills */}
      <div className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl text-xs shadow-xs">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-600" />
          <span className="text-slate-700 font-semibold">Khoảng thời gian phân tích:</span>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setDateRange('1d')}
            className={`px-3 py-1 rounded text-[11px] font-semibold transition-all ${
              dateRange === '1d' ? 'bg-emerald-600 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Hôm Nay
          </button>
          <button
            onClick={() => setDateRange('7d')}
            className={`px-3 py-1 rounded text-[11px] font-semibold transition-all ${
              dateRange === '7d' ? 'bg-emerald-600 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            7 Ngày Qua
          </button>
          <button
            onClick={() => setDateRange('30d')}
            className={`px-3 py-1 rounded text-[11px] font-semibold transition-all ${
              dateRange === '30d' ? 'bg-emerald-600 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            30 Ngày Qua
          </button>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Weekly Trend Bar Chart (8 Cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                Xu Hướng Công Thái Học & Giờ Tập Trung Theo Ngày Trong Tuần
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Quan sát tỷ lệ giảm tư thế chuẩn và gia tăng cảnh báo gù lưng về cuối tuần
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-3">
            {daysOfWeek.map((day, idx) => (
              <div key={idx} className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900">{day.day}</span>
                  <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px]">
                    <span className="text-emerald-700 font-bold">Chuẩn: {day.postureRate}%</span>
                    <span className="text-slate-700">Tập trung: {day.focusHours}h</span>
                    <span className="text-rose-600 font-semibold">Gù: {day.warnings} lần</span>
                  </div>
                </div>

                {/* Comparative bar */}
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex">
                  <div 
                    className="bg-emerald-500 h-full rounded-full" 
                    style={{ width: `${day.postureRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* AI Recommendation Quote */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
            <div className="flex items-center gap-2 text-emerald-800 font-bold">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>KẾT LUẬN TỪ MÔ HÌNH PHÂN TÍCH AI:</span>
            </div>
            <p className="leading-relaxed">
              Các cá nhân duy trì điểm công thái học trên 85 điểm đạt hiệu suất hoàn thành nhiệm vụ cao hơn <strong>26.4%</strong> và có tỷ lệ phàn nàn về đau mỏi cổ vai gáy thấp hơn <strong>74%</strong> so với nhóm có điểm dưới 70.
            </p>
          </div>
        </div>

        {/* Right 4 Cols */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              Lợi Ích Sức Khỏe Đo Lường Được
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="text-slate-600">Giảm triệu chứng đau vai gáy:</span>
                <span className="font-mono font-bold text-emerald-600 text-sm">- 42.5%</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="text-slate-600">Tăng thời lượng Deep Focus:</span>
                <span className="font-mono font-bold text-emerald-600 text-sm">+ 1.2 giờ/ngày</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="text-slate-600">Tỷ lệ tự chấn chỉnh sau chuông:</span>
                <span className="font-mono font-bold text-emerald-600 text-sm">88.2%</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="text-slate-600">Chỉ số hài lòng bàn ghế công thái:</span>
                <span className="font-mono font-bold text-emerald-700 text-sm">9.4 / 10</span>
              </div>
            </div>
          </div>

          {/* Ergonomic Quick Checklist Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Tiêu Chuẩn Thiết Lập Bàn Làm Việc / Học Tập:
            </h4>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Mép trên màn hình ngang hoặc thấp hơn tầm mắt 5cm.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Khoảng cách từ mắt tới màn hình từ 50cm đến 70cm (bằng 1 sải tay).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Khuỷu tay gập góc 90°-100° tựa thoải mái trên mặt bàn.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Bàn chân đặt bằng phẳng trên sàn, đầu gối ngang hoặc thấp hơn hông.</span>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}

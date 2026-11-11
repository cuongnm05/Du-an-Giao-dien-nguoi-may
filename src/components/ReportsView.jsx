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
  Filter,
  Search,
  UserCheck,
  Clock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ANNUAL_REPORT_METRICS, HOURLY_METRICS } from '../data/mockData';

export default function ReportsView({ members = [] }) {
  const [dateRange, setDateRange] = useState('year'); // 'day' | 'week' | 'month' | 'year'
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [searchEmployee, setSearchEmployee] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const [isExporting, setIsExporting] = useState(false);
  const [exportNotice, setExportNotice] = useState(false);

  const departments = ['ALL', ...new Set(members.map(m => m.department).filter(Boolean))];

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchEmployee.toLowerCase()) ||
                          m.code.toLowerCase().includes(searchEmployee.toLowerCase());
    const matchesDept = selectedDept === 'ALL' || m.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const totalPages = Math.ceil(filteredMembers.length / pageSize) || 1;
  const paginatedMembers = filteredMembers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportNotice(true);
      setTimeout(() => setExportNotice(false), 3000);
    }, 1200);
  };

  // Get period hours
  const getMemberHours = (mem) => {
    if (!mem.workHours) return '8.2h';
    if (dateRange === 'day') return `${mem.workHours.day.toFixed(1)}h`;
    if (dateRange === 'week') return `${mem.workHours.week}h`;
    if (dateRange === 'month') return `${mem.workHours.month}h`;
    return `${mem.workHours.year}h`;
  };

  return (
    <div className="space-y-3">
      {/* Toast Notice */}
      {exportNotice && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 p-4 bg-emerald-600 text-white rounded-xl shadow-2xl text-xs animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <div>
            <div className="font-bold">Xuất báo cáo thành công!</div>
            <div className="text-emerald-100">Báo cáo dữ liệu công thái học & năng suất đã được lưu.</div>
          </div>
        </div>
      )}

      {/* Toolbar Trực Tiếp: Chọn Mốc Thời Gian (Ngày, Tuần, Tháng, Năm) & Nút Xuất File */}
      <div className="p-3 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="font-semibold text-slate-500 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mốc Báo Cáo:</span>
          </span>

          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs font-medium">
            <button
              onClick={() => setDateRange('day')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                dateRange === 'day' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-slate-600'
              }`}
            >
              Ngày (Hôm Nay)
            </button>
            <button
              onClick={() => setDateRange('week')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                dateRange === 'week' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-slate-600'
              }`}
            >
              Tuần (7 Ngày)
            </button>
            <button
              onClick={() => setDateRange('month')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                dateRange === 'month' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-slate-600'
              }`}
            >
              Tháng (30 Ngày)
            </button>
            <button
              onClick={() => setDateRange('year')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                dateRange === 'year' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-slate-600'
              }`}
            >
              Cả Năm (12 Tháng)
            </button>
          </div>
        </div>

        <button
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-md shadow-emerald-600/20 transition-all shrink-0 w-full sm:w-auto"
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? 'Đang Xuất Báo Cáo...' : 'Xuất File Báo Cáo'}</span>
        </button>
      </div>

      {/* 4 Thống kê tổng hợp */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-white border border-slate-200 rounded-xl">
          <div className="text-[11px] text-slate-500">Điểm Tư Thế Trung Bình</div>
          <div className="text-lg font-bold text-emerald-600 font-mono mt-0.5">
            {dateRange === 'day' ? '92.4 / 100' : dateRange === 'week' ? '90.8 / 100' : dateRange === 'month' ? '91.2 / 100' : '91.4 / 100'}
          </div>
          <div className="text-[10px] text-emerald-600 mt-0.5">Đạt chuẩn công thái học ISO</div>
        </div>

        <div className="p-3 bg-white border border-slate-200 rounded-xl">
          <div className="text-[11px] text-slate-500">Tổng Giờ Làm Việc Ghi Nhận</div>
          <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
            {dateRange === 'day' ? '256 Giờ' : dateRange === 'week' ? '1,320 Giờ' : dateRange === 'month' ? '5,480 Giờ' : '58,420 Giờ'}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Trên {members.length} máy tính nhân viên</div>
        </div>

        <div className="p-3 bg-white border border-slate-200 rounded-xl">
          <div className="text-[11px] text-slate-500">Tỷ Lệ Giảm Thiểu Gù Cổ</div>
          <div className="text-lg font-bold text-teal-600 font-mono mt-0.5">-54%</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Nhờ chuông nhắc nhở AI</div>
        </div>

        <div className="p-3 bg-white border border-slate-200 rounded-xl">
          <div className="text-[11px] text-slate-500">Tổng Lương Thưởng Năng Suất</div>
          <div className="text-lg font-bold text-amber-600 font-mono mt-0.5">
            {dateRange === 'day' ? '3.8 Triệu đ' : dateRange === 'week' ? '24 Triệu đ' : dateRange === 'month' ? '95 Triệu đ' : '128 Triệu đ'}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Phân bổ cho nhân viên Top A/A+</div>
        </div>
      </div>

      {/* Biểu đồ xu hướng chuyên sâu (h-72 / h-80, có lưới Y-axis, cột kép so le trực quan) */}
      <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block">
              {dateRange === 'day' ? 'Biểu Đồ Tư Thế Theo Từng Khung Giờ Trong Ngày' :
               dateRange === 'week' ? 'Biểu Đồ Tư Thế 7 Ngày Trong Tuần' :
               dateRange === 'month' ? 'Biểu Đồ Tư Thế 4 Tuần Trong Tháng' :
               'Biểu Đồ Xu Hướng Tư Thế & Năng Suất 12 Tháng Trong Năm'}
            </span>
            <span className="text-[11px] text-slate-400">Phân tích song song điểm công thái học & thời lượng tập trung</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
              <span className="w-3 h-3 rounded bg-emerald-500"></span>
              <span>Điểm Tư Thế AI</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
              <span className="w-3 h-3 rounded bg-teal-400"></span>
              <span>Giờ Tập Trung</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 ml-1">
              TB Ngồi Chuẩn: 94.2%
            </span>
          </div>
        </div>

        {/* Biểu đồ có hệ trục tọa độ & đường lưới ngang Y-axis */}
        <div className="relative h-72 sm:h-80 w-full pt-4 pb-6 pl-10 pr-2">
          {/* Đường lưới Y-axis */}
          <div className="absolute inset-0 pl-10 pb-6 flex flex-col justify-between pointer-events-none text-[10px] font-mono text-slate-400">
            <div className="border-b border-slate-100 flex items-center justify-between">
              <span className="-ml-9">100%</span>
            </div>
            <div className="border-b border-slate-100 flex items-center justify-between">
              <span className="-ml-9">75%</span>
            </div>
            <div className="border-b border-slate-100 flex items-center justify-between">
              <span className="-ml-9">50%</span>
            </div>
            <div className="border-b border-slate-100 flex items-center justify-between">
              <span className="-ml-9">25%</span>
            </div>
            <div className="border-b border-slate-200 flex items-center justify-between">
              <span className="-ml-9">0%</span>
            </div>
          </div>

          {/* Cột dữ liệu so le cao nổi bật */}
          <div className="relative h-full w-full grid grid-cols-12 gap-1.5 sm:gap-3 items-end">
            {ANNUAL_REPORT_METRICS.map(item => {
              // Staggered calculation to ensure prominent alternating peaks
              const ergoHeight = Math.max(25, item.postureScore);
              const hoursRatio = Math.max(20, Math.round((item.focusHours / 185) * 92));

              return (
                <div key={item.month} className="flex flex-col items-center h-full justify-end group relative">
                  
                  {/* Tooltip on hover */}
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none shadow-lg">
                    Tháng {item.month}: <b>{item.postureScore}đ</b> • {item.focusHours}h
                  </div>

                  {/* Dual Bars Container */}
                  <div className="w-full flex items-end justify-center gap-1 h-full pb-1">
                    {/* Bar 1: Điểm tư thế (Emerald) */}
                    <div
                      style={{ height: `${ergoHeight}%` }}
                      className="w-1/2 max-w-[16px] bg-gradient-to-t from-emerald-600 via-emerald-500 to-teal-400 rounded-t-md transition-all group-hover:brightness-110 shadow-2xs"
                    ></div>

                    {/* Bar 2: Giờ làm việc (Teal) */}
                    <div
                      style={{ height: `${hoursRatio}%` }}
                      className="w-1/2 max-w-[16px] bg-gradient-to-t from-teal-500 to-cyan-300 rounded-t-md transition-all group-hover:brightness-110 shadow-2xs"
                    ></div>
                  </div>

                  <span className="text-[10px] font-bold text-slate-600 mt-1">{item.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bảng Báo Cáo Chi Tiết Từng Nhân Viên (Dạng Bảng Table Có Chỉ Số & Phân Trang Gọn Gàng) */}
      <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-1 border-b border-slate-100">
          <div>
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span>Bảng Chỉ Số Báo Cáo Nhân Sự ({filteredMembers.length} Nhân Viên)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </div>
            <div className="text-[11px] text-slate-500">
              Tổng hợp thời gian làm việc, điểm công thái học & xếp loại sức khỏe cột sống
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-44 sm:w-52">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="text"
                value={searchEmployee}
                onChange={(e) => {
                  setSearchEmployee(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Tìm tên, mã nhân viên..."
                className="w-full pl-7 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:bg-white focus:outline-none focus:border-emerald-500"
            >
              {departments.map(d => (
                <option key={d} value={d}>{d === 'ALL' ? 'Tất cả phòng ban' : d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Bảng Table Chỉ Số Chuẩn Nghiệp Vụ */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-3">Nhân Viên & Mã Số</th>
                <th className="py-2.5 px-3">Chức Danh & Phòng Ban</th>
                <th className="py-2.5 px-3 text-center">Thời Gian Làm Việc</th>
                <th className="py-2.5 px-3">Điểm Công Thái Học</th>
                <th className="py-2.5 px-3 text-center">Sức Khỏe Cột Sống</th>
                <th className="py-2.5 px-3 text-center">Cảnh Báo Gù</th>
                <th className="py-2.5 px-3 text-right">Xếp Hạng & Thưởng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedMembers.map((mem) => {
                const score = mem.ergonomicsScore;
                const isWarning = mem.spineHealthStatus === 'Cần cải thiện';

                return (
                  <tr key={mem.id} className="hover:bg-emerald-50/40 transition-colors group">
                    {/* Cột 1: Nhân viên & Mã NV */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <img src={mem.avatar} alt={mem.name} className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-200 shrink-0" />
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                            {mem.name}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {mem.code} • {mem.camId}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Cột 2: Phòng ban & Chức danh */}
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-800">{mem.role || 'Chuyên viên'}</div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[150px]">{mem.department}</div>
                    </td>

                    {/* Cột 3: Thời gian làm việc */}
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-800">
                      <div className="text-emerald-700 font-bold">{getMemberHours(mem)}</div>
                      <div className="text-[9px] text-slate-400 font-normal">
                        {dateRange === 'day' ? 'Ca hôm nay' : dateRange === 'week' ? 'Trong tuần' : dateRange === 'month' ? 'Trong tháng' : 'Cả năm'}
                      </div>
                    </td>

                    {/* Cột 4: Điểm Công Thái Học với Progress Bar Mini */}
                    <td className="py-2.5 px-3">
                      <div className="space-y-1 min-w-[100px]">
                        <div className="flex items-center justify-between font-mono font-bold text-xs">
                          <span className={score >= 85 ? 'text-emerald-700' : score >= 75 ? 'text-amber-700' : 'text-rose-700'}>
                            {score} / 100
                          </span>
                          <span className="text-[9px] text-slate-400">ISO</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${
                              score >= 85 ? 'bg-emerald-500' : score >= 75 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${score}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    {/* Cột 5: Đánh giá cột sống */}
                    <td className="py-2.5 px-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        mem.spineHealthStatus === 'Xuất sắc'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : mem.spineHealthStatus === 'Tốt'
                          ? 'bg-teal-50 text-teal-700 border border-teal-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isWarning ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                        <span>{mem.spineHealthStatus || 'Tốt'}</span>
                      </span>
                    </td>

                    {/* Cột 6: Cảnh báo gù */}
                    <td className="py-2.5 px-3 text-center">
                      {mem.warningsToday > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-bold font-mono text-[10px] border border-rose-200">
                          <AlertTriangle className="w-3 h-3 text-rose-500" />
                          <span>{mem.warningsToday} lần</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">0 lần</span>
                      )}
                    </td>

                    {/* Cột 7: Xếp hạng thưởng */}
                    <td className="py-2.5 px-3 text-right">
                      <div className="font-semibold text-slate-900 text-[11px]">{mem.salaryBonusGrade || 'Hạng A+'}</div>
                      <div className="text-[10px] font-mono text-emerald-600 font-bold">{mem.estimatedBonus}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Thanh Phân Trang Gọn Gàng (Không bị kéo dài màn hình) */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2.5 border-t border-slate-100 text-xs">
            <span className="text-slate-500">
              Hiển thị <strong>{(currentPage - 1) * pageSize + 1}</strong> - <strong>{Math.min(currentPage * pageSize, filteredMembers.length)}</strong> trên tổng số <strong>{filteredMembers.length}</strong> nhân viên
            </span>

            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 transition-colors"
                title="Trang trước"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded-lg font-mono font-bold text-xs transition-colors ${
                    currentPage === page
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 transition-colors"
                title="Trang tiếp"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

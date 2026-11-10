import React, { useState } from 'react';
import { 
  Trophy, 
  Award, 
  Medal, 
  Star, 
  TrendingUp, 
  DollarSign, 
  MessageSquare, 
  Send, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  UserCheck,
  ChevronRight,
  ShieldCheck,
  Flame,
  Clock,
  Edit3,
  Save,
  RotateCcw,
  ArrowUpDown
} from 'lucide-react';

export default function EmployeeRankingView({ members = [] }) {
  // Period filter: 'day' | 'week' | 'month' | 'year'
  const [period, setPeriod] = useState('month');
  
  // Evaluation Mode: 'ai_auto' | 'manual'
  const [evaluationMode, setEvaluationMode] = useState('ai_auto');

  const [employeeList, setEmployeeList] = useState(() => {
    return [...members].sort((a, b) => {
      const totalScoreA = (a.ergonomicsScore || 80) + (a.focusScore || 80);
      const totalScoreB = (b.ergonomicsScore || 80) + (b.focusScore || 80);
      return totalScoreB - totalScoreA;
    });
  });

  const [selectedMember, setSelectedMember] = useState(employeeList[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [sortBy, setSortBy] = useState('rank_asc');
  const [newCommentText, setNewCommentText] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Manual editing fields for selected member
  const [editBonusAmount, setEditBonusAmount] = useState('');
  const [editRank, setEditRank] = useState('');
  const [editGrade, setEditGrade] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const departments = ['ALL', ...new Set(employeeList.map(m => m.department).filter(Boolean))];

  const filteredList = employeeList.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emp.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emp.camId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'ALL' || emp.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const sortedAndFilteredList = [...filteredList].sort((a, b) => {
    if (sortBy === 'rank_asc') return (a.rank || 99) - (b.rank || 99);
    if (sortBy === 'rank_desc') return (b.rank || 99) - (a.rank || 99);
    if (sortBy === 'ergo_desc') return (b.ergonomicsScore || 0) - (a.ergonomicsScore || 0);
    if (sortBy === 'ergo_asc') return (a.ergonomicsScore || 0) - (b.ergonomicsScore || 0);
    if (sortBy === 'hours_desc') {
      const hA = a.workHours?.[period] || 0;
      const hB = b.workHours?.[period] || 0;
      return hB - hA;
    }
    if (sortBy === 'wpm_desc') {
      const wpmA = a.inputTelemetry?.wpm || 50;
      const wpmB = b.inputTelemetry?.wpm || 50;
      return wpmB - wpmA;
    }
    if (sortBy === 'bonus_desc') {
      const bonusA = a.customBonusAmount || 0;
      const bonusB = b.customBonusAmount || 0;
      return bonusB - bonusA;
    }
    return 0;
  });

  // Calculate work hours based on active period
  const getPeriodHours = (emp) => {
    if (!emp.workHours) return '8h';
    if (period === 'day') return `${emp.workHours.day.toFixed(1)} giờ / ngày`;
    if (period === 'week') return `${emp.workHours.week} giờ / tuần`;
    if (period === 'month') return `${emp.workHours.month} giờ / tháng`;
    return `${emp.workHours.year} giờ / năm`;
  };

  // Add Comment
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim() || !selectedMember) return;

    const newCmt = {
      id: `CMT-${Date.now()}`,
      author: 'Người Đánh Giá',
      time: 'Vừa xong',
      content: newCommentText.trim()
    };

    setEmployeeList(prev => prev.map(emp => {
      if (emp.id === selectedMember.id) {
        return {
          ...emp,
          managerComments: [newCmt, ...(emp.managerComments || [])]
        };
      }
      return emp;
    }));

    setSelectedMember(prev => ({
      ...prev,
      managerComments: [newCmt, ...(prev.managerComments || [])]
    }));

    setNewCommentText('');
    showToast(`Đã lưu ghi chú đánh giá cho ${selectedMember.name}!`);
  };

  // Manual save for employee rank & bonus
  const handleSaveManualEvaluation = () => {
    if (!selectedMember) return;

    setEmployeeList(prev => prev.map(emp => {
      if (emp.id === selectedMember.id) {
        return {
          ...emp,
          rank: editRank ? Number(editRank) : emp.rank,
          estimatedBonus: editBonusAmount ? `${Number(editBonusAmount).toLocaleString('vi-VN')} đ` : emp.estimatedBonus,
          salaryBonusGrade: editGrade || emp.salaryBonusGrade
        };
      }
      return emp;
    }));

    setSelectedMember(prev => ({
      ...prev,
      rank: editRank ? Number(editRank) : prev.rank,
      estimatedBonus: editBonusAmount ? `${Number(editBonusAmount).toLocaleString('vi-VN')} đ` : prev.estimatedBonus,
      salaryBonusGrade: editGrade || prev.salaryBonusGrade
    }));

    showToast(`Đã lưu mức lương thưởng và xếp hạng thủ công cho ${selectedMember.name}!`);
  };

  const handleRecalculateAiBonus = () => {
    showToast(`AI đang tổng hợp dữ liệu giờ làm việc và tư thế theo ${period === 'day' ? 'Ngày' : period === 'week' ? 'Tuần' : period === 'month' ? 'Tháng' : 'Năm'}... Đã cập nhật!`);
  };

  return (
    <div className="space-y-3">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-xl text-xs font-semibold animate-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Toolbar Trực Tiếp: Chọn Thời Gian (Ngày, Tuần, Tháng, Năm) & Chế Độ Đánh Giá */}
      <div className="p-3 bg-white border border-slate-200 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 text-xs shadow-xs">
        
        {/* Chọn mốc thời gian đánh giá: Ngày, Tuần, Tháng, Năm */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="font-semibold text-slate-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Thời gian:</span>
          </span>

          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl font-medium">
            <button
              onClick={() => setPeriod('day')}
              className={`px-3 py-1.5 rounded-lg transition-all ${period === 'day' ? 'bg-white font-bold text-slate-900 shadow-2xs' : 'text-slate-600'}`}
            >
              Hôm Nay (Ngày)
            </button>
            <button
              onClick={() => setPeriod('week')}
              className={`px-3 py-1.5 rounded-lg transition-all ${period === 'week' ? 'bg-white font-bold text-slate-900 shadow-2xs' : 'text-slate-600'}`}
            >
              Tuần Này
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`px-3 py-1.5 rounded-lg transition-all ${period === 'month' ? 'bg-white font-bold text-slate-900 shadow-2xs' : 'text-slate-600'}`}
            >
              Tháng Này
            </button>
            <button
              onClick={() => setPeriod('year')}
              className={`px-3 py-1.5 rounded-lg transition-all ${period === 'year' ? 'bg-white font-bold text-slate-900 shadow-2xs' : 'text-slate-600'}`}
            >
              Cả Năm
            </button>
          </div>
        </div>

        {/* Chế độ đánh giá: AI tự động vs Người dùng tự điều chỉnh */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl font-semibold">
            <button
              onClick={() => { setEvaluationMode('ai_auto'); showToast('Đã chuyển sang chế độ: AI Tự Động Xếp Hạng & Đánh Giá'); }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                evaluationMode === 'ai_auto' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Tự Động Xếp Hạng</span>
            </button>

            <button
              onClick={() => { setEvaluationMode('manual'); showToast('Đã bật chế độ: Người Dùng Tự Đánh Giá & Điều Chỉnh Thưởng'); }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                evaluationMode === 'manual' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Người Dùng Tự Đánh Giá</span>
            </button>
          </div>

          {evaluationMode === 'ai_auto' && (
            <button
              onClick={handleRecalculateAiBonus}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-all border border-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Tính Lại</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Layout: Danh sách xếp hạng bên trái + Chi tiết & Comment bên phải */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Cột trái (7 cols): List bảng xếp hạng */}
        <div className="lg:col-span-7 space-y-3">
          
          {/* Search, Sort Dropdown & Dept Filter */}
          <div className="p-3 bg-white border border-slate-200 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-2.5 text-xs shadow-xs">
            <div className="relative w-full md:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm nhân viên, mã NV..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <ArrowUpDown className="w-3.5 h-3.5 text-emerald-600" />
                <span>Sắp xếp:</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
              >
                <option value="rank_asc">🏆 Thứ hạng (Cao nhất đến thấp nhất)</option>
                <option value="rank_desc">🔻 Thứ hạng (Thấp nhất đến cao nhất)</option>
                <option value="ergo_desc">🧘 Điểm công thái học (Cao ➔ Thấp)</option>
                <option value="ergo_asc">⚠️ Điểm công thái học (Thấp ➔ Cao)</option>
                <option value="hours_desc">⏱️ Giờ làm việc (Nhiều nhất ➔ Ít nhất)</option>
                <option value="wpm_desc">⌨️ Tốc độ gõ phím & chuột (Nhanh nhất)</option>
                <option value="bonus_desc">💰 Mức thưởng (Cao nhất ➔ Thấp nhất)</option>
              </select>

              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
              >
                {departments.map(d => (
                  <option key={d} value={d}>{d === 'ALL' ? 'Tất cả phòng ban' : d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* List nhân viên */}
          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {sortedAndFilteredList.map((emp, index) => {
              const isSelected = selectedMember?.id === emp.id;
              const rank = emp.rank || index + 1;
              const isHighRank = rank <= 5;
              const isLowRank = rank > 25;

              return (
                <div
                  key={emp.id}
                  onClick={() => {
                    setSelectedMember(emp);
                    setEditRank(String(rank));
                    setEditBonusAmount(emp.customBonusAmount ? String(emp.customBonusAmount) : '3000000');
                    setEditGrade(emp.salaryBonusGrade || 'Hạng A');
                  }}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-500 shadow-sm ring-1 ring-emerald-400/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-7 h-7 rounded-xl font-mono text-xs font-bold flex items-center justify-center shrink-0 ${
                      rank === 1 ? 'bg-amber-100 text-amber-800' :
                      rank === 2 ? 'bg-slate-200 text-slate-800' :
                      rank === 3 ? 'bg-orange-100 text-orange-800' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      #{rank}
                    </span>

                    <img src={emp.avatar} alt={emp.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />

                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">{emp.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">{emp.code} • {emp.camId}</div>
                      <div className="text-[10px] text-emerald-700 font-mono font-medium truncate">
                        Thời gian làm: {getPeriodHours(emp)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 text-right">
                    <div>
                      <div className="text-xs font-mono font-bold text-slate-900">
                        {emp.ergonomicsScore}đ <span className="text-[10px] font-normal text-slate-500">tư thế</span>
                      </div>
                      <div className="text-[11px] font-bold text-emerald-700">
                        {emp.estimatedBonus}
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isHighRank 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : isLowRank 
                        ? 'bg-rose-100 text-rose-800' 
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {isHighRank ? 'Top Thưởng' : isLowRank ? 'Cần Cải Thiện' : 'Bình Thường'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Cột phải (5 cols): Chi tiết đánh giá, Chỉnh sửa thủ công & Comment */}
        <div className="lg:col-span-5 space-y-3">
          {selectedMember ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-4">
              
              {/* Profile Card */}
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <img src={selectedMember.avatar} alt={selectedMember.name} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/20" />
                <div>
                  <div className="text-sm font-bold text-slate-900">{selectedMember.name}</div>
                  <div className="text-xs text-slate-500">{selectedMember.role} • {selectedMember.code}</div>
                  <div className="text-[11px] text-emerald-700 font-mono font-medium">
                    Tổng giờ làm ({period === 'day' ? 'ngày' : period === 'week' ? 'tuần' : period === 'month' ? 'tháng' : 'năm'}): <strong>{getPeriodHours(selectedMember)}</strong>
                  </div>
                </div>
              </div>

              {/* KHU VỰC ĐIỀU CHỈNH THỦ CÔNG KHI CHỌN "NGƯỜI DÙNG TỰ ĐÁNH GIÁ" */}
              {evaluationMode === 'manual' ? (
                <div className="p-3.5 bg-amber-50/70 border border-amber-300 rounded-xl space-y-2.5 text-xs">
                  <div className="flex items-center justify-between font-bold text-amber-900">
                    <span className="flex items-center gap-1">
                      <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                      <span>Người Dùng Tự Đưa Ra Mức Thưởng & Thứ Hạng:</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-600 font-medium">Thứ Hạng (Rank):</label>
                      <input
                        type="number"
                        min="1"
                        max="32"
                        value={editRank}
                        onChange={(e) => setEditRank(e.target.value)}
                        placeholder="Thứ hạng (1-32)"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-600 font-medium">Phân Hạng (Grade):</label>
                      <select
                        value={editGrade}
                        onChange={(e) => setEditGrade(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      >
                        <option value="Hạng A+ (Xuất sắc)">Hạng A+ (Xuất sắc)</option>
                        <option value="Hạng A (Rất tốt)">Hạng A (Rất tốt)</option>
                        <option value="Hạng B (Khá)">Hạng B (Khá)</option>
                        <option value="Hạng C (Cần cải thiện)">Hạng C (Cần cải thiện)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-600 font-medium">Số Tiền Thưởng Thêm (VNĐ):</label>
                    <input
                      type="number"
                      step="500000"
                      value={editBonusAmount}
                      onChange={(e) => setEditBonusAmount(e.target.value)}
                      placeholder="Nhập số tiền thưởng (VNĐ)"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-xs"
                    />
                  </div>

                  <button
                    onClick={handleSaveManualEvaluation}
                    className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Lưu Mức Lương Thưởng Đã Điều Chỉnh</span>
                  </button>
                </div>
              ) : (
                /* CHẾ ĐỘ AI TỰ ĐỘNG */
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-emerald-900">Mức Lương / Thưởng Do AI Đề Xuất:</span>
                    <span className="font-bold text-emerald-700">{selectedMember.estimatedBonus}</span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Phân hạng: <strong className="text-slate-900">{selectedMember.salaryBonusGrade}</strong>
                  </div>
                  <div className="text-[10px] text-emerald-700 italic">
                    * AI tự động phân tích từ {getPeriodHours(selectedMember)} và tỷ lệ ngồi chuẩn {selectedMember.ergonomicsScore}%.
                  </div>
                </div>
              )}

              {/* Form Ghi Chú / Comment Đánh Giá Nhân Viên */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Ghi Chú Đánh Giá Về {selectedMember.name}:</span>
                </label>
                <form onSubmit={handleAddComment} className="space-y-2">
                  <textarea
                    rows={3}
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Nhập nhận xét, đánh giá thái độ làm việc và công thái học..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 resize-none"
                  ></textarea>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Lưu vào hồ sơ đánh giá</span>
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1 transition-all"
                    >
                      <Send className="w-3 h-3" />
                      <span>Lưu Ghi Chú Đánh Giá</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Lịch sử comment đánh giá đã có */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-700">Các đánh giá gần đây:</div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedMember.managerComments && selectedMember.managerComments.length > 0 ? (
                    selectedMember.managerComments.map((cmt) => (
                      <div key={cmt.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-800">{cmt.author}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{cmt.time}</span>
                        </div>
                        <p className="text-slate-600 text-[11px]">{cmt.content}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-xs text-slate-400">
                      Chưa có ghi chú nào cho nhân viên này.
                    </div>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200">
              Chọn một nhân viên từ danh sách để xem và ghi chú đánh giá.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

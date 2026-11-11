import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Flame, 
  Eye, 
  Activity, 
  UserPlus, 
  ShieldCheck, 
  ChevronRight, 
  TrendingUp, 
  Download 
} from 'lucide-react';

export default function MembersView({ 
  members = [], 
  onSelectMember, 
  onAddMember 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedHealthStatus, setSelectedHealthStatus] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const [newMemberData, setNewMemberData] = useState({
    name: '',
    code: `NV-2026${members.length + 1}`,
    department: 'Phòng Phát Triển Sản Phẩm (R&D)',
    role: 'Kỹ sư Phần mềm',
    workstation: `Tầng 3 - Bàn R&D-${members.length + 1}`,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    ergonomicsScore: 88,
    focusScore: 90,
    workHours: { day: 8.0, week: 40.0, month: 168, year: 2020 },
    focusTime: '5 giờ 10 phút',
    warningsToday: 1,
    currentPosture: 'good',
    currentPostureText: 'Tư thế chuẩn (Lưng thẳng 98°)',
    spineHealthStatus: 'Tốt',
    advice: 'Tư thế tốt, duy trì chiều cao ghế phù hợp.'
  });

  const departments = ['ALL', ...new Set(members.map(m => m.department).filter(Boolean))];

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (member.workstation && member.workstation.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDept = selectedDept === 'ALL' || member.department === selectedDept;
    const matchesHealth = selectedHealthStatus === 'ALL' || member.spineHealthStatus === selectedHealthStatus;
    return matchesSearch && matchesDept && matchesHealth;
  });

  const handleCreateMember = (e) => {
    e.preventDefault();
    if (!newMemberData.name.trim()) return;

    onAddMember({
      ...newMemberData,
      id: `MEM-${String(members.length + 1).padStart(2, '0')}`,
      camId: `PC-${String(members.length + 1).padStart(2, '0')}`,
      postureBreakdown: { good: 80, slouching: 10, leaning: 5, away: 5 },
      postureHistory: [
        { time: '08:00', score: 90 },
        { time: '11:00', score: 85 },
        { time: '14:00', score: 82 },
        { time: '16:00', score: 86 }
      ]
    });
    showToast(`✓ Đã thêm thành công hồ sơ nhân viên ${newMemberData.name} (${newMemberData.code})!`);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-xl text-xs font-semibold animate-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}
      
      {/* Thanh Công Cụ & Bộ Lọc Trực Tiếp (Không có ô văn bản giải thích thừa thãi) */}
      <div className="p-3 bg-white border border-slate-200 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 text-xs shadow-xs">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm theo tên, mã NV, bàn làm việc..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Filter dropdowns & Nút Thêm Nhân Viên Mới */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <Filter className="w-3.5 h-3.5 text-emerald-600" />
            <span>Lọc:</span>
          </div>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:bg-white focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">Tất cả Phòng ban</option>
            {departments.filter(d => d !== 'ALL').map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            value={selectedHealthStatus}
            onChange={(e) => setSelectedHealthStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:bg-white focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">Tất cả tình trạng cột sống</option>
            <option value="Xuất sắc">Xuất sắc</option>
            <option value="Tốt">Tốt</option>
            <option value="Cần cải thiện">Cần cải thiện</option>
          </select>

          {/* Nút Thêm Nhân Viên */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all ml-auto md:ml-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Thêm Nhân Viên Mới</span>
          </button>
        </div>
      </div>

      {/* Grid Danh Sách Nhân Viên */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredMembers.map(member => (
          <div
            key={member.id}
            onClick={() => onSelectMember(member)}
            className="bg-white border border-slate-200 hover:border-emerald-500 rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              {/* Header card */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100 group-hover:ring-emerald-500/30 transition-all"
                    />
                    <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                      member.status === 'online' ? 'bg-emerald-500' : 'bg-slate-400'
                    }`} />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                      {member.name}
                    </h3>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                      <span className="font-mono">{member.code}</span>
                      <span>•</span>
                      <span>{member.camId}</span>
                    </div>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  member.ergonomicsScore >= 85
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : member.ergonomicsScore >= 75
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {member.ergonomicsScore}/100đ
                </span>
              </div>

              {/* Thông tin phòng ban & bàn làm việc */}
              <div className="space-y-1.5 text-xs text-slate-600 mb-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Phòng ban:</span>
                  <span className="font-semibold text-slate-800 text-right truncate max-w-[180px]">{member.department}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Vị trí bàn:</span>
                  <span className="font-medium text-slate-700">{member.workstation}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Thời gian làm việc hôm nay:</span>
                  <span className="font-mono font-bold text-emerald-600">{member.workHours?.day ? `${member.workHours.day}h` : member.focusTime}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Cột sống: <strong className="text-slate-800">{member.spineHealthStatus}</strong></span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                <span>Xem chi tiết hồ sơ</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Thêm Nhân Viên Mới */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-900">Thêm Nhân Viên Mới</h4>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateMember} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Họ và tên nhân viên:</label>
                <input
                  type="text"
                  required
                  value={newMemberData.name}
                  onChange={(e) => setNewMemberData({ ...newMemberData, name: e.target.value })}
                  placeholder="Ví dụ: Hoàng Tuấn Anh"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mã nhân viên:</label>
                <input
                  type="text"
                  required
                  value={newMemberData.code}
                  onChange={(e) => setNewMemberData({ ...newMemberData, code: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phòng ban:</label>
                <select
                  value={newMemberData.department}
                  onChange={(e) => setNewMemberData({ ...newMemberData, department: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                >
                  <option>Phòng Phát Triển Sản Phẩm (R&D)</option>
                  <option>Phòng Marketing & Truyền Thông</option>
                  <option>Phòng Tài Chính Kế Toán</option>
                  <option>Phòng Thiết Kế UI/UX</option>
                  <option>Phòng Kinh Doanh & Bán Hàng</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Vị trí bàn làm việc:</label>
                <input
                  type="text"
                  required
                  value={newMemberData.workstation}
                  onChange={(e) => setNewMemberData({ ...newMemberData, workstation: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-xs"
                >
                  Lưu Nhân Viên
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

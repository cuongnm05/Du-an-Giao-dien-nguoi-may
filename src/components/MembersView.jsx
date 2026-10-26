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
import { SYSTEM_MODES } from '../data/mockData';

export default function MembersView({ 
  mode, 
  members, 
  onSelectMember, 
  onAddMember 
}) {
  const isEdu = mode === SYSTEM_MODES.EDUCATION;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedHealthStatus, setSelectedHealthStatus] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newMemberData, setNewMemberData] = useState({
    name: '',
    code: isEdu ? 'HS-12A1-20' : 'NV-202425',
    department: isEdu ? 'Khối 12 - Lớp 12A1' : 'Phòng Phát Triển Sản Phẩm (R&D)',
    role: isEdu ? 'Học sinh' : 'Lập trình viên',
    workstation: isEdu ? 'Bàn học B3-01' : 'Bàn R&D-08',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    ergonomicsScore: 85,
    focusScore: 88,
    focusTime: '4 giờ 30 phút',
    warningsToday: 0,
    currentPosture: 'good',
    currentPostureText: 'Tư thế chuẩn',
    spineHealthStatus: 'Tốt',
    advice: 'Tư thế tốt, duy trì chiều cao ghế phù hợp.'
  });

  const departments = ['ALL', ...new Set(members.map(m => m.department))];

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.workstation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'ALL' || member.department === selectedDept;
    const matchesHealth = selectedHealthStatus === 'ALL' || member.spineHealthStatus === selectedHealthStatus;
    return matchesSearch && matchesDept && matchesHealth;
  });

  const handleCreateMember = (e) => {
    e.preventDefault();
    onAddMember({
      ...newMemberData,
      id: `MEM-00${members.length + 1}`,
      postureBreakdown: { good: 80, slouching: 10, leaning: 5, away: 5 },
      postureHistory: [
        { time: '08:00', score: 90 },
        { time: '11:00', score: 85 },
        { time: '14:00', score: 82 },
        { time: '16:00', score: 86 }
      ]
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {isEdu ? 'Quản Lý Hồ Sơ Học Sinh' : 'Quản Lý Hồ Sơ Nhân Sự'}
            </span>
            <span className="text-slate-500 text-xs">• Theo Dõi Sức Khỏe Cột Sống & Năng Suất</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {isEdu ? 'Danh Sách Học Sinh & Đánh Giá Tư Thế Ngồi Học' : 'Danh Sách Nhân Viên & Đánh Giá Tư Thế Làm Việc'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Theo dõi chi tiết điểm số công thái học, thời gian tập trung làm việc và lịch sử cảnh báo theo từng cá nhân.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>{isEdu ? 'Thêm Học Sinh' : 'Thêm Nhân Viên'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 text-xs shadow-xs">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={isEdu ? 'Tìm theo tên, mã HS, bàn học...' : 'Tìm theo tên, mã NV, bàn làm việc...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <Filter className="w-3.5 h-3.5 text-emerald-600" />
            <span>Bộ lọc:</span>
          </div>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:bg-white focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">Tất cả {isEdu ? 'Lớp học' : 'Phòng ban'}</option>
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
            <option value="Trung bình">Trung bình</option>
            <option value="Cần cải thiện">Cần cải thiện</option>
          </select>
        </div>
      </div>

      {/* Grid of Members */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member) => {
          const isGood = member.ergonomicsScore >= 85;
          const isWarning = member.ergonomicsScore < 75;

          return (
            <div
              key={member.id}
              className="bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all group"
            >
              <div>
                {/* Header Card: Avatar & Name */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={member.avatar} 
                      alt={member.name} 
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-emerald-400 transition-all"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {member.name}
                      </h4>
                      <div className="text-[11px] text-slate-400 font-mono">{member.code}</div>
                      <div className="text-[11px] text-emerald-600 font-semibold">{member.role}</div>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    member.spineHealthStatus === 'Xuất sắc' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    member.spineHealthStatus === 'Tốt' ? 'bg-teal-50 text-teal-700 border border-teal-200' :
                    member.spineHealthStatus === 'Trung bình' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {member.spineHealthStatus}
                  </span>
                </div>

                {/* Workplace Info */}
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 mb-4 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>{isEdu ? 'Lớp học:' : 'Phòng ban:'}</span>
                    <span className="font-semibold text-slate-800">{member.department}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Vị trí / Bàn:</span>
                    <span className="font-mono text-emerald-700 font-semibold">{member.workstation}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Camera theo dõi:</span>
                    <span className="font-mono text-slate-700">{member.camId || 'Chưa gán'}</span>
                  </div>
                </div>

                {/* Real-time Posture Status Badge */}
                <div className="mb-4">
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                    Trạng thái tư thế thời gian thực:
                  </div>
                  <div className={`p-2 rounded-lg text-xs font-semibold flex items-center justify-between border ${
                    member.currentPosture === 'good'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : member.currentPosture === 'slouching'
                      ? 'bg-rose-50 border-rose-200 text-rose-800'
                      : member.currentPosture === 'leaning'
                      ? 'bg-amber-50 border-amber-200 text-amber-800'
                      : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}>
                    <span className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${
                        member.currentPosture === 'good' ? 'bg-emerald-500' :
                        member.currentPosture === 'slouching' ? 'bg-rose-500 animate-ping' :
                        member.currentPosture === 'leaning' ? 'bg-amber-500' : 'bg-slate-400'
                      }`} />
                      {member.currentPostureText}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">Góc cổ: {member.avgNeckAngle}</span>
                  </div>
                </div>

                {/* Score Indicators */}
                <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-slate-500 text-[11px] flex items-center gap-1">
                      <Activity className="w-3 h-3 text-emerald-600" /> Điểm Công Thái Học
                    </div>
                    <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                      {member.ergonomicsScore} <span className="text-xs text-slate-400">/100</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1 mt-1.5 overflow-hidden">
                      <div 
                        className={`h-1 rounded-full ${isGood ? 'bg-emerald-500' : isWarning ? 'bg-rose-500' : 'bg-amber-500'}`}
                        style={{ width: `${member.ergonomicsScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-slate-500 text-[11px] flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-500" /> Giờ Tập Trung Sâu
                    </div>
                    <div className="text-base font-bold text-slate-900 mt-1">
                      {member.focusTime}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      Cảnh báo hôm nay: <span className="font-mono text-rose-600 font-bold">{member.warningsToday}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectMember(member)}
                className="w-full py-2.5 px-3 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all border border-emerald-200 group-hover:shadow-md group-hover:shadow-emerald-600/20"
              >
                <Eye className="w-4 h-4 text-emerald-600 group-hover:text-white" />
                <span>Xem Phân Tích Cột Sống & Lịch Sử</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal Add Member */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                {isEdu ? 'Thêm Học Sinh Mới' : 'Thêm Nhân Viên Mới'}
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMember} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Họ Và Tên</label>
                <input 
                  type="text" 
                  value={newMemberData.name} 
                  onChange={e => setNewMemberData({ ...newMemberData, name: e.target.value })}
                  placeholder="Ví dụ: Lê Minh Trí"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">{isEdu ? 'Mã Học Sinh' : 'Mã Nhân Viên'}</label>
                  <input 
                    type="text" 
                    value={newMemberData.code} 
                    onChange={e => setNewMemberData({ ...newMemberData, code: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono"
                    required 
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">{isEdu ? 'Lớp Học' : 'Phòng Ban'}</label>
                  <input 
                    type="text" 
                    value={newMemberData.department} 
                    onChange={e => setNewMemberData({ ...newMemberData, department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">{isEdu ? 'Vai Trò' : 'Chức Danh'}</label>
                  <input 
                    type="text" 
                    value={newMemberData.role} 
                    onChange={e => setNewMemberData({ ...newMemberData, role: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                    required 
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Vị Trí / Bàn</label>
                  <input 
                    type="text" 
                    value={newMemberData.workstation} 
                    onChange={e => setNewMemberData({ ...newMemberData, workstation: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                    required 
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
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
                  Lưu Hồ Sơ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

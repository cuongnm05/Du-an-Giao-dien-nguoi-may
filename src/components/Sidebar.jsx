import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Camera, 
  BarChart3, 
  BellRing, 
  Settings, 
  ShieldCheck, 
  HelpCircle,
  Video,
  Flame,
  CheckCircle,
  Sliders
} from 'lucide-react';
import { SYSTEM_MODES } from '../data/mockData';

export default function Sidebar({ 
  currentTab, 
  setCurrentTab, 
  mode, 
  memberCount,
  cameraCount,
  alertCount 
}) {
  const isEdu = mode === SYSTEM_MODES.EDUCATION;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Tổng Quan & Giám Sát Live',
      icon: LayoutDashboard,
      badge: 'Live',
      badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    },
    {
      id: 'members',
      label: isEdu ? 'Quản Lý Học Sinh' : 'Quản Lý Nhân Viên',
      icon: Users,
      badge: memberCount ? `${memberCount}` : null,
      badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    },
    {
      id: 'cameras',
      label: 'Cài Đặt & Căn Chỉnh Camera',
      icon: Camera,
      badge: `${cameraCount} Cam`,
      badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    },
    {
      id: 'reports',
      label: 'Báo Cáo & Năng Suất',
      icon: BarChart3,
      badge: 'Phân tích',
      badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    },
    {
      id: 'alerts',
      label: 'Cấu Hình Cảnh Báo Tư Thế',
      icon: BellRing,
      badge: alertCount > 0 ? `${alertCount}` : null,
      badgeColor: 'bg-amber-50 text-amber-700 border border-amber-200'
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 hidden md:flex shadow-xs">
      {/* Navigation Links */}
      <div className="p-4 space-y-1.5">
        <div className="px-3 py-2 text-[11px] font-bold tracking-wider uppercase text-slate-400">
          Chức Năng Chính
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-white' : 'text-emerald-600 group-hover:text-emerald-700'
                }`} />
                <span className="text-left">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                  isActive ? 'bg-white/20 text-white' : item.badgeColor
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-4 px-3 py-2 text-[11px] font-bold tracking-wider uppercase text-slate-400">
          Trạng Thái Giám Sát
        </div>

        {/* Live System Specs Widget */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-600 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              Công thái học TB
            </span>
            <span className="font-bold text-emerald-700 font-mono">87.5 / 100</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '87.5%' }}></div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-slate-600 flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-emerald-600" />
              Camera Hoạt Động
            </span>
            <span className="font-bold text-slate-800 font-mono">{cameraCount - 1} / {cameraCount} Active</span>
          </div>

          <div className="flex items-center justify-between pt-1 text-[11px]">
            <span className="text-slate-600 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              Tỷ Lệ Tập Trung
            </span>
            <span className="font-semibold text-slate-800 font-mono">91.2%</span>
          </div>
        </div>
      </div>

      {/* Footer Info / Ergonomics Tip */}
      <div className="p-4 border-t border-slate-200">
        <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl">
          <div className="flex items-center gap-2 mb-1 text-emerald-800 font-semibold text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Quy Tắc 20-20-20 Dịu Mắt</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Mỗi 20 phút hãy nhìn xa 6 mét trong 20 giây và kéo thẳng đốt sống cổ để duy trì trạng thái thoải mái nhất.
          </p>
        </div>
      </div>
    </aside>
  );
}

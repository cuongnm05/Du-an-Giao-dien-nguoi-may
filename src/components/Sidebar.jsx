import React from 'react';
import { 
  LayoutDashboard, 
  LayoutGrid,
  Users, 
  Camera, 
  BarChart3, 
  BellRing, 
  Settings, 
  ShieldCheck, 
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Video,
  Flame,
  CheckCircle,
  Sliders,
  Sparkles
} from 'lucide-react';
import { SYSTEM_MODES } from '../data/mockData';

export default function Sidebar({ 
  currentTab, 
  setCurrentTab, 
  mode, 
  memberCount,
  cameraCount,
  alertCount,
  isCollapsed,
  onToggleCollapse
}) {
  const isEdu = mode === SYSTEM_MODES.EDUCATION;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Tổng Quan & Live',
      fullName: 'Tổng Quan & Giám Sát Live',
      icon: LayoutDashboard,
      badge: 'Live',
      badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    },
    {
      id: 'multicam',
      label: 'Đa Camera',
      fullName: 'Giám Sát Đa Camera (Video Wall)',
      icon: LayoutGrid,
      badge: `${cameraCount} Cam`,
      badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    },
    {
      id: 'members',
      label: isEdu ? 'Học Sinh' : 'Nhân Viên',
      fullName: isEdu ? 'Quản Lý Học Sinh' : 'Quản Lý Nhân Viên',
      icon: Users,
      badge: memberCount ? `${memberCount}` : null,
      badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    },
    {
      id: 'cameras',
      label: 'Máy Camera',
      fullName: 'Cài Đặt & Căn Chỉnh Camera',
      icon: Camera,
      badge: `${cameraCount}`,
      badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    },
    {
      id: 'reports',
      label: 'Báo Cáo',
      fullName: 'Báo Cáo & Năng Suất',
      icon: BarChart3,
      badge: 'AI',
      badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    },
    {
      id: 'alerts',
      label: 'Cảnh Báo',
      fullName: 'Cấu Hình Cảnh Báo Tư Thế',
      icon: BellRing,
      badge: alertCount > 0 ? `${alertCount}` : null,
      badgeColor: 'bg-amber-50 text-amber-700 border border-amber-200'
    }
  ];

  return (
    <aside 
      className={`bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 hidden md:flex transition-all duration-300 ease-in-out shadow-xs select-none h-full overflow-y-auto min-h-0 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Header Section of Sidebar: Toggle button + title */}
      <div>
        <div className={`p-4 border-b border-slate-100 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
                Menu Điều Hành
              </span>
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors border border-transparent hover:border-emerald-200"
            title={isCollapsed ? 'Mở rộng thanh menu (Ctrl+B)' : 'Thu gọn thanh menu (Ctrl+B)'}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-5 h-5 text-emerald-600" />
            ) : (
              <PanelLeftClose className="w-5 h-5 text-slate-500 hover:text-emerald-600" />
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <div className="p-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => setCurrentTab(item.id)}
                  className={`w-full flex items-center rounded-xl font-medium transition-all duration-200 ${
                    isCollapsed 
                      ? 'justify-center p-3' 
                      : 'justify-between px-3.5 py-2.5 text-xs'
                  } ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                    <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-emerald-600 group-hover:text-emerald-700'
                    }`} />
                    {!isCollapsed && (
                      <span className="text-left font-medium">{item.label}</span>
                    )}
                  </div>

                  {!isCollapsed && item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                      isActive ? 'bg-white/20 text-white' : item.badgeColor
                    }`}>
                      {item.badge}
                    </span>
                  )}

                  {/* Dot badge when collapsed */}
                  {isCollapsed && item.badge && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                  )}
                </button>

                {/* Floating Tooltip when collapsed */}
                {isCollapsed && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-150 z-50 flex items-center gap-2">
                    <span>{item.fullName}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500 text-white">
                        {item.badge}
                      </span>
                    )}
                    {/* Arrow */}
                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-slate-900"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Live System Specs Widget (Only when expanded) */}
        {!isCollapsed && (
          <div className="p-4 pt-1">
            <div className="p-3 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-2.5 text-xs">
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

              <div className="flex items-center justify-between pt-0.5">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-emerald-600" />
                  Camera Đang Bật
                </span>
                <span className="font-bold text-slate-800 font-mono">{cameraCount - 1} / {cameraCount} Cam</span>
              </div>

              <div className="flex items-center justify-between pt-0.5 text-[11px]">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  Tỷ Lệ Tập Trung
                </span>
                <span className="font-semibold text-slate-800 font-mono">91.2%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info / Ergonomics Tip */}
      <div className="p-3 border-t border-slate-100">
        {!isCollapsed ? (
          <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl">
            <div className="flex items-center gap-2 mb-1 text-emerald-800 font-semibold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Quy Tắc 20-20-20 Dịu Mắt</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Mỗi 20 phút hãy nhìn xa 6 mét trong 20 giây và kéo thẳng cột sống để thư giãn mắt và cơ thể.
            </p>
          </div>
        ) : (
          <div className="flex justify-center group relative">
            <button
              onClick={onToggleCollapse}
              className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
              title="Nhấn để mở rộng thanh menu"
            >
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </button>
            <div className="absolute left-full bottom-2 ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
              Quy tắc 20-20-20
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

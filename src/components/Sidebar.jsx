import React from 'react';
import { 
  LayoutDashboard, 
  LayoutGrid, 
  Users, 
  Camera, 
  BarChart3, 
  Trophy, 
  Monitor, 
  ChevronLeft, 
  ChevronRight, 
  PanelLeftClose, 
  PanelLeftOpen, 
  Sparkles,
  Calendar,
  Brain,
  Repeat,
  Globe,
  Film
} from 'lucide-react';
import { SYSTEM_MODES } from '../data/mockData';

export default function Sidebar({ 
  currentTab, 
  setCurrentTab, 
  mode, 
  setMode,
  memberCount = 32,
  cameraCount = 32,
  isCollapsed, 
  onToggleCollapse 
}) {
  const isPersonal = mode === SYSTEM_MODES.PERSONAL;

  // Enterprise navigation items (Loại bỏ chữ >30 máy)
  const enterpriseNavItems = [
    {
      id: 'dashboard',
      label: 'Tổng Quan & Live',
      fullName: 'Tổng Quan & Live',
      icon: LayoutDashboard,
      badge: 'Live',
      badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    },
    {
      id: 'multicam',
      label: 'Tất Cả Camera',
      fullName: 'Xem Tất Cả Camera',
      icon: LayoutGrid,
      badge: `${cameraCount}`,
      badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    },
    {
      id: 'members',
      label: 'Nhân Viên',
      fullName: 'Quản Lý Hồ Sơ Nhân Viên',
      icon: Users,
      badge: `${memberCount}`,
      badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    },
    {
      id: 'rankings',
      label: 'Xếp Hạng & Đánh Giá',
      fullName: 'Tự Đánh Giá & Xếp Hạng Nhân Viên',
      icon: Trophy,
      badge: 'Top',
      badgeColor: 'bg-amber-50 text-amber-700 border border-amber-200'
    },
    {
      id: 'recordings',
      label: 'Dữ Liệu & Bản Ghi',
      fullName: 'Dữ Liệu Video Camera & Màn Hình Ghi Lại',
      icon: Film,
      badge: 'Video',
      badgeColor: 'bg-teal-50 text-teal-700 border border-teal-200'
    },
    {
      id: 'reports',
      label: 'Báo Cáo',
      fullName: 'Báo Cáo & Thống Kê Chi Tiết',
      icon: BarChart3,
      badge: 'AI',
      badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    },
    {
      id: 'cameras',
      label: 'Cài Đặt Camera',
      fullName: 'Cài Đặt & Cấu Hình Camera AI',
      icon: Camera,
      badge: 'Gộp',
      badgeColor: 'bg-purple-50 text-purple-700 border border-purple-200'
    }
  ];

  // Personal navigation items (Hiển thị đầy đủ ở thanh menu bên trái giống với doanh nghiệp)
  const personalNavItems = [
    {
      id: 'personal_desk',
      label: 'Bàn Làm Việc & Cam',
      fullName: 'Bàn Làm Việc & Camera AI Cá Nhân',
      icon: Camera,
      badge: 'Live',
      badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    },
    {
      id: 'personal_timetable',
      label: 'Thời Khóa Biểu',
      fullName: 'Thời Khóa Biểu & Lịch Trình',
      icon: Calendar,
      badge: 'Lịch',
      badgeColor: 'bg-blue-50 text-blue-700 border border-blue-200'
    },
    {
      id: 'personal_assistant',
      label: 'Trợ Lý Nhắc Việc',
      fullName: 'Trợ Lý Chống Trì Hoãn Real-Time',
      icon: Brain,
      badge: 'AI',
      badgeColor: 'bg-purple-50 text-purple-700 border border-purple-200'
    },
    {
      id: 'personal_rankings',
      label: 'Xếp Hạng Toàn Cầu',
      fullName: 'Bảng Xếp Hạng Người Dùng Toàn Cầu',
      icon: Globe,
      badge: 'Rank',
      badgeColor: 'bg-amber-50 text-amber-700 border border-amber-200'
    },
    {
      id: 'personal_recordings',
      label: 'Dữ Liệu & Bản Ghi',
      fullName: 'Video Bản Ghi Camera & Màn Hình',
      icon: Film,
      badge: 'Video',
      badgeColor: 'bg-teal-50 text-teal-700 border border-teal-200'
    },
    {
      id: 'personal_reports',
      label: 'Báo Cáo Sức Khỏe',
      fullName: 'Báo Cáo Tư Thế & Thời Gian Làm',
      icon: BarChart3,
      badge: 'Thống kê',
      badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    },
    {
      id: 'personal_cameras',
      label: 'Cài Đặt Camera',
      fullName: 'Cài Đặt Camera AI & Lịch Trình',
      icon: Camera,
      badge: 'Cấu hình',
      badgeColor: 'bg-slate-100 text-slate-700 border border-slate-200'
    }
  ];

  const currentNavItems = isPersonal ? personalNavItems : enterpriseNavItems;

  return (
    <aside 
      className={`bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 hidden md:flex transition-all duration-300 ease-in-out shadow-xs select-none h-full overflow-y-auto min-h-0 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Header Section of Sidebar */}
      <div>
        <div className={`p-4 border-b border-slate-100 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
                {isPersonal ? 'Menu Cá Nhân' : 'Menu Doanh Nghiệp'}
              </span>
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title={isCollapsed ? "Mở rộng sidebar (Ctrl+B)" : "Thu gọn sidebar (Ctrl+B)"}
          >
            {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1.5">
          {currentNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id || (isPersonal && item.id === 'personal_desk' && currentTab === 'dashboard');

            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative ${
                  isActive
                    ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
                title={isCollapsed ? item.fullName : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600'}`} />

                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between text-left">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                        isActive ? 'bg-white/20 text-white' : item.badgeColor
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}

                {isCollapsed && item.badge && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500"></span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Session info badge at Bottom of Sidebar */}
      {!isCollapsed && (
        <div className="p-3 border-t border-slate-100">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-slate-800 truncate">
                {isPersonal ? 'Chế Độ Cá Nhân' : 'Chế Độ Doanh Nghiệp'}
              </div>
              <div className="text-[10px] text-slate-400 truncate">Phiên làm việc bảo mật</div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

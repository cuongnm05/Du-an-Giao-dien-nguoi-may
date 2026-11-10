import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Activity, 
  Bell, 
  Building2, 
  User, 
  Cpu, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  X,
  LogOut,
  Users,
  ChevronDown,
  Repeat
} from 'lucide-react';
import { SYSTEM_MODES } from '../data/mockData';

export default function Header({ 
  mode, 
  setMode, 
  alerts = [], 
  onSelectAlert,
  onOpenQuickCam,
  currentUser,
  onOpenAuthModal,
  onLogout
}) {
  const [time, setTime] = useState(new Date().toLocaleTimeString('vi-VN'));
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [unreadAlerts, setUnreadAlerts] = useState(alerts);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('vi-VN'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadCount = unreadAlerts.filter(a => !a.resolved).length;

  const markAllRead = () => {
    setUnreadAlerts(prev => prev.map(a => ({ ...a, resolved: true })));
  };

  const isPersonal = mode === SYSTEM_MODES.PERSONAL;

  return (
    <header className="sticky top-0 z-30 shrink-0 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 sm:px-6 py-2.5 transition-colors shadow-xs">
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        
        {/* Left: Brand Logo (Loại bỏ Pro v2.4 như yêu cầu) */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 p-0.5 shadow-md shadow-emerald-600/20">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <Camera className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                AI PoseVision
              </h1>
            </div>
            <p className="text-[11px] text-slate-500 hidden lg:block">
              Hệ Thống Đánh Giá Năng Suất & Tư Thế Ngồi Thông Minh Qua Camera AI
            </p>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* AI Engine Status Badge */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-medium">
            <Cpu className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>AI AGENT: ONLINE</span>
            <span className="w-1 h-1 rounded-full bg-emerald-600"></span>
            <span>30 FPS</span>
          </div>

          {/* Clock Display */}
          <div className="hidden sm:block text-right font-mono text-xs text-slate-600 px-2.5 py-1 bg-slate-100 rounded-md border border-slate-200">
            {time}
          </div>

          {/* Quick Setup Camera Button */}
          <button
            onClick={onOpenQuickCam}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-all shadow-md shadow-emerald-600/20"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span className="hidden sm:inline">Cài Đặt Camera</span>
            <span className="sm:hidden">Cài Cam</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
              title="Thông báo cảnh báo"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-md shadow-rose-500/40">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Cảnh báo gần đây ({unreadCount})
                    </span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
                    >
                      Đánh dấu đã đọc
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2">
                  {unreadAlerts.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-xs">
                      Không có cảnh báo nào.
                    </div>
                  ) : (
                    unreadAlerts.map(alert => (
                      <div
                        key={alert.id}
                        onClick={() => {
                          if (onSelectAlert) onSelectAlert(alert);
                          setShowNotifications(false);
                        }}
                        className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                          alert.severity === 'high'
                            ? 'bg-rose-50 border-rose-200 hover:bg-rose-100/70 text-rose-900'
                            : 'bg-amber-50 border-amber-200 hover:bg-amber-100/70 text-amber-900'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-slate-900">{alert.memberName}</span>
                          <span className="text-[10px] font-mono text-slate-500">{alert.time}</span>
                        </div>
                        <p className="line-clamp-2 text-slate-600">{alert.title}</p>
                        <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
                          <span>{alert.camId}</span>
                          <span className="text-emerald-600 font-medium">Bấm để xử lý &rarr;</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown: Đổi vai trò, Thêm tài khoản khác, Đăng xuất */}
          <div className="relative pl-1 border-l border-slate-200">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center font-bold text-white text-xs ring-2 ring-emerald-500/20 shadow-xs">
                {isPersonal ? 'CN' : 'DN'}
              </div>
              <div className="hidden lg:block text-left text-xs">
                <div className="font-semibold text-slate-900 leading-tight">
                  {currentUser?.name || (isPersonal ? 'Nguyễn Văn Cường' : 'Admin Doanh Nghiệp')}
                </div>
                <div className="text-[10px] text-slate-500">
                  {isPersonal ? 'Người Dùng Cá Nhân' : 'Tổ Chức / Doanh Nghiệp'}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Menu Dropdown Tài Khoản */}
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl mb-1.5">
                  <div className="font-bold text-slate-900">{currentUser?.name || (isPersonal ? 'Nguyễn Văn Cường' : 'Admin Doanh Nghiệp')}</div>
                  <div className="text-[11px] text-slate-500">{currentUser?.email || (isPersonal ? 'cuong.workspace@gmail.com' : 'admin.enterprise@company.com')}</div>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {isPersonal ? 'Chế độ: Cá Nhân' : 'Chế độ: Doanh Nghiệp'}
                  </span>
                </div>

                {/* Thêm / Chuyển tài khoản khác */}
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    if (onOpenAuthModal) onOpenAuthModal();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors font-medium text-left"
                >
                  <Users className="w-4 h-4 text-slate-500" />
                  <span>Thêm / Đổi tài khoản khác</span>
                </button>

                {/* Đăng xuất */}
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors font-medium text-left mt-1 pt-2 border-t border-slate-100"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Đăng xuất / Về màn hình đăng nhập</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}

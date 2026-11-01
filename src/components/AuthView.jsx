import React, { useState } from 'react';
import { 
  Building2, 
  User, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  Camera, 
  Sparkles, 
  ChevronRight, 
  Users, 
  KeyRound, 
  PlusCircle, 
  Home, 
  RotateCcw,
  Check,
  AlertCircle
} from 'lucide-react';
import { SYSTEM_MODES } from '../data/mockData';

export default function AuthView({ 
  onLoginSuccess, 
  onGoHome, 
  initialRole = SYSTEM_MODES.ENTERPRISE 
}) {
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [authStep, setAuthStep] = useState('login'); // 'login' | 'register' | 'forgot' | 'accounts'
  const [showPassword, setShowPassword] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [forgotStep, setForgotStep] = useState(1); // 1: email, 2: otp, 3: success

  // Saved accounts mock
  const [savedAccounts, setSavedAccounts] = useState([
    {
      id: 'acc-1',
      name: 'Admin Giám Sát',
      email: 'admin.enterprise@company.com',
      role: SYSTEM_MODES.ENTERPRISE,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      tag: 'Tổ chức / Doanh nghiệp'
    },
    {
      id: 'acc-2',
      name: 'Nguyễn Văn Cường',
      email: 'cuong.workspace@gmail.com',
      role: SYSTEM_MODES.PERSONAL,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      tag: 'Cá nhân (Work from home)'
    }
  ]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const userRole = selectedRole;
    const userEmail = email.trim() || (userRole === SYSTEM_MODES.ENTERPRISE ? 'admin.enterprise@company.com' : 'user.personal@gmail.com');
    const userName = fullName.trim() || (userRole === SYSTEM_MODES.ENTERPRISE ? 'Quản Trị Doanh Nghiệp' : 'Người Dùng Cá Nhân');

    showToast(`Đăng nhập thành công với vai trò ${userRole === SYSTEM_MODES.ENTERPRISE ? 'Doanh Nghiệp' : 'Cá Nhân'}!`);
    setTimeout(() => {
      onLoginSuccess({
        email: userEmail,
        name: userName,
        role: userRole
      });
    }, 600);
  };

  const handleGoogleAuth = () => {
    showToast(`Đã liên kết tài khoản Google thành công! Đang chuyển hướng...`);
    setTimeout(() => {
      onLoginSuccess({
        email: selectedRole === SYSTEM_MODES.ENTERPRISE ? 'enterprise.google@company.com' : 'personal.google@gmail.com',
        name: selectedRole === SYSTEM_MODES.ENTERPRISE ? 'Enterprise Admin (Google)' : 'Personal User (Google)',
        role: selectedRole
      });
    }, 700);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    showToast(`Đăng ký tài khoản thành công! Tự động đăng nhập với vai trò ${selectedRole === SYSTEM_MODES.ENTERPRISE ? 'Doanh nghiệp' : 'Cá nhân'}.`);
    setTimeout(() => {
      onLoginSuccess({
        email: email || 'newuser@system.ai',
        name: fullName || 'Thành Viên Mới',
        role: selectedRole
      });
    }, 700);
  };

  const handleSelectSavedAccount = (acc) => {
    setSelectedRole(acc.role);
    showToast(`Đã chọn tài khoản: ${acc.name}`);
    setTimeout(() => {
      onLoginSuccess(acc);
    }, 500);
  };

  return (
    <div className="min-h-screen w-screen bg-slate-50 flex flex-col justify-between font-sans text-slate-800">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-xl text-xs font-semibold animate-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="px-6 py-4 border-b border-slate-200/80 bg-white/80 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-md shadow-emerald-600/20 flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <Camera className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              AI PoseVision
            </h1>
            <p className="text-[11px] text-slate-500">Hệ Thống Đánh Giá Tư Thế & Năng Suất Thông Minh</p>
          </div>
        </div>

        {/* Nút Trang Chủ điều hướng ngay đến giao diện chính */}
        <button
          onClick={() => onGoHome(selectedRole)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all shadow-2xs hover:text-emerald-700"
        >
          <Home className="w-4 h-4 text-emerald-600" />
          <span>Vào Trang Chủ ({selectedRole === SYSTEM_MODES.ENTERPRISE ? 'Doanh Nghiệp' : 'Cá Nhân'})</span>
        </button>
      </header>

      {/* Main Form Center Box */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-xl bg-white border border-slate-200/80 rounded-3xl shadow-xl shadow-slate-200/50 p-6 sm:p-8">
          
          {/* Phân Quyền Người Dùng (Doanh nghiệp / Cá nhân) */}
          <div className="mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Option 1: Doanh nghiệp */}
              <button
                type="button"
                onClick={() => setSelectedRole(SYSTEM_MODES.ENTERPRISE)}
                className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                  selectedRole === SYSTEM_MODES.ENTERPRISE
                    ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-xl ${selectedRole === SYSTEM_MODES.ENTERPRISE ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <Building2 className="w-5 h-5" />
                  </div>
                  {selectedRole === SYSTEM_MODES.ENTERPRISE && (
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">Doanh Nghiệp / Tổ Chức</div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Giám sát máy tính nhân viên, xếp hạng năng suất, quản lý tiến trình.
                  </p>
                </div>
              </button>

              {/* Option 2: Cá nhân */}
              <button
                type="button"
                onClick={() => setSelectedRole(SYSTEM_MODES.PERSONAL)}
                className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                  selectedRole === SYSTEM_MODES.PERSONAL
                    ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-xl ${selectedRole === SYSTEM_MODES.PERSONAL ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <User className="w-5 h-5" />
                  </div>
                  {selectedRole === SYSTEM_MODES.PERSONAL && (
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">Người Dùng Cá Nhân</div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Theo dõi tư thế bản thân, thời khóa biểu công việc, trợ lý AI chống trì hoãn real-time.
                  </p>
                </div>
              </button>

            </div>
          </div>

          {/* Tab Switcher: Đăng nhập / Đăng ký / Tài khoản đã lưu */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-5 text-xs font-semibold">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setAuthStep('login')}
                className={`pb-1 transition-all ${authStep === 'login' ? 'text-emerald-600 border-b-2 border-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Đăng Nhập
              </button>
              <button
                onClick={() => setAuthStep('register')}
                className={`pb-1 transition-all ${authStep === 'register' ? 'text-emerald-600 border-b-2 border-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Đăng Ký Tài Khoản
              </button>
            </div>
            
            <button
              onClick={() => setAuthStep('accounts')}
              className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-emerald-600 transition-colors"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Chuyển / Thêm tài khoản</span>
            </button>
          </div>

          {/* NỘI DUNG FORM: ĐĂNG NHẬP */}
          {authStep === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              
              {/* Social Login Buttons: Google & Email Fast */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 transition-all shadow-2xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Đăng nhập với Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEmail(selectedRole === SYSTEM_MODES.ENTERPRISE ? 'admin.enterprise@company.com' : 'user.personal@gmail.com');
                    setPassword('123456');
                    showToast('Đã điền tài khoản mẫu demo!');
                  }}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 transition-all shadow-2xs"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Điền tài khoản mẫu demo</span>
                </button>
              </div>

              <div className="flex items-center my-3">
                <div className="flex-1 border-t border-slate-200"></div>
                <span className="px-3 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">hoặc email</span>
                <div className="flex-1 border-t border-slate-200"></div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Địa chỉ Email:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={selectedRole === SYSTEM_MODES.ENTERPRISE ? 'admin.enterprise@company.com' : 'user.personal@gmail.com'}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Mật khẩu:
                  </label>
                  <button
                    type="button"
                    onClick={() => setAuthStep('forgot')}
                    className="text-[11px] text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 absolute right-3 top-2.5"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember checkbox */}
              <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" defaultChecked className="rounded text-emerald-600 focus:ring-emerald-500" />
                  <span>Ghi nhớ phiên đăng nhập trên máy này</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 mt-2"
              >
                <span>Đăng Nhập Vào Giao Diện {selectedRole === SYSTEM_MODES.ENTERPRISE ? 'Doanh Nghiệp' : 'Cá Nhân'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* NỘI DUNG FORM: ĐĂNG KÝ */}
          {authStep === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Họ và Tên:
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Địa chỉ Email:
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mật khẩu:
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nhập lại mật khẩu:
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Xác nhận mật khẩu"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 transition-all mt-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Đăng ký nhanh với Google</span>
              </button>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 mt-3"
              >
                <span>Tạo Tài Khoản & Bắt Đầu Sử Dụng</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* NỘI DUNG FORM: QUÊN MẬT KHẨU */}
          {authStep === 'forgot' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
                <KeyRound className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Khôi phục mật khẩu tài khoản</div>
                  <div className="text-amber-800 text-[11px] mt-0.5">
                    Hệ thống sẽ gửi mã xác thực gồm 6 chữ số tới hòm thư email của bạn.
                  </div>
                </div>
              </div>

              {forgotStep === 1 && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nhập email cần đặt lại mật khẩu:
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      showToast('Đã gửi mã xác nhận 6 số đến email của bạn!');
                      setForgotStep(2);
                    }}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs shadow-xs"
                  >
                    Gửi Mã Xác Thực (OTP)
                  </button>
                </div>
              )}

              {forgotStep === 2 && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nhập mã OTP (6 chữ số):
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="123456"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono text-center tracking-widest text-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mật khẩu mới:
                    </label>
                    <input
                      type="password"
                      placeholder="Nhập mật khẩu mới"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      showToast('Đã đặt lại mật khẩu thành công! Vui lòng đăng nhập.');
                      setForgotStep(1);
                      setAuthStep('login');
                    }}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs shadow-xs"
                  >
                    Xác Nhận & Cập Nhật Mật Khẩu
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => setAuthStep('login')}
                className="w-full py-2 text-center text-xs text-slate-500 hover:text-slate-800"
              >
                &larr; Quay lại màn hình Đăng Nhập
              </button>
            </div>
          )}

          {/* NỘI DUNG: CHUYỂN / THÊM TÀI KHOẢN KHÁC */}
          {authStep === 'accounts' && (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-600 mb-1">
                Chọn tài khoản đã đăng nhập trước đó:
              </div>

              {savedAccounts.map(acc => (
                <div
                  key={acc.id}
                  onClick={() => handleSelectSavedAccount(acc)}
                  className="p-3 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img src={acc.avatar} alt={acc.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/20" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{acc.name}</div>
                      <div className="text-[11px] text-slate-500">{acc.email}</div>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                        {acc.tag}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              ))}

              {/* Nút thêm tài khoản khác */}
              <button
                onClick={() => {
                  setAuthStep('login');
                  setEmail('');
                  setPassword('');
                  showToast('Vui lòng nhập thông tin tài khoản mới');
                }}
                className="w-full py-3 px-4 rounded-2xl border-2 border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/30 text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center justify-center gap-2 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Thêm Tài Khoản Khác Mới</span>
              </button>

              <button
                type="button"
                onClick={() => setAuthStep('login')}
                className="w-full py-2 text-center text-xs text-slate-500 hover:text-slate-800"
              >
                &larr; Quay lại
              </button>
            </div>
          )}

          {/* Quick Home Direct Access */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Khám phá ngay không cần đăng nhập:</span>
            <button
              onClick={() => onGoHome(selectedRole)}
              className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline flex items-center gap-1"
            >
              <span>Vào thẳng {selectedRole === SYSTEM_MODES.ENTERPRISE ? 'Doanh Nghiệp' : 'Cá Nhân'} &rarr;</span>
            </button>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-slate-400">
        AI PoseVision © 2026 • Nền tảng Giám Sát Công Thái Học & Năng Suất Thông Minh
      </footer>

    </div>
  );
}


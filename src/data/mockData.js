// Dữ liệu mô phỏng cho Hệ Thống AI Đánh Giá Tư Thế & Năng Suất Làm Việc

export const SYSTEM_MODES = {
  ENTERPRISE: 'enterprise',
  PERSONAL: 'personal',
};

// Danh sách hình ảnh webcam nhân viên đa dạng, không bị trùng lặp
export const DIVERSE_WEBCAM_IMAGES = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534751516642-a171edd2521d?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1548142813-c348350df52b?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573497491765-dccce02b29df?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&auto=format&fit=crop&q=80'
];

// Hình ảnh mô phỏng theo từng trạng thái cụ thể
export const BEHAVIOR_IMAGES = {
  good: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=700&auto=format&fit=crop&q=80',
  slouching: '/cctv/cam_slouch.jpg',
  leaning: '/cctv/cam_lean.jpg',
  phone: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=700&auto=format&fit=crop&q=80',
  sleeping: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=700&auto=format&fit=crop&q=80',
  movie: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=700&auto=format&fit=crop&q=80',
  distracted: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=700&auto=format&fit=crop&q=80',
  away: null, // Bàn làm việc trống
  cam_off: null, // Camera tắt
  pc_off: null // Máy tắt
};

// Danh sách ảnh chụp màn hình máy tính mô phỏng cho Luồng Cam Màn Hình (Screen Stream)
export const SCREEN_STREAM_IMAGES = {
  vscode: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
  figma: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80',
  excel: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
  youtube: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&auto=format&fit=crop&q=80',
  social: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
  shopee: 'https://images.unsplash.com/photo-1556742049-0a67e557224e?w=800&auto=format&fit=crop&q=80',
  analytics: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
  terminal: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&auto=format&fit=crop&q=80'
};

// 32 máy trạm của doanh nghiệp với đầy đủ 3 luồng giám sát: Cam ngoài, Cam màn hình, Bàn phím & Chuột
export const INITIAL_CAMERAS = Array.from({ length: 32 }, (_, i) => {
  const index = i + 1;
  const padIndex = String(index).padStart(2, '0');
  const departments = [
    'Phòng Phát Triển Sản Phẩm (R&D)',
    'Phòng Marketing & Truyền Thông',
    'Phòng Tài Chính Kế Toán',
    'Phòng Thiết Kế UI/UX',
    'Phòng Kinh Doanh & Bán Hàng',
    'Phòng Kỹ Thuật Hệ Thống & DevOps'
  ];
  const dept = departments[i % departments.length];
  const locations = [
    `Tầng 3 - Bàn R&D-${padIndex}`,
    `Tầng 2 - Bàn MKT-${padIndex}`,
    `Tầng 2 - Bàn KT-${padIndex}`,
    `Tầng 4 - Bàn Design-${padIndex}`,
    `Tầng 1 - Bàn Sales-${padIndex}`,
    `Tầng 3 - Bàn Tech-${padIndex}`
  ];

  const employeeNames = [
    'Nguyễn Văn Cường', 'Trần Thị Mai', 'Lê Hoàng Nam', 'Vũ Thảo Linh',
    'Đỗ Hải Yến', 'Phạm Đức Anh', 'Nguyễn Thu Trang', 'Hoàng Gia Bảo',
    'Bùi Khánh Linh', 'Đặng Quốc Huy', 'Trịnh Phương Thảo', 'Lý Tuấn Kiệt',
    'Ngô Bảo Châu', 'Dương Minh Quân', 'Võ Thị Bích', 'Phan Văn Hùng',
    'Lương Ánh Tuyết', 'Hồ Công Thành', 'Tạ Ngọc Ánh', 'Trương Vĩnh Kỳ',
    'Đỗ Trọng Nhân', 'Bạch Hồng Đăng', 'Nguyễn Kiều Oanh', 'Lê Khắc Tiệp',
    'Trần Thanh Phong', 'Phạm Quỳnh Nga', 'Hoàng Minh Tuấn', 'Vũ Nhật Anh',
    'Đinh Tiến Dũng', 'Lê Thùy Dung', 'Mai Văn Phát', 'Chu Thảo Nhi'
  ];

  const postures = ['good', 'good', 'slouching', 'good', 'phone', 'leaning', 'away', 'sleeping'];
  const posture = postures[i % postures.length];

  // Chi tiết luồng màn hình
  const isViolation = posture === 'phone' || posture === 'slouching' || (i % 7 === 0);
  const screenProcesses = [
    { title: 'Visual Studio Code - Frontend Core [App.jsx]', process: 'code.exe', img: SCREEN_STREAM_IMAGES.vscode, category: 'Lập trình', isViolating: false },
    { title: 'Figma Desktop - Hệ Thống Thiết Kế UI v2.4', process: 'figma.exe', img: SCREEN_STREAM_IMAGES.figma, category: 'Thiết kế', isViolating: false },
    { title: 'Microsoft Excel - Bảng Cân Đối Kế Toán Q4', process: 'excel.exe', img: SCREEN_STREAM_IMAGES.excel, category: 'Văn phòng', isViolating: false },
    { title: 'Google Chrome - YouTube 4K: Nhạc Trẻ Remix', process: 'chrome.exe', img: SCREEN_STREAM_IMAGES.youtube, category: 'Giải trí', isViolating: true },
    { title: 'Google Chrome - Facebook: Bảng Tin Mạng Xã Hội', process: 'chrome.exe', img: SCREEN_STREAM_IMAGES.social, category: 'Mạng xã hội', isViolating: true },
    { title: 'Shopee Desktop - Săn Sale Giảm Giá 50%', process: 'browser.exe', img: SCREEN_STREAM_IMAGES.shopee, category: 'Mua sắm', isViolating: true },
    { title: 'Grafana & Datadog - Giám Sát Máy Chủ Hệ Thống', process: 'chrome.exe', img: SCREEN_STREAM_IMAGES.analytics, category: 'Hệ thống', isViolating: false },
    { title: 'Terminal Ubuntu - Docker Deploy Pipeline', process: 'bash.exe', img: SCREEN_STREAM_IMAGES.terminal, category: 'DevOps', isViolating: false }
  ];
  const screenInfo = isViolation 
    ? (i % 2 === 0 ? screenProcesses[3] : screenProcesses[4]) 
    : screenProcesses[i % screenProcesses.length];

  // Dữ liệu đo lường Bàn phím & Chuột
  const isIdle = posture === 'away' || posture === 'sleeping';
  const inputTelemetry = {
    wpm: isIdle ? 0 : posture === 'phone' ? 12 : 45 + (i * 3 % 40), // Words Per Minute
    kps: isIdle ? 0.0 : posture === 'phone' ? 0.8 : Number((2.5 + (i * 0.3 % 4)).toFixed(1)), // Keys Per Second
    totalKeystrokesToday: isIdle ? 1800 : 8500 + (i * 450),
    mouseCpm: isIdle ? 0 : 15 + (i * 2 % 35), // Clicks Per Minute
    totalClicksToday: isIdle ? 420 : 2100 + (i * 120),
    mouseMovementPercent: isIdle ? 0 : 55 + (i * 4 % 40), // % di chuyển chuột
    idleDurationSec: isIdle ? 340 + (i * 30) : (i % 5 === 0 ? 45 : 8),
    inputStatus: isIdle ? 'idle' : (posture === 'phone' ? 'low_activity' : 'active_typing'),
    recentKeys: ['A', 'Ctrl', 'Shift', 'Enter', 'C', 'V', 'Space', 'Tab', 'Esc'],
    lastInputTime: isIdle ? 'Cách đây 8 phút' : 'Vừa xong (0.5s)'
  };

  return {
    id: `PC-${padIndex}`,
    name: `Máy Trạm ${padIndex} - ${employeeNames[i]}`,
    ip: `192.168.1.${100 + index}:554/rtsp`,
    type: 'Webcam AI Full HD, Screen Agent & Input Tracker',
    angle: 'front',
    location: locations[i % locations.length],
    room: dept,
    department: dept,
    status: posture === 'away' ? 'away' : posture === 'sleeping' ? 'warning' : 'online',
    fps: 30,
    resolution: '1080p @ 30fps',
    assignedTo: employeeNames[i],
    role: i % 4 === 0 ? 'Senior Specialist' : i % 3 === 0 ? 'Team Lead' : 'Chuyên viên',
    webcamUrl: DIVERSE_WEBCAM_IMAGES[i % DIVERSE_WEBCAM_IMAGES.length],
    lastCalibration: '2026-11-01 08:30',
    slouchThresholdSec: 60,
    sensitivity: 85,
    distanceCm: 55 + (i % 15),
    neckAngleLimit: 25,
    
    // 3 Luồng giám sát chi tiết
    screenStream: {
      screenUrl: screenInfo.img,
      activeWindow: screenInfo.title,
      processName: screenInfo.process,
      category: screenInfo.category,
      isViolation: screenInfo.isViolating,
      resolution: '1920x1080 @ 30fps',
      fps: 30,
      cpuUsage: isIdle ? '2%' : `${15 + (i % 30)}%`,
      ramUsage: `${2.1 + (i % 4) * 0.8} GB`
    },
    inputTelemetry: inputTelemetry,
    
    activeProcess: screenInfo.title,
    isProcessViolating: screenInfo.isViolating,
    currentPosture: posture,
    screenRecorded: true,
    mouseKeyboardActive: !isIdle,
    aiPostureCheck: true,
    aiWorkDetection: true,
  };
});

// Danh sách 32 nhân viên kèm số thời gian làm việc theo Ngày, Tuần, Tháng, Năm
export const INITIAL_MEMBERS = INITIAL_CAMERAS.map((cam, i) => {
  const padIndex = String(i + 1).padStart(2, '0');
  const posture = cam.currentPosture;

  const baseScore = posture === 'good' ? 90 + (i % 8) : posture === 'slouching' ? 70 + (i % 8) : 76 + (i % 6);
  const baseFocus = posture === 'good' ? 92 + (i % 6) : 72 + (i % 10);

  // Dữ liệu thời gian làm việc theo Ngày, Tuần, Tháng, Năm
  const workHours = {
    day: 7.5 + ((i % 4) * 0.4), // Giờ làm việc trong ngày (ví dụ 8.2h)
    week: 38 + (i % 8),         // Giờ trong tuần (ví dụ 42h)
    month: 160 + (i * 2),       // Giờ trong tháng (ví dụ 172h)
    year: 1920 + (i * 15)       // Giờ trong năm (ví dụ 2,050h)
  };

  return {
    id: `MEM-${padIndex}`,
    name: cam.assignedTo,
    code: `NV-2026${padIndex}`,
    department: cam.department,
    role: cam.role,
    avatar: cam.webcamUrl,
    camId: cam.id,
    workstation: cam.location,
    status: cam.status,
    currentPosture: posture,
    currentPostureText: posture === 'good' ? 'Tư thế chuẩn (Lưng thẳng 98°)' : posture === 'slouching' ? 'Gù lưng / Rướn cổ sát màn hình' : posture === 'leaning' ? 'Lệch vai / Nghiêng cột sống' : posture === 'phone' ? 'Đang bấm điện thoại riêng' : posture === 'sleeping' ? 'Ngủ gật tại bàn làm việc' : 'Rời khỏi bàn làm việc',
    ergonomicsScore: baseScore,
    focusScore: baseFocus,
    workHours: workHours,
    focusTime: `${Math.floor(workHours.day)} giờ ${Math.round((workHours.day % 1) * 60)} phút`,
    warningsToday: posture === 'good' ? i % 3 : 5 + (i % 6),
    avgNeckAngle: `${14 + (i % 12)}°`,
    salaryBonusGrade: baseScore >= 90 ? 'Hạng A+ (Xuất sắc)' : baseScore >= 80 ? 'Hạng B (Tốt)' : 'Hạng C (Cần cải thiện)',
    customBonusAmount: baseScore >= 90 ? 5000000 : baseScore >= 80 ? 2500000 : 0,
    estimatedBonus: baseScore >= 90 ? '5,000,000 đ' : baseScore >= 80 ? '2,500,000 đ' : '0 đ',
    rank: i + 1,
    inputTelemetry: cam.inputTelemetry,
    screenStream: cam.screenStream,
    spineHealthStatus: baseScore >= 88 ? 'Xuất sắc' : baseScore >= 78 ? 'Tốt' : 'Cần cải thiện',
    advice: baseScore >= 88 ? 'Duy trì chiều cao màn hình rất chuẩn.' : 'Cần chú ý không rướn cổ gần màn hình khi làm việc kéo dài.',
    managerComments: [
      {
        id: `CMT-${i}-1`,
        author: 'Ban Giám Sát',
        time: 'Hôm qua 16:30',
        content: baseScore >= 85 ? 'Duy trì tư thế làm việc rất tốt, tiến trình mở chuẩn công việc.' : 'Cần chú ý không rướn cổ gần màn hình khi làm việc kéo dài.'
      }
    ],
    postureBreakdown: { 
      good: posture === 'good' ? 82 : 55, 
      slouching: posture === 'slouching' ? 30 : 10, 
      leaning: posture === 'leaning' ? 25 : 5, 
      away: 8 
    },
    postureHistory: [
      { time: '08:00', score: 92 },
      { time: '10:00', score: baseScore + 2 },
      { time: '14:00', score: baseScore - 3 },
      { time: '16:00', score: baseScore }
    ],
    annualSummary: {
      totalWorkHours: workHours.year,
      avgErgonomicsYear: baseScore - (i % 4),
      avgFocusYear: baseFocus - (i % 3),
      healthGrade: baseScore >= 85 ? 'Tốt - Cột sống ổn định' : 'Cần can thiệp công thái học',
      topMonth: 'Tháng 8 (96/100)'
    }
  };
});

// Cảnh báo thời gian thực gần đây
export const RECENT_ALERTS = [
  {
    id: 'ALT-101',
    time: '17:02:15',
    memberId: 'MEM-03',
    memberName: 'Lê Hoàng Nam',
    camId: 'PC-03',
    type: 'slouching',
    severity: 'high',
    title: 'Phát hiện gù lưng rướn cổ liên tục 120s',
    resolved: false
  },
  {
    id: 'ALT-102',
    time: '16:55:40',
    memberId: 'MEM-05',
    memberName: 'Đỗ Hải Yến',
    camId: 'PC-05',
    type: 'phone',
    severity: 'high',
    title: 'Phát hiện đang bấm điện thoại chơi game trong giờ',
    resolved: false
  },
  {
    id: 'ALT-103',
    time: '16:48:10',
    memberId: 'MEM-08',
    memberName: 'Hoàng Gia Bảo',
    camId: 'PC-08',
    type: 'sleeping',
    severity: 'medium',
    title: 'Phát hiện ngủ gật gục đầu tại bàn làm việc',
    resolved: false
  }
];

// Tiến trình cấm & cho phép
export const INITIAL_PROCESS_RULES = {
  blacklist: [
    { id: 'BL-1', name: 'Facebook.com / App', processName: 'chrome.exe (facebook)', category: 'Mạng xã hội', action: 'Chặn & Cảnh báo', enabled: true },
    { id: 'BL-2', name: 'Tiktok / Video giải trí', processName: 'tiktok.exe / web', category: 'Giải trí', action: 'Chặn & Đóng tức thì', enabled: true },
    { id: 'BL-3', name: 'Steam / Epic Games Client', processName: 'steam.exe', category: 'Game', action: 'Chặn hoàn toàn', enabled: true },
    { id: 'BL-4', name: 'Shopee / Lazada Săn sale', processName: 'chrome.exe (shopping)', category: 'Mua sắm', action: 'Ghi nhật ký vi phạm', enabled: true },
    { id: 'BL-5', name: 'Netflix / Xem phim', processName: 'netflix.exe', category: 'Phim ảnh', action: 'Chặn & Báo cáo', enabled: true }
  ],
  whitelist: [
    { id: 'WL-1', name: 'Visual Studio Code', processName: 'code.exe', category: 'Lập trình', enabled: true },
    { id: 'WL-2', name: 'Figma Desktop', processName: 'figma.exe', category: 'Thiết kế UI/UX', enabled: true },
    { id: 'WL-3', name: 'Microsoft Teams & Slack', processName: 'teams.exe, slack.exe', category: 'Giao tiếp công việc', enabled: true },
    { id: 'WL-4', name: 'Microsoft Office 365 (Word/Excel)', processName: 'excel.exe, winword.exe', category: 'Văn phòng', enabled: true },
    { id: 'WL-5', name: 'Jira / Confluence Browser', processName: 'atlassian.net', category: 'Quản trị dự án', enabled: true }
  ]
};

// DỮ LIỆU VIDEO BẢN GHI: VIDEO CAMERA BÀN LÀM VIỆC & VIDEO MÀN HÌNH MÁY TÍNH
export const MOCK_VIDEO_RECORDINGS = [
  {
    id: 'VID-001',
    camId: 'PC-01',
    memberName: 'Nguyễn Văn Cường',
    time: 'Hôm nay, 16:30 - 16:45',
    duration: '15:00',
    title: 'Video màn hình: Tiến trình lập trình giao diện React',
    type: 'screen_video',
    status: 'compliant',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-41315-large.mp4',
    description: 'Video quay lại toàn bộ màn hình máy tính nhân viên đang code chức năng frontend, không mở ứng dụng ngoài.',
    postureAtCapture: 'Lưng thẳng 98°'
  },
  {
    id: 'VID-002',
    camId: 'PC-03',
    memberName: 'Lê Hoàng Nam',
    time: 'Hôm nay, 15:40 - 15:52',
    duration: '12:00',
    title: 'Video camera: Phát hiện rướn cổ & gù lưng liên tục',
    type: 'camera_video',
    status: 'warning',
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-working-with-laptop-in-an-office-42777-large.mp4',
    description: 'Video trích xuất từ camera góc bàn làm việc quay lại khoảnh khắc nhân viên rướn cổ sát màn hình 30cm.',
    postureAtCapture: 'Gù lưng 32°'
  },
  {
    id: 'VID-003',
    camId: 'PC-07',
    memberName: 'Nguyễn Thu Trang',
    time: 'Hôm nay, 14:15 - 14:25',
    duration: '10:00',
    title: 'Video màn hình: Phát hiện lướt tab mua sắm Shopee',
    type: 'screen_video',
    status: 'violation',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-working-on-his-laptop-308-large.mp4',
    description: 'Video màn hình ghi nhận nhân viên chuyển tab sang trang mua sắm trong giờ làm việc chính thức.',
    postureAtCapture: 'Mất tập trung'
  },
  {
    id: 'VID-004',
    camId: 'PC-05',
    memberName: 'Đỗ Hải Yến',
    time: 'Hôm nay, 11:10 - 11:20',
    duration: '10:00',
    title: 'Video camera: Phát hiện nhân viên bấm điện thoại',
    type: 'camera_video',
    status: 'violation',
    thumbnail: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-using-a-smartphone-at-her-office-desk-43340-large.mp4',
    description: 'Video ghi nhận nhân viên cầm smartphone chơi game dưới gầm bàn trong hơn 8 phút.',
    postureAtCapture: 'Dùng điện thoại'
  },
  {
    id: 'VID-005',
    camId: 'PC-04',
    memberName: 'Vũ Thảo Linh',
    time: 'Hôm nay, 09:30 - 10:00',
    duration: '30:00',
    title: 'Video màn hình: Thiết kế hệ thống UI Design System',
    type: 'screen_video',
    status: 'compliant',
    thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-graphic-designer-working-on-computer-screen-41314-large.mp4',
    description: 'Video màn hình quay lại quá trình nhân viên thiết kế giao diện Figma chuyên nghiệp.',
    postureAtCapture: 'Tư thế chuẩn'
  },
  {
    id: 'VID-006',
    camId: 'PC-08',
    memberName: 'Hoàng Gia Bảo',
    time: 'Hôm nay, 08:45 - 09:00',
    duration: '15:00',
    title: 'Video camera: Phát hiện gục đầu ngủ gật tại bàn',
    type: 'camera_video',
    status: 'warning',
    thumbnail: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tired-business-man-sleeping-on-office-desk-42774-large.mp4',
    description: 'Video camera quay lại dấu hiệu mệt mỏi và ngủ gật trên bàn phím trong giờ làm việc buổi sáng.',
    postureAtCapture: 'Ngủ gật tại bàn'
  }
];

// Thời khóa biểu / Lịch trình công việc cho giao diện Cá nhân
export const INITIAL_PERSONAL_TIMETABLE = [
  {
    id: 'TT-01',
    time: '08:00 - 09:30',
    title: 'Check Email & Lập Kế Hoạch Ngày',
    category: 'planning',
    status: 'completed',
    targetApp: 'Outlook / Notion',
    note: 'Ưu tiên giải quyết các đầu việc tồn đọng trước 9h'
  },
  {
    id: 'TT-02',
    time: '09:30 - 11:30',
    title: 'Deep Work: Lập Trình Tính Năng Mới',
    category: 'deepwork',
    status: 'in_progress',
    targetApp: 'VS Code & Chrome DevTools',
    note: 'Tập trung cao độ, không mở mạng xã hội, giữ lưng thẳng 90-100°'
  },
  {
    id: 'TT-03',
    time: '11:30 - 12:00',
    title: 'Giãn Cơ Cột Sống & Vận Động Nhẹ',
    category: 'break',
    status: 'upcoming',
    targetApp: 'Nhắc nhở công thái học',
    note: 'Uống 300ml nước, đi bộ 5 phút, tập bài tập cổ vai gáy'
  },
  {
    id: 'TT-04',
    time: '13:30 - 15:30',
    title: 'Xử Lý Task & Review Code Nhóm',
    category: 'deepwork',
    status: 'upcoming',
    targetApp: 'GitHub & Slack Team',
    note: 'Cảnh báo tự động nếu lướt video hoặc sao nhãng quá 2 phút'
  },
  {
    id: 'TT-05',
    time: '15:30 - 16:30',
    title: 'Họp Trao Đổi Kỹ Thuật (Online Sync)',
    category: 'meeting',
    status: 'upcoming',
    targetApp: 'Google Meet',
    note: 'Giữ khoảng cách mắt cách webcam 60cm'
  },
  {
    id: 'TT-06',
    time: '16:30 - 17:30',
    title: 'Tổng Kết Báo Cáo Ngày & Viết Log',
    category: 'planning',
    status: 'upcoming',
    targetApp: 'Jira Software',
    note: 'Xem lại điểm số tư thế và năng suất cả ngày'
  }
];

// BẢNG XẾP HẠNG CHO GIAO DIỆN CÁ NHÂN (Thế Giới, Quốc Gia, Tỉnh/Thành Phố với 32+ người dùng)
export const GLOBAL_PERSONAL_RANKINGS = [
  {
    id: 'USR-GLOBAL-01',
    rank: 1,
    name: 'Nguyễn Văn Cường (Bạn)',
    country: 'Việt Nam',
    city: 'Hà Nội',
    location: 'Hà Nội, Việt Nam',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    workHours: { day: 8.5, week: 43.5, month: 178, year: 2140 },
    ergonomicsScore: 97,
    focusScore: 96,
    wpm: 68,
    streakDays: 45,
    tier: 'Kim Cương',
    badge: 'Bậc Thầy Công Thái Học'
  },
  {
    id: 'USR-GLOBAL-02',
    rank: 2,
    name: 'Kenji Takahashi',
    country: 'Nhật Bản',
    city: 'Tokyo',
    location: 'Tokyo, Nhật Bản',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    workHours: { day: 8.4, week: 43.0, month: 175, year: 2110 },
    ergonomicsScore: 96,
    focusScore: 95,
    wpm: 64,
    streakDays: 42,
    tier: 'Kim Cương',
    badge: 'Kỷ Luật Thép'
  },
  {
    id: 'USR-GLOBAL-03',
    rank: 3,
    name: 'Trần Thị Thu Thảo',
    country: 'Việt Nam',
    city: 'Đà Nẵng',
    location: 'Đà Nẵng, Việt Nam',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    workHours: { day: 8.2, week: 42.0, month: 172, year: 2080 },
    ergonomicsScore: 95,
    focusScore: 94,
    wpm: 62,
    streakDays: 38,
    tier: 'Kim Cương',
    badge: 'Chuyên Gia Deep Work'
  },
  {
    id: 'USR-GLOBAL-04',
    rank: 4,
    name: 'Marcus Vance',
    country: 'Anh Quốc',
    city: 'London',
    location: 'London, Anh Quốc',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    workHours: { day: 8.1, week: 41.5, month: 170, year: 2050 },
    ergonomicsScore: 94,
    focusScore: 93,
    wpm: 59,
    streakDays: 35,
    tier: 'Vàng',
    badge: 'Chiến Binh Pomodoro'
  },
  {
    id: 'USR-GLOBAL-05',
    rank: 5,
    name: 'Lê Minh Tuấn',
    country: 'Việt Nam',
    city: 'TP. Hồ Chí Minh',
    location: 'TP. Hồ Chí Minh, Việt Nam',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    workHours: { day: 8.0, week: 41.0, month: 168, year: 2020 },
    ergonomicsScore: 93,
    focusScore: 92,
    wpm: 61,
    streakDays: 31,
    tier: 'Vàng',
    badge: 'Hiệp Sĩ Cột Sống'
  },
  {
    id: 'USR-GLOBAL-06',
    rank: 6,
    name: 'Elena Rostova',
    country: 'Đức',
    city: 'Berlin',
    location: 'Berlin, Đức',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    workHours: { day: 7.9, week: 40.5, month: 165, year: 1990 },
    ergonomicsScore: 92,
    focusScore: 91,
    wpm: 57,
    streakDays: 28,
    tier: 'Vàng',
    badge: 'Công Thái Học Đỉnh Cao'
  },
  {
    id: 'USR-GLOBAL-07',
    rank: 7,
    name: 'David Kim',
    country: 'Hàn Quốc',
    city: 'Seoul',
    location: 'Seoul, Hàn Quốc',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    workHours: { day: 7.8, week: 40.0, month: 164, year: 1960 },
    ergonomicsScore: 91,
    focusScore: 90,
    wpm: 66,
    streakDays: 26,
    tier: 'Vàng',
    badge: 'Tốc Độ & Chính Xác'
  },
  {
    id: 'USR-GLOBAL-08',
    rank: 8,
    name: 'Phạm Bảo Ngọc',
    country: 'Việt Nam',
    city: 'Cần Thơ',
    location: 'Cần Thơ, Việt Nam',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    workHours: { day: 7.7, week: 39.5, month: 162, year: 1940 },
    ergonomicsScore: 90,
    focusScore: 89,
    wpm: 55,
    streakDays: 24,
    tier: 'Vàng',
    badge: 'Tập Trung Bền Bỉ'
  },
  {
    id: 'USR-GLOBAL-09',
    rank: 9,
    name: 'Sarah Jenkins',
    country: 'Mỹ',
    city: 'New York',
    location: 'New York, Mỹ',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    workHours: { day: 7.6, week: 39.0, month: 160, year: 1920 },
    ergonomicsScore: 89,
    focusScore: 89,
    wpm: 63,
    streakDays: 22,
    tier: 'Bạc',
    badge: 'Tập Trung Cao Độ'
  },
  {
    id: 'USR-GLOBAL-10',
    rank: 10,
    name: 'Hoàng Quốc Đạt',
    country: 'Việt Nam',
    city: 'Hải Phòng',
    location: 'Hải Phòng, Việt Nam',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
    workHours: { day: 7.6, week: 38.5, month: 158, year: 1900 },
    ergonomicsScore: 89,
    focusScore: 88,
    wpm: 58,
    streakDays: 21,
    tier: 'Bạc',
    badge: 'Phong Độ Ổn Định'
  },
  {
    id: 'USR-GLOBAL-11',
    rank: 11,
    name: 'Li Wei',
    country: 'Singapore',
    city: 'Singapore',
    location: 'Singapore',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    workHours: { day: 7.5, week: 38.0, month: 156, year: 1880 },
    ergonomicsScore: 88,
    focusScore: 87,
    wpm: 60,
    streakDays: 19,
    tier: 'Bạc',
    badge: 'Chiến Thắng Trì Hoãn'
  },
  {
    id: 'USR-GLOBAL-12',
    rank: 12,
    name: 'Đặng Thùy Trang',
    country: 'Việt Nam',
    city: 'Hà Nội',
    location: 'Hà Nội, Việt Nam',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    workHours: { day: 7.5, week: 38.0, month: 155, year: 1860 },
    ergonomicsScore: 88,
    focusScore: 87,
    wpm: 54,
    streakDays: 18,
    tier: 'Bạc',
    badge: 'Bền Bỉ Mỗi Ngày'
  },
  {
    id: 'USR-GLOBAL-13',
    rank: 13,
    name: 'Alexandre Dupont',
    country: 'Pháp',
    city: 'Paris',
    location: 'Paris, Pháp',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    workHours: { day: 7.4, week: 37.5, month: 154, year: 1840 },
    ergonomicsScore: 87,
    focusScore: 86,
    wpm: 52,
    streakDays: 17,
    tier: 'Bạc',
    badge: 'Tư Thế Vững Vàng'
  },
  {
    id: 'USR-GLOBAL-14',
    rank: 14,
    name: 'Vũ Đức Thành',
    country: 'Việt Nam',
    city: 'TP. Hồ Chí Minh',
    location: 'TP. Hồ Chí Minh, Việt Nam',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    workHours: { day: 7.3, week: 37.0, month: 152, year: 1820 },
    ergonomicsScore: 86,
    focusScore: 85,
    wpm: 56,
    streakDays: 16,
    tier: 'Bạc',
    badge: 'Tác Phong Chuẩn'
  },
  {
    id: 'USR-GLOBAL-15',
    rank: 15,
    name: 'Jessica Miller',
    country: 'Mỹ',
    city: 'San Francisco',
    location: 'San Francisco, Mỹ',
    avatar: 'https://images.unsplash.com/photo-1534751516642-a171edd2521d?w=150&auto=format&fit=crop&q=80',
    workHours: { day: 7.3, week: 37.0, month: 150, year: 1800 },
    ergonomicsScore: 86,
    focusScore: 85,
    wpm: 65,
    streakDays: 15,
    tier: 'Bạc',
    badge: 'Năng Suất Cao'
  },
  {
    id: 'USR-GLOBAL-16',
    rank: 16,
    name: 'Bùi Gia Khiêm',
    country: 'Việt Nam',
    city: 'Bình Dương',
    location: 'Bình Dương, Việt Nam',
    avatar: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=150&auto=format&fit=crop&q=80',
    workHours: { day: 7.2, week: 36.5, month: 148, year: 1780 },
    ergonomicsScore: 85,
    focusScore: 84,
    wpm: 50,
    streakDays: 14,
    tier: 'Đồng',
    badge: 'Tiến Bộ Nhanh'
  },
  {
    id: 'USR-GLOBAL-17',
    rank: 17,
    name: 'Chloe Tremblay',
    country: 'Canada',
    city: 'Toronto',
    location: 'Toronto, Canada',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    workHours: { day: 7.1, week: 36.0, month: 146, year: 1750 },
    ergonomicsScore: 85,
    focusScore: 84,
    wpm: 53,
    streakDays: 13,
    tier: 'Đồng',
    badge: 'Kiên Trì Bền Bỉ'
  },
  {
    id: 'USR-GLOBAL-18',
    rank: 18,
    name: 'Nguyễn Diệu Linh',
    country: 'Việt Nam',
    city: 'Đà Nẵng',
    location: 'Đà Nẵng, Việt Nam',
    avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=150&auto=format&fit=crop&q=80',
    workHours: { day: 7.1, week: 35.5, month: 144, year: 1730 },
    ergonomicsScore: 84,
    focusScore: 83,
    wpm: 48,
    streakDays: 12,
    tier: 'Đồng',
    badge: 'Cải Thiện Tư Thế'
  },
  {
    id: 'USR-GLOBAL-19',
    rank: 19,
    name: 'Liam O’Connor',
    country: 'Úc',
    city: 'Sydney',
    location: 'Sydney, Úc',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
    workHours: { day: 7.0, week: 35.0, month: 142, year: 1700 },
    ergonomicsScore: 84,
    focusScore: 82,
    wpm: 55,
    streakDays: 11,
    tier: 'Đồng',
    badge: 'Chiến Binh Trẻ'
  },
  {
    id: 'USR-GLOBAL-20',
    rank: 20,
    name: 'Trần Văn Hào',
    country: 'Việt Nam',
    city: 'Hà Nội',
    location: 'Hà Nội, Việt Nam',
    avatar: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=150&auto=format&fit=crop&q=80',
    workHours: { day: 7.0, week: 35.0, month: 140, year: 1680 },
    ergonomicsScore: 83,
    focusScore: 82,
    wpm: 46,
    streakDays: 10,
    tier: 'Đồng',
    badge: 'Nỗ Lực Mỗi Ngày'
  },
  {
    id: 'USR-GLOBAL-21',
    rank: 21,
    name: 'Yuki Sato',
    country: 'Nhật Bản',
    city: 'Osaka',
    location: 'Osaka, Nhật Bản',
    avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&auto=format&fit=crop&q=80',
    workHours: { day: 6.9, week: 34.5, month: 138, year: 1650 },
    ergonomicsScore: 83,
    focusScore: 81,
    wpm: 51,
    streakDays: 9,
    tier: 'Đồng',
    badge: 'Tập Trung Vươn Lên'
  },
  {
    id: 'USR-GLOBAL-22',
    rank: 22,
    name: 'Võ Mai Phương',
    country: 'Việt Nam',
    city: 'TP. Hồ Chí Minh',
    location: 'TP. Hồ Chí Minh, Việt Nam',
    avatar: 'https://images.unsplash.com/photo-1573497491765-dccce02b29df?w=150&auto=format&fit=crop&q=80',
    workHours: { day: 6.8, week: 34.0, month: 136, year: 1630 },
    ergonomicsScore: 82,
    focusScore: 80,
    wpm: 47,
    streakDays: 8,
    tier: 'Đồng',
    badge: 'Cột Sống Khỏe'
  },
  {
    id: 'USR-GLOBAL-23',
    rank: 23,
    name: 'Daniel Brown',
    country: 'Mỹ',
    city: 'Chicago',
    location: 'Chicago, Mỹ',
    avatar: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=150&auto=format&fit=crop&q=80',
    workHours: { day: 6.8, week: 33.5, month: 134, year: 1600 },
    ergonomicsScore: 81,
    focusScore: 79,
    wpm: 49,
    streakDays: 7,
    tier: 'Đồng',
    badge: 'Duy Trì Thường Xuyên'
  },
  {
    id: 'USR-GLOBAL-24',
    rank: 24,
    name: 'Phan Quốc Việt',
    country: 'Việt Nam',
    city: 'Quảng Ninh',
    location: 'Quảng Ninh, Việt Nam',
    avatar: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&auto=format&fit=crop&q=80',
    workHours: { day: 6.7, week: 33.0, month: 132, year: 1580 },
    ergonomicsScore: 80,
    focusScore: 78,
    wpm: 44,
    streakDays: 6,
    tier: 'Đồng',
    badge: 'Tân Binh Quyết Tâm'
  }
];

// Dữ liệu báo cáo 1 năm (12 tháng)
export const ANNUAL_REPORT_METRICS = [
  { month: 'T1', postureScore: 84, focusHours: 152, warnings: 45, compliance: '88%' },
  { month: 'T2', postureScore: 86, focusHours: 140, warnings: 38, compliance: '90%' },
  { month: 'T3', postureScore: 88, focusHours: 165, warnings: 32, compliance: '92%' },
  { month: 'T4', postureScore: 85, focusHours: 158, warnings: 40, compliance: '89%' },
  { month: 'T5', postureScore: 90, focusHours: 172, warnings: 26, compliance: '94%' },
  { month: 'T6', postureScore: 91, focusHours: 168, warnings: 22, compliance: '95%' },
  { month: 'T7', postureScore: 89, focusHours: 160, warnings: 29, compliance: '93%' },
  { month: 'T8', postureScore: 94, focusHours: 176, warnings: 18, compliance: '97%' },
  { month: 'T9', postureScore: 92, focusHours: 170, warnings: 20, compliance: '96%' },
  { month: 'T10', postureScore: 93, focusHours: 174, warnings: 19, compliance: '96%' },
  { month: 'T11', postureScore: 91, focusHours: 166, warnings: 24, compliance: '94%' },
  { month: 'T12', postureScore: 95, focusHours: 178, warnings: 15, compliance: '98%' },
];

export const HOURLY_METRICS = [
  { hour: '08:00', correctPosture: 92, slouching: 6, leaning: 2 },
  { hour: '09:00', correctPosture: 89, slouching: 8, leaning: 3 },
  { hour: '10:00', correctPosture: 86, slouching: 10, leaning: 4 },
  { hour: '11:00', correctPosture: 78, slouching: 16, leaning: 6 },
  { hour: '13:30', correctPosture: 90, slouching: 7, leaning: 3 },
  { hour: '14:30', correctPosture: 84, slouching: 11, leaning: 5 },
  { hour: '15:30', correctPosture: 77, slouching: 17, leaning: 6 },
  { hour: '16:30', correctPosture: 82, slouching: 13, leaning: 5 },
];

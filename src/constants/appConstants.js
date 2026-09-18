export const APP_NAME = 'FacultyPortal';

export const STORAGE_KEYS = {
  THEME: 'faculty-portal-theme',
  REMEMBER_ME: 'faculty-portal-remember-me',
  USER: 'faculty-portal-user',
  SESSION: 'faculty-portal-session',
};

export const ROLE_NAV_ITEMS = {
  faculty: [
    { id: 'dashboard', label: 'Dashboard', path: '/app/dashboard', icon: '🏠' },
    { id: 'courses', label: 'Courses', path: '/app/courses', icon: '📚' },
    { id: 'students', label: 'Students', path: '/app/students', icon: '🎓' },
    { id: 'attendance', label: 'Attendance', path: '/app/attendance', icon: '🗓️' },
    { id: 'assignments', label: 'Assignments', path: '/app/assignments', icon: '📝' },
    { id: 'messages', label: 'Inbox', path: '/app/messages', icon: '📥' },
    { id: 'profile', label: 'Profile & Settings', path: '/app/profile', icon: '⚙️' },
  ],
  admin: [
    { id: 'dashboard', label: 'Dashboard', path: '/app/dashboard', icon: '🏠' },
    { id: 'courses', label: 'Courses', path: '/app/courses', icon: '📚' },
    { id: 'students', label: 'Students', path: '/app/students', icon: '🎓' },
    { id: 'attendance', label: 'Attendance', path: '/app/attendance', icon: '🗓️' },
    { id: 'assignments', label: 'Assignments', path: '/app/assignments', icon: '📝' },
    { id: 'messages', label: 'Inbox', path: '/app/messages', icon: '📥' },
    { id: 'profile', label: 'Profile & Settings', path: '/app/profile', icon: '⚙️' },
  ],
};

export const DEPARTMENTS = [
  'Computer Science',
  'Software Engineering',
  'Business Administration',
  'Mechanical Engineering',
  'Electrical Engineering',
  'Mathematics',
  'Natural Sciences',
  'Education',
  'Arts and Humanities',
];

export const BATCHES = ['2022', '2023', '2024', '2025', '2026'];

export const ATTENDANCE_STATUSES = ['Present', 'Absent', 'Late', 'Excused'];

export const THEME_OPTIONS = {
  LIGHT: 'light',
  DARK: 'dark',
};

export const OAUTH_PROVIDERS = [
  { id: 'google', label: 'Continue with Google', icon: 'G' },
  { id: 'facebook', label: 'Continue with Facebook', icon: 'f' },
  { id: 'microsoft', label: 'Continue with Microsoft', icon: '⊞' },
];

export const PASSWORD_RULES = {
  minLength: 8,
  requiresUppercase: /[A-Z]/,
  requiresLowercase: /[a-z]/,
  requiresNumber: /[0-9]/,
  requiresSpecial: /[^A-Za-z0-9]/,
};

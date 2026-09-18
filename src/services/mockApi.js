import {
  mockActivityFeed,
  mockAssignments,
  mockAttendanceRecords,
  mockCourses,
  mockMessages,
  mockNotifications,
  mockStats,
  mockStudents,
  mockSubmissions,
  mockUser,
} from '../data/mockData';
import { uid } from '../utils/format';

function withDelay(payload, delay = 350) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(payload), delay);
  });
}

export const api = {
  auth: {
    async login({ email, password, rememberMe }) {
      if (!email || !password) {
        throw new Error('Email and password are required.');
      }

      return withDelay({
        user: {
          ...mockUser,
          email,
        },
        session: {
          rememberMe,
          expiresIn: rememberMe ? '30 days' : '24 hours',
          device: 'Chrome on Linux',
          ipAddress: '192.168.0.12',
          startedAt: new Date().toISOString(),
          twoFactorVerified: false,
        },
      });
    },
    async signup(payload) {
      return withDelay({
        user: {
          ...mockUser,
          id: uid('fac'),
          name: payload.name,
          email: payload.email,
          department: payload.department,
          verified: false,
        },
      });
    },
    async forgotPassword(email) {
      return withDelay({ message: `Password reset email sent to ${email}.` });
    },
    async resetPassword() {
      return withDelay({ message: 'Password has been reset successfully.' });
    },
    async verifyEmail(code) {
      if (code.length !== 6) {
        throw new Error('Please enter a valid 6-digit verification code.');
      }
      return withDelay({ verified: true });
    },
    async verifyTwoFactor(code) {
      if (code.length !== 6) {
        throw new Error('Two-factor code must be 6 digits.');
      }
      return withDelay({ success: true });
    },
  },
  dashboard: {
    async stats() {
      return withDelay(mockStats);
    },
    async activity() {
      return withDelay(mockActivityFeed);
    },
    async notifications() {
      return withDelay(mockNotifications);
    },
  },
  courses: {
    async list() {
      return withDelay(mockCourses);
    },
    async create(courseData) {
      return withDelay({
        ...courseData,
        id: uid('CRS'),
      });
    },
    async update(courseData) {
      return withDelay(courseData);
    },
  },
  students: {
    async list() {
      return withDelay(mockStudents);
    },
  },
  attendance: {
    async list() {
      return withDelay(mockAttendanceRecords);
    },
    async mark(record) {
      return withDelay({ ...record, id: uid('ATT') });
    },
  },
  assignments: {
    async list() {
      return withDelay(mockAssignments);
    },
    async submissions() {
      return withDelay(mockSubmissions);
    },
  },
  messages: {
    async list() {
      return withDelay(mockMessages);
    },
    async send(message) {
      return withDelay({ ...message, id: uid('MSG'), timestamp: new Date().toISOString() });
    },
  },
};

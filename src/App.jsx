import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthPage } from './pages/auth/AuthPage';
import { AppLayout } from './pages/dashboard/AppLayout';
import { DashboardHome } from './pages/dashboard/DashboardHome';
import { CoursesPage } from './pages/dashboard/CoursesPage';
import { CourseDetailsPage } from './pages/dashboard/CourseDetailsPage';
import { StudentsPage } from './pages/dashboard/StudentsPage';
import { AttendancePage } from './pages/dashboard/AttendancePage';
import { AssignmentsPage } from './pages/dashboard/AssignmentsPage';
import { MessagingPage } from './pages/dashboard/MessagingPage';
import { ProfilePage } from './pages/dashboard/ProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProtectedRoute } from './routes/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth/login" replace />} />

      <Route path="/auth/:mode" element={<AuthPage />} />
      <Route path="/auth" element={<Navigate to="/auth/login" replace />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<AppLayout />}>
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="courses/:courseId" element={<CourseDetailsPage />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="assignments" element={<AssignmentsPage />} />
          <Route path="messages" element={<MessagingPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

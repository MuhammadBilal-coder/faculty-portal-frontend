import { useEffect, useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { api } from '../../services/mockApi';
import { Sidebar } from '../../components/layout/Sidebar';
import { TopNav } from '../../components/layout/TopNav';
import { MobileDrawer } from '../../components/layout/MobileDrawer';
import { SessionIndicator } from '../../components/layout/SessionIndicator';

export function AppLayout() {
  const { user, session, logout } = useAuth();
  const { pushToast } = useNotifications();
  const [notifications, setNotifications] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    let active = true;

    api.dashboard.notifications().then((response) => {
      if (active) {
        setNotifications(response);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const unreadCount = useMemo(() => notifications.filter((item) => !item.read).length, [notifications]);

  const onLogout = () => {
    logout();
    pushToast({ type: 'info', title: 'Signed out', message: 'You have been securely signed out.' });
  };

  return (
    <div className="app-layout">
      <div className="desktop-sidebar">
        <Sidebar role={user?.role} />
      </div>

      <div className="main-content-wrapper">
        <TopNav
          user={user}
          notifications={notifications}
          unreadCount={unreadCount}
          onLogout={onLogout}
          onMenuClick={() => setDrawerOpen(true)}
        />

        <SessionIndicator session={session} />

        <main className="app-content" aria-live="polite">
          <Outlet />
        </main>
      </div>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} role={user?.role} />
    </div>
  );
}

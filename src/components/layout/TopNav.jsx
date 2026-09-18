import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from '../common/Dropdown';
import { Badge } from '../common/Badge';
import { useTheme } from '../../contexts/ThemeContext';

export function TopNav({ user, notifications, unreadCount, onLogout, onMenuClick }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const displayName = user?.name ?? 'Faculty User';
  const displayAvatar = user?.avatar ?? 'FP';

  const userMenuItems = [
    { label: 'Profile Settings', onClick: () => navigate('/app/profile') },
    { label: 'Sign Out', onClick: onLogout },
  ];

  return (
    <header className="topnav">
      <button className="icon-button mobile-only" onClick={onMenuClick} aria-label="Open menu">
        ☰
      </button>
      <div className="topnav-right">
        <button className="icon-button" onClick={toggleTheme} aria-label="Toggle dark mode">
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>

        <div className="notification-wrapper">
          <button
            className="icon-button"
            onClick={() => setShowNotifications((current) => !current)}
            aria-label="Notifications"
          >
            🔔
            {unreadCount > 0 ? <Badge tone="danger">{unreadCount}</Badge> : null}
          </button>
          {showNotifications ? (
            <div className="notifications-popover">
              <h4>Notifications</h4>
              {notifications.length ? (
                <ul>
                  {notifications.map((item) => (
                    <li key={item.id} className={item.read ? '' : 'unread'}>
                      <strong>{item.title}</strong>
                      <p>{item.description}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="muted">No notifications available.</p>
              )}
            </div>
          ) : null}
        </div>

        <Dropdown label={`${displayAvatar} ${displayName}`} items={userMenuItems} />
      </div>
    </header>
  );
}

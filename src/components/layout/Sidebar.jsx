import { NavLink } from 'react-router-dom';
import { APP_NAME, ROLE_NAV_ITEMS } from '../../constants/appConstants';

export function Sidebar({ role = 'faculty', onNavigate }) {
  const items = ROLE_NAV_ITEMS[role] ?? ROLE_NAV_ITEMS.faculty;

  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <div className="sidebar-brand">
        <span className="brand-mark">FP</span>
        <div>
          <strong>{APP_NAME}</strong>
          <p>Faculty Workspace</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {items.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`.trim()}
            onClick={onNavigate}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

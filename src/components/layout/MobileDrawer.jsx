import { Sidebar } from './Sidebar';

export function MobileDrawer({ open, onClose, role }) {
  if (!open) return null;

  return (
    <div className="drawer-backdrop" onClick={onClose} role="presentation">
      <div className="drawer-content" onClick={(event) => event.stopPropagation()}>
        <Sidebar role={role} onNavigate={onClose} />
      </div>
    </div>
  );
}

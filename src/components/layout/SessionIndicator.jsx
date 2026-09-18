import { formatDateTime } from '../../utils/format';

export function SessionIndicator({ session }) {
  if (!session) return null;

  return (
    <div className="session-indicator" role="status">
      <span>🔒</span>
      <div>
        <strong>Session Active</strong>
        <p>
          {session.device} · Started {formatDateTime(session.startedAt)} · Expires in {session.expiresIn}
        </p>
      </div>
    </div>
  );
}

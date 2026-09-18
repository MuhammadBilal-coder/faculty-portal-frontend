export function EmptyState({ icon = '📭', title, description, action }) {
  return (
    <div className="state-container">
      <div className="state-icon" aria-hidden="true">
        {icon}
      </div>
      <h4>{title}</h4>
      <p>{description}</p>
      {action ? <div className="state-action">{action}</div> : null}
    </div>
  );
}

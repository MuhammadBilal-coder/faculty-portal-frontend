export function StatCard({ icon, label, value, trend }) {
  return (
    <article className="stat-card">
      <div className="stat-icon" aria-hidden="true">
        {icon}
      </div>
      <div>
        <p>{label}</p>
        <h3>{value}</h3>
        {trend ? <span className={trend.direction === 'up' ? 'trend-up' : 'trend-down'}>{trend.text}</span> : null}
      </div>
    </article>
  );
}

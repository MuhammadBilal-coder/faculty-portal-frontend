export function Skeleton({ lines = 3, className = '' }) {
  return (
    <div className={`skeleton ${className}`.trim()} aria-hidden="true">
      {Array.from({ length: lines }).map((_, index) => (
        <span key={`skeleton-${index + 1}`} className="skeleton-line" />
      ))}
    </div>
  );
}

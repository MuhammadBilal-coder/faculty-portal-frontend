export function ErrorState({ title = 'Something went wrong', description, onRetry }) {
  return (
    <div className="state-container error-state" role="alert">
      <div className="state-icon" aria-hidden="true">
        ⚠️
      </div>
      <h4>{title}</h4>
      <p>{description}</p>
      {onRetry ? (
        <button type="button" className="btn btn-secondary" onClick={onRetry}>
          Retry
        </button>
      ) : null}
    </div>
  );
}

export function PasswordStrengthMeter({ strength }) {
  return (
    <div className="password-strength-meter" aria-live="polite">
      <div className="strength-bars">
        {[1, 2, 3, 4, 5].map((bar) => (
          <span
            key={bar}
            className={bar <= strength.score ? `active ${strength.className}` : ''}
            aria-hidden="true"
          />
        ))}
      </div>
      <span className={`strength-label ${strength.className}`}>{strength.label}</span>
    </div>
  );
}

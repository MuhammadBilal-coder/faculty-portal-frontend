export function InputField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  hint,
  autoComplete,
  ...props
}) {
  return (
    <div className="form-control">
      <label htmlFor={id}>
        {label}
        {required ? <span className="required-marker">*</span> : null}
      </label>
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {hint ? <small className="field-hint">{hint}</small> : null}
      {error ? (
        <small id={`${id}-error`} className="field-error" role="alert">
          {error}
        </small>
      ) : null}
    </div>
  );
}

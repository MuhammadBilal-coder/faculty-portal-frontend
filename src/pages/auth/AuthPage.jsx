import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { DEPARTMENTS } from '../../constants/appConstants';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { api } from '../../services/mockApi';
import { getPasswordStrength, isEmail, validateLogin, validateSignup } from '../../utils/validation';
import { Button } from '../../components/common/Button';
import { InputField } from '../../components/common/InputField';
import { PasswordStrengthMeter } from '../../components/common/PasswordStrengthMeter';
import { OAuthButtons } from '../../components/auth/OAuthButtons';

const initialFormState = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  department: '',
  rememberMe: false,
  code: '',
};

const authMetadata = {
  login: {
    title: 'Welcome back',
    subtitle: 'Sign in to continue to your secure faculty workspace.',
  },
  signup: {
    title: 'Create faculty account',
    subtitle: 'Use your institutional credentials for secure onboarding.',
  },
  forgot: {
    title: 'Forgot password',
    subtitle: 'Enter your institutional email to receive a reset link.',
  },
  reset: {
    title: 'Reset your password',
    subtitle: 'Create a new strong password for your account.',
  },
  'verify-email': {
    title: 'Verify your email',
    subtitle: 'Enter the 6-digit code sent to your institutional inbox.',
  },
  'verify-2fa': {
    title: 'Two-Factor Verification',
    subtitle: 'Enter the 6-digit authenticator code to complete sign in.',
  },
};

export function AuthPage() {
  const params = useParams();
  const mode = authMetadata[params.mode] ? params.mode : 'login';
  const location = useLocation();
  const navigate = useNavigate();
  const { login, signup, loading, setSession } = useAuth();
  const { pushToast } = useNotifications();
  const [form, setForm] = useState(initialFormState);
  const [error, setError] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordStrength = useMemo(() => getPasswordStrength(form.password), [form.password]);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    setError('');
  };

  const onOAuth = (provider) => {
    pushToast({
      type: 'info',
      title: `${provider} OAuth`,
      message: 'OAuth is ready for backend integration through your identity provider.',
    });
  };

  const onLogin = async (event) => {
    event.preventDefault();
    const validationError = validateLogin(form);

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await login({ email: form.email, password: form.password, rememberMe: form.rememberMe });
      navigate('/auth/verify-2fa', { replace: true });
      pushToast({ type: 'success', title: 'Primary authentication passed', message: 'Complete 2FA to enter portal.' });
    } catch (loginError) {
      setError(loginError.message);
    }
  };

  const onSignup = async (event) => {
    event.preventDefault();
    const validationError = validateSignup(form);

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await signup(form);
      pushToast({
        type: 'success',
        title: 'Account created',
        message: 'Check your inbox for verification code to activate your account.',
      });
      navigate('/auth/verify-email', { replace: true });
    } catch (signupError) {
      setError(signupError.message);
    }
  };

  const onForgot = async (event) => {
    event.preventDefault();

    if (!isEmail(form.email)) {
      setError('Please provide a valid account email.');
      return;
    }

    setIsBusy(true);
    try {
      const response = await api.auth.forgotPassword(form.email);
      pushToast({ type: 'success', title: 'Recovery email sent', message: response.message });
      navigate('/auth/reset', { replace: true });
    } catch (forgotError) {
      setError(forgotError.message);
    } finally {
      setIsBusy(false);
    }
  };

  const onReset = async (event) => {
    event.preventDefault();

    if (form.password.length < 8) {
      setError('Password should be at least 8 characters long.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsBusy(true);
    try {
      const response = await api.auth.resetPassword(form.password);
      pushToast({ type: 'success', title: 'Password updated', message: response.message });
      navigate('/auth/login', { replace: true });
    } catch (resetError) {
      setError(resetError.message);
    } finally {
      setIsBusy(false);
    }
  };

  const onVerifyEmail = async (event) => {
    event.preventDefault();

    setIsBusy(true);
    try {
      await api.auth.verifyEmail(form.code);
      pushToast({
        type: 'success',
        title: 'Email verified',
        message: 'Your account is now verified. You can securely sign in.',
      });
      navigate('/auth/login', { replace: true });
    } catch (verifyError) {
      setError(verifyError.message);
    } finally {
      setIsBusy(false);
    }
  };

  const onVerifyTwoFactor = async (event) => {
    event.preventDefault();

    setIsBusy(true);
    try {
      await api.auth.verifyTwoFactor(form.code);
      const rememberedSession = JSON.parse(localStorage.getItem('faculty-portal-session') ?? 'null');
      if (rememberedSession) {
        setSession({ ...rememberedSession, twoFactorVerified: true });
      }

      pushToast({
        type: 'success',
        title: '2FA verified',
        message: 'Welcome to your faculty command center.',
      });

      const redirectTo = location.state?.from ?? '/app/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (verifyError) {
      setError(verifyError.message);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <main className="auth-layout">
      <section className="auth-showcase" aria-hidden="true">
        <div className="auth-overlay">
          <p className="eyebrow">FACULTY PRODUCTIVITY SUITE</p>
          <h1>Academic operations, communication, and insight — in one secure portal.</h1>
          <ul>
            <li>Enterprise-ready authentication with session controls and 2FA</li>
            <li>Real-time course, attendance, assignment, and student management views</li>
            <li>Role-aware, responsive dashboard designed for modern institutions</li>
          </ul>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-shell">
          <div className="brand-inline">
            <span className="brand-mark">FP</span>
            <div>
              <strong>FacultyPortal</strong>
              <small>Institutional Faculty Suite</small>
            </div>
          </div>

          <header>
            <h2>{authMetadata[mode].title}</h2>
            <p>{authMetadata[mode].subtitle}</p>
          </header>

          {mode === 'login' || mode === 'signup' ? <OAuthButtons onAuth={onOAuth} /> : null}

          {(mode === 'login' || mode === 'signup') && <div className="auth-divider">or continue with email</div>}

          {mode === 'login' ? (
            <form className="auth-form" onSubmit={onLogin}>
              <InputField
                id="login-email"
                label="Institutional Email"
                type="email"
                placeholder="you@university.edu"
                value={form.email}
                onChange={(value) => updateField('email', value)}
                autoComplete="email"
                required
              />
              <div className="form-control">
                <label htmlFor="login-password">Password</label>
                <div className="input-with-button">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(event) => updateField('password', event.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="text-link"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div className="form-row between">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={form.rememberMe}
                    onChange={(event) => updateField('rememberMe', event.target.checked)}
                  />
                  Remember this trusted device for 30 days
                </label>

                <Link className="text-link" to="/auth/forgot">
                  Forgot password?
                </Link>
              </div>

              {error ? <p className="message error">{error}</p> : null}

              <Button type="submit" disabled={loading || isBusy}>
                {loading ? 'Signing in…' : 'Sign in'}
              </Button>

              <p className="auth-footnote">
                New to FacultyPortal? <Link to="/auth/signup">Create account</Link>
              </p>
            </form>
          ) : null}

          {mode === 'signup' ? (
            <form className="auth-form" onSubmit={onSignup}>
              <InputField
                id="signup-name"
                label="Full Name"
                placeholder="Dr. Sarah Johnson"
                value={form.name}
                onChange={(value) => updateField('name', value)}
                autoComplete="name"
                required
              />
              <InputField
                id="signup-email"
                label="Institutional Email"
                type="email"
                placeholder="you@university.edu"
                value={form.email}
                onChange={(value) => updateField('email', value)}
                autoComplete="email"
                hint="Only verified institutional domains can be used for faculty onboarding."
                required
              />

              <div className="form-control">
                <label htmlFor="signup-department">Department</label>
                <select
                  id="signup-department"
                  value={form.department}
                  onChange={(event) => updateField('department', event.target.value)}
                  required
                >
                  <option value="">Select your department</option>
                  {DEPARTMENTS.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label htmlFor="signup-password">Create Password</label>
                <div className="input-with-button">
                  <input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(event) => updateField('password', event.target.value)}
                    placeholder="Minimum 8 characters"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="text-link"
                    onClick={() => setShowPassword((value) => !value)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>

                {form.password ? <PasswordStrengthMeter strength={passwordStrength} /> : null}
              </div>

              <div className="form-control">
                <label htmlFor="signup-confirm-password">Confirm Password</label>
                <div className="input-with-button">
                  <input
                    id="signup-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={(event) => updateField('confirmPassword', event.target.value)}
                    placeholder="Re-enter password"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="text-link"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                  >
                    {showConfirmPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <label className="checkbox-label">
                <input type="checkbox" required />
                I agree to the Terms of Service and Privacy Policy.
              </label>

              {error ? <p className="message error">{error}</p> : null}

              <Button type="submit" disabled={loading || isBusy}>
                {loading ? 'Creating account…' : 'Create account'}
              </Button>

              <p className="auth-footnote">
                Already registered? <Link to="/auth/login">Sign in</Link>
              </p>
            </form>
          ) : null}

          {mode === 'forgot' ? (
            <form className="auth-form" onSubmit={onForgot}>
              <InputField
                id="forgot-email"
                label="Account Email"
                type="email"
                placeholder="you@university.edu"
                value={form.email}
                onChange={(value) => updateField('email', value)}
                required
              />

              {error ? <p className="message error">{error}</p> : null}

              <Button type="submit" disabled={isBusy}>
                {isBusy ? 'Sending…' : 'Send recovery email'}
              </Button>
              <p className="auth-footnote">
                <Link to="/auth/login">Back to sign in</Link>
              </p>
            </form>
          ) : null}

          {mode === 'reset' ? (
            <form className="auth-form" onSubmit={onReset}>
              <div className="form-control">
                <label htmlFor="reset-password">New Password</label>
                <input
                  id="reset-password"
                  type="password"
                  value={form.password}
                  onChange={(event) => updateField('password', event.target.value)}
                  placeholder="Enter new password"
                />
              </div>

              <div className="form-control">
                <label htmlFor="reset-password-confirm">Confirm Password</label>
                <input
                  id="reset-password-confirm"
                  type="password"
                  value={form.confirmPassword}
                  onChange={(event) => updateField('confirmPassword', event.target.value)}
                  placeholder="Confirm new password"
                />
              </div>

              {error ? <p className="message error">{error}</p> : null}
              <Button type="submit" disabled={isBusy}>
                {isBusy ? 'Resetting…' : 'Reset password'}
              </Button>
            </form>
          ) : null}

          {mode === 'verify-email' ? (
            <form className="auth-form" onSubmit={onVerifyEmail}>
              <InputField
                id="verify-email-code"
                label="Verification code"
                placeholder="Enter 6-digit code"
                value={form.code}
                onChange={(value) => updateField('code', value.replace(/\D/g, '').slice(0, 6))}
                required
              />
              {error ? <p className="message error">{error}</p> : null}
              <Button type="submit" disabled={isBusy}>
                {isBusy ? 'Verifying…' : 'Verify email'}
              </Button>
            </form>
          ) : null}

          {mode === 'verify-2fa' ? (
            <form className="auth-form" onSubmit={onVerifyTwoFactor}>
              <InputField
                id="verify-2fa-code"
                label="Authenticator code"
                placeholder="Enter 6-digit code"
                value={form.code}
                onChange={(value) => updateField('code', value.replace(/\D/g, '').slice(0, 6))}
                required
              />
              {error ? <p className="message error">{error}</p> : null}
              <Button type="submit" disabled={isBusy}>
                {isBusy ? 'Verifying…' : 'Continue to dashboard'}
              </Button>
            </form>
          ) : null}
        </div>
      </section>
    </main>
  );
}

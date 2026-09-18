import { PASSWORD_RULES } from '../constants/appConstants';

export function isInstitutionalEmail(email) {
  return /^[^\s@]+@[^\s@]+\.(edu|ac\.[a-z]{2,})$/i.test(email);
}

export function isEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function getPasswordStrength(password) {
  let score = 0;

  if (password.length >= PASSWORD_RULES.minLength) score += 1;
  if (PASSWORD_RULES.requiresUppercase.test(password)) score += 1;
  if (PASSWORD_RULES.requiresLowercase.test(password)) score += 1;
  if (PASSWORD_RULES.requiresNumber.test(password)) score += 1;
  if (PASSWORD_RULES.requiresSpecial.test(password)) score += 1;

  if (score <= 2) {
    return {
      score,
      label: 'Weak',
      className: 'weak',
      checks: ['Use at least 8 characters', 'Add numbers and symbols'],
    };
  }

  if (score <= 3) {
    return {
      score,
      label: 'Medium',
      className: 'medium',
      checks: ['Add uppercase letters', 'Use a special character'],
    };
  }

  return {
    score,
    label: 'Strong',
    className: 'strong',
    checks: ['Password meets enterprise baseline security requirements'],
  };
}

export function validateLogin({ email, password }) {
  if (!isEmail(email)) {
    return 'Enter a valid email address.';
  }

  if (!password) {
    return 'Password is required.';
  }

  return '';
}

export function validateSignup({ name, email, password, confirmPassword, department }) {
  if (!name.trim()) {
    return 'Full name is required.';
  }

  if (!isInstitutionalEmail(email)) {
    return 'Please use your institutional email address (example@university.edu).';
  }

  if (password.length < PASSWORD_RULES.minLength) {
    return 'Password must be at least 8 characters long.';
  }

  if (password !== confirmPassword) {
    return 'Passwords do not match.';
  }

  if (!department) {
    return 'Please select your department.';
  }

  return '';
}

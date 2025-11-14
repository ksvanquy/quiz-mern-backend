/**
 * Password validation utility
 * Ensures passwords meet security requirements
 */

export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
  strength: 'weak' | 'fair' | 'good' | 'strong';
}

/**
 * Validate password against security requirements
 * @param password - Password to validate
 * @returns Validation result with errors and strength assessment
 */
export const validatePassword = (password: string): PasswordValidationResult => {
  const errors: string[] = [];
  let strengthScore = 0;

  // Check length
  if (!password || password.length === 0) {
    errors.push("Password is required");
    return { valid: false, errors, strength: 'weak' };
  }

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  } else {
    strengthScore += 1;
  }

  // Check for uppercase letters
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter (A-Z)");
  } else {
    strengthScore += 1;
  }

  // Check for lowercase letters
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter (a-z)");
  } else {
    strengthScore += 1;
  }

  // Check for numbers
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number (0-9)");
  } else {
    strengthScore += 1;
  }

  // Check for special characters
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character (!@#$%^&*...)");
  } else {
    strengthScore += 1;
  }

  // Check max length (prevent extremely long strings)
  if (password.length > 128) {
    errors.push("Password must not exceed 128 characters");
  }

  // Determine strength level
  let strength: 'weak' | 'fair' | 'good' | 'strong' = 'weak';
  if (strengthScore >= 4 && password.length >= 8) strength = 'good';
  if (strengthScore >= 5 && password.length >= 12) strength = 'strong';
  if (strengthScore >= 3 && password.length >= 8) strength = 'fair';

  return {
    valid: errors.length === 0,
    errors,
    strength
  };
};

/**
 * Check if password is in common password blacklist (simple check)
 * @param password - Password to check
 * @returns true if password is common/weak
 */
export const isCommonPassword = (password: string): boolean => {
  const commonPasswords = [
    'password', '123456', '12345678', 'qwerty', 'abc123',
    'password123', 'admin123', 'letmein', 'welcome', 'monkey',
    '1q2w3e4r', 'dragon', 'master', 'sunshine', 'princess'
  ];

  return commonPasswords.some(common => 
    password.toLowerCase() === common
  );
};

/**
 * Comprehensive password validation with all checks
 * @param password - Password to validate
 * @returns Combined validation result
 */
export const validatePasswordFully = (password: string): PasswordValidationResult => {
  const validation = validatePassword(password);

  if (isCommonPassword(password)) {
    validation.errors.push("This password is too common. Please choose a more unique password.");
    validation.valid = false;
    validation.strength = 'weak';
  }

  return validation;
};

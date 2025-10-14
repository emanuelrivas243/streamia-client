/**
 * Security utilities for the STREAMIA application.
 *
 * Provides helpers to validate password strength, validate email and age,
 * and other small security-oriented validations used across the client.
 */

/**
 * Password strength requirements
 */
export interface PasswordRequirements {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
}

/**
 * Default password requirements
 */
export const DEFAULT_PASSWORD_REQUIREMENTS: PasswordRequirements = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
};

/**
 * Password validation result
 */
export interface PasswordValidationResult {
  isValid: boolean;
  score: number; // 0-100
  errors: string[];
  suggestions: string[];
}

/**
 * Email validation result
 */
export interface EmailValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Age validation result
 */
export interface AgeValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate password strength according to the provided requirements.
 *
 * @param password - The password string to evaluate
 * @param requirements - Optional rules to validate against (uses defaults)
 * @returns PasswordValidationResult containing isValid, score (0-100), errors and suggestions
 */
export function validatePassword(
  password: string,
  requirements: PasswordRequirements = DEFAULT_PASSWORD_REQUIREMENTS
): PasswordValidationResult {
  const errors: string[] = [];
  const suggestions: string[] = [];
  let score = 0;

  // Length check
  if (password.length < requirements.minLength) {
    errors.push(`La contraseña debe tener al menos ${requirements.minLength} caracteres`);
  } else {
    score += 20;
  }

  // Uppercase check
  if (requirements.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra mayúscula');
  } else if (/[A-Z]/.test(password)) {
    score += 20;
  }

  // Lowercase check
  if (requirements.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra minúscula');
  } else if (/[a-z]/.test(password)) {
    score += 20;
  }

  // Numbers check
  if (requirements.requireNumbers && !/\d/.test(password)) {
    errors.push('La contraseña debe contener al menos un número');
  } else if (/\d/.test(password)) {
    score += 20;
  }

  // Special characters check
  if (requirements.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('La contraseña debe contener al menos un carácter especial');
  } else if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score += 20;
  }

  // Additional security checks
  if (password.length > 12) {
    score += 10;
  }

  // Check for common patterns
  if (/(.)\1{2,}/.test(password)) {
    suggestions.push('Evita repetir el mismo carácter más de 2 veces');
    score -= 10;
  }

  if (/123|abc|qwe|asd|zxc/i.test(password)) {
    suggestions.push('Evita secuencias comunes como "123" o "abc"');
    score -= 15;
  }

  // Check for common passwords
  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123',
    'password123', 'admin', 'letmein', 'welcome', 'monkey'
  ];
  
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    suggestions.push('Evita contraseñas comunes y fáciles de adivinar');
    score -= 20;
  }

  // Ensure score doesn't go below 0
  score = Math.max(0, score);

  return {
    isValid: errors.length === 0,
    score,
    errors,
    suggestions,
  };
}

/**
 * Validate password strength according to the provided requirements.
 *
 * @param password - The password string to evaluate
 * @param requirements - Optional rules to validate against (uses defaults)
 * @returns PasswordValidationResult containing isValid, score (0-100), errors and suggestions
 */

/**
 * Validate email format and perform basic security checks.
 *
 * @param email - Email string to validate
 * @returns EmailValidationResult with isValid and errors array
 */
export function validateEmail(email: string): EmailValidationResult {
  const errors: string[] = [];

  if (!email.trim()) {
    errors.push('El correo electrónico es requerido');
    return { isValid: false, errors };
  }

  // Basic email format validation
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(email)) {
    errors.push('El formato del correo electrónico no es válido');
    return { isValid: false, errors };
  }

  // Additional security checks
  if (email.length > 254) {
    errors.push('El correo electrónico es demasiado largo');
  }

  // Check for suspicious patterns
  if (email.includes('..') || email.startsWith('.') || email.endsWith('.')) {
    errors.push('El correo electrónico contiene caracteres inválidos');
  }

  // Check for disposable email domains (basic check)
  const disposableDomains = [
    '10minutemail.com', 'tempmail.org', 'guerrillamail.com',
    'mailinator.com', 'throwaway.email'
  ];
  
  const domain = email.split('@')[1]?.toLowerCase();
  if (domain && disposableDomains.includes(domain)) {
    errors.push('No se permiten correos electrónicos temporales');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate an age value.
 *
 * Accepts either a number or numeric string. Ensures value is within
 * reasonable bounds for registration.
 *
 * @param age - Age number or numeric string
 * @returns AgeValidationResult with isValid and errors
 */
export function validateAge(age: number | string): AgeValidationResult {
  const errors: string[] = [];
  const ageNum = typeof age === 'string' ? parseInt(age, 10) : age;

  if (isNaN(ageNum)) {
    errors.push('La edad debe ser un número válido');
    return { isValid: false, errors };
  }

  if (ageNum < 13) {
    errors.push('Debes tener al menos 13 años para registrarte');
  }

  if (ageNum > 120) {
    errors.push('La edad ingresada no es válida');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate a name field (first name, last name, etc.).
 *
 * @param name - The name string to validate
 * @param fieldName - Human-friendly field label used in error messages
 * @returns object with isValid boolean and errors array
 */
export function validateName(name: string, fieldName: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!name.trim()) {
    errors.push(`El ${fieldName} es requerido`);
    return { isValid: false, errors };
  }

  if (name.trim().length < 2) {
    errors.push(`El ${fieldName} debe tener al menos 2 caracteres`);
  }

  if (name.trim().length > 50) {
    errors.push(`El ${fieldName} no puede tener más de 50 caracteres`);
  }

  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-']+$/.test(name)) {
    errors.push(`El ${fieldName} solo puede contener letras, espacios, guiones y apostrofes`);
  }

  // Check for suspicious patterns
  if (/(.)\1{3,}/.test(name)) {
    errors.push(`El ${fieldName} no puede tener el mismo carácter repetido más de 3 veces`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitize an input string to remove simple XSS vectors.
 *
 * NOTE: This is a lightweight sanitizer intended for client-side
 * defensive measures. For server-side sanitization use a proven library.
 *
 * @param input - Raw user input
 * @returns sanitized string
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
}

/**
 * Generate a localized text label for a numeric password strength score.
 *
 * @param score - Numeric strength score (0-100)
 * @returns human-readable strength label
 */
export function getPasswordStrengthText(score: number): string {
  if (score >= 80) return 'Muy fuerte';
  if (score >= 60) return 'Fuerte';
  if (score >= 40) return 'Moderada';
  if (score >= 20) return 'Débil';
  return 'Muy débil';
}

/**
 * Map a password strength numeric score to a color hex code.
 *
 * @param score - Numeric strength score (0-100)
 * @returns hex color string suitable for UI indicators
 */
export function getPasswordStrengthColor(score: number): string {
  if (score >= 80) return '#4CAF50'; // Green
  if (score >= 60) return '#8BC34A'; // Light green
  if (score >= 40) return '#FFC107'; // Yellow
  if (score >= 20) return '#FF9800'; // Orange
  return '#F44336'; // Red
}

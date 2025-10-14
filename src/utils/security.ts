/**
 * Security utilities for STREAMIA application
 * Handles password validation, encryption, and security checks
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
 * Validate password strength
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
 * Validate email format and security
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
 * Validate age
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
 * Validate name fields
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
 * Sanitize input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
}

/**
 * Generate password strength indicator text
 */
export function getPasswordStrengthText(score: number): string {
  if (score >= 80) return 'Muy fuerte';
  if (score >= 60) return 'Fuerte';
  if (score >= 40) return 'Moderada';
  if (score >= 20) return 'Débil';
  return 'Muy débil';
}

/**
 * Generate password strength color
 */
export function getPasswordStrengthColor(score: number): string {
  if (score >= 80) return '#4CAF50'; // Green
  if (score >= 60) return '#8BC34A'; // Light green
  if (score >= 40) return '#FFC107'; // Yellow
  if (score >= 20) return '#FF9800'; // Orange
  return '#F44336'; // Red
}

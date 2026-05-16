/**
 * Validation utilities
 */

/**
 * Validate email format
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function validatePassword(password) {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
}

/**
 * Validate phone number
 */
export function validatePhone(phone) {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

/**
 * Validate required field
 */
export function validateRequired(value) {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
}

/**
 * Validate min length
 */
export function validateMinLength(value, minLength) {
  return value.length >= minLength;
}

/**
 * Validate max length
 */
export function validateMaxLength(value, maxLength) {
  return value.length <= maxLength;
}

/**
 * Validate numeric value
 */
export function validateNumeric(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

/**
 * Validate positive number
 */
export function validatePositive(value) {
  return validateNumeric(value) && parseFloat(value) > 0;
}

/**
 * Validate URL format
 */
export function validateUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate credit card number (basic check)
 */
export function validateCreditCard(cardNumber) {
  const cleaned = cardNumber.replace(/\s/g, '');
  return /^\d{13,19}$/.test(cleaned);
}

/**
 * Validate ZIP code
 */
export function validateZipCode(zipCode) {
  return /^\d{5}(-\d{4})?$/.test(zipCode);
}

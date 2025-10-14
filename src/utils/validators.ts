/**
 * Validate an email address format.
 *
 * Returns true when the provided string looks like an email.
 */
export function validateEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email)
}
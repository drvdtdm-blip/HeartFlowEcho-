/**
 * Hashes a string using SHA-256 via browser's SubtleCrypto.
 * Returns the hex representation.
 */
export async function hashPassword(password) {
  const msgUint8 = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

/**
 * Initializes the password hash in localStorage if it doesn't exist.
 */
export async function initPassword(password) {
  const hashed = await hashPassword(password);
  localStorage.setItem("echo_password_hash", hashed);
  return hashed;
}

/**
 * Verifies if the password matches the hash stored in localStorage.
 */
export async function verifyPassword(password) {
  const storedHash = localStorage.getItem("echo_password_hash");
  if (!storedHash) return false;
  const inputHash = await hashPassword(password);
  return inputHash === storedHash;
}

/**
 * Checks if the password hash has been initialized in localStorage.
 */
export function isPasswordSet() {
  return !!localStorage.getItem("echo_password_hash");
}

/**
 * Changes password from old to new. Returns true if successful, false otherwise.
 */
export async function changePassword(oldPassword, newPassword) {
  const match = await verifyPassword(oldPassword);
  if (!match) return false;
  
  const newHash = await hashPassword(newPassword);
  localStorage.setItem("echo_password_hash", newHash);
  return true;
}

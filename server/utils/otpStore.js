const otpStore = new Map();

function generateOtp(identifier, otp) {
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
  otpStore.set(identifier, { otp, expiresAt });
}

function validateOtp(identifier, otp) {
  const stored = otpStore.get(identifier);
  if (!stored) return false;

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(identifier);
    return false;
  }

  const isValid = stored.otp === otp;
  if (isValid) otpStore.delete(identifier); // Invalidate after use
  return isValid;
}

module.exports = { otpStore, generateOtp, validateOtp };

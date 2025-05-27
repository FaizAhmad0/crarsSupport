const { validateOtp } = require("../utils/otpStore");

module.exports = async (req, res) => {
  try {
    let { uid, otp } = req.body;
    const isValid = validateOtp(uid, otp);

    if (!isValid) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.status(200).json({ message: "OTP verified successfully!" });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ message: "Server error during OTP verification" });
  }
};

const User = require("../model/userModel");
const authService = require("../services/login");
const nodemailer = require("nodemailer");
const { generateOtp, otpStore } = require("../utils/otpStore");

module.exports = async (req, res) => {    
  try {
    const { uid, password } = req.body;

    const user = await User.findOne({ uid });

    if (!user) {
      return res.status(404).json({ message: "User does not exist!" });
    }

    const token = await authService(uid, password);

    if (user.role !== "user") {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      generateOtp(uid, otp);

      console.log(
        `OTP for ${uid}: ${otp}, expires at: ${new Date(
          otpStore.get(uid).expiresAt
        )}`
      );

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: "mdfaizahmad1020@gmail.com",
        subject: "Your OTP for Login",
        text: `Hello ${user.name},\n\nYour OTP is: ${otp}\nIt will expire in 5 minutes.\n\nThank you.`,
      };

      await transporter.sendMail(mailOptions);

      return res.status(200).json({
        message: "OTP sent to your email!",
        requiresOtp: true,
        token,
        role: user.role,
        name: user.name,
        email: user.email,
        uid: user.uid,
        enrollmentIdAmazon: user.enrollmentIdAmazon,
        enrollmentIdWebsite: user.enrollmentIdWebsite,
        id: user._id,
        phone: user.primaryContact,
      });
    }

    // If role is user
    res.status(200).json({
      token,
      name: user.name,
      email: user.email,
      uid: user.uid,
      enrollmentIdAmazon: user.enrollmentIdAmazon,
      enrollmentIdWebsite: user.enrollmentIdWebsite,
      message: "Logged in successfully!",
      id: user._id,
      role: user.role,
      phone: user.primaryContact,
    });
  } catch (error) {
    console.error("Error during user login:", error);
    res.status(500).json({ error: "Server error during login!" });
  }
};

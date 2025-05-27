const express = require("express");
const router = express.Router();
const login = require("../controller/Login");
const verifyOtp = require("../controller/verifyOtp");

// Route for login
router.post("/", login);
router.post("/verifyOtp", verifyOtp);

module.exports = router;

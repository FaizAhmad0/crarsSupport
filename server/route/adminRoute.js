const express = require("express");
const getAllTicket = require("../controller/getAllTicket");
const getAllAppointment = require("../controller/getAllAppointment");
const router = express.Router();

router.get("/getalltickets",getAllTicket);
router.get("/getallappointments",getAllAppointment);

module.exports = router;

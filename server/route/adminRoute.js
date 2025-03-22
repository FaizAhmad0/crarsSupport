const express = require("express");
const getAllTicket = require("../controller/getAllTicket");
const getAllAppointment = require("../controller/getAllAppointment");
const getAllComplaints = require("../controller/getAllComplaints");
const completComplaint = require("../controller/completComplaint");
const router = express.Router();

router.get("/getalltickets", getAllTicket);
router.get("/getallappointments", getAllAppointment);
router.get("/getallcomplaints", getAllComplaints);
router.post("/markcomplaintcompleted", completComplaint);
module.exports = router;

const express = require("express");
const router = express.Router();

const getAllMangerTicket = require("../controller/getAllMangerTicket");
const getAllManagerAppointment = require("../controller/getAllManagerAppointment");
const markAppComplete = require("../controller/markAppComplete");
const getAllManagerComplaints = require("../controller/getAllManagerComplaints");

// Route for login
router.get("/getmanagerticket", getAllMangerTicket);
router.get("/getallappointments", getAllManagerAppointment);
router.get("/getallcomplaints", getAllManagerComplaints);
router.post("/markappointmentcompleted", markAppComplete);

module.exports = router;

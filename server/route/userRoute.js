const express = require("express");
const router = express.Router();
const createNewTicket = require("../controller/createNewTicket");
const getAllUserTicket = require("../controller/getAllUserTicket");
const getSpecificTicket = require("../controller/getSpecificTicket");
const addCommnetToTicket = require("../controller/addCommnetToTicket");
const newAppointment = require("../controller/newAppointment");
const getAllUserAppointment = require("../controller/getAllUserAppointment");
const addAppointmentReview = require("../controller/addAppointmentReview");
const getUserDetails = require("../controller/getUserDetails");
const getAllManagers = require("../controller/getAllManagers");

// Route for login
router.get("/getallmanager", getAllManagers);
router.get("/getalltickets", getAllUserTicket);
router.post("/newticket", createNewTicket);
router.get("/getticketdetails", getSpecificTicket);
router.post("/commenttoticket", addCommnetToTicket);
router.post("/bookappointment", newAppointment);
router.get("/getallappointments", getAllUserAppointment);
router.post("/submitreview", addAppointmentReview);
router.get("/:uid", getUserDetails);

module.exports = router;

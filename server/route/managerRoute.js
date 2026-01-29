// const express = require("express");
// const router = express.Router();

// const getAllMangerTicket = require("../controller/getAllMangerTicket");
// const getAllManagerAppointment = require("../controller/getAllManagerAppointment");
// const markAppComplete = require("../controller/markAppComplete");
// const getAllManagerComplaints = require("../controller/getAllManagerComplaints");

// // Route for login
// router.get("/getmanagerticket", getAllMangerTicket);
// router.get("/getallappointments", getAllManagerAppointment);
// router.get("/getallcomplaints", getAllManagerComplaints);
// router.post("/markappointmentcompleted", markAppComplete);

// module.exports = router;

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const getAllMangerTicket = require("../controller/getAllMangerTicket");
const getAllManagerAppointment = require("../controller/getAllManagerAppointment");
const markAppComplete = require("../controller/markAppComplete");
const getAllManagerComplaints = require("../controller/getAllManagerComplaints");

const { addManager, removeManager } = require("../sseManager");

// 🔔 MANAGER SSE CONNECTION
router.get("/notifications", (req, res) => {
  const token =
    req.cookies?.token ||
    req.query.token ||
    req.headers.authorization?.split(" ")[1];

    console.log(token)

  if (!token) return res.status(401).end();

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).end();
  }

  if (decoded.role !== "manager") {
    return res.status(403).end();
  }

  const managerId = decoded.id;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  addManager(managerId, res);

  res.write(`data: ${JSON.stringify({ type: "CONNECTED" })}\n\n`);
  console.log("working perfactly");

  req.on("close", () => {
    removeManager(managerId);
  });
});

// EXISTING ROUTES
router.get("/getmanagerticket", getAllMangerTicket);
router.get("/getallappointments", getAllManagerAppointment);
router.get("/getallcomplaints", getAllManagerComplaints);
router.post("/markappointmentcompleted", markAppComplete);

module.exports = router;

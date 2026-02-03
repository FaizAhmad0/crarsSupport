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
const { addQuery } = require("../controller/addQuery");
const { getQueries } = require("../controller/getQueries");
const { markSolved } = require("../controller/markSolved");
const { addFeedback } = require("../controller/addFeedback");
const { getQuerySummary } = require("../controller/getQuerySummary");

// MANAGER SSE CONNECTION
router.get("/notifications", (req, res) => {
  const token =
    req.cookies?.token ||
    req.query.token ||
    req.headers.authorization?.split(" ")[1];

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

  const keepAlive = setInterval(() => {
    res.write(`event: ping\ndata: {}\n\n`);
  }, 25000);

  req.on("close", () => {
    clearInterval(keepAlive);
  });
});

// EXISTING ROUTES
router.get("/getmanagerticket", getAllMangerTicket);
router.get("/getallappointments", getAllManagerAppointment);
router.get("/getallcomplaints", getAllManagerComplaints);
router.get("/get-queries", getQueries);
router.get("/query-summary", getQuerySummary);
router.post("/markappointmentcompleted", markAppComplete);
router.post("/add-query", addQuery);
router.put("/mark-solved", markSolved);
router.put("/add-feedback", addFeedback);

module.exports = router;

// index.js
const express = require("express");
const mongoose = require("mongoose");
const User = require("../model/userModel");
const Appointment = require("../model/appointmentModel");
const Ticket = require("../model/ticketModel");
const dotenv = require("dotenv");

const app = express();
const PORT = 8500;
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const deleteAppointmentsForJan14And15 = async () => {
  try {
    // 14 Jan 00:00:00 → 16 Jan 00:00:00
    const startDate = new Date("2026-01-14T00:00:00.000Z");
    const endDate = new Date("2026-01-16T00:00:00.000Z");

    const result = await Ticket.deleteMany({
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    console.log(`Deleted ${result.deletedCount} appointments`);
  } catch (error) {
    console.error("Error deleting appointments:", error);
  }
};

deleteAppointmentsForJan14And15();

const findUsersByUID = async () => {
  try {
    // Query the database to find users by batch
    const users = await User.findOne({ uid: 4468 }); // Assumes `batch` is a field in the User model
    console.log(users);
  } catch (error) {
    console.error("Error finding users:", error);
    return [];
  }
};

// Call the function with the batch value
// findUsersByUID();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

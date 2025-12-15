const Appointment = require("../model/appointmentModel");

module.exports = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const allAppointment = await Appointment.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    res.status(200).json({
      message: "Today's appointments fetched successfully.",
      appointments: allAppointment,
    });
  } catch (error) {
    console.error("Error fetching Appointment:", error);
    res.status(500).json({
      message: "An error occurred while fetching Appointment.",
      error: error.message,
    });
  }
};

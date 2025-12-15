const Appointment = require("../model/appointmentModel");

module.exports = async (req, res) => {
  try {
    let { slot, manager } = req.body;
    // today range
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const isBooked = await Appointment.findOne({
      manager,
      slot,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    if (isBooked) {
      return res.status(409).json({
        message: "Slot is already booked",
      });
    }

    // const appData = new Appointment({
    //   slot,
    //   manager,
    //   date: new Date(),
    // });
    // await appData.save();

    res.status(200).json({
      message:
        "Your appointment has been successfully booked. Our manager will contact you within 24 to 48 hours.",
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ message: "Could not create new appointment!" });
  }
};

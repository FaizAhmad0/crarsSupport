// const Appointment = require("../model/appointmentModel");

// module.exports = async (req, res) => {
//   try {
//     let { slot, manager } = req.body;
//     // today range
//     const startOfDay = new Date();
//     startOfDay.setHours(0, 0, 0, 0);

//     const endOfDay = new Date();
//     endOfDay.setHours(23, 59, 59, 999);

//     const isBooked = await Appointment.findOne({
//       manager,
//       slot,
//       createdAt: { $gte: startOfDay, $lte: endOfDay },
//     });

//     if (isBooked) {
//       return res.status(409).json({
//         message: "Slot is already booked",
//       });
//     }

//     const appData = new Appointment(req.body);
//     await appData.save();

//     res.status(200).json({
//       message:
//         "Your appointment has been successfully booked. Our manager will contact you within 24 to 48 hours.",
//     });
//   } catch (error) {
//     console.error("Error creating appointment:", error);
//     res.status(500).json({ message: "Could not create new appointment!" });
//   }
// };
const Appointment = require("../model/appointmentModel");
const { notifyManager } = require("../sseManager");
const User = require("../model/userModel");


module.exports = async (req, res) => {
  try {
    const { slot, manager } = req.body;
    console.log(manager);

    const managerDoc = await User.findOne({ name: manager, role: "manager" });
    if (!managerDoc)
      return res.status(404).json({ message: "Manager not found" });

    const managerId = managerDoc._id;

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
      return res.status(409).json({ message: "Slot is already booked" });
    }

    const appointment = new Appointment(req.body);
    await appointment.save();

    // 🔔 NOTIFY MANAGER
    notifyManager(managerId, {
      type: "NEW_APPOINTMENT",
      appointmentId: appointment._id,
      user: appointment.enrollment,
      slot,
      message: "New appointment booked",
    });

    res.status(200).json({
      message: "Appointment booked successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Error booking appointment" });
  }
};

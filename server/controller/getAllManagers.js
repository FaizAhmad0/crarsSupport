const User = require("../model/userModel");

module.exports = async (req, res) => {
  console.log("Fetching managers...");
  try {
    // Query to find all users with the role "manager"
    const managers = await User.find({ role: "manager" });
    // Check if any managers were found
    if (!managers || managers.length === 0) {
      return res.status(404).json({ message: "No managers found" });
    }
    // Log and send the response
    res.status(200).json({
      message: "Managers fetched successfully",
      managers,
    });
  } catch (error) {
    console.error("Error fetching managers:", error);
    res.status(500).json({
      error: "Server error while fetching managers",
      details: error.message, // Optional: Include error details for debugging
    });
  }
};

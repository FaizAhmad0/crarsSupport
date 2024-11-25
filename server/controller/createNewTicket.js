const Ticket = require("../model/ticketModel");

module.exports = async (req, res) => {
  try {
    // Create a new ticket using the data from the request body
    const ticketData = new Ticket(req.body);

    // Save the new ticket to the database
    await ticketData.save();

    // Send success response
    res.status(201).json({ message: "New ticket created successfully!" });
  } catch (error) {
    // Log the error with more information
    console.error("Error creating ticket:", error);

    // Send error response with appropriate status code (500 for server error)
    res.status(500).json({ message: "Could not create new ticket!" });
  }
};

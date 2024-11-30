const Ticket = require("../model/ticketModel");
const User = require("../model/userModel");
const doubletick = require("@api/doubletick"); // Ensure this is installed

// Authenticate with Double Tick API
doubletick.auth("key_49uMaEQ635"); // Replace with your actual API key

module.exports = async (req, res) => {
  try {
    const { name } = req.body;

    // Find user by name
    const user = await User.findOne({ name: name });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const phone = user.primaryContact;

    // Create a new ticket using the data from the request body
    const ticketData = new Ticket(req.body);

    // Save the new ticket to the database
    await ticketData.save();

    // Send WhatsApp message using Double Tick API
    const whatsappMessage = {
      messages: [
        {
          content: {
            language: "en", // Language of the template
            templateData: {
              buttons: [
                {
                  type: "URL",
                  url: "https://example.com/tickets", // Update to your relevant URL
                  title: "View Ticket",
                },
              ],
            },
            templateName: "hello", // Replace with your actual Double Tick template name
          },
          from: "Double Tick", // Sender information
          to: phone, // User's WhatsApp number
        },
      ],
    };

    await doubletick
      .outgoingMessagesWhatsappTemplate(whatsappMessage)
      .then(({ data }) => {
        console.log("WhatsApp message sent:", data);
      })
      .catch((err) => {
        console.error("Error sending WhatsApp message:", err);
        throw new Error("WhatsApp message failed");
      });

    // Send success response
    res.status(201).json({
      message: "New ticket created and WhatsApp message sent successfully!",
    });
  } catch (error) {
    console.error("Error creating ticket or sending WhatsApp message:", error);
    res
      .status(500)
      .json({ message: "Could not create ticket or send message" });
  }
};

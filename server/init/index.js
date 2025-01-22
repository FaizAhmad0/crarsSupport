// index.js
const express = require("express");
const mongoose = require("mongoose");
const User = require("../model/userModel");

const app = express();
const PORT = 8500;

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://saumic:saumic123@cluster0.pxceo4x.mongodb.net/crm?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const findUsersByBatch = async (batch) => {
  try {
    // Query the database to find users by batch
    const users = await User.find({ batchAmazon: batch }); // Assumes `batch` is a field in the User model
    const deleteResult = await User.deleteMany({ role: "user" });
    if (!users || users.length === 0) {
      console.log("No users found for the given batch");
      return [];
    }

    console.log(`Found ${users.length} user(s):`);
    users.forEach((user, index) => {
      console.log(`User ${index + 1}:`, user);
    });

    return users;
  } catch (error) {
    console.error("Error finding users:", error);
    return [];
  }
};

// Call the function with the batch value
findUsersByBatch("190125");

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

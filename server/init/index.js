// index.js
const express = require("express");
const mongoose = require("mongoose");
const User = require("../model/userModel");

const app = express();
const PORT = 8500;

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://saumic:saumicNewData@cluster0.4b4er14.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const findUsersByBatch = async () => {
  try {
    // Query the database to find users by batch
    const users = await User.findOne({ role: "admin" }); // Assumes `batch` is a field in the User model
    console.log(users);
    users.password = "SSR@15@2002";
    await users.save();
  } catch (error) {
    console.error("Error finding users:", error);
    return [];
  }
};

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

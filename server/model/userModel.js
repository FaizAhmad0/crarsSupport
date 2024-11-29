const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    primaryContact: { type: String },

    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
      type: String,
      enum: ["user", "manager", "admin", "supervisor"],
      required: true,
      default: "user",
    },
    managers: [{ type: Schema.Types.ObjectId, ref: "User" }], // Array of manager references

    // for user
    uid: { type: String },
    dateAmazon: { type: String },
    dateWebsite: { type: String },
    enrollmentIdAmazon: { type: String },
    enrollmentIdWebsite: { type: String },
    batch: { type: String },

    // for manager
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

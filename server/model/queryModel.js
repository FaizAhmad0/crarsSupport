const mongoose = require("mongoose");

const querySchema = new mongoose.Schema(
  {
    enrollment: {
      type: String,
      required: true,
      trim: true,
    },

    concern: {
      type: String,
      required: true,
      trim: true,
    },

    raisedBy: {
      type: String,
      required: true,
    },
    raisedTo: {
      type: String,
      required: true,
    },

    department: {
      type: String,
      department: {
        type: String,
        enum: [
          "Amazon",
          "Website",
          "Dispatch",
          "Account",
          "Telesales",
          "Customer-support",
        ],
        required: true,
      },
      required: true,
    },

    source: {
      type: String,
      enum: [
        "DoubleTick",
        "Feedback",
        "Superfone",
        "AI Sensey",
        "Whatsapp",
        "Support-portal",
        "Social-media",
      ],
      required: true,
    },

    status: {
      type: String,
      enum: ["New", "Solved", "Feedback"],
      default: "New",
      index: true,
    },

    deadline: {
      type: Date,
      required: true,
    },

    solvedAt: {
      type: Date,
    },
    solvedVia: {
      type: String,
      enum: [
        "DoubleTick",
        "Feedback",
        "Superfone",
        "AI-Sensey",
        "Whatsapp",
        "Support-portal",
        "Social-media",
      ],
    },
    solvedBy: {
      type: String,
    },
    csManager: {
      type: String,
    },

    feedback: {
      type: String,
      trim: true,
    },
    feedbackAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Query", querySchema);

// controllers/manager.controller.js

const Query = require("../model/queryModel"); // adjust model name if needed

exports.addFeedback = async (req, res) => {
  try {
    const { record_id, feedback, csManager } = req.body;

    if (!record_id || !feedback || !csManager) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const updated = await Query.findByIdAndUpdate(
      record_id,
      {
        feedback,
        csManager,
        status: "Feedback",
        feedbackAt: new Date(),
      },
      { new: true },
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Feedback added successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Add feedback error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while adding feedback",
    });
  }
};

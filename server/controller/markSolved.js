// controllers/managerController.js
const Query = require("../model/queryModel"); // adjust path if needed

exports.markSolved = async (req, res) => {
  try {
    const { record_id, solvedVia, solvedBy } = req.body;

    if (!record_id || !solvedVia || !solvedBy) {
      return res.status(400).json({
        success: false,
        message: "record_id, solvedVia and solvedBy are required",
      });
    }

    const updatedQuery = await Query.findByIdAndUpdate(
      record_id,
      {
        status: "Solved",
        solvedVia,
        solvedBy,
        solvedAt: new Date(),
      },
      { new: true },
    );

    if (!updatedQuery) {
      return res.status(404).json({
        success: false,
        message: "Query not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Query marked as solved successfully",
      data: updatedQuery,
    });
  } catch (error) {
    console.error("Mark solved error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

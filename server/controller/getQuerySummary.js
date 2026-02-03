const Query = require("../model/queryModel");

exports.getQuerySummary = async (req, res) => {
  try {
    let { name, role, startDate, endDate } = req.query;

    if (!role) {
      return res
        .status(400)
        .json({ success: false, message: "role is required" });
    }

    const filter = {};

    //Same role logic as getQueries
    if (role && !["admin", "supervisor"].includes(role.toLowerCase()) && name) {
      filter.$or = [{ raisedBy: name }, { raisedTo: name }];
    }


    // Only counts (single time)
    const [total, solved, feedback, pending] = await Promise.all([
      Query.countDocuments(filter),
      Query.countDocuments({ ...filter, status: "Solved" }),
      Query.countDocuments({ ...filter, status: "Feedback" }),
      Query.countDocuments({ ...filter, status: "New" }),
    ]);


    return res.status(200).json({
      success: true,
      data: {
        total,
        solved,
        feedback,
        pending,
      },
    });
  } catch (error) {
    console.error("getQuerySummary error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching query summary",
    });
  }
};

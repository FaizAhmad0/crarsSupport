const Query = require("../model/queryModel");

/**
 * @desc   Create new support query
 * @route  POST /manager/add-query
 * @access Manager / Admin
 */
const addQuery = async (req, res) => {
  try {
    const {
      enrollment,
      concern,
      raisedTo,
      department,
      source,
      deadline,
      status,
      raisedBy,
    } = req.body;

    if (
      !enrollment ||
      !concern ||
      !raisedTo ||
      !department ||
      !source ||
      !deadline
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided.",
      });
    }

    const newQuery = new Query({
      enrollment: enrollment.trim(),
      concern: concern.trim(),
      raisedTo,
      department,
      source,
      deadline,
      status: status || "New",
      raisedBy, 
    });

    await newQuery.save();

    return res.status(201).json({
      success: true,
      message: "Query created successfully.",
      query: newQuery,
    });
  } catch (error) {
    console.error("Add Query Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating query.",
    });
  }
};

module.exports = {
  addQuery,
};

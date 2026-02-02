const Query = require("../model/queryModel");

/**
 * @desc   Get queries with filters, pagination, and role-based access
 * @route  GET /manager/get-queries
 * @access All roles (role & name sent from frontend)
 */
const getQueries = async (req, res) => {
  try {
    let {
      status,
      name,
      role,
      startDate,
      endDate,
      page = 1,
      limit = 100,
    } = req.query;


    page = parseInt(page);
    limit = parseInt(limit);

    const filter = {};

    if (status) filter.status = status;

    if (role && !["admin", "supervisor"].includes(role.toLowerCase()) && name) {
      filter.$or = [{ raisedBy: name }, { raisedTo: name }];
    }

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

 
    const total = await Query.countDocuments(filter);

    const queries = await Query.find(filter)
      .sort({ createdAt: -1 }) // newest first
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      success: true,
      total,
      page,
      pageSize: limit,
      data: queries,
    });
  } catch (error) {
    console.error("Get Queries Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching queries",
    });
  }
};

module.exports = { getQueries };

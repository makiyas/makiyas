import asyncHandler from "express-async-handler";
import ReturnExchange from "../models/returnExchangeModel.js";

// @desc    Create a Complaint
// @route   POST /api/products
// @access  Private/Admin
const getComplaint = asyncHandler(async (req, res) => {
  const conplaints = await ReturnExchange.find({});
  res.status(201).json(conplaints);
});

export { getComplaint };

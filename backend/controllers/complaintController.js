import asyncHandler from "express-async-handler";
import Complaint from "../models/complaintModel.js";

// @desc    Create a Complaint
// @route   POST /api/products
// @access  Private/Admin
const getComplaint = asyncHandler(async (req, res) => {
  const conplaints = await Complaint.find({});
  res.status(201).json(conplaints);
});

export { getComplaint };

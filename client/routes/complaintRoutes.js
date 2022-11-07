import express from "express";

// custom middleware
import { protect } from "../middleware/authMiddleware.js";

// Complaint Controller
import { getComplaint } from "../controllers/complaintController.js";

// initialize router
const router = express.Router();

router.route("/").get(protect, getComplaint);

export default router;

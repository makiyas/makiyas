import express from "express";

// custom middleware
import { protect, admin } from "../middleware/authMiddleware.js";

// product controllers
import {
  addSliderkids,
  getSliderkids,
  updateSliderkids,
} from "../controllers/sliderkidsController.js";

// initialize router
const router = express.Router();

// api routes
router.route("/").post(addSliderkids).get(getSliderkids).put(updateSliderkids);

export default router;

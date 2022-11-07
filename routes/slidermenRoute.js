import express from "express";

// custom middleware
import { protect, admin } from "../middleware/authMiddleware.js";

// product controllers
import {
  addSlidermen,
  getSlidermen,
  updateSlidermen,
} from "../controllers/slidermenController.js";

// initialize router
const router = express.Router();

// api routes
router.route("/").post(addSlidermen).get(getSlidermen).put(updateSlidermen);

export default router;

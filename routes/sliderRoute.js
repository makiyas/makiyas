import express from "express";

// custom middleware
import { protect, admin } from "../middleware/authMiddleware.js";

// product controllers
import {
  addSlider,
  getSlider,
  updateSlider,
} from "../controllers/sliderController.js";

// initialize router
const router = express.Router();

// api routes
router.route("/").post(addSlider).get(getSlider).put(updateSlider);

export default router;

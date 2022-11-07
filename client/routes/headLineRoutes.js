import express from "express";

// custom middleware
import { protect, admin } from "../middleware/authMiddleware.js";

// product controllers
import {
  createHeadline,
  getHeadLine,
  updateHeadline,
  //   deleteColour,
} from "../controllers/headLineController.js";

// initialize router
const router = express.Router();

// api routes
router.route("/").post(createHeadline).get(getHeadLine);
router.route("/:id").put(protect, updateHeadline);
//   .delete(protect, admin, deleteColour);

// router.route("/:id").post(protect, createProductReview);

export default router;

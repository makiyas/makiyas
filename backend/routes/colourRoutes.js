import express from "express";

// custom middleware
import { protect, admin } from "../middleware/authMiddleware.js";

// product controllers
import {
  createColour,
  getColour,
  updateColour,
  deleteColour,
} from "../controllers/colourController.js";

// initialize router
const router = express.Router();

// api routes
router.route("/").post(createColour).get(getColour);
router
  .route("/:id")
  .put(protect, admin, updateColour)
  .delete(protect, admin, deleteColour);

// router.route("/:id").post(protect, createProductReview);

export default router;

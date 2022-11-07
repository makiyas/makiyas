import express from "express";

// custom middleware
import { protect, admin } from "../middleware/authMiddleware.js";

// product controllers
import {
  createType,
  getType,
  updateType,
  deleteType,
} from "../controllers/typeController.js";

// initialize router
const router = express.Router();

// api routes
router.route("/").post(createType).get(getType);
router
  .route("/:id")
  .put(protect, admin, updateType)
  .delete(protect, admin, deleteType);

// router.route("/:id").post(protect, createProductReview);

export default router;

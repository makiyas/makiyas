import express from "express";

// custom middleware
import { protect, admin } from "../middleware/authMiddleware.js";

// product controllers
import {
  createMaincategory,
  getMaincategory,
  updateMaincategory,
  deleteMaincategory,
} from "../controllers/maincategoryController.js";

// initialize router
const router = express.Router();

// api routes
router.route("/").post(createMaincategory).get(getMaincategory);
router
  .route("/:id")
  .put(protect, admin, updateMaincategory)
  .delete(protect, admin, deleteMaincategory);

// router.route("/:id").post(protect, createProductReview);

export default router;

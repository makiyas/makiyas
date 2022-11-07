import express from "express";

// custom middleware
import { protect, admin } from "../middleware/authMiddleware.js";

// product controllers
import {
  createSocialLinks,
  getSocialLinks,
  updateSocialLinks,
  deleteSocialLinks,
} from "../controllers/socialLinksController.js";

// initialize router
const router = express.Router();

// api routes
router.route("/").post(createSocialLinks).get(getSocialLinks);
router
  .route("/:id")
  .put(protect, admin, updateSocialLinks)
  .delete(protect, admin, deleteSocialLinks);

// router.route("/:id").post(protect, createProductReview);

export default router;

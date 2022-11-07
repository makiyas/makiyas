import express from "express";

// custom middleware
import { protect, admin } from "../middleware/authMiddleware.js";

// product controllers
import {
  getClients,
  getOneClient,
  deleteOne,
} from "../controllers/chatController.js";

// initialize router
const router = express.Router();

// api routes
router.route("/").get(getClients);
router.route("/:id").get(getOneClient);
// router.route("/:id").delete(deleteOne).get(getOneClient);
// router.route("/:id").post(protect, createProductReview);

export default router;

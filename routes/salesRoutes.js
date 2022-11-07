import express from "express";
import {
  getSales,
  getSalesById,
  createSales,
  updateSale,
  deleteSale,
} from "../controllers/saleController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

// initialize router
const router = express.Router();

// sales route
router.route("/").get(getSales).post(protect, admin, createSales);
router
  .route("/:id")
  .get(getSalesById)
  .put(protect, admin, updateSale)
  .delete(protect, admin, deleteSale);

export default router;

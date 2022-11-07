import express from "express";

// custom middleware
import { protect, admin } from "../middleware/authMiddleware.js";

// product controllers
import {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
  getSearchedProducts,
  getCategoryWithProducts,
} from "../controllers/productController.js";

// initialize router
const router = express.Router();

//product api routes
router.route("/").get(getProducts).post(protect, admin, createProduct);
router.route("/withCategory").get(getCategoryWithProducts);
router.route("/:id/reviews").post(protect, createProductReview);
router.get("/top", getTopProducts);
router.route("/search").post(getSearchedProducts);
router
  .route("/:id")
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct);

export default router;

import express from 'express';

// custom middleware
import { protect, admin } from '../middleware/authMiddleware.js';

// product controllers
import {
  createCategory,
  getCategory,
  getCategoryByName,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getProductsByCategory,
  getProductsByPriceRange,
  getProductsByColour,
  getProductsByType,
  getProductsByFabric,
} from '../controllers/categoryController.js';

// initialize router
const router = express.Router();

// api routes
router.route('/').post(protect, admin, createCategory).get(getCategory);
router.route('/name').get(getCategoryByName);
router
  .route('/:id')
  .get(getCategoryById)
  .put(protect, admin, updateCategory)
  .delete(protect, admin, deleteCategory);

router.route('/:id/products').get(getProductsByCategory);
router.route('/:id/products/price').get(getProductsByPriceRange);
router.route('/:id/products/colour').get(getProductsByColour);
router.route('/:id/products/type').get(getProductsByType);
router.route('/:id/products/fabric').get(getProductsByFabric);
// router.route("/:id").post(protect, createProductReview);

export default router;

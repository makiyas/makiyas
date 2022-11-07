import express from "express";
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  forgotPassword,
  resetPassword,
  updateBlockedKey,
  userPasswordChange,
  verifyUser,
  submitContactInfo,
  createComplaintEmail,
  createExchangeRequest,
  addToWishListOfUser,
  removeFromWishListOfUser,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

// initialize router
const router = express.Router();

// register route
router.route("/register").post(registerUser);
router.route("/register/verify/otp").post(verifyUser);

// login route
router.route("/login").post(authUser);

// forgotPassword route
router.route("/forgotpassword").post(forgotPassword);
router.route("/submitContactInfo").post(submitContactInfo);

// resetPassword route
router.route("/passwordreset/:resetToken").post(resetPassword);
router.route("/createComplaintEmail").post(createComplaintEmail);
router.route("/createExchangeRequest").post(createExchangeRequest);

router.route("/changePassword").post(protect, userPasswordChange);
// user profile route ( update )
router
  .route("/profile/:id")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.route("/addToWishlist/:id").put(protect, addToWishListOfUser);
router.route("/removeFromWishlist/:id").put(protect, removeFromWishListOfUser);

// user routes for admin
router
  .route("/admin/profile/:id")
  .delete(deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);
router.route("/admin/profiles").get(protect, admin, getUsers);
router
  .route("/admin/profiles/blockedKey/:id")
  .patch(protect, admin, updateBlockedKey);

export default router;

const express = require("express");
const {
  createUser,
  loginUserCtrl,
  getAllUser,
  getAUser,
  DelaUser,
  updatedaUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdmin,
  getwishlist,
  saveAddress,
  userCart,
  getUserCart,
  createOrder,
  removeProuctFromCart,
  updateProductQuantityFromCart,
} = require("../controller/userCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { checkout, paymentVerification } = require("../controller/paymentCtrl");
const router = express.Router();

router.post("/register", createUser); //Register a User
router.post("/forgot-password-token", forgotPasswordToken); // Forgot Password
router.put("/reset-password/:token", resetPassword); // Reset Password
router.put("/password", authMiddleware, updatePassword); // Update a Password
router.post("/login", loginUserCtrl); // Login a User
router.post("/admin-login", loginAdmin); // Admin Login
router.post("/cart", authMiddleware, userCart); // Cart
router.post("/order/checkout", authMiddleware, checkout);
router.post("/order/paymentVerification", authMiddleware, paymentVerification);
// router.post("/cart/applyCoupon", authMiddleware, applyCoupon); // Apply Coupon
router.post("/cart/create-order", authMiddleware, createOrder); // Create Order
router.get("/all-users", getAllUser); // Get all User
// router.get("/get-orders", authMiddleware, getOrders); // Get Orders
// router.get("/getallorders", authMiddleware, isAdmin, getallOrders); // Get all Orders
// router.post("/getorderbyuser/:id", authMiddleware, isAdmin, getallOrders); // Get all Orders
router.get("/refresh", handleRefreshToken); // Refresh Token
router.delete("/logout", logout); // Logout
router.get("/wishlist", authMiddleware, getwishlist); // Wishlist
router.get("/cart", authMiddleware, getUserCart); // Get a Cart
router.get("/:id", authMiddleware, isAdmin, getAUser); // Get a User
// router.delete("/empty-cart", authMiddleware, emptyCart); // Empty Cart
router.delete(
  "/delete-product-cart/:cartItemId",
  authMiddleware,
  removeProuctFromCart
); // Empty Cart
router.delete(
  "/update-product-cart/:cartItemId/:newQuantity",
  authMiddleware,
  updateProductQuantityFromCart
); // Update Product Cart Quantity
router.delete("/:id", DelaUser); // Delete a User
// router.put(
//   "/order/update-order/:id",
//   authMiddleware,
//   isAdmin,
//   updateOrderStatus
// ); // Update Order Status
router.put("/edit-user", authMiddleware, updatedaUser); // Update a User
router.put("/save-address", authMiddleware, saveAddress); // Save Address
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser); // Block a User
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser); // Unblock a User
module.exports = router;

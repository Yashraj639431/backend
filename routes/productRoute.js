const express = require("express");
const {
  createProduct,
  getaProduct,
  getAllProduct,
  updateaProduct,
  deleteaProduct,
  addToWishlist,
  rating,
} = require("../controller/productCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createProduct);
router.get("/:id", getaProduct);
router.put("/wishlist",authMiddleware, addToWishlist);
router.put("/rating", authMiddleware, rating);

router.put("/:id", authMiddleware, isAdmin, updateaProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteaProduct);
router.get("/", getAllProduct);

module.exports = router;

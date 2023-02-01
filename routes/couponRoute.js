const express = require("express");
const {
  createCoupon,
  getallCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../controller/couponCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createCoupon);

router.put("/:id", authMiddleware, isAdmin, updateCoupon);

router.get("/", authMiddleware, isAdmin, getallCoupon);

router.delete("/:id", authMiddleware, isAdmin, deleteCoupon);

module.exports = router;
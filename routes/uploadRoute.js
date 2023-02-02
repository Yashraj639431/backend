const express = require("express");
const { deleteImages, uploadImages } = require("../controller/uploadCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const {
  uploadPhoto,
  productImgResize,
} = require("../middlewares/uploadImages");
const router = express.Router();

router.post(
  "/",
  // authMiddleware,
  // isAdmin,
  uploadPhoto.array("images", 10),
  productImgResize,
  uploadImages
);

// router.delete("/delete-img/:id", authMiddleware, isAdmin, deleteImages);
router.delete("/delete-img/:id", deleteImages);

module.exports = router;

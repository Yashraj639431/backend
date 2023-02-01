const express = require("express");
const { createcolor, updatecolor, deletecolor, getcolor, getallcolor } = require("../controller/colorCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createcolor);
router.put("/:id", authMiddleware, isAdmin, updatecolor);
router.delete("/:id", authMiddleware, isAdmin, deletecolor);
router.get("/:id", getcolor);
router.get("/", getallcolor);
module.exports = router;

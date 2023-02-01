const express = require("express");
const { createbrand, updatebrand, deletebrand, getbrand, getallbrand } = require("../controller/brandCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createbrand);
router.put("/:id", authMiddleware, isAdmin, updatebrand);
router.delete("/:id", authMiddleware, isAdmin, deletebrand);
router.get("/:id", getbrand);
router.get("/", getallbrand);
module.exports = router;

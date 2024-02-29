const express = require("express");
const { add, edit, deleteProduct, getProduct, getAllProducts} = require("../controllers/productController");
const protect = require("../middlewares/authMiddleware");
const adminProtect = require("../middlewares/adminMiddleware");

const router = express.Router();

router.post("/add", protect, adminProtect, add);
router.post("/edit", protect, adminProtect, edit);
router.delete("/delete", protect, adminProtect, deleteProduct);
router.get("/get/:id", protect, adminProtect, getProduct);
router.get("/getAll", protect, adminProtect, getAllProducts);

module.exports = router;
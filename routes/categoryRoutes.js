const express = require("express");
const {addCategory, editCategory, getCategory, getAllCategory} = require("../controllers/categoryController");
const protect = require("../middlewares/authMiddleware");
const adminProtect = require("../middlewares/adminMiddleware");
const {categoryUpload} = require("../utils/multer");

const router = express.Router();

//secured routes
router.post('/add',protect, adminProtect, categoryUpload.single('image'), addCategory);
router.post('/edit/:id',protect, adminProtect, categoryUpload.single('image'), editCategory);
router.get('/get/:id',protect, adminProtect, getCategory);
router.get('/getAll',protect, adminProtect, getAllCategory);

module.exports = router;
const express = require("express");
const {addCategory, editCategory, getCategory, getAllCategory} = require("../controllers/categoryController");
const protect = require("../middlewares/authMiddleware");
const adminProtect = require("../middlewares/adminMiddleware");

const router = express.Router();

//secured routes
router.post('/add',protect, adminProtect, addCategory);
router.post('/edit/:id',protect, adminProtect, editCategory);
router.get('/get/:id',protect, adminProtect, getCategory);
router.get('/getAll',protect, adminProtect, getAllCategory);

module.exports = router;
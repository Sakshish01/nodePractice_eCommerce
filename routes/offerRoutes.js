const express = require("express");
const {add, edit, view, offerList} = require("../controllers/offerController");
const protect = require("../middlewares/authMiddleware");
const adminProtect = require("../middlewares/adminMiddleware");
const {offerUpload} = require("../utils/multer");

const router = express.Router();

router.post('/add', protect, adminProtect, offerUpload.single('image'), add);
router.post('/edit/:id', protect, adminProtect, offerUpload.single('image'), edit);
router.post('/view/:id', protect,  view);
router.post('/viewAll', protect,  offerList);

module.exports = router;
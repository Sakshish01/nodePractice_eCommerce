const express = require("express");
const {add, edit} = require("../controllers/offerController");
const protect = require("../middlewares/authMiddleware");
const adminProtect = require("../middlewares/adminMiddleware");

const router = express.Router();

router.post('/add', protect, adminProtect, add);
router.post('/edit/:id', protect, adminProtect, edit);


module.exports = router;
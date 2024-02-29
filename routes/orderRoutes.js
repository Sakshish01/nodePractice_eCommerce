const express = require("express");
const protect = require("../middlewares/authMiddleware");
const {place, cancel, orderHistory, viewOrder} = require("../controllers/orderController");

const router = express.Router();
router.post('/place', protect, place);
router.post('/cancel/:id', protect, cancel);
router.post('/history', protect, orderHistory);
router.get('/view/:id', protect, viewOrder);

module.exports = router;
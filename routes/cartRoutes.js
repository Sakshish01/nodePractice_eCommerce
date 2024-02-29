const express = require("express");
const protect = require("../middlewares/authMiddleware");
const { add, update, remove, viewCart, clearCart, viewItem} = require("../controllers/cartController");

const router = express.Router();
router.post('/add', protect, add);
router.post('/update/:id', protect, update);
router.post('/remove/item/:id', protect, remove);
router.get('/view/cart/:id', protect, viewCart);
router.post('/remove/cart', protect, clearCart);
router.get('/view/item/:id', protect, viewItem);

module.exports = router;
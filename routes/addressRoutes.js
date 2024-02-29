const express = require("express");
const {addOrUpdateAddress, deleteAddress, getAddress, getAddresses} = require("../controllers/addressController");
const protect = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/add/or/edit", protect, addOrUpdateAddress);
router.delete("/delete", protect, deleteAddress);
router.get("/get/:id", protect, getAddress);
router.get("/get/user/address", protect, getAddresses);

module.exports = router;
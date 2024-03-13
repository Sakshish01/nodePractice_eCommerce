const express = require("express");
const protect = require("../middlewares/authMiddleware");
const {add} = require("../controllers/ratingController");
const {reviewUpload} = require("../utils/multer");

const router = express.Router();

router.post('/add/:id', protect, reviewUpload.array('files', 2), add);

module.exports = router;
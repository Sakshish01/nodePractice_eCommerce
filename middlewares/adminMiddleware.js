const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const { handleOtherError, handleServerError } = require("../utils/response");

const adminProtect = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return handleOtherError(res, 404, "User not found");
    }
    if (user.role !== "admin") {
      return handleOtherError(res, 400, "Permission denied");
    }
    next();
  } catch (error) {
    return handleServerError(error, res);
  }
});

module.exports = adminProtect;

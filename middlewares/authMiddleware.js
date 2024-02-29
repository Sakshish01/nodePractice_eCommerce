const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { handleOtherError, handleServerError } = require("../utils/response");

const protect = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.AccessToken ||
      (req.headers.authorization?.startsWith("Bearer") &&
        req.headers.authorization.replace("Bearer ", ""));

    if (!token) {
      return handleOtherError(res, 404, "Unauthorized");
    }

    const decodedData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log(decodedData);
    req.user = decodedData;
    next();
  } catch (error) {
    return handleServerError(error, res);
  }
});

module.exports = protect;

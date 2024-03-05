const User = require("../models/user.model");
const {
  generateAccessToken,
  generateRefreshAccessToken,
} = require("../utils/token");
const asyncHandler = require("express-async-handler");
const {
  sendSuccessResponse,
  handleValidationError,
  handleServerError,
  handleOtherError,
} = require("../utils/response");
const bcrypt = require("bcrypt");
const userOtp = require("../models/userOtp.model");

const cloudinaryUpload = require("../utils/cloudinary");

// functions
const IsPasswordValidate = (password) => {
  // Length range validation
  if (password.length < 8 || password.length > 10) {
    return false; // Password length is outside the allowed range
  }

  // Contains both letters and numbers validation
  const containsLetters = /[a-zA-Z]/.test(password);
  const containsNumbers = /\d/.test(password);
  if (!containsLetters || !containsNumbers) {
    return false; // Password does not contain both letters and numbers
  }

  return true; // Password meets all criteria
};

const IsEmailValid = (email) => {
  // Regular expression for basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

//routes

const register = asyncHandler(async (req, res) => {
  try {
    const { username, email, name, phoneNo, password } = req.body;

    // console.log("username", req.body.username);

    if ([name, email, username, phoneNo, password].some((field) => !field)) {
      return handleOtherError(res, 404, "All fields are required");
    }

    if (phoneNo.length !== 10) {
      return handleOtherError(res, 400, "PhoneNo length should be 10");
    }

    if (!IsEmailValid(email)) {
      return handleOtherError(res, 400, "Invalid email");
    }

    if (!IsPasswordValidate(password)) {
      return handleOtherError(
        res,
        400,
        "Please ensure your password length should be in 8-12 characters and must involve alpha numeric values."
      );
    }

    const user = await User.findOne({
      $or: [{ username }, { email }, { phoneNo }],
    });
    if (user) {
      return handleOtherError(res, 409, "User already exists");
    }

    const newUser = await User.create({
      username,
      email,
      name,
      phoneNo,
      password,
    });

    const file = await cloudinaryUpload(req.file.path);
    // console.log(file.url);

    newUser.profileImage = file.url;

    if (req.body.role && req.body.role !== null) {
      newUser.role = req.body.role;
    }

    await newUser.save();

    return sendSuccessResponse(res, "User registered", newUser);
  } catch (error) {
    if (error.name === "ValidationError") {
      // Handle validation errors
      return handleValidationError(error.message, res);
    }

    // Handle other types of errors
    return handleServerError(error, res);
  }
});

const login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    if ([email, password].some((field) => !field)) {
      return handleOtherError(res, 404, "Email and password is required");
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return handleOtherError(res, 404, "User not found");
    }

    const IsPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    //   console.log(IsPasswordCorrect);
    if (!IsPasswordCorrect) {
      return handleOtherError(res, 404, "Invalid password");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const AccessToken = generateAccessToken(existingUser._id);
    const RefreshAccessToken = generateRefreshAccessToken(existingUser._id);

    existingUser.refreshAccessToken = RefreshAccessToken;
    existingUser.save({ validateBeforeSave: false });

    res
      .status(200)
      .cookie("AccessToken", AccessToken, options)
      .cookie("RefreshAccessToken", RefreshAccessToken, options)
      .json({
        status: true,
        message: `${existingUser.role} logged in`,
        token: AccessToken,
      });
  } catch (error) {
    // Handle other types of errors
    return handleServerError(error, res);
  }
});

const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return handleOtherError(res, 404, "Email is required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    return handleOtherError(res, 404, "User not found");
  }
  const otp = Math.floor(100000 + Math.random() * 900000);
  const otpExpiry = new Date();
  otpExpiry.setMinutes(otpExpiry.setMinutes() + 10);

  const otpInstance = await userOtp.create({
    userEmail: user.email,
    otp: otp,
    expiresAt: otpExpiry,
  });

  return sendSuccessResponse(res, "Otp sent successfull", otpInstance);
});

const otpVerify = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  if (!otp) {
    return handleOtherError(res, 404, "Otp is required");
  }
  const savedOtp = await userOtp.findOne({ otp });

  if (!savedOtp || Date.now() > savedOtp.expiresAt) {
    return handleOtherError(res, 400, "Invalid Otp");
  }

  return sendSuccessResponse(res, "Otp verified");
});

const resetPassword = asyncHandler(async (req, res) => {
  const { newPassword, confirmPassword } = req.body;

  if ([newPassword, confirmPassword].some((field) => !field)) {
    return handleOtherError(res, 404, "Passwords are required");
  }

  if (newPassword !== confirmPassword) {
    return handleOtherError(
      res,
      400,
      "New Password and Confirm Password should match"
    );
  }

  if (!IsPasswordValidate(newPassword)) {
    return handleOtherError(
      res,
      400,
      "Please ensure your password length should be in 8-12 characters and must involve alpha numeric values."
    );
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return handleOtherError(res, 404, "User not found");
  }

  const hashedNewPassword = bcrypt.hash(newPassword, 10);
  user.password = hashedNewPassword;
  await user.save();

  return sendSuccessResponse(res, "Password reset successfull");
});

// protected

const logout = asyncHandler(async (req, res) => {
  try {
    const currentUser = await User.findByIdAndUpdate(req.user.userId, {
      $set: {
        refreshAccessToken: undefined,
      },
    });

    const options = {
      httpOnly: true,
      secure: true,
    };

    res
      .status(200)
      .clearCookie("AccessToken", options)
      .clearCookie("RefreshAccessToken", options)
      .json({
        message: "Logged out successfully",
      });
  } catch (error) {
    return handleServerError(error, res);
  }
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if ([oldPassword, newPassword].some((field) => !field)) {
    return handleOtherError(res, 404, "Passwords are required");
  }

  const currentUser = await User.findById(req.user.userId);

  if (!currentUser) {
    return handleOtherError(res, 404, "User not found");
  }

  const IsPasswordCorrect = await bcrypt.compare(
    oldPassword,
    currentUser.password
  );

  if (!IsPasswordCorrect) {
    return handleOtherError(res, 404, "Invalid old password");
  }

  if (!IsPasswordValidate(newPassword)) {
    return handleOtherError(
      res,
      400,
      "Please ensure your password length should be in 8-12 characters and must involve alpha numeric values."
    );
  }

  currentUser.password = newPassword;
  await currentUser.save();

  return sendSuccessResponse(res, "Password changed");
});

// user routes
const edit = asyncHandler(async (req, res) => {
  // const userId = req.params.id;

  const existingUser = await User.findById(req.user.userId);
  if (!existingUser) {
    return handleOtherError(res, 404, "User not found");
  }

  if (req.file) {
    const file = await cloudinaryUpload(req.file.path);
    existingUser.profileImage = file.url;
    await existingUser.save();
  }

  Object.assign(existingUser, req.body);

  return sendSuccessResponse(res, "User details updated", existingUser);
});

const view = asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user.userId);
  if (!currentUser) {
    return handleOtherError(res, 404, "User not found");
  }

  return sendSuccessResponse(res, "User data retrieved", currentUser);
});

module.exports = {
  register,
  login,
  logout,
  forgetPassword,
  otpVerify,
  resetPassword,
  changePassword,
  edit,
  view
};

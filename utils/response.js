const sendSuccessResponse = (res, message, data) => {
  return res.status(200).json({
    success: true,
    message: message,
    data: data,
  });
};

const handleValidationError = (error, res) => {
  return res.status(400).json({
    success: false,
    message: "Validation Error",
    errors: error.message, // Include detailed validation errors in the response
  });
};

const handleServerError = (error, res) => {
  console.error(error);
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};

const handleOtherError = ( res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    message: message,
  });
};

module.exports = {
  sendSuccessResponse,
  handleValidationError,
  handleServerError,
  handleOtherError,
};

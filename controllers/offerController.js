const asyncHandler = require("express-async-handler");
const Offer = require("../models/offer.model");
const { handleOtherError, sendSuccessResponse } = require("../utils/response");

const add = asyncHandler(async(req, res) => {
try {
        const {name, description, code, discountType, discount, expiresAt, minAmountToApply, useLimit} = req.body;
    
        if([name, description, code, discountType, discount, expiresAt, minAmountToApply, useLimit].some(field => !field)){
            return handleOtherError(res, 404, "All fields are required");
        }
    
        const parseExpiry = new Date(expiresAt);
    
        const newOffer = await Offer.create({
            name,
            description,
            code,
            discountType, 
            discount,
            expiresAt: parseExpiry, 
            minAmountToApply: parseInt(minAmountToApply), 
            useLimit: parseInt(useLimit)
        });
    
        return sendSuccessResponse(res, "Offer added", newOffer);
} catch (error) {
    if (error.name === "ValidationError") {
        // Handle validation errors
        return handleValidationError(error.message, res);
      }
  
      // Handle other types of errors
      return handleServerError(error, res);
}
});

module.exports = {add};
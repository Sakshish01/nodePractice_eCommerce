const asyncHandler = require("express-async-handler");
const Offer = require("../models/offer.model");
const { handleOtherError, sendSuccessResponse, handleServerError } = require("../utils/response");
const cloudinaryUpload = require("../utils/cloudinary");

const add = asyncHandler(async(req, res) => {
try {
        const {name, description, code, discountType, discount, expiresAt, minAmountToApply, useLimit, userType} = req.body;
    
        if([name, description, code, discountType, discount, expiresAt, minAmountToApply, useLimit].some(field => !field)){
            return handleOtherError(res, 404, "All fields are required");
        }

        const existingOffer = await Offer.findOne({code});

        if(existingOffer){
            return handleOtherError(res, 400, "Code already exists");
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
            useLimit: parseInt(useLimit),
        });

        if(req.file){
            const file = await cloudinaryUpload(req.file.path);
            newOffer.image = file.url;
        }

        if(userType){
            newOffer.userType = userType;
        }
        await newOffer.save();
    
        return sendSuccessResponse(res, "Offer added", newOffer);
} catch (error) {
    console.log(error);
    if (error.name === "ValidationError") {
        // Handle validation errors
        return handleValidationError(error.message, res);
      }
  
      // Handle other types of errors
      return handleServerError(error, res);
}
});

const edit = asyncHandler(async(req, res) => {

    const {code} = req.body;

    const offerId = req.params.id;

    const existingOffer = await Offer.findById(offerId);

    if(!existingOffer){
        return handleOtherError(res, 404, "Offer not exists");
    }

    if(code){
        const existingCode = await Offer.findOne({code});
        if(existingCode){
            return handleOtherError(res, 409, "Code already exists");
        }
        existingOffer.code = code;
    }

    Object.assign(existingOffer, req.body);

    if(req.file){
        const file = await cloudinaryUpload(req.file.path);
        existingOffer.image = file.url;
        await existingOffer.save();
    }

    return sendSuccessResponse(res, "Offer updated", existingOffer);

});

const view = asyncHandler(async(req, res) => {
    const offerId = req.params.id;

    const existingOffer = await Offer.findById(offerId);

    if(!existingOffer){
        return handleOtherError(res, 404, "Offer not exists");
    }

    return sendSuccessResponse(res, "Offer data retrieved", existingOffer);
});

const offerList = asyncHandler(async(req, res) => {
    const offers = await Offer.find();

    if(!offers){
        return handleOtherError(res, 404, "No offers exists");
    }

    return sendSuccessResponse(res, "Offer list retrieved", offers);
});


module.exports = {add, edit, view, offerList};
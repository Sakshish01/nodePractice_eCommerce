const asyncHandler = require("express-async-handler");
const Review = require("../models/review.model");
const Product = require("../models/product.model");
const { handleOtherError, sendSuccessResponse, handleServerError, handleValidationError } = require("../utils/response");
const cloudinaryUpload = require("../utils/cloudinary");

const add = asyncHandler(async(req, res) => {
try {
        const {comment, rating} = req.body;
        const userId = req.user.userId;
        const productId = req.params.id;

        if(!rating){
            return handleOtherError(res, 404, "Rating is required");
        }
    
        const existingProduct = await Product.findById(productId);
    
        if(!existingProduct){
            return handleOtherError(res, 404, "Product not exists");
        }
    
        const newReview =  await Review.create({
            user: userId,
            product: existingProduct._id,
            rating
        });

        if(comment){
            newReview.comment = comment;
        }

        if(req.files && req.files.length !==0 ){
            for(const file of req.files){
                const filePath = await cloudinaryUpload(file.path);
                newReview.uploads.push(filePath.url);
            }
        }

        await newReview.save();
    
        return sendSuccessResponse(res, "Review added", newReview);
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


module.exports = {add};
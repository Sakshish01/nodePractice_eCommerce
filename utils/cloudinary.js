const cloudinary = require("cloudinary").v2;
const asyncHandler = require("express-async-handler");
const { handleOtherError } = require("./response");
const fs = require("fs");
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadFile = asyncHandler(async(filePath) => {
    if(!filePath){
        return handleOtherError(res, 404, "File is required");
    }

    const response = await cloudinary.uploader.upload(filePath,
    { resource_type: "auto" });


    fs.unlink(filePath, (err) => {
        if(err){
            console.error("Error deleting file.");
            return handleOtherError(res, 400, "Error deleting file");
        }
    });
    return response;

});

module.exports = uploadFile;
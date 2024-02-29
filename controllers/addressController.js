const Address = require("../models/address.model");
const asyncHandler = require("express-async-handler");
const { handleOtherError, sendSuccessResponse } = require("../utils/response");
const User = require("../models/user.model");

const addOrUpdateAddress = asyncHandler(async(req, res) => {
    const { houseNo, street, city, state, postalCode, type } = req.body;

    if (!houseNo || !street || !city || !state || !postalCode || !type) {
        return handleOtherError(res, 404, 'All fields are required');
    }

    const currentUser = await User.findById(req.user.userId);
    if (!currentUser) {
        return handleOtherError(res, 404, 'User not found');
    }

    let existingAddress = await Address.findOne({ user: currentUser._id, type });

    if (existingAddress) {
        // Update existing address
        existingAddress.houseNo = houseNo;
        existingAddress.street = street;
        existingAddress.city = city;
        existingAddress.state = state;
        existingAddress.postalCode = postalCode;
    } else {
        // Create a new address
        existingAddress = new Address({
            houseNo,
            street,
            city,
            state,
            postalCode,
            type,
            user: currentUser._id
        });
    }

    if (type === 'other') {
        if (!req.body.recieversName || !req.body.saveAs) {
            return handleOtherError(res, 404, 'Receiver details are required');
        }
        existingAddress.otherDetails = {
            name: req.body.saveAs,
            recieversName: req.body.recieversName,
            recieverPhoneNo: req.body.recieverPhoneNo
        };
    }

    await existingAddress.save();

    return sendSuccessResponse(res, "Address added/updated", existingAddress);
});

const deleteAddress = asyncHandler(async (req, res) => {
    const address = await Address.findByIdAndDelete(req.params.id);
    if(!address){
        return handleOtherError(res, 404, "Address not found");
    }

    return sendSuccessResponse(res, "Address deleted");
});

const getAddress = asyncHandler(async(req, res) => {
    const address = await Address.findById(req.params.id);
    if(!address){
        return handleOtherError(res, 404, "Address not found");
    }
    return sendSuccessResponse(res, "Address found", address);
});

const getAddresses = asyncHandler(async(req, res) => {
    const addresses = await Address.find({user: req.user.userId});
    if(!addresses){
        return handleOtherError(res, "User addresses not found"); 
    }
    return sendSuccessResponse(res, "User addresses found", addresses);
});


module.exports = {addOrUpdateAddress, deleteAddress, getAddress, getAddresses};
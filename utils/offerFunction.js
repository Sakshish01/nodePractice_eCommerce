const Offer = require("../models/offer.model");
const { handleOtherError } = require("./response");

const isOfferAvailable = async(offerId, totalAmount) => {
    let flag ;
    const existingOffer = await Offer.findById(offerId);
    if(!existingOffer){
        return handleOtherError(res, 404, "Offer not found");
    }
    const expiryDate = new Date(existingOffer.expiresAt);
    

    if(Date.now() > expiryDate || totalAmount < existingOffer.minAmountToApply || existingOffer.useLimit === 0 ){
        flag = false;
    }
    flag = true;

    console.log(flag);

    return flag;
}

module.exports = isOfferAvailable;
const asyncHandler = require("express-async-handler");
const Payment = require("../models/payment.model");
const { handleOtherError, sendSuccessResponse } = require("../utils/response");
const Order = require("../models/order.model");

const checkout = asyncHandler(async(req, res) => {
    const {orderId, method} = req.body;

    if(!orderId){
        return handleOtherError(res, 404, "Order id is required");
    }

    const existingOrder = await Order.findById(orderId);
    if(!existingOrder){
        return handleOtherError(res, 400, "Order not exists");
    }

    const newPayment = await Payment.create({
        existingOrder,
        totalAmount: existingOrder.totalAmount
    });

    if(method){
        newPayment.method = method;
    }

    await newPayment.save();
    return sendSuccessResponse(res, "Payment done");

});

module.exports = {checkout};
const asyncHandler = require("express-async-handler");
const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
const { handleOtherError, sendSuccessResponse } = require("../utils/response");
const Address = require("../models/address.model");

const place = asyncHandler(async(req, res) => {
    const {addressId, addressType, address} = req.body;

    if(!addressType){
        return handleOtherError(res, 404, "Address type is required");
    }

    const existingCart = await Cart.findOne({user: req.user.userId});

    if(!existingCart){
        return handleOtherError(res, 404, "Cart not found");
    }

    const newOrder = await Order.create({
        user: req.user.userId,
        items: existingCart.items.map((item) => ({
            product: item.product,
            quantity: item.quantity,
            price: item.price
        })
        ),
        totalAmount: existingCart.totalPrice
    });

    if(addressType === "saved"){
        if(!addressId){
            return handleOtherError(res, 400, "AddressId is required in saved address type")
        }
        const userAddresses= await Address.find({user: req.user.userId});
        if(userAddresses.includes(addressId)){
            newOrder.shippingAddress = addressId;
        }else{
            return handleOtherError(res, 400, "Id not exists");
        }
    }else if(addressType === "new"){
        newOrder.shippingAddress = address;
    }else{
        return handleOtherError(res, 400, "Invalid action");
    }

    await newOrder.save();

    //clear cart
    await existingCart.deleteOne();

    return sendSuccessResponse(res, "Order placed", newOrder);

});

const cancel = asyncHandler(async(req, res) => {
    const orderId = req.params.id;
    const existingOrder = await Order.findById(orderId);

    if(!existingOrder){
        return handleOtherError(res, 404, "Requested order id not exists");
    }

    if(existingOrder.status === "Shipped"){
        return handleOtherError(res, 400, "Cannot cancel order, as it has been shipped");
    }

    existingOrder.status = "Cancelled";
    await existingOrder.save();

    return sendSuccessResponse(res, "Order cancelled");
});

const orderHistory = asyncHandler(async(req, res) => {
    const userOrders = await Order.find({user: req.user.userId});
    if(!userOrders){
        return handleOtherError(res, 404, "No order history");
    }

    return sendSuccessResponse(res, "Order history retrieved", userOrders);
});

const viewOrder = asyncHandler(async(req, res) => {
    const orderId = req.params.id;
    const existingOrder = await Order.findById(orderId);

    if(!existingOrder){
        return handleOtherError(res, 404, "Order not exists");
    }

    return sendSuccessResponse(res, "Order retrieved",existingOrder);
});



module.exports = {place, cancel, orderHistory, viewOrder};
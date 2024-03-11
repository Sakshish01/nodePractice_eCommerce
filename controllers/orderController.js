const asyncHandler = require("express-async-handler");
const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
const { handleOtherError, sendSuccessResponse } = require("../utils/response");
const Address = require("../models/address.model");
const Offer = require("../models/offer.model");

const isOfferValidate = require("../utils/offerFunction");

const place = asyncHandler(async (req, res) => {
  const { addressId, offerId } = req.body;


  const existingCart = await Cart.findOne({ user: req.user.userId });

  if (!existingCart) {
    return handleOtherError(res, 404, "Cart not found");
  }
  console.log(existingCart, existingCart.totalPrice);

  const newOrder = await Order.create({
    user: req.user.userId,
    items: existingCart.items.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      price: item.price,
      size: item.size,
      colour: item.colour
    })),
    totalAmount: existingCart.totalPrice,
  });

  const existingUserAddress = await Address.findOne({_id: addressId, user: req.user.userId});
  if(!existingUserAddress){
    return handleOtherError(res, 404, "Address not exists");
  }
  newOrder.shippingAddress = existingUserAddress._id;
  newOrder.totalAmount = existingCart.totalPrice;

   
  if (offerId) {
    const existingOffer = await Offer.findById(offerId);
    if (!existingOffer) {
      return handleOtherError(res, 404, "Offer not found");
    }
    const flag = isOfferValidate(offerId, existingCart.totalPrice);
    if (!flag) {
      return handleOtherError(res, 400, "Offer not applicable");
    }
    let discountAmount;
    if (existingOffer.discountType === "percentage") {
      console.log(200);
      discountAmount = newOrder.totalAmount * existingOffer.discount / 100;
      // console.log(newOrder.totalAmount, discountAmount);
    } else {
      console.log(20);
      discountAmount = existingOffer.discount;
    }

    const amountToPay = newOrder.totalAmount - discountAmount;
    newOrder.totalAmount = amountToPay;
    newOrder.offerId = offerId;


    existingOffer.orders.push(newOrder._id);
    existingOffer.useLimit -= 1;
    await existingOffer.save();
  }

  await newOrder.save();

  //clear cart
  await existingCart.deleteOne();

  return sendSuccessResponse(res, "Order placed", newOrder);
});

const cancel = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const existingOrder = await Order.findById(orderId);

  if (!existingOrder) {
    return handleOtherError(res, 404, "Requested order id not exists");
  }

  if (existingOrder.status === "Shipped") {
    return handleOtherError(
      res,
      400,
      "Cannot cancel order, as it has been shipped"
    );
  }

  existingOrder.status = "Cancelled";
  await existingOrder.save();

  return sendSuccessResponse(res, "Order cancelled");
});

const orderHistory = asyncHandler(async (req, res) => {
  const userOrders = await Order.find({ user: req.user.userId });
  if (!userOrders) {
    return handleOtherError(res, 404, "No order history");
  }

  return sendSuccessResponse(res, "Order history retrieved", userOrders);
});

const viewOrder = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const existingOrder = await Order.findById(orderId);

  if (!existingOrder) {
    return handleOtherError(res, 404, "Order not exists");
  }

  return sendSuccessResponse(res, "Order retrieved", existingOrder);
});

const replaceOrder = asyncHandler(async(req, res) => {
});

const returnOrder = asyncHandler(async(req, res) => {

});

module.exports = { place, cancel, orderHistory, viewOrder };

const asyncHandler = require("express-async-handler");
const Cart = require("../models/cart.model");
const { handleOtherError, sendSuccessResponse } = require("../utils/response");
const Product = require("../models/product.model");

const addItemsPrice = (items) => {
  return items.reduce((total, item) => total + item.price, 0);
};

const add = asyncHandler(async (req, res) => {
  const { product, quantity, selectedSize, selectedColour } = req.body;
  if ([product, quantity].some((field) => !field)) {
    return handleOtherError(res, 404, "All fields are required");
  }
  const existingProduct = await Product.findById(product);
  if (!existingProduct) {
    return handleOtherError(res, 404, "Product doesn't exists");
  }

  if (quantity > existingProduct.quantity) {
    return handleOtherError(
      res,
      404,
      "Requested quantity exceed product qunatity"
    );
  }

  let cart = await Cart.findOne({ user: req.user.userId });
  if (!cart) {
    cart = await Cart.create({
      user: req.user.userId,
      items: [],
    });
  }

  const existingItemIndex = cart.items.findIndex((item) =>
    item.product._id.equals(existingProduct._id)
  );

  if (existingItemIndex !== -1) {
    //item found
    cart.items[existingItemIndex].quantity += parseInt(quantity);
  }
  

  let size = existingProduct.defaultSize;;
  if(selectedSize || existingProduct.availableSizes.includes(selectedSize) ){
    size = selectedSize
  }else{
    return handleOtherError(res, 404, "Selected size is unavailable");
  }

  let colour = existingProduct.defaultColour;
  if(selectedColour || existingProduct.availableColours.includes(selectedColour)){
      colour = selectedColour;
  }else{
    return handleOtherError(res, 404, "Selected colour is unavailable");
  }

  cart.items.push({
    product: existingProduct._id,
    quantity: parseInt(quantity),
    price: existingProduct.price * quantity,
    size,
    colour
  });

  cart.totalPrice = addItemsPrice(cart.items);
  await cart.save();
  existingProduct.quantity = existingProduct.quantity - quantity;
  await existingProduct.save();

  return sendSuccessResponse(res, "Added to cart", cart);
});

const update = asyncHandler(async (req, res) => {
  const { action } = req.body;

  if (!action) {
    return handleOtherError(res, 404, "Action is required");
  }

  const existingCart = await Cart.findOne({ user: req.user.userId });
  if (!existingCart) {
    return handleOtherError(res, 404, "Cart not found");
  }

  const itemId = req.params.id;
  const existingItem = existingCart.items.find((item) =>
    item._id.equals(itemId)
  );
  //   console.log(existingItem);
  if (!existingItem) {
    return handleOtherError(res, 404, "Item not found in cart");
  }

  const existingProduct = await Product.findById(existingItem.product);
  if (!existingProduct || existingProduct.quantity === 0) {
    return handleOtherError(res, 404, "Product not found or out of stock.");
  }

  if (action === "increment") {
    existingItem.quantity += 1;
    existingItem.price += existingProduct.price;

    //decrement from product quantity
    existingProduct.quantity -= 1;
  } else if (action === "decrement") {
    if (existingItem.quantity > 1) {
      existingItem.quantity -= 1;
      existingItem.price -= existingProduct.price;

      //increment in product quantity
      existingProduct.quantity += 1;
    } else {
      existingCart.items = existingCart.items.filter(
        (item) => !item._id.equals(itemId)
      );

      //increment in product quantity
      existingProduct.quantity += 1;
    }
  } else {
    return handleOtherError(res, 400, "Invalid action");
  }

  existingCart.totalPrice = addItemsPrice(existingCart.items);
  await existingCart.save();
  return sendSuccessResponse(res, "Cart updated");
});

const remove = asyncHandler(async (req, res) => {
  const itemId = req.params.id;
  const existingCart = await Cart.findOne({ user: req.user.userId });
  if (!existingCart) {
    return handleOtherError(res, 404, "Cart not found");
  }
  const existingItem = existingCart.items.find((item) =>
    item._id.equals(itemId)
  );
  //   console.log(existingItem);
  if (!existingItem) {
    return handleOtherError(res, 404, "Item not found in cart");
  }

  await Product.findByIdAndUpdate(existingItem.product, {
    $inc: { quantity: existingItem.quantity }, // increase quantity again in product
  });

  existingCart.items = existingCart.items.filter(
    (item) => !item._id.equals(itemId)
  ); // remove itemid from items array and return new array

  existingCart.totalPrice = addItemsPrice(existingCart.items);
  await existingCart.save();
  return sendSuccessResponse(res, "Item removed from cart");
});

const viewCart = asyncHandler(async (req, res) => {
  const existingCart = await Cart.findById(req.params.id);
  if (!existingCart) {
    return handleOtherError(res, 404, "Cart not found");
  }

  const itemsCount = existingCart.items.length;
  const responseData = {
    itemsCount,
    existingCart,
  };

  return sendSuccessResponse(res, "Cart viewed", responseData);
});

const clearCart = asyncHandler(async (req, res) => {
  const existingCart = await Cart.findOne({ user: req.user.userId });

  if (!existingCart) {
    return handleOtherError(res, 404, "Cart not found");
  }

  for (const item of existingCart.items) {
    const product = await Product.findById(item.product);
    if (product) {
      product.quantity += item.quantity;
      await product.save();
    }
  }

  await existingCart.deleteOne();

  return sendSuccessResponse(res, "Cart cleared");
});

const viewItem = asyncHandler(async (req, res) => {
    const itemId = req.params.id;

    const cart = await Cart.findOne({user: req.user.userId});
    
    if(!cart){
        return handleOtherError(res, 404, "Cart not found");
    }

    const existingItem = cart.items.find((item) => item._id.equals(itemId));
    if(!existingItem){
        return handleOtherError(res, 404, "Item not found");
    }

    return sendSuccessResponse(res, "Item retrieved", existingItem);
});

module.exports = { add, update, remove, viewCart, clearCart, viewItem};

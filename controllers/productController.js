const asyncHandler = require("express-async-handler");
const Product = require("../models/product.model");
const { handleOtherError, sendSuccessResponse } = require("../utils/response");
const Category = require("../models/category.model");
const cloudinaryUpload = require("../utils/cloudinary");

const add = asyncHandler(async (req, res) => {
  const { name, description, price, category, quantity } = req.body;
  if ([name, description, price, category, quantity].some((field) => !field)) {
    return handleOtherError(res, 404, "All feilds are required");
  }

  const existingCategory = await Category.findById(req.body.category);
  if (!existingCategory) {
    return handleOtherError(res, 404, "Category not exists");
  }

  const newProduct = await Product.create({
    name,
    description,
    price,
    category,
    quantity,
  });

  if (req.file) {
    const file = await cloudinaryUpload(req.file.path);
    newProduct.image = file.url;
    await newProduct.save();
  }

  return sendSuccessResponse(res, "Product added", newProduct);
});

const edit = asyncHandler(async (req, res) => {
  const { name, description, price, category, quantity } = req.body;

  const existingProduct = await Product.findById(req.params.id);
  if (!existingProduct) {
    return handleOtherError(res, 404, "Requested product not exists");
  }

  if (category) {
    const existingCategory = await Category.findById(req.body.category);
    if (!existingCategory) {
      return handleOtherError(res, 404, "Category not exists");
    }
    existingProduct.category = category;
  }
  if (req.file) {
    const file = await cloudinaryUpload(req.file.path);
    existingProduct.image = file.url;
  }
  
  Object.assign(existingProduct, req.body);
  await existingProduct.save();

  return sendSuccessResponse(res, "Product details updated", existingProduct);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const existingProduct = await Product.findByIdAndDelete(req.params.id);
  if (!existingProduct) {
    return handleOtherError(res, 404, "Product id not exists");
  }

  return sendSuccessResponse(res, "Product deleted");
});

const getProduct = asyncHandler(async (req, res) => {
  const existingProduct = await Product.findById(req.params.id);
  if (!existingProduct) {
    return handleOtherError(res, 404, "Product id not exists");
  }
  return sendSuccessResponse(res, "Product details retrieved", existingProduct);
});

const getAllProducts = asyncHandler(async (req, res) => {
  const query = {}; //default query for listing all products

  if (req.params.keyword) {
    const keyword = req.params.keyword;
    query = {
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };
  }

  const allProducts = await Product.find(query);
  const count = allProducts.length;
  if (!allProducts || count === 0) {
    return handleOtherError(res, 404, "Products not exists");
  }

  const data = {
    count: count,
    products: allProducts,
  };

  return sendSuccessResponse(res, "All products retrieved", data);
});

module.exports = { add, edit, deleteProduct, getProduct, getAllProducts };

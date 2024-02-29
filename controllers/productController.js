const asyncHandler = require("express-async-handler");
const Product = require("../models/product.model");
const { handleOtherError, sendSuccessResponse } = require("../utils/response");
const Category = require("../models/category.model");

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

  ["name", "description", "price", "quantity"].forEach((prop) => {
    if (req.body[prop] === undefined) {
      return handleOtherError(res, 404, `${prop} is undefined`);
    }
    existingProduct[prop] = prop;
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
    const existingProduct = await Product.findByIdAndDelete(req.params.id);
    if(!existingProduct){
        return handleOtherError(res, 404, "Product id not exists");
    }

    return sendSuccessResponse(res, "Product deleted");
});

const getProduct = asyncHandler(async(req, res) => {
    const existingProduct = await Product.findById(req.params.id);
    if(!existingProduct){
        return handleOtherError(res, 404, "Product id not exists");
    }
    return sendSuccessResponse(res, "Product details retrieved", existingProduct);
});

const getAllProducts = asyncHandler(async(req, res) => {
    const query = {}; //default query for listing all products

    if(req.params.keyword){
        const keyword = req.params.keyword;
        query ={
            $or: [
                {name: {$regex: keyword, $options: 'i'}},
                {description: {$regex: keyword, $options: 'i'}}
            ]
        }
    }

    const allProducts = await Product.find(query);
    const count = allProducts.length;
    if(!allProducts || count === 0){
        return handleOtherError(res, 404, "Products not exists");
    }

    const data = {
        count: count,
        products: allProducts
    }

    return sendSuccessResponse(res, "All products retrieved", data)

});

module.exports = { add, edit, deleteProduct, getProduct, getAllProducts};

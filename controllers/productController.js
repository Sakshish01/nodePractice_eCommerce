const asyncHandler = require("express-async-handler");
const Product = require("../models/product.model");
const { handleOtherError, sendSuccessResponse } = require("../utils/response");
const Category = require("../models/category.model");
const cloudinaryUpload = require("../utils/cloudinary");

//admin routes 

const add = asyncHandler(async (req, res) => {
  const { name, description, price, category, quantity, sizes, colours, defaultSize, defaultColour } = req.body;
  if ([name, description, price, category, quantity, defaultSize, defaultColour].some((field) => !field)) {
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
    defaultSize,
    defaultColour
  });

  if (req.file) {
    const file = await cloudinaryUpload(req.file.path);
    newProduct.image = file.url;
  }

  if(sizes  && sizes.length > 0){
    newProduct.availableSizes = sizes;
  }

  if(colours  && colours.length > 0){
    newProduct.availableColours = colours;
  }

  await newProduct.save();

  return sendSuccessResponse(res, "Product added", newProduct);
});

const edit = asyncHandler(async (req, res) => {
  const { category, sizesToAdd, coloursToAdd, sizesToRemove, coloursToRemove } = req.body;

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

  if(sizesToAdd && sizesToAdd.length !==0){
    sizesToAdd.forEach(size => {
      if(existingProduct.availableSizes.includes(size)){
        existingProduct.sizes.push(size);
      }else{
        return handleOtherError(res, 400, `Size ${size} not found in product`);
      }
    });
  }

  if(sizesToRemove && sizesToRemove.length !==0){
    sizesToRemove.forEach(size => {
      if(existingProduct.availableSizes.includes(size)){
        existingProduct.sizes.filter(existingSize => existingSize !== size);
      }else{
        return handleOtherError(res, 400, `Size ${size} not found in product`);
      }
    });
  }

  if(coloursToAdd && coloursToAdd.length !==0){
    coloursToAdd.forEach(colour => {
      if(existingProduct.availableColours.includes(colour)){
        existingProduct.colours.push(colour);
      }else{
        return handleOtherError(res, 400, `Colour ${colour} not found in product`);
      }
    });
  }

  if(coloursToRemove && coloursToRemove.length !==0){
    coloursToRemove.forEach(colour => {
      if(existingProduct.availableColours.includes(colour)){
        existingProduct.colours.filter(existingcolour => existingcolour !== colour);
      }else{
        return handleOtherError(res, 400, `Colour ${colour} not found in product`);
      }
    });
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

//admin-user routes

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

const productSearch = asyncHandler(async (req, res) => {
  const {keyword, minPrice, maxPrice} = req.query;
  const searchQuery = {};
  if(keyword){
    searchQuery.$or = [
      {name : {$regex: keyword, $options: 'i'}}, //case insensitive
      {description : {$regex: keyword, $options: 'i'}}
    ];
    const matchedCategories = await Category.find({name: {$regex: keyword, $options: 'i'}});
    if(matchedCategories && matchedCategories !== 0){
      const categoryIds = matchedCategories.map(category => category._id);
      searchQuery.category = { $in: categoryIds };
    }else{
      return handleOtherError(res, 404, "Product not exists");
    }
  }

  if(minPrice || maxPrice){
    searchQuery.price = {};
    if(minPrice){
      searchQuery.price.lte = minPrice;
    }
    if(maxPrice){
      searchQuery.price.gte = maxPrice;
    }
  }

  const resultProducts = await Product.find(searchQuery);
  if(resultProducts && resultProducts !== 0){
    const productCount = resultProducts.length;
    const data = {
      productCount,
      resultProducts
    };
    return sendSuccessResponse(res, "Product found", data);
  }else{
    return handleOtherError(res, 404, "Product not exists");

  }

});

module.exports = { add, edit, deleteProduct, getProduct, getAllProducts, productSearch };

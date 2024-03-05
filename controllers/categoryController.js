const Category = require("../models/category.model");
const asyncHandler = require("express-async-handler");
const { handleOtherError, sendSuccessResponse } = require("../utils/response");

const addCategory = asyncHandler( async(req, res) => {
    const {name, parentId} = req.body;
    if(!name){
        return handleOtherError(res, 404, "Name is required");
    }

    const existingCategory = await Category.findOne({name});
    if(existingCategory){
        return handleOtherError(res, 404, "Category exists");
    }

    const newCategory = await Category.create({
        name
    });

    if(req.file){
        const file = await cloudinaryUpload(req.file.path);
        newCategory.image = file.url;
    }

    if(parentId){
        const parentCategory = await Category.findById(parentId);
        if(!parentCategory){
            return handleOtherError(res, 404, "Parent category id not exists");
        }
        newCategory.parent = parentCategory._id;
    }
    await newCategory.save();

    return sendSuccessResponse(res, "Category created", newCategory);
});

const editCategory = asyncHandler(async (req, res) => {
    const {name, parentId} = req.body;
    const existingCategory = await Category.findById(req.params.id);
    if(!existingCategory){
        return handleOtherError(res, 404, "Category not exists");
    }
    if(req.file){
        const file = await cloudinaryUpload(req.file.path);
        existingCategory.image = file.url;
    }
    if(name || parentId){
        existingCategory.name = name;
        existingCategory.parent = parentId;
    }
    await existingCategory.save();
    return sendSuccessResponse(res, "Category updated", existingCategory);
});

const getCategory = asyncHandler(async(req, res) => {
    const existingCategory = await Category.findById(req.params.id);
    if(!existingCategory){
        return handleOtherError(res, 404, "Category not exists");
    }

    let data;
    const isParentCategory = await Category.exists({ parent: existingCategory._id });
    if(isParentCategory){
        const subCategories = await Category.find({ parent: existingCategory._id });
        data = {
            category: existingCategory,
            subcategories: subCategories
        };
    }else{
        data = {
            category: existingCategory
        };
    }

    return sendSuccessResponse(res, "Category retrieved successfully", data);
});

const getAllCategory = asyncHandler(async (req, res) => {
    const allCategories = await Category.find();
    const count = allCategories.length;
    if(!allCategories || count === 0){
        return handleOtherError(res, 404, "Categories not found");   
    }
    const data = {
        count: count,
        categories: allCategories
    }
    return sendSuccessResponse(res, "All categories retrieved", data);
});

module.exports = {addCategory, editCategory, getCategory, getAllCategory};
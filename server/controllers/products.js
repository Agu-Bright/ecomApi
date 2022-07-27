const PRODUCT = require("../model/product");
const mongoose = require("mongoose");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ApiFeatures = require("../middlewares/apiFeatures");
//create new Product /api/v1/product/new
const newProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await PRODUCT.create(req.body);
  res.status(201).json({ success: true, product });
});

//get all products => /api/v1/products?keyword=apple
const getAllProducts = catchAsyncErrors(async (req, res, next) => {
  //add the functionality of the **PAGINATION **SEARCH **FILTER
  const resPerPage = 4;
  const productCount = await PRODUCT.countDocuments();
  const apiFeatures = new ApiFeatures(PRODUCT.find(), req.query)
    .search()
    .filter()
    .paginate(resPerPage);

  const products = await apiFeatures.query;

  res.status(200).json({
    success: true,
    count: products.length,
    productCount,
    products,
  });
});

//get Single Product details => /api/v1/product/:id
const getProduct = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const product = await PRODUCT.findById(id);
  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  res.status(200).json({ success: true, product });
});

//update product => /api/v1/admin/product/:id
const updateProduct = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;

  const product = await PRODUCT.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidator: true,
    useFindAndModify: true,
  });
  res.status(200).json({ success: true, product });
});

//deleteProduct
const deleteProduct = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;

  const product = await PRODUCT.findByIdAndRemove(id);

  res.status(200).json({ success: true });
});

module.exports = {
  newProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};

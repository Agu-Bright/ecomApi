const PRODUCT = require("../model/product");
const mongoose = require("mongoose");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ApiFeatures = require("../middlewares/apiFeatures");

//create new Product /api/v1/product/new
const newProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;
  const product = await PRODUCT.create(req.body);
  res.status(201).json({ success: true, product });
});

//get all products => /api/v1/products?keyword=apple
const getAllProducts = catchAsyncErrors(async (req, res, next) => {
  //add the functionality of the **PAGINATION **SEARCH **FILTER

  const resPerPage = 4;
  const productsCount = await PRODUCT.countDocuments();
  const apiFeatures = new ApiFeatures(PRODUCT.find(), req.query)
    .search()
    .filter()
    .paginate(resPerPage);

  const products = await apiFeatures.query;

  res.status(200).json({
    success: true,
    productsCount,
    products,
    resPerPage,
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

//create / update product review => api/v1/review
const createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await PRODUCT.findById(productId);
  //check if product is already reviewed by the current user
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    //update the review
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        rev.comment = comment;
        rev.rating = rating;
      }
    });
  } else {
    //not reviewed, add a new review
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  //calculate the overall rating
  product.rating =
    product.reviews.reduce((acc, item) => {
      return item.rating + acc;
    }, 0) / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

//get product reviews => api/v1/reviews
const getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await PRODUCT.findById(req.query.id);

  res.status(200).json({
    success: true,
    review: product.reviews,
  });
});

//delete review => api/v1/review?id=01209320934&productId=9034290982432309
const deletereview = catchAsyncErrors(async (req, res, next) => {
  const product = await PRODUCT.findById(req.query.productId);

  //filter out the review
  const reviews = product.reviews
    .filter((review) => review._id.toString() !== req.query.id)
    .toString();

  //get number of reviews
  const numOfReviews = reviews.length;

  //calculate the current rating
  const rating =
    product.reviews.reduce((acc, item) => {
      return item.rating + acc;
    }, 0) / reviews.length;

  //update the product
  await PRODUCT.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      rating,
      numOfReviews,
    },
    {
      new: true,
      runValidator: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({ success: true });
});

module.exports = {
  newProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
  deletereview,
};

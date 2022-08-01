const ORDER = require("../model/order");
const PRODUCT = require("../model/product");

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

//create new order => api/v1/order/new
const newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    paymentInfo,
  } = req.body;

  const order = await ORDER.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    paymentInfo,
    user: req.user._id,
  });

  res.status(200).json({
    success: true,
    order,
  });
});

//Get single order => api/v1/order/:id
const getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await ORDER.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHandler("No order found with this id", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

//Get logged in user orders => api/v1/order/:id
const myOrders = catchAsyncErrors(async (req, res, next) => {
  const order = await ORDER.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    order,
  });
});

//Admin get all orders => api/v1/admin/orders
const allOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await ORDER.find();
  let totalAmount = 0;
  orders.forEach((order) => (totalAmount += order.totalPrice));
  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

module.exports = { newOrder, getSingleOrder, myOrders, allOrders };

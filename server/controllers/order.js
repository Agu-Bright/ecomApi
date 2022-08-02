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

//Admin update, process order => api/v1/admin/order/:id

const updateOrder = catchAsyncErrors(async (req, res, next) => {
  const { status } = req.body;
  const order = await ORDER.findById(req.params.id);

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("This order is already delivered", 400));
  }

  order.orderItems.forEach(async () => {
    await updateStock(item.product, item.quantity);
  });

  order.orderStatus = status;
  order.deliveredAt = Date.now();

  await order.save();

  res.status(200).json({
    success: true,
  });
});

const updateStock = async (id, quantity) => {
  const product = await PRODUCT.findById(id);
  product.stock = product.stock - quantity;
  await product.save({ validateBeforeSave: false });
};

//Admin delete order => api/v1/order/:id
const deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await ORDER.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("No order found with this id", 404));
  }
  await order.remove();

  res.status(200).json({
    success: true,
  });
});

module.exports = {
  newOrder,
  getSingleOrder,
  myOrders,
  allOrders,
  updateOrder,
  deleteOrder,
};

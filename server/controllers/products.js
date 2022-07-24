const PRODUCT = require("../model/product");
const mongoose = require("mongoose");

//create new Product /api/v1/product/new
const newProduct = async (req, res, next) => {
  const product = await PRODUCT.create(req.body);
  res.status(201).json({ success: true, product });
};

//get all products => /api/v1/products
const getAllProducts = async (req, res, next) => {
  //add the functionality of the **PAGINATION **SEARCH **FILTER
  const products = await PRODUCT.find();

  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
};

//get Single Product details => /api/v1/product/:id
const getProduct = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("There is no post with that Id found");

  const product = await PRODUCT.findById(id);
  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product Not Found" });
  }
  res.status(200).json({ success: true, product });
};

//update product => /api/v1/admin/product/:id
const updateProduct = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("There is no post with that Id found");
  const product = await PRODUCT.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidator: true,
    useFindAndModify: true,
  });
  res.status(200).json({ success: true, product });
};

//deleteProduct
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("There is no post with that Id found");

  const product = await PRODUCT.findByIdAndRemove(id);

  res.status(200).json({ success: true });
};

module.exports = {
  newProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};

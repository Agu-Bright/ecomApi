const express = require("express");
const router = express.Router();
const {
  newProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} = require("../controllers/products");

router.post("admin/product/new", newProduct);
router.put("/product/:id", updateProduct);

router.get("/products", getAllProducts);
router.get("/product/:id", getProduct);
module.exports = router;

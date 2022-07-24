const express = require("express");
const router = express.Router();

const {
  newProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/products");

router.post("/admin/product/new", newProduct);
router.put("/admin/product/:id", updateProduct);
router.delete("/admin/product/:id", deleteProduct);

router.get("/products", getAllProducts);
router.get("/product/:id", getProduct);

module.exports = router;

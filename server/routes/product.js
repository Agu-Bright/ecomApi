const express = require("express");
const router = express.Router();

const {
  newProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/products");
const {
  authMiddleWare,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

router.post(
  "/admin/product/new",
  authMiddleWare,
  authorizeRoles("admin"),
  newProduct
);
router.put(
  "/admin/product/:id",
  authMiddleWare,
  authorizeRoles("admin"),
  updateProduct
);
router.delete(
  "/admin/product/:id",
  authMiddleWare,
  authorizeRoles("admin"),
  deleteProduct
);

router.get("/products", getAllProducts);
router.get("/product/:id", getProduct);

module.exports = router;

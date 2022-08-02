const express = require("express");
const router = express.Router();

const {
  newProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
  deletereview,
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
router.put("/review", authMiddleWare, createProductReview);
router.get("/reviews", authMiddleWare, getProductReviews);
router.delete("/reviews", authMiddleWare, deletereview);

module.exports = router;

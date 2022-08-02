const express = require("express");
const router = express.Router();
const {
  newOrder,
  myOrders,
  getSingleOrder,
  allOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/order");
const {
  authMiddleWare,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

router.post("/order/new", authMiddleWare, newOrder);
router.get("/order/:id", authMiddleWare, getSingleOrder);
router.get("/orders/me", authMiddleWare, myOrders);

router.get("/admin/orders", authMiddleWare, authorizeRoles("admin"), allOrders);
router.put(
  "/admin/order/:id",
  authMiddleWare,
  authorizeRoles("admin"),
  updateOrder
);
router.delete(
  "/admin/order/:id",
  authMiddleWare,
  authorizeRoles("admin"),
  deleteOrder
);
module.exports = router;

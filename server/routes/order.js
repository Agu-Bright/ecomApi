const express = require("express");
const router = express.Router();
const {
  newOrder,
  myOrders,
  getSingleOrder,
  allOrders,
} = require("../controllers/order");
const {
  authMiddleWare,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

router.post("/order/new", authMiddleWare, newOrder);
router.get("/order/:id", authMiddleWare, getSingleOrder);
router.get("/orders/me", authMiddleWare, myOrders);

router.get("/admin/orders", authMiddleWare, authorizeRoles("admin"), allOrders);

module.exports = router;

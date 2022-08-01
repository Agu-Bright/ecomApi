const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  getUsers,
  adminGetUserDetail,
  adminUpdateUserDetails,
  deleteUser,
} = require("../controllers/authController");
const {
  authMiddleWare,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);

router.get("/me", authMiddleWare, getUserDetails);
router.put("/password/update", authMiddleWare, updatePassword);
router.put("/me/update", authMiddleWare, updatePassword);

//admin routes
router.get("/admin/user", authMiddleWare, authorizeRoles("admin"), getUsers);
router.get(
  "/admin/user/:id",
  authMiddleWare,
  authorizeRoles("admin"),
  adminGetUserDetail
);
router.put(
  "/admin/user/:id",
  authMiddleWare,
  authorizeRoles("admin"),
  adminUpdateUserDetails
);
router.delete(
  "/admin/user/:id",
  authMiddleWare,
  authorizeRoles("admin"),
  deleteUser
);

router.get("/logout", logoutUser);

module.exports = router;

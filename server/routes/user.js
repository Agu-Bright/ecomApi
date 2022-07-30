const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
} = require("../controllers/authController");
const { authMiddleWare } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);

router.get("/me", authMiddleWare, getUserDetails);
router.put("/password/update", authMiddleWare, updatePassword);
router.put("/me/update", authMiddleWare, updatePassword);

router.get("/logout", logoutUser);

module.exports = router;

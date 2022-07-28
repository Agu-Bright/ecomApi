const jwt = require("jsonwebtoken");
const USER = require("../model/user");
const catchAsyncErrors = require("./catchAsyncErrors");

const authMiddleWare = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(
      new ErrorHandler("You are not authorized to view this resourse", 401)
    );
  }

  const decode = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await USER.findById(decode.id);
  next();
});

module.exports = authMiddleWare;

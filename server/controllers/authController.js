const USER = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");

//Register a user => /api/v1/register
const registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await USER.create({
    name,
    email,
    password,
    avater: {
      public_id: "avaters/kccvibpsuiusmwfepb3m",
      url: "https://res.cloudinary.com/shopit/image/upload/v1606305757/avaters/kccvibpsuiusmwfepb3m.png",
    },
  });

  //set Token to the cookie header
  sendToken(user, 200, res);
});

//Login User => /api/v1/login
const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  //check if email and password is entered by user
  if ((!email, !password)) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }

  //finding user in database
  const user = await USER.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  //check if password is correct or not
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  //set token to the cookie header
  sendToken(user, 200, res);
});

//LOGOUT USER => /api/v1/logout
const logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookies =
    ("token",
    null,
    {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

module.exports = { registerUser, loginUser, logoutUser };

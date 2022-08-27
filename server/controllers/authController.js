const USER = require("../model/user");
const bcrypt = require("bcryptjs");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

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

//FORGOT_PASSWORD => /api/v1/password/forgot
const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await USER.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("No user with this email found", 404));
  }

  //get reset token
  const resetToken = user.getRessetPasswordToken();
  await user.save({ validateBeforeSave: false });

  //send email to the user
  // --create reset password url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is as follows:\n\n ${resetUrl}\n\n If you have not requested this email, then ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Brysontech Password Recovery",
      message,
    });

    res
      .status(200)
      .json({ success: true, message: `Email sent to ${user.email}` });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

//RESET_PASSWORD => api/v1/password/reset/:token
const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { password, confirmPassword } = req.body;
  const { token } = req.params;
  //hash url token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  //compare the reset password hashed token with the one in the database
  const user = await USER.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler("Password reset token is invalid or has expired", 400)
    );
  }
  if (password !== confirmPassword) {
    return next(new ErrorHandler("password does not match", 400));
  }

  //setUp new password
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save({ validateBeforeSave: false });

  //set token to the cookie header
  sendToken(user, 200, res);
});

// GET_LOGGEDIN_USER_PROFILE => api/v1/user/me
const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await USER.findById(req.user.id);
  if (!user) {
    return next(new ErrorHandler("no user found", 404));
  }
  res.status(200).json({
    success: true,
    user,
  });
});

//UPDATE_USER_PASSWORD
const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  //get the user
  const user = await USER.findById(req.user.id).select("+password");
  //campare password
  const doesPassswordMatch = await bcrypt.compare(oldPassword, user.password);
  if (!doesPassswordMatch) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  sendToken(user, 200, res);
});

//UPDATE_USER_DETAILS
const updateUserDetails = catchAsyncErrors(async (req, res, next) => {
  const update = {
    name: req.body.name,
    email: req.body.email,
    //update avata: TODO
  };

  await USER.findByIdAndUpdate(req.user.id, update, {
    new: true,
    runValidator: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

//LOGOUT USER => /api/v1/logout
const logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

//ADMIN_ROUTES

//get all users => api/v1/admin

const getUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await USER.find();

  res.status(200).json({
    success: true,
    users,
  });
});

//get user detail => api/v1/admin/user/:id
const adminGetUserDetail = catchAsyncErrors(async (req, res, next) => {
  const user = await USER.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler(`No User Found with the id ${req.params.id}`));
  }
  res.status(200).json({
    success: true,
    user,
  });
});

//UPDATE_USER_DETAILS => api/v1/admin/user/:id
const adminUpdateUserDetails = catchAsyncErrors(async (req, res, next) => {
  const update = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await USER.findByIdAndUpdate(req.params.id, update, {
    new: true,
    runValidator: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

//DELETE USER => /api/v1/admin/user/:id
const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await USER.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler(`No user with the id:${req.params.id} found`));
  }

  //Remove avater from cloudinary- TODO

  await user.remove();
  res.status(200).json({
    success: true,
  });
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateUserDetails,
  getUsers,
  adminGetUserDetail,
  adminUpdateUserDetails,
  deleteUser,
};

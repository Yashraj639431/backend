const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtoken");
const validateMongoDbId = require("../utils/validateMongodbid");
const { generateRefreshToken } = require("../config/refreshtoken");
const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Coupon = require("../models/couponModel");
const jwt = require("jsonwebtoken");
const sendEmail = require("./emailCtrl");
const crypto = require("crypto");
const uniqid = require("uniqid");

// Create a User
const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    // Create a new user
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    // User already exist
    throw new Error("User Already Exists");
  }
});

// Login a User
const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // Check if user exists or not
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updateuser = await User.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken: refreshToken,
      },
      {
        new: true,
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

// Admin Login
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // Check if user exists or not
  const findAdmin = await User.findOne({ email });
  if (findAdmin.role !== "admin") throw new Error("Not Authorised");
  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findAdmin?._id);
    const updateuser = await User.findByIdAndUpdate(
      findAdmin.id,
      {
        refreshToken: refreshToken,
      },
      {
        new: true,
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findAdmin?._id,
      firstname: findAdmin?.firstname,
      lastname: findAdmin?.lastname,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      token: generateToken(findAdmin?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

// Handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("No Refresh token person in db or not matched");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with refresh token");
    }
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });
});

// Logout Function
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refeshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); //Forbidden
  }
  await User.findOneAndUpdate(refreshToken, {
    refreshToken: "",
  });
  res.clearCookie("refeshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204); //Forbidden
});

// Update a User
const updatedaUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const updatedaUser = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      {
        new: true,
      }
    );
    res.json(updatedaUser);
  } catch (error) {
    throw new Error(error);
  }
});

// Save Address
const saveAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const updatedaUser = await User.findByIdAndUpdate(
      _id,
      {
        address: req?.body?.address,
      },
      {
        new: true,
      }
    );
    res.json(updatedaUser);
  } catch (error) {
    throw new Error(error);
  }
});

// Get All Users
const getAllUser = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

// Get a Single User
const getAUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getaUser = await User.findById(id);
    res.json({
      getaUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Delete a Single User
const DelaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const DeleteAUser = await User.findByIdAndDelete(id);
    res.json({
      DeleteAUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Block a User
const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const block = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json(block);
  } catch (error) {
    throw new Error(error);
  }
});

// Unblock a User
const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const unblock = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json(unblock);
  } catch (error) {
    throw new Error(error);
  }
});

// Update a Password
const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongoDbId(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.json(updatedPassword);
  } else {
    res.json(user);
  }
});

// Forgot Password
const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found with this email");
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:5000/api/user/reset-passoword/${token}'>Click Here</>`;
    const data = {
      to: email,
      text: "Hey User",
      subject: "Forgot Password Link",
      htm: resetURL,
    };
    sendEmail(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});

// Reset Password
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Token Expired, Please try again later");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
});

// Wishlist
const getwishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const findUser = await User.findById(_id).populate("wishlist");
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});

// Add to Cart
const userCart = asyncHandler(async (req, res) => {
  const { cart } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    let products = [];
    const user = await User.findById(_id);
    //Check if user already have product  in cart
    const alreadyExistCart = await Cart.findOne({ orderby: user._id });
    if (alreadyExistCart) {
      alreadyExistCart.remove();
    }
    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i]._id;
      object.count = cart[i].count;
      object.color = cart[i].color;
      let getPrice = await Product.findById(cart[i]._id).select("price").exec();
      object.price = getPrice.price;
      products.push(object);
    }
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].count;
    }
    let newCart = await new Cart({
      products,
      cartTotal,
      orderby: user?._id,
    }).save();
    res.json(newCart);
  } catch (error) {
    throw new Error(error);
  }
});

// Cart
const getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const cart = await Cart.findOne({ orderby: _id }).populate(
      "products.product"
    );
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

// Empty Cart
const emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const user = await User.findOne({ _id });
    const cart = await Cart.findOneAndRemove({ orderby: user._id });
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

// Apply Coupon
const applyCoupon = asyncHandler(async (req, res) => {
  const { coupon } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);
  const validCoupon = await Coupon.findOne({ name: coupon });
  if (validCoupon === null) {
    throw new Error("Invalid Coupon");
  }
  const user = await User.findOne({ _id });
  const { cartTotal } = await Cart.findOne({
    orderby: user._id,
  });

  const totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2);
  await Cart.findOneAndUpdate(
    {
      orderby: user._id,
    },
    {
      totalAfterDiscount,
    },
    {
      new: true,
    }
  );
  res.json(totalAfterDiscount);
});

// Create Order
const createOrder = asyncHandler(async (req, res) => {
  const { COD, couponApplied } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    if (!COD) throw new Error("Create cash order failed");
    const user = await User.findById(_id);
    const userCart = await Cart.findOne({ orderby: user._id });
    let finalAmount = 0;
    if (couponApplied && userCart.totalAfterDiscount) {
      finalAmount = userCart.totalAfterDiscount;
    } else {
      finalAmount = userCart.cartTotal;
    }

    const newOrder = await new Order({
      products: userCart.products,
      paymentIntent: {
        id: uniqid(),
        method: "COD",
        amount: finalAmount,
        status: "Cash on Delivery",
        created: Date.now(),
        currency: "usd",
      },
      orderby: user._id,
      orderStatus: "Cash on Delivery",
    }).save();

    let update = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      };
    });
    const updated = await Product.bulkWrite(update, {});
    res.json({ message: "success" });
  } catch (error) {
    throw new Error(error);
  }
});

// List Orders
const getOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const userOrders = await Order.findOne({ orderby: _id })
      .populate("products.product")
      .populate("orderby")
      .exec();
    res.json(userOrders);
  } catch (error) {
    throw new Error(error);
  }
});

// List all Orders
const getallOrders = asyncHandler(async (req, res) => {
  try {
    const alluserOrders = await Order.find()
      .populate("products.product")
      .populate("orderby")
      .exec();
    res.json(alluserOrders);
  } catch (error) {
    throw new Error(error);
  }
});

// Update Order Status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const findOrder = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
        paymentIntent: {
          status: status,
        },
      },
      {
        new: true,
      }
    );
    res.json(findOrder);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createUser,
  loginUserCtrl,
  getAllUser,
  getAUser,
  DelaUser,
  updatedaUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdmin,
  getwishlist,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrders,
  updateOrderStatus,
  getallOrders
};
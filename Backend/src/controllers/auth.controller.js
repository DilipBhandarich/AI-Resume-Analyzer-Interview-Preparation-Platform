const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const tokenBlacklistModel = require("../models/blacklist.model");
const { parseCredentials, parseRegistration } = require("../validation/auth.validation");
const { createAccessToken, getAuthCookieOptions } = require("../config/security");
/**
 * @name registerUserController
 * @description Register a new user,expects a request body with the following fields: name, email, password
 * @access public
 */

async function registerUserController(req, res) {
  const { username, email, password } = parseRegistration(req.body);

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserAlreadyExists) {
    return res.status(400).json({
      message: "Account already exists with this email address or username",
    });
  }
  const hash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    password: hash,
  });

  res.cookie("token", createAccessToken(user), getAuthCookieOptions());

  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

/**
 * @name loginUserController
 * @description login a user,expects and password in the request body
 * @access Public
 */

async function loginUserController(req, res) {
  const { email, password } = parseCredentials(req.body);

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  res.cookie("token", createAccessToken(user), getAuthCookieOptions());
  res.status(200).json({
    message: "User loggedIn Successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

/**
 * @name logoutController
 * @description logout a user, clears the token from the cookie and adds the token to the blacklist
 * @access Public
 */

async function logoutUserController(req, res) {
  const token = req.cookies.token;

  if (token) {
    // add token into blacklist
    await tokenBlacklistModel.create({ token });
  }
  res.clearCookie("token", getAuthCookieOptions());

  res.status(200).json({
    message: "User logout sucessfully",
  });
}
/**
 * @name getMeController
 * @description get the logged in user details
 * @access Private
 */

async function getMeController(req, res) {
  const user = await userModel.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  res.status(200).json({
    message: "User details fetched successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}
module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController,
  getMeController,
};

const { Router } = require("express");
const authController = require("../controllers/auth.controller");
const authRouter = Router();
const authMiddleware = require("../middleware/auth.middleware");
/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */

authRouter.post("/register", authController.registerUserController);

/**
 * @route POST /api/auth/login
 * @description login user with email  and password
 * @access Public
 */

authRouter.post("/login", authController.loginUserController);

/**
 * @route POST /api/auth/logout
 * @description clear token from user cookie and add the token in blacklist
 * @access Public
 */

authRouter.get("/logout", authController.logoutUserController);
/**
 * @route GET /api/auth/get-me
 * @description get the logged in user details
 * @access Private
 */
authRouter.get("/get-me", authMiddleware, authController.getMeController);
module.exports = authRouter;

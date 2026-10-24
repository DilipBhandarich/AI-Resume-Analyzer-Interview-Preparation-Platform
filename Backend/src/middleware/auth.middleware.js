const tokenBlackModel = require("../models/blacklist.model");
const { verifyAccessToken } = require("../config/security");
async function authUser(req, res, next) {
  const token = req.cookies.token || req.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (!token) {
    return res.status(401).json({
      message: "Token not provided",
    });
  }

  try {
    const tokenInBlacklisted = await tokenBlackModel.findOne({ token }).lean();
    if (tokenInBlacklisted) {
      return res.status(401).json({ message: "Authentication failed" });
    }
    const decoded = verifyAccessToken(token);

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Authentication failed" });
  }
}

module.exports = authUser;

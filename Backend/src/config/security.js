const jwt = require("jsonwebtoken");

const JWT_ALGORITHM = "HS256";
const JWT_ISSUER = process.env.JWT_ISSUER || "ai-resume-analyzer";
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || "ai-resume-analyzer-web";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be configured with at least 32 characters");
  }
  return secret;
}

function createAccessToken(user) {
  return jwt.sign(
    { id: user._id.toString(), username: user.username },
    getJwtSecret(),
    {
      algorithm: JWT_ALGORITHM,
      expiresIn: process.env.JWT_EXPIRES_IN || "2h",
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    },
  );
}

function verifyAccessToken(token) {
  return jwt.verify(token, getJwtSecret(), {
    algorithms: [JWT_ALGORITHM],
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  });
}

function getAuthCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.COOKIE_SAMESITE || "lax",
    maxAge: 2 * 60 * 60 * 1000,
    path: "/",
  };
}

module.exports = {
  JWT_ALGORITHM,
  createAccessToken,
  getAuthCookieOptions,
  verifyAccessToken,
};

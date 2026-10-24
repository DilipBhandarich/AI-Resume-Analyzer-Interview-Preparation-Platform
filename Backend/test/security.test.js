const test = require("node:test");
const assert = require("node:assert/strict");

process.env.JWT_SECRET = "test-secret-with-at-least-32-characters-long";
const { createAccessToken, verifyAccessToken } = require("../src/config/security");
const { parseCredentials, parseRegistration } = require("../src/validation/auth.validation");

test("registration validation normalizes email and username", () => {
  assert.deepEqual(parseRegistration({ username: "  ada_1 ", email: " ADA@EXAMPLE.COM ", password: "password123" }), { username: "ada_1", email: "ada@example.com", password: "password123" });
});
test("credential validation rejects invalid input", () => {
  assert.throws(() => parseCredentials({ email: "not-an-email", password: "short" }));
});
test("access tokens verify claims and reject tampering", () => {
  const token = createAccessToken({ _id: "507f1f77bcf86cd799439011", username: "ada" });
  const decoded = verifyAccessToken(token);
  assert.equal(decoded.id, "507f1f77bcf86cd799439011");
  assert.equal(decoded.iss, "ai-resume-analyzer");
  assert.throws(() => verifyAccessToken(`${token}tampered`));
});

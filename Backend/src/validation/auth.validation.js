const { z } = require("zod");

const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(8).max(128),
});

const registrationSchema = credentialsSchema.extend({
  username: z.string().trim().min(3).max(32).regex(/^[a-zA-Z0-9_.-]+$/),
});

function parseRegistration(body) {
  return registrationSchema.parse(body);
}

function parseCredentials(body) {
  return credentialsSchema.parse(body);
}

module.exports = { parseCredentials, parseRegistration };

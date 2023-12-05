const { rateLimit } = require("express-rate-limit");

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 100,
  message: "You have exceeded the 100 requests in 1 minutes limit!",
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
module.exports = {
  rateLimiter,
};

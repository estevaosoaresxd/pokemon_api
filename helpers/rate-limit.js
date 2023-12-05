const { rateLimit } = require("express-rate-limit");
const { logger } = require("./logger");

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 100,
  message: "You have exceeded the 100 requests in 1 minutes limit!",
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler: (req, res) => {
    const msg = "You have exceeded the 100 requests in 1 minutes limit!";

    logger.log("error", msg);

    return res.status(429).json(messageError);
  },
});
module.exports = {
  rateLimiter,
};

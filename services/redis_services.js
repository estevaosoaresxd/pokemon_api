const cache = require("../helpers/cache");
const { logger } = require("../helpers/logger");

const invalidateCache = (req, res, next) => {
  const cacheKey = req.originalUrl;

  cache.del(cacheKey, (err) => {
    if (err) {
      const msg = `Erro ao invalidar cache: ${er}, route: ${cacheKey} `;
      console.error(msg);
      logger.log("error", msg);
    }
    next();
  });
};

module.exports = {
  invalidateCache,
};

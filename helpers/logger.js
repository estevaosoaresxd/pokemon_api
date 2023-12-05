const { createLogger, transports, format } = require("winston");

const logger = createLogger({
  level: "info",
  format: format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    new transports.File({ filename: "logger.log" }),
    new transports.File({ filename: "error.log", level: "error" }),
  ],
});

module.exports = {
  logger,
};

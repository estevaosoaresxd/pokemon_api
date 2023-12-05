const { createLogger, transports, format } = require("winston");
const { combine, timestamp, json } = format;

const logger = createLogger({
  transports: [
    new transports.File({
      filename: "logger.log",
      level: "info",
      format: combine(timestamp(), json()),
    }),
    new transports.File({
      filename: "error.log",
      level: "error",
      format: combine(timestamp(), json()),
    }),
  ],
});

module.exports = {
  logger,
};

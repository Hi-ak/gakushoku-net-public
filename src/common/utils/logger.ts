import { mkdir } from "fs";
import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  // transport: {
  //   target: "pino-pretty",
  // },
});

export const logAPI = (req: Request) => {
  logger.info({ type: "API", method: req.method, url: req.url });
};

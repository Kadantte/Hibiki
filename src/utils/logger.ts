/**
 * @file Logger
 * @description Handles console logging and transports
 */

import pino from "pino";

/**
 * Creates a new pino logger
 */

const pinoOptions: pino.LoggerOptions = {
  transport: {
    target: "pino-pretty",
    options: {
      translateTime: "yyyy-mm-dd HH:MM:ss",
      colorize: true,
    },
  },
};

// Exports pino logger
export const logger = pino(process.env.NODE_ENV === "production" ? {} : pinoOptions);

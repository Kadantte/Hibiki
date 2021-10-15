/**
 * @file Logger
 * @description Handles console logging and transports
 */

import pino from "pino";

/**
 * Creates a new pino logger
 */

export const logger = pino({
  // @ts-expect-error See https://github.com/pinojs/pino-pretty/issues/248
  transport: {
    target: "pino-pretty",
    options: {
      translateTime: "yyyy-mm-dd HH:MM:ss",
      colorize: true,
    },
  },
});

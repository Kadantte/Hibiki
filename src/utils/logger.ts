/**
 * @file Logger
 * @description Handles console logging and transports
 */

import type { PrettyOptions } from "pino";
import pino from "pino";

// Pretty printing options
const prettyPrinterOptions: PrettyOptions = {
  translateTime: "yyyy-mm-dd HH:MM:ss",
  colorize: true,
};

/**
 * Creates a new pino logger
 */

export const logger = pino({
  prettyPrint: process.env.NODE_ENV === "production" ? undefined : prettyPrinterOptions,
});

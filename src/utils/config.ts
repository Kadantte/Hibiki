/**
 * @file Config
 * @description Utilities for TOML config files
 * @module config
 */

import type { PathLike } from "fs";
import TOML from "@iarna/toml";
import fs from "fs";

/**
 * Parses a Hibiki config file
 * @param file The file path to parse
 * @param parseValid Whether or not to "lazily" check the validity of a config
 * @returns A valid Hibiki config
 */

export function parseHibikiConfig(file: PathLike, parseValid = false) {
  // Ensures the file exists I guess
  if (!fs.existsSync(file)) throw new Error("Failed to find a config.toml file in the path provided");

  // Reads the config file
  const configFile = fs.readFileSync(file, { encoding: "utf-8" })?.toString();
  if (!configFile?.length) throw new Error("An empty config.toml file was provided");

  // Parses the config file
  const config = TOML.parse(configFile) as unknown as HibikiConfig;

  // Lazily checks to see if the config is "probably" setup right
  if (parseValid) {
    if (!config.hibiki) throw new Error("No valid Hibiki config was found in the config file.");
    if (!config.hibiki.token?.length) throw new Error("No token was provided in the config file.");
    if (!config.hibiki.locale?.length) throw new Error("No locale was provided in the config file.");
  }

  return config;
}

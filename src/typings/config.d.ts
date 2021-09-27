/**
 * @file Config
 * @description Typings for the Hibiki config file
 * @typedef config
 */

// A valid Hibiki config
interface HibikiConfig {
  hibiki: HibikiBaseOptions;
  options: import("discord.js").ClientOptions;
  database: HibikiDatabaseOptions;
}

// Options for Hibiki itself
type HibikiBaseOptions = {
  token: string;
  locale: HibikiLocaleCode;
  testGuildID: DiscordSnowflake;
};

// A valid Hibiki database config
interface HibikiDatabaseOptions {
  provider: HibikiDatabaseProvider;
}

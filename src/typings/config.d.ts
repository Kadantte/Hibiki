/**
 * @file Config
 * @description Typings for the Hibiki config file
 * @typedef config
 */

type PrivateColorResolvable = import("discord.js").ColorResolvable;

// A valid Hibiki config
interface HibikiConfig {
  hibiki: HibikiBaseOptions;
  options: import("discord.js").ClientOptions;
  database: HibikiDatabaseOptions;
  colours: HibikiColourOptions;
}

// Options for Hibiki itself
type HibikiBaseOptions = {
  token: string;
  locale: HibikiLocaleCode;
  testGuildID: DiscordSnowflake;
};

// A valid Hibiki database config
interface HibikiDatabaseOptions {
  user?: string;
  password?: string;
  port?: number;
  host?: string;
  database?: string;
  schema: string;
  provider: HibikiDatabaseProvider;
}

// Valid hex colour config
type HibikiColourOptions = {
  primary: PrivateColorResolvable;
  error: PrivateColorResolvable;
  success: PrivateColorResolvable;
  warning: PrivateColorResolvable;
};

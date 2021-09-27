/**
 * @file Database types
 * @description Typings for Database items
 * @typedef database
 */

// Valid database table names
type HIBIKI_DATABASE_TABLE_NAMES = "GUILD_CONFIGS" | "USER_CONFIGS";

// Valid database providers
type HibikiDatabaseProvider = "postgres" | "json";

// A Hibiki guild config
interface HibikiGuildConfig {
  id: DiscordSnowflake;
  locale?: HibikiLocaleCode;
}

// A Hibiki user config
interface HibikiUserConfig {
  id: DiscordSnowflake;
  locale?: HibikiLocaleCode;
}

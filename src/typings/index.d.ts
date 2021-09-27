/**
 * @file Index
 * @description Global typings for Hibiki
 * @typedef index.d.ts
 */

// Privately imports types to not break global typings
type PrivateClientEvents = import("discord.js").ClientEvents;

// Hibiki event emitters
type HibikiEventEmitter = keyof PrivateClientEvents;

// Global Discord snowflake type
type DiscordSnowflake = import("discord.js").Snowflake;

// Valid locale codes. This list will need to be updated manually.
type HibikiLocaleCode = "en-GB";

// Valid database provider names
type HibikiDatabaseProvider = "postgres" | "json";

/**
 * @file Provider
 * @description Base database provider for providers to extend from
 * @module HibikiProvider
 */

import type { HibikiClient } from "./Client";
import type { PathLike } from "fs";
import { logger } from "../utils/logger";
import fs from "fs";

// Valid database tables
export const HIBIKI_DATABASE_TABLES: HIBIKI_DATABASE_TABLE_NAMES[] = ["GUILD_CONFIGS", "USER_CONFIGS"];

/** Type for a callabale Hibiki provider */
interface CallableHibikiProvider {
  new (bot: HibikiClient, ...params: any[]): HibikiProvider;
}

/**
 * Gets a database provider and loads it
 * @param provider The provider to load
 * @param directory The directory to look for providers in
 * @returns A loaded database provider
 */

export function getDatabaseProvider(provider: HibikiDatabaseProvider, directory: PathLike) {
  let providerToLoad;

  // Looks through providers and finds the matching one
  const providers = fs.readdirSync(directory, { withFileTypes: true, encoding: "utf-8" });
  const providerFile = providers.find((file) => file.name.replace(/\.(?:t|j)s/, "")?.toLowerCase() === provider.toLowerCase())?.name;

  // Tries to load the provider
  try {
    providerToLoad = require(`${directory}/${providerFile}`);
  } catch (err) {
    logger.error(`Failed to load the database provider ${providerFile}, falling back to JSON: ${err}`);
    providerToLoad = require(`${directory}/JSON`);
  }

  // Returns the loaded provider
  return providerToLoad[Object.keys(providerToLoad)[0]] as CallableHibikiProvider;
}

/**
 * Base class for all providers to extend from
 * @abstract
 */

export abstract class HibikiProvider {
  /** The name/ID of the provider */
  abstract providerName: HibikiDatabaseProvider;

  /**
   * Initializes a database
   * @param params Any params needed in said provider
   */

  abstract init(...params: any): Promise<any>;

  /**
   * Gets a guild's config
   * @param guild The guild ID to lookup
   * @returns A guild's config
   */

  abstract getGuildConfig(guild: DiscordSnowflake): Promise<HibikiGuildConfig>;

  /**
   * Deletes a guild's config
   * @param guild The guild ID to delete a config for
   */

  abstract deleteGuildConfig(guild: DiscordSnowflake): Promise<any>;

  /**
   * Inserts a blank guild config
   * @param guild The guild ID to insert a blank config for
   */

  abstract insertBlankGuildConfig(guild: DiscordSnowflake): Promise<any>;

  /**
   * Updates a guild's config
   * @param guild The guild ID to update a config in
   * @param config The config to insert
   */

  abstract updateGuildConfig(guild: DiscordSnowflake, config: HibikiGuildConfig): Promise<any>;

  /**
   * Replaces a guild's config
   * @param guild The guild ID to replace a config in
   * @param config The config to insert
   */

  abstract replaceGuildConfig(guild: DiscordSnowflake, config: HibikiGuildConfig): Promise<any>;

  /**
   * Gets a guild's config
   * @param guild The guild ID to lookup
   * @returns A guild's config
   */

  abstract getUserConfig(guild: DiscordSnowflake): Promise<HibikiUserConfig>;

  /**
   * Deletes a user's config
   * @param user The user ID to delete a config for
   */

  abstract deleteUserConfig(user: DiscordSnowflake): Promise<any>;

  /**
   * Inserts a blank user config
   * @param user The user ID to insert a blank config for
   */

  abstract insertBlankUserConfig(user: DiscordSnowflake): Promise<any>;

  /**
   * Updates a user's config
   * @param guild The user ID to update a config in
   * @param config The config to insert
   */

  abstract updateUserConfig(user: DiscordSnowflake, config: HibikiUserConfig): Promise<any>;

  /**
   * Replaces a user's config
   * @param user The user ID to replace a config in
   * @param config The config to insert
   */

  abstract replaceUserConfig(user: DiscordSnowflake, config: HibikiUserConfig): Promise<any>;
}

/**
 * @file Client
 * @description Connects to Discord and handles global functionality
 * @module HibikiClient
 */

import type { HibikiCommand } from "./Command";
import type { HibikiEvent } from "./Event";
import type { HibikiLogger } from "./Logger";
import { loadCommands, loadEvents } from "../utils/loader";
import { logger } from "../utils/logger";
import { HibikiLocaleSystem } from "./LocaleSystem";
import { getDatabaseProvider, HibikiProvider } from "./Provider";
import Discord from "discord.js";
import path from "path";

// Directories to crawl
const COMMANDS_DIRECTORY = path.join(__dirname, "../commands");
const EVENTS_DIRECTORY = path.join(__dirname, "../events");
const LOGGERS_DIRECTORY = path.join(__dirname, "../loggers");
const PROVIDERS_DIRECTORY = path.join(__dirname, "../providers");
const LOCALES_DIRECTORY = path.join(__dirname, "../locales");

export class HibikiClient extends Discord.Client {
  readonly config: HibikiConfig;
  readonly commands: Discord.Collection<string, HibikiCommand> = new Discord.Collection();
  readonly events: Discord.Collection<string, HibikiEvent> = new Discord.Collection();
  readonly loggers: Discord.Collection<string, HibikiLogger> = new Discord.Collection();
  readonly db: HibikiProvider;
  readonly localeSystem: HibikiLocaleSystem;

  constructor(config: HibikiConfig) {
    super({ ...config.options, intents: [Discord.Intents.FLAGS.GUILDS] });

    this.config = config;

    // Finds the database provider to use
    const HibikiDatabaseProvider = getDatabaseProvider(this.config.database?.provider || "json", PROVIDERS_DIRECTORY);

    // Handlers & functions
    this.db = new HibikiDatabaseProvider(this);
    this.localeSystem = new HibikiLocaleSystem(LOCALES_DIRECTORY, this.config.hibiki.locale);
  }

  /**
   * Initialises the bot
   */

  public init() {
    // Logs into Discord
    this.login(this.config.hibiki.token).then(() => {
      // Initializes the database
      this.db.init();

      // Loads commands, events, and loggers
      loadCommands(this, COMMANDS_DIRECTORY);
      loadEvents(this, EVENTS_DIRECTORY);
      loadEvents(this, LOGGERS_DIRECTORY, true);

      logger.info(`Logged in as ${this.user?.tag} on ${this.guilds.cache.size} guilds on shard #${this.shard?.ids[0]}`);
      logger.info(`${this.commands.size} commands and ${this.events.size} events loaded on shard #${this.shard?.ids[0]}`);
      logger.info(`${Object.keys(this.localeSystem.locales).length} locales loaded on shard #${this.shard?.ids[0]}`);
    });
  }
}

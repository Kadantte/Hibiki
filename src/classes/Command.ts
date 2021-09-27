/**
 * @file Command
 * @description Base class for all commands to extend from
 * @module HibikiCommand
 */

import type { HibikiClient } from "./Client";
import type { ApplicationCommandOptionData, MessageComponentInteraction } from "discord.js";
import type { ApplicationCommandTypes } from "discord.js/typings/enums";
import { Constants } from "discord.js";

// Exports command option types as this isn't exported by Discord.js itself for some idiotic reason
export const CommandOptionTypes = Constants.ApplicationCommandOptionTypes;

export abstract class HibikiCommand {
  type: ApplicationCommandTypes = 3;
  options?: ApplicationCommandOptionData[];
  voice = false;

  abstract description: string;

  /**
   * Creates a new Hibiki command
   * @param bot Main bot object
   * @param name The command name (matches the filename)
   * @param category The command category (matches the category)
   */

  constructor(protected bot: HibikiClient, public name: string, public category: string) {}

  /**
   * Runs a command
   * @param interaction The interaction to work with
   */

  abstract run(interaction: MessageComponentInteraction, ...args: string[]): Promise<void>;
}

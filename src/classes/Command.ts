/**
 * @file Command
 * @description Base class for all commands to extend from
 * @module HibikiCommand
 */

import type { HibikiClient } from "./Client";
import type { ApplicationCommandOptionData, CommandInteraction } from "discord.js";
import type { ApplicationCommandTypes } from "discord.js/typings/enums";
import { Constants } from "discord.js";

export const CommandOptionTypes = Constants.ApplicationCommandOptionTypes;

export abstract class HibikiCommand {
  type?: ApplicationCommandTypes;
  options?: ApplicationCommandOptionData[];

  // Whether or not a command is voice-only
  voice = false;

  // A short description of a command
  abstract description: string;

  /**
   * Creates a new Hibiki command
   * @param bot Main bot object
   * @param name The command name (matches the filename)
   * @param category The command category (matches the directory)
   */

  constructor(protected bot: HibikiClient, public name: string, public category: string) {}

  /**
   * Runs a command
   * @param interaction The interaction to handle
   */

  public abstract run(interaction: CommandInteraction, ...args: string[]): Promise<void>;
}

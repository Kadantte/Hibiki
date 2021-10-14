/**
 * @file Interaction
 * @description Handles slash command interactions
 * @module HibikiInteractionEvent
 */

import type { MessageComponentInteraction } from "discord.js";
import { HibikiEvent } from "../classes/Event";

export class HibikiInteractionEvent extends HibikiEvent {
  events: HibikiEventEmitter[] = ["interactionCreate"];

  public async run(_event: HibikiEventEmitter, interaction: MessageComponentInteraction) {
    if (!interaction || !interaction.isCommand()) return;

    // Finds the command
    const command = this.bot.commands.find((c) => c.name === interaction.commandName);
    if (!command) return;

    // Gets the user's locale
    let locale = this.bot.config.hibiki.locale;
    const guildconfig = await this.bot.db.getGuildConfig(interaction.guild?.id as DiscordSnowflake);
    const userLocale = await this.bot.localeSystem.getUserLocale(interaction.user.id, this.bot);
    if (userLocale) locale = userLocale;
    else if (guildconfig?.locale && !userLocale) locale = guildconfig.locale;

    // Wrapper for getLocaleFunction();
    const getLocaleStringFunction = this.bot.localeSystem.getLocaleFunction(locale);
    interaction.getLocaleString = getLocaleStringFunction;

    // Runs the command
    try {
      await command.run(interaction);
    } catch (err) {
      throw new Error(err as string);
    }
  }
}

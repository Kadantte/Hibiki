/**
 * @file Ping command
 * @module PingCommand
 */

import type { MessageComponentInteraction } from "discord.js";
import { HibikiCommand } from "../../classes/Command";

export class PingCommand extends HibikiCommand {
  description = "Checks the current status of the bot.";

  public async run(interaction: MessageComponentInteraction) {
    interaction.reply({
      embeds: [
        {
          title: interaction.getLocaleString("general.COMMAND_PING_PONG"),
          description: interaction.getLocaleString("general.COMMAND_PING_DESCRIPTION", { latency: this.bot.ws.ping }),
        },
      ],
    });
  }
}

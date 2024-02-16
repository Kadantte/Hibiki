import type { ChatInputCommandInteraction } from "discord.js";
import { HibikiCommand } from "$classes/Command.ts";

export class HibikiTestCommand extends HibikiCommand {
  public async runWithInteraction(interaction: ChatInputCommandInteraction) {
    await interaction.followUp({
      embeds: [
        {
          title: "Testing OwO",
        },
      ],
    });
  }
}

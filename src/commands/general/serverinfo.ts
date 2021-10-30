import type { CommandInteraction, EmbedField } from "discord.js";
import { HibikiCommand } from "../../classes/Command";
import { createFullRelativeTimestamp } from "../../utils/timestamp";

export class ServerinfoCommand extends HibikiCommand {
  description = "Returns information about the server.";

  public async run(interaction: CommandInteraction) {
    const guild = await interaction.guild?.fetch();
    const fields: EmbedField[] = [];

    // Handler for if a server failed to fetch
    if (!guild) {
      return interaction.reply({
        embeds: [
          {
            title: interaction.getLocaleString("global.ERROR"),
            description: interaction.getLocaleString("general.COMMAND_SERVERINFO_FAILED"),
            color: this.bot.config.colours.error,
            footer: {
              text: interaction.getLocaleString("global.RAN_BY", { tag: interaction.user.tag }),
              iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            },
          },
        ],
      });
    }

    // ID
    fields.push({
      name: interaction.getLocaleString("global.ID"),
      value: guild.id,
      inline: false,
    });

    // Creation date
    fields.push({
      name: interaction.getLocaleString("global.CREATED_ON"),
      value: `${createFullRelativeTimestamp(guild.createdAt)}`,
      inline: false,
    });

    // Owner
    const owner = await guild.fetchOwner();
    if (owner.user) {
      fields.push({
        name: interaction.getLocaleString("global.OWNER"),
        value: `${owner.user.tag} (${owner.user.id})`,
        inline: false,
      });
    }

    // Members
    fields.push({
      name: interaction.getLocaleString("global.MEMBERS"),
      value: guild.memberCount.toString(),
      inline: true,
    });

    // Channels
    if (guild.channels.cache.size) {
      fields.push({
        name: interaction.getLocaleString("global.CHANNELS"),
        value: guild.channels.cache.size.toString(),
        inline: true,
      });
    }

    // Roles
    if (guild.roles.cache.size) {
      fields.push({
        name: interaction.getLocaleString("global.ROLES"),
        value: guild.roles.cache.size.toString(),
        inline: true,
      });
    }

    // Emojis
    if (guild.emojis.cache.size) {
      fields.push({
        name: interaction.getLocaleString("global.EMOJIS"),
        value: guild.emojis.cache.size.toString(),
        inline: true,
      });
    }

    // Stickers
    if (guild.stickers.cache.size) {
      fields.push({
        name: interaction.getLocaleString("global.STICKERS"),
        value: guild.stickers.cache.size.toString(),
        inline: true,
      });
    }

    interaction.reply({
      embeds: [
        {
          color: this.bot.config.colours.primary,
          fields: fields,
          author: {
            name: guild.name,
            icon_url: guild.iconURL({ dynamic: true }) || undefined,
          },
          thumbnail: {
            url: guild.iconURL({ dynamic: true }) || undefined,
          },
          image: {
            url: guild.bannerURL({ format: "png", size: 1024 }) || undefined,
          },
          footer: {
            text: interaction.getLocaleString("global.RAN_BY", { tag: interaction.user.tag }),
            iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
          },
        },
      ],
    });
  }
}

import type { ApplicationCommandOptionData, CommandInteraction, EmbedField } from "discord.js";
import { HibikiCommand } from "../../classes/Command";
import { createFullRelativeTimestamp } from "../../utils/timestamp";

export class UserinfoCommand extends HibikiCommand {
  description = "Returns information about a member's account.";
  type = 2;
  options: ApplicationCommandOptionData[] = [
    {
      type: 6,
      name: "member",
      description: "The member to get information about.",
      required: true,
    },
  ];

  public async run(interaction: CommandInteraction) {
    // Gets the member & the guild member info
    const member = await interaction.options.getUser(this.options[0].name)?.fetch();
    const guildMember = await interaction.guild?.members.fetch(member?.id as DiscordSnowflake);
    const fields: EmbedField[] = [];

    // Handler for if a member failed to fetch
    if (!member) {
      return interaction.reply({
        embeds: [
          {
            title: interaction.getLocaleString("global.ERROR"),
            description: interaction.getLocaleString("general.COMMAND_USERINFO_FAILED"),
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
      value: member.id,
      inline: false,
    });

    // Creation date
    fields.push({
      name: interaction.getLocaleString("global.ACCOUNT_CREATED"),
      value: `${createFullRelativeTimestamp(member.createdAt)}`,
      inline: false,
    });

    // Join date
    if (guildMember?.joinedAt) {
      fields.push({
        name: interaction.getLocaleString("global.ACCOUNT_JOINED"),
        value: `${createFullRelativeTimestamp(guildMember.joinedAt)}`,
        inline: false,
      });
    }

    // Nickname
    if (guildMember?.nickname) {
      fields.push({
        name: interaction.getLocaleString("global.NICKNAME"),
        value: guildMember.nickname,
        inline: true,
      });
    }

    // Highest role
    if (guildMember?.roles.highest) {
      fields.push({
        name: interaction.getLocaleString("global.HIGHEST_ROLE"),
        value: guildMember.roles.highest.name,
        inline: true,
      });
    }

    interaction.reply({
      embeds: [
        {
          color: member.accentColor || this.bot.config.colours.primary,
          fields: fields,
          author: {
            name: member.tag,
            icon_url: member.displayAvatarURL({ dynamic: true }),
          },
          thumbnail: {
            url: member.displayAvatarURL({ dynamic: true }),
          },
          /* image: {
            url: member.bannerURL({ dynamic: true, size: 1024 }) || undefined,
          }, */
          footer: {
            text: interaction.getLocaleString("global.RAN_BY", { tag: interaction.user.tag }),
            iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
          },
        },
      ],
    });
  }
}

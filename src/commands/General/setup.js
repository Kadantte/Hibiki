const Command = require("../../structures/Command");
const waitFor = require("../../utils/waitFor");
const askFor = require("../../utils/ask").for;

const categoryemojis = {
  Features: "✨",
  Roles: "👥",
  Automod: "🔨",
  Logging: "📜",
};

const typelabels = {
  channelID: "Channel",
  roleID: "Role",
  bool: "Toggle",
  number: "Number",
  emoji: "Emoji",
  roleArray: "Roles",
  channelArray: "Channels",
  string: "Text",
  punishment: "Punishment",
};

class setupCommand extends Command {
  constructor(...args) {
    super(...args, {
      args: "[show:string]",
      aliases: ["cfg", "guildcfg", "setup"],
      description: "Configs the bot or views the config.",
      allowdisable: false,
      cooldown: 3,
    });
  }

  async run(msg, args) {
    // Gets the config
    const settings = require("../../utils/items");
    let cfg = await this.bot.db.table("guildcfg").get(msg.channel.guild.id).run();
    if (!cfg) {
      await this.bot.db.table("guildcfg").insert({
        id: msg.channel.guild.id,
      }).run();

      cfg = { id: msg.channel.guild.id };
    }

    if (!cfg.invitePunishments) cfg.invitePunishments = [];
    if (!cfg.spamPunishments) cfg.spamPunishments = [];

    // Config show functionality
    if (args.length && args.join(" ").toLowerCase() === "show") {
      return msg.channel.createMessage({
        embed: {
          title: "🔧 Server Config",
          color: this.bot.embed.color("general"),
          fields: settings.filter(f => f.id || cfg[f.id]).sort((a, b) => a.id > b.id ? 1 : -1).map(s => {
            let sid = cfg[s.id];
            if (s.type === "channelID" && cfg[s.id]) sid = `<#${cfg[s.id]}>`;
            else if (s.type === "roleID" && cfg[s.id]) sid = `<@&${cfg[s.id]}>`;
            else if (s.type === "roleArray" && cfg[s.id]) sid = cfg[s.id].map(r => `<@&${r}>`).join(", ");
            else if (s.type === "channelArray" && cfg[s.id]) sid = cfg[s.id].map(c => `<#${c}>`).join(", ");
            else if (s.type === "punishment") sid = cfg[s.id].join(", ");
            else if (s.type === "array" && cfg[s.id]) sid = cfg[s.id].map(c => `${c}`).join(", ");
            if (sid)
              return {
                name: s.label || s.id,
                value: sid,
                inline: true,
              };
          }).filter(s => s),
        },
      });
    }

    const back = "⬅️";
    const submit = "☑";
    const categories = [];
    settings.forEach(s => {
      const cat = categories.find(c => c.name === s.category);
      if (!s.category) return;
      if (!cat) categories.push({ name: s.category, emoji: categoryemojis[s.category], items: [s.id] });
      else {
        cat.items.push(s.id);
        categories.map(c => categories.find(cc => cc.id === c.id) || c);
      }
    });

    categories.forEach((c, i) => {
      c.items = c.items.sort((a, b) => a > b ? 1 : -1);
      categories[i] = c;
    });

    // Sends the original message
    const omsg = await msg.channel.createMessage({
      embed: {
        title: "🔧 Setup",
        description: `You can also use the [web dashboard](${this.bot.config.homepage}/login/).`,
        color: this.bot.embed.color("general"),
        fields: categories.map(cat => {
          return {
            name: `${cat.emoji.length > 2 ? "<:" : ""}${cat.emoji}${cat.emoji.length > 2 ? ">" : ""} ${cat.name}`,
            value: `${cat.items.map(i => `\`${i}\``).join(", ")}`,
          };
        }),
      },
    });

    // Function to get category
    async function getCategory(m, bot, editMsg) {
      if (editMsg) m.edit({
        embed: {
          title: "🔧 Setup",
          fields: categories.map(cat => {
            return {
              name: `${cat.emoji} ${cat.name}`,
              value: `${cat.items.map(i => `\`${i}\``).join(", ")}`,
            };
          }),
        },
      });

      // Removes all reactions from the message if there are any
      if (Object.getOwnPropertyNames(m.reactions).length > 0) await m.removeReactions();
      categories.map(cat => cat.emoji).forEach(catEmoji => m.addReaction(catEmoji));
      let category;
      let stop = false;

      // Waits for a reaction
      await waitFor("messageReactionAdd", 60000, async (message, emoji, uid) => {
        if (message.id !== m.id) return;
        if (uid !== msg.author.id) return;
        if (!emoji.name) return;
        if (stop) return;
        // Looks for the category
        category = categories.find(cat => cat.emoji.length > 2 ? cat.emoji.split(":")[1] === emoji.id : cat.emoji === emoji.name);
        if (!category) return;
        await m.removeReactions();
        return true;
      }, bot).catch(e => {
        if (e === "timeout") {
          category = { error: "timeout" };
          stop = true;
        }
      });
      return category;
    }

    const color = this.bot.embed.color("general");
    // Returns the category items
    function itemsEmbed(category) {
      return {
        embed: {
          title: "🔧 Setup",
          color: color,
          fields: category.items.map(cat => {
            const setting = settings.find(s => s.id === cat);
            return {
              name: `${setting.emoji} ${setting.label}`,
              value: typelabels[setting.type] || setting.type,
              inline: true,
            };
          }),
        },
      };
    }

    // Gets the category; timeout handler
    let category = await getCategory(omsg, this.bot, false);
    if (category.error === "timeout") return this.bot.embed.edit("❌ Error", "Timeout reached, exiting setup.", omsg, "error");
    omsg.edit(itemsEmbed(category));
    await omsg.removeReactions();
    await category.items.map(async cat => omsg.addReaction(settings.find(s => s.id === cat).emoji));
    omsg.addReaction(back);

    // Waits for reaction
    await waitFor("messageReactionAdd", 60000, async (message, emoji, uid) => {
      if (uid !== msg.author.id) return;
      if (message.id !== omsg.id) return;
      if (!emoji.name) return;
      if (emoji.name === back) { category = { repeat: true }; return true; }

      // Finds the setting
      const setting = settings.find(s => s.id === category.items.find(cat => settings.find(s => s.id === cat).emoji === emoji.name));
      if (!setting) return;

      // Removes reaction & updates
      message.removeReaction(emoji.name, uid);
      let cooldown = 0;

      // Booleans
      if (setting.type === "bool") {
        if (cfg[setting.id]) cfg[setting.id] = !cfg[setting.id];
        else cfg[setting.id] = true;
        await this.bot.db.table("guildcfg").get(msg.channel.guild.id).update(cfg).run();
        this.bot.embed.edit(setting.label, `${setting.id} has been **${cfg[setting.id] ? "enabled" : "disabled"}**.`, omsg, "success");
        setTimeout(() => omsg.edit(itemsEmbed(category)), 1500);
        // Punishments
      } else if (setting.type === "punishment") {
        const punishments = { Mute: "1️⃣", Purge: "2️⃣", Warn: "3️⃣" };
        const punishmentDescription = { Mute: null, Purge: null, Warn: null };
        const validpunishments = Object.getOwnPropertyNames(punishments);
        await omsg.removeReactions();

        // Punishments embed
        this.bot.embed.edit(
          `🔨 Punishments for ${setting.label}`,
          validpunishments.map(p =>
            `${punishments[p]} ${p}${punishmentDescription[p] ? punishmentDescription[p] : ""}:` +
            ` **${cfg[setting.id].includes(p) ? "enabled" : "disabled"}**`,
          ).join("\n"),
          omsg,
        );

        validpunishments.forEach(p => omsg.addReaction(punishments[p]).catch(() => {}));
        omsg.addReaction(submit);

        // Waits for punishment reaction
        await waitFor("messageReactionAdd", 60000, async (m, emojii, user) => {
          if (m.id !== omsg.id) return;
          if (user !== msg.author.id) return;
          if (!emojii.name) return;

          // Submit emoji
          if (emojii.name === submit) {
            await omsg.removeReactions();
            await this.bot.db.table("guildcfg").get(msg.channel.guild.id).update(cfg).run();
            omsg.edit(itemsEmbed(category));
            category.items.map(cat => omsg.addReaction(settings.find(s => s.id === cat).emoji));
            omsg.addReaction(back);
            return true;
          }

          // Removes reactions & updates embed
          omsg.removeReaction(emojii.name, user);
          const punishment = validpunishments.find(p => punishments[p] === emojii.name);
          if (cfg[setting.id].includes(punishment)) cfg[setting.id].splice(cfg[setting.id].indexOf(punishment), 1);
          else cfg[setting.id].push(punishment);
          this.bot.embed.edit(
            `🔨 Punishments for ${setting.pickerLabel}`, validpunishments.map(p => `${punishments[p]} ${p}${punishmentDescription[p] ?
               punishmentDescription[p] : ""}: **${cfg[setting.id].includes(p) ? "enabled" : "disabled"}**`).join("\n")), omsg;
        }, this.bot).catch(async e => {
          if (e === "timeout") {
            // Timeout handler
            await omsg.removeReactions();
            category.items.map(cat => omsg.addReaction(settings.find(s => s.id === cat).emoji));
            omsg.addReaction(back);
            return omsg.edit(itemsEmbed(category));
          }
        });
      } else {
        // Asks for a response
        this.bot.embed.edit("🔧 Setup", `Respond with the desired **${setting.type || setting.type}**.`, omsg);
        await waitFor("messageCreate", 90000, async (m) => {
          if (m.author.id !== msg.author.id) return;
          if (m.channel.id !== msg.channel.id) return;
          if (!msg.content) return;

          // Asks for the type of response; 3 attempts
          let result = askFor(setting.type, m.content, msg.guild);
          if (setting.type !== "bool" && !result || typeof result === "string" && result.startsWith("No")) {
            const errormsg = await this.bot.embed(
              "❌ Error",
              `Invalid ${setting.type}${Math.abs(cooldown - 2) === 0 ? "" : `; **${Math.abs(cooldown - 2)}** attempts left before exiting.`}`,
              "error",
              msg,
            );

            cooldown++;
            setTimeout(() => {
              errormsg.delete();
            }, 1000);

            // If cooldown reached
            if (cooldown > 2) {
              omsg.edit(itemsEmbed(category));
              return true;
            }

            return;
          }

          // Checks limits
          if (setting.type === "roleArray" && setting.maximum && result.length > setting.maximum) {
            return this.bot.embed("❌ Error", `You can't set more than ${setting.maximum} roles.`, msg, "error");
          }

          if (setting.type === "channelArray" && setting.maximum && result.length > setting.maximum) {
            return this.bot.embed("❌ Error", `You can't set more than ${setting.maximum} channels.`, msg, "error");
          }

          if (setting.type === "number" && setting.maximum && setting.maximum &&
            (setting.minimum > result || setting.maximum < result)) {
            return this.bot.embed(
              "❌ Error",
              `The number needs to be under ${setting.maximum} and under ${setting.minimum}.`,
              msg,
              "error",
            );
          }

          // Clear handler
          if (result === "clear") result = null;
          cfg[setting.id] = result;
          await this.bot.db.table("guildcfg").get(msg.channel.guild.id).update(cfg).run();

          // Deletes msg
          m.delete();
          const setmsg = await this.bot.embed("✅ Success", `**${setting.id}** has been set to **${result}**.`, msg, "success");
          setTimeout(() => { setmsg.delete().catch(() => {}); }, 2000);
          omsg.edit(itemsEmbed(category));
          return true;
        }, this.bot);
      }
    }, this.bot);

    // Deletes & reruns the command
    if (category.repeat) {
      omsg.delete();
      return this.run(msg, args);
    }
  }
}

module.exports = setupCommand;

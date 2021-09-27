/**
 * @file BotGuildUpdate Event
 * @description Logs when added or removed from a guild
 * @module BotGuildUpdateEvent
 */

import type { Guild } from "discord.js";
import { HibikiEvent } from "../classes/Event";

export class HibikiInteractionEvent extends HibikiEvent {
  events: HibikiEventEmitter[] = ["guildCreate", "guildDelete"];

  public async run(event: HibikiEventEmitter, guild: Guild) {
    if (!guild) return;

    /**
     * Handles guildCreate specific functions
     */

    if (event === "guildCreate") {
      console.log(guild.id);
    }
  }
}

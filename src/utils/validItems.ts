/**
 * @file Valid items
 * @description Valid guildconfig and userconfig items
 * @module utils/validItems
 */

export const validItems = [
  /**
   * Feature options
   */

  {
    category: "features",
    emoji: "☑",
    id: "agreeChannel",
    type: "channelID",
  },
  {
    category: "features",
    id: "easyTranslate",
    emoji: "🌍",
    type: "bool",
    default: false,
  },

  /**
   * Greeting options
   */

  {
    category: "greeting",
    emoji: "👋",
    id: "leaveJoin",
    type: "channelID",
  },
  {
    category: "greeting",
    emoji: "✉",
    id: "joinMessage",
    type: "string",
    minimum: 1,
    maximum: 256,
  },
  {
    category: "greeting",
    emoji: "🚪",
    id: "leaveMessage",
    type: "string",
    minimum: 1,
    maximum: 256,
  },
  {
    category: "greeting",
    emoji: "📄",
    id: "joinTitle",
    type: "string",
    minimum: 1,
    maximum: 100,
  },
  {
    category: "greeting",
    emoji: "📃",
    id: "leaveTitle",
    type: "string",
    minimum: 1,
    maximum: 100,
  },
  {
    category: "greeting",
    emoji: "📝",
    id: "greetingFooter",
    type: "string",
    minimum: 1,
    maximum: 64,
  },

  /**
   * Logging options
   */

  {
    category: "logging",
    emoji: "📄",
    id: "eventLogging",
    type: "channelID",
  },
  {
    category: "logging",
    emoji: "📜",
    id: "messageLogging",
    type: "channelID",
  },
  {
    category: "logging",
    emoji: "📰",
    id: "memberLogging",
    type: "channelID",
  },
  {
    category: "logging",
    emoji: "📃",
    id: "modLogging",
    type: "channelID",
  },
  {
    category: "logging",
    emoji: "📵",
    id: "ignoredLoggingChannels",
    type: "channelArray",
  },

  /**
   * Music options
   * TODO: Add these
   */

  /**
   * Pinboard options
   */
  {
    category: "pinboard",
    emoji: "📍",
    id: "pinChannel",
    type: "channelID",
  },
  {
    category: "pinboard",
    emoji: "🔢",
    id: "pinAmount",
    minimum: 1,
    type: "number",
    default: 5,
  },
  {
    category: "pinboard",
    emoji: "⭐",
    id: "pinEmoji",
    type: "emoji",
  },
  {
    category: "pinboard",
    emoji: "🗣",
    id: "pinSelfPinning",
    type: "bool",
    default: true,
  },

  /**
   * Role options
   */

  {
    category: "roles",
    emoji: "✔",
    id: "agreeRole",
    type: "roleID",
  },
  {
    category: "roles",
    emoji: "☑",
    id: "verifiedRole",
    type: "roleID",
  },
  {
    category: "roles",
    emoji: "🔨",
    id: "staffRole",
    type: "roleID",
  },
  {
    category: "roles",
    emoji: "👤",
    id: "autoRoles",
    type: "roleArray",
    maximum: 5,
  },
  {
    category: "roles",
    emoji: "🔕",
    id: "mutedRole",
    type: "roleID",
  },

  /**
   * Sniping options
   */

  {
    category: "sniping",
    emoji: "💣",
    id: "snipingEnable",
    type: "bool",
    default: true,
  },
  {
    category: "sniping",
    emoji: "🚫",
    id: "snipingIgnore",
    type: "channelArray",
  },
  {
    category: "sniping",
    emoji: "🔗",
    id: "snipingInvites",
    type: "bool",
    default: true,
  },
  {
    category: "sniping",
    emoji: "⛔",
    id: "snipingPermission",
    type: "bool",
    default: false,
  },

  /**
   * Automod options
   */

  {
    category: "automod",
    emoji: "🔗",
    id: "antiInvite",
    type: "bool",
    default: false,
  },
  {
    category: "automod",
    emoji: "😶",
    id: "antiNewLines",
    type: "bool",
    default: false,
  },
  {
    category: "automod",
    emoji: "🔥",
    id: "antiRaid",
    type: "bool",
    default: false,
  },
  {
    category: "automod",
    emoji: "🚯",
    id: "antiSpam",
    type: "bool",
    default: false,
  },
  {
    category: "automod",
    emoji: "🔨",
    id: "antiNewLinesPunishments",
    type: "punishment",
  },
  {
    category: "automod",
    emoji: "⚒",
    id: "invitePunishments",
    type: "punishment",
  },
  {
    category: "automod",
    emoji: "‼",
    id: "raidPunishments",
    type: "raidPunishment",
  },
  {
    category: "automod",
    emoji: "🛠",
    id: "spamPunishments",
    type: "punishment",
  },
  {
    category: "automod",
    emoji: "💬",
    id: "msgOnPunishment",
    type: "bool",
    default: true,
  },
  {
    category: "automod",
    emoji: "#️⃣",
    id: "newlineThreshold",
    type: "number",
    minimum: 10,
    default: 15,
  },
  {
    category: "automod",
    emoji: "⁉",
    id: "raidThreshold",
    type: "number",
    minimum: 15,
    maximum: 30,
    default: 20,
  },
  {
    category: "automod",
    emoji: "🔢",
    id: "spamThreshold",
    minimum: 5,
    maximum: 10,
    default: 7,
    type: "number",
  },

  /**
   * Profile options
   */

  {
    emoji: "🏷️",
    category: "profile",
    id: "bio",
    type: "string",
    minimum: 1,
    maximum: 200,
    inviteFilter: true,
  },
  {
    emoji: "💖",
    category: "profile",
    id: "pronouns",
    type: "pronouns",
  },
  {
    emoji: "🕒",
    category: "profile",
    id: "timezone",
    type: "timezone",
  },
  {
    emoji: "🚫",
    category: "profile",
    id: "timezoneHide",
    type: "bool",
    default: false,
  },

  /**
   * Other items not in config.ts
   */

  {
    id: "assignableRoles",
    category: "roles",
    type: "roleArray",
  },
  {
    id: "disabledCategories",
    category: "features",
    type: "array",
  },
  {
    id: "disabledCmds",
    category: "features",
    type: "array",
  },
  {
    id: "prefix",
    category: "features",
    type: "string",
    minimum: 1,
    maximum: 15,
  },
];

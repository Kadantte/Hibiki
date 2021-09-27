/**
 * @file Hibiki
 * @description Creates a new instance of Hibiki
 * @module hibiki
 */

import { HibikiClient } from "./classes/Client";
import { parseHibikiConfig } from "./utils/config";
import path from "path";

// Parses the config
const HIBIKI_CONFIG_FILE = path.join(__dirname, "../config.toml");
const config = parseHibikiConfig(HIBIKI_CONFIG_FILE, true);

// Spawns a new instance of Hibiki
const bot = new HibikiClient(config);
bot.init();

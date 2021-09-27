/**
 * @file Index
 * @description Creates a new Hibiki sharding manager
 * @module index
 */

import { HibikiShardingManager } from "./classes/Sharder";
import { parseHibikiConfig } from "./utils/config";
import path from "path";

// Gets the config & root file
const HIBIKI_CONFIG_FILE = path.join(__dirname, "../config.toml");
const HIBIKI_INDEX_FILE = path.join(__dirname, `hibiki.${process.env.NODE_ENV === "development" ? "ts" : "js"}`);
const config = parseHibikiConfig(HIBIKI_CONFIG_FILE, true);

// Creates and spawns the sharding manager
const manager = new HibikiShardingManager(HIBIKI_INDEX_FILE, config.hibiki.token, "auto");
manager.spawn();

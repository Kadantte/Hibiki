/**
 * @file Sharder
 * @description Creates and manages shards
 * @module HibikiShardingManager
 */

import type { PathLike } from "fs";
import { logger } from "../utils/logger";
import { ShardingManager } from "discord.js";

type Auto = number | "auto";

export class HibikiShardingManager {
  readonly shardingManager: ShardingManager;
  private readonly _mainFile: PathLike;
  private readonly _token: string;
  private readonly _shardCount: Auto;

  /**
   * Creates a new Hibiki sharding manager
   * @param file The file to launch
   * @param token The token to login with
   * @param shardCount The amount of shards to launch
   */

  constructor(file: PathLike, token: string, shardCount: Auto = "auto") {
    this._mainFile = file;
    this._shardCount = shardCount;
    this._token = token;

    this.shardingManager = new ShardingManager(this._mainFile.toString(), {
      token: this._token,
      totalShards: this._shardCount,
      mode: process.env.NODE_ENV === "development" ? "process" : "worker",
      execArgv: process.env.NODE_ENV === "development" ? ["-r", "ts-node/register/transpile-only"] : [],
      respawn: true,
    });
  }

  /**
   * Spawns all shards
   */

  public spawn() {
    this.shardingManager.spawn({ amount: this._shardCount });

    // Shard event listeners
    this.shardingManager.on("shardCreate", (shard) => {
      shard.on("death", () => {
        logger.error(`Shard #${shard.id} died`);
      });

      shard.on("disconnect", () => {
        logger.warn(`Shard #${shard.id} disconnected`);
      });

      shard.on("error", (err) => {
        logger.error(`Shard #${shard.id} encountered an error: ${err}`);
      });

      shard.on("message", (msg) => {
        logger.info(`Shard #${shard.id} recieved a message: ${msg}`);
      });

      shard.on("ready", () => {
        logger.info(`Shard #${shard.id} is ready`);
      });

      shard.on("reconnecting", () => {
        logger.warn(`Shard #${shard.id} is reconnecting`);
      });

      shard.on("spawn", () => {
        logger.info(`Shard #${shard.id} was spawned`);
      });
    });
  }
}

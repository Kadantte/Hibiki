/**
 * @file PostgreSQL Provider
 * @description The Hibiki PostgreSQL provider
 * @module PostgreSQLProvider
 */

import type { Knex as KnexClient } from "knex";
import { HibikiProvider, TABLES } from "../classes/Provider";
import { logger } from "../utils/logger";
import { knex } from "knex";

export class PostgreSQLProvider extends HibikiProvider {
  dbConfig = this.bot.config.database;

  knexConfig = {
    client: "pg",
    useNullAsDefault: true,
    connection: {
      user: this.dbConfig.user,
      password: this.dbConfig.password,
      port: this.dbConfig.port || 5432,
      host: this.dbConfig.host || "127.0.0.1",
      database: this.dbConfig.database || "postgres",
    },
  };

  // Connects to knex
  db: KnexClient<any, unknown[]> = knex(this.knexConfig);

  public async getGuildConfig(guild: DiscordSnowflake) {
    const config = await this.db.withSchema(this.dbConfig.schema).table(TABLES.GUILD_CONFIGS).where("id", guild).limit(1);
    return config?.[0] ?? null;
  }

  public async deleteGuildConfig(guild: DiscordSnowflake) {
    await this.db.withSchema(this.dbConfig.schema).table(TABLES.GUILD_CONFIGS).where("id", guild).limit(1).delete();
  }

  public async updateGuildConfig(guild: DiscordSnowflake, config: HibikiGuildConfig) {
    await this.db.withSchema(this.dbConfig.schema).table(TABLES.GUILD_CONFIGS).where("id", guild).insert(config).onConflict("id").merge();
  }

  public async insertBlankGuildConfig(guild: DiscordSnowflake) {
    await this.db.withSchema(this.dbConfig.schema).table(TABLES.GUILD_CONFIGS).insert({ id: guild });
  }

  public async getUserConfig(user: DiscordSnowflake) {
    const config = await this.db.withSchema(this.dbConfig.schema).table(TABLES.USER_CONFIGS).where("id", user).limit(1);
    return config?.[0] ?? null;
  }

  public async deleteUserConfig(guild: DiscordSnowflake) {
    await this.db.withSchema(this.dbConfig.schema).table(TABLES.GUILD_CONFIGS).where("id", guild).limit(1).delete();
  }

  public async updateUserConfig(user: DiscordSnowflake, config: HibikiGuildConfig) {
    await this.db.withSchema(this.dbConfig.schema).table(TABLES.USER_CONFIGS).where("id", user).update(config).onConflict("id").merge();
  }

  public async insertBlankUserConfig(user: DiscordSnowflake) {
    await this.db.withSchema(this.dbConfig.schema).table(TABLES.USER_CONFIGS).insert({ id: user });
  }

  public async init() {
    // Creates the database schema
    try {
      const schema = this.db.schema.withSchema(this.dbConfig.schema);
      schema.createSchemaIfNotExists(this.dbConfig.schema);

      Object.values(TABLES).forEach(async (table) => {
        // Don't attempt to make duplicate tables
        if (await schema.hasTable(table)) return;

        // Creates all tables and their primary keys
        schema.createTable(table, (dbTable) => {
          dbTable.string("id").primary();
        });

        logger.info(`Created the ${table} table`);
      });

      // Runs the builder
      await schema;
    } catch (err) {
      throw new Error(err as string);
    }
  }
}

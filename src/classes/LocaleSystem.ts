/**
 * @file LocaleSystem
 * @description Handles loading, parsing, and getting locales
 * @module HibikiLocaleSystem
 */

import type { GetLocaleString, HibikiLocaleStrings } from "../typings/locales";
import type { HibikiClient } from "./Client";
import { logger } from "../utils/logger";
import fs from "fs";

export class HibikiLocaleSystem {
  readonly locales: { [k: string]: { [k: string]: any } } = {};
  readonly defaultLocale: HibikiLocaleCode;
  private readonly _path: string;

  /**
   * Creates a new Locale system and loads any locales
   * @param path The path to search for locales in
   * @param defaultLocale The locale code to use
   */

  constructor(path: string, defaultLocale: HibikiLocaleCode) {
    this.defaultLocale = defaultLocale;
    this._path = path;
    this._updateLocales(this._path);
  }

  /**
   * Gets an individual locale and parses its content
   * @param language The 2-letter locale code to use
   * @param fieldName The locale field to search for
   * @param args Any args to pass to the string
   */

  public getLocale(language: HibikiLocaleCode, fieldName: HibikiLocaleStrings, args?: { [x: string]: any }): string {
    const category = fieldName.split(".");
    let output = "";

    output = this._findLocaleString(language, fieldName, category);
    if (!output) output = this._findLocaleString(this.defaultLocale, fieldName, category);

    // Search for the default entry if the string doesn't exist, sends a warning each time no entry is found
    if (!output) {
      const defaultLocale = this.defaultLocale || "en";
      const isDefault = language === defaultLocale;
      if (language) {
        logger.warn(`${fieldName} is missing in the string table for ${language}.`);
      }

      return isDefault ? fieldName : this.getLocale(defaultLocale, fieldName, args);
    }

    // Passes arguments to the string
    if (args) {
      Object.getOwnPropertyNames(args).forEach((arg) => {
        // Handles plurals/non-plural and arguments/optionals
        const argumentRegex = new RegExp(`{${arg}}`);
        const pluralRegex = new RegExp(`{${arg}:#([^{}]+)#!([^{}]+)!(?:\\?([^{}]+)\\?)?}`);
        const optionalRegex = new RegExp(`({optional:${arg}:(.+)(?:{\\w})?})`);

        // Replaces optional strings with content
        const optional = optionalRegex.exec(output);
        if (optional) output = output.replace(optional[1], typeof args[arg] != "undefined" ? optional[2] : "");
        output = output.replace(argumentRegex, args[arg]);

        // Handles plurals
        const plurals = pluralRegex.exec(output);

        // Sends the output with the correct grammar
        if (plurals) {
          let plural = "";
          if (args[arg] === 1 || (args[arg] > 1 && args[arg] < 2)) plural = plurals[2];
          else if (plurals[3] && args[arg] >= 2 && args[arg] <= 4) plural = plurals[3];
          else plural = plurals[1];

          output = output.replace(plurals[0], plural);
        } else if (!plurals) output = output.replace(`{${arg}}`, args[arg]);
      });
    }

    // Handles optional input
    const optionalRegex = new RegExp(`({optional:.+:(.+)})`);
    const optional = optionalRegex.exec(output);
    if (optional) output = output.replace(optional[1], "");
    return output;
  }

  /**
   * Returns an individual locale string
   * @param language The 2-letter locale code to utilize
   * @param args Any arguments to pass to the locale
   */

  public getLocaleFunction(language: HibikiLocaleCode): GetLocaleString {
    return (fieldName: HibikiLocaleStrings, args?: Record<string, any>) => this.getLocale(language, fieldName, args);
  }

  /**
   * Returns what locale a user uses
   * @param user The User ID to search for a set locale for
   */

  public async getUserLocale(user: DiscordSnowflake, bot: HibikiClient) {
    let locale = this.defaultLocale;
    const userConfig = await bot.db.getUserConfig(user);
    if (userConfig?.locale) locale = userConfig.locale;
    return locale;
  }

  /**
   * Loads locales & updates them
   * @param path The path to look for locales in
   */

  private _updateLocales(path: string) {
    fs.readdir(path, { withFileTypes: true }, (err, files) => {
      if (err) throw err;

      // Loads each locale
      files.forEach((file) => {
        if (file.isDirectory()) this._updateLocales(`${path}/${file.name}`);
        else if (file.isFile()) {
          fs.readFile(`${path}/${file.name}`, { encoding: "utf8" }, (_err, fileData) => {
            if (err) throw err;
            const localeObj: Record<string, any> = {};
            const data: Record<string, string> = JSON.parse(fileData);

            // Parses each individual locale
            Object.entries(data).forEach((locale) => {
              // If the locale exists
              if (typeof locale[1] === "object") {
                localeObj[locale[0]] = {};
                Object.entries(locale[1]).forEach((string) => {
                  if ((string as [string, string])[1].length > 0) localeObj[locale[0]][string[0]] = string[1];
                });
              } else {
                // Replaces empty strings
                localeObj[locale[0]] = locale[1];
              }
            });

            this.locales[file.name.replace(/.json/, "")] = localeObj;
          });
        }
      });
    });
  }

  /**
   * Finds a locale string
   * @param string The 2 letter locale code to use
   * @param fieldName The string to return
   * @param category The categories to search in
   */

  private _findLocaleString(language: HibikiLocaleCode, fieldName: HibikiLocaleStrings, category: string[]) {
    if (!this.locales?.[language]) return;
    let output;

    // Attempts to find the string if the category isn't provided
    if (!this.locales?.[language]?.[category[0]] && !this.locales?.[fieldName]) {
      Object.getOwnPropertyNames(this.locales[language]).forEach((category) => {
        Object.getOwnPropertyNames(this.locales[language][category]).forEach((locale) => {
          if (locale === fieldName) output = this.locales[language][category][locale];
        });
      });

      // Sets the output if the category exists
    } else if (this.locales?.[language]?.[category[0]] && this.locales?.[language]?.[category[0]]?.[category[1]]) {
      output = this.locales[language][category[0]][category[1]];
      // Sets the locale if no category exists
    } else if (this.locales?.[language]?.[fieldName]) {
      output = this.locales[language][fieldName];
    }

    return output;
  }
}

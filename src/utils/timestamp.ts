/**
 * @file Timestamp
 * @description Creates timestamps for use in Discord
 * @module timestamp
 */

/**
 * Creates a full timestamp from a Date
 * @param time The Date to create a timestamp from
 * @returns A timestamp formatted like "Tuesday, 20 April 2021 16:20"
 */

export function createFullTimestamp(time: Date) {
  return `<t:${Math.floor(time.getTime() / 1000)}:F>`;
}

/**
 * Creates a full relative timestamp from a Date
 * @param time The Date to create a timestamp from
 * @returns A timestamp formatted like "Tuesday, 20 April 2021 16:20 - 3 months ago"
 */

export function createFullRelativeTimestamp(time: Date) {
  return `<t:${Math.floor(time.getTime() / 1000)}:F> - <t:${Math.floor(time.getTime() / 1000)}:R>`;
}

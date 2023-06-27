import crypto from "crypto";
import { nanoid } from "nanoid";

const regionalAUnicode = 127462;

/**
 * Count the occurrences of a regex in a string
 *
 * @param str The string to check
 * @param match The RegExp to match to
 * @returns The amount of occurrences of the match
 */
const countOccurrences = (str: string, match: RegExp): number => {
  const exp = match.global ? match : new RegExp(match.source, `g${match.flags}`);

  const matches = str.match(exp) || [];
  return matches.length;
};

/**
 * Strip the last file extension from a filename
 *
 * selfie.png -> selfie
 * .env -> .env
 *
 * @param filename Any filename, with or without extension
 * @returns The filename without the final extension
 */
const stripFileExtension = (filename: string): string => {
  return filename.substring(0, filename.lastIndexOf(".")) || filename;
};

/**
 * Central source of random strings
 *
 * @returns A unique string currently of length 21
 */
const uuid = (): string => nanoid();

const charToRegional = (char: string) =>
  String.fromCodePoint(char.toUpperCase().charCodeAt(0) - 65 + regionalAUnicode);

/**
 * Calculate and return the regional values for a 2 letter country code
 */
const countryCodeToFlag = (countryCode: string) => {
  const char1 = charToRegional(countryCode[0]);
  const char2 = charToRegional(countryCode[1]);
  return `${char1}${char2}`;
};

/**
 * Generates a random, cryptographically secure, hexadecimal string of a given length
 *
 * @param length The length of the string in characters
 * @returns The hexadecimal string
 */
const randomHex = (length: number) => crypto.randomBytes(length * 2).toString("hex");

export { countOccurrences, stripFileExtension, uuid, countryCodeToFlag, randomHex };

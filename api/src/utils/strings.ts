import { v4 as uuid4 } from "uuid";

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
 * Essentially a UUIDv4
 *
 * @returns A unique string of length 36
 */
const uuid = (): string => uuid4();

export { countOccurrences, stripFileExtension, uuid };

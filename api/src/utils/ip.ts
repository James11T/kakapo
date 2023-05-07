import geoip from "geoip-country";
import { countryCodeToFlag } from "./strings.js";

type ISOCountryCode = string;
const FAIL_COUNTRY_CODE: ISOCountryCode = "XX";
const FAIL_EMOJI = "❓";

/**
 * Geo-locate an ip address into an ISO country code
 *
 * @param ip IPV4 or IPV6 address
 * @returns A 2 character ISO country code
 */
const IPToCountry = (ip: string) => {
  const geoData = geoip.lookup(ip);

  if (!geoData) return FAIL_COUNTRY_CODE;
  return geoData.country;
};

/**
 * Translate an ISO country code into an emoji
 *
 * @param countryCode A 2 character ISO country code
 * @returns An emoji
 */
const countryToEmoji = (countryCode: ISOCountryCode): string => {
  if (countryCode === FAIL_COUNTRY_CODE) return FAIL_EMOJI;

  return countryCodeToFlag(countryCode);
};

const IPToCountryEmoji = (ip: string): string => {
  const countryCode = IPToCountry(ip);

  const countryEmoji = countryToEmoji(countryCode);

  return countryEmoji;
};

export { IPToCountry, countryToEmoji, IPToCountryEmoji, FAIL_COUNTRY_CODE, FAIL_EMOJI };

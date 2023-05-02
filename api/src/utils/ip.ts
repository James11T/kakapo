import geoip from "geoip-country";
import { countryCodeEmoji } from "country-code-emoji";

const FAIL_COUNTRY_CODE = "XX";
const FAIL_EMOJI = "❓";

const IPToCountry = (ip: string) => {
  const geoData = geoip.lookup(ip);

  if (!geoData) return FAIL_COUNTRY_CODE;
  return geoData.country;
};

const countryToEmoji = (countryCode: string): string => {
  if (countryCode === FAIL_COUNTRY_CODE) return FAIL_EMOJI;

  return countryCodeEmoji(countryCode);
};

const IPToCountryEmoji = (ip: string): string => {
  const countryCode = IPToCountry(ip);

  const countryEmoji = countryToEmoji(countryCode);

  return countryEmoji;
};

export { IPToCountry, countryToEmoji, IPToCountryEmoji, FAIL_COUNTRY_CODE, FAIL_EMOJI };

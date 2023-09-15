const twoDigits = (input: string | number) => String(input).padStart(2, "0");

const getTimeString = (time: Date) =>
  `${twoDigits(time.getHours())}:${twoDigits(time.getMinutes())}`;

const getDateString = (time: Date) =>
  `${twoDigits(time.getDate())}/${twoDigits(
    time.getMonth() + 1
  )}/${time.getFullYear()}`;

const getDateTimeString = (time: Date) =>
  `${getTimeString(time)} ${getDateString(time)}`;

const sleep = (ms: number) => new Promise((res) => window.setTimeout(res, ms));

export { getTimeString, getDateString, getDateTimeString, sleep };

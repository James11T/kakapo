const twoDigits = (input: string | number) => String(input).padStart(2, "0");

const getTimeString = (time: Date) =>
  `${twoDigits(time.getHours())}:${twoDigits(time.getMinutes())}`;

const getDateString = (time: Date) =>
  `${twoDigits(time.getDate())}/${twoDigits(
    time.getMonth() + 1
  )}/${time.getFullYear()}`;

const getDateTimeString = (time: Date) =>
  `${getTimeString(time)} ${getDateString(time)}`;

export { getTimeString, getDateString, getDateTimeString };

type DateComponent = "day" | "month" | "year";

interface DestructuredDate {
  date: number;
  month: number;
  year: number;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const getDateComponents = (date: Date): DestructuredDate => ({
  date: date.getDate(),
  month: date.getMonth(),
  year: date.getFullYear(),
});

const daysInMonth = (month: number, year: number) =>
  new Date(year, month + 1, 0).getDate();

const mutateDate = (date: Date, component: DateComponent, value: number) => {
  // Returns a new date with the given component set to the given value
  // Ensures values are valid

  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  if (component === "day") {
    return new Date(year, month, value);
  } else if (component === "month") {
    const daysInNewMonth = daysInMonth(value, year);
    return new Date(year, value, Math.min(daysInNewMonth, day));
  } else {
    const daysInCurrentMonth = daysInMonth(month, value);
    return new Date(value, month, Math.min(daysInCurrentMonth, day));
  }
};

export { MONTHS, getDateComponents, daysInMonth, mutateDate };
export type { DateComponent, DestructuredDate };

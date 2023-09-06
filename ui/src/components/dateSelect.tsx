import React from "react";
import cn from "../utils/cn";

const daysInMonth = (month: number, year: number) =>
  new Date(year, month + 1, 0).getDate();

const now = new Date();

const range = ({ min = 1, max }: { min?: number; max: number }) =>
  Array.from({ length: max - min + 1 }, (_, i) => min + i);

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
];

type DateComponent = "day" | "month" | "year";

const mutateDate = (date: Date, component: DateComponent, value: number) => {
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

interface DateSelectProps
  extends Omit<React.HTMLProps<HTMLDivElement>, "value" | "onChange"> {
  value: Date;
  minDate?: Date;
  maxDate?: Date;
  onChange: (date: Date) => void;
}

const DateSelect = ({
  value,
  onChange,
  className,
  ...divProps
}: DateSelectProps) => {
  const dateComponentChangeHandler =
    (component: DateComponent) =>
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const target = event.currentTarget;

      const newDate = mutateDate(value, component, Number(target.value));

      onChange(newDate);
    };

  const day = value.getDate();
  const month = value.getMonth();
  const year = value.getFullYear();

  const days = range({
    max: daysInMonth(month, year),
  });

  return (
    <div className={cn("join", className)} {...divProps}>
      <select
        className="select select-sm select-bordered join-item"
        value={day}
        onChange={dateComponentChangeHandler("day")}
        name="day"
      >
        <option disabled className="text-xs">
          Day
        </option>
        {days.map((day) => (
          <option key={day} value={day}>
            {day}
          </option>
        ))}
      </select>
      <select
        className="select select-sm select-bordered join-item"
        value={month}
        onChange={dateComponentChangeHandler("month")}
        name="month"
      >
        <option disabled className="text-xs">
          Month
        </option>
        {MONTHS.map((month, index) => (
          <option key={index} value={index}>
            {month}
          </option>
        ))}
      </select>
      <select
        className="select select-sm select-bordered join-item"
        value={year}
        onChange={dateComponentChangeHandler("year")}
        name="year"
      >
        <option disabled className="text-xs">
          Year
        </option>
        {range({ min: now.getFullYear() - 100, max: now.getFullYear() }).map(
          (year) => (
            <option key={year} value={year}>
              {year}
            </option>
          )
        )}
      </select>
    </div>
  );
};

export default DateSelect;

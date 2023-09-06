import React from "react";
import cn from "../utils/cn";
import {
  DateComponent,
  MONTHS,
  daysInMonth,
  getDateComponents,
  mutateDate,
} from "../utils/date";
import { range } from "../utils/number";

const now = getDateComponents(new Date());

interface DateSelectProps
  extends Omit<React.HTMLProps<HTMLDivElement>, "value" | "onChange"> {
  value: Date;
  minDate?: Date;
  maxDate?: Date;
  onChange: (date: Date) => void;
}

const DateSelect = ({
  value,
  minDate,
  maxDate,
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

  // Ensure that the date is always between minDate and maxDate
  React.useEffect(() => {
    if (minDate) {
      if (value < minDate) {
        onChange(minDate);
      }
    }
    if (maxDate) {
      if (value > maxDate) {
        onChange(maxDate);
      }
    }
  }, [value, minDate, maxDate, onChange]);

  const values = getDateComponents(value);

  // Default min to 100 year before current day
  const minValues = minDate
    ? getDateComponents(minDate)
    : { ...now, year: now.year - 100 };

  // Default max to current day
  const maxValues = maxDate ? getDateComponents(maxDate) : now;

  const days = range({
    min: 1,
    max: daysInMonth(values.month, values.year),
  });

  return (
    <div className={cn("join", className)} {...divProps}>
      <select
        className="select select-sm select-bordered join-item"
        value={values.date}
        onChange={dateComponentChangeHandler("day")}
        name="day"
      >
        <option disabled className="text-xs">
          Day
        </option>
        {days.map((day) => (
          <option
            key={day}
            value={day}
            disabled={
              (values.year === minValues.year &&
                values.month === minValues.month &&
                day < minValues.date) ||
              (values.year === maxValues.year &&
                values.month === maxValues.month &&
                day > maxValues.date)
            }
          >
            {day}
          </option>
        ))}
      </select>
      <select
        className="select select-sm select-bordered join-item"
        value={values.month}
        onChange={dateComponentChangeHandler("month")}
        name="month"
      >
        <option disabled className="text-xs">
          Month
        </option>
        {MONTHS.map((month, index) => (
          <option
            key={index}
            value={index}
            disabled={
              (values.year === minValues.year && index < minValues.month) ||
              (values.year === maxValues.year && index > maxValues.month)
            }
          >
            {month}
          </option>
        ))}
      </select>
      <select
        className="select select-sm select-bordered join-item"
        value={values.year}
        onChange={dateComponentChangeHandler("year")}
        name="year"
      >
        <option disabled className="text-xs">
          Year
        </option>
        {range({ min: minValues.year, max: maxValues.year }).map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DateSelect;

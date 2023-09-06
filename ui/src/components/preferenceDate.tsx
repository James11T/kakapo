import React from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { setPreference } from "../reducers/preferencesReducer";
import { UserPreference, KeysOfType } from "../types";
import DateSelect from "./dateSelect";

interface PreferenceSelectProps<TPreference extends keyof UserPreference> {
  preference: TPreference;
  label: string;
}

const minDate = new Date();
minDate.setFullYear(minDate.getFullYear() - 100);

const maxDate = new Date();

const PreferenceDate = <
  TPreference extends KeysOfType<UserPreference, number>
>({
  preference,
  label,
}: PreferenceSelectProps<TPreference>) => {
  const date = useAppSelector((state) => state.preferences[preference]);
  const dispatch = useAppDispatch();

  const dateValue = new Date(date);

  const handleDateChange = React.useCallback(
    (date: Date) => {
      dispatch(setPreference({ preference, value: Number(date) }));
    },
    [dispatch, preference]
  );

  return (
    <div className="form-control">
      <label className="label cursor-pointer">
        <span className="label-text">{label}</span>
        <DateSelect
          className="w-full max-w-[300px] [&>*]:flex-grow"
          value={dateValue}
          onChange={handleDateChange}
          minDate={minDate}
          maxDate={maxDate}
        />
      </label>
    </div>
  );
};

export default PreferenceDate;

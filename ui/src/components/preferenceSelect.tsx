import React from "react";
import { useAppDispatch } from "../hooks/redux";
import usePreference from "../hooks/usePreference";
import { setPreference } from "../reducers/preferencesReducer";
import { UserPreference } from "../types";

interface PreferenceSelectProps<TPreference extends keyof UserPreference> {
  preference: TPreference;
  label: string;
  labelMap: Record<UserPreference[TPreference], string>;
}

const PreferenceSelect = <TPreference extends keyof UserPreference>({
  preference,
  label,
  labelMap,
}: PreferenceSelectProps<TPreference>) => {
  const value = usePreference(preference);
  const dispatch = useAppDispatch();

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    dispatch(
      setPreference({
        preference,
        value: event.currentTarget.value as UserPreference[TPreference],
      })
    );

  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">{label}</span>
        <select
          className="select select-sm select-bordered w-full max-w-[300px]"
          value={value}
          onChange={handleSelectChange}
        >
          <option disabled className="text-xs">
            {label}
          </option>
          {Object.entries<string>(labelMap).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default PreferenceSelect;

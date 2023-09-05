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
      <label className="label pb-1">
        <span className="label-text text-opacity-75">{label}</span>
      </label>
      <select
        className="select select-bordered w-full"
        value={value}
        onChange={handleSelectChange}
      >
        <option disabled>Message Privacy</option>
        {Object.entries<string>(labelMap).map(([key, value]) => (
          <option key={key} value={key}>
            {value}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PreferenceSelect;

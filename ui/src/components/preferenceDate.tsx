import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { setPreference } from "../reducers/preferencesReducer";
import { UserPreference, KeysOfType } from "../types";
import DateSelect from "./dateSelect";

interface PreferenceSelectProps<TPreference extends keyof UserPreference> {
  preference: TPreference;
  label: string;
}
const PreferenceDate = <
  TPreference extends KeysOfType<UserPreference, number>
>({
  preference,
  label,
}: PreferenceSelectProps<TPreference>) => {
  const date = useAppSelector((state) => state.preferences[preference]);
  const dispatch = useAppDispatch();

  const dateValue = new Date(date);

  return (
    <div className="form-control">
      <label className="label cursor-pointer">
        <span className="label-text">{label}</span>
        <DateSelect
          value={dateValue}
          onChange={(date) =>
            dispatch(setPreference({ preference, value: Number(date) }))
          }
        />
      </label>
    </div>
  );
};

export default PreferenceDate;

import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { setPreference } from "../reducers/preferencesReducer";
import { UserPreference } from "../types";

interface PreferenceSwitchProps<TPreference extends keyof UserPreference> {
  label: string;
  preference: TPreference;
  trueValue: UserPreference[TPreference];
  falseValue: UserPreference[TPreference];
}

const PreferenceSwitch = <TPreference extends keyof UserPreference>({
  label,
  preference,
  trueValue,
  falseValue,
}: PreferenceSwitchProps<TPreference>) => {
  const value = useAppSelector((state) => state.preferences[preference]);
  const dispatch = useAppDispatch();

  return (
    <div className="form-control">
      <label className="label cursor-pointer">
        <span className="label-text">{label}</span>
        <input
          type="checkbox"
          className="toggle"
          checked={value === trueValue}
          onChange={(event) =>
            dispatch(
              setPreference({
                preference,
                value: event.currentTarget.checked ? trueValue : falseValue,
              })
            )
          }
        />
      </label>
    </div>
  );
};

export default PreferenceSwitch;

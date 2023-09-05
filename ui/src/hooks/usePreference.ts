import { UserPreference } from "../types";
import { useAppSelector } from "./redux";

const usePreference = <TPreference extends keyof UserPreference>(
  preference: TPreference
): UserPreference[TPreference] => {
  const preferenceValue = useAppSelector(
    (state) => state.preferences[preference]
  );

  return preferenceValue;
};

export default usePreference;

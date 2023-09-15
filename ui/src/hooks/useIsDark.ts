import { useAppSelector } from "./redux";

const DARK_THEMES = ["dark", "luxury"];

const useIsDark = () => {
  const theme = useAppSelector((state) => state.preferences.theme);
  const prefersDarkMode = useAppSelector(
    (state) => state.mediaQueries.prefersDarkMode
  );

  if (theme === "automatic") {
    return prefersDarkMode;
  }

  return DARK_THEMES.includes(theme);
};

export default useIsDark;

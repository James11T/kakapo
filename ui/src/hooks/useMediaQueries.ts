import React from "react";
import { useAppDispatch } from "./redux";
import { setPrefersDarkMode } from "../reducers/mediaQueryReducer";

const useMediaQueries = () => {
  const dispatch = useAppDispatch();

  const handlePreferDarkChange = React.useCallback(
    (event: MediaQueryListEvent) => {
      dispatch(setPrefersDarkMode(event.matches));
    },
    [dispatch]
  );

  React.useEffect(() => {
    const matcher = window.matchMedia("(prefers-color-scheme: dark)");

    matcher.addEventListener("change", handlePreferDarkChange);

    return () => matcher.removeEventListener("change", handlePreferDarkChange);
  }, [handlePreferDarkChange]);
};

export default useMediaQueries;

import React from "react";
import usePreference from "./usePreference";

const useTheme = () => {
  const theme = usePreference("theme");

  React.useEffect(() => {
    if (theme === "automatic")
      return document.documentElement.removeAttribute("data-theme");

    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
};

export default useTheme;

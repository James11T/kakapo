import React from "react";
import { useAppSelector } from "./redux";

const useTitle = () => {
  const { title, notifications } = useAppSelector((state) => state.ui);

  React.useEffect(() => {
    let builtTitle = "";

    if (notifications !== 0) {
      builtTitle += `(${notifications}) `;
    }

    builtTitle += "Kakapo";

    if (title) {
      builtTitle += ` | ${title}`;
    }

    document.title = builtTitle;
  }, [title, notifications]);
};

export default useTitle;

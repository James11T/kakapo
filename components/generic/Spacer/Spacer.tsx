import React from "react";
import cn from "clsx";
import styles from "./Spacer.module.scss";

interface SpacerProps {
  axis?: "x" | "y" | "horizontal" | "vertical";
  spacing?: number;
}

const Spacer = ({ axis = "x", spacing = 1 }: SpacerProps): JSX.Element => {
  if (axis === "horizontal") axis = "x";
  else if (axis === "vertical") axis = "y";

  return (
    <div
      className={cn(
        styles["spacer"],
        styles[axis === "x" ? "spacer--x" : "spacer--y"]
      )}
      style={{ "--spacing": spacing } as React.CSSProperties}
    ></div>
  );
};

export default Spacer;

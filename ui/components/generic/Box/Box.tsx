import React from "react";
import cn from "clsx";
import styles from "./Box.module.scss";

interface BoxProps {
  flex?: boolean | "col" | "row";
  padding?: number;
  spacing?: number;
  fullWidth?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const Box = ({
  flex,
  padding = 0,
  spacing = 0,
  fullWidth = false,
  className,
  style,
  children
}: BoxProps): JSX.Element => {
  const classes = {
    [styles["box--flex"]]: Boolean(flex),
    [styles["box--flex-row"]]: flex === true || flex === "row",
    [styles["box--flex-col"]]: flex === "col",
    [styles["box--full-width"]]: fullWidth
  };

  return (
    <div
      className={cn(styles["box"], className, classes)}
      style={{
        "--padding": padding,
        "--spacing": spacing,
        ...style
      }}
    >
      {children}
    </div>
  );
};

export default Box;
export type { BoxProps };

import React from "react";
import styles from "./Card.module.scss";
import cn from "classnames";
import { handleColor } from "../../src/color";
import type { ColorValue } from "../../src/types";

const cardTypeClasses = {
  raised: styles["card--raised"],
  outlined: styles["card--outlined"],
  flat: styles["card--flat"],
  invisible: undefined
};

interface CardProps {
  className?: cn.ArgumentArray | string | Record<string, unknown>;
  children?: React.ReactNode;
  flex?: boolean;
  flexDirection?: "col" | "column" | "row";
  type?: keyof typeof cardTypeClasses;
  band?: ColorValue;
  padding?: number;
  spacing?: number;
}

const Card = ({
  className,
  children,
  flex,
  flexDirection,
  type = "raised",
  band,
  padding = 2,
  spacing = 0
}: CardProps): JSX.Element => {
  const classes = {
    [styles["card--flex"]]: flex,
    [styles["card--flex-row"]]: flexDirection === "row",
    [styles["card--flex-col"]]:
      flexDirection === "col" || flexDirection === "column",
    [styles["card--banded"]]: Boolean(band)
  };

  return (
    <div
      className={cn(styles["card"], className, cardTypeClasses[type], classes)}
      style={
        {
          "--band-color": handleColor(band),
          "--padding": padding,
          "--spacing": spacing
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
};

export default Card;
export type { CardProps };

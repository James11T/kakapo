import React from "react";
import cn from "clsx";
import { handleColor } from "../../../src/color";
import styles from "./Card.module.scss";
import type { ColorValue } from "../../../src/types";

const cardTypeClasses = {
  raised: styles["card--raised"],
  outlined: styles["card--outlined"],
  flat: styles["card--flat"],
  invisible: undefined
};

interface CardProps {
  className?: string;
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
    [styles["card--flex-col"]]: flexDirection?.startsWith("col") ?? false,
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

import React from "react";
import cn from "clsx";
import Box from "../Box/Box";
import { handleColor } from "../../../src/color";
import type { ColorValue } from "../../../src/types";
import styles from "./Card.module.scss";

const cardStyleClasses = {
  raised: styles["card--raised"],
  outlined: styles["card--outlined"],
  flat: styles["card--flat"],
  invisible: undefined
};

interface CardProps {
  flex?: boolean | "col" | "row";
  style?: keyof typeof cardStyleClasses;
  band?: ColorValue;
  padding?: number;
  spacing?: number;
  className?: string;
  children?: React.ReactNode;
}

const Card = ({
  flex,
  style = "raised", // Change to style
  band,
  padding = 2,
  spacing = 0,
  className,
  children
}: CardProps): JSX.Element => {
  const classes = {
    [styles["card--banded"]]: Boolean(band)
  };

  return (
    <Box
      flex={flex}
      className={cn(
        styles["card"],
        className,
        cardStyleClasses[style],
        classes
      )}
      style={{
        "--band-color": handleColor(band),
        "--padding": padding,
        "--spacing": spacing
      }}
    >
      {children}
    </Box>
  );
};

export default Card;
export type { CardProps };

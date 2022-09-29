import React from "react";
import styles from "./Card.module.scss";
import cn from "classnames";

interface CardProps {
  className?: cn.ArgumentArray | string | Record<string, unknown>;
  children?: React.ReactNode;
  flex?: boolean;
  flexDirection?: "col" | "column" | "row";
}

const Card = ({
  className,
  children,
  flex,
  flexDirection
}: CardProps): JSX.Element => {
  const flexStyles = {
    [styles["card--flex"]]: flex,
    [styles["card--flex-row"]]: flexDirection === "row",
    [styles["card--flex-col"]]: flexDirection?.startsWith("col")
  };

  return (
    <div className={cn(styles["card"], className, flexStyles)}>{children}</div>
  );
};

export default Card;
export type { CardProps };

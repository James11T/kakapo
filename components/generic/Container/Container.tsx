import React from "react";
import styles from "./Container.module.scss";
import cn from "clsx";

const containerSizeClasses = {
  xs: styles["container--xs"],
  s: styles["container--s"],
  m: styles["container--m"],
  l: styles["container--x"],
  xl: styles["container--xl"],
  responsive: styles["container--responsive"] // Don't double up the container class
};

interface ContainerProps {
  size?: keyof typeof containerSizeClasses;
  children?: React.ReactNode;
  className?: string;
}

const Container = ({
  size = "responsive",
  children,
  className
}: ContainerProps): JSX.Element => {
  return (
    <div
      className={cn(styles["container"], containerSizeClasses[size], className)}
    >
      {children}
    </div>
  );
};

export default Container;

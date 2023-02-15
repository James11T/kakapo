import React from "react";
import cn from "clsx";
import styles from "./TopBar.module.scss";

const positionClasses = {
  absolute: styles["topbar--position-absolute"],
  fixed: styles["topbar--position-fixed"],
  static: undefined
};

interface TopBarProps {
  position?: keyof typeof positionClasses;
  children?: React.ReactNode;
}

const TopBar = ({
  position = "static",
  children
}: TopBarProps): JSX.Element => {
  return (
    <div className={cn(styles["topbar"], positionClasses[position])}>
      {children}
    </div>
  );
};

export default TopBar;

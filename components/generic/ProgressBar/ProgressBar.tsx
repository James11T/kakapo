import React from "react";
import styles from "./ProgressBar.module.scss";
import cn from "clsx";

const progressBarStateClasses = {
  stall: styles["progress-bar--stall"],
  error: styles["progress-bar--error"],
  normal: styles["progress-bar--normal"],
  waiting: styles["progress-bar--waiting"]
};

interface ProgressBarProps {
  min?: number;
  max?: number;
  value: number;
  state?: keyof typeof progressBarStateClasses;
  label?: "off" | "percentage" | "fraction";
}

const ProgressBar = ({
  min = 0,
  max = 100,
  value,
  state = "normal",
  label = "off"
}: ProgressBarProps): JSX.Element => {
  const prog = (value - min) / (max - min);

  const progressBarClasses = {
    [styles["progress-bar--animating"]]: state === "normal"
  };

  let labelText = "";

  if (label === "fraction") {
    if (min !== 0) labelText = `${min} / ${Math.round(value)} / ${max}`;
    else labelText = `${Math.round(value)} / ${max}`;
  } else if (label === "percentage") {
    labelText = `${Math.round(prog * 100)}%`;
  }

  return (
    <div
      className={cn(
        styles["progress-bar"],
        progressBarStateClasses[state],
        progressBarClasses
      )}
      style={
        {
          "--prog": `${Math.floor(prog * 10000) / 100}%`
        } as React.CSSProperties
      }
    >
      <span className={styles["progress-bar__label"]}>{labelText}</span>
    </div>
  );
};

export default ProgressBar;

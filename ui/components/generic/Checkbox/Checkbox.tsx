import React from "react";
import cn from "clsx";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import styles from "./Checkbox.module.scss";

const markerStyleClasses = {
  raised: styles["checkbox--raised"],
  outlined: styles["checkbox--outlined"],
  flat: styles["checkbox--flat"]
};

interface CheckboxProps {
  checked: boolean;
  style?: keyof typeof markerStyleClasses;
  children?: React.ReactNode;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox = ({
  checked,
  style = "outlined",
  children,
  onChange
}: CheckboxProps): JSX.Element => {
  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (!onChange) return;
    onChange(e);
  };

  return (
    <label className={cn(styles["checkbox"], markerStyleClasses[style])}>
      <span>{children}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleCheckboxChange}
      />
      <span className={styles["checkbox__marker"]}>
        {checked && (
          <CheckRoundedIcon className={styles["checkbox__marker__icon"]} />
        )}
      </span>
    </label>
  );
};

export default Checkbox;

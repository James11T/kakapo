import React from "react";
import styles from "./Button.module.scss";
import cn from "clsx";
import { handleColor } from "../../../src/color";
import WaitingSpinner from "../WaitingSpinner/WaitingSpinner";
import type { ColorValue } from "../../../src/types";

const buttonStyleClasses = {
  raised: styles["button--raised"],
  outlined: styles["button--outlined"],
  flat: styles["button--flat"]
};

interface ButtonProps {
  id?: string;
  style?: keyof typeof buttonStyleClasses;
  color?: ColorValue;
  disabled?: boolean;
  submit?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLButtonElement>) => void;
}

const Button = ({
  id,
  style = "raised",
  color,
  disabled = false,
  submit,
  fullWidth = false,
  loading = false,
  children,
  onClick,
  onFocus,
  onBlur
}: ButtonProps): JSX.Element => {
  return (
    <button
      className={cn(
        styles["button"],
        Boolean(color) && styles["button--colored"],
        buttonStyleClasses[style],
        fullWidth && styles["button--full-width"]
      )}
      style={{ "--band-color": handleColor(color) } as React.CSSProperties}
      type={submit ? "button" : "submit"}
      id={id}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
      disabled={disabled || loading}
    >
      {loading && <WaitingSpinner />}
      {children}
    </button>
  );
};

export default Button;
export type { ButtonProps };

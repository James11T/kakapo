import React from "react";
import styles from "./Button.module.scss";
import cn from "clsx";
import { handleColor } from "../../../src/color";
import WaitingSpinner from "../WaitingSpinner/WaitingSpinner";
import type { ColorValue } from "../../../src/types";

const buttonStyleClasses = {
  primary: styles["button--primary"],
  secondary: styles["button--secondary"],
  destructive: styles["button--destructive"],
  positive: styles["button--positive"],
  custom: styles["button--custom"],
  plain: undefined
};

const buttonVariantClasses = {
  raised: styles["button--raised"],
  outlined: styles["button--outlined"],
  flat: styles["button--flat"]
};

interface ButtonProps {
  id?: string;
  style?: keyof typeof buttonStyleClasses;
  variant?: keyof typeof buttonVariantClasses;
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
  style = "plain",
  variant = "raised",
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
    <div
      className={cn(
        styles["button"],
        buttonStyleClasses[color ? "custom" : style],
        buttonVariantClasses[variant],
        fullWidth && styles["button--full-width"]
      )}
      style={{ "--band-color": handleColor(color) } as React.CSSProperties}
    >
      <button
        type={submit ? "button" : "submit"}
        id={id}
        onClick={onClick}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled}
      >
        {loading && <WaitingSpinner />}
        {children}
      </button>
    </div>
  );
};

export default Button;
export type { ButtonProps };

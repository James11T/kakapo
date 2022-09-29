import React from "react";
import styles from "./Button.module.scss";
import cn from "classnames";
import type { ColorValue } from "../../src/types";
import { handleColor } from "../../src/color";

const buttonClasses = {
  primary: styles["button--primary"],
  secondary: styles["button--secondary"],
  destructive: styles["button--destructive"],
  custom: styles["button--custom"],
  plain: undefined
};

interface ButtonProps {
  id: string;
  type?: keyof typeof buttonClasses;
  color?: ColorValue;
  disabled?: boolean;
  submit?: boolean;
  fullWidth?: boolean;
  children: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLButtonElement>) => void;
}

const Button = ({
  id,
  type = "plain",
  color,
  disabled = false,
  submit,
  fullWidth = false,
  children,
  onClick,
  onFocus,
  onBlur
}: ButtonProps): JSX.Element => {
  return (
    <div
      className={cn(
        styles["button"],
        buttonClasses[color ? "custom" : type],
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
        {children}
      </button>
    </div>
  );
};

export default Button;
export type { ButtonProps };

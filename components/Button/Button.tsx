import React from "react";
import styles from "./Button.module.scss";
import cn from "classnames";

const buttonClasses = {
  primary: styles["button--primary"],
  secondary: styles["button--secondary"],
  destructive: styles["button--destructive"]
};

interface ButtonProps {
  id: string;
  type?: keyof typeof buttonClasses;
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
  type = "primary",
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
        buttonClasses[type],
        fullWidth && styles["button--full-width"]
      )}
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

import React from "react";
import styles from "./TextInput.module.scss";
import cn from "clsx";

interface TextInputProps {
  id: string;
  label?: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  autocomplete?: "off" | "on";
  defaultValue?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

const TextInput = ({
  label,
  id,
  placeholder,
  type = "text",
  autocomplete = "off",
  defaultValue,
  disabled = false,
  children,
  onChange,
  onFocus,
  onBlur
}: TextInputProps): JSX.Element => {
  const hasLabel = Boolean(label);

  return (
    <div
      className={cn(
        styles["text-input"],
        placeholder && styles["text-input--has-placeholder"]
      )}
    >
      {hasLabel && (
        <label htmlFor={id} hidden={true}>
          {label}
        </label>
      )}
      <input
        type={type}
        name={id}
        id={id}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder ?? ""}
        autoComplete={autocomplete}
        defaultValue={defaultValue}
        disabled={disabled}
      />
      {hasLabel && <span className={styles["text-input__label"]}>{label}</span>}
      {children}
    </div>
  );
};

export default TextInput;
export type { TextInputProps };

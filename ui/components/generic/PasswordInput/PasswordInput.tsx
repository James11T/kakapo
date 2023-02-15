import React from "react";
import TextInput from "../TextInput/TextInput";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import styles from "./PasswordInput.module.scss";
import useMouseUp from "../../../hooks/useMouseUp";
import type { TextInputProps } from "../TextInput/TextInput";

interface PasswordInputProps extends Omit<TextInputProps, "type"> {
  revealMode?: "toggle" | "hold";
}

const PasswordInput = ({
  revealMode = "hold",
  ...props
}: PasswordInputProps): JSX.Element => {
  const [contentShown, setContentShown] = React.useState(false);

  const Icon = contentShown ? VisibilityOffIcon : VisibilityIcon;

  const handleVisibilityClick = (): void => {
    if (revealMode === "toggle") setContentShown((old) => !old);
  };

  const handleVisibilityDown = (): void => {
    if (revealMode === "hold") setContentShown(true);
  };

  const handleVisibilityUp = React.useCallback(() => {
    if (revealMode === "hold") setContentShown(false);
  }, []);

  useMouseUp(handleVisibilityUp);

  return (
    <TextInput {...props} type={contentShown ? "text" : "password"}>
      <button
        className={styles["password-input__visibility-button"]}
        onClick={handleVisibilityClick}
        onMouseDown={handleVisibilityDown}
        onMouseUp={handleVisibilityUp}
        title={contentShown ? "Hide password" : "Show password"}
      >
        <Icon className={styles["password-input__visibility-icon"]} />
      </button>
    </TextInput>
  );
};

export default PasswordInput;

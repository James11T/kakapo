import cn from "clsx";
import styles from "./ToastContainer.module.scss";

interface ToastContainerProps {
  position?: "tr" | "tl" | "bl" | "br";
  children?: React.ReactNode;
}

const ToastContainer = ({
  position = "br",
  children
}: ToastContainerProps): JSX.Element => {
  const classes = {
    [styles["toast-container--top"]]: position[0] === "t",
    [styles["toast-container--bottom"]]: position[0] === "b",
    [styles["toast-container--left"]]: position[1] === "l",
    [styles["toast-container--right"]]: position[1] === "r"
  };

  return (
    <div className={cn(styles["toast-container"], classes)}>{children}</div>
  );
};

export default ToastContainer;

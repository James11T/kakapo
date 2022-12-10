import styles from "./ToastContainer.module.scss";

interface ToastContainerProps {
  children?: React.ReactNode;
}

const ToastContainer = ({ children }: ToastContainerProps): JSX.Element => {
  return <div className={styles["toast-container"]}>{children}</div>;
};

export default ToastContainer;

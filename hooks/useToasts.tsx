import React from "react";
import { randomBytes } from "crypto";
import { Toast, ToastContainer } from "../components/generic";
import type { ColorValue } from "../src/types";

const randomId = (length = 8): string =>
  randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);

interface ToastConfig {
  animationTime: number;
  dismissible: boolean;
  timeToLive: number | undefined;
  color: ColorValue | undefined;
}

const defaultConfig: ToastConfig = {
  animationTime: 200,
  dismissible: true,
  timeToLive: undefined,
  color: undefined
};

interface Notification extends ToastConfig {
  id: string;
  text: string;
}

interface ToastContext {
  createNotification: (text: string, config: Partial<ToastConfig>) => void;
}

const toastContext = React.createContext<ToastContext>({} as ToastContext);

interface ToastProviderProps {
  children?: React.ReactNode;
  providerConfig?: Partial<ToastConfig>;
}

const ToastProvider = ({ children, providerConfig }: ToastProviderProps) => {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  const createNotification = React.useCallback(
    (text: string, config: Partial<ToastConfig>) => {
      const combinedConfig: ToastConfig = {
        ...defaultConfig,
        ...providerConfig,
        ...config
      };

      setNotifications((old) => [
        ...old,
        {
          id: randomId(),
          text,
          ...combinedConfig
        }
      ]);
    },
    []
  );

  const removeId = (id: string) =>
    setNotifications((old) =>
      old.filter((oldNotification) => oldNotification.id !== id)
    );

  return (
    <toastContext.Provider value={{ createNotification }}>
      {children}
      <ToastContainer>
        {notifications.map((notification) => (
          <Toast
            eject={() => removeId(notification.id)}
            key={notification.id}
            band={notification.color}
            dismissible={notification.dismissible}
            timeToLive={notification.timeToLive}
          >
            {notification.text}
          </Toast>
        ))}
      </ToastContainer>
    </toastContext.Provider>
  );
};

const useToasts = () => React.useContext(toastContext);

export { ToastProvider, useToasts };
export default useToasts;

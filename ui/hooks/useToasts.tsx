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
  dismissed: boolean;
}

interface ToastContext {
  notifications: readonly Notification[];
  create: (text: string, config?: Partial<ToastConfig>) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const toastContext = React.createContext<ToastContext>({} as ToastContext);

interface ToastProviderProps {
  config?: Partial<ToastConfig>;
  position?: "tr" | "tl" | "bl" | "br";
  children?: React.ReactNode;
}

const ToastProvider = ({
  config: providerConfig,
  position,
  children
}: ToastProviderProps): JSX.Element => {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  const create = React.useCallback(
    (text: string, config: Partial<ToastConfig> = {}) => {
      const combinedConfig: ToastConfig = {
        ...defaultConfig, // Default values
        ...providerConfig, // Config set at provider level
        ...config // Config set at individual toast level
      };

      const id = randomId(); // Used to dismiss toast

      setNotifications((old) => [
        ...old,
        {
          id: id,
          text,
          dismissed: false,
          ...combinedConfig
        }
      ]);

      return id;
    },
    [JSON.stringify(providerConfig)]
  );

  const dismiss = React.useCallback((id: string) => {
    setNotifications((old) => {
      const changed = old.find((notification) => notification.id === id);
      if (!changed) return old;
      const unchanged = old.filter((notification) => notification.id !== id);
      return [...unchanged, { ...changed, dismissed: true }];
    });
  }, []);

  const dismissAll = React.useCallback(() => {
    setNotifications((old) =>
      old.map((notification) => ({ ...notification, dismissed: true }))
    );
  }, []);

  const removeId = (id: string): void =>
    setNotifications((old) =>
      old.filter((oldNotification) => oldNotification.id !== id)
    );

  return (
    <toastContext.Provider
      value={{
        notifications,
        create,
        dismiss,
        dismissAll
      }}
    >
      {children}
      <ToastContainer position={position}>
        {notifications.map((notification) => (
          <Toast
            eject={(): void => removeId(notification.id)}
            key={notification.id}
            band={notification.color}
            {...notification}
          >
            {notification.text}
          </Toast>
        ))}
      </ToastContainer>
    </toastContext.Provider>
  );
};

const useToasts = (): ToastContext => React.useContext(toastContext);

export { ToastProvider, useToasts };
export default useToasts;

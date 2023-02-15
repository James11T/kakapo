import React from "react";

interface TitleState {
  prefix: string;
  alerts: number;
  title: string | undefined;
}

interface TitleContext extends TitleState {
  setTitle: (title: string) => void;
  clearTitle: () => void;
  setAlerts: (alerts: number) => void;
  clearAlerts: () => void;
  incrementAlerts: (alters?: number) => void;
  setPrefix: (prefix: string) => void;
}

interface ProviderProps {
  prefix: string;
  title?: string;
  alerts?: number; // Notifications
  children?: React.ReactNode;
  head: React.ComponentType<{ children: React.ReactNode }>; // Pass in head provider
}

const titleContext = React.createContext<TitleContext>({} as TitleContext);
const Provider = titleContext.Provider;

const TitleProvider = ({
  prefix,
  head: Head,
  title,
  alerts = 0,
  children
}: ProviderProps): JSX.Element => {
  const [titleState, setTitleState] = React.useState({
    prefix,
    title,
    alerts
  });

  const setTitle = React.useCallback(
    (title: string): void => setTitleState((old) => ({ ...old, title })),
    []
  );

  const clearTitle = React.useCallback(
    (): void => setTitleState((old) => ({ ...old, title: undefined })),
    []
  );

  const setAlerts = React.useCallback(
    (alerts: number): void => setTitleState((old) => ({ ...old, alerts })),
    []
  );

  const clearAlerts = React.useCallback(
    (): void => setTitleState((old) => ({ ...old, alerts: 0 })),
    []
  );

  const incrementAlerts = React.useCallback(
    (alerts = 1): void =>
      setTitleState((old) => ({ ...old, alerts: old.alerts + alerts })),
    []
  );

  const setPrefix = React.useCallback(
    (prefix: string): void => setTitleState((old) => ({ ...old, prefix })),
    []
  );

  const titleString =
    (titleState.alerts ? `(${titleState.alerts}) ` : "") +
    titleState.prefix +
    (titleState.title ? ` | ${titleState.title}` : "");

  return (
    <Provider
      value={{
        ...titleState,
        setTitle,
        clearTitle,
        setAlerts,
        clearAlerts,
        incrementAlerts,
        setPrefix
      }}
    >
      <Head>
        <title>{titleString}</title>
      </Head>
      {children}
    </Provider>
  );
};

const useTitle = (): TitleContext => React.useContext(titleContext);

export { TitleProvider, useTitle };

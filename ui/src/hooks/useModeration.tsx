import React from "react";

interface ModerationContext {
  revealedContent: string[];
  reveal: (uuid: string) => void;
  hide: (uuid: string) => void;
  isRevealed: (uuid: string) => boolean;
  isHidden: (uuid: string) => boolean;
}

interface ModerationProviderProps {
  children?: React.ReactNode;
}

const moderationContext = React.createContext({} as ModerationContext);

const ModerationProvider = ({ children }: ModerationProviderProps) => {
  const [revealedUUIDs, setRevealedUUIDs] = React.useState<string[]>([]);

  const reveal = React.useCallback(
    (uuid: string) =>
      setRevealedUUIDs((old) => {
        if (old.includes(uuid)) return [...old];
        return [...old, uuid];
      }),
    []
  );

  const hide = React.useCallback(
    (uuid: string) =>
      setRevealedUUIDs((old) => old.filter((value) => value !== uuid)),
    []
  );

  const isRevealed = React.useCallback(
    (uuid: string) => revealedUUIDs.includes(uuid),
    [revealedUUIDs]
  );

  const isHidden = React.useCallback(
    (uuid: string) => !revealedUUIDs.includes(uuid),
    [revealedUUIDs]
  );

  return (
    <moderationContext.Provider
      value={{
        revealedContent: revealedUUIDs,
        reveal,
        hide,
        isRevealed,
        isHidden,
      }}
    >
      {children}
    </moderationContext.Provider>
  );
};

const useModeration = () => React.useContext(moderationContext);

export default useModeration;
export { ModerationProvider, useModeration };

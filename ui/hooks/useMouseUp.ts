import React from "react";

/*
 * Hook a callback into a global mouse up event

 * Used for detecting mouse up after the mouse 
 *   left a bounding box for a mouse up event
 */
const useMouseUp = (callback: () => void): void => {
  React.useEffect(() => {
    const event = (): void => callback();
    window.addEventListener("mouseup", event);
    return () => window.removeEventListener("mouseup", event);
  }, [callback]);
};

export default useMouseUp;

import cn from "../utils/cn";
import { Size } from "../types";
import React from "react";

interface AvatarProps extends React.ComponentPropsWithoutRef<"div"> {
  online?: boolean;
  size?: Size;
  placeholder?: string;
  icon?: string;
}

const Avatar = ({
  icon,
  placeholder,
  online,
  size = "md",
  className,
  ...divProps
}: AvatarProps) => {
  const isPlaceholder = icon === undefined;

  const sizeClasses = cn({
    "w-20": size === "xl",
    "w-16": size === "lg",
    "w-12": size === "md",
    "w-8": size === "sm",
  });

  const textSizeClasses = cn({
    "text-4xl": size === "xl",
    "text-3xl": size === "lg",
    "text-2xl": size === "md",
    "text-lg": size === "sm",
  });

  return (
    <div
      className={cn(
        "avatar",
        isPlaceholder && "placeholder",
        online !== undefined && (online ? "online" : "offline"),
        className
      )}
      {...divProps}
    >
      {isPlaceholder ? (
        <div
          className={cn(
            "bg-neutral-focus text-neutral-content rounded-full",
            sizeClasses
          )}
        >
          <span className={textSizeClasses}>{placeholder}</span>
        </div>
      ) : (
        <div className={cn("rounded-xl", sizeClasses)}>
          <img src={icon} />
        </div>
      )}
    </div>
  );
};

export default Avatar;

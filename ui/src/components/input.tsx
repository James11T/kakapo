import React, { ElementRef } from "react";
import cn from "../utils/cn";

interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<ElementRef<"input">, InputProps>(
  ({ label, error, className, ...inputProps }, ref) => {
    const isError = Boolean(error);

    return (
      <div className="form-control w-full">
        {label && (
          <label className="label">
            <span className="label-text">Password</span>
          </label>
        )}
        <input
          className={cn(
            "input input-bordered w-full",
            isError && "input-error",
            className
          )}
          {...inputProps}
          ref={ref}
        />
        {isError && (
          <label className="label">
            <span className="label-text-alt text-error -mt-1">{error}</span>
          </label>
        )}
      </div>
    );
  }
);

export default Input;

import cn from "../utils/cn";

interface IconInputProps extends React.ComponentPropsWithoutRef<"input"> {
  icon: React.ReactNode;
}

const IconInput = ({ icon, className, ...inputProps }: IconInputProps) => {
  return (
    <div className="relative">
      <input className={cn(className, "pl-11")} {...inputProps} />
      <span className="absolute left-3 top-1/2 h-6 w-6 -translate-y-1/2">
        {icon}
      </span>
    </div>
  );
};

export default IconInput;

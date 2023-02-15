import cn from "clsx";
import styles from "./FlexPusher.module.scss";

interface FlexPusherProps {
  axis?: "x" | "y" | "horizontal" | "vertical";
}

const FlexPusher = ({ axis = "x" }: FlexPusherProps): JSX.Element => {
  if (axis === "horizontal") axis = "x";
  else if (axis === "vertical") axis = "y";

  return (
    <div
      className={cn(
        styles["flex-pusher"],
        styles[axis === "x" ? "flex-pusher--x" : "flex-pusher--y"]
      )}
    ></div>
  );
};

export default FlexPusher;

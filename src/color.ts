import Color from "color";
import type { ColorValue } from "./types";

const handleColor = (
  color: ColorValue | undefined | null,
  defaultColor: ColorValue = Color("#000000")
): string | undefined => {
  if (!color) color = defaultColor;
  if (typeof color === "string") color = Color(color);
  return color.rgb().string();
};

export { handleColor };

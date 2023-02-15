import Color from "color";
import type { ColorValue } from "./types";

const colors = {
  primary: Color([58, 114, 219], "rgb"),
  success: Color([50, 206, 84], "rgb"),
  secondary: Color([150, 150, 150], "rgb"),
  destructive: Color([219, 65, 65], "rgb")
};

const handleColor = (
  color: ColorValue | undefined | null,
  defaultColor: Color = Color("#000000")
): string | undefined => {
  if (!color) color = defaultColor;
  if (typeof color === "string") {
    if (color.startsWith("_")) {
      const key = color.substring(1);
      if (key in colors) {
        color = colors[key as keyof typeof colors];
      } else {
        color = defaultColor;
      }
    } else {
      color = Color(color);
    }
  }
  return color.rgb().string();
};

export { handleColor };

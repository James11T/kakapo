import clsx from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...classes: Parameters<typeof clsx>) => twMerge(clsx(...classes));

export default cn;

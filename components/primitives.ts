// components/primitives.ts
import { cn } from "@/lib/utils";

export const title = (opts?: { size?: "sm" | "md" | "lg" | "xl" | "2xl" }) => {
  const sizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
    xl: "text-4xl",
    "2xl": "text-5xl",
  };
  return cn("font-bold leading-tight", opts?.size ? sizes[opts.size] : sizes["md"]);
};

export const subtitle = () =>
  cn("text-muted-foreground text-base");

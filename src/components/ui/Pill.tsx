import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

type PillSize = "sm" | "md" | "lg";

interface PillProps extends PropsWithChildren {
  size?: PillSize;
}

const sizeClasses: Record<PillSize, string> = {
  sm: "px-1.5 py-0.5 text-xs",
  md: "px-2 py-0.5 text-sm",
  lg: "px-3 py-1 text-base",
};

export default function Pill({ children, size = "sm" }: PillProps) {
  return (
    <span
      className={twMerge(
        "inline-flex items-center rounded-full bg-indigo-50 font-medium text-blue-500 ring-1 ring-inset ring-blue-500/10",
        sizeClasses[size],
      )}
    >
      {children}
    </span>
  );
}

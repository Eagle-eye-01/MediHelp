import * as React from "react";

import { cn } from "@/lib/utils";

export function Badge({
  className,
  children,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "secondary" | "outline";
}) {
  const variantClasses = {
    default: "bg-slate-100 text-slate-600",
    secondary: "bg-slate-100 text-slate-600",
    outline: "border border-slate-200 bg-white text-slate-600"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

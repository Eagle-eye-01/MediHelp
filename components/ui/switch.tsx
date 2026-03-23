"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type SwitchProps = {
  checked?: boolean;
  className?: string;
  defaultChecked?: boolean;
  id?: string;
  onCheckedChange?: (checked: boolean) => void;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange">;

export function Switch({
  checked,
  className,
  defaultChecked = false,
  id,
  onCheckedChange,
  ...props
}: SwitchProps) {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
  const isChecked = checked ?? internalChecked;

  return (
    <button
      aria-checked={isChecked}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full bg-slate-200 transition-colors duration-200 active:scale-95",
        isChecked ? "bg-primary" : "bg-slate-200",
        className
      )}
      id={id}
      onClick={() => {
        const nextValue = !isChecked;
        if (checked === undefined) {
          setInternalChecked(nextValue);
        }
        onCheckedChange?.(nextValue);
      }}
      role="switch"
      type="button"
      {...props}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200",
          isChecked ? "translate-x-5" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

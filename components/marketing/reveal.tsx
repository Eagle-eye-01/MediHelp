"use client";

import type { ReactNode } from "react";

import { useIntersection } from "@/lib/hooks/useIntersection";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
};

export function Reveal({ children, className, delay = 0, threshold = 0.15 }: RevealProps) {
  const { ref, isIntersecting } = useIntersection<HTMLDivElement>({
    threshold
  });

  return (
    <div
      ref={ref}
      className={cn(
        "transform-gpu transition-all duration-700 ease-out will-change-transform",
        isIntersecting ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

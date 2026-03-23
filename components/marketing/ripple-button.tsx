"use client";

import * as React from "react";
import Link from "next/link";

import { buttonVariants, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Ripple = {
  id: number;
  x: number;
  y: number;
  size: number;
};

type RippleButtonProps = {
  children: React.ReactNode;
  className?: string;
  href?: string;
  variant?: ButtonProps["variant"];
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  type?: "button" | "submit" | "reset";
  target?: string;
  rel?: string;
};

export function RippleButton({
  children,
  className,
  href,
  onClick,
  rel,
  target,
  type = "button",
  variant = "default"
}: RippleButtonProps) {
  const [ripples, setRipples] = React.useState<Ripple[]>([]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const size = Math.max(bounds.width, bounds.height) * 1.8;
    const ripple = {
      id: Date.now(),
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
      size
    };

    setRipples((current) => [...current, ripple]);
    onClick?.(event);
  };

  React.useEffect(() => {
    if (!ripples.length) {
      return;
    }

    const timer = window.setTimeout(() => {
      setRipples((current) => current.slice(1));
    }, 650);

    return () => window.clearTimeout(timer);
  }, [ripples]);

  const sharedClassName = cn(
    buttonVariants({ variant }),
    "group relative overflow-hidden border-white/20 px-6 py-3 text-sm sm:text-base",
    className
  );

  const content = (
    <>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="pointer-events-none absolute rounded-full bg-white/40 animate-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size
          }}
        />
      ))}
    </>
  );

  if (href) {
    return (
      <Link className={sharedClassName} href={href} onClick={handleClick} rel={rel} target={target}>
        {content}
      </Link>
    );
  }

  return (
    <button className={sharedClassName} onClick={handleClick} type={type}>
      {content}
    </button>
  );
}

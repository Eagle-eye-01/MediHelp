"use client";

import { useEffect, useState } from "react";

type UseCountUpOptions = {
  start?: number;
  duration?: number;
  decimals?: number;
  enabled?: boolean;
};

export function useCountUp(
  target: number,
  optionsOrDuration: UseCountUpOptions | number = 1400,
  legacyEnabled = true
) {
  const isLegacySignature = typeof optionsOrDuration === "number";
  const options = isLegacySignature
    ? {
        start: 0,
        duration: optionsOrDuration,
        decimals: 0,
        enabled: legacyEnabled
      }
    : {
        start: 0,
        duration: 1400,
        decimals: 0,
        enabled: true,
        ...optionsOrDuration
      };

  const [value, setValue] = useState(options.start);

  useEffect(() => {
    if (!options.enabled) {
      setValue(options.start);
      return;
    }

    let frameId = 0;
    const startedAt = performance.now();

    const updateValue = (currentTime: number) => {
      const elapsed = currentTime - startedAt;
      const progress = Math.min(elapsed / options.duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const nextValue = options.start + (target - options.start) * eased;

      setValue(Number(nextValue.toFixed(options.decimals)));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(updateValue);
      }
    };

    frameId = window.requestAnimationFrame(updateValue);

    return () => window.cancelAnimationFrame(frameId);
  }, [options.decimals, options.duration, options.enabled, options.start, target]);

  return value;
}

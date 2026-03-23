"use client";

import { useEffect, useState } from "react";

type UseTypewriterOptions = {
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseMs?: number;
  loop?: boolean;
};

export function useTypewriter(
  phrases: string | string[],
  optionsOrSpeed: UseTypewriterOptions | number = 32,
  legacyStart = true
) {
  const [text, setText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const items = Array.isArray(phrases) ? phrases : [phrases];

    if (!items.length) {
      return;
    }

    if (typeof optionsOrSpeed === "number") {
      if (!legacyStart) {
        setText("");
        return;
      }

      const currentPhrase = items[0] ?? "";
      let currentIndex = 0;
      setText("");

      const interval = window.setInterval(() => {
        currentIndex += 1;
        setText(currentPhrase.slice(0, currentIndex));

        if (currentIndex >= currentPhrase.length) {
          window.clearInterval(interval);
        }
      }, optionsOrSpeed);

      return () => window.clearInterval(interval);
    }

    const { typeSpeed = 32, deleteSpeed = 18, pauseMs = 1600, loop = true } = optionsOrSpeed;
    const currentPhrase = items[phraseIndex] ?? "";

    if (!currentPhrase) {
      return;
    }

    if (!isDeleting && text === currentPhrase) {
      const pauseTimer = window.setTimeout(() => {
        if (loop || phraseIndex < items.length - 1) {
          setIsDeleting(true);
        }
      }, pauseMs);

      return () => window.clearTimeout(pauseTimer);
    }

    if (isDeleting && text.length === 0) {
      setIsDeleting(false);
      setPhraseIndex((current) => {
        if (!loop && current >= items.length - 1) {
          return current;
        }

        return (current + 1) % items.length;
      });
      return;
    }

    const timer = window.setTimeout(
      () => {
        setText((current) =>
          isDeleting
            ? currentPhrase.slice(0, Math.max(current.length - 1, 0))
            : currentPhrase.slice(0, current.length + 1)
        );
      },
      isDeleting ? deleteSpeed : typeSpeed
    );

    return () => window.clearTimeout(timer);
  }, [isDeleting, legacyStart, optionsOrSpeed, phraseIndex, phrases, text]);

  return text;
}

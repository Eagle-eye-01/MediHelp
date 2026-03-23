"use client";

import { useEffect, useRef, useState, type MutableRefObject } from "react";

type UseIntersectionOptions = IntersectionObserverInit & {
  freezeOnceVisible?: boolean;
};

type UseIntersectionResult<T extends Element> = [MutableRefObject<T | null>, boolean] & {
  ref: MutableRefObject<T | null>;
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | null;
};

export function useIntersection<T extends Element = HTMLDivElement>({
  threshold = 0.15,
  root = null,
  rootMargin = "0px",
  freezeOnceVisible = true
}: UseIntersectionOptions = {}): UseIntersectionResult<T> {
  const ref = useRef<T | null>(null);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node || (freezeOnceVisible && isIntersecting)) {
      return;
    }

    const observer = new IntersectionObserver(
      ([nextEntry]) => {
        setEntry(nextEntry);
        setIsIntersecting(nextEntry.isIntersecting);
      },
      {
        threshold,
        root,
        rootMargin
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [freezeOnceVisible, isIntersecting, root, rootMargin, threshold]);

  const result = [ref, isIntersecting] as UseIntersectionResult<T>;
  result.ref = ref;
  result.isIntersecting = isIntersecting;
  result.entry = entry;

  return result;
}

"use client";

import { animate, stagger, type AnimationParams } from "animejs";
import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Hook to trigger anime.js animation when element enters viewport
 */
export function useAnimeOnScroll<T extends HTMLElement>(
  animationConfig: AnimationParams,
  options: {
    threshold?: number;
    once?: boolean;
  } = {}
): RefObject<T | null> {
  const ref = useRef<T>(null);
  const hasAnimated = useRef(false);
  const { threshold = 0.2, once = true } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (once && hasAnimated.current) return;
            
            hasAnimated.current = true;
            animate(element, animationConfig);

            if (once) {
              observer.unobserve(element);
            }
          }
        });
      },
      { threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [animationConfig, threshold, once]);

  return ref;
}

/**
 * Hook to animate multiple elements with stagger effect on scroll
 */
export function useAnimeStaggerOnScroll<T extends HTMLElement>(
  selector: string,
  animationConfig: AnimationParams,
  staggerDelay: number = 100,
  options: {
    threshold?: number;
    once?: boolean;
  } = {}
): RefObject<T | null> {
  const containerRef = useRef<T>(null);
  const hasAnimated = useRef(false);
  const { threshold = 0.2, once = true } = options;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements = container.querySelectorAll(selector);
    if (elements.length === 0) return;

    // Set initial state
    elements.forEach((el) => {
      (el as HTMLElement).style.opacity = "0";
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (once && hasAnimated.current) return;

            hasAnimated.current = true;
            animate(elements, {
              delay: stagger(staggerDelay),
              ...animationConfig,
            });

            if (once) {
              observer.unobserve(container);
            }
          }
        });
      },
      { threshold }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, [selector, animationConfig, staggerDelay, threshold, once]);

  return containerRef;
}

/**
 * Hook for animated number counter
 */
export function useAnimeCounter(
  targetValue: number,
  options: {
    duration?: number;
    threshold?: number;
    separator?: string;
    suffix?: string;
    prefix?: string;
  } = {}
): { ref: RefObject<HTMLElement | null>; value: string } {
  const ref = useRef<HTMLElement>(null);
  const [displayValue, setDisplayValue] = useState("0");
  const hasAnimated = useRef(false);
  const {
    duration = 2000,
    threshold = 0.5,
    separator = ",",
    suffix = "",
    prefix = "",
  } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;

            const obj = { value: 0 };
            animate(obj, {
              value: targetValue,
              duration,
              easing: "easeOutExpo",
              round: 1,
              onUpdate: () => {
                const formatted = Math.round(obj.value)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, separator);
                setDisplayValue(`${prefix}${formatted}${suffix}`);
              },
            });

            observer.unobserve(element);
          }
        });
      },
      { threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [targetValue, duration, threshold, separator, suffix, prefix]);

  return { ref, value: displayValue };
}

/**
 * Hook for text reveal animation (character by character)
 */
export function useAnimeTextReveal<T extends HTMLElement>(
  text: string,
  options: {
    duration?: number;
    delay?: number;
    staggerDelay?: number;
    threshold?: number;
  } = {}
): RefObject<T | null> {
  const ref = useRef<T>(null);
  const hasAnimated = useRef(false);
  const {
    duration = 800,
    delay = 0,
    staggerDelay = 30,
    threshold = 0.5,
  } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Wrap each character in a span
    element.innerHTML = text
      .split("")
      .map(
        (char) =>
          `<span class="inline-block" style="opacity:0;transform:translateY(20px)">${
            char === " " ? "&nbsp;" : char
          }</span>`
      )
      .join("");

    const chars = element.querySelectorAll("span");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;

            animate(chars, {
              opacity: [0, 1],
              translateY: [20, 0],
              duration,
              delay: stagger(staggerDelay, { start: delay }),
              easing: "easeOutExpo",
            });

            observer.unobserve(element);
          }
        });
      },
      { threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [text, duration, delay, staggerDelay, threshold]);

  return ref;
}

/**
 * Hook for pulse animation on element
 */
export function useAnimePulse<T extends HTMLElement>(
  options: {
    scale?: number;
    duration?: number;
    loop?: boolean;
  } = {}
): RefObject<T | null> {
  const ref = useRef<T>(null);
  const { scale = 1.05, duration = 1500, loop = true } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const animation = animate(element, {
      scale: [1, scale, 1],
      duration,
      easing: "easeInOutSine",
      loop,
    });

    return () => {
      animation.pause();
    };
  }, [scale, duration, loop]);

  return ref;
}

/**
 * Utility function to create anime.js animation on demand
 */
export function createAnimation(
  targets: Parameters<typeof animate>[0],
  config: AnimationParams
) {
  return animate(targets, config);
}

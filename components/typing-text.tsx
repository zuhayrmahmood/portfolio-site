"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

const WORDS = [
  "software developer",
  "problem solver",
  "builder",
  "hooper",
  "motorcycle enthusiast",
];

// Read out naturally once for screen readers, instead of exposing the loop.
const WORDS_LIST =
  WORDS.length > 1
    ? `${WORDS.slice(0, -1).join(", ")}, and ${WORDS[WORDS.length - 1]}`
    : WORDS[0];

const CHAR_MS = 55; // typing speed, per character
const DELETE_MS = 30; // deleting speed, per character
const START_DELAY_MS = 350; // pause before the first word starts typing
const HOLD_MS = 1400; // pause once a word is fully typed, before deleting
const BETWEEN_MS = 300; // pause after deleting, before the next word starts

/**
 * Cycles through WORDS forever: type, hold, delete, next. The text node is
 * written to directly (like the glyph positions in <PhysicsHero>) rather
 * than through React state, since it updates far faster than a component
 * should re-render. Starts from WORDS[0] in the markup (visible for
 * no-JS/SSR); the reset to empty that kicks off the loop happens on mount
 * while the surrounding <Reveal> is still near-invisible, so it reads as
 * masked by that fade rather than a flash.
 */
export function TypingText() {
  const reduceMotion = useReducedMotion();
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el || reduceMotion) return;

    let wordIndex = 0;
    let charIndex = 0;
    let timer: number;

    const type = () => {
      charIndex++;
      el.textContent = WORDS[wordIndex].slice(0, charIndex);
      timer =
        charIndex < WORDS[wordIndex].length
          ? window.setTimeout(type, CHAR_MS)
          : window.setTimeout(erase, HOLD_MS);
    };

    const erase = () => {
      charIndex--;
      el.textContent = WORDS[wordIndex].slice(0, charIndex);
      if (charIndex > 0) {
        timer = window.setTimeout(erase, DELETE_MS);
      } else {
        wordIndex = (wordIndex + 1) % WORDS.length;
        timer = window.setTimeout(type, BETWEEN_MS);
      }
    };

    el.textContent = "";
    timer = window.setTimeout(type, START_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
      el.textContent = WORDS[0];
    };
  }, [reduceMotion]);

  return (
    <span className="text-foreground">
      <span aria-hidden="true" ref={textRef}>
        {WORDS[0]}
      </span>
      <span aria-hidden="true" className="type-caret" />
      <span className="sr-only">{WORDS_LIST}</span>
    </span>
  );
}
